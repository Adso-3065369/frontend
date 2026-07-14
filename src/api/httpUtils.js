/**
 * @file httpUtils.js
 * @description Utilidades puras para la configuración de red y procesamiento de cabeceras.
 */
import { AuthService } from '@/services';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Construye las cabeceras estándar e inyecta el token de acceso.
 * @returns {HeadersInit}
 */
export const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    const token = AuthService.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    return headers;
};

/**
 * Estandariza la respuesta del servidor y lanza excepciones ante fallos lógicos o de red.
 * Preserva la estructura del DTO de errores para el feedback visual en formularios.
 * Maneja de forma segura respuestas sin cuerpo (304 Not Modified, 204 No Content).
 * @param {Response} response 
 * @returns {Promise<Object>}
 */
export const handleResponse = async (response) => {
    // Verificamos primero si la respuesta tiene contenido para parsear.
    // HTTP 204 (No Content) y 304 (Not Modified) tienen cuerpo vacío por especificación HTTP.
    // Llamar response.json() sobre un cuerpo vacío lanza SyntaxError: Unexpected end of JSON input.
    const contentType = response.headers.get('content-type');
    const hasBody = contentType && contentType.includes('application/json');

    // Si no hay cuerpo JSON o es una respuesta sin contenido, retornamos un objeto vacío de éxito.
    if (!hasBody || response.status === 204 || response.status === 304) {
        if (!response.ok) {
            // Si el status indica error (ej. 304 llegó como error) lanzamos con el código recibido
            const error = new Error(`Error de comunicación HTTP: ${response.status}`);
            error.response = { status: response.status, data: {} };
            throw error;
        }
        // Retornamos un objeto de éxito vacío para que el flujo del repositorio no se rompa
        return { success: true, data: null };
    }

    // Intentamos parsear el cuerpo JSON de la respuesta del servidor
    let json;
    try {
        json = await response.json();
    } catch {
        // Si el parseo falla (cuerpo malformado o vacío inesperado), lanzamos un error descriptivo
        const error = new Error(`Respuesta inválida del servidor (HTTP ${response.status})`);
        error.response = { status: response.status, data: {} };
        throw error;
    }
    
    if (json.success === false || !response.ok) {
        // 1. Instanciamos el error con el mensaje principal de la API
        const error = new Error(json.message || `Error de comunicación HTTP: ${response.status}`);
        
        // 2. Blindamos el objeto inyectando la respuesta estructurada (Contrato de red)
        error.response = {
            status: response.status,
            data: json
        };        
        
        // 3. Lanzamos la excepción enriquecida
        throw error;
    }    
    
    return json; 
};