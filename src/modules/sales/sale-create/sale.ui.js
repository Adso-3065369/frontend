import { DataTable, Button } from '@/components/ui';

export const UI = {
    elements: {},

    // Inicializa el caché del DOM
    init() {
        this.elements = {
            clientContainer: document.getElementById('selected-client-container'),
            clientIdInput: document.getElementById('client_id'),
            cartContainer: document.getElementById('cart-table-container'), 
            grandTotal: document.getElementById('sale-grand-total'),
            // Aquí guardamos el campo que dice cómo quiere pagar el cliente.
            metodoPago: document.getElementById('metodoPago'),
            // Aquí va el bloque que cambia cuando el cliente elige tarjeta/transferencia/crédito.
            extraFields: document.getElementById('payment-extra-fields'),
            btnSave: document.getElementById('btn-save-sale'),
            searchClientInput: document.getElementById('search-client-input'),
            clientSearchResults: document.getElementById('client-search-results'),
            searchProductInput: document.getElementById('search-product-input'),
            productSearchResults: document.getElementById('product-search-results'),
            confirmSummary: document.getElementById('sale-confirm-summary'),
            btnConfirmSale: document.getElementById('btn-confirm-sale'),
        };
        return !!this.elements.cartContainer;
    },

    renderPaymentExtraFields(method) {
        if (!this.elements.extraFields) return;

        // Dependiendo de lo que elija el cliente, mostramos un campo distinto.
        // Si paga con tarjeta, pedimos número de tarjeta.
        // Si paga con transferencia, pedimos número de comprobante.
        // Si paga con crédito, pedimos cuántos días tendrá para pagar.
        let html = '';

        if (method === 'tarjeta') {
            html = `
                <label for="numeroTarjeta" class="block text-sm font-medium text-white">Número de tarjeta:</label>
                <input id="numeroTarjeta" name="numeroTarjeta" maxlength="16" type="text" class="w-full bg-bg-base border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-brand transition-colors" placeholder="1234 5678 9012 3456">
            `;
        } else if (method === 'transferencia') {
            html = `
                <label for="comprobante" class="block text-sm font-medium text-white">Número de comprobante:</label>
                <input id="comprobante" name="comprobante" type="text" class="w-full bg-bg-base border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-brand transition-colors" placeholder="ABC123456789">
            `;
        } else if (method === 'credito') {
            html = `
                <label for="plazo" class="block text-sm font-medium text-white">Plazo (días):</label>
                <input id="plazo" name="plazo" type="number" min="1" class="w-full bg-bg-base border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-brand transition-colors" placeholder="30">
            `;
        }

        this.elements.extraFields.innerHTML = html;
    },

    getPaymentExtraFields() {
        // Leemos el dato extra según el método de pago que el cliente eligió.
        // De esta forma guardamos solo lo que corresponde.
        const method = this.elements.metodoPago?.value || 'efectivo';

        if (method === 'tarjeta') {
            return { card_number: this.elements.extraFields.querySelector('#numeroTarjeta')?.value.trim() || '' };
        }

        if (method === 'transferencia') {
            return { receipt_number: this.elements.extraFields.querySelector('#comprobante')?.value.trim() || '' };
        }

        if (method === 'credito') {
            return { term_days: parseInt(this.elements.extraFields.querySelector('#plazo')?.value, 10) || null };
        }

        return {};
    },

    modals: {
        open(modalId) {
            const modal = document.getElementById(modalId);
            const panel = document.getElementById(`${modalId}-panel`);
            if (!modal || !panel) return;

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            void modal.offsetWidth; 
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
            panel.classList.remove('scale-95');
            panel.classList.add('scale-100');

            if (modalId === 'client-modal') document.getElementById('search-client-input')?.focus();
            if (modalId === 'product-modal') document.getElementById('search-product-input')?.focus();
        },
        close(modalId) {
            const modal = document.getElementById(modalId);
            const panel = document.getElementById(`${modalId}-panel`);
            if (!modal || !panel) return;

            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            panel.classList.remove('scale-100');
            panel.classList.add('scale-95');

            setTimeout(() => {
                if (modal.classList.contains('opacity-0')) {
                    modal.classList.remove('flex', 'hidden');
                    modal.classList.add('hidden');
                }
            }, 300);
        }
    },

    updateClient(client) {
        if (!client) {
            this.elements.clientIdInput.value = "";
            this.elements.clientContainer.innerHTML = `
                <i class="ri-user-unfollow-line text-2xl block mb-2 opacity-50"></i>
                <p class="text-sm">Ningún cliente seleccionado.</p>
                <p class="text-xs mt-1">Se registrará como Consumidor Final.</p>
            `;
            return;
        }
        this.elements.clientIdInput.value = client.id;
        this.elements.clientContainer.innerHTML = `
            <div class="text-left">
                <p class="text-xs font-bold text-brand uppercase tracking-wider mb-1">Cliente Vinculado</p>
                <p class="text-lg font-black text-white leading-tight">${client.name}</p>
                <p class="text-sm text-gray-400 font-mono mt-1">ID: ${client.document_number}</p>
                ${Button({ id: 'btn-remove-client', variant: 'ghost', className: '!p-0 mt-3 text-red-500 hover:text-red-400 hover:bg-transparent text-xs', icon: '<i class="ri-close-circle-line"></i>', text: 'Desvincular' })}
            </div>
        `;
    },

    updateCart(cartData, totalAmount) {
        this.elements.grandTotal.textContent = `$${totalAmount.toLocaleString('es-CO')}`;
        this.elements.btnSave.disabled = cartData.length === 0;

        const cartColumns = [
            {
                header: 'Producto',
                accessor: 'name',
                render: (item) => `
                    <div class="flex flex-col justify-center">
                        <span class="font-bold text-white text-sm truncate max-w-[130px] sm:max-w-[200px]" title="${item.name}">${item.name}</span>
                        <span class="text-gray-500 font-mono text-[10px] uppercase mt-0.5">CÓD: ${item.code || 'S/N'}</span>
                    </div>
                `
            },
            {
                header: 'Precio',
                accessor: 'price',
                render: (item) => `<span class="text-text-secondary text-sm whitespace-nowrap">$${parseFloat(item.price).toLocaleString('es-CO')}</span>`
            },
            {
                header: 'Cant.',
                accessor: 'quantity',
                render: (item) => `
                    <div class="flex items-center justify-center gap-1">
                        ${Button({ variant: 'ghost', className: '!p-0.5 text-gray-400 hover:text-white', icon: '<i class="ri-subtract-line"></i>', dataset: { action: 'decrease', id: item.product_id } })}
                        <input type="text" class="w-6 sm:w-8 text-center text-white font-mono bg-bg-base border border-gray-700 rounded py-0.5 text-sm" value = "${item.quantity}" disabled>
                        ${Button({ variant: 'ghost', className: '!p-0.5 text-gray-400 hover:text-white', icon: '<i class="ri-add-line"></i>', dataset: { action: 'increase', id: item.product_id } })}
                    </div>
                `
            },
            {
                header: 'Subtotal',
                accessor: 'subtotal',
                render: (item) => `<span class="font-black text-brand text-sm whitespace-nowrap">$${parseFloat(item.subtotal).toLocaleString('es-CO')}</span>`
            },
            {
                header: '',
                accessor: 'actions',
                render: (item) => `${Button({ variant: 'ghost', className: '!p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10', icon: '<i class="ri-delete-bin-line text-lg"></i>', dataset: { action: 'remove', id: item.product_id } })}`
            }
        ];

        this.elements.cartContainer.innerHTML = DataTable({
            columns: cartColumns,
            data: cartData,
            emptyMessage: 'El carrito está vacío. Agregue productos para comenzar.'
        });
    },

    // 🚀 Resumen mostrado en el modal de confirmación antes de registrar la venta
    renderConfirmSummary(client, cart, total, paymentMethod) {
        const clientLabel = client
            ? `${client.name} <span class="text-gray-500 font-mono text-xs">(Doc: ${client.document_number})</span>`
            : 'Consumidor Final';

        const paymentMethodMap = {
            efectivo: 'Efectivo',
            tarjeta: 'Tarjeta',
            transferencia: 'Transferencia',
            credito: 'Crédito'
        };

        const paymentMethodLabel = paymentMethodMap[paymentMethod] || 'Efectivo';
        const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

        this.elements.confirmSummary.innerHTML = `
            <div class="flex justify-between items-center border-b border-gray-800 pb-3">
                <span class="text-sm">Cliente</span>
                <span class="text-white font-bold text-right">${clientLabel}</span>
            </div>
            <div class="flex justify-between items-center border-b border-gray-800 pb-3">
                <span class="text-sm">Método de pago</span>
                <span class="text-white font-bold">${paymentMethodLabel}</span>
            </div>
            <div class="flex justify-between items-center border-b border-gray-800 pb-3">
                <span class="text-sm">Productos en el carrito</span>
                <span class="text-white font-bold">${cart.length} (${itemsCount} unds.)</span>
            </div>
            <div class="flex justify-between items-center text-lg">
                <span class="font-bold text-white">Total a cobrar</span>
                <span class="font-black text-brand">$${total.toLocaleString('es-CO')}</span>
            </div>
            <p class="text-xs text-text-secondary italic pt-2">Verifique los datos antes de confirmar. Esta acción registrará la venta de forma definitiva.</p>
        `;
    }
};