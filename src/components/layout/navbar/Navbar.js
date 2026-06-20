import { AuthService } from '@/services';
import { Link, Dropdown, Button } from '@/components/ui';
import { RenderIf } from '@/utils';

/**
 * @file Navbar.js
 * @version 1.3.0
 * @description Barra de navegación principal. Implementa desempaquetado defensivo profundo
 * para evitar valores 'undefined' originados por envoltorios HTTP o del Backend en el LocalStorage.
 */
export const Navbar = () => {
    const isAuth = AuthService.isLoggedIn();
    
    // 1. Lectura cruda desde el servicio
    const rawUser = isAuth ? AuthService.getUser() : null;
    
    // 2. Desempaquetado Defensivo: Busca los datos reales sin importar cuántas capas (user o data) tenga el JSON
    const user = rawUser?.user || rawUser?.data?.user || rawUser?.data || rawUser || { name: 'Usuario', roles: [] };

    let userMenuHtml = '';
    
    if (isAuth) {
        // Garantizar que siempre haya un string válido para extraer la inicial
        const userName = user.name || 'Usuario';
        const initial = userName.charAt(0).toUpperCase();

        // 3. Extracción de rol a prueba de fallos (Soporta Arrays de objetos, Arrays de strings, u Objetos planos)
        let roleName = 'Sin Rol';
        const userRoles = user.roles || user.role || [];
        
        if (Array.isArray(userRoles) && userRoles.length > 0) {
            // Evalúa si es un array de objetos [{name: 'Admin'}] o un array de strings ['Admin']
            roleName = userRoles[0].name || userRoles[0];
        } else if (typeof userRoles === 'string') {
            roleName = userRoles;
        } else if (userRoles?.name) {
            roleName = userRoles.name;
        }

        // HTML del Gatillo (Avatar + Nombre + Rol)
        const triggerHtml = `
            <div class="w-8 h-8 rounded-full bg-bg-base border border-gray-800 flex items-center justify-center text-brand font-black shadow-inner flex-shrink-0">
                ${initial}
            </div>
            <div class="flex flex-col text-left hidden sm:flex">
                <span class="text-sm font-bold text-white leading-tight">${userName}</span>
                <span class="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">${roleName}</span>
            </div>
            <i class="ri-arrow-down-s-line text-text-secondary hidden sm:block"></i>
        `;

        // Contenido del Panel Flotante ensamblado mediante Componentes
        const contentHtml = `
            <div class="p-4 border-b border-gray-800 sm:hidden bg-bg-base">
                <span class="block text-sm font-bold text-white">${userName}</span>
                <span class="block text-xs text-text-secondary mt-0.5">${roleName}</span>
            </div>

            <div class="p-2 flex flex-col gap-1">
                ${Link({
                    href: '#/perfil',
                    variant: 'ghost',
                    text: '<i class="ri-user-settings-line text-lg mr-2"></i> Administrar Perfil',
                    className: 'flex items-center px-3 py-2.5 text-sm font-bold text-text-secondary hover:text-white hover:bg-bg-hover rounded-lg transition-colors'
                })}
                ${Link({
                    href: '#/configuracion',
                    variant: 'ghost',
                    text: '<i class="ri-settings-4-line text-lg mr-2"></i> Configuración',
                    className: 'flex items-center px-3 py-2.5 text-sm font-bold text-text-secondary hover:text-white hover:bg-bg-hover rounded-lg transition-colors'
                })}
            </div>

            <div class="p-2 border-t border-gray-800">
                ${Button({
                    id: 'btn-logout',
                    text: '<i class="ri-logout-circle-r-line text-lg mr-2"></i> Cerrar Sesión',
                    className: 'w-full flex items-center justify-start px-3 py-2.5 text-sm font-bold text-red-500 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors',
                    variant: 'ghost'
                })}
            </div>
        `;

        // Instanciación del Componente Dropdown
        userMenuHtml = Dropdown({
            id: 'user-profile-dropdown',
            trigger: triggerHtml,
            content: contentHtml,
            variant: 'ghost',
            placement: 'right'
        });
    }

    // Renderizado Final del Navbar
    return `
        <header class="bg-bg-surface border-b border-gray-800 sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                
                <div class="flex items-center mr-8">
                    <h2 class="text-xl font-black text-white tracking-tight">SaaS<span class="text-brand">V1</span></h2>
                </div>

                <div class="hidden md:flex items-center gap-2 flex-grow">
                ${RenderIf('dashboard.index', 
                    Link({ text: 'Dashboard', href: '#/dashboard', variant: 'nav' })
                )}
                ${RenderIf('users.index',
                    Link({ text: 'Usuarios', href: '#/usuarios', variant: 'nav' })
                )}
                ${RenderIf('clients.index',
                    Link({ text: 'Clientes', href: '#/clientes', variant: 'nav' })
                )}
                ${RenderIf('roles.index',
                    Link({ text: 'Roles', href: '#/roles', variant: 'nav' })
                )}
                ${RenderIf('products.index',
                    Link({ text: 'Productos', href: '#/productos', variant: 'nav' })
                )}
                ${RenderIf('categories.index',
                    Link({ text: 'Categorías', href: '#/categorias', variant: 'nav' })
                )}
                ${RenderIf('sales.index',
                    Link({ text: 'Ventas', href: '#/ventas', variant: 'nav' })
                )}
                </div>
                
                <div id="auth-section" class="flex items-center gap-4">
                    <!-- boton para abrir el menu en moviles -->
                    <button id="mobile-menu-trigger" class="md:hidden p-2 text-gray-400">
                        <i class="ri-menu-line text-2xl"></i>
                    </button>

                    ${isAuth 
                        ? userMenuHtml 
                        : `
                          ${Link({ 
                              text: 'Entrar', 
                              href: '#/login', 
                              variant: 'nav' 
                          })}
                          ${Link({ 
                              text: 'Registrarse', 
                              href: '#/registro', 
                              className: 'bg-brand text-black px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-sm' 
                          })}
                        `
                    }
                </div>
                
            </nav>

            <!-- menu movil que aparece al presionar la hamburguesa -->
            <div id="mobile-navigation" class="hidden md:hidden border-t border-gray-800 bg-bg-surface">
                <div class="flex flex-col p-4 gap-2">
                    ${RenderIf('dashboard.index', 
                        Link({ text: 'Dashboard', href: '#/dashboard', variant: 'nav' })
                    )}
                    ${RenderIf('users.index',
                        Link({ text: 'Usuarios', href: '#/usuarios', variant: 'nav' })
                    )}
                    ${RenderIf('clients.index',
                        Link({ text: 'Clientes', href: '#/clientes', variant: 'nav' })
                    )}
                    ${RenderIf('roles.index',
                        Link({ text: 'Roles', href: '#/roles', variant: 'nav' })
                    )}
                    ${RenderIf('products.index',
                        Link({ text: 'Productos', href: '#/productos', variant: 'nav' })
                    )}
                    ${RenderIf('categories.index',
                        Link({ text: 'Categorías', href: '#/categorias', variant: 'nav' })
                    )}
                    ${RenderIf('sales.index',
                        Link({ text: 'Ventas', href: '#/ventas', variant: 'nav' })
                    )}
                </div>
            </div>
        </header>
    `;
};