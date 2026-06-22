/**
 * @file UserFilter.js
 * @description Componente funcional para el filtro de usuarios. Contiene la interfaz de usuario y los escuchadores de eventos para los filtros.
 */

/**
 * Genera el HTML de los filtros de usuario y asocia sus manejadores de eventos.
 * @param {Function} onFilterChange - Callback ejecutado cuando cambian los valores del filtro. Recibe (searchTerm, roleName).
 * @returns {string} El HTML del componente.
 */
export const UserFilter = (onFilterChange) => {
    // Escuchar eventos mediante delegación en el document para capturar interacciones
    // de elementos dinámicos que se inyectan en el DOM
    const handleInputEvent = (e) => {
        if (e.target && (e.target.id === 'filter-search' || e.target.id === 'filter-role')) {
            const searchVal = document.getElementById('filter-search')?.value || '';
            const roleVal = document.getElementById('filter-role')?.value || '';
            onFilterChange(searchVal, roleVal);
        }
    };

    // Usamos delegación de eventos en el documento para el input y el cambio
    document.addEventListener('input', handleInputEvent);
    document.addEventListener('change', handleInputEvent);

    return `
        <div class="app-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border border-gray-800/60 rounded-2xl mb-6 shadow-md bg-[#0F0F12]">
            <!-- Buscador por Texto -->
            <div class="w-full sm:flex-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                    <i class="ri-search-line text-lg"></i>
                </div>
                <input 
                    type="text" 
                    id="filter-search" 
                    placeholder="Buscar usuario por nombre o correo electrónico..." 
                    class="w-full pl-10 pr-4 py-2.5 bg-[#16161A] border border-gray-800 focus:border-brand rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200 text-sm"
                />
            </div>
            
            <!-- Selector de Roles -->
            <div class="w-full sm:w-64 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                    <i class="ri-shield-user-line text-lg"></i>
                </div>
                <select 
                    id="filter-role" 
                    class="w-full pl-10 pr-10 py-2.5 bg-[#16161A] border border-gray-800 focus:border-brand rounded-xl text-white focus:outline-none transition-all duration-200 text-sm cursor-pointer appearance-none"
                >
                    <option value="">Todos los roles</option>
                    <option value="Admin">Administrador (Admin)</option>
                    <option value="Inventario">Gestor de Inventario</option>
                    <option value="Vendedor">Vendedor</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-secondary">
                    <i class="ri-arrow-down-s-line text-lg"></i>
                </div>
            </div>
        </div>
    `;
};
