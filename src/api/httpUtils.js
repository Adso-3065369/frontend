/**
 * @file httpUtils.js
 * @description Utilidades puras para la configuración de red y procesamiento de cabeceras.
 */
import { AuthService } from '@/services';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.0.101.187:3001/api';

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
 * @param {Response} response 
 * @returns {Promise<Object>}
 */
export const handleResponse = async (response) => {
    const json = await response.json();
    
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