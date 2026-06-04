import { Button, Input, Link, Label } from '@/components/ui';

/**
 * @file RegisterView.js
 * @version 4.0.0
 * @description Vista de registro ajustada al nuevo tema oscuro (High Contrast).
 */
export const RegisterView = async () => {
    return `
        <section class="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div class="max-w-md w-full bg-bg-surface p-10 rounded-2xl shadow-xl border border-gray-800">
                
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-black text-white tracking-tight">Crear Cuenta</h2>
                    <p class="mt-2 text-sm text-text-secondary">
                        Regístrese para acceder a las opciones de gestión.
                    </p>
                </div>

                <form id="form-register" class="space-y-5">
                    ${Label({
                        text: 'Nombre Completo',
                        htmlFor: 'fullName'
                    })}
                    ${Input({
                        type: 'text',
                        id: 'fullName',
                        name: 'fullName',
                        placeholder: 'Juan Pérez'
                    })}

                    ${Label({
                        text: 'Correo Electrónico',
                        htmlFor: 'email'
                    })}
                    ${Input({
                        type: 'email',
                        id: 'email',
                        name: 'email',
                        placeholder: 'juan@ejemplo.com'
                    })}

                    ${Label({
                        text: 'Contraseña',
                        htmlFor: 'password'
                    })}
                    ${Input({
                        type: 'password',
                        id: 'password',
                        name: 'password',
                        placeholder: '••••••••'
                    })}

                    ${Label({
                        text: 'Confirmar Contraseña',
                        htmlFor: 'passwordConfirm'
                    })}
                    ${Input({
                        type: 'password',
                        id: 'passwordConfirm',
                        name: 'passwordConfirm',
                        placeholder: '••••••••'
                    })}

                    ${Button({
                        text: 'Registrarme',
                        type: 'submit',
                        variant: 'primary',
                        size: 'lg',
                        className: 'w-full mt-6 shadow-md font-black'
                    })}
                    
                    <p class="text-center text-sm text-text-secondary pt-4">
                        ¿Ya tiene una cuenta? 
                        ${Link({
                            text: 'Inicie sesión aquí',
                            href: '#/login',
                            variant: 'ghost',
                            className: 'font-bold ml-1 text-brand'
                        })}
                    </p>
                </form>
            </div>
        </section>
    `;
};