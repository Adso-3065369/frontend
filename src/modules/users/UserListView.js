import { Link } from '@/components/ui';
import { RenderIf } from '@/utils';
import { UserFilter } from './components/UserFilter.js';
import { filterUsers } from '@/utils/filterUsers.js';

/**
 * @file UserListView.js
 * @description Interfaz de gestión de usuarios ajustada al patrón de componentes dinámicos.
 */
export const UserListView = async () => {
    // Generamos el componente de filtros de usuario pasando un callback que se ejecuta al escribir o cambiar de rol
    const filterHtml = UserFilter((searchTerm, roleName) => {
        // Instanciamos un evento personalizado para propagar que los filtros han cambiado
        const event = new CustomEvent('user-filters-changed', {
            // Guardamos el término de búsqueda de texto y el nombre del rol dentro del detalle del evento
            detail: { searchTerm, roleName }
        });
        // Lanzamos el evento a nivel de documento para ser escuchado en el orquestador principal
        document.dispatchEvent(event);
    });

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

            <!-- Filtros de Búsqueda y Rol -->
            ${filterHtml}

            <div id="users-table-container" class="app-card overflow-hidden">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-2xl block mb-2"></i>
                    Cargando lista de usuarios...
                </div>
            </div>
        </div>
    `;
};