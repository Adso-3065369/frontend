import { createRepository } from '@/repositories';
import { StatCard } from '@/components/ui'; 
import { formatCurrency, createChart, ChartPalettes } from '@/utils';
import { DashboardContentTemplate } from './DashboardView';
import Chart from 'chart.js/auto';

/**
 * @file DashboardHandler.js
 * @description Orquestador que conecta los datos reales del Backend con la interfaz.
 */

// Diccionario opcional para transformar números de mes en etiquetas legibles
const MONTH_NAMES = {
    1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
    7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
};

// ============================================================================
// 1. GENERADOR DE TARJETAS HTML
// ============================================================================
const generateCardsHtml = (summary) => {
    const cardsData = [
        {
            title: "Total Productos",
            value: summary.totalProducts || 0,
            icon: "ri-box-3-line",
            variant: "info"
        },
        {
            title: "Valor Inventario",
            value: formatCurrency(summary.inventoryValue || 0),
            icon: "ri-money-dollar-circle-line",
            variant: "success"
        },
        {
            title: "Ventas Totales",
            // 🚀 CORRECCIÓN: Cambiado de totalSalesRevenue a totalRevenue
            value: formatCurrency(summary.totalRevenue || 0),
            icon: "ri-shopping-cart-line",
            variant: "brand"
        },
        {
            title: "Stock Crítico",
            // 🚀 CORRECCIÓN: Cambiado de criticalStockCount a criticalStockProducts
            value: summary.criticalStockProducts || 0,
            icon: "ri-alert-line",
            variant: "danger"
        }
    ];

    return cardsData.map(card => StatCard(card)).join('');
}

// ============================================================================
// 2. RENDERIZADO DE GRÁFICAS (Chart.js)
// ============================================================================
const renderCharts = (chartsData) => {

    console.log(chartsData);
    
    
    const hasSalesData = Array.isArray(chartsData?.salesPerMonth) && chartsData.salesPerMonth.length > 0;
    const hasCategoryData = Array.isArray(chartsData?.topCategories) && chartsData.topCategories.length > 0;

    // --- 1. Gráfico de Ventas Mensuales ---
    if (hasSalesData) {
        createChart({
            canvasId: 'salesChartCanvas',
            fallbackId: 'salesChartFallback',
            type: 'bar',
            labels: chartsData.salesPerMonth.map(d => MONTH_NAMES[d.month] || d.month),
            datasets: [{
                label: 'Ingresos por Ventas',
                data: chartsData.salesPerMonth.map(d => parseFloat(d.revenue)),
                backgroundColor: ChartPalettes.brand.bg,
                borderColor: ChartPalettes.brand.border,
                borderWidth: 2,
                borderRadius: 4
            }],
            options: {
                scales: {
                    y: { 
                        type: 'logarithmic', // 🚀 Fuerza a Chart.js a escalar por magnitudes
                        beginAtZero: true, 
                        grid: { color: 'rgba(255, 255, 255, 0.05)' } 
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- 2. Gráfico de Categorías Top ---
    if (hasCategoryData) {
        createChart({
            canvasId: 'categoriesChartCanvas',
            fallbackId: 'categoriesChartFallback',
            type: 'pie',
            // 🚀 CORRECCIÓN: Cambiado d.category a d.category_name
            labels: chartsData.topCategories.map(d => d.category_name),
            datasets: [{
                // 🚀 CORRECCIÓN: Cambiado d.sales a d.sales_count
                data: chartsData.topCategories.map(d => parseInt(d.sales_count, 10)),
                backgroundColor: ChartPalettes.categorical,
                borderWidth: 0
            }],
            options: {
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#9ca3af' } }
                },
                cutout: '70%'
            }
        });
    }
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL
// ============================================================================
export const DashboardController = async () => {
    const rootContainer = document.getElementById('dashboard-root');
    if (!rootContainer) return;

    try {
        const dashboardRepo = createRepository('dashboard');
        
        // Petición a /api/dashboard/metrics
        const response = await dashboardRepo.getById('metrics'); 
        
        // 🚀 CORRECCIÓN: Como su cliente HTTP ya desempaqueta el JSON, 
        // simplemente accedemos a la propiedad 'data' del nivel raíz.
        const metricsData = response.data; 

        // Validamos estructuralmente que el payload contenga lo que necesitamos
        if (!metricsData || !metricsData.summary) {
            throw new Error("La respuesta de la API no contiene el nodo 'summary' esperado.");
        }

        // Renderizado de componentes estructurales
        const cardsHtml = generateCardsHtml(metricsData.summary);
        rootContainer.innerHTML = DashboardContentTemplate({ cardsHtml });

        // Inyección de gráficos sobre los canvas ya montados en el DOM
        renderCharts(metricsData.charts);

    } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        rootContainer.innerHTML = `
            <div class="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-xl text-center">
                <i class="ri-error-warning-line text-4xl mb-2 block"></i>
                <h3 class="font-bold text-lg">Error de renderizado</h3>
                <p>No se pudieron procesar las métricas operativas del servidor de persistencia.</p>
            </div>
        `;
    }
};