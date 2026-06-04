import { Input, Button, Link, Badge } from '@/components/ui';

/**
 * @file RoleEditPage.js
 * @version 4.0.0
 * @description Interfaz para la edición de roles y gestión de permisos en modo oscuro.
 */
export const RoleEditPage = async () => {
    return `
        <div class="p-6 max-w-5xl mx-auto space-y-6">
            <div class="mb-8">
                <h1 class="text-2xl font-black text-white">Editar Rol</h1>
                <p class="text-sm text-text-secondary">Modifique el nombre o los privilegios asignados a este perfil.</p>
            </div>

            <form id="form-edit-role" class="app-card space-y-8">
                
                <input type="hidden" id="roleId" name="roleId">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="col-span-1">
                        ${Input({
                            label: 'Nombre del Rol',
                            id: 'roleName',
                            name: 'roleName',
                            required: false,
                            placeholder: 'Cargando información...'
                        })}
                    </div>

                    <div class="col-span-1 md:col-span-2">
                        ${Input({
                            label: 'Descripción del Rol',
                            id: 'description',
                            name: 'description',
                            placeholder: 'Ej. Perfil con acceso total a los módulos de ventas e inventario...'
                        })}
                    </div>
                </div>

                <div class="pt-6 border-t border-gray-800">
                    <div class="mb-4 flex justify-between items-end pb-2">
                        <label class="block text-sm font-bold text-white">
                            Permisos del Sistema
                        </label>
                        ${Badge({
                            text: 'Requerido: Mínimo 1 permiso',
                            variant: 'brand',
                            icon: '<i class="ri-alert-line"></i>',
                            className: 'text-xs uppercase tracking-wider'
                        })}
                    </div>
                    
                    <div id="permissions-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <p class="text-sm text-text-secondary animate-pulse col-span-full italic">Cargando configuración actual...</p>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-4 pt-8 border-t border-gray-800">
                    ${Link({
                        text: 'Cancelar',
                        href: '#/roles',
                        variant: 'ghost',
                        className: 'font-medium'
                    })}
                    
                    ${Button({
                        text: 'Actualizar Rol',
                        type: 'submit',
                        id: 'btn-update-role',
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