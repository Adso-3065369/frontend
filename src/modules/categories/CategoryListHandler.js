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
                        className: `w-8 h-8 p-0 flex items-center justify-center ${category.hasLinkedProducts ? 'category-delete-disabled' : ''}`,
                        title: category.hasLinkedProducts ? '' : 'Eliminar Categoría',
                        disabled: false,
                        dataset: { 
                            action: category.hasLinkedProducts ? 'delete-disabled' : 'delete', 
                            id: category.id 
                        }
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
    let currentSearchTerm = ''; // Almacena el término ingresado en el buscador

    const refreshView = async () => {
        await loadAndRenderCategories(
            categoryRepo, 
            tableContainer, 
            currentPage, 
            itemsPerPage, 
            currentSearchTerm
        );
    };

    // Removemos suscripciones previas para evitar llamadas duplicadas por cambios de enrutador
    if (window.categoryFiltersChangedListener) {
        document.removeEventListener('category-filters-changed', window.categoryFiltersChangedListener);
    }

    // Definimos el callback cuando cambien los inputs del filtro
    window.categoryFiltersChangedListener = async (e) => {
        // Extraemos el nuevo término de búsqueda desde el detalle del evento
        const { searchTerm } = e.detail;
        currentSearchTerm = searchTerm;
        // Reiniciamos la visualización a la página uno al realizar una nueva búsqueda
        currentPage = 1;
        // Refrescamos la vista con los nuevos datos filtrados
        await refreshView();
    };

    // Escuchamos el evento de cambio de filtros lanzado desde la interfaz
    document.addEventListener('category-filters-changed', window.categoryFiltersChangedListener);

    // Renderizado base inicial
    await refreshView();
    
    // Configuración de tooltip flotante global
    let tooltipEl = document.getElementById('category-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'category-tooltip';
        tooltipEl.className = 'category-tooltip';
        tooltipEl.innerHTML = 'No se puede eliminar: esta categoría tiene productos vinculados<div class="category-tooltip-arrow"></div>';
        document.body.appendChild(tooltipEl);
    }
    
    // Ocultar al iniciar/refrescar la vista para evitar estados huérfanos
    tooltipEl.classList.remove('visible');
    tooltipEl.style.display = 'none';

    // Manejador del hover para tooltips en los botones deshabilitados
    tableContainer.addEventListener('mouseover', (e) => {
        const btnDeleteDisabled = e.target.closest('button[data-action="delete-disabled"]');
        if (btnDeleteDisabled) {
            tooltipEl.style.display = 'block';
            
            const rect = btnDeleteDisabled.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            const tooltipRect = tooltipEl.getBoundingClientRect();
            
            const x = rect.left + scrollLeft + (rect.width / 2) - (tooltipRect.width / 2);
            const y = rect.top + scrollTop - tooltipRect.height - 8;
            
            tooltipEl.style.left = `${x}px`;
            tooltipEl.style.top = `${y}px`;
            
            requestAnimationFrame(() => {
                tooltipEl.classList.add('visible');
            });
        }
    });

    tableContainer.addEventListener('mouseout', (e) => {
        const btnDeleteDisabled = e.target.closest('button[data-action="delete-disabled"]');
        if (btnDeleteDisabled && (!e.relatedTarget || !btnDeleteDisabled.contains(e.relatedTarget))) {
            tooltipEl.classList.remove('visible');
            setTimeout(() => {
                if (!tooltipEl.classList.contains('visible')) {
                    tooltipEl.style.display = 'none';
                }
            }, 200);
        }
    });

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

        // --- EVENTO: Intento de Eliminar Deshabilitado ---
        const btnDeleteDisabled = e.target.closest('button[data-action="delete-disabled"]');
        if (btnDeleteDisabled) {
            alert("No se puede eliminar: esta categoría tiene productos vinculados");
            return;
        }
    });
};