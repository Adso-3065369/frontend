import { Button, Input, Link, Label } from '@/components/ui';

/**
 * @file LoginView.js
 * @version 4.0.0
 * @description Vista de autenticación adaptada al tema de alto contraste (Dark Mode).
 */
export const LoginView = async () => {
    return `
        <section class="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div class="max-w-md w-full bg-bg-surface p-10 rounded-2xl shadow-xl border border-gray-800">
                
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-black text-white tracking-tight">Acceso Privado</h2>
                    <p class="mt-2 text-sm text-text-secondary">
                        Ingrese sus credenciales para administrar el catálogo.
                    </p>
                </div>

                <form id="form-login" class="space-y-6">
                    <div class="space-y-4">
                        ${Label({
                            text: 'Correo electrónico',
                            htmlFor: 'email'
                        })}
                        ${Input({
                            label: 'Correo electrónico',
                            type: 'email',
                            id: 'email',
                            name: 'email',
                            placeholder: 'admin@sistema.com',
                            className: 'border-gray-700 focus:border-brand text-white'
                        })}
                        ${Label({
                            text: 'Contraseña',
                            htmlFor: 'password'
                        })}
                        ${Input({
                            label: 'Contraseña',
                            type: 'password',
                            id: 'password',
                            name: 'password',
                            placeholder: '••••••••',
                            className: 'border-gray-700 focus:border-brand text-white'
                        })}
                        <div class="flex justify-end mt-1">
                            <a href="#/recuperar-contrasena" class="text-xs text-brand hover:underline transition-all font-medium">
                                ¿Olvidó su contraseña?
                            </a>
                        </div>
                    </div>

                    ${Button({
                        text: 'Iniciar Sesión',
                        type: 'submit',
                        variant: 'primary',
                        size: 'lg',
                        className: 'w-full shadow-md font-black'
                    })}
                    
                    <p class="text-center text-sm text-text-secondary pt-4">
                        ¿No tiene una cuenta? 
                        ${Link({
                            text: 'Regístrese aquí',
                            href: '#/registro',
                            variant: 'ghost',
                            className: 'font-bold ml-1 text-brand'
                        })}
                    </p>
                </form>
            </div>
        </section>
    `;
};