import { createRepository } from '@/repositories';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file ForgotPasswordHandler.js
 * @version 1.0.0
 * @description Handler de recuperación de contraseña.
 * Valida el correo, envía la petición al backend y muestra el mensaje de éxito.
 */
export const ForgotPasswordHandler = async () => {
    const form = document.getElementById('form-forgot-password');
    const successMessage = document.getElementById('success-message');
    const repo = createRepository('auth/forgot-password');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // Reglas de validación del correo
        const rules = {
            email: {
                required: true,
                isEmail: true,
                message: 'Por favor, ingrese un correo electrónico válido.'
            }
        };

        const { isValid, errors } = validateForm(formData, rules);
        displayFormErrors(form, errors);

        if (!isValid) return;

        // Estado de carga en el botón
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Enviando...</span>';
        submitBtn.disabled = true;

        try {
            // Realizar llamada al backend
            await repo.create({ email: formData.get('email').trim() });

            // Ocultar el formulario y mostrar confirmación
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
        } catch (error) {
            console.error("[ForgotPassword] Fallo al enviar recuperación:", error);
            const serverMessage = error.response?.data?.message || 'Error de conexión. Intente nuevamente.';
            displayFormErrors(form, { email: serverMessage });
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
};
