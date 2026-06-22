import { Link, Badge, Card } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file UserListView.js
 * @description Interfaz de gestión de usuarios ajustada al patrón de componentes dinámicos.
 */


const cardContent = `
                <div class="flex items-center gap-5">
                    <div class="bg-black w-20 h-20 flex justify-center items-center rounded-full">U</div>
                    <div class="flex-row items-center">
                        <p class="text-text-primary">Tu persona</p>
                        <p class="text-text-secondary">Tu persona@gmail.com</p>
                    </div>
                </div>
                ${Badge({
                    text: "xdddddd",
                    variant: 'info',
                    className: 'w-20 h-10 rounded-xl border-none'
                })}`

export const ProfileView = async () => {
    return `
        <div class="p-6 space-y-6">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-black text-white">Perfil</h1>
                    <p class="mt-2 text-sm text-text-secondary">Administre su perfil.</p>
                </div>
            </div>

            ${Card({
                children: cardContent,
                bodyClass: 'flex-row gap-5 items-center px-5 py-10 justify-between'
            })}

            <div id="user-card" class="flex justify-between items-center bg-[var(--bg-surface)] rounded-md app-card overflow-hidden h-50 w-150 p-10">
                
            </div>
            <div id="users-table-container" class="app-card overflow-hidden">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-2xl block mb-2"></i>
                    Cargando lista de usuarios...
                </div>
            </div>
        </div>a
    `;
};