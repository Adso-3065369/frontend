import { createRepository } from '@/repositories';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file ClientEditHandler.js
 * @description Orquestador estricto para la edición de clientes.
 * Gestiona el pre-llenado de datos y aplica mapeo de colisiones dinámico.
 */

// ============================================================================
// 1. FASE DE SERVIDOR: Transacción de Actualización (PUT/PATCH)
// ============================================================================
const submitToServer = async (clientId, formData, clientRepo, submitBtn, form) => {
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Actualizando...</span>';
    submitBtn.disabled = true;

    try {
        const updatePayload = {
            document_number: formData.get('document_number').trim(),
            name: formData.get('name').trim(),
            email: formData.get('email').trim().toLowerCase(),
            phone: formData.get('phone').trim()
        };

        // Invocación explícita al método de actualización del repositorio
        await clientRepo.update(clientId, updatePayload);
        window.location.hash = '#/clientes';
        
    } catch (error) {
        console.error("Fallo transaccional detectado en actualización:", error);
        
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        const serverMessage = error.response?.data?.message || error.message || "";
        const normalizedMessage = serverMessage.toLowerCase();
        const serverErrors = error.response?.data?.errors;

        // Escenario DTO Estructurado
        if (serverErrors && typeof serverErrors === 'object' && !Array.isArray(serverErrors) && Object.keys(serverErrors).length > 0) {
            displayFormErrors(form, serverErrors);
            return; 
        }

        // Mapeo Semántico Universal de Contingencia
        const semanticDictionary = {
            document_number: ['documento', 'cedula', 'nit', 'identificacion', 'document_number'],
            email: ['correo', 'email', 'mail', 'usuario'],
            phone: ['telefono', 'phone', 'celular'],
            name: ['nombre', 'razon', 'name']
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
            alert(`No se lograron guardar los cambios:\n${serverMessage}`);
        }
    }
};

// ============================================================================
// 2. FASE DE INICIALIZACIÓN: Extracción de ID y Población de Datos
// ============================================================================
const loadClientData = async (clientId, clientRepo, form) => {
    const loader = document.getElementById('initial-loader');
    
    try {
        // Petición de los datos maestros
        const { data: client } = await clientRepo.getById(clientId);
        
        // Población explícita mediante la colección elements del DOM
        form.elements['document_number'].value = client.document_number;
        form.elements['name'].value = client.name;
        form.elements['email'].value = client.email;
        form.elements['phone'].value = client.phone;

        // Retiro del bloqueo visual
        if (loader) loader.remove();
        form.classList.remove('opacity-0');

    } catch (error) {
        console.error("Error al cargar la entidad cliente:", error);
        alert("Registro no encontrado o conexión interrumpida.");
        window.location.hash = '#/clientes'; // Redirección forzada
    }
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL
// ============================================================================
export const ClientEditHandler = async () => {
    const hashParts = window.location.hash.split('/');
    const clientId = hashParts[hashParts.length - 1];

    if (!clientId || isNaN(clientId)) {
        window.location.hash = '#/clientes';
        return;
    }

    const clientRepo = createRepository('clients');
    const form = document.getElementById('client-edit-form');

    if (!form) return;

    // Ejecutar inicialización asíncrona antes de habilitar el submit
    await loadClientData(clientId, clientRepo, form);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        // Reglas de validación estandarizadas
        const rules = {
            document_number: {
                required: true,
                minLength: 7,
                maxLength: 10,
                pattern: /^[0-9]+$/,
                patternMessage: 'El documento debe contener exclusivamente números.'
            },
            name: { required: true, minLength: 3 },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                patternMessage: 'Ingrese un formato de correo válido.'
            },
            phone: {
                required: true,
                pattern: /^[0-9]{10}$/,
                patternMessage: 'El teléfono solo debe contener 10 digitos.'
            }
        };

        const { isValid, errors } = validateForm(formData, rules);
        displayFormErrors(form, errors);

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        await submitToServer(clientId, formData, clientRepo, submitBtn, form);
    });
};