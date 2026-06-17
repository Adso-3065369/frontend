import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file ResetPasswordHandler.js
 * @version 1.0.0
 * @description Handler para restablecer la contraseña (simulado).
 * Valida que las contraseñas coincidan, simula la petición al backend
 * y redirige al login.
 * TODO: Reemplazar el bloque simulado por la llamada real:
 * const repo = createRepository('auth/reset-password');
 * await repo.create({ token, newPassword, confirmPassword });
 */
export const ResetPasswordHandler = async () => {
    const form = document.getElementById('form-reset-password');
    const successBox = document.getElementById('success-reset');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const newPassword = formData.get('newPassword')?.trim() ?? '';
        const confirmPassword = formData.get('confirmPassword')?.trim() ?? '';

        // Validación de campos individuales
        const rules = {
            newPassword: {
                required: true,
                minLength: 6,
                message: 'La contraseña debe tener al menos 6 caracteres.'
            },
            confirmPassword: {
                required: true,
                minLength: 6,
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

        // ─── SIMULACIÓN ────────────────────────────────────────────────────────
        // TODO: Reemplazar por la llamada real al backend cuando esté disponible:
        // const token = formData.get('token');
        // const repo = createRepository('auth/reset-password');
        // await repo.create({ token, newPassword, confirmPassword });
        await new Promise(resolve => setTimeout(resolve, 1200));
        // ───────────────────────────────────────────────────────────────────────

        // Ocultar formulario y mostrar éxito
        form.classList.add('hidden');
        if (successBox) successBox.classList.remove('hidden');

        // Restaurar botón
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
            window.location.hash = '#/login';
        }, 2000);
    });
};
