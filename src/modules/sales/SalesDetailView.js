import { Link } from '@/components/ui';

/**
 * @file SalesDetailView.js
 * @description Interfaz estructural para visualizar el detalle de una transacción.
 * Implementa esqueletos de carga inicial (Skeleton UI) que serán sobrescritos por el Handler.
 */
export const SalesDetailView = async () => {
    return `
        <div class="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
            
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                    ${Link({
                        href: '#/ventas',
                        variant: 'outline-secondary',
                        icon: '<i class="ri-arrow-left-line"></i>',
                        className: 'w-10 h-10 p-0 flex items-center justify-center rounded-full',
                        title: 'Volver al historial'
                    })}
                    <div>
                        <h1 class="text-2xl font-black text-white flex items-center gap-3">
                            Detalle de Factura 
                            <span id="header-invoice-id" class="text-brand bg-brand/10 px-3 py-1 rounded-md text-lg hidden"></span>
                        </h1>
                        <p class="text-sm text-text-secondary">Desglose de la transacción, cajero y datos del comprador.</p>
                    </div>
                </div>
                
                <div id="header-actions" class="hidden sm:flex gap-3"></div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <div class="lg:col-span-4 xl:col-span-4 space-y-6">
                    <div id="customer-summary-col" class="app-card p-6 min-h-[300px]">
                        <div class="skeleton-loader space-y-5">
                            <div class="space-y-2">
                                <div class="h-4 bg-gray-800 animate-pulse rounded w-1/3"></div>
                                <div class="h-6 bg-gray-800 animate-pulse rounded w-3/4"></div>
                            </div>
                            <hr class="border-gray-800">
                            <div class="space-y-3">
                                <div class="h-10 bg-bg-base border border-gray-800 animate-pulse rounded-lg w-full"></div>
                                <div class="h-10 bg-bg-base border border-gray-800 animate-pulse rounded-lg w-full"></div>
                            </div>
                            <div class="pt-4">
                                <div class="h-16 bg-gray-800 animate-pulse rounded-xl w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-8 xl:col-span-8">
                    <div id="product-list-col" class="app-card overflow-hidden min-h-[400px]">
                        <div class="skeleton-loader p-6 space-y-6">
                            <div class="flex justify-between items-center mb-6">
                                <div class="h-6 bg-gray-800 animate-pulse rounded w-1/4"></div>
                                <div class="h-8 bg-gray-800 animate-pulse rounded-full w-24"></div>
                            </div>
                            <div class="space-y-3">
                                <div class="h-12 bg-bg-base border border-gray-850 animate-pulse rounded-xl w-full"></div>
                                <div class="h-12 bg-bg-base border border-gray-850 animate-pulse rounded-xl w-full"></div>
                                <div class="h-12 bg-bg-base border border-gray-850 animate-pulse rounded-xl w-full"></div>
                                <div class="h-12 bg-bg-base border border-gray-850 animate-pulse rounded-xl w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    `;
};