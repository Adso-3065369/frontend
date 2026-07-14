import { createRepository } from '@/repositories';
import { DataTable, Link, Button, Pagination, Badge } from '@/components/ui';
import { RenderIf } from '@/utils';
import { AuthService } from '@/services/'
import { profileCard } from './components/profileCard';

/**
 * @file ProfileHandler.js
 * @description Orquesta la exposición del perfil del usuario trayendo la información de este y colocandole en sus respectivos contenedores
 */

const InitializeView = (profileContainer) => {
    const { fullName, email, roles } = AuthService.getUser()
    
    profileContainer.innerHTML = profileCard({
        name: fullName,
        email: email,
        role: roles
    })
    
}




export const ProfileHandler = () => {
    const profileContainer = document.querySelector('#profile-card')

    InitializeView(profileContainer)
}