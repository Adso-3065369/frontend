/**
 * @file validator.js
 * @description Motor centralizado para validación y renderizado de feedback en formularios.
 * Refactorizado para soportar expresiones regulares y asignación específica de mensajes.
 */

export const validateForm = (formData, rules) => {
    let isValid = true;
    const errors = {};

    Object.entries(rules).forEach(([fieldName, rule]) => {
        const values = formData.get(fieldName);
        const value = values !== null ? String(values).trim() : '';

        const isEmpty = value === '';

        // 1. Regla: Requerido (Frena la evaluación si el campo obligatorio está vacío)
        if (rule.required && isEmpty) {
            isValid = false;
            errors[fieldName] = rule.requiredMessage || rule.message || 'Este campo es obligatorio.';
            return; 
        }

        // Si el campo opcional está vacío, no se evalúan las restricciones de formato
        if (isEmpty) return;



        // 2. Regla: Longitud Mínima
        if (rule.minLength && typeof value === 'string' && value.trim().length < rule.minLength) {
            isValid = false;
            errors[fieldName] = rule.minLengthMessage || rule.message || `Debe contener al menos ${rule.minLength} digitos.`;
            return;
        }

        if (rule.maxLength && typeof value === 'string' && value.trim().length > rule.maxLength) {
            isValid = false;
            errors[fieldName] = rule.maxLengthMessage || rule.message || `Debe contener como máximo ${rule.maxLength} digitos.`;
            return;
        }

        // 3. Regla: Expresión Regular (Patrón de formato para Correo, Teléfono, etc.)
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
            isValid = false;
            errors[fieldName] = rule.patternMessage || rule.message || 'El formato de este campo no es válido.';
            return;
        }
    });

    return { isValid, errors };
};

export const displayFormErrors = (form, errors = {}) => {
    if (!form) return;

    // Limpieza total de estados previos
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));

    if (!errors || Object.keys(errors).length === 0) return;

    Object.entries(errors).forEach(([fieldName, message]) => {
        const inputs = form.querySelectorAll(`[name="${fieldName}"]`);
        if (!inputs || inputs.length === 0) return;

        const errorNode = document.createElement('p');
        errorNode.className = 'error-message text-red-600 text-sm font-bold mt-2';
        errorNode.textContent = message;

        const firstInput = inputs[0];

        if (firstInput.type === 'checkbox' || firstInput.type === 'radio') {
            const container = document.getElementById(`${fieldName}-container`);
            if (container) {
                container.insertAdjacentElement('afterend', errorNode);
            } else {
                firstInput.closest('div').insertAdjacentElement('afterend', errorNode);
            }
        } else {
            firstInput.classList.add('border-red-500');
            firstInput.insertAdjacentElement('afterend', errorNode);
        }
    });
};

export const clientRules = {
    document_number: {
        required: true,
        minLength: 7,
        minLengthMessage: 'El documento debe tener mínimo 7 dígitos.',
        maxLength: 10,
        maxLengthMessage: 'El documento debe tener máximo 10 dígitos.',
        pattern: /^[0-9]+$/,
        patternMessage: 'El documento debe contener exclusivamente números.'
    },
    name: {
        required: true,
        minLength: 3,
        minLengthMessage: 'El nombre debe tener mínimo 3 caracteres.',
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
        patternMessage: 'El nombre solo debe contener letras.'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Ingrese un formato de correo válido (ejemplo@gmail.com).'
    },
    phone: {
        required: true,
        pattern: /^[0-9]{10}$/,
        patternMessage: 'El teléfono solo debe contener 10 dígitos.'
    }
};