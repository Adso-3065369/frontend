import Chart from 'chart.js/auto';

/**
 * @file chart.factory.js
 * @description Fábrica centralizada para la instanciación de gráficos.
 * Desacopla la librería Chart.js de los controladores de dominio.
 */

// Paletas estandarizadas del sistema de diseño
const PALETTES = {
    brand: {
        bg: 'rgba(99, 102, 241, 0.2)',
        border: 'rgba(99, 102, 241, 1)'
    },
    categorical: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
};

/**
 * Crea un gráfico dinámico gestionando el DOM y los fallbacks de carga.
 * @param {Object} config - Configuración del gráfico
 * @param {string} config.canvasId - ID del elemento <canvas>
 * @param {string} config.fallbackId - ID del contenedor de carga a ocultar
 * @param {string} config.type - Tipo de gráfico ('bar', 'doughnut', 'line', etc.)
 * @param {Array} config.labels - Arreglo de etiquetas (Eje X o leyendas)
 * @param {Array} config.datasets - Arreglo de datasets de Chart.js
 * @param {Object} [config.options] - Opciones adicionales para sobreescribir las base
 */
export const createChart = ({ canvasId, fallbackId, type, labels, datasets, options = {} }) => {
    const canvas = document.getElementById(canvasId);
    const fallback = document.getElementById(fallbackId);

    if (!canvas) {
        console.warn(`ChartFactory: No se encontró el canvas con ID '${canvasId}'`);
        return null;
    }

    // Ocultar el estado de carga si existe
    if (fallback) fallback.classList.add('hidden');

    // Configuración base compartida por todos los gráficos del sistema
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: type !== 'bar' } // Ocultar leyenda por defecto en barras
        }
    };

    // Mergear opciones base con opciones específicas pasadas por parámetro
    const finalOptions = { ...baseOptions, ...options };

    return new Chart(canvas, {
        type,
        data: { labels, datasets },
        options: finalOptions
    });
};

export const ChartPalettes = PALETTES;