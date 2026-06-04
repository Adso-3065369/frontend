import { Input, Button, Link } from '@/components/ui';

/**
 * @file CategoryEditPage.js
 * @description Interfaz para la edición de categorías adaptada al tema de alto contraste.
 */
export const CategoryEditView = async () => {
    return `
        <div class="p-6 max-w-2xl mx-auto space-y-6">
            <div>
                <h1 class="text-2xl font-black text-white">Editar Categoría</h1>
                <p class="text-sm text-text-secondary">Modifique el nombre de la categoría seleccionada.</p>
            </div>

            <form novalidate id="form-edit-category" class="app-card space-y-6">
                
                ${Input({
                    label: 'Nombre de la Categoría',
                    type: 'text',
                    id: 'categoryName',
                    name: 'categoryName',
                    required: false,
                    placeholder: 'Ej. Electrónica, Calzado, etc.'
                })}

                <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-800">
                    
                    ${Link({
                        text: 'Cancelar',
                        href: '#/categorias',
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