import { createRepository } from '@/repositories';
import { DataTable, Link, Button, Pagination, Badge } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file CategoryListHandler.js
 * @description Orquestador del listado de categorías. Consume el backend paginado
 * y gestiona las acciones de UI (eliminación con control de integridad referencial).
 */

// ============================================================================
// 1. CONTRATO DE COLUMNAS (Data Definition)
// ============================================================================
const categoryColumns = [
    {
        header: 'ID',
        accessor: 'id',
        render: (category) => `<span class="font-mono text-gray-400">#${category.id}</span>`
    },
    {
        header: 'Nombre de la Categoría',
        accessor: 'name',
        render: (category) => `<span class="font-bold text-white uppercase">${category.name}</span>`
    },
    {
        header: 'Dependencias (Productos)',
        accessor: 'product_count',
        render: (category) => {
            if (category.product_count > 0) {
                return Badge({
                    text: `${category.product_count} vinculados`,
                    variant: 'info'
                });
            }
            return Badge({ text: 'Vacía', variant: 'warning' });
        }
    },
    {
        header: 'Acciones',
        accessor: 'actions',
        render: (category) => `
            <div class="flex items-center justify-end gap-2">
                ${RenderIf('categories.update',
                    Link({
                        href: `#/categorias/editar/${category.id}`,
                        variant: 'outline-primary',
                        size: 'sm',
                        icon: '<i class="ri-pencil-line"></i>',
                        className: 'justify-center w-8 h-8 p-0',
                        title: 'Modificar Categoría'
                    })
                )}
                ${RenderIf('categories.delete',
                    Button({
                        variant: 'danger',
                        icon: '<i class="ri-delete-bin-line"></i>',
                        className: 'w-8 h-8 p-0 flex items-center justify-center',
                        title: category.has_products ? 'No se puede eliminar (Tiene productos)' : 'Eliminar Categoría',
                        disabled: category.has_products,
                        dataset: { action: 'delete', id: category.id }
                    })
                )}
            </div>
        `
    }
];

// ============================================================================
// 2. FASE DE CARGA DE DATOS Y RENDERIZADO
// ============================================================================
const loadAndRenderCategories = async (categoryRepo, tableContainer, page = 1, limit = 10, search = '') => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const queryString = `?page=${page}&limit=${limit}${searchParam}`;

        const response = await categoryRepo.getAll(queryString);
        
        // Desempaquetado dual: Capa Axios + Capa DTO del Controlador Backend
        const payload = response.data || response;
        const categories = Array.isArray(payload) ? payload : (payload.data || []);
        const meta = payload.meta || null;
        
        const tableHtml = DataTable({
            columns: categoryColumns,
            data: categories,
            emptyMessage: search 
                ? 'No se encontraron categorías bajo estos criterios.' 
                : 'El catálogo de categorías está vacío.'
        });

        // Inyección del componente genérico
        const paginationHtml = meta ? Pagination({ meta, itemName: 'categorías' }) : '';

        tableContainer.innerHTML = tableHtml + paginationHtml;
        
        return categories;
    } catch (error) {
        console.error("Fallo de red o servidor al obtener categorías:", error);
        tableContainer.innerHTML = `
            <div class="p-6 text-center text-red-500 font-bold bg-red-500/10 border border-red-500 m-4 rounded-lg">
                Fallo de comunicación con el servidor al cargar la matriz de categorías.
            </div>
        `;
        return [];
    }
};

// ============================================================================
// 3. LÓGICA DE ELIMINACIÓN (Con captura de código 409 Conflicto)
// ============================================================================
const handleHardDelete = async (btnElement, categoryRepo, refreshCallback) => {
    const id = btnElement.dataset.id;
    
    if (!confirm('ADVERTENCIA: ¿Confirma la eliminación permanente de esta categoría?')) return;
        
    const originalContent = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
    btnElement.disabled = true;

    try {
        await categoryRepo.delete(id);
        await refreshCallback(); 
    } catch (error) {
        console.error("Transacción de eliminación abortada:", error);
        
        // Manejo del error 409 (Integridad referencial) inyectado desde el backend
        const errorMessage = error.response?.data?.message || error.message || "Fallo crítico al intentar eliminar el registro.";
        alert(`Operación denegada:\n${errorMessage}`);
        
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
    }
};

// ============================================================================
// 4. ORQUESTADOR PRINCIPAL
// ============================================================================
export const CategoryListHandler = async () => {
    const categoryRepo = createRepository('categories');
    const tableContainer = document.getElementById('categories-table-container');

    if (!tableContainer) return;

    // Control de Estado Local
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentSearchTerm = ''; // Expandible si implementa un input de búsqueda en la UI

    const refreshView = async () => {
        await loadAndRenderCategories(
            categoryRepo, 
            tableContainer, 
            currentPage, 
            itemsPerPage, 
            currentSearchTerm
        );
    };

    // Renderizado base inicial
    await refreshView();
    
    // Delegación centralizada de eventos (DOM Injection pattern)
    tableContainer.addEventListener('click', async (e) => {
        
        // --- EVENTO: Paginación ---
        const btnPaginate = e.target.closest('button[data-action="paginate"]');
        if (btnPaginate && !btnPaginate.disabled) {
            const newPage = parseInt(btnPaginate.dataset.page, 10);
            if (!isNaN(newPage)) {
                currentPage = newPage;
                await refreshView();
            }
            return;
        }
        
        // --- EVENTO: Eliminar ---
        const btnDelete = e.target.closest('button[data-action="delete"]');
        if (btnDelete && !btnDelete.disabled) {
            await handleHardDelete(btnDelete, categoryRepo, refreshView);
            return;
        }
    });
};