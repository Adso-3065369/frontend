import { 
    RoleCreatePage,
    RoleEditPage,
    RoleListPage,
    RoleCreateHandler,
    RoleEditHandler,
    RoleListHandler
} from "@/modules/roles";

import { PrivateLayout } from '@/layouts';

export const rolesRoutes = [
    { 
        path: '#/roles', 
        view: RoleListPage, 
        init: RoleListHandler, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['roles.index']
    },
    { 
        path: '#/roles/nuevo', 
        view: RoleCreatePage, 
        init: RoleCreateHandler, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['roles.create']
    },
    { 
        path: '#/roles/editar/:id', 
        view: RoleEditPage, 
        init: RoleEditHandler, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['roles.update']
    }
];