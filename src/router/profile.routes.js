/**
 * @file profile.routes.js
 * @description Sub-enrutador para el perfil de usuario.
 */


// Importacion de vista y handler del modulo de perfil
import {
    ProfileView,
    ProfileHandler
} from "@/modules/profile";

import {
    NotFoundView
} from "@/views";
 
// importacion del layout privado 
import { PrivateLayout } from '@/layouts';



/**
 * Sub-arreglo de rutas para la vista de perfil 
 * Protegidas bajo autenticación estricta.
 */

export const profileRoutes = [
        { 
            path: '#/perfil', 
            view: ProfileView, 
            init: ProfileHandler,
            requiresAuth: true,
            layout: PrivateLayout,
            // permissions: ['products.index']
        },
]