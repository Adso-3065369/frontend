import { Button, Input, Link } from '@/components/ui';

/**
 * @file ClientCreateView.js
 * @description Interfaz estructural del formulario para el registro de nuevos clientes.
 */
export const ClientCreateView = async () => {
    return `
        <div class="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div class="flex items-center gap-4 mb-8">
                ${Link({
                    href: '#/clientes',
                    variant: 'outline-secondary',
                    icon: '<i class="ri-arrow-left-line"></i>',
                    size: 'sm',
                    className: 'w-8 h-8 p-0 flex items-center justify-center'
                })}
                <div>
                    <h1 class="text-2xl font-black text-white">Registrar Nuevo Cliente</h1>
                    <p class="text-sm text-text-secondary">Ingrese los datos para la facturación y contacto.</p>
                </div>
            </div>

            <form novalidate id="client-create-form" class="space-y-6">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div class="space-y-2">
                        ${Input({
                            label: 'Número de Documento',
                            type: 'text',
                            id: 'document_number',
                            name: 'document_number',
                            placeholder: 'Ej: 1098765432',
                            required: false
                        })}
                    </div>

                    <div class="space-y-2">
                        ${Input({
                            label: 'Nombre Completo / Razón Social',
                            type: 'text',
                            id: 'name',
                            name: 'name',
                            placeholder: 'Ej: Inversiones Tecnológicas SAS',
                            required: false
                        })}
                    </div>

                    <div class="space-y-2">
                        ${Input({
                            label: 'Correo Electrónico',
                            type: 'email',
                            id: 'email',
                            name: 'email',
                            placeholder: 'Ej: contacto@empresa.com',
                            required: false
                        })}
                    </div>

                    <div class="space-y-2">
                        ${Input({
                            label: 'Teléfono de Contacto',
                            type: 'tel',
                            id: 'phone',
                            name: 'phone',
                            placeholder: 'Ej: 300 123 4567',
                            required: false
                        })}
                    </div>

                </div>
                
                <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-800">

                    ${Link({
                        href: '#/clientes',
                        text: 'Cancelar',
                        variant: 'ghost',
                        className: 'font-medium'
                    })}
                    ${Button({
                        text: 'Crear Cliente',
                        type: 'submit',
                        variant: 'primary',
                        size: 'md',
                        className: 'px-8 shadow-md font-black'
                    })}
                    
                </div>

            </form>
        </div>
    `;
};