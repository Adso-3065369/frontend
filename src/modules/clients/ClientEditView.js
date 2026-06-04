import { Button, Input, Link } from '@/components/ui';

/**
 * @file ClientEditView.js
 * @description Interfaz estructural del formulario para la actualización de clientes.
 * Incluye un estado de carga inicial obligatorio para el pre-llenado de datos.
 */
export const ClientEditView = async () => {
    return `
        <div class="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div class="flex items-center gap-4 mb-8">
                ${Link({
                    href: '#/clientes',
                    variant: 'outline-secondary',
                    icon: '<i class="ri-arrow-left-line"></i>',
                    className: 'w-10 h-10 p-0 flex items-center justify-center rounded-full'
                })}
                <div>
                    <h1 class="text-2xl font-black text-white">Editar Cliente</h1>
                    <p class="text-sm text-text-secondary">Modifique los datos de facturación y contacto.</p>
                </div>
            </div>

            <div class="app-card p-8 relative min-h-[400px]">
                
                <div id="initial-loader" class="absolute inset-0 bg-bg-surface/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl transition-opacity duration-300">
                    <i class="ri-loader-4-line animate-spin text-4xl text-brand mb-4"></i>
                    <p class="text-text-secondary font-bold tracking-wide">Recuperando datos del servidor...</p>
                </div>

                <form id="client-edit-form" class="space-y-6 opacity-0 transition-opacity duration-300">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            ${Input({
                                label: 'Número de Documento',
                                type: 'text',
                                id: 'document_number',
                                name: 'document_number',
                                required: false,
                                placeholder: 'Ej: 1098765432',
                            })}
                        </div>

                        <div class="space-y-2">
                            ${Input({
                                label: 'Nombre Completo / Razón Social',
                                type: 'text',
                                id: 'name',
                                name: 'name',
                                required: false,
                                placeholder: 'Ej: Juan Pérez',
                            })}
                        </div>

                        <div class="space-y-2">
                            ${Input({
                                label: 'Correo Electrónico',
                                type: 'text',
                                id: 'email',
                                name: 'email',
                                required: false,
                                placeholder: 'Ej: correo@empresa.com',
                            })}
                        </div>

                        <div class="space-y-2">
                            ${Input({
                                label: 'Teléfono de Contacto',
                                type: 'text',
                                id: 'phone',
                                name: 'phone',
                                required: false,
                                placeholder: 'Ej: 3001234567',
                            })}
                        </div>
                    </div>

                    <hr class="border-gray-800 my-8">
                    
                    <div class="flex items-center justify-end gap-4">
                        ${Link({
                            href: '#/clientes',
                            text: 'Cancelar',
                            variant: 'ghost',
                            className: 'font-medium'
                        })}
                        ${Button({
                            text: 'Guardar Cambios',
                            type: 'submit',
                            variant: 'primary',
                            size: 'md',
                            className: 'px-8 shadow-md font-black'
                        })}                        
                    </div>
                </form>
            </div>
        </div>
    `;
};