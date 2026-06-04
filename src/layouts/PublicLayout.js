/**
 * @file PublicLayout.js
 * @version 1.0.0
 * @description Estructura base para usuarios no autenticados (Invitados).
 */

export const PublicLayout = (viewContent) => {
    return `
        <div class="flex-grow flex items-center justify-center p-4">
            ${viewContent}
        </div>
    `;
};