/**
 * @file UserFilterView.js
 * @description Estructura HTML pura de los filtros de usuarios, con selector de roles dinámico.
 */

/**
 * Genera el HTML para el filtro de usuarios (buscador y selector de roles).
 * @param {Array<Object>} [roles=[]] - Colección de roles recuperados del servidor.
 * @returns {string} Estructura HTML del filtro.
 */
export const UserFilterView = (roles = []) => {
    // Mapeamos los roles dinámicamente para generar sus opciones en el menú desplegable
    const rolesOptions = roles.map(role => {
        return `<option value="${role.name}">${role.name}</option>`;
    }).join('');

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
            
            <!-- Selector de Roles (Dinámico) -->
            <div class="w-full sm:w-64 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                    <i class="ri-shield-user-line text-lg"></i>
                </div>
                <select 
                    id="filter-role" 
                    class="w-full pl-10 pr-10 py-2.5 bg-[#16161A] border border-gray-800 focus:border-brand rounded-xl text-white focus:outline-none transition-all duration-200 text-sm cursor-pointer appearance-none"
                >
                    <option value="">Todos los roles</option>
                    ${rolesOptions}
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-secondary">
                    <i class="ri-arrow-down-s-line text-lg"></i>
                </div>
            </div>
        </div>
    `;
};
