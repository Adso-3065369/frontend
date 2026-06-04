/**
 * @file httpClient.js
 * @description Orquestador del cliente HTTP. 
 * Intercepta respuestas 401 y delega el flujo de renovación a los submódulos.
 */
import { AuthService } from '@/services';
import { API_BASE_URL, getHeaders, handleResponse } from './httpUtils.js';
import { checkIsRefreshing, setIsRefreshing, resolveQueue, rejectQueue, enqueueRequest } from './httpQueue.js';

/**
 * Ejecuta el ciclo de reintentos para renovar la sesión contra el servidor.
 * @param {string} refreshToken 
 * @returns {Promise<string|null>} El nuevo Access Token o null si el token expiró.
 */
const executeRefreshCycle = async (refreshToken) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    while (attempts < MAX_ATTEMPTS) {
        try {
            attempts++;
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            // Si el backend dictamina un 401 explícito, el token fue revocado (Forzar Logout)
            if (response.status === 401 || response.status === 403) return null;

            if (response.ok) {
                const json = await response.json();
                if (json.success && json.data.accessToken) {
                    AuthService.updateTokens(json.data.accessToken, json.data.refreshToken);
                    return json.data.accessToken;
                }
            } else {
                // Es un error 500 (Base de datos inactiva). Lanzamos error para entrar al catch y reintentar.
                throw new Error(`Error de servidor al refrescar: ${response.status}`);
            }
        } catch (error) {
            console.warn(`[Refresh] Intento ${attempts} fallido por error de red/servidor:`, error);
            if (attempts < MAX_ATTEMPTS) await new Promise(res => setTimeout(res, 1000));
        }
    }
    
    // Si agotamos los intentos por error 500 o sin internet, lanzamos excepción.
    // NUNCA retornamos null aquí, porque null significa "borrar la sesión".
    throw new Error("No se pudo contactar al servidor para renovar la sesión. Verifique su conexión o intente en un momento.");
};

/**
 * Interceptor principal expuesto para los Repositorios.
 */
export const httpClient = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}/${endpoint}`;
    options.headers = getHeaders();
    
    let response = await fetch(url, options);
    const isAuthRoute = url.includes('/auth/');

    // Fase de Intercepción de Seguridad
    if (response.status === 401 && !isAuthRoute) {
        const refreshToken = AuthService.getRefreshToken();
        
        if (!refreshToken) {
            AuthService.logout();
            throw new Error("Sesión expirada o no encontrada.");
        }

        if (checkIsRefreshing()) {
            return enqueueRequest(url, options);
        }

        setIsRefreshing(true);
        let newAccessToken = null;
        
        try {
            newAccessToken = await executeRefreshCycle(refreshToken);
        } catch (networkError) {
            // Si falla por red o servidor 500, liberamos el candado 
            // y rechazamos la cola, pero NO cerramos la sesión del usuario.
            setIsRefreshing(false);
            rejectQueue(networkError);
            throw networkError; 
        }

        setIsRefreshing(false);

        if (newAccessToken) {
            resolveQueue(newAccessToken);
            options.headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(url, options);
        } else {
            // Entra aquí SOLO si executeRefreshCycle devolvió 'null' (Error 401 genuino)
            rejectQueue(new Error("Fallo crítico de autenticación"));
            AuthService.logout();
            throw new Error("Su sesión ha expirado por inactividad. Por favor, inicie sesión nuevamente.");
        }
    }

    // Fase de Transferencia de Datos
    return handleResponse(response);
};