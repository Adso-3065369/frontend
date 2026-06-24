import { createRepository } from '@/repositories';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file CategoryCreateHandler.js
 * @description Orquestador para el registro de categorías aplicando 
 * separación de responsabilidades, sanitización de datos y control de estado UI.
 */

// ============================================================================
// 1. FASE DE INICIALIZACIÓN (Entidad Raíz)
// ============================================================================
// A diferencia de Productos o Roles, la creación de Categorías es una entidad 
// raíz que no depende de catálogos externos para renderizar su formulario.
// Por lo tanto, esta fase no requiere peticiones asíncronas de preparación.

// ============================================================================
// 2. FASE DE SERVIDOR: Sanitización y ejecución de la transacción (API)
// ============================================================================
const submitToServer = async (formData, categoryRepo, submitBtn) => {
    // Control de concurrencia visual y UX
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Guardando categoría...</span>';
    submitBtn.disabled = true;

    try {
        // CONSTRUCCIÓN DEL PAYLOAD (Data Sanitization)
        // El esquema categorySchema de Zod es estricto y solo espera la propiedad 'name'.
        const newCategoryPayload = {
            name: formData.get('categoryName').trim()
        };

        // Persistencia mediante el repositorio funcional
        await categoryRepo.create(newCategoryPayload);
        
        alert("Categoría creada exitosamente.");
        window.location.hash = '#/categorias';
        
    } catch (error) {
        console.error("Error al crear categoría:", error);
        
        // Extracción dinámica del mensaje de error desde la API
        const errorMessage = error.message || "No se pudo guardar la categoría. Verifique la conexión con el servidor.";
        alert(errorMessage);
        
        // Restaurar la interfaz si ocurre un error para permitir reintentos
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL: Eventos y Validaciones
// ============================================================================
export const CategoryCreateHandler = async () => {
    // Instanciación funcional de los repositorios
    const categoryRepo = createRepository('categories');
    const form = document.getElementById('form-create-category');

    if (!form) return;

    // Procesamiento del evento submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Extracción mediante la API nativa de DOM
        const formData = new FormData(form);

        // Reglas estructurales de validación centralizada
        const rules = {
            categoryName: {
                required: true,
                minLength: 3,
                //se aplica una regla para validar, que el nombre de la categoria no este vacio, no empiece con numeros o espacios, y que almenos cuente con 3 nnumero o letras, para evitar que se creen ccategorias con nombres invalido o vacios
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/,
                //para asegurarnos que funcione, debemos validar en el archivo utlis-index.js
                patternMessage: 'El nombre de la categoria debe comenzar con una letra y puede incluir numeros y espacios',
                message: 'El nombre de la categoría es obligatorio y debe tener al menos 3 caracteres.'
            }
        };

        // Ejecutar el motor de validación
        const { isValid, errors } = validateForm(formData, rules);
      displayFormErrors(form, errors);
      
      console.log("es valido el formulario", isValid);
      console.log("errores detectados", errors);
      

        // Control fail-fast: Interceptar el flujo si el formulario no cumple las reglas
      if (!isValid) return;
      


        // Delegación de la petición a la fase de servidor
        const submitBtn = form.querySelector('button[type="submit"]');
        await submitToServer(formData, categoryRepo, submitBtn);
    });
};