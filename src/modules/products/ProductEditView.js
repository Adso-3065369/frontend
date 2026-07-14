import { Input, Select, Button, Link, Label} from '@/components/ui';

/**
 * @file ProductEditView.js
 * @description Interfaz para la modificación de productos en el inventario adaptada al tema oscuro.
 */
export const ProductEditView = async () => {
    return `
        <div class="p-6 max-w-3xl mx-auto space-y-6">
            <div class="flex items-center gap-4 mb-8 w-full">
                 ${Link({
                    href: '#/productos',
                    variant: 'outline-secondary',
                    icon: '<i class="ri-arrow-left-line"></i>',
                    size: 'sm',
                    className: 'w-8 h-8 p-0 flex items-center justify-center'
                })}
                <div>
                <h1 class="text-2xl font-black text-white">Editar Producto</h1>
                <p class="text-sm text-text-secondary">Modifique los datos del artículo seleccionado.</p>
                </div>
            </div>

            <form novalidate id="form-edit-product" class="app-card space-y-6">
                
                <input type="hidden" id="productId" name="productId">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div class="md:col-span-1">
                        ${Label({
                            text:'Código SKU',
                        })}
                        ${Input({
                            id: 'productCode',
                            name: 'productCode',
                            placeholder: 'Cargando información...',
                            required: true
                        })}
                    </div>

                    <div class="md:col-span-1">
                        ${Label({
                            text:  'Nombre del Producto',
                        })}
                        ${Input({
                            id: 'productName',
                            name: 'productName',
                            placeholder: 'Cargando información...',
                            required: true
                        })}
                    </div>

                    <div class="md:col-span-1">
                        ${Label({
                            text:  'Precio Unitario ($)',
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
                            text:'Stock Actual',
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
                        ${Label({
                            text:  'Categoría',
                        })}
                        ${Select({
                            id: 'productCategory',
                            name: 'productCategory',
                            required: true,
                            options: [], 
                            placeholder: 'Cargando información...'
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
                        text: 'Actualizar Producto',
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