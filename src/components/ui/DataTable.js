/**
 * @file DataTable.js
 * @description Componente UI para tablas dinámicas de datos.
 * Genera de forma reactiva cabeceras y celdas aplicando funciones de renderizado personalizadas si existen.
 * @param {Object} props - Diccionario de parámetros de configuración del componente.
 * @param {Array<Object>} [props.columns=[]] - Contrato estructural de las columnas. Cada objeto requiere `header` (título de la columna), `accessor` (llave del valor en el objeto de datos), y opcionalmente `render` (función que recibe la fila actual y retorna HTML personalizado para la celda).
 * @param {Array<Object>} [props.data=[]] - Colección de objetos (registros/filas) a iterar y renderizar en el cuerpo de la tabla.
 * @param {string} [props.emptyMessage='No hay registros disponibles.'] - Mensaje de fallback a mostrar de forma centrada cuando la colección de datos está vacía.
 * @param {string} [props.className=''] - Clases CSS de utilidad adicionales (Tailwind) para inyectar en el contenedor exterior (`<div class="overflow-x-auto...">`).
 * @returns {string} Cadena de texto con el marcado HTML compilado del contenedor y la tabla (`<div><table>...</table></div>`) listo para inyección en el DOM.
 */
export const DataTable = ({
    columns = [],
    data = [],
    emptyMessage = 'No hay registros disponibles.',
    className = ''
} = {}) => {
    
    // 1. Clases Base (Patrón BEM/Tailwind)
    const baseTableClasses = 'w-full text-left text-sm text-text-secondary';
    const headerClasses = 'text-xs text-gray-400 uppercase bg-gray-800/50 border-b border-gray-700';
    const rowClasses = 'border-b border-gray-800 hover:bg-gray-800/30 transition-colors';
    const cellClasses = 'px-6 py-4 whitespace-nowrap';

    // 2. Construcción dinámica de cabeceras (<th>)
    const theadHTML = columns.map(col => `
        <th scope="col" class="px-6 py-3 font-bold tracking-wider">
            ${col.header}
        </th>
    `).join('');

    // 3. Construcción dinámica de filas (<tr>) y celdas (<td>)
    let tbodyHTML = '';

    if (data.length === 0) {
        tbodyHTML = `
            <tr>
                <td colspan="${columns.length}" class="${cellClasses} text-center italic opacity-50">
                    ${emptyMessage}
                </td>
            </tr>
        `;
    } else {
        tbodyHTML = data.map(row => `
            <tr class="${rowClasses}">
                ${columns.map(col => {
                    // Si la columna tiene un método "render" personalizado (ej. para acciones o formateo), lo ejecuta.
                    // Si no, simplemente imprime el valor crudo del objeto (accessor).
                    const cellContent = col.render ? col.render(row) : row[col.accessor];
                    return `<td class="${cellClasses}">${cellContent || '-'}</td>`;
                }).join('')}
            </tr>
        `).join('');
    }

    // 4. Retorno del componente ensamblado
    return `
        <div class="overflow-x-auto bg-bg-surface border border-gray-800 rounded-xl ${className}">
            <table class="${baseTableClasses}">
                <thead class="${headerClasses}">
                    <tr>${theadHTML}</tr>
                </thead>
                <tbody>
                    ${tbodyHTML}
                </tbody>
            </table>
        </div>
    `;
};