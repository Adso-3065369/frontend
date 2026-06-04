import { AuthService } from '@/services'; 

/**
 * @file PermissionMiddleware.js
 * @version 4.0.0
 * @description Interceptor para la validación de permisos de acceso a las rutas.
 * Integrado con AuthService para mantener la arquitectura limpia.
 */
export const PermissionMiddleware = {
    /**
     * Evalúa si el usuario en sesión posee los permisos exigidos por la ruta.
     * @param {Array<string>} requiredPermissions - Arreglo de permisos definidos en la ruta.
     * @returns {boolean} true si el acceso es concedido, false si es denegado.
     */
    canActivate: (requiredPermissions) => {
        // 1. Si la ruta no exige permisos específicos, se permite el paso por defecto.
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        // 2. Validación de sesión activa delegada al AuthService
        if (!AuthService.isLoggedIn()) {
            console.warn(`[Middleware] 🚨 Acceso denegado. No hay sesión activa.`);
            return false;
        }

        // 3. Obtener el usuario desde la fuente centralizada
        const sessionData = AuthService.getUser();
        if (!sessionData) return false;

        const user = sessionData.user ? sessionData.user : sessionData;

        const userPermissions = user.permissions || 
                            (Array.isArray(user.roles) ? user.roles.flatMap(role => role.permissions || []) : []);


        console.info(`[Middleware] Validando acceso. La ruta exige:`, requiredPermissions);
        
        // 5. Evaluar autorización (.some para requerir al menos un permiso válido)
        const isAuthorized = requiredPermissions.some(required => 
            userPermissions.includes(required)
        );

        if (!isAuthorized) {
            console.warn(`[Middleware] 🚨 Acceso denegado. Faltan privilegios. Permisos actuales:`, userPermissions);
        }

        return isAuthorized;
    }
};