import { Link,Button, Modal } from '@/components/ui';

/**
 * @file SaleCreateView.js
 * @description Interfaz POS (Point of Sale) para el registro de ventas.
 * Implementa estructura de Modales nativos ocultos por defecto.
 */
export const SaleCreateView = async () => {
    return `
        <div class="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in relative">
            
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                    ${Link({
                        href: '#/ventas',
                        variant: 'outline-secondary',
                        icon: '<i class="ri-arrow-left-line"></i>',
                        className: 'w-10 h-10 p-0 flex items-center justify-center rounded-full'
                    })}
                    <div>
                        <h1 class="text-2xl font-black text-white">Registrar Nueva Venta</h1>
                        <p class="text-sm text-text-secondary">Seleccione un cliente y agregue productos al carrito.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <div class="lg:col-span-4 space-y-6">
                    <div class="app-card p-6 border-t-4 border-t-brand">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-bold text-white">Datos del Cliente</h2>
                            ${Button({
                                text: 'Buscar',
                                variant: 'outline-primary',
                                size: 'sm',
                                icon: '<i class="ri-search-line"></i>',
                                dataset: { 'modal-target': 'client-modal' }
                            })}
                        </div>
                        
                        <div id="selected-client-container" class="bg-bg-base border border-gray-800 rounded-lg p-4 text-center text-text-secondary">
                            <i class="ri-user-unfollow-line text-2xl block mb-2 opacity-50"></i>
                            <p class="text-sm">Ningún cliente seleccionado.</p>
                            <p class="text-xs mt-1">Se registrará como Consumidor Final.</p>
                            <input type="hidden" id="client_id" name="client_id" value="">
                        </div>
                    </div>

                    <div class="app-card p-6">
                        <h2 class="text-lg font-bold text-white mb-4">Resumen de Pago</h2>
                        <div class="flex justify-between items-center text-2xl font-black text-brand bg-bg-base p-4 rounded-xl border border-gray-800">
                            <span>Total:</span>
                            <span id="sale-grand-total">$0</span>
                        </div>
                        ${Button({
                            id: 'btn-save-sale',
                            text: 'Procesar Factura',
                            variant: 'primary',
                            size: 'lg',
                            icon: '<i class="ri-shopping-bag-3-line"></i>',
                            className: 'w-full mt-6',
                            disabled: true // Nace deshabilitado hasta que el carrito tenga productos
                        })}
                    </div>
                </div>

                <div class="lg:col-span-8 app-card p-6 min-h-[400px] flex flex-col">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-lg font-bold text-white">Detalle de Productos</h2>
                        ${Button({
                            text: 'Agregar Producto',
                            variant: 'outline-primary',
                            size: 'sm',
                            icon: '<i class="ri-add-line text-brand"></i>',
                            dataset: { 'modal-target': 'product-modal' }
                        })}
                    </div>

                    <div id="cart-table-container" class="flex-1 border border-gray-800 rounded-xl overflow-x-auto bg-bg-surface transition-all w-full min-h-[250px]">
                        <div class="flex flex-col items-center justify-center h-full min-h-[250px] text-center text-text-secondary italic p-6">
                            <i class="ri-shopping-cart-line text-4xl block mb-3 opacity-50 text-brand"></i>
                            El carrito está vacío. Agregue productos para comenzar.
                        </div>
                    </div>
                </div>
            </div>

            ${Modal({
                id: 'product-modal',
                title: 'Catálogo de Productos',
                size: 'xl',
                content: `
                    <div class="relative mb-4">
                        <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input type="text" id="search-product-input" class="w-full bg-bg-base border border-gray-700 text-white rounded-lg pl-12 pr-4 py-3 outline-none focus:border-brand transition-colors" placeholder="Buscar por código o nombre del producto...">
                    </div>
                    <div id="product-search-results" class="overflow-y-auto max-h-80 border border-gray-800 rounded-lg">
                        <div class="p-4 text-center text-sm text-text-secondary">Escriba para buscar...</div>
                    </div>
                `
            })}

            ${Modal({
                id: 'client-modal',
                title: 'Seleccionar Cliente',
                size: 'lg',
                content: `
                    <div class="relative mb-4">
                        <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input type="text" id="search-client-input" class="w-full bg-bg-base border border-gray-700 text-white rounded-lg pl-12 pr-4 py-3 outline-none focus:border-brand transition-colors" placeholder="Buscar por nombre o documento...">
                    </div>
                    <div id="client-search-results" class="overflow-y-auto max-h-64 border border-gray-800 rounded-lg">
                        <div class="p-4 text-center text-sm text-text-secondary">Escriba para buscar...</div>
                    </div>
                `
            })}

        </div>
    `;
};