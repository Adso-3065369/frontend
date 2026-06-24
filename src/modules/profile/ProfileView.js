import { Link, Badge, Card } from '@/components/ui';
import { RenderIf } from '@/utils';
import { profileCard } from './components/profileCard';

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
            ${Card({
                id: 'profile-card',
                className:'flex-row gap-5 items-center px-5 py-10 justify-between'
            })}
        </div>a
    `;
};