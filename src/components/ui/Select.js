/**
 * @file Select.js
 * @description Componente atómico para campos de selección desplegables.
 * Adaptado para el esquema de alto contraste.
 */

export const Select = ({
    label = '',
    id = '',
    name = '',
    options = [],          // Arreglo esperado: [{ value: '1', text: 'Opción 1' }]
    placeholder = 'Seleccione una opción...',
    required = false,
    disabled = false,
    variant = 'default',   // default, error, success
    className = '',        // Clases adicionales de posicionamiento
    helperText = '',
    dataset = {}           // Atributos data-* dinámicos
} = {}) => {
    
    // 1. Clases Base (Superficie oscura y estados inactivos mitigados)
    const baseClasses = "w-full px-4 py-2.5 border rounded-lg outline-none transition-all appearance-none cursor-pointer disabled:bg-bg-base disabled:opacity-60 disabled:cursor-not-allowed";

    // 2. Diccionario de Variantes (Control cromático sobre fondos oscuros)
    const variants = {
        default: "border-gray-800 bg-bg-surface text-white focus:ring-1 focus:ring-brand focus:border-brand",
        error: "border-red-500 bg-bg-surface text-white focus:ring-1 focus:ring-red-500 focus:border-red-500",
        success: "border-green-500 bg-bg-surface text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
    };

    // 3. Resolución de Atributos
    const selectedVariant = variants[variant] || variants.default;
    const finalClasses = `${baseClasses} ${selectedVariant} ${className}`.trim();
    
    const requiredAttr = required ? 'required' : '';
    const disabledAttr = disabled ? 'disabled' : '';
    
    const dataAttrs = Object.entries(dataset)
        .map(([key, value]) => `data-${key}="${value}"`)
        .join(' ');

    // 4. Construcción Declarativa de Opciones (Protección contra destellos blancos)
    const placeholderOption = `<option value="" disabled ${!options.some(opt => opt.selected) ? 'selected' : ''} class="bg-bg-surface text-text-secondary">${placeholder}</option>`;
    
    const optionsHtml = options.map(opt => `
        <option value="${opt.value}" ${opt.selected ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''} class="bg-bg-surface text-white">
            ${opt.text}
        </option>
    `).join('');

    // 5. Ensamblaje del Componente
    return `
        <div class="flex flex-col w-full">
            ${label ? `
                <label for="${id}" class="block text-sm font-bold text-white mb-2">
                    ${label} ${required ? '<span class="text-brand">*</span>' : ''}
                </label>
            ` : ''}
            
            <div class="relative">
                <select 
                    id="${id}" 
                    name="${name}" 
                    class="${finalClasses}"
                    ${requiredAttr} 
                    ${disabledAttr} 
                    ${dataAttrs}
                >
                    ${placeholderOption}
                    ${optionsHtml}
                </select>
                
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>

            ${helperText ? `<p class="mt-1 text-xs text-text-secondary">${helperText}</p>` : ''}
            
            <div id="error-${id}" class="text-red-400 text-xs mt-1 font-bold hidden"></div>
        </div>
    `;
};