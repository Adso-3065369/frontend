import { Button } from './Button.js'; // Ajuste la ruta según su estructura interna

/**
 * @file Pagination.js
 * @description Componente de UI estandarizado para la navegación de datos paginados.
 * @param {Object} props.meta - Metadatos de paginación devueltos por el backend.
 * @param {string} [props.itemName='registros'] - Etiqueta dinámica para el total de ítems.
 */
export const Pagination = ({ meta, itemName = 'registros' }) => {
    // Fail-fast: Si no hay metadatos o solo hay una página, no se renderiza nada
    if (!meta || meta.lastPage <= 1) return '';

    return `
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-700/50 bg-gray-800/20 sm:px-6 mt-4 rounded-b-lg">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-400">
                        Mostrando página <span class="font-medium text-white">${meta.currentPage}</span> de 
                        <span class="font-medium text-white">${meta.lastPage}</span> 
                        (Total: ${meta.totalItems} ${itemName})
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        ${Button({
                            text: 'Anterior',
                            icon: '<i class="ri-arrow-left-s-line text-lg"></i>',
                            variant: 'outline-secondary',
                            disabled: !meta.prevPage,
                            dataset: { action: 'paginate', page: meta.prevPage },
                            className: 'rounded-r-none rounded-l-md focus:z-10 bg-gray-800/50'
                        })}
                        ${Button({
                            text: 'Siguiente <i class="ri-arrow-right-s-line text-lg"></i>',
                            variant: 'outline-secondary',
                            disabled: !meta.nextPage,
                            dataset: { action: 'paginate', page: meta.nextPage },
                            className: 'rounded-l-none rounded-r-md focus:z-10 bg-gray-800/50'
                        })}
                    </nav>
                </div>
            </div>
        </div>
    `;
};