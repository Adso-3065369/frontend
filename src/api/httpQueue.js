/**
 * @file httpQueue.js
 * @description Administrador de estado para la concurrencia de peticiones.
 * Evita Race Conditions cuando múltiples peticiones detectan un Token expirado al mismo tiempo.
 */
import { handleResponse } from './httpUtils.js';

let isRefreshing = false;
let failedQueue = [];

export const checkIsRefreshing = () => isRefreshing;
export const setIsRefreshing = (status) => { isRefreshing = status; };

/**
 * Libera las peticiones pausadas inyectando el nuevo token exitoso.
 */
export const resolveQueue = (newToken) => {
    failedQueue.forEach(prom => prom.resolve(newToken));
    failedQueue = [];
};

/**
 * Rechaza todas las peticiones pausadas si la renovación fracasó.
 */
export const rejectQueue = (error) => {
    failedQueue.forEach(prom => prom.reject(error));
    failedQueue = [];
};

/**
 * Pausa una petición, la almacena en memoria y la reintenta automáticamente
 * cuando la promesa sea resuelta con un nuevo token.
 */
export const enqueueRequest = (url, options) => {
    return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
    }).then(newToken => {
        options.headers['Authorization'] = `Bearer ${newToken}`;
        return fetch(url, options).then(handleResponse);
    });
};