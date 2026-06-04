import {
    UserListView,
    UserRoleEditView,
    UserListHandler,
    UserRoleEditController
} from '@/modules/users';

import { PrivateLayout } from '@/layouts';

export const usersRoutes = [
    { 
        path: '#/usuarios', 
        view: UserListView, 
        init: UserListHandler, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['users.index']
    },
    { 
        path: '#/usuarios/editar-roles/:id', 
        view: UserRoleEditView, 
        init: UserRoleEditController, 
        requiresAuth: true,
        layout: PrivateLayout,
        permissions: ['roles.assign']
    }
];