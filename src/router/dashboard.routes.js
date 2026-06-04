import { DashboardView, DashboardController } from '@/modules/dashboard';

import { PrivateLayout } from '@/layouts';

export const dashboardRoutes = [
    { 
        path: '#/dashboard', 
        view: DashboardView, 
        init: DashboardController, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['dashboard.index']
    }
];