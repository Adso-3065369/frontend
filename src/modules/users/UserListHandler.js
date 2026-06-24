import { createRepository } from '@/repositories';
import { DataTable, Link, Button, Pagination, Badge } from '@/components/ui';
import { RenderIf } from '@/utils';

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
// 2. FASE DE CARGA DE DATOS Y RENDERIZADO DESDE EL SERVIDOR (Server-Side Pagination & Filtering)
// ============================================================================
// Función asíncrona para obtener los datos del servidor y renderizarlos en la vista
const loadAndRenderUsers = async (userRepo, tableContainer, page = 1, limit = 10, search = '', role = '') => {
    try {
        // Formateamos el parámetro de búsqueda de texto si está presente
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        // Formateamos el parámetro del rol seleccionado si está presente
        const roleParam = role ? `&role=${encodeURIComponent(role)}` : '';
        // Construimos la cadena de consulta incluyendo la página, el límite y los filtros
        const queryString = `?page=${page}&limit=${limit}${searchParam}${roleParam}`;

        // Realizamos la petición HTTP GET al repositorio de usuarios pasándole la cadena de consulta
        const response = await userRepo.getAll(queryString);
        
        // Extraemos los datos devueltos (adaptando si el payload viene envuelto o directo)
        const payload = response.data || response;
        // Obtenemos la lista de usuarios del payload
        const users = payload.data || [];
        // Obtenemos la metadata de paginación devuelta por el servidor
        const meta = payload.meta || null;
        
        // Generamos el HTML de la tabla con los usuarios cargados
        const tableHtml = DataTable({
            columns: userColumns,
            data: users,
            // Mostramos un mensaje vacío personalizado dependiendo de si hay filtros activos
            emptyMessage: (search || role)
                ? 'No se encontraron usuarios que coincidan con la búsqueda.' 
                : 'No hay usuarios registrados en el sistema.'
        });

        // Generamos el HTML del componente estandarizado de paginación usando la metadata devuelta
        const paginationHtml = meta ? Pagination({ meta, itemName: 'usuarios' }) : '';

        // Insertamos en el contenedor de la interfaz la tabla combinada con la barra de paginación
        tableContainer.innerHTML = tableHtml + paginationHtml;
        
        // Retornamos la lista de usuarios renderizada
        return users;
    } catch (error) {
        // En caso de error, lo reportamos en consola y mostramos una tarjeta visual de error
        console.error("Error al obtener usuarios:", error);
        tableContainer.innerHTML = `
            <div class="p-6 text-center text-red-500 font-bold bg-red-500/10 border border-red-500 m-4 rounded-lg">
                Fallo de comunicación con el servidor al intentar cargar el directorio de usuarios.
            </div>
        `;
        return [];
    }
};

// ============================================================================
// 3. FASE DE SERVIDOR: Eliminación Permanente de Usuario
// ============================================================================
// Función asíncrona para eliminar un usuario específico llamando al endpoint del servidor
const handleDeleteUser = async (btnElement, userRepo, refreshCallback) => {
    // Obtenemos el ID del usuario almacenado en el atributo data-id del botón clicado
    const id = btnElement.dataset.id;
    
    // Mostramos una alerta de confirmación nativa del navegador antes de proceder
    if (!confirm('ADVERTENCIA: ¿Confirma la eliminación permanente de este usuario del sistema?')) {
        return; 
    }
        
    // Guardamos el contenido HTML original del botón para poder restaurarlo si la operación falla
    const originalContent = btnElement.innerHTML;
    // Cambiamos el contenido del botón para mostrar un icono de carga/animación
    btnElement.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
    // Deshabilitamos el botón para evitar doble envío accidental
    btnElement.disabled = true;

    try {
        // Invocamos al método delete del repositorio para despachar la petición DELETE al servidor
        await userRepo.delete(id);
        // Refrescamos la vista llamando a la función callback
        await refreshCallback(); 
    } catch (error) {
        // Capturamos cualquier error devuelto por la petición
        console.error(`Error transaccional al eliminar usuario ${id}:`, error);
        
        // Extraemos el mensaje de error del payload de respuesta o usamos un mensaje genérico
        const errorMessage = error.response?.data?.message || error.message || "Fallo transaccional de servidor.";
        // Mostramos el mensaje de error al usuario mediante un alert
        alert(`Operación rechazada:\n${errorMessage}`);
        
        // Restauramos el contenido original y habilitamos nuevamente el botón
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
    }
};

// ============================================================================
// 4. ORQUESTADOR PRINCIPAL: Delegación de Eventos y Manejo del Estado
// ============================================================================
// Función controladora principal exportada para iniciar el listado de usuarios
export const UserListHandler = async () => {
    // Instanciamos el repositorio transaccional para la entidad de usuarios
    const userRepo = createRepository('users');
    // Obtenemos la referencia del contenedor de la interfaz de la tabla de usuarios en el DOM
    const tableContainer = document.getElementById('users-table-container');

    // Validación de seguridad por si el contenedor no existe en el DOM actual
    if (!tableContainer) return;

    // Declaramos variables de control de estado locales
    let currentUsers = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentSearchTerm = ''; 
    let currentRole = '';

    // Función callback local para recargar la vista llamando a la carga paginada del servidor
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

    // Suscribirse al evento personalizado de filtros cambiados
    // Primero removemos cualquier escuchador anterior registrado en window para evitar duplicados
    if (window.userFiltersChangedListener) {
        document.removeEventListener('user-filters-changed', window.userFiltersChangedListener);
    }

    // Definimos el manejador del evento de cambio de filtros
    window.userFiltersChangedListener = async (e) => {
        // Extraemos los nuevos valores de búsqueda de texto y rol seleccionados
        const { searchTerm, roleName } = e.detail;
        // Actualizamos las variables de estado correspondientes
        currentSearchTerm = searchTerm;
        currentRole = roleName;
        // Reiniciamos el cursor de paginación a la página 1 cuando se realiza un nuevo filtrado
        currentPage = 1;
        // Invocamos la actualización de la vista para realizar la consulta al servidor
        await refreshView();
    };

    // Registramos el escuchador en el documento
    document.addEventListener('user-filters-changed', window.userFiltersChangedListener);

    // Ejecutamos la carga inicial al arrancar el controlador
    await refreshView();

    // Registramos un manejador de eventos click por delegación sobre el contenedor de la tabla
    tableContainer.addEventListener('click', async (e) => {
        // Evaluamos si el clic ocurrió sobre un botón de paginación
        const btnPaginate = e.target.closest('button[data-action="paginate"]');
        if (btnPaginate && !btnPaginate.disabled) {
            // Extraemos la página objetivo almacenada en el dataset
            const newPage = parseInt(btnPaginate.dataset.page, 10);
            if (!isNaN(newPage)) {
                // Actualizamos la página actual
                currentPage = newPage;
                // Recargamos la vista de usuarios
                await refreshView();
            }
            return;
        }
        
        // Evaluamos si el clic ocurrió sobre un botón de eliminación permanente
        const btnDelete = e.target.closest('button[data-action="delete"]');
        if (btnDelete && !btnDelete.disabled) {
            // Despachamos la lógica de eliminación pasándole la referencia del botón, el repo y la función de refresco
            await handleDeleteUser(btnDelete, userRepo, refreshView);
            return;
        }
    });
};