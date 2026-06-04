/**
 * @file Checkbox.js
 * @description Componente atómico para casillas de verificación ajustado a modo oscuro.
 * Implementa la utilidad accent-color para forzar el renderizado nativo sobre esquemas oscuros.
 * * @param {Object} props - Diccionario de parámetros de configuración del componente.
 * @param {string} [props.id=''] - Identificador único (`id`) para el input nativo, necesario para la accesibilidad del label.
 * @param {string} [props.name=''] - Atributo `name` para identificar el campo en la recolección de datos (FormData).
 * @param {string} [props.value=''] - Valor intrínseco del campo enviado al servidor cuando está seleccionado.
 * @param {string} [props.label=''] - Texto principal descriptivo de la casilla.
 * @param {string} [props.description=''] - Texto secundario opcional para añadir contexto, renderizado bajo el label.
 * @param {boolean} [props.checked=false] - Atributo booleano que determina el estado de selección inicial de la casilla.
 * @param {'brand'|'danger'|'success'} [props.variant='brand'] - Variante semántica que altera el color de acento (`accent-color`) y los estados interactivos (`hover`).
 * @param {string} [props.className=''] - Clases CSS (Tailwind) adicionales para inyectar en el contenedor exterior (`<label>`).
 * * @returns {string} Cadena de texto con el marcado HTML compilado (`<label>...</label>`) listo para inyección en el DOM.
 */
export const Checkbox = ({
    id = '',
    name = '',
    value = '',
    label = '',
    description = '',
    checked = false,
    variant = 'brand',
    className = ''
} = {}) => {
    
    // 1. Clases Base (Ajustadas a alto contraste y con w-full para rellenar la celda del grid)
    const baseContainer = "flex items-start gap-3 p-4 border border-gray-800 rounded-xl cursor-pointer transition-all duration-200 group bg-bg-surface hover:bg-bg-hover w-full";
    const baseInput = "w-5 h-5 border-gray-700 bg-bg-base rounded cursor-pointer transition-colors mt-0.5 focus:ring-offset-bg-surface shrink-0";
    const baseLabel = "text-sm font-bold transition-colors text-white break-words";

    // 2. Diccionario de Variantes (Inyección de accent-* para control nativo del DOM)
    const variants = {
        brand: {
            input: "text-brand focus:ring-brand accent-brand",
            label: "group-hover:text-brand"
        },
        danger: {
            input: "text-red-500 focus:ring-red-500 accent-red-500",
            label: "group-hover:text-red-400"
        },
        success: {
            input: "text-green-500 focus:ring-green-500 accent-green-500",
            label: "group-hover:text-green-400"
        }
    };

    const selectedVariant = variants[variant] || variants.brand;

    const idAttr = id ? `id="${id}"` : '';
    const checkedAttr = checked ? 'checked' : '';

    return `
        <label class="${baseContainer} ${className}">
            <div class="flex items-center h-5">
                <input type="checkbox" ${idAttr} name="${name}" value="${value}" ${checkedAttr}
                    class="${baseInput} ${selectedVariant.input}">
            </div>
            
            <div class="flex flex-col flex-1 min-w-0">
                <span class="${baseLabel} ${selectedVariant.label}">
                    ${label}
                </span>
                
                ${description ? `
                    <span class="text-xs text-text-secondary mt-1 leading-snug break-words">
                        ${description}
                    </span>
                ` : ''}
            </div>
        </label>
    `;
};