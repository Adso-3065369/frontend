import { createRepository } from '@/repositories';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file ConfigurationController.js
 * @description Lógica pura: Llena el formulario con datos de la API y maneja el envío de forma segura.
 */
export const ConfigurationController = async () => {
    // 1. Instanciar el repositorio
    const configRepo = createRepository('config');
    
    // 2. Capturar el formulario del DOM (inyectado previamente por el router)
    const form = document.getElementById('config-form');

    if (!form) {
        console.warn('El formulario de configuración no se encontró en el DOM.');
        return;
    }

    // =========================================================================
    // FASE 1: OBTENCIÓN DE DATOS Y LLENADO DEL FORMULARIO
    // =========================================================================
    try {
        // Deshabilitar botón mientras carga la data
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const currentConfig = await configRepo.getById(1).catch(() => ({
            businessName: '',
            nit: '',
            taxRate: 19
        }));

        // Llenar los campos visualmente apuntando a sus IDs
        const nameInput = document.getElementById('businessName');
        const nitInput = document.getElementById('nit');
        const taxInput = document.getElementById('taxRate');

        if (nameInput) nameInput.value = currentConfig.businessName || '';
        if (nitInput) nitInput.value = currentConfig.nit || '';
        if (taxInput) taxInput.value = currentConfig.taxRate || 19;

        // Rehabilitar botón una vez la data está lista
        if (submitBtn) submitBtn.disabled = false;

    } catch (error) {
        console.error('Error al cargar la configuración:', error);
    }

    // =========================================================================
    // FASE 2: MANEJO DEL EVENTO SUBMIT (Seguro y Nativo)
    // =========================================================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Extraer todos los datos del DOM de forma nativa
        const formData = new FormData(form);

        // 2. Definir las reglas estructurales de validación
        const rules = {
            businessName: { required: true, minLength: 3, message: 'El nombre del negocio es obligatorio.' },
            nit: { required: true, minLength: 5, message: 'El NIT es obligatorio y debe ser válido.' },
            taxRate: { required: true, message: 'El porcentaje de IVA es obligatorio.' }
        };

        // 3. Ejecutar el motor de validación
        const { isValid, errors } = validateForm(formData, rules);

        // 4. Manipular la interfaz visualmente (mostrar u ocultar errores)
        displayFormErrors(form, errors);

        // 5. Interceptar el flujo si el formulario no cumple las reglas
        if (!isValid) return;

        // 6. UX: Control de Concurrencia (Deshabilitar botón durante la petición)
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="animate-pulse">Guardando...</span>';
        submitBtn.disabled = true;

        try {
            // 7. Preparar el payload
            const payload = {
                businessName: formData.get('businessName').trim(),
                nit: formData.get('nit').trim(),
                taxRate: parseFloat(formData.get('taxRate')),
                updatedAt: new Date().toISOString()
            };

            // 8. Persistencia mediante el repositorio funcional
            await configRepo.update(1, payload);
            alert("Configuración actualizada exitosamente.");
            
        } catch (error) {
            console.error("Error al guardar configuración:", error);
            alert("No se pudo guardar la configuración. Verifique la conexión con el servidor.");
        } finally {
            // Restaurar la interfaz siempre al finalizar (éxito o error)
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
};