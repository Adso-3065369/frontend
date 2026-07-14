/**
 * @file HomeView.js
 * @version 1.1.0
 * @description Pantalla de bienvenida para la gestión del sistema.
 */

export const HomeView = async () => {
    return `
        <div class="max-w-2xl mx-auto bg-bg-surface border border-gray-800 rounded-3xl p-12 shadow-2xl text-center">

            <div class="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg class="w-10 h-10 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4">
                    </path>
                </svg>
            </div>

            <h1 class="text-4xl font-black text-white mb-5 text-primary-glow">
                Gestión de Inventario Base
            </h1>

            <p class="text-text-secondary text-lg leading-relaxed mb-10">
                Plataforma centralizada para la administración de productos y categorías.
                Ingrese a su cuenta o regístrese para comenzar a estructurar su inventario.
            </p>

            <div class="flex flex-col sm:flex-row justify-center gap-4">

                <a
                    href="#/login"
                    class="inline-flex items-center justify-center px-8 py-3 min-w-[190px] rounded-xl bg-primary text-black font-bold hover:bg-primary-dark transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    Ingresar al Sistema
                </a>

                <a
                    href="#/registro"
                    class="px-8 py-3 rounded-xl border-2 border-brand text-white hover:bg-primary hover:text-black transition-all duration-300 hover:scale-105"
                >
                    Crear Nueva Cuenta
                </a>

            </div>

        </div>
    `;
};