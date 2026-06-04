import { createRepository } from '@/repositories';
import { DataTable } from '@/components/ui';

/**
 * @file SalesDetailHandler.js
 * @description Orquestador para la vista de detalle de ventas.
 * Aplica SRP fraccionando la construcción de UI y consume el endpoint optimizado.
 */

// ============================================================================
// 1. CONTRATOS DE UI (SRP: Responsables únicamente de estructurar datos)
// ============================================================================

/**
 * Define el esquema de columnas para el componente global DataTable.
 */
const productColumns = [
    {
        header: 'Producto',
        accessor: 'product_name',
        render: (detail) => `<span class="font-bold text-white">${detail.product_name}</span>`
    },
    {
        header: 'Precio Unitario',
        accessor: 'unit_price',
        render: (detail) => `<span class="text-text-secondary">$${parseFloat(detail.unit_price).toLocaleString('es-CO')}</span>`
    },
    {
        header: 'Cant.',
        accessor: 'quantity',
        render: (detail) => `<span class="font-mono bg-bg-base px-2 py-1 rounded text-gray-300">${detail.quantity}</span>`
    },
    {
        header: 'Subtotal',
        accessor: 'subtotal',
        render: (detail) => `<span class="font-black text-brand">$${parseFloat(detail.subtotal).toLocaleString('es-CO')}</span>`
    }
];

/**
 * Construye el marcado HTML para la tarjeta de resumen del cliente/vendedor.
 * @param {Object} sale - DTO de la venta completo
 * @returns {string} String HTML
 */
const buildCustomerSummaryHtml = (sale) => {
    const date = new Date(sale.created_at || sale.date).toLocaleString('es-CO');
    
    return `
        <div class="space-y-5">
            <div class="space-y-1">
                <p class="text-xs font-bold text-text-secondary uppercase tracking-wider">Facturado a:</p>
                <p class="text-lg font-black text-white leading-tight">${sale.client?.name || 'Consumidor Final'}</p>
                <p class="text-sm text-gray-400 font-mono">ID: ${sale.client?.document_number || 'N/A'}</p>
            </div>
            
            <hr class="border-gray-800">
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Fecha</p>
                    <p class="text-sm text-gray-300">${date}</p>
                </div>
                <div>
                    <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Cajero</p>
                    <p class="text-sm text-gray-300"><i class="ri-user-line mr-1"></i> ${sale.user?.name || 'Sistema'}</p>
                </div>
            </div>

            <div class="pt-4">
                <div class="bg-bg-base border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <span class="text-sm font-bold text-gray-400 uppercase">Monto Total</span>
                    <span class="text-2xl font-black text-brand">$${parseFloat(sale.total).toLocaleString('es-CO')}</span>
                </div>
            </div>
        </div>
    `;
};

// ============================================================================
// 2. ORQUESTADOR PRINCIPAL
// ============================================================================
export const SalesDetailHandler = async () => {
    // 1. Extracción y Validación del Parámetro (ID)
    const hashParts = window.location.hash.split('/');
    const saleId = hashParts[hashParts.length - 1];

    if (!saleId || isNaN(saleId)) {
        console.error("Identificador de venta inválido o ausente en la URL.");
        window.location.hash = '#/ventas';
        return;
    }

    // 2. Captura de los contenedores del DOM (Esqueletos)
    const summaryContainer = document.getElementById('customer-summary-col');
    const listContainer = document.getElementById('product-list-col');
    const headerIdBadge = document.getElementById('header-invoice-id');

    if (!summaryContainer || !listContainer) return;

    const saleRepo = createRepository('sales');

    try {
        // 3. Petición HTTP (Única, aprovechando el Backend optimizado)
        const { data: sale } = await saleRepo.getById(saleId);

        if (!sale) throw new Error("La transacción no existe en la base de datos.");

        // 4. Inyección de UI: Cabecera
        if (headerIdBadge) {
            headerIdBadge.textContent = `#${sale.id}`;
            headerIdBadge.classList.remove('hidden');
        }

        // 5. Inyección de UI: Resumen (Se reemplaza el esqueleto)
        summaryContainer.innerHTML = buildCustomerSummaryHtml(sale);

        // 6. Inyección de UI: Lista de Productos (Delegado al DataTable global)
        listContainer.innerHTML = DataTable({
            columns: productColumns,
            data: sale.details || [],
            emptyMessage: 'Esta transacción no contiene un desglose de productos válido.'
        });

    } catch (error) {
        console.error("Fallo transaccional al recuperar el detalle de la venta:", error);
        
        const errorMessage = error.response?.data?.message || "Registro no encontrado o fallo de conexión.";
        
        // Reemplazo visual de los esqueletos por estados de error
        summaryContainer.innerHTML = `
            <div class="text-center p-6 bg-red-500/10 border border-red-500 rounded-xl text-red-500 font-bold">
                <i class="ri-error-warning-line text-3xl block mb-2"></i>
                No se pudo cargar el resumen del cliente.
            </div>
        `;
        
        listContainer.innerHTML = `
            <div class="text-center p-8 text-text-secondary italic">
                La información detallada de esta factura no está disponible en este momento.<br>
                ${errorMessage}
            </div>
        `;
    }
};