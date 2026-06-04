import { createRepository } from '@/repositories';
import { displayFormErrors, debounce } from '@/utils';
import { DataTable, Button } from '@/components/ui';

/**
 * @file SaleCreateHandler.js
 * @description Orquestador central para el módulo POS.
 * Administra estado reactivo, modales asíncronos y búsquedas con debounce.
 */

export const SaleCreateHandler = () => {
    // ============================================================================
    // 1. ESTADO CENTRALIZADO (Single Source of Truth)
    // ============================================================================
    const state = {
        client: null,       
        cart: [],           // Array de { product_id, code, name, price, quantity, subtotal }
        total: 0
    };

    // ============================================================================
    // 2. CACHÉ DEL DOM
    // ============================================================================
    const ui = {
        clientContainer: document.getElementById('selected-client-container'),
        clientIdInput: document.getElementById('client_id'),
        cartContainer: document.getElementById('cart-table-container'), 
        grandTotal: document.getElementById('sale-grand-total'),
        btnSave: document.getElementById('btn-save-sale'),
        modals: {
            client: document.getElementById('client-modal'),
            product: document.getElementById('product-modal')
        },
        searchClientInput: document.getElementById('search-client-input'),
        clientSearchResults: document.getElementById('client-search-results'),
        searchProductInput: document.getElementById('search-product-input'),
        productSearchResults: document.getElementById('product-search-results'),
    };

    // Abortar si la vista no se montó correctamente
    if (!ui.cartContainer) return;

    // Instanciación de repositorios
    const saleRepo = createRepository('sales');
    const clientRepo = createRepository('clients');
    const productRepo = createRepository('products');

// ============================================================================
    // 3. CONTRATO DE COLUMNAS DEL CARRITO (Optimizado para Pantallas Pequeñas)
    // ============================================================================
    const cartColumns = [
        {
            // 🚀 AGRUPACIÓN: Nombre y Código en una sola celda
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
            // Cabecera más corta
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
                    <span class="w-6 sm:w-8 text-center text-white font-mono bg-bg-base border border-gray-700 rounded py-0.5 text-sm">${item.quantity}</span>
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
            render: (item) => `
                ${Button({ variant: 'ghost', className: '!p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10', icon: '<i class="ri-delete-bin-line text-lg"></i>', dataset: { action: 'remove', id: item.product_id } })}
            `
        }
    ];

    // ============================================================================
    // 4. MOTORES DE REACTIVIDAD (UI Updaters)
    // ============================================================================
    
    const updateClientUI = () => {
        if (!state.client) {
            ui.clientIdInput.value = "";
            ui.clientContainer.innerHTML = `
                <i class="ri-user-unfollow-line text-2xl block mb-2 opacity-50"></i>
                <p class="text-sm">Ningún cliente seleccionado.</p>
                <p class="text-xs mt-1">Se registrará como Consumidor Final.</p>
            `;
            return;
        }

        ui.clientIdInput.value = state.client.id;
        ui.clientContainer.innerHTML = `
            <div class="text-left">
                <p class="text-xs font-bold text-brand uppercase tracking-wider mb-1">Cliente Vinculado</p>
                <p class="text-lg font-black text-white leading-tight">${state.client.name}</p>
                <p class="text-sm text-gray-400 font-mono mt-1">ID: ${state.client.document_number}</p>
                ${Button({ id: 'btn-remove-client', variant: 'ghost', className: '!p-0 mt-3 text-red-500 hover:text-red-400 hover:bg-transparent text-xs', icon: '<i class="ri-close-circle-line"></i>', text: 'Desvincular' })}
            </div>
        `;
    };

    const updateCartUI = () => {
        state.total = state.cart.reduce((acc, item) => acc + item.subtotal, 0);
        ui.grandTotal.textContent = `$${state.total.toLocaleString('es-CO')}`;
        ui.btnSave.disabled = state.cart.length === 0;

        ui.cartContainer.innerHTML = DataTable({
            columns: cartColumns,
            data: state.cart,
            emptyMessage: 'El carrito está vacío. Agregue productos para comenzar.'
        });
    };

    // ============================================================================
    // 5. CONTROLADOR DE MODALES 
    // ============================================================================
    
    const openModal = (modalId) => {
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

        if (modalId === 'client-modal' && ui.searchClientInput) ui.searchClientInput.focus();
        if (modalId === 'product-modal' && ui.searchProductInput) ui.searchProductInput.focus();
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        const panel = document.getElementById(`${modalId}-panel`);
        
        if (!modal || !panel) return;

        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        panel.classList.remove('scale-100');
        panel.classList.add('scale-95');

        setTimeout(() => {
            if (modal.classList.contains('opacity-0')) {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }
        }, 300);
    };

// ============================================================================
    // 6. MOTORES DE BÚSQUEDA ASÍNCRONA (Debounced)
    // ============================================================================
    
    const performClientSearch = async (searchTerm) => {
        const term = searchTerm.trim();
        if (term.length === 0) {
            ui.clientSearchResults.innerHTML = '<div class="p-4 text-center text-sm text-text-secondary">Escriba para buscar...</div>';
            return;
        }
        if (term.length < 3) {
            ui.clientSearchResults.innerHTML = '<div class="p-4 text-center text-sm text-text-secondary">Escriba al menos 3 caracteres...</div>';
            return;
        }

        ui.clientSearchResults.innerHTML = `<div class="p-6 text-center text-brand"><i class="ri-loader-4-line animate-spin text-3xl block mb-2"></i><span class="text-sm">Buscando clientes...</span></div>`;

        try {
            const response = await clientRepo.getAll(`?search=${term}&limit=10`);
            const clients = response.data || response;

            if (!clients || clients.length === 0) {
                ui.clientSearchResults.innerHTML = `<div class="p-6 text-center text-text-secondary"><i class="ri-user-search-line text-3xl block mb-2 opacity-50"></i>No se encontraron clientes para "${term}".</div>`;
                return;
            }

            // HTML semántico directo para respetar el flexbox
            ui.clientSearchResults.innerHTML = clients.map(client => `
                <button type="button" 
                    data-action="select-client" 
                    data-id="${client.id}" 
                    data-name="${client.name}" 
                    data-doc="${client.document_number}" 
                    class="w-full text-left p-4 border-b border-gray-800 hover:bg-bg-hover transition-colors flex justify-between items-center group first:rounded-t-lg last:rounded-b-lg last:border-b-0">
                    <div>
                        <div class="font-bold text-white group-hover:text-brand transition-colors">${client.name}</div>
                        <div class="text-sm text-text-secondary font-mono mt-1"><i class="ri-profile-line"></i> ${client.document_number}</div>
                    </div>
                    <i class="ri-arrow-right-s-line text-xl text-gray-600 group-hover:text-brand"></i>
                </button>
            `).join('');
        } catch (error) {
            ui.clientSearchResults.innerHTML = '<div class="p-4 text-center text-sm text-red-500 bg-red-500/10">Error de comunicación.</div>';
        }
    };

    const performProductSearch = async (searchTerm) => {
        const term = searchTerm.trim();
        if (term.length === 0) {
            ui.productSearchResults.innerHTML = '<div class="p-4 text-center text-sm text-text-secondary">Escriba para buscar...</div>';
            return;
        }
        if (term.length < 2) { 
            ui.productSearchResults.innerHTML = '<div class="p-4 text-center text-sm text-text-secondary">Escriba al menos 2 caracteres...</div>';
            return;
        }

        ui.productSearchResults.innerHTML = `
            <div class="p-6 text-center text-brand">
                <i class="ri-loader-4-line animate-spin text-3xl block mb-2"></i>
                <span class="text-sm">Escaneando catálogo...</span>
            </div>
        `;

        try {
            const response = await productRepo.getAll(`?search=${term}&limit=10`);
            const products = response.data || response;

            if (!products || products.length === 0) {
                ui.productSearchResults.innerHTML = `
                    <div class="p-6 text-center text-text-secondary">
                        <i class="ri-scan-2-line text-3xl block mb-2 opacity-50"></i>
                        No se encontraron productos para "${term}".
                    </div>
                `;
                return;
            }

            // HTML semántico directo para respetar el layout complejo
            ui.productSearchResults.innerHTML = products.map(product => {
                const outOfStock = product.stock <= 0;
                
                return `
                    <button type="button" 
                        data-action="add-to-cart" 
                        data-id="${product.id}" 
                        data-code="${product.code || 'S/N'}" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        data-stock="${product.stock}"
                        ${outOfStock ? 'disabled' : ''}
                        class="w-full text-left p-4 border-b border-gray-800 hover:bg-bg-hover disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex justify-between items-center group first:rounded-t-lg last:rounded-b-lg last:border-b-0">
                        <div class="space-y-1 text-left">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-white group-hover:text-brand transition-colors">${product.name}</span>
                                <span class="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono uppercase">${product.category || 'Sin Cat.'}</span>
                            </div>
                            <div class="text-xs text-text-secondary font-mono font-normal">
                                Código: ${product.code || 'N/A'} | Stock: <span class="${outOfStock ? 'text-red-500 font-bold' : 'text-gray-300'}">${product.stock} unds</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="font-black text-brand text-lg">$${parseFloat(product.price).toLocaleString('es-CO')}</span>
                        </div>
                    </button>
                `;
            }).join('');

        } catch (error) {
            console.error(error);
            ui.productSearchResults.innerHTML = '<div class="p-4 text-center text-sm text-red-500 bg-red-500/10">Error al escanear el catálogo.</div>';
        }
    };

    if (ui.searchClientInput) {
        ui.searchClientInput.addEventListener('input', debounce((e) => performClientSearch(e.target.value), 500));
    }
    if (ui.searchProductInput) {
        ui.searchProductInput.addEventListener('input', debounce((e) => performProductSearch(e.target.value), 500));
    }

    // ============================================================================
    // 7. DELEGACIÓN DE EVENTOS GLOBAL
    // ============================================================================
    
    document.addEventListener('click', (e) => {
        // Modales
        const targetOpen = e.target.closest('[data-modal-target]');
        if (targetOpen) { openModal(targetOpen.dataset.modalTarget); return; }

        const targetClose = e.target.closest('[data-modal-close]');
        if (targetClose) { closeModal(targetClose.dataset.modalClose); return; }

        // Selección de Cliente
        const btnSelectClient = e.target.closest('[data-action="select-client"]');
        if (btnSelectClient) {
            state.client = {
                id: btnSelectClient.dataset.id,
                name: btnSelectClient.dataset.name,
                document_number: btnSelectClient.dataset.doc
            };
            updateClientUI();
            closeModal('client-modal');
            if(ui.searchClientInput) ui.searchClientInput.value = '';
            ui.clientSearchResults.innerHTML = '<div class="p-4 text-center text-sm text-text-secondary">Escriba para buscar...</div>';
            return;
        }

        // Agregar Producto al Carrito
        const btnAddToCart = e.target.closest('[data-action="add-to-cart"]');
        if (btnAddToCart) {
            const productId = parseInt(btnAddToCart.dataset.id);
            const code = btnAddToCart.dataset.code;
            const name = btnAddToCart.dataset.name;
            const price = parseFloat(btnAddToCart.dataset.price); 
            const stock = parseInt(btnAddToCart.dataset.stock);

            if (stock <= 0) return;

            const existingIndex = state.cart.findIndex(item => item.product_id === productId);

            if (existingIndex !== -1) {
                const item = state.cart[existingIndex];
                
                if (item.quantity >= stock) {
                    alert(`Operación rechazada. Inventario insuficiente para el artículo "${name}". Stock máximo disponible: ${stock} unidades.`);
                    return;
                }
                
                item.quantity += 1;
                item.subtotal = item.quantity * item.price; 
            } else {
                state.cart.push({
                    product_id: productId,
                    code: code,
                    name: name,
                    price: price, 
                    quantity: 1,
                    subtotal: price 
                });
            }

            updateCartUI(); 
            closeModal('product-modal'); 
            
            if (ui.searchProductInput) ui.searchProductInput.value = '';
            ui.productSearchResults.innerHTML = '<div class="p-4 text-center text-sm text-text-secondary">Escriba para buscar...</div>';
            return;
        }

        // Acciones del Carrito (Incrementar, Disminuir, Eliminar)
        const cartAction = e.target.closest('[data-action]');
        if (cartAction && ui.cartContainer.contains(cartAction)) {
            const action = cartAction.dataset.action;
            const productId = parseInt(cartAction.dataset.id);
            
            const index = state.cart.findIndex(i => i.product_id === productId);

            if (index !== -1) {
                const item = state.cart[index];

                if (action === 'increase') {
                    item.quantity += 1;
                    item.subtotal = item.quantity * item.price; 
                } else if (action === 'decrease' && item.quantity > 1) {
                    item.quantity -= 1;
                    item.subtotal = item.quantity * item.price; 
                } else if (action === 'remove') {
                    state.cart.splice(index, 1);
                }
                
                updateCartUI();
            }
            return;
        }

        // Desvincular Cliente
        if (e.target.closest('#btn-remove-client')) {
            state.client = null;
            updateClientUI();
        }
    });

    // ============================================================================
    // 8. FLUJO DE FACTURACIÓN
    // ============================================================================
    ui.btnSave.addEventListener('click', async () => {
        if (state.cart.length === 0) return;

        const payload = {
            client_id: state.client ? state.client.id : null,
            details: state.cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        console.log("Transacción de venta lista para impactar la base de datos:", payload);
        alert("Payload estructurado correctamente. Revise la consola.");
    });
};