import { Link } from '@/components/ui';
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

            <div class="flex sm:flex-row w-full gap-2 @xl:flex-col">
                <div class="w-4/5 flex-none">
                    <input id="search-input" type="text" placeholder="Ingrese el codigo de la venta o nombre del vendedor" class="w-full text-white text-left p-4 border-4 border-(--primary) hover:bg-bg-hover transition-colors rounded-l-lg bg-transparent">
                </div>

                <div class="flex-none">
                    <input id="date-input" type="date" class="w-full flex transition-colors hover:bg-bg-hover p-4 text-white border-4 rounded-r-lg border-(--primary) bg-transparent [color-scheme:dark]">
                </div>
                
            </div>

            <div class="">
                <button id="clear-filters-btn" class="h-full px-6 items-center justify-center transition-colors text-black font-bold bg-(--primary) hover:bg-gray-700border-4 rounded-lg whitespace-nowrap p-2 hover:bg-yellow-400 cursor-pointer" title="Limpiar todos los filtros">
                    <i class="ri-filter-off-line mr-2 text-lg"></i> Limpiar
                </button>
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