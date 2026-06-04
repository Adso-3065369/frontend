import { createRepository } from '@/repositories';
import { Select } from '@/components/ui';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file ProductEditHandler.js
 * @description Orquesta la edición de productos separando las responsabilidades de 
 * inicialización visual, validación de eventos y comunicación con el servidor.
 */

// ============================================================================
// 1. FASE DE INICIALIZACIÓN: Carga de datos y renderizado del DOM
// ============================================================================
const initializeView = async (productId, productRepo, categoryRepo) => {
    const mountContainer = document.getElementById('category-select-container');

    try {
        // 🚀 AJUSTE: Petición concurrente forzando el modo plano para las categorías
        const [categoryResponse, productResponse] = await Promise.all([
            categoryRepo.getAll('?paginate=false'),
            productRepo.getById(productId)
        ]);

        // 🚀 AJUSTE: Extracción segura del arreglo de categorías
        const catPayload = categoryResponse.data || categoryResponse;
        const categories = Array.isArray(catPayload) ? catPayload : (catPayload.data || []);

        // Manejo defensivo en caso de que el backend empaquete en 'data'
        const product = productResponse?.data || productResponse;

        if (!product) {
            alert("El producto especificado no existe o fue eliminado del sistema.");
            window.location.hash = '#/productos';
            return;
        }

        // Inyección de valores estándar en los inputs del DOM
        document.getElementById('productId').value = product.id;
        document.getElementById('productCode').value = product.code || '';
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productStock').value = product.stock || 0;

        // Mapeo de categorías y evaluación estricta de selección
        const formattedOptions = categories.map(cat => ({
            value: cat.id,
            text: cat.name,
            selected: String(cat.id) === String(product.category_id || product.categoryId)
        }));

        if (mountContainer) {
            mountContainer.innerHTML = Select({
                label: 'Categoría',
                id: 'productCategory',
                name: 'productCategory',
                required: true,
                options: formattedOptions,
                placeholder: 'Seleccione una categoría...'
            });
        }

    } catch (error) {
        console.error("Error crítico al cargar la información del sistema:", error);
        alert("No se pudo recuperar la información del producto. Verifique la conexión.");
        window.location.hash = '#/productos';
    }
};

// ============================================================================
// 2. FASE DE SERVIDOR: Sanitización y ejecución de la transacción (API)
// ============================================================================
const submitToServer = async (productId, formData, form, productRepo, submitBtn) => {
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Actualizando...</span>';
    submitBtn.disabled = true;

    try {
        // CONSTRUCCIÓN DEL PAYLOAD ESTRICTO
        const updatedProductPayload = {
            code: formData.get('productCode').trim().toUpperCase(),
            name: formData.get('productName').trim(),
            price: parseFloat(formData.get('productPrice')),
            stock: parseInt(formData.get('productStock'), 10),
            category_id: parseInt(formData.get('productCategory'), 10)
        };

        await productRepo.update(productId, updatedProductPayload);
        
        alert("El registro ha sido actualizado con éxito en el sistema.");
        window.location.hash = '#/productos';
        
    } catch (error) {
        console.error("Fallo durante la transacción de actualización:", error);
        
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        const serverMessage = error.response?.data?.message || error.message || "Ocurrió un error al intentar guardar los cambios.";
        const normalizedMessage = serverMessage.toLowerCase();
        const serverErrors = error.response?.data?.errors;

        // DTO Estructurado (Validaciones Zod)
        if (serverErrors && typeof serverErrors === 'object' && !Array.isArray(serverErrors) && Object.keys(serverErrors).length > 0) {
            displayFormErrors(form, serverErrors);
            return; 
        }

        // Mapeo Semántico Dinámico (Ej: Atrapar código duplicado al actualizar)
        const semanticDictionary = {
            productCode: ['código', 'codigo', 'sku', 'code', 'duplicado', 'ya existe'],
            productName: ['nombre', 'name'],
            productCategory: ['categoría', 'category'],
            productStock: ['stock', 'inventario', 'cantidad', 'existencias']
        };

        const dynamicErrors = {};

        Object.entries(semanticDictionary).forEach(([fieldName, keywords]) => {
            if (keywords.some(keyword => normalizedMessage.includes(keyword))) {
                dynamicErrors[fieldName] = serverMessage;
            }
        });

        if (Object.keys(dynamicErrors).length > 0) {
            displayFormErrors(form, dynamicErrors);
        } else {
            alert(`Fallo del servidor:\n${serverMessage}`);
        }
    }
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL: Eventos y Validaciones (Exportación Central)
// ============================================================================
export const ProductEditHandler = async (params) => {
    const productRepo = createRepository('products');
    const categoryRepo = createRepository('categories');
    
    const productId = params.id;
    const form = document.getElementById('form-edit-product');

    if (!form) return;

    await initializeView(productId, productRepo, categoryRepo);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const rules = {
            productCode: {
                required: true,
                minLength: 3,
                pattern: /^[A-Z0-9\-]+$/i,
                patternMessage: 'El código solo puede contener letras, números y guiones.',
                message: 'El código (SKU) es obligatorio.'
            },
            productName: {
                required: true,
                minLength: 3,
                message: 'El nombre del producto es obligatorio y debe contener al menos 3 caracteres.'
            },
            productPrice: {
                required: true,
                message: 'El precio unitario es obligatorio.'
            },
            productStock: {
                required: true,
                pattern: /^[0-9]+$/,
                patternMessage: 'El stock debe ser un número entero válido.',
                message: 'El stock es obligatorio.'
            },
            productCategory: {
                required: true,
                message: 'Debe seleccionar una categoría válida.'
            }
        };

        const { isValid, errors } = validateForm(formData, rules);
        displayFormErrors(form, errors);

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Pasamos 'form' como argumento adicional para el displayFormErrors
        await submitToServer(productId, formData, form, productRepo, submitBtn);
    });
};