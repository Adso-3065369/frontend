import { Input, Select, Button, Link, Label     } from '@/components/ui';

/**
 * @file ProductCreateView.js
 * @description Interfaz para la creación de nuevos productos adaptada al tema de alto contraste.
 */
export const ProductCreateView = async () => {
    return `
        <div class="p-6 max-w-3xl mx-auto space-y-6">
            <div>
                <h1 class="text-2xl font-black text-white">Nuevo Producto</h1>
                <p class="text-sm text-text-secondary">Complete los datos para añadir un artículo al catálogo.</p>
            </div>

            <form novalidate id="form-create-product" class="app-card space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div class="md:col-span-1">
                        ${Label({
                            text: 'Código SKU',
                            htmlFor: 'productCode'
                        })}
                        ${Input({
                            id: 'productCode',
                            name: 'productCode',
                            placeholder: 'Ej. CAM-OX-001',
                            required: true
                        })}
                    </div>

                    <div class="md:col-span-1">
                        ${Label({
                            text: 'Nombre del Producto',
                            htmlFor: 'productName'
                        })}
                        ${Input({
                            id: 'productName',
                            name: 'productName',
                            placeholder: 'Ej. Camisa Oxford Slim Fit',
                            required: true
                        })}
                    </div>

                    <div class="md:col-span-1">
                        ${Label({
                            text: 'Precio Unitario ($)',
                            htmlFor: 'productName'
                        })}
                        ${Input({
                            type: 'number',
                            id: 'productPrice',
                            name: 'productPrice',
                            placeholder: '0.00',
                            required: true,
                            className: 'step-any' 
                        })}
                    </div>

                    <div class="md:col-span-1">
                        ${Label({
                            text: 'Stock Inicial',
                            htmlFor: 'productName'
                        })}
                        ${Input({
                            type: 'number',
                            id: 'productStock',
                            name: 'productStock',
                            placeholder: '0',
                            required: true,
                            className: 'step-1'
                        })}
                    </div>

                    <div id="category-select-container" class="md:col-span-2">
                        ${Select({
                            label: 'Categoría',
                            id: 'productCategory',
                            name: 'productCategory',
                            required: true,
                            options: [], 
                            placeholder: 'Cargando categorías...'
                        })}
                    </div>
                </div>

                <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-800">
                    ${Link({
                        text: 'Cancelar',
                        href: '#/productos',
                        variant: 'ghost',
                        className: 'font-medium'
                    })}
                    
                    ${Button({
                        text: 'Guardar Producto',
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