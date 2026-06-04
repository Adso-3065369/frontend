/**
 * @file auth.routes.js
 * @description Rutas públicas, de autenticación y de sistema.
 */

// Vista de presentación común
import { 
    HomeView, 
    HomeController 
} from '@/modules/home';

import { PublicLayout } from '@/layouts';

// Vistas y controladores del módulo de autenticación
import { 
    LoginView, 
    RegisterView, 
    LoginHandler, 
    RegisterHandler 
} from '@/modules/auth';

// Vista para identificar recursos no encontrados
import { 
    NotFoundView 
} from '@/views';

/**
 * Sub-arreglo de rutas para el dominio de accesos y navegación pública.
 * Mantiene el desacoplamiento al no mezclarse con rutas protegidas de negocio.
 */
export const authRoutes = [
    // Ruta de presentación
    { 
        path: '#/', 
        view: HomeView, 
        init: HomeController,
        requiresAuth: false,
        layout: PublicLayout,
        permissions: []
    },
    // Ruta de registro
    { 
        path: '#/registro',
        view: RegisterView,
        init: RegisterHandler,
        requiresAuth: false,
        layout: PublicLayout,
        permissions: []
    },
    // Ruta de autenticación
    { 
        path: '#/login',
        view: LoginView,
        init: LoginHandler,
        requiresAuth: false,
        layout: PublicLayout,
        permissions: []
    },
    // Ruta para recursos no encontrados
    { 
        path: '#/404', 
        view: NotFoundView,
        requiresAuth: false,
        layout: PublicLayout,
        permissions: []
    }
];