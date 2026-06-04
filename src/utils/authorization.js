/**
 * @file authorization.js
 * @description Utilidad para el control de acceso en la interfaz basado en un arreglo plano de permisos.
 */

/**
 * Verifica si el usuario autenticado posee un permiso específico en su arreglo de permisos.
 * @param {string} permissionName - El nombre exacto del permiso (ej. 'category.delete').
 * @returns {boolean} True si el permiso existe en el arreglo, False en caso contrario.
 */
export const hasPermission = (permissionName) => {
    try {
        // 1. Recuperar el objeto completo del usuario desde el almacenamiento
        const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        
        // 2. Extraer el arreglo de permisos (Si no existe, se asigna un arreglo vacío por seguridad)
        const userPermissions = authUser.permissions || [];

        // 3. Verificación estricta de la existencia del nombre del permiso
        return userPermissions.includes(permissionName);
        
    } catch (error) {
        console.error("Error crítico al procesar la autorización:", error);
        return false; // Denegación por defecto ante cualquier anomalía
    }
};

/**
 * Renderiza un componente HTML únicamente si el usuario cuenta con el permiso requerido.
 * @param {string} permissionCode - El permiso requerido.
 * @param {string} htmlString - La cadena de texto HTML o componente a renderizar.
 * @returns {string} El HTML original si está autorizado, o una cadena vacía si no lo está.
 */
export const RenderIf = (permissionCode, htmlString) => {
    return hasPermission(permissionCode) ? htmlString : '';
};