/**
 * @file Link.js
 * @description Componente atómico para hipervínculos y elementos de navegación.
 * Sincronizado con Button.js para integrar el color corporativo (brand) 
 * y las proporciones cuadradas simétricas para iconos.
 */

export const Link = ({
    text = '',
    href = '#',
    variant = 'primary',
    size = 'md',
    id = '',
    className = '',
    target = '_self',
    icon = ''
} = {}) => {
    
    // 1. Clases Base - Añadido ring-offset-bg-base para armonizar con el fondo oscuro
    const baseClasses = "inline-flex items-center justify-center gap-2 cursor-pointer font-bold rounded-lg border transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-base no-underline";

    // 2. Diccionario de Variantes - Ajustado para Alto Contraste Oscuro
    const variants = {
        // Variante principal (Brand)
        primary: "bg-brand text-black border-transparent hover:opacity-90 focus:ring-brand",
        
        // Variante para navegación (nav) - Ajustada para fondo oscuro
        nav: "text-text-secondary hover:text-white font-bold px-3 py-2 hover:bg-bg-hover rounded-lg border-transparent focus:ring-brand",
        
        // Variante ghost - Transparente sobre fondo oscuro
        ghost: "bg-transparent text-text-secondary border-transparent hover:text-white hover:bg-bg-hover focus:ring-text-secondary",
        
        // Variante outline-primary (Border de color marca)
        'outline-primary': "bg-transparent border-brand text-brand hover:bg-brand/10 focus:ring-brand",
        
        // Variantes de estado
        danger: "bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500",
        'outline-danger': "bg-transparent border-red-900/50 text-red-400 hover:bg-red-900/20 focus:ring-red-500",
        'outline-success': "bg-transparent border-green-900/50 text-green-400 hover:bg-green-900/20 focus:ring-green-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        'icon-sm': "p-1.5 text-base",
        'icon-md': "p-2 text-lg",
        'icon-lg': "p-3 text-xl"
    };

    const selectedVariant = variants[variant] || variants.primary;
    const selectedSize = sizes[size] || sizes.md;
    const finalClasses = `${baseClasses} ${selectedVariant} ${selectedSize} ${className}`.trim();
    
    const idAttr = id ? `id="${id}"` : '';

    return `
        <a href="${href}" target="${target}" class="${finalClasses}" ${idAttr}>
            ${icon ? `<span class="flex items-center">${icon}</span>` : ''}
            ${text ? `<span>${text}</span>` : ''}
        </a>
    `;
};