// Importamos la función de debounce para retrasar la búsqueda mientras el usuario escribe
import { debounce } from '@/utils';

/**
 * @file CategoryFilter.js
 * @description Componente funcional para el filtro de categorías. Contiene la interfaz de usuario y los escuchadores de eventos para los filtros.
 */

/**
 * Genera el HTML del filtro de categorías y asocia su manejador de eventos de búsqueda.
 * @param {Function} onFilterChange - Callback ejecutado cuando cambian los valores del filtro. Recibe (searchTerm).
 * @returns {string} El HTML del componente.
 */
export const CategoryFilter = (onFilterChange) => {
    // Removemos escuchadores antiguos si ya existen en el objeto global para evitar fugas de memoria
    if (window.handleCategoryFilterInputEvent) {
        document.removeEventListener('input', window.handleCategoryFilterInputEvent);
    }

    // Creamos la versión con retardo (debounced) de la función de filtro, configurada a 500 milisegundos
    const debouncedFilterChange = debounce((searchVal) => {
        // Ejecutamos el callback original cuando finalice el tiempo de espera
        onFilterChange(searchVal);
    }, 500);

    // Definimos el manejador principal de eventos para interceptar los cambios en el buscador
    window.handleCategoryFilterInputEvent = (e) => {
        // Validamos que el evento provenga de la barra de búsqueda de categorías
        if (e.target && e.target.id === 'category-filter-search') {
            // Obtenemos el texto ingresado en el buscador
            const searchVal = e.target.value;
            // Ejecutamos la búsqueda con retraso para no sobrecargar el servidor
            debouncedFilterChange(searchVal);
        }
    };

    // Agregamos el manejador al evento 'input' para capturar la escritura en tiempo real
    document.addEventListener('input', window.handleCategoryFilterInputEvent);

    return `
        <div class="app-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border border-gray-800/60 rounded-2xl mb-6 shadow-md bg-[#0F0F12]">
            <!-- Buscador por Texto -->
            <div class="w-full sm:flex-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                    <i class="ri-search-line text-lg"></i>
                </div>
                <input 
                    type="text" 
                    id="category-filter-search" 
                    placeholder="Buscar categorías por nombre..." 
                    class="w-full pl-10 pr-4 py-2.5 bg-[#16161A] border border-gray-800 focus:border-brand rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200 text-sm"
                />
            </div>
        </div>
    `;
};
