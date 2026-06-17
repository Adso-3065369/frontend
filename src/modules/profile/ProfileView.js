import { Link, Badge } from '@/components/ui';
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
                    <h1 class="text-2xl font-black text-white">Perfil</h1>
                    <p class="mt-2 text-sm text-text-secondary">Administre su perfil.</p>
                </div>
            </div>

            <div id="user-card" class="flex gap-5 bg-orange-700 app-card overflow-hidden h-50 w-100 p-10">
                <div class="bg-black w-10 h-10 flex justify-center items-center rounded-full">U</div>
                <div class="flex-row items-center">
                    <p class="text-text-primary">Tu persona</p>
                    <p class="text-text-secondary">Tu persona@gmail.com</p>
                </div>
                ${Badge({
                    text: "hola"
                })}
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