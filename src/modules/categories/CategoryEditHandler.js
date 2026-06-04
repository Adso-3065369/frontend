import { createRepository } from '@/repositories';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file CategoryEditHandler.js
 * @description Orquestador para la lógica de edición de categorías aplicando 
 * separación de responsabilidades, sanitización de datos y control de estado UI.
 */

// ============================================================================
// 1. FASE DE INICIALIZACIÓN: Carga de datos y renderizado del DOM
// ============================================================================
const initializeView = async (categoryId, categoryRepo) => {
    const inputName = document.getElementById('categoryName');

    try {
        const { data: category } = await categoryRepo.getById(categoryId);            
        
        if (category) {
            if (inputName) {
                // Inyección del valor original en el input
                inputName.value = category.name;
            }
        } else {
            alert("La categoría seleccionada no existe en el sistema.");
            window.location.hash = '#/categorias';
        }
    } catch (error) {
        console.error("Error al cargar la categoría:", error);
        alert("No se pudo recuperar la información de la categoría.");
        window.location.hash = '#/categorias';
    }
};

// ============================================================================
// 2. FASE DE SERVIDOR: Sanitización y ejecución de la transacción (API)
// ============================================================================
const submitToServer = async (categoryId, formData, categoryRepo, submitBtn) => {
    // Control de concurrencia visual y UX
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Guardando cambios...</span>';
    submitBtn.disabled = true;

    try {
        // CONSTRUCCIÓN DEL PAYLOAD (Data Sanitization)
        // 🚀 OMITIMOS el uso de "...currentCategoryData" para no romper la regla .strict() de Zod
        const updatedCategoryPayload = {
            name: formData.get('categoryName').trim()
        };

        // Actualización asíncrona mediante el repositorio funcional
        await categoryRepo.update(categoryId, updatedCategoryPayload);
        
        alert("Categoría actualizada con éxito.");
        window.location.hash = '#/categorias';
        
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        
        // Extracción dinámica del mensaje de error devuelto por la API
        const errorMessage = error.message || "Hubo un fallo al intentar guardar los cambios en el servidor.";
        alert(errorMessage);
        
        // Re-estabilizar la interfaz gráfica para nuevos intentos
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL: Eventos y Validaciones
// ============================================================================
export const CategoryEditHandler = async (params) => {
    // Instanciación funcional de los repositorios
    const categoryRepo = createRepository('categories');
    const form = document.getElementById('form-edit-category');
    const categoryId = params.id;
    
    if (!form) return;

    // Lanzamiento de la fase de inicialización
    await initializeView(categoryId, categoryRepo);

    // Control y procesamiento del evento submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Extracción modular a través de la API nativa de formularios
        const formData = new FormData(form);

        // Reglas de integridad centralizadas
        const rules = {
            categoryName: {
                required: true,
                minLength: 3,
                message: 'El nombre de la categoría es obligatorio y debe tener al menos 3 caracteres.'
            }
        };

        // Pasar datos por el motor central de validación
        const { isValid, errors } = validateForm(formData, rules);
        displayFormErrors(form, errors);

        // Intercepción del flujo (fail-fast) en caso de no cumplir las directrices
        if (!isValid) return;

        // Delegación de la petición a la fase de servidor
        const submitBtn = form.querySelector('button[type="submit"]');
        await submitToServer(categoryId, formData, categoryRepo, submitBtn);
    });
};