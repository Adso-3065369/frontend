/**
 * @file HomeView.js
 * @version 1.0.0
 * @description Pantalla de bienvenida para la gestión del sistema.
 */

export const HomeView = async () => {
    return `
        <div class="text-center max-w-2xl bg-white p-12 rounded-2xl shadow-xl border border-gray-100">
            <div class="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
            </div>
            <h1 class="text-4xl font-black text-gray-900 mb-4 tracking-tight">Gestión de Inventario Base</h1>
            <p class="text-lg text-gray-600 mb-8 font-sans">
                Plataforma centralizada para la administración de productos y categorías. Ingrese a su cuenta o regístrese para comenzar a estructurar su inventario.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#/login" class="px-8 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors transform active:scale-95">
                    Ingresar al Sistema
                </a>
                <a href="#/registro" class="px-8 py-3 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors transform active:scale-95">
                    Crear Nueva Cuenta
                </a>
            </div>
        </div>
    `;
};