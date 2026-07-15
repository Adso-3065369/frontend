/**
 * @file NotFoundView.js
 * @version 1.0.0
 * @description Vista de error genérica para rutas no encontradas (404).
 * @returns {Promise<string>} Cadena de texto con el marcado HTML.
 */

export const NotFoundView = async () => {
    return `
            <section class="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 noise-bg grid-pattern">
                <!-- 1. Número 404 con opacidad baja o color mutado sobre el fondo oscuro -->
                <h1 class="text-9xl font-black text-bg-hover text-primary-glow font-display">404</h1>
                
                <!-- 2. Título principal usando el color semántico de texto claro -->
                <p class="text-2xl font-bold tracking-tight text-text-primary sm:text-4xl mt-4 font-body">
                    Ruta no localizada
                </p>
                
                <!-- 3. Descripción secundaria usando el color de texto mutado -->
                <p class="mt-4 text-text-secondary max-w-md font-body">
                    El recurso o la vista que intenta consultar no se encuentra disponible en el diccionario de rutas.
                </p>

                <!-- 4. Botón opcional de retorno alineado a la nueva UI con el amarillo de la marca -->
                <a href="/" class="mt-8 bg-primary hover:bg-primary-dark text-bg-base font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer font-body">
                    Volver al Dashboard
                </a>
            </section>
        `;
};
