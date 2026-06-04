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
            const isCurrentlyActive = product.isActive !== false; 
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
            const isCurrentlyActive = product.isActive !== false;
            
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
const loadAndRenderProducts = async (productRepo, tableContainer, page = 1, limit = 10, search = '') => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const queryString = `?page=${page}&limit=${limit}${searchParam}`;

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

    const isCurrentlyActive = productToToggle.isActive !== false;
    
    if (!confirm(`¿Está seguro de que desea ${isCurrentlyActive ? 'desactivar' : 'activar'} el producto "${productToToggle.name}"?`)) return;
        
    btnElement.disabled = true;
    btnElement.innerHTML = '<span class="animate-pulse">...</span>';

    try {
        const updatedProductPayload = {
            code: productToToggle.code,
            name: productToToggle.name,
            price: parseFloat(productToToggle.price),
            stock: parseInt(productToToggle.stock, 10),
            category_id: parseInt(productToToggle.category_id || productToToggle.categoryId, 10),
            isActive: !isCurrentlyActive
        };

        await productRepo.update(id, updatedProductPayload);
        await refreshCallback(); 
    } catch (error) {
        console.error(error);
        alert(error.message || "Error al actualizar el estado.");
        await refreshCallback();
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

    if (!tableContainer) return;

    let currentProducts = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentSearchTerm = ''; 

    const refreshView = async () => {
        currentProducts = await loadAndRenderProducts(
            productRepo, 
            tableContainer, 
            currentPage, 
            itemsPerPage, 
            currentSearchTerm
        );
    };

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
};