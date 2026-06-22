import { createRepository } from '@/repositories';
import { DataTable, Link, Button, Badge } from '@/components/ui';
import { RenderIf, filterUsers } from '@/utils';
import { setupUserFilterListeners } from './components/UserFilter.js';

/**
 * @file UserListHandler.js
 * @description Orquestador del listado de usuarios. Gestiona la filtración en la vista,
 * el mapeo de roles y las estadísticas de transacciones (ventas) por usuario.
 */

// ============================================================================
// 1. CONTRATO DE COLUMNAS (Data Definition)
// ============================================================================
const userColumns = [
    {
        header: 'Usuario',
        accessor: 'name',
        render: (user) => `
            <div class="font-bold text-white">${user.name}</div>
            <div class="text-sm text-text-secondary">${user.email}</div>
        `
    },
    {
        header: 'Niveles de Acceso',
        accessor: 'roles',
        render: (user) => {
            const roles = user.roles || [];
            if (roles.length === 0) return Badge({ text: 'Sin Roles', variant: 'warning' });
            
            return `<div class="flex flex-wrap gap-1">
                ${roles.map(role => Badge({ text: role.name, variant: 'primary' })).join('')}
            </div>`;
        }
    },
    {
        header: 'Volumen Op.',
        accessor: 'sales_count',
        render: (user) => {
            const count = user.sales_count || 0;
            return `<span class="font-mono text-${count > 0 ? 'brand' : 'gray-500'} font-bold">${count} transacciones</span>`;
        }
    },
    {
        header: 'Acciones',
        accessor: 'actions',
        render: (user) => {
            const hasOperations = (user.sales_count || 0) > 0;
            return `
                <div class="flex items-center justify-end gap-2">
                    ${RenderIf('roles.assign',
                        Link({
                            href: `#/usuarios/editar-roles/${user.id}`,
                            variant: 'outline-warning',
                            size: 'sm',
                            icon: '<i class="ri-shield-keyhole-line"></i>',
                            className: 'justify-center w-8 h-8 p-0',
                            title: 'Gestionar Permisos y Roles'
                        })
                    )}
                    ${RenderIf('users.update',
                        Link({
                            href: `#/usuarios/editar/${user.id}`,
                            variant: 'outline-primary',
                            size: 'sm',
                            icon: '<i class="ri-pencil-line"></i>',
                            className: 'justify-center w-8 h-8 p-0',
                            title: 'Modificar Datos Base'
                        })
                    )}
                    ${RenderIf('users.delete',
                        Button({
                            variant: 'danger',
                            size: 'sm',
                            icon: '<i class="ri-delete-bin-line"></i>',
                            className: 'w-8 h-8 p-0 flex items-center justify-center',
                            title: hasOperations ? 'Bloqueado: Usuario con operaciones registradas' : 'Eliminar Sistema',
                            disabled: hasOperations,
                            dataset: { action: 'delete', id: user.id }
                        })
                    )}
                </div>
            `;
        }
    }
];

// ============================================================================
// 2. FASE DE RENDERIZADO DE LA TABLA (Client-Side Rendering)
// ============================================================================
const renderUsersTable = (users, tableContainer, isFiltered = false) => {
    const tableHtml = DataTable({
        columns: userColumns,
        data: users,
        emptyMessage: isFiltered 
            ? 'No se encontraron usuarios bajo esos parámetros.' 
            : 'El directorio de usuarios está vacío.'
    });

    tableContainer.innerHTML = tableHtml;
};

// ============================================================================
// 3. FASE DE SERVIDOR: Eliminación
// ============================================================================
const handleDeleteUser = async (btnElement, userRepo, refreshCallback) => {
    const id = btnElement.dataset.id;
    
    if (!confirm('ADVERTENCIA: ¿Confirma la eliminación permanente de este usuario del sistema?')) {
        return; 
    }
        
    const originalContent = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
    btnElement.disabled = true;

    try {
        await userRepo.delete(id);
        await refreshCallback(); 
    } catch (error) {
        console.error(`Error transaccional al eliminar usuario ${id}:`, error);
        
        const errorMessage = error.response?.data?.message || error.message || "Fallo transaccional de servidor.";
        alert(`Operación rechazada:\n${errorMessage}`);
        
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
    }
};

// ============================================================================
// 4. ORQUESTADOR PRINCIPAL: Delegación y Estado
// ============================================================================
export const UserListHandler = async () => {
    const userRepo = createRepository('users');
    const tableContainer = document.getElementById('users-table-container');

    if (!tableContainer) return;

    let allUsers = [];
    let currentSearchTerm = '';
    let currentRoleTerm = '';

    const refreshView = async () => {
        try {
            // Obtenemos todos los usuarios desactivando la paginación del servidor
            const response = await userRepo.getAll('?paginate=false');
            
            // Desempaquetado dual defensivo
            const payload = response.data || response;
            allUsers = Array.isArray(payload) ? payload : (payload.data || []);
            
            applyFiltersAndRender();
        } catch (error) {
            console.error("Fallo de red en la extracción de usuarios:", error);
            tableContainer.innerHTML = `
                <div class="p-6 text-center text-red-500 font-bold bg-red-500/10 border border-red-500 m-4 rounded-lg">
                    Fallo de comunicación con el servidor al intentar cargar el directorio.
                </div>
            `;
        }
    };

    const applyFiltersAndRender = () => {
        const filtered = filterUsers(allUsers, currentSearchTerm, currentRoleTerm);
        const isFiltered = !!(currentSearchTerm || currentRoleTerm);
        renderUsersTable(filtered, tableContainer, isFiltered);
    };

    // Carga inicial
    await refreshView();

    // Vinculamos los escuchadores del filtro a la vista
    setupUserFilterListeners((searchVal, roleVal) => {
        currentSearchTerm = searchVal;
        currentRoleTerm = roleVal;
        applyFiltersAndRender();
    });

    tableContainer.addEventListener('click', async (e) => {
        // --- Trigger de Eliminación ---
        const btnDelete = e.target.closest('button[data-action="delete"]');
        if (btnDelete && !btnDelete.disabled) {
            await handleDeleteUser(btnDelete, userRepo, refreshView);
            return;
        }
    });
};