import { createRepository } from '@/repositories';
import { DataTable, Badge, Link, Button, Pagination } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file ProductListHandler.js
 * @description Orquestador del listado de productos con visibilidad de stock, gestión de estados y paginación desde el servidor.
 */

// ============================================================================
// 1. CONFIGURACIÓN DEL CONTRATO DE COLUMNAS
// ============================================================================
const productColumns = [
    {
        header: 'Código',
        accessor: 'code',
        render: (product) => `<div class="font-bold text-white">${product.code || 'S/N'}</div>`
    },
    {
        header: 'Nombre del Producto',
        accessor: 'name',
        render: (product) => `<div class="text-white">${product.name}</div>`
    },
    {
        header: 'Categoría',
        accessor: 'category',
        render: (product) => {
            const categoryName = product.category ? product.category : 'Sin Categoría';
            return `<span class="text-text-secondary">${categoryName}</span>`;
        }
    },
    {
        header: 'Precio Unit.',
        accessor: 'price',
        render: (product) => {
            const formattedPrice = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(product.price);
            return `<span class="font-mono text-white">${formattedPrice}</span>`;
        }
    },
    {
        header: 'Stock',
        accessor: 'stock',
        render: (product) => `<span class="font-mono text-white">${product.stock || 0}</span>`
    },
    {
        header: 'Estado',
        accessor: 'isActive',
        render: (product) => {
            const isCurrentlyActive = Number(product.isActive) !== 0;
            return Badge({
                text: isCurrentlyActive ? 'Activo' : 'Inactivo',
                variant: isCurrentlyActive ? 'success' : 'danger'
            });
        }
    },
    {
        header: 'Acciones',
        accessor: 'actions',
        render: (product) => {
            const isCurrentlyActive = Number(product.isActive) !== 0;

            return `
                <div class="flex items-center justify-end gap-2">
                    ${RenderIf('products.update',
                Button({
                    variant: isCurrentlyActive ? 'warning' : 'success',
                    icon: isCurrentlyActive ? '<i class="ri-eye-off-line"></i>' : '<i class="ri-eye-line"></i>',
                    className: 'w-8 h-8 p-0 flex items-center justify-center',
                    title: isCurrentlyActive ? 'Desactivar Producto' : 'Activar Producto',
                    dataset: { action: 'toggle', id: product.id }
                })
            )}
                    ${RenderIf('products.update',
                Link({
                    href: `#/productos/editar/${product.id}`,
                    variant: 'outline-primary',
                    size: 'sm',
                    icon: '<i class="ri-pencil-line"></i>',
                    className: 'justify-center w-8 h-8 p-0'
                })
            )}
                    ${RenderIf('products.delete',
                Button({
                    variant: 'danger',
                    icon: '<i class="ri-delete-bin-line"></i>',
                    className: 'w-8 h-8 p-0 flex items-center justify-center',
                    title: 'Eliminar Permanente',
                    dataset: { action: 'delete', id: product.id }
                })
            )}
                </div>
            `;
        }
    }
];

// ============================================================================
// 2. FASE DE CARGA DE DATOS Y RENDERIZADO
// ============================================================================

/**
 * Se agregaron los parámetros sortBy y sortOrder para permitir
 * enviar al backend el campo y la dirección del ordenamiento.
 *
 * Valores por defecto:
 * - sortBy = 'name': ordena inicialmente por nombre.
 * - sortOrder = 'ASC': aplica un orden ascendente.
 */

const loadAndRenderProducts = async (productRepo, tableContainer, page = 1, limit = 10, search = '',  sortBy = 'name',
    sortOrder = 'ASC') => {
    try {
        const searchParam = search ? `&name=${encodeURIComponent(search)}` : '';
        const queryString =`?page=${page}&limit=${limit}${searchParam}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

        const response = await productRepo.getAll(queryString);

        const payload = response.data || response;
        const products = payload.data || [];
        const meta = payload.meta || null;

        const tableHtml = DataTable({
            columns: productColumns,
            data: products,
            emptyMessage: search
                ? 'No se encontraron productos que coincidan con la búsqueda.'
                : 'No hay productos registrados en el inventario.'
        });

        // 🚀 Ajuste: Consumo del componente estandarizado de paginación
        const paginationHtml = meta ? Pagination({ meta }) : '';

        tableContainer.innerHTML = tableHtml + paginationHtml;

        return products;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        tableContainer.innerHTML = `
            <div class="p-6 text-center text-red-500 font-bold bg-red-500/10 border border-red-500 m-4 rounded-lg">
                Error de conexión con el servidor al intentar cargar el catálogo.
            </div>
        `;
        return [];
    }
};

