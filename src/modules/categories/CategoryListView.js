import { Link } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file CategoryListView.js
 * @description Interfaz para el listado de categorías adaptada al patrón de componentes dinámicos.
 */
export const CategoryListView = async () => {
    return `
        <div class="p-6 space-y-6">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-black text-white">Categorías</h1>
                    <p class="mt-2 text-sm text-text-secondary">Gestione la clasificación de su inventario.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    ${RenderIf('categories.create',
                        Link({
                            text: 'Nueva Categoría',
                            href: '#/categorias/nuevo',
                            variant: 'primary',
                            icon: '<i class="ri-add-circle-line text-lg"></i>'
                        })
                    )}
                </div>
            </div>

            <div id="categories-table-container" class="app-card overflow-hidden">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-2xl block mb-2"></i>
                    Conectando con el servidor...
                </div>
            </div>
        </div>
    `;
};