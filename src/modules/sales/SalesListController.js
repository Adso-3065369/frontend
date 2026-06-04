import { createRepository } from '@/repositories';
import { DataTable, Link, Button } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file SalesListHandler.js
 * @description Orquestador del listado de ventas con soporte para paginación desde el servidor.
 */

// ============================================================================
// 1. CONTRATO DE COLUMNAS (Data Definition)
// ============================================================================
const salesColumns = [
    {
        header: 'Código / Factura',
        accessor: 'id',
        render: (sale) => `<span class="font-mono text-gray-300 font-bold">#${sale.id}</span>`
    },
    {
        header: 'Fecha',
        accessor: 'created_at',
        render: (sale) => `<span class="text-text-secondary">${new Date(sale.created_at || sale.date).toLocaleDateString()}</span>`
    },
    {
        header: 'Cliente / Vendedor',
        accessor: 'entities',
        render: (sale) => `
            <div class="text-sm">
                <div class="font-bold text-white uppercase">${sale.client?.name || 'Consumidor Final'}</div>
                <div class="text-text-secondary text-xs mt-1">
                    <i class="ri-user-line mr-1"></i> Cajero: ${sale.user?.name || 'N/A'}
                </div>
            </div>
        `
    },
    {
        header: 'Monto Total',
        accessor: 'total',
        render: (sale) => `<span class="font-black text-brand text-lg">$${parseFloat(sale.total).toLocaleString('es-CO')}</span>`
    },
    {
        header: 'Acciones',
        accessor: 'actions',
        render: (sale) => `
            <div class="flex items-center justify-end gap-2">
                ${RenderIf('sales.view',
                    Link({
                        href: `#/ventas/detalle/${sale.id}`,
                        variant: 'outline-primary',
                        size: 'sm',
                        icon: '<i class="ri-eye-line"></i>',
                        className: 'justify-center w-8 h-8 p-0',
                        title: 'Ver detalle de la venta'
                    })
                )}
                ${RenderIf('sales.delete',
                    Button({
                        variant: 'danger',
                        icon: '<i class="ri-delete-bin-line"></i>',
                        className: 'w-8 h-8 p-0 flex items-center justify-center',
                        title: 'Anular Venta',
                        dataset: { action: 'delete', id: sale.id }
                    })
                )}
            </div>
        `
    }
];

// ============================================================================
// 2. GENERADOR DE PAGINACIÓN HTML
// ============================================================================
const generatePaginationHtml = (meta) => {
    if (!meta || meta.lastPage <= 1) return '';

    return `
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-700/50 bg-gray-800/20 sm:px-6 mt-4 rounded-b-lg">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-400">
                        Mostrando página <span class="font-medium text-white">${meta.currentPage}</span> de 
                        <span class="font-medium text-white">${meta.lastPage}</span> 
                        (Total: ${meta.totalItems} transacciones)
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        ${Button({
                            text: 'Anterior',
                            icon: '<i class="ri-arrow-left-s-line text-lg"></i>',
                            variant: 'outline-secondary',
                            disabled: !meta.prevPage,
                            dataset: { action: 'paginate', page: meta.prevPage },
                            // Se anula el borde derecho para unirlo al siguiente botón
                            className: 'rounded-r-none rounded-l-md focus:z-10 bg-gray-800/50'
                        })}
                        ${Button({
                            // Se inyecta el ícono en el texto para mantenerlo a la derecha
                            text: 'Siguiente <i class="ri-arrow-right-s-line text-lg"></i>',
                            variant: 'outline-secondary',
                            disabled: !meta.nextPage,
                            dataset: { action: 'paginate', page: meta.nextPage },
                            // Se anula el borde izquierdo para unirlo al botón anterior
                            className: 'rounded-l-none rounded-r-md focus:z-10 bg-gray-800/50'
                        })}
                    </nav>
                </div>
            </div>
        </div>
    `;
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL
// ============================================================================
export const SalesListHandler = async () => {
    const saleRepo = createRepository('sales');
    const tableContainer = document.getElementById('sales-table-container');

    if (!tableContainer) return;

    // Estado local de la paginación
    let currentPage = 1;
    const itemsPerPage = 10;

    const loadAndRenderSales = async () => {
        try {
            // Se envía la petición con los parámetros de paginación
            const queryString = `?page=${currentPage}&limit=${itemsPerPage}`;
            const response = await saleRepo.getAll(queryString);
            
            // Desempaquetado dual: cliente HTTP + estructura del controlador backend
            const payload = response.data || response;
            const sales = payload.data || [];
            const meta = payload.meta || null;
            
            // Inyección del DataTable
            const tableHtml = DataTable({
                columns: salesColumns,
                data: sales,
                emptyMessage: 'No hay transacciones registradas en el historial.'
            });

            // Inyección de los controles de paginación
            const paginationHtml = generatePaginationHtml(meta);

            tableContainer.innerHTML = tableHtml + paginationHtml;

        } catch (error) {
            console.error("Fallo de red al obtener el historial de ventas:", error);
            tableContainer.innerHTML = `
                <div class="p-6 text-center text-red-500 font-bold bg-red-500/10 border border-red-500 m-4 rounded-lg">
                    Fallo de comunicación con el servidor al intentar cargar las transacciones.
                </div>
            `;
        }
    };

    // Renderizado inicial
    await loadAndRenderSales();

    // ============================================================================
    // 4. DELEGACIÓN DE EVENTOS (Anulación y Paginación)
    // ============================================================================
    tableContainer.addEventListener('click', async (e) => {
        
        // --- EVENTO: Paginación ---
        const btnPaginate = e.target.closest('button[data-action="paginate"]');
        if (btnPaginate && !btnPaginate.disabled) {
            const newPage = parseInt(btnPaginate.dataset.page, 10);
            if (!isNaN(newPage)) {
                currentPage = newPage;
                await loadAndRenderSales();
            }
            return;
        }

        // --- EVENTO: Anulación de Venta ---
        const btnDelete = e.target.closest('button[data-action="delete"]');
        if (btnDelete) {
            const id = btnDelete.dataset.id;
            
            if (!confirm('ADVERTENCIA: ¿Está seguro de anular esta venta? El inventario será reversado. Esta acción es irreversible.')) {
                return;
            }

            const originalContent = btnDelete.innerHTML;
            btnDelete.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
            btnDelete.disabled = true;

            try {
                await saleRepo.delete(id);
                await loadAndRenderSales(); // Recarga la tabla en la misma página
            } catch (error) {
                console.error("Error al anular la venta:", error);
                const errorMessage = error.response?.data?.message || "Fallo transaccional al procesar la anulación.";
                alert(`Operación rechazada:\n${errorMessage}`);
                
                btnDelete.innerHTML = originalContent;
                btnDelete.disabled = false;
            }
        }
    });
};