/**
 * @file Modal.js
 * @description Componente Modal con soporte para animaciones de entrada y salida fluidas.
 */
export const Modal = ({
    id = '',
    title = '',
    content = '',
    size = 'md',
    isOpen = false,
    closeOnBackdrop = true
} = {}) => {
    
    if (!id) return '';

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        '2xl': 'max-w-6xl',
        full: 'max-w-[95vw] h-[95vh]'
    };

    const selectedSize = sizes[size] || sizes.md;
    const displayClass = isOpen ? 'flex' : 'hidden';
    const backdropAction = closeOnBackdrop ? `data-modal-close="${id}"` : '';

    return `
        <div id="${id}" class="fixed inset-0 z-50 ${displayClass} opacity-0 transition-opacity duration-300 ease-in-out items-center justify-center">
            
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" ${backdropAction}></div>

            <div id="${id}-panel" class="relative bg-bg-surface border border-gray-700 rounded-2xl w-full ${selectedSize} mx-4 shadow-2xl flex flex-col max-h-[90vh] scale-95 transition-transform duration-300 ease-in-out">
                
                <div class="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-white">${title}</h3>
                    <button type="button" data-modal-close="${id}" class="text-text-secondary hover:text-white transition-colors outline-none focus:ring-2 focus:ring-brand rounded">
                        <i class="ri-close-line text-2xl"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
                    ${content}
                </div>
            </div>
        </div>
    `;
};