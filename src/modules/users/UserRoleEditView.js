import { Button, Link, Badge } from '@/components/ui';

/**
 * @file UserRoleEditView.js
 * @description Interfaz para modificar la asignación de roles, adaptada a modo oscuro.
 */
export const UserRoleEditView = async () => {
    return `
        <div class="p-6 max-w-4xl mx-auto space-y-6">
            <div class="mb-8">
                <h1 class="text-2xl font-black text-white">Asignación de Roles</h1>
                <p class="text-sm text-text-secondary">Gestione los niveles de acceso para el usuario seleccionado.</p>
            </div>

            <div class="bg-bg-hover p-6 rounded-xl border border-gray-800 mb-6 flex items-center gap-4">
                <div class="h-12 w-12 bg-bg-surface text-brand rounded-full flex items-center justify-center font-bold text-xl shadow-sm" id="user-initial">
                    <i class="ri-loader-4-line animate-spin"></i>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-white" id="user-fullname">Cargando usuario...</h2>
                    <p class="text-sm text-text-secondary" id="user-email">Consultando base de datos...</p>
                </div>
            </div>

            <form id="form-edit-user-roles" class="app-card space-y-8">
                
                <input type="hidden" id="userId" name="userId">

                <div class="flex justify-between items-end border-b border-gray-800 pb-4">
                    <label class="block text-sm font-bold text-white">
                        Roles Disponibles en el Sistema
                    </label>
                    ${Badge({
                        text: 'Requerido: Mínimo 1 rol',
                        variant: 'brand',
                        icon: '<i class="ri-alert-line"></i>',
                        className: 'text-xs uppercase tracking-wider'
                    })}
                </div>
                
                <div id="roles-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p class="text-sm text-text-secondary animate-pulse col-span-full">Cargando catálogo de roles...</p>
                </div>

                <div class="flex items-center justify-end gap-4 pt-8 border-t border-gray-800">
                    ${Link({
                        text: 'Cancelar',
                        href: '#/usuarios',
                        variant: 'ghost',
                        className: 'font-medium'
                    })}
                    
                    ${Button({
                        text: 'Guardar Asignación',
                        type: 'submit',
                        id: 'btn-update-roles',
                        variant: 'primary',
                        size: 'md',
                        className: 'px-8 shadow-md font-black',
                        icon: '<i class="ri-save-3-line"></i>'
                    })}
                </div>
            </form>
        </div>
    `;
};