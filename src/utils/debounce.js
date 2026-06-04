/**
 * Retrasa la ejecución de una función hasta que haya pasado 
 * un tiempo de inactividad específico.
 * @param {Function} func - La función a ejecutar.
 * @param {number} delay - Tiempo de espera en milisegundos.
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};