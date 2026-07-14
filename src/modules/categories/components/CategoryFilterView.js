/**
 * @file CategoryFilterView.js
 * @description Estructura HTML pura del filtro de categorías.
 */

/**
 * Genera el HTML de la barra de búsqueda de categorías.
 * @returns {string} Estructura HTML del filtro.
 */
export const CategoryFilterView = () => {
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
