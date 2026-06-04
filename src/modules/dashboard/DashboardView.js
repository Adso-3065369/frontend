import { ChartCard } from '@/components/ui';

/**
 * @file DashboardView.js
 * @version 1.5.0
 * @description Vista tonta (Dumb View). Solo se encarga de renderizar el HTML que le entrega el controlador.
 */

export const DashboardView = async () => {
    return `
        <div id="dashboard-root" class="space-y-8 animate-fade-in">
            <div class="flex flex-col items-center justify-center h-[60vh] text-text-secondary">
                <i class="ri-loader-4-line animate-spin text-5xl mb-4 text-brand"></i>
                <p class="font-bold tracking-widest uppercase text-sm">Procesando métricas del sistema...</p>
            </div>
        </div>
    `;
};

export const DashboardContentTemplate = ({ cardsHtml }) => {
    return `
        <div>
            <h1 class="text-3xl font-black text-white tracking-tight">Panel de Control</h1>
            <p class="text-text-secondary mt-1">Resumen general del estado del inventario y operaciones.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            ${cardsHtml}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            
            ${ChartCard({
                title: 'Evolución de Ventas',
                icon: 'ri-bar-chart-2-line',
                canvasId: 'salesChartCanvas',
                fallbackId: 'salesChartFallback',
                fallbackText: 'Cargando gráfico de ventas...',
                variant: 'brand'
            })}
            
            ${ChartCard({
                title: 'Ventas por Categorías',
                icon: 'ri-pie-chart-2-line',
                canvasId: 'categoriesChartCanvas',
                fallbackId: 'categoriesChartFallback',
                fallbackText: 'Cargando distribución...',
                variant: 'info'
            })}
            
        </div>
    `;
};