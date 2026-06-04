/**
 * @file router.js
 * @version 2.0.0
 * @description Motor de enrutamiento dinámico refactorizado bajo el Principio de Responsabilidad Única (SRP).
 */

import { routes } from './routes.js';
import { AuthService } from '@/services/AuthService.js';
import { PermissionMiddleware } from '@/middlewares/PermissionMiddleware.js';
import { NavbarController } from '@/components/layout/navbar/NavbarController.js';

// ==========================================
// # 1. UTILIDADES DE EXTRACCIÓN Y BÚSQUEDA
// ==========================================

/**
 * Compara la ruta definida con la ruta actual y extrae los parámetros dinámicos de la URL.
 */
const extractRouteParams = (routePath, currentPath) => {
    // Dividimos la ruta del diccionario en fragmentos usando el '/' como separador
    const routeSegments = routePath.split('/');
    // Dividimos la ruta real del navegador en fragmentos de la misma manera
    const currentSegments = currentPath.split('/');

    // Si las rutas no tienen la misma cantidad de fragmentos, es imposible que sean la misma
    if (routeSegments.length !== currentSegments.length) {
        // Retornamos nulo para descartar esta ruta inmediatamente
        return null;
    }

    // Inicializamos un objeto vacío donde guardaremos las variables dinámicas (ej. { id: "5" })
    const params = {};

    // Recorremos cada fragmento de la ruta paso a paso
    for (let i = 0; i < routeSegments.length; i++) {
        // Tomamos el fragmento estático del diccionario
        const routeSegment = routeSegments[i];
        // Tomamos el fragmento dinámico del navegador
        const currentSegment = currentSegments[i];

        // Verificamos si el fragmento del diccionario empieza con ':' (indicando que es una variable)
        if (routeSegment.startsWith(':')) {
            // Le quitamos el ':' para obtener el nombre real de la llave (ej. ':id' pasa a ser 'id')
            const paramKey = routeSegment.substring(1);
            // Guardamos el valor que trajo el navegador dentro de nuestro objeto usando esa llave
            params[paramKey] = currentSegment;
        } 
        // Si no es variable, comprobamos si el texto exacto coincide (ej. 'usuarios' === 'usuarios')
        else if (routeSegment !== currentSegment) {
            // Si una sola palabra no coincide, la ruta entera es incorrecta, retornamos nulo
            return null;
        }
    }

    // Si sobrevivió al ciclo, es la ruta correcta. Retornamos el objeto con los parámetros encontrados.
    return params;
};

/**
 * Recorre el diccionario de rutas buscando la coincidencia exacta.
 */
const findRouteAndParams = (currentPath) => {
    // Iteramos sobre el arreglo de todas las rutas importadas
    for (const route of routes) {
        // Intentamos extraer los parámetros usando nuestra función especializada
        const params = extractRouteParams(route.path, currentPath);
        
        // Si params no es nulo, significa que encontramos la ruta exitosamente
        if (params !== null) {
            // Retornamos el objeto de configuración de la ruta y sus parámetros listos para usar
            return { route, params };
        }
    }

    // Si termina el ciclo y no encontró nada, forzamos la ruta de error 404 por seguridad
    return { 
        // Buscamos explícitamente el objeto de la ruta 404 en el diccionario
        route: routes.find(r => r.path === '#/404'), 
        // Entregamos un objeto de parámetros vacío porque el 404 no los necesita
        params: {} 
    };
};

// ==========================================
// # 2. FUNCIONES DE RESPONSABILIDAD ÚNICA (NÚCLEO)
// ==========================================

/**
 * Evalúa las capas de seguridad (Autenticación y Autorización).
 * @returns {boolean} Retorna true si el usuario puede continuar, false si es bloqueado.
 */
