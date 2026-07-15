import { Link, Input, Button } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file SalesListView.js
 * @description Interfaz estructural para el historial de ventas. 
 * Delega la renderización al componente dinámico DataTable e implementa UI-RBAC.
 */
export const SalesListView = async () => {
    return `
        <div class="p-6 space-y-6 animate-fade-in">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-black text-white">Historial de Ventas</h1>
                    <p class="mt-2 text-sm text-text-secondary">Consulte las transacciones realizadas y el detalle de cada operación.</p>
                </div>


                <div class="mt-4 sm:mt-0">
                    ${RenderIf('sales.create',
                        Link({
                            href: '#/ventas/nueva',
                            text: 'Nueva Venta',
                            variant: 'primary',
                            icon: '<i class="ri-shopping-cart-line text-lg"></i>'
                        })
                    )}
                </div>
            </div>

            <div class="flex sm:flex-row w-full gap-2 @xl:flex-col justify-center">
                <div class="w-2/3 flex-none">
                    ${Input({
                        id: 'search-input',
                        type: 'text',
                        placeholder: 'Ingrese el código de la venta o nombre del cliente',
                        variant: 'outline-primary',
                        size: 'lg',
                    })}
                </div>

                <div class="flex-none">
                    ${Input({
                        id: 'date-input',
                        type: 'date',
                        variant: 'outline-primary',
                        size: 'lg'
                    })}
                </div>
                
                
                ${Button({
                    id: 'clear-filters-btn',
                    text: 'Limpiar',
                    sizes: 'lg',
                    icon: '<i class="ri-filter-off-line text-lg mr-1"></i>',
                    variant: 'secundary',
                    className: 'w-full lg:w-auto font-bold whitespace-nowrap'
                })}
                
            </div>

                
            <div id="sales-table-container" class="app-card overflow-hidden">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-4xl block mb-4 text-brand"></i>
                    Cargando transacciones...
                </div>
            </div>
        </div>
    `;
};
