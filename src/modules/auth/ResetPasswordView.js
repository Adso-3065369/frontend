import { Button, Input, Label } from '@/components/ui';

/**
 * @file ResetPasswordView.js
 * @version 1.0.0
 * @description Vista para restablecer la contraseña.
 * Lee el token desde el query string de la URL (?token=XXXX).
 * Si no hay token, muestra un aviso de enlace inválido.
 */
export const ResetPasswordView = async () => {
    // Leer token desde la URL: #/restablecer-contrasena?token=XXXX
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const token = params.get('token');

    // Vista cuando no hay token válido
    if (!token) {
        return `
            <section class="min-h-[80vh] flex items-center justify-center px-4 py-12">
                <div class="max-w-md w-full bg-bg-surface p-10 rounded-2xl shadow-xl border border-gray-800 text-center">
                    <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30">
                        <i class="ri-error-warning-line text-3xl text-red-400"></i>
                    </div>
                    <h2 class="text-2xl font-black text-white tracking-tight mb-2">Enlace inválido</h2>
                    <p class="text-text-secondary text-sm mb-6">
                        Este enlace de recuperación no es válido o ha expirado.<br>
                        Solicite uno nuevo.
                    </p>
                    <a href="#/recuperar-contrasena"
                       class="inline-block px-6 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm">
                        <i class="ri-arrow-left-line mr-1"></i>Solicitar nuevo enlace
                    </a>
                </div>
            </section>
        `;
    }

    // Vista normal con formulario
    return `
        <section class="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div class="max-w-md w-full bg-bg-surface p-10 rounded-2xl shadow-xl border border-gray-800">

                <div class="text-center mb-8">
                    <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 border border-brand/30">
                        <i class="ri-shield-keyhole-line text-3xl text-brand"></i>
                    </div>
                    <h2 class="text-3xl font-black text-white tracking-tight">Nueva contraseña</h2>
                    <p class="mt-2 text-sm text-text-secondary">
                        Ingrese y confirme su nueva contraseña para recuperar el acceso.
                    </p>
                </div>

                <!-- Campo oculto para pasar el token al handler -->
                <form id="form-reset-password" class="space-y-5">
                    <input type="hidden" id="reset-token" name="token" value="${token}">

                    <div class="space-y-2">
                        ${Label({ text: 'Nueva contraseña', htmlFor: 'newPassword' })}
                        ${Input({
                            type: 'password',
                            id: 'newPassword',
                            name: 'newPassword',
                            placeholder: '••••••••',
                            className: 'border-gray-700 focus:border-brand text-white'
                        })}
                    </div>

                    <div class="space-y-2">
                        ${Label({ text: 'Confirmar contraseña', htmlFor: 'confirmPassword' })}
                        ${Input({
                            type: 'password',
                            id: 'confirmPassword',
                            name: 'confirmPassword',
                            placeholder: '••••••••',
                            className: 'border-gray-700 focus:border-brand text-white'
                        })}
                    </div>

                    ${Button({
                        text: 'Restablecer contraseña',
                        type: 'submit',
                        variant: 'primary',
                        size: 'lg',
                        className: 'w-full mt-2 shadow-md font-black'
                    })}
                </form>

                <!-- Mensaje de éxito (oculto por defecto) -->
                <div id="success-reset" class="hidden mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                    <i class="ri-checkbox-circle-line text-3xl text-green-400 mb-2 block"></i>
                    <p class="text-green-300 font-bold text-sm">¡Contraseña restablecida!</p>
                    <p class="text-text-secondary text-xs mt-1">
                        Redirigiendo al inicio de sesión...
                    </p>
                </div>

                <p class="text-center text-sm text-text-secondary pt-6">
                    <a href="#/login" class="text-brand font-bold hover:underline transition-all">
                        <i class="ri-arrow-left-line mr-1"></i>Volver al inicio de sesión
                    </a>
                </p>
            </div>
        </section>
    `;
};
