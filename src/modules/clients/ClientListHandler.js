import { createRepository } from '@/repositories';
import { DataTable, Link, Button, Pagination, Badge } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file ClientListHandler.js
 * @description Orquestador del listado de clientes. Gestiona la paginación reactiva,
 * filtros dinámicos por servidor y renderizado relacional de volumen de transacciones.
 */

// ============================================================================
// 1. CONFIGURACIÓN DEL CONTRATO DE COLUMNAS
// ============================================================================
const clientColumns = [
    {
        header: 'Documento',
        accessor: 'document_number',
        render: (client) => `<span class="font-mono text-gray-300">${client.document_number}</span>`
    },
    {
        header: 'Cliente / Razón Social',
        accessor: 'name',
        render: (client) => `<div class="font-bold text-white uppercase">${client.name}</div>`
    },
    {
        header: 'Contacto',
        accessor: 'contact',
        render: (client) => `
            <div class="text-sm text-text-secondary">
                <div><i class="ri-mail-line mr-1"></i> ${client.email || 'N/A'}</div>
                <div><i class="ri-phone-line mr-1"></i> ${client.phone || 'N/A'}</div>
            </div>
        `
    },
    {
        header: 'Historial Compras',
        accessor: 'sales_count',
        render: (client) => {
            const count = client.sales_count || 0;
            return Badge({
                text: `${count} ${count === 1 ? 'venta' : 'ventas'}`,
                variant: count > 0 ? 'success' : 'secondary'
            });
        }
    },
    {
        header: 'Acciones',
        accessor: 'actions',
        render: (client) => {
            const hasPurchases = (client.sales_count || 0) > 0;
            return `
                <div class="flex items-center justify-end gap-2">
                    ${RenderIf('clients.update',
                        Link({
                            href: `#/clientes/editar/${client.id}`,
                            variant: 'outline-primary',
                            size: 'sm',
                            icon: '<i class="ri-pencil-line"></i>',
                            className: 'justify-center w-8 h-8 p-0',
                            title: 'Modificar Ficha de Cliente'
                        })
                    )}
                    ${RenderIf('clients.delete',
                        Button({
                            variant: 'danger',
                            size: 'sm',
                            icon: '<i class="ri-delete-bin-line"></i>',
                            className: 'w-8 h-8 p-0 flex items-center justify-center',
                            title: hasPurchases ? 'No se puede eliminar (Cliente con historial de compras)' : 'Eliminar Cliente',
                            disabled: hasPurchases,
                            dataset: { action: 'delete', id: client.id }
                        })
                    )}
                </div>
            `;
        }
    }
];

// ============================================================================
// 2. FASE DE CARGA DE DATOS Y RENDERIZADO (Server-Side Pagination & Search)
// ============================================================================
const loadAndRenderClients = async (clientRepo, tableContainer, page = 1, limit = 10, search = '') => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const queryString = `?page=${page}&limit=${limit}${searchParam}`;
        
        const response = await clientRepo.getAll(queryString);
        
        // Desempaquetado dual defensivo frente a envoltorios HTTP/Axios
        const payload = response.data || response;
        const clients = Array.isArray(payload) ? payload : (payload.data || []);
        const meta = payload.meta || null;
        
        const tableHtml = DataTable({
            columns: clientColumns,
            data: clients,
            emptyMessage: search 
                ? 'No se encontraron clientes que coincidan con la búsqueda.' 
                : 'No hay clientes registrados en el directorio comercial.'
        });

        // Inyección del componente genérico modular
        const paginationHtml = meta ? Pagination({ meta, itemName: 'clientes' }) : '';

        tableContainer.innerHTML = tableHtml + paginationHtml;
        
    } catch (error) {
        console.error("Error crítico al obtener directorio de clientes:", error);
        tableContainer.innerHTML = `
            <div class="p-6 text-center text-red-500 font-bold bg-red-500/10 border border-red-500 m-4 rounded-lg">
                Fallo de conexión con el servidor al intentar cargar los clientes.
            </div>
        `;
    }
};

// ============================================================================
// 3. FASE DE SERVIDOR: Eliminación Física (Hard Delete con Restricción)
// ============================================================================
const handleDeleteClient = async (btnElement, clientRepo, refreshCallback) => {
    const id = btnElement.dataset.id;
    
    if (!confirm('ADVERTENCIA: ¿Está seguro de eliminar este cliente? Si posee transacciones en el sistema la operación será rechazada.')) {
        return; 
    }
        
    const originalContent = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
    btnElement.disabled = true;

    try {
        await clientRepo.delete(id);
        await refreshCallback(); 
    } catch (error) {
        console.error(`Error transaccional al intentar eliminar el cliente ${id}:`, error);
        
        const errorMessage = error.response?.data?.message || error.message || "Fallo de comunicación con el servidor.";
        alert(`Operación rechazada por el núcleo:\n${errorMessage}`);
        
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
    }
};

// ============================================================================
// 4. ORQUESTADOR PRINCIPAL: Control de Estado Local y Delegación
// ============================================================================
export const ClientListHandler = async () => {
    const clientRepo = createRepository('clients');
    const tableContainer = document.getElementById('clients-table-container');

    if (!tableContainer) return;

    // Inicialización del estado local de la consulta
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentSearchTerm = ''; // Sincronizar aquí si añade un elemento input[type="search"] en el DOM

    const refreshView = async () => {
        await loadAndRenderClients(
            clientRepo, 
            tableContainer, 
            currentPage, 
            itemsPerPage, 
            currentSearchTerm
        );
    };

    // Carga inicial de la vista
    await refreshView();

    // Captura centralizada de burbujeo de eventos click
    tableContainer.addEventListener('click', async (e) => {
        
        // --- EVENTO: Intercepción del Paginador ---
        const btnPaginate = e.target.closest('button[data-action="paginate"]');
        if (btnPaginate && !btnPaginate.disabled) {
            const newPage = parseInt(btnPaginate.dataset.page, 10);
            if (!isNaN(newPage)) {
                currentPage = newPage;
                await refreshView();
            }
            return;
        }

        // --- EVENTO: Trigger de Eliminación ---
        const btnDelete = e.target.closest('button[data-action="delete"]');
        if (btnDelete && !btnDelete.disabled) {
            await handleDeleteClient(btnDelete, clientRepo, refreshView);
            return;
        }
    });
};