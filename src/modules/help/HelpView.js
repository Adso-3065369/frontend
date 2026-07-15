/**
 * @file HelpView.js
 * @description Centro de ayuda del sistema.
 */

export const HelpView = async () => {

    return `
        <div class="max-w-5xl mx-auto space-y-8 animate-fade-in">

            <div class="bg-bg-surface border border-gray-800 rounded-2xl p-8">

                <div class="flex items-center gap-4 mb-6">
                    <div class="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
                        <i class="ri-question-answer-line text-3xl text-brand"></i>
                    </div>

                    <div>
                        <h1 class="text-4xl font-black text-white">
                            Centro de Ayuda
                        </h1>

                        <p class="text-text-secondary">
                            Guía rápida para utilizar el sistema.
                        </p>
                    </div>
                </div>

                <p class="text-text-secondary leading-relaxed">
                    Aquí encontrarás información básica sobre las funciones
                    principales del sistema de gestión de inventario y ventas.
                </p>

            </div>

            <div class="grid md:grid-cols-2 gap-6">

                <div class="bg-bg-surface border border-gray-800 rounded-xl p-6">
                    <h2 class="text-brand text-xl font-bold mb-3">
                        <i class="ri-box-3-line mr-2"></i>
                        Productos
                    </h2>

                    <p class="text-text-secondary">
                        Permite registrar, editar y eliminar productos del
                        inventario.
                    </p>
                </div>

                <div class="bg-bg-surface border border-gray-800 rounded-xl p-6">
                    <h2 class="text-brand text-xl font-bold mb-3">
                        <i class="ri-price-tag-3-line mr-2"></i>
                        Categorías
                    </h2>

                    <p class="text-text-secondary">
                        Organiza los productos en diferentes categorías para
                        facilitar su administración.
                    </p>
                </div>

                <div class="bg-bg-surface border border-gray-800 rounded-xl p-6">
                    <h2 class="text-brand text-xl font-bold mb-3">
                        <i class="ri-shopping-cart-line mr-2"></i>
                        Ventas
                    </h2>

                    <p class="text-text-secondary">
                        Registra las ventas realizadas y mantiene actualizado
                        automáticamente el inventario.
                    </p>
                </div>

                <div class="bg-bg-surface border border-gray-800 rounded-xl p-6">
                    <h2 class="text-brand text-xl font-bold mb-3">
                        <i class="ri-dashboard-line mr-2"></i>
                        Dashboard
                    </h2>

                    <p class="text-text-secondary">
                        Visualiza indicadores importantes como ingresos,
                        inventario disponible y ventas realizadas.
                    </p>
                </div>

            </div>


        <!-- Preguntas Frecuentes -->
        <div class="bg-bg-surface border border-gray-800 rounded-xl p-6 mt-10">

            <h2 class="text-2xl font-bold text-brand mb-2">
                <i class="ri-questionnaire-line mr-2"></i>
                Preguntas Frecuentes
            </h2>

            <p class="text-text-secondary mb-8">
                Encuentra respuestas rápidas sobre el uso de las principales funciones del sistema.
            </p>

            <div class="space-y-5">

                <div class="faq-item border border-gray-800 rounded-lg overflow-hidden">
                    <button class="faq-btn w-full flex justify-between items-center px-6 py-5 text-left hover:bg-bg-hover transition-colors">
                        <span class="font-bold text-white">
                            ¿Cómo registro un nuevo producto?
                        </span>

                        <i class="ri-arrow-down-s-line text-xl text-brand"></i>
                    </button>

                    <div class="faq-content hidden px-8 py-5 text-text-secondary leading-relaxed border-t border-gray-800 bg-bg-base/40">
                        Dirígete al módulo <strong>Productos</strong> y selecciona
                        <strong>Nuevo Producto</strong>. Completa la información solicitada
                        y guarda los cambios.
                    </div>
                </div>

                <div class="faq-item border border-gray-800 rounded-lg overflow-hidden">
                    <button class="faq-btn w-full flex justify-between items-center px-6 py-5 text-left hover:bg-bg-hover transition-colors">
                        <span class="font-bold text-white">
                            ¿Cómo crear una categoría?
                        </span>

                        <i class="ri-arrow-down-s-line text-xl text-brand"></i>
                    </button>

                    <div class="faq-content hidden px-8 py-5 text-text-secondary leading-relaxed border-t border-gray-800 bg-bg-base/40">
                        Ingresa al módulo <strong>Categorías</strong>, pulsa
                        <strong>Agregar Categoría</strong> y registra el nombre de la nueva categoría.
                    </div>
                </div>

                <div class="faq-item border border-gray-800 rounded-lg overflow-hidden">
                    <button class="faq-btn w-full flex justify-between items-center px-6 py-5 text-left hover:bg-bg-hover transition-colors">                        
                        <span class="font-bold text-white">
                            ¿Qué sucede cuando realizo una venta?
                        </span>

                        <i class="ri-arrow-down-s-line text-xl text-brand"></i>
                    </button>

                    <div class="faq-content hidden px-8 py-5 text-text-secondary leading-relaxed border-t border-gray-800 bg-bg-base/40">
                        El sistema registra la venta y actualiza automáticamente el inventario
                        descontando las unidades vendidas.
                    </div>
                </div>

                <div class="faq-item border border-gray-800 rounded-lg overflow-hidden">
                    <button class="faq-btn w-full flex justify-between items-center px-6 py-5 text-left hover:bg-bg-hover transition-colors">
                        <span class="font-bold text-white">
                            ¿Cómo consulto el estado del inventario?
                        </span>

                        <i class="ri-arrow-down-s-line text-xl text-brand"></i>
                    </button>

                    <div class="faq-content hidden px-8 py-5 text-text-secondary leading-relaxed border-t border-gray-800 bg-bg-base/40">                        Desde el Dashboard podrás visualizar el total de productos,
                        valor del inventario, ventas realizadas y productos con stock crítico.
                    </div>
                </div>

            </div>

        </div>



        
        <div class="app-card p-6">

            <h2 class="text-2xl font-bold text-brand mb-6">
                Información de Soporte
            </h2>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div class="flex items-start gap-3">
                    <i class="ri-mail-line text-blue-400 text-2xl"></i>

                    <div>
                        <h3 class="font-bold text-white">
                            Correo
                        </h3>

                        <p class="text-text-secondary text-sm">
                            soporte@inventorybase.com
                        </p>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <i class="ri-time-line text-yellow-400 text-2xl"></i>

                    <div>
                        <h3 class="font-bold text-white">
                            Horario
                        </h3>

                        <p class="text-text-secondary text-sm">
                            Lun - Vie 8:00 AM - 6:00 PM
                        </p>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <i class="ri-code-box-line text-brand text-2xl"></i>

                    <div>
                        <h3 class="font-bold text-white">
                            Versión
                        </h3>

                        <p class="text-text-secondary text-sm">
                            v1.0.0
                        </p>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <i class="ri-checkbox-circle-line text-green-500 text-2xl"></i>

                    <div>
                        <h3 class="font-bold text-white">
                            Estado
                        </h3>

                        <p class="text-text-secondary text-sm">
                            Sistema operativo
                        </p>
                    </div>
                </div>

            </div>

            <div class="border-t border-gray-800 mt-8 pt-6 text-center">

                <p class="text-sm text-text-secondary">
                    © 2026 Inventory Base
                </p>

                <p class="text-xs text-gray-500 mt-1">
                    Sistema de Gestión de Inventario y Ventas
                </p>

            </div>

        </div>
    `;
};




