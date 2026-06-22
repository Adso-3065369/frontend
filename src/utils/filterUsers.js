/**
 * @file filterUsers.js
 * @description Filtra una lista de usuarios basándose en un término de búsqueda (nombre/correo) y un rol seleccionado.
 * @param {Array<Object>} users - Lista completa de usuarios.
 * @param {string} searchTerm - Término de búsqueda.
 * @param {string} roleName - Nombre del rol seleccionado.
 * @returns {Array<Object>} Lista filtrada de usuarios.
 */
export function filterUsers(users, searchTerm = '', roleName = '') {
    if (!Array.isArray(users)) return [];

    const cleanSearch = searchTerm.trim().toLowerCase();
    const cleanRole = roleName.trim();

    return users.filter(user => {
        // Filtro por nombre o correo (búsqueda de subcadena insensible a mayúsculas/minúsculas)
        const matchesSearch = !cleanSearch || 
            (user.name && user.name.toLowerCase().includes(cleanSearch)) || 
            (user.email && user.email.toLowerCase().includes(cleanSearch));

        // Filtro por rol
        const matchesRole = !cleanRole || 
            (user.roles && user.roles.some(r => r.name === cleanRole));

        return matchesSearch && matchesRole;
    });
}
