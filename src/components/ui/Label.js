/**
 * @file label.js
 * @description Componente UI para etiquetas de formulario (Vanilla JS).
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.text=''] - Texto descriptivo de la etiqueta.
 * @param {string} props.htmlFor - ID del elemento de formulario asociado.
 * @param {string} [props.variant='primary'] - Variante visual del componente.
 * @param {string} [props.size='md'] - Tamaño del componente.
 * @param {boolean} [props.disabled=false] - Define si la etiqueta debe lucir deshabilitada.
 * @param {Object} [props.dataset={}] - Objeto con datos para delegación de eventos y estado (data-*).
 * @returns {string} Cadena de texto con el HTML válido del componente.
 */
export const Label = ({
    text = '',
    htmlFor = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    dataset = {}
} = {}) => {
    // Bloque 1: baseClasses
    const baseClasses = "inline-block font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    // Bloque 2: variants
    const variants = {
        primary: "text-brand-900",
        secondary: "text-gray-700",
        danger: "text-red-600",
        success: "text-green-600",
        ghost: "text-gray-500 hover:text-gray-900",
        "outline-primary": "text-brand-primary",
        "outline-secondary": "text-brand-secondary",
        "outline-danger": "text-red-600",
        "outline-success": "text-green-600"
    };

    // Bloque 3: sizes
    const sizes = {
        sm: "text-xs mb-1",
        md: "text-sm mb-1.5",
        lg: "text-base mb-2"
    };

    // Bloque 4: Resolución en finalClasses
    const currentVariant = variants[variant] || variants.primary;
    const currentSize = sizes[size] || sizes.md;
    const finalClasses = `${baseClasses} ${currentVariant} ${currentSize}`.replace(/\s+/g, ' ').trim();

    // Bloque 5: Resolución de atributos HTML y mapeo de dataset
    const datasetString = Object.entries(dataset)
        .map(([key, value]) => `data-${key}="${value}"`)
        .join(' ');
        
    const forAttr = htmlFor ? `for="${htmlFor}"` : '';
    const disabledAttr = disabled ? 'disabled' : '';

    // Bloque 6: Retorno de HTML condicional
    if (!text) return '';

    return `
        <label 
            class="${finalClasses}" 
            ${forAttr} 
            ${disabledAttr} 
            ${datasetString}
        >
            ${text}
        </label>
    `.trim();
};