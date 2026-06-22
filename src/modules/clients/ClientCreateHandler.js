import { createRepository } from '@/repositories';
import { validateForm, displayFormErrors, clientRules } from '@/utils';

/**
 * @file ClientCreateHandler.js
 * @description Orquestador estricto para el registro de clientes.
 * Implementa un mapeo de errores 100% dinámico acoplado al contrato del API.
 */

const submitToServer = async (formData, clientRepo, submitBtn, form) => {
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Guardando...</span>';
    submitBtn.disabled = true;

    try {
        const newClientPayload = {
            document_number: formData.get('document_number').trim(),
            name: formData.get('name').trim(),
            email: formData.get('email').trim().toLowerCase(),
            phone: formData.get('phone').trim()
        };

        await clientRepo.create(newClientPayload);
        window.location.hash = '#/clientes';
        
    } catch (error) {
        console.error("Fallo transaccional detectado:", error);
        
        // 1. Reversión visual obligatoria del estado del botón
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // 2. Extracción y normalización del mensaje de error
        const serverMessage = error.response?.data?.message || error.message || "";
        const normalizedMessage = serverMessage.toLowerCase();
        const serverErrors = error.response?.data?.errors;

        // 3. ESCENARIO IDEAL: DTO Estructurado Estricto (Debe ser Objeto {} y NO un Array [])
        if (serverErrors && typeof serverErrors === 'object' && !Array.isArray(serverErrors) && Object.keys(serverErrors).length > 0) {
            displayFormErrors(form, serverErrors);
            return; 
        }

        // 4. ESCENARIO DE CONTINGENCIA: Mapeo Semántico Dinámico (Atrapa Arrays o mensajes planos)
        const semanticDictionary = {
            document_number: ['documento', 'cedula', 'nit', 'identificacion', 'document_number'],
            email: ['correo', 'email', 'mail', 'usuario'],
            phone: ['telefono', 'phone', 'celular'],
            name: ['nombre', 'razon', 'name']
        };

        const dynamicErrors = {};

        // Búsqueda pura de coincidencias
        Object.entries(semanticDictionary).forEach(([fieldName, keywords]) => {
            if (keywords.some(keyword => normalizedMessage.includes(keyword))) {
                // Si la cadena "documento" existe en el error, lo asigna a la llave 'document_number'
                dynamicErrors[fieldName] = serverMessage;
            }
        });

        // 5. Inyección en la interfaz
        if (Object.keys(dynamicErrors).length > 0) {
            displayFormErrors(form, dynamicErrors);
        } else {
            // Fallback genérico para errores críticos no mapeados
            alert(`Fallo sistémico del servidor:\n${serverMessage}`);
        }
    }
};

export const ClientCreateHandler = async () => {
    const clientRepo = createRepository('clients');
    const form = document.getElementById('client-create-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const { isValid, errors } = validateForm(formData, clientRules);
        displayFormErrors(form, errors);

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        await submitToServer(formData, clientRepo, submitBtn, form);
    });
};