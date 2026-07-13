import { createRepository } from '@/repositories';
import { Select } from '@/components/ui/';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file ProductCreateHandler.js
 * @description Orquesta el registro de nuevos productos separando las responsabilidades de 
 * inicialización visual, validación local y comunicación con la API.
 */

// ============================================================================
// 1. FASE DE INICIALIZACIÓN: Carga de dependencias relacionales
// ============================================================================
const initializeView = async (categoryRepo) => {
    const mountContainer = document.getElementById('category-select-container');
    
    if (!mountContainer) return;

    try {
        // 🚀 AJUSTE: Forzar modo plano e interceptar la estructura dinámica de la API
        const response = await categoryRepo.getAll('?paginate=false');
        
        const payload = response.data || response;
        const categories = Array.isArray(payload) ? payload : (payload.data || []);
        
        const formattedOptions = categories.map(cat => ({
            value: cat.id,
            text: cat.name
        }));

        mountContainer.innerHTML = Select({
            label: 'Categoría',
            id: 'productCategory',
            name: 'productCategory',
            required: true,
            options: formattedOptions,
            placeholder: 'Seleccione una categoría...'
        });

    } catch (error) {
        console.error("Error al cargar categorías:", error);
        mountContainer.innerHTML = Select({
            label: 'Categoría',
            id: 'productCategory',
            name: 'productCategory',
            disabled: true,
            variant: 'error',
            placeholder: 'Error de conexión al cargar categorías'
        });
    }
};

// ============================================================================
// 2. FASE DE SERVIDOR: Sanitización, Transacción y Fail-Fast Dinámico
// ============================================================================
const submitToServer = async (formData, form, productRepo, submitBtn) => {
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Guardando...</span>';
    submitBtn.disabled = true;

    try {
        // CONSTRUCCIÓN DEL PAYLOAD ESTRICTO
        const newProduct = {
            code: formData.get('productCode').trim().toUpperCase(),
            name: formData.get('productName').trim(),
            price: parseFloat(formData.get('productPrice')), 
            stock: parseInt(formData.get('productStock'), 10),
            category_id: parseInt(formData.get('productCategory'), 10)
        };

        await productRepo.create(newProduct);
        
        alert("Producto registrado exitosamente en el catálogo.");
        window.location.hash = '#/productos';
        
    } catch (error) {
        console.error("Error transaccional al registrar el producto:", error);
        
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        const serverMessage = error.response?.data?.message || error.message || "Fallo transaccional en el registro.";
        const normalizedMessage = serverMessage.toLowerCase();
        const serverErrors = error.response?.data?.errors;

        // DTO Estructurado (Validaciones Zod desde el backend)
        if (serverErrors && typeof serverErrors === 'object' && !Array.isArray(serverErrors) && Object.keys(serverErrors).length > 0) {
            displayFormErrors(form, serverErrors);
            return; 
        }

        // Mapeo Semántico Dinámico
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
// 3. ORQUESTADOR PRINCIPAL: Eventos y Validaciones
// ============================================================================
export const ProductCreateHandler = async () => {
    const categoryRepo = createRepository('categories');
    const productRepo = createRepository('products');
    
    const form = document.getElementById('form-create-product');
    if (!form) return;

    await initializeView(categoryRepo);

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
                pattern: /^(?!\s*\d+\s*$).+$/,
                patternMessage: 'El nombre del producto no puede ser puramente numérico.',
                message: 'El nombre es obligatorio y debe contener al menos 3 caracteres.'
            },
            productPrice: {
                required: true,
                pattern: /^\s*(?!0+(?:\.0+)?$)\d+(?:\.\d+)?\s*$/,
                patternMessage: 'El precio unitario debe ser un número mayor a 0.',
                message: 'El precio unitario es obligatorio.'
            },
            productStock: {
                required: true,
                pattern: /^[0-9]+$/,
                patternMessage: 'El stock debe ser un número entero válido (sin decimales ni signos).',
                message: 'El stock inicial es obligatorio.'
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
        await submitToServer(formData, form, productRepo, submitBtn);
    });
};