const checkSecurityGuards = (route) => {
    // Consultamos al servicio si existe una sesión activa actualmente
    const isAuth = AuthService.isLoggedIn();

    // Capa 1: Verificamos si la ruta exige sesión pero el usuario NO está logueado
    if (route.requiresAuth && !isAuth) {
        // Redirigimos forzosamente al login, abortando la navegación
        window.location.hash = '#/login';
        // Retornamos falso indicando que no pasó el guardián
        return false;
    }
    
    // Capa 2: Verificamos si la ruta exige sesión Y además requiere permisos específicos
    if (route.requiresAuth && route.permissions) {
        // Consultamos al middleware si el usuario actual posee esos permisos
        const hasAccess = PermissionMiddleware.canActivate(route.permissions);
        
        // Si el middleware nos dice que no tiene acceso
        if (!hasAccess) {
            // Imprimimos un error en consola para auditoría del desarrollador
            console.error("Acceso denegado: Privilegios insuficientes.");
            // Redirigimos al panel de control por seguridad
            window.location.hash = '#/dashboard';
            // Retornamos falso indicando que fue bloqueado por falta de permisos
            return false;
        }
    }

    // Si no tropezó con ninguna validación, el usuario es apto para continuar
    return true;
};

/**
 * Pide la vista, le inyecta el layout (si existe) y retorna el HTML final.
 */
const assembleInterface = async (route, params) => {
    // Esperamos a que la función de la vista nos retorne su HTML crudo, pasándole los parámetros
    const viewHTML = await route.view(params);

    // Evaluamos dinámicamente: si la ruta tiene layout, envolvemos la vista. Si no, dejamos la vista sola.
    const finalHTML = route.layout ? route.layout(viewHTML) : viewHTML;

    // Retornamos el bloque de código HTML completamente ensamblado
    return finalHTML;
};

/**
 * Inyecta el HTML procesado directamente en el contenedor principal del DOM.
 */
const renderDOM = (html) => {
    // Buscamos en el index.html el div principal de nuestra SPA
    const container = document.getElementById('app');
    // Si el contenedor existe, reemplazamos todo su contenido con nuestro nuevo HTML
    if (container) {
        container.innerHTML = html;
    }
};

/**
 * Ejecuta los controladores de JavaScript necesarios después de pintar el DOM.
 */
const bootControllers = (route, params) => {
    // Si la ruta pertenece al entorno privado (requiere auth), encendemos el controlador del Navbar
    if (route.requiresAuth) {
        NavbarController(); 
    }
    
    // Si el diccionario definió un controlador específico para esta vista, lo ejecutamos
    if (route.init) {
        // Le pasamos los parámetros de la URL al controlador para que pueda hacer peticiones (ej. Fetch por ID)
        route.init(params); 
    }
};

// ==========================================
// # 3. ORQUESTADOR PRINCIPAL (DIRECTOR)
// ==========================================

/**
 * Controla el flujo secuencial de la navegación.
 */
const handleNavigation = async () => {
    try {
        // 1. Lectura: Obtenemos el hash actual de la URL, si está vacío asumimos la raíz '#/'
        const currentPath = window.location.hash || '#/';
        
        // 2. Búsqueda: Delegamos la búsqueda de la configuración a nuestra función especializada
        const { route, params } = findRouteAndParams(currentPath);

        // 3. Seguridad: Validamos los guardianes. Si retorna false, detenemos la ejecución inmediatamente
        if (!checkSecurityGuards(route)) {
            return;
        }

        // 4. Ensamblaje: Pedimos a la función especializada que construya todo el HTML
        const finalHTML = await assembleInterface(route, params);

        // 5. Renderizado: Enviamos el HTML ensamblado para que sea pintado en la pantalla
        renderDOM(finalHTML);

        // 6. Reactividad: Encendemos los eventos y la lógica de la vista actual
        bootControllers(route, params);

    } catch (error) {
        // Capturamos cualquier error en el proceso para evitar que la aplicación colapse en silencio
        console.error("Fallo general en el ciclo de vida del enrutador:", error);
    }
};

/**
 * Inicializa los "escuchadores" de eventos globales del navegador.
 */
export const initRouter = () => {
    // Escucha cada vez que cambia el '#/' en la barra de direcciones y lanza la navegación
    window.addEventListener('hashchange', handleNavigation);
    // Dispara la navegación inmediatamente cuando el documento HTML termina de cargar por primera vez
    window.addEventListener('DOMContentLoaded', handleNavigation);
};