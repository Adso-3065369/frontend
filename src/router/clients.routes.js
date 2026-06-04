/**
 * @file clients.routes.js
 * @description Sub-enrutador para la gestión del catálogo de Clientes.
 */

// Importación exclusiva de las vistas y controladores del dominio de clientes
import { 
    ClientListView,
    ClientCreateView,
    ClientEditView,
    ClientListHandler,
    ClientCreateHandler,
    ClientEditHandler
} from "@/modules/clients";

import { PrivateLayout } from '@/layouts';

/**
 * Sub-arreglo de rutas para el core de ventas (Clientes).
 * Protegidas bajo autenticación estricta y delegación de permisos.
 */
export const clientsRoutes = [
    // Ruta principal: Listado de clientes
    { 
        path: '#/clientes', 
        view: ClientListView, 
        init: ClientListHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['clients.index']
    },
    // Ruta de creación: Registro de nuevo cliente
    { 
        path: '#/clientes/nuevo',
        view: ClientCreateView,
        init: ClientCreateHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['clients.create']
    },
    // Ruta de edición: Actualización de datos (Manejo de parámetro dinámico :id)
    { 
        path: '#/clientes/editar/:id', 
        view: ClientEditView, 
        init: ClientEditHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['clients.update']
    }
];