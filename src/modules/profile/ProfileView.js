import { Link } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file UserListView.js
 * @description Interfaz de gestión de usuarios ajustada al patrón de componentes dinámicos.
 */
export const ProfileView = async () => {
    return `
        <div class="p-6 space-y-6">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-black text-white">Gestión de Usuarios</h1>
                    <p class="mt-2 text-sm text-text-secondary">Administre el personal, asigne roles y controle el acceso al sistema.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                ${RenderIf('users.create',
                    Link({
                        href: '#/usuarios/nuevo',
                        text: 'Nuevo Usuario',
                        variant: 'primary',
                        icon: '<i class="ri-user-add-line text-lg"></i>'
                    })
                )}
                </div>
            </div>

            <div id="users-table-container" class="app-card overflow-hidden">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-2xl block mb-2"></i>
                    Cargando lista de usuarios...
                </div>
            </div>
        </div>
    `;
};