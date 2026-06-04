import { Card } from '@/components/ui';

/**
 * @file ChartCard.js
 * @description Componente UI para envolver lienzos de gráficos (Canvas).
 * Aplica variantes de diseño temáticas y gestiona los fallbacks de estado de carga o vacío.
 * @param {Object} props - Diccionario de parámetros de configuración del componente.
 * @param {string} [props.title='Gráfico'] - Título descriptivo que encabeza la tarjeta del gráfico.
 * @param {string} [props.icon='ri-pie-chart-2-line'] - Clase de Remix Icon (o similar) para acompañar el título.
 * @param {string} props.canvasId - Identificador único (`id`) imperativo para el elemento `<canvas>`, necesario para la instanciación de librerías como Chart.js.
 * @param {string} props.fallbackId - Identificador único (`id`) para el contenedor superpuesto de carga/estado vacío, utilizado para ocultarlo/mostrarlo desde el controlador.
 * @param {string} [props.fallbackText='Cargando datos...'] - Texto por defecto a mostrar mientras el lienzo se renderiza o si no hay datos.
 * @param {'default'|'brand'|'success'|'danger'|'warning'|'info'} [props.variant='default'] - Define el color semántico aplicado exclusivamente al ícono del título.
 * @param {string} [props.className='min-h-[400px]'] - Clases CSS adicionales para definir las dimensiones del contenedor de la tarjeta (Tailwind).
 * @returns {string} Cadena de texto con el marcado HTML compilado que incluye el componente `Card` base y el lienzo anidado.
 */
export const ChartCard = ({
    title = 'Gráfico',
    icon = 'ri-pie-chart-2-line',
    canvasId = '',
    fallbackId = '',
    fallbackText = 'Cargando datos...',
    variant = 'default',
    className = 'min-h-[400px]'
} = {}) => {
    
    // 1. Clases Base
    const baseIconClasses = 'mr-2 text-lg';

    // 2. Diccionario de Variantes (En este caso, focalizado en el ícono para mantener la limpieza del contenedor)
    const variants = {
        default: 'text-text-secondary',
        brand:   'text-brand',
        success: 'text-green-500',
        danger:  'text-red-500',
        warning: 'text-yellow-500',
        info:    'text-blue-500'
    };

    // 3. Selección y composición con Fail-safe
    const selectedVariant = variants[variant] || variants.default;
    const finalIconClasses = `${baseIconClasses} ${selectedVariant}`.trim();

    // 4. Retorno delegando el contenedor base al componente Card genérico
    return Card({
        bodyClass: 'p-8 flex flex-col',
        className: className,
        children: `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-sm font-bold text-text-secondary uppercase tracking-widest flex items-center">
                    <i class="${icon} ${finalIconClasses}"></i> ${title}
                </h3>
            </div>
            <div class="relative w-full flex-grow flex items-center justify-center">
                <canvas id="${canvasId}"></canvas>
                
                <div id="${fallbackId}" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p class="text-text-secondary italic font-medium opacity-50">${fallbackText}</p>
                </div>
            </div>
        `
    });
};