/**
 * @file categories.routes.js
 * @description Sub-enrutador dedicado exclusivamente al dominio de Categorías.
 */

// Importación selectiva de vistas y controladores del módulo de categorías
import { 
    CategoryListView, 
    CategoryCreateView,
    CategoryEditView,
    CategoryListHandler,
    CategoryCreateHandler,
    CategoryEditHandler
} from '@/modules/categories';

import { PrivateLayout } from '@/layouts';

/**
 * Sub-arreglo de rutas para el control de inventario y clasificación (Categorías).
 * Todas las rutas de este dominio requieren validación de sesión activa.
 */
export const categoriesRoutes = [
    // Ruta para listar las categorias
    { 
        path: '#/categorias', 
        view: CategoryListView,
        init: CategoryListHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['categories.index']
    },
    // Ruta para crear categorias
    { 
        path: '#/categorias/nuevo',
        view: CategoryCreateView,
        init: CategoryCreateHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['categories.create']
    },
    // Ruta para editar categorias (Manejo de parámetro dinámico :id)
    { 
        path: '#/categorias/editar/:id', 
        view: CategoryEditView, 
        init: CategoryEditHandler,
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['categories.update']
    }
];