/**
 * @file routes.js
 * @description Diccionario centralizado de la aplicación totalmente desacoplado.
 */

// IMPORTACIÓN DE TODOS LOS MÓDULOS DE DOMINIO
import { authRoutes } from './auth.routes.js';
import { categoriesRoutes } from './categories.routes.js';
import { productsRoutes } from './products.routes.js';
import { salesRoutes } from './sales.routes.js';
import { dashboardRoutes } from './dashboard.routes.js';
import { usersRoutes } from './users.routes.js';
import { rolesRoutes } from './roles.routes.js';
import { configRoutes } from './config.routes.js';
import { clientsRoutes } from './clients.routes.js';
import { profileRoutes } from './profile.routes.js';

// Método para exportar las rutas unificadas del sistema
export const routes = [
    // Inyección dinámica de todos los módulos
    ...authRoutes,
    ...dashboardRoutes,
    ...usersRoutes,
    ...rolesRoutes,
    ...categoriesRoutes,
    ...productsRoutes,
    ...salesRoutes,
    ...configRoutes,
    ...clientsRoutes,
    ...profileRoutes
];