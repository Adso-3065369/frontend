/**
 * @file validator.js
 * @description Motor centralizado para validación y renderizado de feedback en formularios.
 * Refactorizado para soportar expresiones regulares y asignación específica de mensajes.
 */

export const validateForm = (formData, rules) => {
    let isValid = true;
    const errors = {};

    Object.entries(rules).forEach(([fieldName, rule]) => {
        const values = formData.getAll(fieldName); 
        const value = values.length > 1 ? values : values[0]; 
        
        const isEmpty = !value || 
                        (typeof value === 'string' && value.trim() === '') || 
                        (Array.isArray(values) && values.length === 0);

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
            errors[fieldName] = rule.minLengthMessage || rule.message || `Debe contener al menos ${rule.minLength} caracteres.`;
            return;
        }

        // 3. Regla: Expresión Regular (Patrón de formato para Correo, Teléfono, etc.)
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
            isValid = false;
            errors[fieldName] = rule.patternMessage || rule.message || 'El formato de este campo no es válido.';
            return;
        }

        // 4. Regla: Correo Electrónico
        if (rule.isEmail && typeof value === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value.trim())) {
                isValid = false;
                errors[fieldName] = rule.emailMessage || rule.message || 'Ingrese un correo electrónico válido.';
                return;
            }
        }

        // 5. Regla: Contraseña Fuerte (mayúscula + minúscula + número)
        if (rule.isStrongPassword && typeof value === 'string') {
            const hasUppercase = /[A-Z]/.test(value);
            const hasLowercase = /[a-z]/.test(value);
            const hasNumber   = /[0-9]/.test(value);

            if (!hasUppercase || !hasLowercase || !hasNumber) {
                isValid = false;
                errors[fieldName] = rule.strongMessage || rule.message ||
                    'La contraseña debe contener al menos una mayúscula, una minúscula y un número.';
                return;
            }
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