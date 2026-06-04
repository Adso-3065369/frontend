/**
 * @file PrivateLayout.js
 * @version 1.0.0
 * @description Estructura base para usuarios autenticados con menú de administración.
 */

import { Navbar } from '@/components/layout';

export const PrivateLayout = (viewContent) => {
    return `
        ${Navbar()}
        <main class="flex-grow w-full max-w-7xl mx-auto py-8 px-4">
            ${viewContent}
        </main>
    `;
};