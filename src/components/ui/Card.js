/**
 * @file Card.js
 * @description Componente atómico contenedor. Centraliza la estructura base de las superficies del sistema.
 * Implementa el patrón de diseño por variantes.
 * @param {Object} props - Diccionario de parámetros de configuración del componente.
 * @param {string} [props.children=''] - Contenido en formato de cadena HTML a inyectar dentro del cuerpo de la tarjeta.
 * @param {'default'|'solid'|'interactive'} [props.variant='default'] - Define la paleta de colores, sombras y comportamiento de interacción (ej. hover) del contenedor.
 * @param {string} [props.className=''] - Cadena con clases CSS adicionales (Tailwind) aplicadas al contenedor principal exterior.
 * @param {string} [props.bodyClass='p-6'] - Cadena con clases CSS adicionales aplicadas específicamente a la capa interna (padding/alineación).
 * @returns {string} Cadena de texto con el marcado HTML compilado (`<div class="...">...</div>`) listo para su inyección en el DOM.
 */
export const Card = ({
    children = '',
    variant = 'default',   // default, solid, interactive
    className = '',        // Clases adicionales para el contenedor principal
    bodyClass = 'p-6'      // Clases específicas para el espaciado interno
} = {}) => {
    
    // 1. Clases Base (Estructura y comportamiento fluido)
    const baseClasses = "rounded-xl overflow-hidden transition-all flex flex-col";

    // 2. Diccionario de Variantes (Ajustado al esquema de alto contraste)
    const variants = {
        default: "bg-bg-surface border border-gray-800 shadow-sm",
        solid: "bg-bg-base border border-gray-850 shadow-inner",
        interactive: "bg-bg-surface border border-gray-800 shadow-sm hover:border-brand cursor-pointer"
    };

    // 3. Resolución de la variante seleccionada
    const selectedVariant = variants[variant] || variants.default;

    // 4. Ensamblaje final de clases principales
    const finalClasses = `${baseClasses} ${selectedVariant} ${className}`.trim();

    // 5. Ensamblaje de clases internas del cuerpo
    const finalBodyClasses = `flex-grow h-full flex flex-col ${bodyClass}`.trim();

    // 6. Renderizado del elemento HTML
    return `
        <div class="${finalClasses}">
            <div class="${finalBodyClasses}">
                ${children}
            </div>
        </div>
    `;
};