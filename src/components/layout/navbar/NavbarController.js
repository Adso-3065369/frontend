/**
 * @file NavbarController.js
 * @version 1.0.0
 * @description Gestiona la interactividad de la barra de navegación, el menú de usuario y la autenticación.
 */

import { AuthService } from '@/services';
import { Navbar } from './Navbar.js';

export const NavbarController = () => {
    
    // =========================================================================
    // 1. LÓGICA DEL MENÚ DESPLEGABLE (DROPDOWN)
    // =========================================================================
    const dropdownTrigger = document.getElementById('user-profile-dropdown-trigger');
    const dropdownMenu = document.getElementById('user-profile-dropdown-menu');
    const dropdownContainer = document.getElementById('user-profile-dropdown-container');

    if (dropdownTrigger && dropdownMenu) {
        
        // Evento: Abrir/Cerrar al hacer clic en el avatar/nombre
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Previene que el evento burbujee hasta el document
            
            const isExpanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
            
            // Alternar estado de accesibilidad y visibilidad
            dropdownTrigger.setAttribute('aria-expanded', !isExpanded);
            dropdownMenu.classList.toggle('hidden');
        });

        // Evento: Cerrar automáticamente al hacer clic en cualquier lugar fuera del menú
        document.addEventListener('click', (e) => {
            // Si el menú no está oculto y el clic ocurrió fuera del contenedor del dropdown
            if (!dropdownMenu.classList.contains('hidden') && dropdownContainer && !dropdownContainer.contains(e.target)) {
                dropdownTrigger.setAttribute('aria-expanded', 'false');
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // =========================================================================
    // 1.1 logica para el menu movil
    // =========================================================================
    const mobileBtn = document.getElementById('mobile-menu-trigger');
    const mobileNav = document.getElementById('mobile-navigation');

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            // simplemente quita o pone la clase hidden para mostrar el menu
            mobileNav.classList.toggle('hidden');
        });
    }

    // =========================================================================
    // 2. LÓGICA DE CIERRE DE SESIÓN
    // =========================================================================
    const btnLogout = document.getElementById('btn-logout');
    
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Limpiar la sesión en el servicio local/API
            AuthService.logout();
            
            // 2. Transición de Estado de la Aplicación
            // En una SPA, lo más robusto es cambiar el hash para que el Router 
            // desmonte el PrivateLayout y cargue la vista pública de Login.
            window.location.hash = '#/login';
            
            // Nota: Si tu arquitectura requiere forzar la actualización del DOM "in situ" 
            // en lugar de usar la redirección del router, descomenta lo siguiente:
            /*
            const navbarContainer = document.querySelector('header').parentElement; 
            if (navbarContainer) {
                navbarContainer.innerHTML = Navbar();
                NavbarController(); // Rehidratar eventos
            }
            */
        });
    }
};