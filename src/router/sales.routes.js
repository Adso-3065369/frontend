/**
 * @file sales.routes.js
 * @description Sub-enrutador dedicado al dominio de Ventas y Facturación.
 */

// Importación exclusiva de las vistas y controladores del módulo de ventas
import { 
    SalesListView,
    SalesListHandler,
    SaleCreateView,
    SalesDetailView,
    SalesDetailHandler
} from '@/modules/sales';

import { SaleCreateHandler } from '@/modules/sales/sale-create';

import { PrivateLayout } from '@/layouts';

/**
 * Sub-arreglo de rutas para el core comercial (Ventas).
 * Requieren autenticación estricta y control de parámetros dinámicos.
 */
export const salesRoutes = [
    // Ruta para listar las ventas realizadas
    { 
        path: '#/ventas', 
        view: SalesListView, 
        init: SalesListHandler, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['sales.index']
    },
    // Ruta para registrar una nueva venta
    { 
        path: '#/ventas/nueva', 
        view: SaleCreateView, 
        init: SaleCreateHandler, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['sales.create']
    },
    // Ruta para ver el detalle de una venta específica (Parámetro dinámico :id)
    { 
        path: '#/ventas/detalle/:id', 
        view: SalesDetailView, 
        init: SalesDetailHandler, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['sales.view']
    }
];