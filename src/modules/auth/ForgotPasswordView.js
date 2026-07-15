import { Button, Input, Label } from '@/components/ui';

/**
 * @file ForgotPasswordView.js
 * @version 1.0.0
 * @description Vista para solicitar la recuperación de contraseña.
 * El usuario ingresa su correo y el sistema simula el envío de un enlace.
 */
export const ForgotPasswordView = async () => {
    return `
        <section class="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div class="max-w-md w-full bg-bg-surface p-10 rounded-2xl shadow-xl border border-gray-800">

                <div class="text-center mb-8">
                    <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 border border-brand/30">
                        <i class="ri-lock-password-line text-3xl text-brand"></i>
                    </div>
                    <h2 class="text-3xl font-black text-white tracking-tight">¿Olvidó su contraseña?</h2>
                    <p class="mt-2 text-sm text-text-secondary">
                        Ingrese su correo y le enviaremos las instrucciones para recuperarla.
                    </p>
                </div>

                <!-- Formulario de solicitud -->
                <form id="form-forgot-password" class="space-y-6">
                    <div class="space-y-2">
                        ${Label({ text: 'Correo electrónico', htmlFor: 'email' })}
                        ${Input({
                            type: 'email',
                            id: 'email',
                            name: 'email',
                            placeholder: 'admin@sistema.com',
                            className: 'border-gray-700 focus:border-brand text-white'
                        })}
                    </div>

                    ${Button({
                        text: 'Enviar instrucciones',
                        type: 'submit',
                        variant: 'primary',
                        size: 'lg',
                        className: 'w-full shadow-md font-black'
                    })}
                </form>

                <!-- Mensaje de éxito (oculto por defecto) -->
                <div id="success-message" class="hidden mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                    <i class="ri-mail-check-line text-3xl text-green-400 mb-2 block"></i>
                    <p class="text-green-300 font-bold text-sm">¡Instrucciones enviadas!</p>
                    <p class="text-text-secondary text-xs mt-1">
                        Revise su bandeja de entrada y siga el enlace del correo.
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
