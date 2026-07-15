import { ConfigurationView, ConfigurationController } from '@/modules/config';


export const configRoutes = [
    { 
        path: '#/configuracion', 
        view: ConfigurationView, 
        init: ConfigurationController, 
        requiresAuth: true,
    }
];