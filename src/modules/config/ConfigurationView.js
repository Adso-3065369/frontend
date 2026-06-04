import { Input, Button, Link } from '@/components/ui';

/**
 * @file ConfigurationView.js
 * @description Vista estática. Retorna el esqueleto del formulario sin datos.
 */
export const ConfigurationView = () => {
    return `
        <div class="p-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 class="text-2xl font-black text-white tracking-tight">Configuración del Sistema</h1>
                <p class="text-sm text-text-secondary">Administre los parámetros básicos para el funcionamiento del Punto de Venta.</p>
            </div>

            <form id="config-form" novalidate class="app-card p-8 space-y-6">
                
                <div class="space-y-5">
                    <h2 class="text-lg font-bold text-white border-b border-gray-800 pb-2">Datos del Negocio</h2>
                    
                    ${Input({
                        label: 'Nombre del Negocio',
                        type: 'text',
                        id: 'businessName',
                        name: 'businessName',
                        placeholder: 'Nombre del negocio',
                        required: true
                    })}

                    ${Input({
                        label: 'NIT / Documento Identidad',
                        type: 'text',
                        id: 'nit',
                        name: 'nit',
                        placeholder: 'NIT del negocio',
                        required: true
                    })}

                    ${Input({
                        label: 'Porcentaje de IVA (%)',
                        type: 'number',
                        id: 'taxRate',
                        name: 'taxRate',
                        placeholder: 'Porcentaje de IVA',
                        required: true
                    })}
                </div>

                <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-800">
                    ${Link({
                        text: 'Cancelar',
                        href: '#/dashboard',
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
    `;
};