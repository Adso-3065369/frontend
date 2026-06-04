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

            <div id="clients-table-container" class="app-card overflow-hidden justify-center">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-4xl block mb-4 text-brand"></i>
                    Cargando directorio de clientes...
                </div>
            </div>
        </div>
    `;
};