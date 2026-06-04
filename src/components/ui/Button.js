/**
 * @file Button.js
 * @description Componente atómico de Botón utilizando utilidades de Tailwind CSS.
 * Extendido para soportar variantes outline, proporciones cuadradas para iconos
 * y la integración del color corporativo (brand).
 * * @param {Object} props - Diccionario de parámetros de configuración del componente.
 * @param {string} [props.text=''] - Texto principal a mostrar dentro del botón.
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Tipo de comportamiento nativo del botón en el DOM (formularios).
 * @param {'primary'|'secondary'|'danger'|'success'|'ghost'|'outline-primary'|'outline-secondary'|'outline-danger'|'outline-success'} [props.variant='primary'] - Define la paleta de colores y el estilo del borde/fondo.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Proporción estructural del botón (afecta el padding y el tamaño de la fuente).
 * @param {string} [props.id=''] - Atributo global `id` único para el nodo HTML.
 * @param {string} [props.className=''] - Clases CSS de utilidad adicionales (Tailwind) para sobrescribir o extender el diseño base.
 * @param {boolean} [props.disabled=false] - Determina si el botón debe estar inactivo y aplicar opacidad visual.
 * @param {string} [props.icon=''] - Marcado HTML válido para inyectar un elemento gráfico (ej. `<i class="ri-add-line"></i>`).
 * @param {Object<string, string|number>} [props.dataset={}] - Mapa de pares clave-valor para inyectar atributos `data-*` (útil para delegación de eventos).
 * * @returns {string} Cadena de texto con el marcado HTML compilado (`<button ...>...</button>`) listo para inyección en el DOM.
 */
export const Button = ({
    text = '',
    type = 'button',       
    variant = 'primary',   
    size = 'md',           
    id = '',
    className = '',        
    disabled = false,
    icon = '',             
    dataset = {}           
} = {}) => {
    
    // 1. Clases Base
    const baseClasses = "inline-flex items-center justify-center gap-2 cursor-pointer font-bold rounded-lg border transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

    // 2. Diccionario de Variantes Visuales
    const variants = {
        primary: "bg-brand text-gray-900 border-transparent hover:opacity-90 focus:ring-brand",
        secondary: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 focus:ring-gray-500",
        danger: "bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500",
        success: "bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500",
        ghost: "bg-transparent text-gray-400 border-transparent hover:bg-bg-hover hover:text-white focus:ring-gray-500",
        'outline-primary': "bg-transparent border-brand text-brand hover:bg-brand/10 focus:ring-brand",
        'outline-secondary': "bg-transparent border-gray-500 text-gray-400 hover:bg-gray-800 hover:text-white focus:ring-gray-500",
        'outline-danger': "bg-transparent border-red-500 text-red-500 hover:bg-red-500/10 focus:ring-red-500",
        'outline-success': "bg-transparent border-green-500 text-green-500 hover:bg-green-500/10 focus:ring-green-500"
    };

    // 3. Diccionario de Tamaños
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    // 4. Resolución de clases
    const selectedVariant = variants[variant] || variants.primary;
    const selectedSize = sizes[size] || sizes.md;
    const finalClasses = `${baseClasses} ${selectedVariant} ${selectedSize} ${className}`.trim();

    // 5. Resolución de atributos
    const idAttr = id ? `id="${id}"` : '';
    const disabledAttr = disabled ? 'disabled' : '';
    const dataAttrs = Object.entries(dataset).map(([key, value]) => `data-${key}="${value}"`).join(' ');

    // 6. Renderizado Condicional del Template
    return `
        <button type="${type}" class="${finalClasses}" ${idAttr} ${disabledAttr} ${dataAttrs}>
            ${icon ? `<span>${icon}</span>` : ''}
            ${text ? `<span>${text}</span>` : ''}
        </button>
    `;
};