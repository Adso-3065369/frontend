// Importamos la función de debounce para retrasar la búsqueda mientras el usuario escribe
import { debounce } from '@/utils';

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
    // Removemos escuchadores antiguos si ya existen en el objeto global para evitar fugas de memoria
    if (window.handleUserFilterInputEvent) {
        document.removeEventListener('input', window.handleUserFilterInputEvent);
        document.removeEventListener('change', window.handleUserFilterInputEvent);
    }

    // Creamos la versión con retardo (debounced) de la función de filtro, configurada a 500 milisegundos
    const debouncedFilterChange = debounce((searchVal, roleVal) => {
        // Ejecutamos el callback original cuando finalice el tiempo de espera
        onFilterChange(searchVal, roleVal);
    }, 500);

    // Definimos el manejador principal de eventos para interceptar los cambios en los filtros
    window.handleUserFilterInputEvent = (e) => {
        // Validamos que el evento provenga de los elementos de filtro correspondientes
        if (e.target) {
            // Si el usuario está escribiendo en el campo de búsqueda por texto
            if (e.target.id === 'filter-search') {
                // Obtenemos el texto ingresado en el buscador
                const searchVal = e.target.value;
                // Obtenemos el rol seleccionado actualmente en la interfaz
                const roleVal = document.getElementById('filter-role')?.value || '';
                // Ejecutamos la búsqueda con retraso para no sobrecargar el servidor
                debouncedFilterChange(searchVal, roleVal);
            } 
            // Si el usuario cambia el rol seleccionado en la lista desplegable
            else if (e.target.id === 'filter-role') {
                // Obtenemos el texto actual del buscador
                const searchVal = document.getElementById('filter-search')?.value || '';
                // Obtenemos el nuevo rol seleccionado
                const roleVal = e.target.value;
                // Ejecutamos el filtro inmediatamente sin esperar, ya que es una selección explícita
                onFilterChange(searchVal, roleVal);
            }
        }
    };

    // Agregamos el manejador al evento 'input' para capturar la escritura en tiempo real
    document.addEventListener('input', window.handleUserFilterInputEvent);
    // Agregamos el manejador al evento 'change' para capturar la selección del menú desplegable
    document.addEventListener('change', window.handleUserFilterInputEvent);

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
