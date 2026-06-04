/**
 * @file HomeController.js
 * @version 1.0.0
 * @description Capa de comportamiento. Asigna eventos y maneja la lógica de la vista Home.
 * Se ejecuta estrictamente después del montaje de la vista en el DOM.
 */

export const HomeController = () => {
    // 1. Captura de elementos del DOM
    const actionButton = document.getElementById('btn-action');
    const statusMessage = document.getElementById('status-message');

    // 2. Validación de existencia para evitar errores de referencia (Null reference)
    if (!actionButton || !statusMessage) {
        console.warn("HomeController: No se encontraron los elementos en el DOM.");
        return;
    }

    // 3. Asignación de eventos
    actionButton.addEventListener('click', () => {
        statusMessage.textContent = "¡Evento procesado mediante un controlador independiente!";
        statusMessage.classList.replace('text-gray-600', 'text-green-600');
        statusMessage.classList.add('font-bold');
    });
};