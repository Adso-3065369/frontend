/**
 * @file Badge.js
 * @description Componente atómico para etiquetas de estado visuales.
 * @param {Object} props - Parámetros de configuración del componente.
 * @param {string} [props.text=''] - Texto principal a mostrar dentro de la etiqueta.
 * @param {'success'|'danger'|'warning'|'info'|'default'} [props.variant='default'] - Variante semántica que define la paleta de colores del componente.
 * @param {string} [props.className=''] - Cadena de texto con clases CSS adicionales para extender o sobreescribir estilos (ej. clases de Tailwind).
 * @param {string} [props.icon=''] - Cadena de texto con marcado HTML válido para inyectar un ícono junto al texto (ej. '<i class="ri-user-line"></i>').
 * @returns {string} Cadena de texto con el nodo HTML compilado (`<span class="...">...</span>`), listo para ser renderizado en el DOM.
 * @example
 * // Renderiza una etiqueta verde indicando éxito:
 * Badge({ text: 'Completado', variant: 'success', icon: '<i class="ri-check-line"></i>' })
 */
export const Badge = ({
    text = '',
    variant = 'default',   // success, danger, warning, info, default
    className = '',        // Clases adicionales opcionales
    icon = ''              // HTML del icono opcional
} = {}) => {
    
    // 1. Clases Base (Estructura de la píldora)
    const baseClasses = "inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors";

    // 2. Diccionario de Variantes Semánticas
    const variants = {
        success: "bg-green-100 text-green-800 border-green-200",
        danger: "bg-red-100 text-red-800 border-red-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        info: "bg-blue-800 text-blue-200",
        default: "bg-gray-100 text-gray-800 border-gray-200"
    };

    // 3. Resolución de la variante seleccionada
    const selectedVariant = variants[variant] || variants.default;

    // 4. Ensamblaje final de clases
    const finalClasses = `${baseClasses} ${selectedVariant} ${className}`.trim();

    // 5. Renderizado del elemento HTML (Retorno como String)
    return `
        <span class="${finalClasses}">
            ${icon ? `<span class="flex items-center justify-center">${icon}</span>` : ''}
            <span>${text}</span>
        </span>
    `;
};