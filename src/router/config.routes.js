import { ConfigurationView, ConfigurationController } from '@/modules/config';

import { PrivateLayout } from '@/layouts';

export const configRoutes = [
    { 
        path: '#/configuracion', 
        view: ConfigurationView, 
        init: ConfigurationController, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['config.index']
    }
];