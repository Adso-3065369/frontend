import { createRepository } from '@/repositories';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file ResetPasswordHandler.js
 * @version 1.0.0
 * @description Handler para restablecer la contraseña.
 * Valida que las contraseñas coincidan y hace la petición real al backend.
 */
export const ResetPasswordHandler = async () => {
    const form = document.getElementById('form-reset-password');
    const successBox = document.getElementById('success-reset');
    const repo = createRepository('auth/reset-password');

    if (!form) return;

    // Manejar la visualización de la contraseña (Ojo)
    const toggleButtons = form.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');

            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('ri-eye-line');
                    icon.classList.add('ri-eye-off-line');
                } else {
                    input.type = 'password';
                    icon.classList.remove('ri-eye-off-line');
                    icon.classList.add('ri-eye-line');
                }
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const newPassword = formData.get('newPassword')?.trim() ?? '';
        const confirmPassword = formData.get('confirmPassword')?.trim() ?? '';

        // Reglas de validación visual del frontend
        const rules = {
            newPassword: {
                required: true,
                minLength: 8,
                isStrongPassword: true,
                minLengthMessage: 'La contraseña debe tener al menos 8 caracteres.',
                strongMessage: 'La contraseña debe contener al menos una mayúscula (A-Z), una minúscula (a-z) y un número (0-9).'
            },
            confirmPassword: {
                required: true,
                minLength: 8,
                message: 'Confirme su contraseña.'
            }
        };

        const { isValid, errors } = validateForm(formData, rules);

        // Validación extra: las contraseñas deben coincidir
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        displayFormErrors(form, errors);

        const hasErrors = !isValid || errors.confirmPassword;
        if (hasErrors) return;

        // Estado de carga
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Procesando...</span>';
        submitBtn.disabled = true;

        // Obtener el token desde el hash de la URL
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const token = urlParams.get('token') || '';

        try {
            // Llamada real al backend enviando el token y la nueva contraseña
            await repo.create({ token, password: newPassword });

            // Ocultar formulario y mostrar éxito
            form.classList.add('hidden');
            if (successBox) successBox.classList.remove('hidden');

            // Redirigir al login después de 2.5 segundos
            setTimeout(() => {
                window.location.hash = '#/login';
            }, 2500);

        } catch (error) {
            console.error("[ResetPassword] Error al cambiar la contraseña:", error);
            const serverMessage = error.response?.data?.message || 'Token inválido o expirado.';
            const serverErrors = error.response?.data?.errors;

            if (serverErrors && typeof serverErrors === 'object') {
                // Si el backend arrojó errores específicos de Zod (ej. contraseña débil)
                displayFormErrors(form, { newPassword: serverErrors.password || serverMessage });
            } else {
                displayFormErrors(form, { newPassword: serverMessage });
            }
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
};
