import { createRepository } from '@/repositories';
import { debounce } from '@/utils';
import { saleState } from './sale.state.js';
import { UI } from './sale.ui.js';
import { SearchService } from './sale.search.js';

const checkSaveButtonStatus = () => {
    const hasProducts = saleState.cart.length > 0;
    const hasClient = !!saleState.client; // Evalúa si existe el objeto cliente
    
    // El botón se deshabilita si falta alguno de los dos
    UI.elements.btnSave.disabled = !(hasProducts && hasClient);
};

export const SaleCreateHandler = () => {
    // 1. Inicialización
    if (!UI.init()) return;

    checkSaveButtonStatus();

    const saleRepo = createRepository('sales'); 
    const clientRepo = createRepository('clients');
    const productRepo = createRepository('products');

    // 2. Conexión de Buscadores (Debounce)
    if (UI.elements.searchClientInput) {
        UI.elements.searchClientInput.addEventListener('input', debounce((e) => {
            SearchService.findClients(e.target.value, clientRepo, UI.elements.clientSearchResults);
        }, 500));
    }
    
    if (UI.elements.searchProductInput) {
        UI.elements.searchProductInput.addEventListener('input', debounce((e) => {
            SearchService.findProducts(e.target.value, productRepo, UI.elements.productSearchResults);
        }, 500));
    }

    // 3. Delegación de Eventos Centralizada
    document.addEventListener('click', (e) => {
        // Control de Modales
        const targetOpen = e.target.closest('[data-modal-target]');
        if (targetOpen) return UI.modals.open(targetOpen.dataset.modalTarget);

        const targetClose = e.target.closest('[data-modal-close]');
        if (targetClose) return UI.modals.close(targetClose.dataset.modalClose);

        // Selección de Cliente
        const btnSelectClient = e.target.closest('[data-action="select-client"]');
        if (btnSelectClient) {
            saleState.setClient(btnSelectClient.dataset.id, btnSelectClient.dataset.name, btnSelectClient.dataset.doc);
            UI.updateClient(saleState.client);
            UI.modals.close('client-modal');
            UI.elements.searchClientInput.value = '';
            UI.elements.clientSearchResults.innerHTML = '';

            checkSaveButtonStatus();
            return;
        }

        // Agregar al Carrito (Validación de stock inicial)
        const btnAddToCart = e.target.closest('[data-action="add-to-cart"]');
        if (btnAddToCart) {
            const productDTO = {
                id: parseInt(btnAddToCart.dataset.id),
                code: btnAddToCart.dataset.code,
                name: btnAddToCart.dataset.name,
                price: parseFloat(btnAddToCart.dataset.price),
                stock: parseInt(btnAddToCart.dataset.stock)
            };

            const result = saleState.addToCart(productDTO);
            if (!result.success) {
                alert(result.message);
                return;
            }

            UI.updateCart(saleState.cart, saleState.total);
            UI.modals.close('product-modal');
            UI.elements.searchProductInput.value = '';
            UI.elements.productSearchResults.innerHTML = '';

            checkSaveButtonStatus();
            return;
        }

        // Acciones internas del carrito (+, -, eliminar) con validación de stock
        const cartAction = e.target.closest('[data-action]');
        if (cartAction && UI.elements.cartContainer.contains(cartAction)) {
            const action = cartAction.dataset.action;
            const productId = parseInt(cartAction.dataset.id);
            
            const result = saleState.updateQuantity(productId, action);
            
            if (!result.success) {
                alert(result.message);
                return; 
            }
            
            UI.updateCart(saleState.cart, saleState.total);

            checkSaveButtonStatus();
            return;
        }

        // Desvincular Cliente
        if (e.target.closest('#btn-remove-client')) {
            saleState.removeClient();
            checkSaveButtonStatus();
            UI.updateClient(null);
        }
    });

    // ============================================================================
    // 4. FLUJO DE FACTURACIÓN (Envío Transaccional)
    // ============================================================================
    UI.elements.btnSave.addEventListener('click', async () => {
        if (saleState.cart.length === 0 || !saleState.client){
            alert("Debe estar asignado un cliente y un producto para proceder con la compra");
            return
        };

        const payload = saleState.getPayload();

        const originalText = UI.elements.btnSave.innerHTML;
        UI.elements.btnSave.disabled = true;
        UI.elements.btnSave.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Procesando...';

        
        try {
            const response = await saleRepo.create(payload);

            if (response) {
                saleState.cart = [];
                saleState.removeClient();
                UI.updateCart([], 0);
                UI.updateClient(null);
                
                alert("✅ Transacción registrada con éxito.");
            }
        } catch (error) {

            console.error("Fallo en la transacción:", error);
            alert("❌ Ocurrió un error al registrar la venta. Revise su conexión.");
        } finally {
            checkSaveButtonStatus();
            UI.elements.btnSave.disabled = saleState.cart.length === 0;
            UI.elements.btnSave.innerHTML = originalText;
        }

    });
};