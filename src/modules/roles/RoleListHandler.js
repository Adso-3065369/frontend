import { createRepository } from '@/repositories';
import { DataTable, Badge, Link, Button } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file RoleListHandler.js
 * @description Orquestador del listado de roles aplicando el componente dinámico DataTable
 * y manteniendo la lógica estricta de eliminación física.
 */

// ============================================================================
// 1. CONFIGURACIÓN DEL CONTRATO DE COLUMNAS
// ============================================================================
const roleColumns = [
    {
        header: 'Nombre del Rol',
        accessor: 'name',
        render: (role) => `
            <div class="font-bold text-white capitalize">${role.name}</div>
        `
    },
    {
        header: 'Nivel de Acceso',
        accessor: 'permissions',
        render: (role) => {
            // Asumimos que el backend envía los permisos en un arreglo
            const count = role.permissions ? role.permissions.length : 0;
            return Badge({
                text: count > 0 ? `${count} Permisos` : 'Sin permisos',
                variant: count > 0 ? 'info' : 'default'
            });
        }
    },
    {
        header: 'Acciones',
        accessor: 'actions',
        render: (role) => `
            <div class="flex items-center justify-end gap-2">
                ${RenderIf('roles.update',
                    Link({
                        href: `#/roles/editar/${role.id}`,
                        variant: 'outline-primary',
                        size: 'sm',
                        icon: '<i class="ri-pencil-line"></i>',
                        className: 'justify-center w-8 h-8 p-0'
                    })
                )}
                ${RenderIf('roles.delete',
                    Button({
                        variant: 'danger',
                        icon: '<i class="ri-delete-bin-line"></i>',
                        className: 'w-8 h-8 p-0 flex items-center justify-center',
                        dataset: {
                            action: 'delete',
                            id: role.id
                        }
                    })
                )}
            </div>
        `
    }
];

// ============================================================================
// 2. FASE DE INICIALIZACIÓN Y RENDERIZADO
// ============================================================================
const loadAndRenderRoles = async (roleRepo, tableContainer) => {
    try {
        const { data: roles } = await roleRepo.getAll();        

        // Inyección del componente genérico con la configuración específica
        tableContainer.innerHTML = DataTable({
            columns: roleColumns,
            data: roles,
            emptyMessage: 'No hay roles registrados en el sistema.'
        });
        
    } catch (error) {
        console.error("Fallo de red o servidor al obtener la lista de roles:", error);
        tableContainer.innerHTML = `
            <div class="p-6 text-center text-red-500 font-bold bg-red-500/10 border border-red-500 m-4 rounded-lg">
                Ocurrió un error crítico al intentar cargar los perfiles de acceso.
            </div>
        `;
    }
};

// ============================================================================
// 3. FASE DE SERVIDOR: Lógica de Eliminación Física (Hard Delete)
// ============================================================================
const handleHardDelete = async (btnElement, roleRepo, refreshCallback) => {
    const id = btnElement.dataset.id;
    
    // Confirmación estricta por el impacto transaccional
    if (!confirm('¿Está seguro de eliminar este rol? Esta acción afectará los permisos de los usuarios asociados al sistema.')) {
        return; // Interrupción temprana
    }
        
    // UX: Control de concurrencia y estado de carga visual
    const originalContent = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
    btnElement.disabled = true;

    try {
        // Ejecución transaccional
        await roleRepo.delete(id);
        
        // Sincronización de la vista
        await refreshCallback(); 
    } catch (error) {
        console.error(`Error transaccional al eliminar el rol ${id}:`, error);
        
        // 🚀 EXTRACCIÓN DINÁMICA DEL MENSAJE DE ERROR
        const errorMessage = error.message || "Fallo de comunicación con el servidor. No se pudo completar la eliminación.";
        alert(errorMessage);
        
        // Reversión del estado visual
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
    }
};

// ============================================================================
// 4. ORQUESTADOR PRINCIPAL: Eventos y Delegación
// ============================================================================
export const RoleListHandler = async () => {
    const roleRepo = createRepository('roles');
    const tableContainer = document.getElementById('roles-table-container');

    if (!tableContainer) return;

    // Función envoltorio para recargar la vista
    const refreshView = async () => {
        await loadAndRenderRoles(roleRepo, tableContainer);
    };

    await refreshView();

    // Gestión centralizada de eventos mediante delegación
    tableContainer.addEventListener('click', async (e) => {
        
        // Capturamos el evento usando el selector de atributos data-action
        const btnDelete = e.target.closest('button[data-action="delete"]');
        if (btnDelete) {
            await handleHardDelete(btnDelete, roleRepo, refreshView);
        }
    });
};