import { createRepository } from '@/repositories';
import { DataTable, Link, Button, Pagination, Badge } from '@/components/ui';
import { RenderIf, debounce } from '@/utils';

/**
 * @file UserListHandler.js
 * @description Orquestador del listado de usuarios. Gestiona la paginación de red,
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
// 2. FASE DE CARGA DE DATOS Y RENDERIZADO DESDE EL SERVIDOR
// ============================================================================
const loadAndRenderUsers = async (userRepo, tableContainer, page = 1, limit = 10, search = '', role = '') => {
    try {
        // Construimos de forma dinámica los parámetros de búsqueda de texto y rol
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const roleParam = role ? `&role=${encodeURIComponent(role)}` : '';
        // Unimos los filtros con los límites de paginación en una sola cadena de consulta
        const queryString = `?page=${page}&limit=${limit}${searchParam}${roleParam}`;

        // Hacemos el llamado HTTP GET al repositorio de usuarios pasando los parámetros
        const response = await userRepo.getAll(queryString);
        
        // Obtenemos los datos encapsulados en el cuerpo de la respuesta
        const payload = response.data || response;
        // Extraemos la colección de usuarios devueltos
        const users = payload.data || [];
        // Extraemos la metadata de la paginación devuelta por el servidor (currentPage, lastPage, etc.)
        const meta = payload.meta || null;
        
        // Generamos el HTML de la tabla con las columnas contractuales y los datos de usuarios
        const tableHtml = DataTable({
            columns: userColumns,
            data: users,
            emptyMessage: (search || role) 
                ? 'No se encontraron usuarios bajo esos parámetros.' 
                : 'El directorio de usuarios está vacío.'
        });

        // Generamos el HTML del componente estandarizado de paginación inyectándole la metadata
        const paginationHtml = meta ? Pagination({ meta, itemName: 'usuarios' }) : '';

        // Insertamos el HTML combinado de la tabla y la paginación en el contenedor del DOM
        tableContainer.innerHTML = tableHtml + paginationHtml;
        
        // Retornamos el arreglo de usuarios cargados para mantener el estado en el orquestador
        return users;
    } catch (error) {
        // En caso de fallo de comunicación o base de datos, mostramos un aviso al usuario
        console.error("Error al obtener usuarios:", error);
        tableContainer.innerHTML = `
            <div class="p-6 text-center text-red-500 font-bold bg-red-500/10 border border-red-500 m-4 rounded-lg">
                Fallo de comunicación con el servidor al intentar cargar el directorio.
            </div>
        `;
        return [];
    }
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
    // Instanciamos el repositorio transaccional para la entidad 'users'
    const userRepo = createRepository('users');
    // Obtenemos el elemento contenedor donde se renderizará el listado de usuarios
    const tableContainer = document.getElementById('users-table-container');

    // Salida temprana si el contenedor no existe en la vista actual
    if (!tableContainer) return;

    // Declaramos variables de estado locales para la vista de usuarios
    let currentUsers = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentSearchTerm = '';
    let currentRole = '';

    // Función auxiliar para refrescar el contenido llamando a la carga paginada
    const refreshView = async () => {
        currentUsers = await loadAndRenderUsers(
            userRepo, 
            tableContainer, 
            currentPage, 
            itemsPerPage, 
            currentSearchTerm,
            currentRole
        );
    };

    // Removemos escuchadores globales antiguos si existen para evitar fugas de memoria
    if (window.userSearchInputListener) {
        document.removeEventListener('input', window.userSearchInputListener);
    }
    if (window.userRoleChangeListener) {
        document.removeEventListener('change', window.userRoleChangeListener);
    }

    // Lógica del filtro de búsqueda con debounce (espera 500ms tras escribir)
    const debouncedSearch = debounce(async (searchVal) => {
        currentSearchTerm = searchVal;
        // Reiniciamos la visualización a la página uno al realizar una nueva búsqueda
        currentPage = 1;
        // Refrescamos la vista con los nuevos datos filtrados
        await refreshView();
    }, 500);

    // Definimos el manejador del evento de entrada para la búsqueda por texto
    window.userSearchInputListener = (e) => {
        if (e.target && e.target.id === 'filter-search') {
            debouncedSearch(e.target.value);
        }
    };

    // Definimos el manejador del evento de cambio para el filtro de rol
    window.userRoleChangeListener = async (e) => {
        if (e.target && e.target.id === 'filter-role') {
            currentRole = e.target.value;
            // Reiniciamos la visualización a la página uno al realizar una nueva búsqueda
            currentPage = 1;
            // Refrescamos la vista con los nuevos datos filtrados
            await refreshView();
        }
    };

    // Escuchamos los cambios en los inputs a nivel de documento
    document.addEventListener('input', window.userSearchInputListener);
    document.addEventListener('change', window.userRoleChangeListener);

    // Ejecutamos la carga inicial de datos paginados al entrar a la sección
    await refreshView();

    // Registramos un manejador de eventos click por delegación dentro del contenedor de la tabla
    tableContainer.addEventListener('click', async (e) => {
        // Identificamos si se hizo click en un botón de navegación de página
        const btnPaginate = e.target.closest('button[data-action="paginate"]');
        if (btnPaginate && !btnPaginate.disabled) {
            // Convertimos a entero el número de página guardado en el dataset del botón
            const newPage = parseInt(btnPaginate.dataset.page, 10);
            if (!isNaN(newPage)) {
                // Actualizamos la página activa del estado
                currentPage = newPage;
                // Cargamos y mostramos la página de datos correspondiente
                await refreshView();
            }
            return;
        }
        
        // Identificamos si se hizo click en un botón de eliminación de usuario
        const btnDelete = e.target.closest('button[data-action="delete"]');
        if (btnDelete) {
            // Ejecutamos la lógica transaccional de borrado y actualizamos al terminar
            await handleDeleteUser(btnDelete, userRepo, refreshView);
            return;
        }
    });
};