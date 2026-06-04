/**
 * @file products.routes.js
 * @description Sub-enrutador para la gestión del catálogo de Productos.
 */

// Importación exclusiva de las vistas y controladores del dominio de productos
import { 
    ProductListView,
    ProductCreateView,
    ProductEditView,
    ProductListHandler,
    ProductCreateHandler,
    ProductEditHandler
} from "@/modules/products";

import { PrivateLayout } from '@/layouts';

/**
 * Sub-arreglo de rutas para el core de inventario (Productos).
 * Protegidas bajo autenticación estricta.
 */
export const productsRoutes = [
    // Ruta para listar productos
    { 
        path: '#/productos', 
        view: ProductListView, 
        init: ProductListHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['products.index']
    },
    // Ruta para crear productos
    { 
        path: '#/productos/nuevo',
        view: ProductCreateView,
        init: ProductCreateHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['products.create']
    },
    // Ruta para editar productos (Manejo de parámetro dinámico :id)
    { 
        path: '#/productos/editar/:id', 
        view: ProductEditView, 
        init: ProductEditHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['products.update']
    }
];