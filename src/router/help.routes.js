import { HelpView, HelpController } from '@/modules/help';
import { PrivateLayout } from '@/layouts';

export const helpRoutes = [
    {
        path: '#/ayuda',
        view: HelpView,
        init: HelpController,
        layout: PrivateLayout,
        requiresAuth: true,

        // Todos los usuarios tienen acceso al dashboard,
        // por lo que cualquiera podrá entrar a la ayuda.
        permissions: ['dashboard.index']
    }
];