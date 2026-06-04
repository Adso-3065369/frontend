/**
 * @file Dropdown.js
 * @version 4.0.0
 * @description Componente atómico genérico para menús desplegables.
 * Totalmente tonto: inyecta el contenido dinámico provisto por la vista.
 */
export const Dropdown = ({
    id = '',
    trigger = '',
    content = '',
    variant = 'ghost',      // ghost, solid, none
    placement = 'right',    // right (se alinea a la derecha), left (se alinea a la izquierda)
    className = ''
} = {}) => {
    
    // 1. Clases base del botón disparador
    const baseTriggerClasses = "flex items-center gap-2 transition-all duration-200 focus:outline-none rounded-xl cursor-pointer";

    // 2. Variantes de estilo para el disparador
    const variants = {
        ghost: "p-2 bg-transparent hover:bg-bg-hover text-text-secondary hover:text-white",
        solid: "px-4 py-2 bg-bg-surface border border-gray-800 hover:border-brand text-white shadow-sm",
        none: "" // Variante limpia sin bordes ni padding extra
    };

    const finalTriggerClasses = `${baseTriggerClasses} ${variants[variant] || variants.ghost}`.trim();
    
    // 3. Control de alineación del panel flotante
    const placementClass = placement === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left';

    return `
        <div class="relative inline-block text-left ${className}" id="${id}-container">
            
            <button type="button" id="${id}-trigger" class="${finalTriggerClasses}" aria-expanded="false" aria-haspopup="true">
                ${trigger}
            </button>

            <div id="${id}-menu" class="hidden absolute ${placementClass} mt-2 w-56 bg-bg-surface border border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden transform transition-all">
                <div class="flex flex-col">
                    ${content}
                </div>
            </div>
            
        </div>
    `;
};