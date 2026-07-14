/**
 * @file profileCard.js
 * @description Componente atómico contenedor. Centraliza la estructura base de las superficies del sistema.
 * @param {Object} props - Diccionario de parámetros de configuración del componente.
 * @param {string} [props.id=''] - Id que se le puede dar a la Card de modo que se le puedan meter estilos dinamicos
 * @param {string} [props.name=''] - El nombre del usuario
 * @param {string} [props.role=''] - El rol del usuario
 * @returns {string} Cadena de texto con el marcado HTML compilado (`<div class="...">...</div>`) listo para su inyección en el DOM.
 */

import { Badge } from '@/components/ui';


export const profileCard = ({
    name = '',
    email = '',
    role = ''
}) => {
    return `
    <div class="flex items-center gap-5">
        <div class="bg-black w-20 h-20 flex justify-center items-center rounded-full text-xl text-(--primary-dark) font-bold">${name[0].toUpperCase()}</div>
        <div class="flex-row items-center">
            <p class="text-text-primary">${name}</p>
            <p class="text-text-secondary">${email}</p>
        </div>
    </div>
    ${Badge({
        text: `${role}`,
        variant: 'info',
        className: 'w-20 h-10 rounded-xl border-none'
    })}`

}