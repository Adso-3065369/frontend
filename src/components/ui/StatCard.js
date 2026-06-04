/**
 * @file StatCard.js
 * @description Componente UI para tarjetas estadísticas. 
 * Implementa el patrón de variantes para estandarizar los colores de estado.
 */
export const StatCard = ({
    title = 'Métrica Indefinida',
    value = '0',
    variant = 'default',
    className = '',
    icon = 'ri-bar-chart-box-line'
} = {}) => {
    
    // 1. Clases Base (Inmutables)
    const baseContainerClasses = 'bg-bg-surface border border-gray-800 rounded-xl p-6 flex items-center transition-colors hover:border-gray-700';
    const baseIconContainerClasses = 'w-14 h-14 rounded-full flex items-center justify-center text-2xl mr-4';

    // 2. Diccionario de Variantes (Reglas de diseño)
    const variants = {
        default: 'text-gray-400 bg-gray-800/50',
        success: 'text-green-500 bg-green-500/10',
        danger:  'text-red-500 bg-red-500/10',
        warning: 'text-yellow-500 bg-yellow-500/10',
        info:    'text-blue-500 bg-blue-500/10',
        brand:   'text-brand bg-brand/10'
    };

    // 3. Selección de la variante con mecanismo de Fallback (Fail-safe)
    const selectedVariant = variants[variant] || variants.default;

    // 4. Composición final de las clases
    const finalContainerClasses = `${baseContainerClasses} ${className}`.trim();
    const finalIconClasses = `${baseIconContainerClasses} ${selectedVariant}`;

    // 5. Retorno del HTML inyectando las variables
    return `
        <div class="${finalContainerClasses}">
            <div class="${finalIconClasses}">
                <i class="${icon}"></i>
            </div>
            <div>
                <p class="text-text-secondary text-xs uppercase font-bold tracking-widest mb-1">${title}</p>
                <h4 class="text-2xl font-black text-white">${value}</h4>
            </div>
        </div>
    `;
};