// ============================================================================
// 3. LÓGICA DE ESTADO (Toggle Activo/Inactivo)
// ============================================================================
const handleToggleStatus = async (btnElement, currentProducts, productRepo, refreshCallback) => {
    const id = btnElement.dataset.id;
    const productToToggle = currentProducts.find(p => String(p.id) === String(id));
    if (!productToToggle) return;

    const isCurrentlyActive = Number(productToToggle.isActive) !== 0;
    const newStatus = !isCurrentlyActive;

    if (!confirm(`¿Está seguro de que desea ${isCurrentlyActive ? 'desactivar' : 'activar'} el producto "${productToToggle.name}"?`)) return;

    const originalContent = btnElement.innerHTML;
    btnElement.disabled = true;
    btnElement.innerHTML = '<span class="animate-pulse">...</span>';

    try {
        await productRepo.updateStatus(id, { isActive: newStatus });
        alert(`Producto ${newStatus ? 'activado' : 'desactivado'} exitosamente.`);
        await refreshCallback();
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || error.message || "Error al actualizar el estado.");
        btnElement.disabled = false;
        btnElement.innerHTML = originalContent;
    }
};

// ============================================================================
// 4. LÓGICA DE ELIMINACIÓN (Hard Delete)
// ============================================================================
const handleHardDelete = async (btnElement, productRepo, refreshCallback) => {
    const id = btnElement.dataset.id;

    if (!confirm('ADVERTENCIA: ¿Está seguro de eliminar este producto del inventario de forma permanente? Esta acción no se puede deshacer.')) return;

    const originalContent = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
    btnElement.disabled = true;

    try {
        await productRepo.delete(id);
        await refreshCallback();
    } catch (error) {
        console.error("Error durante la eliminación:", error);
        alert(error.message || "Error al intentar eliminar el producto.");

        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
    }
};

// ============================================================================
// 5. ORQUESTADOR PRINCIPAL
// ============================================================================
export const ProductListHandler = async () => {
  const productRepo = createRepository('products');
  const tableContainer = document.getElementById('products-table-container');
  const sortSelect = document.getElementById('sort-price');

  if (!tableContainer) return;

  let currentProducts = [];
  let currentPage = 1;
  const itemsPerPage = 10;
  let currentSearchTerm = '';
  let currentSortBy = 'name';
  let currentSortOrder = 'ASC';


  const refreshView = async () => {
    currentProducts = await loadAndRenderProducts(
      productRepo,
      tableContainer,
      currentPage,
      itemsPerPage,
      currentSearchTerm,
      currentSortBy,
      currentSortOrder
    );
  };

  
  await refreshView();

  /**
  * Evento que detecta el cambio en el selector de ordenamiento.
  *
  * Obtiene el campo y el tipo de orden seleccionados por el usuario,
  * actualiza las variables de control, reinicia la paginación a la
  * primera página y recarga el listado de productos aplicando el
  * nuevo criterio de ordenamiento.
  */
  
 sortSelect?.addEventListener('change', async(e) => {
 
 const [sortBy, sortOrder] = e.target.value.split('-');
 
 currentSortBy = sortBy;
 currentSortOrder = sortOrder;
 
 currentPage = 1;
 
 await refreshView();
    tableContainer.addEventListener('click', async (e) => {
        const btnPaginate = e.target.closest('button[data-action="paginate"]');
        if (btnPaginate && !btnPaginate.disabled) {
            const newPage = parseInt(btnPaginate.dataset.page, 10);
            if (!isNaN(newPage)) {
                currentPage = newPage;
                await refreshView();
            }
            return;
        }

        const btnToggleStatus = e.target.closest('button[data-action="toggle"]');
        if (btnToggleStatus) {
            await handleToggleStatus(btnToggleStatus, currentProducts, productRepo, refreshView);
            return;
        }

        const btnDelete = e.target.closest('button[data-action="delete"]');
        if (btnDelete) {
            await handleHardDelete(btnDelete, productRepo, refreshView);
            return;
        }
    });

    //filtro busqueda por nombre
    //Lógica de Búsqueda (Input Event)
    const searchInput = document.getElementById('search-product-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                currentSearchTerm = e.target.value.trim();
                currentPage = 1; // Reseteamos a la página 1 en cada nueva búsqueda
                await refreshView();
            }, 500); // 500ms de debounce para no saturar el backend
        });
    }
 
});

};