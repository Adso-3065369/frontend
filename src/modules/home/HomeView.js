/**
 * @file HomeView.js
 * @version 1.0.0
 * @description Pantalla de bienvenida para la gestión del sistema.
 */

export const HomeView = async () => {
    return `
        <!-- Contenedor General: Centrado y con fondo oscuro + texturas integradas -->
        <div class="min-h-[80vh] flex items-center justify-center px-4 noise-bg grid-pattern">
            
            <!-- Tarjeta Central: Refactorizada a superficie oscura con sutil brillo amarillo de marca -->
            <div class="text-center max-w-2xl bg-bg-surface p-12 rounded-2xl border border-neutral-800 brand-glow-sm animate-fade-up">
                
                <!-- Icono de Caja/Módulo: Cambiado de azul a fondo oscuro con acento y resplandor amarillo -->
                <div class="mx-auto w-16 h-16 bg-bg-base text-primary rounded-full flex items-center justify-center mb-6 primary-glow-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                </div>
                
                <!-- Título: Tipografía de marca (font-display) y color de texto principal -->
                <h1 class="text-4xl font-black text-text-primary mb-4 tracking-tight font-display">
                    Gestión de Inventario Base
                </h1>
                
                <!-- Descripción: Color de texto secundario/mutado para un contraste descansado -->
                <p class="text-lg text-text-secondary mb-8 font-body">
                    Plataforma centralizada para la administración de productos y categorías. Ingrese a su cuenta o regístrese para comenzar a estructurar su inventario.
                </p>
                
                <!-- Acciones Principales: Eliminados tonos azules en favor de la identidad corporativa -->
                <div class="flex flex-col sm:flex-row justify-center gap-4 font-body">
                    
                    <!-- Botón Ingresar: Amarillo sólido (Primary) con texto oscuro para máxima legibilidad -->
                    <a href="#/login" class="px-8 py-3 text-sm font-bold text-bg-base bg-primary rounded-lg shadow-md hover:bg-primary-dark transition-colors transform active:scale-95">
                        Ingresar al Sistema
                    </a>
                    
                    <!-- Botón Crear Cuenta: Estilo secundario sutil (Superficie oscura con texto de acento) -->
                    <a href="#/registro" class="px-8 py-3 text-sm font-bold text-primary bg-bg-base border border-neutral-800 rounded-lg hover:bg-bg-hover transition-colors transform active:scale-95">
                        Crear Nueva Cuenta
                    </a>
                    
                </div>
            </div>
        </div>
    `;
};
