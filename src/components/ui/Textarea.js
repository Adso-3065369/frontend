/**
 * @file textarea.js
 * @description Componente UI para área de texto multilínea (Vanilla JS).
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.name=''] - Nombre identificador del textarea.
 * @param {string} [props.value=''] - Valor inicial del área de texto.
 * @param {string} [props.placeholder=''] - Texto descriptivo del campo vacío.
 * @param {number} [props.rows=3] - Cantidad de filas visibles.
 * @param {string} [props.variant='primary'] - Variante visual del componente.
 * @param {string} [props.size='md'] - Tamaño del componente.
 * @param {boolean} [props.disabled=false] - Define si el campo está deshabilitado.
 * @param {Object} [props.dataset={}] - Objeto con datos para delegación de eventos y estado (data-*).
 * @returns {string} Cadena de texto con el HTML válido del componente.
 */
export const Textarea = ({
    id = '',
    label = '',
    name = '',
    value = '',
    placeholder = '',
    rows = 3,
    variant = 'primary',
    size = 'md',
    required = false,
    disabled = false,
    dataset = {}
} = {}) => {
    // Bloque 1: baseClasses
    const baseClasses = "w-full rounded-md border font-medium transition-colors duration-200 outline-none resize-y disabled:bg-bg-hover disabled:text-text-secondary disabled:border-gray-700 disabled:cursor-not-allowed";

    // Bloque 2: variants
    const variants = {
        primary: "border-brand bg-brand-primary/5 text-brand-primary placeholder:text-white/50 focus:border-brand focus:ring-2 focus:ring-brand/30",
        secondary: "border border-gray-700 bg-transparent text-text-primary placeholder-text-secondary focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/30",
        danger: "border border-red-500 bg-transparent text-text-primary focus:border-red-500 focus:ring-2 focus:ring-red-500/30 placeholder-red-300",
        success: "border border-green-500 bg-transparent text-text-primary focus:border-green-500 focus:ring-2 focus:ring-green-500/30",
        ghost: "border-transparent bg-transparent text-text-primary placeholder-text-secondary hover:bg-bg-hover focus:bg-bg-surface focus:ring-2 focus:ring-brand-primary/30",
        "outline-primary": "border-2 border-brand-primary bg-transparent text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-brand-primary/30",
        "outline-secondary": "border-2 border-brand-secondary bg-transparent text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-brand-secondary/30",
        "outline-danger": "border-2 border-red-500 bg-transparent text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-red-500/30",
        "outline-success": "border-2 border-green-500 bg-transparent text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-green-500/30"
    };

    // Bloque 3: sizes
    const sizes = {
        sm: "py-1.5 px-2 text-xs rounded-sm",
        md: "py-2 px-3 text-sm rounded-md",
        lg: "py-3 px-4 text-base rounded-lg"
    };

    // Bloque 4: Resolución en finalClasses
    const currentVariant = variants[variant] || variants.primary;
    const currentSize = sizes[size] || sizes.md;
    const finalClasses = `${baseClasses} ${currentVariant} ${currentSize}`.replace(/\s+/g, ' ').trim();

    // Bloque 5: Resolución de atributos HTML y mapeo de dataset
    const datasetString = Object.entries(dataset)
        .map(([key, val]) => `data-${key}="${val}"`)
        .join(' ');
        
    const idAttr = id ? `id="${id}"` : '';
    const nameAttr = name ? `name="${name}"` : '';
    const placeholderAttr = placeholder ? `placeholder="${placeholder}"` : '';
    const rowsAttr = `rows="${rows}"`;
    const requiredAttr = required ? 'required' : '';
    const disabledAttr = disabled ? 'disabled' : '';

    const labelHTML = label
        ? `<label ${id ? `for="${id}"` : ''} class="block text-sm font-medium text-text-primary mb-1">
                ${label}${required ? ' <span class="text-red-500">*</span>' : ''}
            </label>`
        : '';

    // Bloque 6: Retorno de HTML condicional
    return `
        ${labelHTML}
        <textarea 
            ${idAttr}
            ${nameAttr} 
            class="${finalClasses}" 
            ${rowsAttr} 
            ${placeholderAttr} 
            ${requiredAttr}
            ${disabledAttr} 
            ${datasetString}
        >${value}</textarea>
    `.trim();
};