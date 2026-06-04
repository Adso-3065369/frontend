/**
 * @file AuthService.js
 * @version 4.0.0
 * @description Gestión centralizada de la sesión (JWT, Roles y Permisos).
 * Elimina las "Magic Strings" usando un diccionario de constantes para las llaves de almacenamiento.
 */

// 1. DICCIONARIO DE CONSTANTES (Single Source of Truth)
export const AUTH_KEYS = {
    IS_AUTHORIZED: 'isAuthorized',
    USER_DATA: 'authUser',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken'
};

export const AuthService = {
    /**
     * Efectúa el inicio de sesión almacenando el usuario y sus tokens.
     */
    login: (user, accessToken, refreshToken) => {
        localStorage.setItem(AUTH_KEYS.IS_AUTHORIZED, 'true');
        localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(user));
        
        if (accessToken) localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
        if (refreshToken) localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
    },

    /**
     * Actualiza únicamente los tokens (Ideal para el proceso de Refresh Token).
     */
    updateTokens: (accessToken, refreshToken) => {
        if (accessToken) localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
        if (refreshToken) localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
    },

    /**
     * Verifica si existe una sesión activa y un token válido.
     */
    isLoggedIn: () => {
        const isAuth = localStorage.getItem(AUTH_KEYS.IS_AUTHORIZED) === 'true';
        const hasToken = !!localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
        return isAuth && hasToken;
    },

    /**
     * Obtiene los datos del usuario autenticado (incluyendo roles y permisos).
     */
    getUser: () => {
        try {
            const user = localStorage.getItem(AUTH_KEYS.USER_DATA);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error al parsear datos de sesión:", error);
            return null;
        }
    },

    /**
     * Recupera el token de acceso actual.
     */
    getToken: () => localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN),

    /**
     * Recupera el token de renovación actual.
     */
    getRefreshToken: () => localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN),

    /**
     * Elimina todos los rastros de la sesión iterando sobre las constantes
     * y redirige al formulario de acceso.
     */
    logout: () => {
        // Limpiamos dinámicamente todas las llaves registradas en AUTH_KEYS
        Object.values(AUTH_KEYS).forEach(key => localStorage.removeItem(key));
        
        window.location.hash = '#/login';
    }
};