import { Link } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file ClientListView.js
 * @description Interfaz estructural para el listado de clientes. 
 * Delega la renderización de la tabla al componente dinámico DataTable.
 */
export const ClientListView = async () => {
    return `
        <div class="p-6 space-y-6 animate-fade-in">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-black text-white">Directorio de Clientes</h1>
                    <p class="mt-2 text-sm text-text-secondary">Gestione la información de contacto y facturación de sus compradores.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    ${RenderIf('clients.create',
                        Link({
                            text: 'Nuevo Cliente',
                            href: '#/clientes/nuevo',
                            variant: 'primary',
                            icon: '<i class="ri-user-add-line text-lg"></i>'
                        })
                    )}
                </div>
            </div>
            
            <div class="relative">
                <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    type="text" id="client-search-input"
                    autocomplete="off"
                    class="w-full bg-bg-base border border-gray-700 text-white rounded-lg pl-12 pr-10 py-3 outline-none focus:border-brand transition-colors"
                    placeholder="Buscar por documento, nombre o correo de contacto..."
                >
                <button
                    type="button"
                    id="client-search-clear"
                    class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    title="Limpiar búsqueda"
                >
                    <i class="ri-close-line text-lg"></i>
                </button>
            </div>

            <div id="clients-table-container" class="app-card overflow-hidden justify-center">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-4xl block mb-4 text-brand"></i>
                    Cargando directorio de clientes...
                </div>
            </div>
        </div>
    `;
};