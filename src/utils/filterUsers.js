/**
 * @file filterUsers.js
 * @description Utilidad pura para filtrar usuarios localmente en el frontend por texto de búsqueda y rol.
 */

/**
 * Filtra un arreglo de usuarios según el texto de búsqueda y el rol seleccionado.
 * @param {Array<Object>} users - Colección de usuarios a filtrar.
 * @param {string} search - Término de búsqueda (aplica sobre nombre y correo).
 * @param {string} roleName - Nombre del rol por el cual filtrar (vacío si no hay filtro).
 * @returns {Array<Object>} Lista filtrada de usuarios.
 */
export const filterUsers = (users, search = '', roleName = '') => {
    if (!Array.isArray(users)) return [];

    const searchLower = String(search).trim().toLowerCase();
    const targetRole = String(roleName).trim();

    return users.filter(user => {
        // 1. Filtrado por texto (Nombre o Correo)
        const name = String(user.name || '').toLowerCase();
        const email = String(user.email || '').toLowerCase();
        const matchesSearch = !searchLower || name.includes(searchLower) || email.includes(searchLower);

        // 2. Filtrado por Rol
        const matchesRole = !targetRole || (Array.isArray(user.roles) && user.roles.some(role => String(role.name) === targetRole));

        return matchesSearch && matchesRole;
    });
};
