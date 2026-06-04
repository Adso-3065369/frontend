/**
 * @file NotFoundView.js
 * @version 1.0.0
 * @description Vista de error genérica para rutas no encontradas (404).
 * @returns {Promise<string>} Cadena de texto con el marcado HTML.
 */

export const NotFoundView = async () => {
    return `
        <section class="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
            <h1 class="text-9xl font-black text-gray-200">404</h1>
            <p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-4">
                Ruta no localizada
            </p>
            <p class="mt-4 text-gray-500">
                El recurso o la vista que intenta consultar no se encuentra disponible en el diccionario de rutas.
            </p>
        </section>
    `;
};