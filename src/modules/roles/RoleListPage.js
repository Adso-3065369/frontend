import { Link } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file RoleListPage.js
 * @description Interfaz de gestión de roles ajustada al patrón de componentes dinámicos.
 */
export const RoleListPage = async () => {
    return `
        <div class="p-6 space-y-6">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-black text-white">Gestión de Roles</h1>
                    <p class="mt-2 text-sm text-text-secondary">Administre los perfiles de acceso y la cantidad de permisos asignados a cada uno.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                 ${RenderIf('roles.create',
                    Link({
                        href: '#/roles/nuevo',
                        text: 'Nuevo Rol',
                        variant: 'primary',
                        icon: '<i class="ri-add-circle-line text-lg"></i>'
                    })
                )}
                </div>
            </div>

            <div id="roles-table-container" class="app-card overflow-hidden">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-2xl block mb-2"></i>
                    Conectando con el servidor...
                </div>
            </div>
        </div>
    `;
};