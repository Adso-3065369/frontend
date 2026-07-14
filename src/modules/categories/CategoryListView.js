import { Link } from '@/components/ui';
import { RenderIf } from '@/utils';
import { CategoryFilter } from './components/CategoryFilter.js';

/**
 * @file CategoryListView.js
 * @description Interfaz para el listado de categorías adaptada al patrón de componentes dinámicos.
 */
export const CategoryListView = async () => {
    // Generamos el componente de filtros de categoría pasando un callback que se ejecuta al escribir
    const filterHtml = CategoryFilter((searchTerm) => {
        // Instanciamos un evento personalizado para propagar que los filtros de categoría han cambiado
        const event = new CustomEvent('category-filters-changed', {
            // Guardamos el término de búsqueda de texto dentro del detalle del evento
            detail: { searchTerm }
        });
        // Lanzamos el evento a nivel de documento para ser escuchado en el orquestador de categorías
        document.dispatchEvent(event);
    });

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

            <!-- Filtro de Búsqueda de Categorías -->
            ${filterHtml}

            <div id="categories-table-container" class="app-card overflow-hidden">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-2xl block mb-2"></i>
                    Conectando con el servidor...
                </div>
            </div>
        </div>
    `;
};