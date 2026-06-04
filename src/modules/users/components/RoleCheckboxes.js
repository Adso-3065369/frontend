/**
 * @file RoleCheckboxes.js
 * @description Generador dinámico de la cuadrícula de roles ajustado al tema oscuro.
 */
import { Checkbox } from '@/components/ui';

export const RoleCheckboxes = (roles, selectedIds = []) => {
    
    // 1. Manejo del Estado Vacío con colores ajustados
    if (!roles || roles.length === 0) {
        return `
            <div class="col-span-full p-4 border border-dashed border-gray-800 rounded-lg text-center">
                <p class="text-sm text-text-secondary italic">No hay roles configurados en el sistema.</p>
            </div>
        `;
    }

    // 2. Mapeo de roles con delegación a componente atómico
    return roles.map(role => {
        const isChecked = selectedIds.includes(String(role.id));
        const permissionCount = role.permissions ? role.permissions.length : 0;

        return Checkbox({
            name: 'roles',
            value: role.id,
            label: role.name,
            description: `${permissionCount} permiso(s) base`,
            checked: isChecked,
            variant: 'brand',
            labelClass: 'text-white font-bold',
            descClass: 'text-text-secondary'
        });
    }).join('');
};