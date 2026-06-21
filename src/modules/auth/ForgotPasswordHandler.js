import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file ForgotPasswordHandler.js
 * @version 1.0.0
 * @description Handler de recuperación de contraseña (simulado).
 * Valida el correo y muestra el mensaje de éxito en pantalla.
 * Cuando el backend esté listo, reemplazar el bloque simulado
 * por: await repo.create({ email }) usando el endpoint /auth/forgot-password
 */
export const ForgotPasswordHandler = async () => {
    const form = document.getElementById('form-forgot-password');
    const successMessage = document.getElementById('success-message');

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

        // ─── SIMULACIÓN ────────────────────────────────────────────────────────
        // TODO: Reemplazar por la llamada real al backend cuando esté disponible:
        // const repo = createRepository('auth/forgot-password');
        // await repo.create({ email: formData.get('email').trim() });
        await new Promise(resolve => setTimeout(resolve, 1200));
        // ───────────────────────────────────────────────────────────────────────

        // Ocultar el formulario y mostrar confirmación
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');

        // Restaurar botón (por si el usuario hace back)
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
};
