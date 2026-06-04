import { httpClient } from '@/api/httpClient.js';

/**
 * @file baseRepository.js
 * @description Repositorio genérico puramente transaccional.
 * Delega la complejidad de red al httpClient.
 */
export const createRepository = (resource) => {
    return {
        getAll: (params = '') => {
            return httpClient(`${resource}${params}`, { method: 'GET' });
        },
        
        getById: (id, params = '') => {
            return httpClient(`${resource}/${id}${params}`, { method: 'GET' });
        },
        
        create: (data) => {
            return httpClient(resource, { method: 'POST', body: JSON.stringify(data) });
        },
        
        update: (id, data) => {
            return httpClient(`${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        
        delete: (id) => {
            return httpClient(`${resource}/${id}`, { method: 'DELETE' });
        }
    };
};