import { createRepository } from '@/repositories';
import { DataTable, Link, Button, Pagination, Badge } from '@/components/ui';
import { RenderIf, debounce } from '@/utils';

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
// Límite alto para poder filtrar en el cliente por teléfono/email sin perder
// registros que el backend no indexe en su búsqueda por defecto.
const CLIENT_SEARCH_FETCH_LIMIT = 1000;

// Determina si un cliente coincide con el término buscado,
// comparando documento, nombre, correo y teléfono (case-insensitive).
const clientMatchesSearch = (client, term) => {
    const normalizedTerm = term.toLowerCase();
    return [
        client.document_number,
        client.name,
        client.email,
        client.phone
    ].some((field) => (field || '').toString().toLowerCase().includes(normalizedTerm));
};

const loadAndRenderClients = async (clientRepo, tableContainer, page = 1, limit = 10, search = '') => {
    try {
        let clients;
        let meta;

        if (search) {
            const response = await clientRepo.getAll(`?limit=${CLIENT_SEARCH_FETCH_LIMIT}`);
            const payload = response.data || response;
            const allClients = Array.isArray(payload) ? payload : (payload.data || []);
            const filtered = allClients.filter((client) => clientMatchesSearch(client, search));

            const totalItems = filtered.length;
            const lastPage = Math.max(1, Math.ceil(totalItems / limit));
            const resolvedPage = Math.min(page, lastPage);
            const start = (resolvedPage - 1) * limit;
            
            clients = filtered.slice(start, start + limit);
            
            meta = {
                currentPage: resolvedPage,
                lastPage,
                totalItems,
                prevPage: resolvedPage > 1 ? resolvedPage - 1 : null,
                nextPage: resolvedPage < lastPage ? resolvedPage + 1 : null
            };

        } else {
            const queryString = `?page=${page}&limit=${limit}`;
            const response = await clientRepo.getAll(queryString);
            const payload = response.data || response;
            clients = Array.isArray(payload) ? payload : (payload.data || []);
            meta = payload.meta || null;
        }

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
    const searchInput = document.getElementById('client-search-input');
    const clearSearchBtn = document.getElementById('client-search-clear');

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

    const toggleClearButton = () => {
        if (!clearSearchBtn) return;
        clearSearchBtn.classList.toggle('hidden', currentSearchTerm.length === 0);
    };

    const debouncedSearch = debounce(async (term) => {
        currentSearchTerm = term.trim();
        currentPage = 1; // Toda nueva búsqueda reinicia la paginación
        toggleClearButton();
        await refreshView();
    }, 400);

    if (searchInput) {
        currentSearchTerm = searchInput.value.trim();
        toggleClearButton();

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value;

            if (term.trim() === '') {
                currentSearchTerm = '';
                currentPage = 1;
                toggleClearButton();
                refreshView();
                return;
            }

            debouncedSearch(term);
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            currentSearchTerm = '';
            currentPage = 1;
            toggleClearButton();
            refreshView();
            searchInput?.focus();
        });
    }

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