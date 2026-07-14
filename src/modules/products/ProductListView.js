import { Link } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file ProductListView.js
 * @description Interfaz para el listado del inventario adaptada al patrón de componentes dinámicos.
 */
/**
 * @description Selector de ordenamiento del listado de productos. Permite al usuario seleccionar el criterio de ordenamiento.
    La lógica del evento se encuentra en ProductListController.js.
    @file ProductListView.js
    en pocas palabras, este componente es el que renderiza la vista del listado de productos y permite al usuario seleccionar el criterio de ordenamiento.
 */


export const ProductListView = async () => {
  return `
  <div class="p-6 space-y-6">
  <div class="sm:flex sm:items-center sm:justify-between">
  <div>
  <h1 class="text-2xl font-black text-white">Catálogo de Productos</h1>
  <p class="mt-2 text-sm text-text-secondary">Gestione los artículos disponibles, sus precios y categorías.</p>
  </div>
  <div class="mt-4 sm:mt-0">
  ${RenderIf('products.create',
    Link({
      text: 'Nuevo Producto',
      href: '#/productos/nuevo',
      variant: 'primary',
      icon: '<i class="ri-add-circle-line text-lg"></i>'
    })
  )}
  </div>
            </div>
  

            
          <div class="flex items-center justify-end gap-3 mb-4">

              <label
                  for="sort-price"
                  class="text-sm font-medium text-text-secondary"
              >
                  Ordenar por:
              </label>

              <select
                  id="sort-price"
                  class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                  <option value="name-ASC">Nombre (A-Z)</option>
                  <option value="price-DESC">Precio Mayor a menor</option>
                  <option value="price-ASC">Precio Menor a mayor</option>
              </select>

          </div>

            <div id="products-table-container" class="app-card overflow-hidden">
                <div class="px-6 py-12 text-center text-text-secondary italic">
                    <i class="ri-loader-4-line animate-spin text-2xl block mb-2"></i>
                    Conectando con el servidor...
                </div>
            </div>
        </div>
    `;
};