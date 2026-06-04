import { Input, Button, Link } from '@/components/ui';

/**
 * @file CategoryCreateView.js 
 * @description Interfaz para el registro de nuevas categorías adaptada al tema de alto contraste.
 */
export const CategoryCreateView = async () => {
    return `
        <div class="p-6 max-w-2xl mx-auto space-y-6">
            <div>
                <h1 class="text-2xl font-black text-white">Nueva Categoría</h1>
                <p class="text-sm text-text-secondary">Registre una nueva clasificación para organizar sus productos.</p>
            </div>

            <form novalidate id="form-create-category" class="app-card space-y-6">
                
                ${Input({
                    label: 'Nombre de la Categoría',
                    type: 'text',
                    id: 'categoryName',
                    name: 'categoryName',
                    placeholder: 'Ej. Electrónica, Calzado, etc.',
                    required: false
                })}

                <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-800">
                    
                    ${Link({
                        text: 'Cancelar',
                        href: '#/categorias',
                        variant: 'ghost',
                        className: 'font-medium'
                    })}
                    
                    ${Button({
                        text: 'Crear Categoría',
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