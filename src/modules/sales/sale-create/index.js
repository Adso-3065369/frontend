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

    // Al iniciar la pantalla, mostramos el campo extra que corresponda al método de pago elegido.
    if (UI.elements.metodoPago) {
        UI.renderPaymentExtraFields(UI.elements.metodoPago.value);
        UI.elements.metodoPago.addEventListener('change', () => {
            UI.renderPaymentExtraFields(UI.elements.metodoPago.value);
        });
    }

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
    // 4. FLUJO DE FACTURACIÓN (Confirmación + Envío Transaccional)
    // ============================================================================

    // 4.1. Al presionar "Procesar Factura" ya no se envía de inmediato:
    // se valida y se abre el modal de confirmación con el resumen de la venta.
    UI.elements.btnSave.addEventListener('click', () => {
        if (saleState.cart.length === 0 || !saleState.client){
            alert("Debe estar asignado un cliente y un producto para proceder con la compra");
            return
        };

        // Antes de abrir el resumen, verificamos que el cliente haya completado
        // los datos extra que pide el método de pago elegido.
        // Obtenemos el método de pago seleccionado por el usuario. Si no hay ninguno, por defecto se elige 'efectivo'.
        const paymentMethod = UI.elements.metodoPago?.value || 'efectivo';
        //Traemos la información adicional que el usuario escribió (como datos de la tarjeta o el recibo).
        const extraFields = UI.getPaymentExtraFields();
        // Si eligió 'tarjeta', revisamos que no haya dejado el número de tarjeta en blanco.
        if (paymentMethod === 'tarjeta' && !extraFields.card_number) {
            alert('Ingrese el número de tarjeta antes de continuar.');
            return;    // 3. Si eligió 'tarjeta', revisamos que no haya dejado el número de tarjeta en blanco.
        }
    //Si eligió 'transferencia', revisamos que haya escrito el número del recibo o comprobante.
        if (paymentMethod === 'transferencia' && !extraFields.receipt_number) {
            alert('Ingrese el número de comprobante antes de continuar.');
            return;// Detiene el proceso para que ingrese el comprobante.
        }
    //Si eligió 'credito', revisamos que haya puesto la cantidad de días de plazo para pagar.
        if (paymentMethod === 'credito' && !extraFields.term_days) {
            alert('Ingrese el plazo en días antes de continuar.');
            return;// Detiene el proceso para que elija los días.
        }

    //Si todos los datos anteriores están bien, preparamos la pantalla con el resumen final de la venta.
    // Le pasamos el cliente, los productos agregados, el total de dinero y la forma en que va a pagar.
        UI.renderConfirmSummary(saleState.client, saleState.cart, saleState.total, paymentMethod);
    //Finalmente, abrimos la ventana flotante (el cuadro en pantalla) para confirmar la venta.
        UI.modals.open('sale-confirm-modal');
    });

    // 4.2. Solo al confirmar dentro del modal se ejecuta la transacción real.
    UI.elements.btnConfirmSale.addEventListener('click', async () => {
        // Al confirmar, juntamos todo lo que necesitamos enviar al servidor.
        // Esto incluye el método de pago y los datos extra de ese método.
        const payload = {
            ...saleState.getPayload(),
            payment_method: UI.elements.metodoPago?.value || 'efectivo',
            payment_data: UI.getPaymentExtraFields()
        };
        const originalText = UI.elements.btnConfirmSale.innerHTML;
        UI.elements.btnConfirmSale.disabled = true;
        UI.elements.btnConfirmSale.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Procesando...';

        try {
            const response = await saleRepo.create(payload);

            if (response) {
                saleState.cart = [];
                saleState.removeClient();
                UI.updateCart([], 0);
                UI.updateClient(null);
                UI.modals.close('sale-confirm-modal');

                alert("✅ Transacción registrada con éxito.");
            }
        } catch (error) {

            console.error("Fallo en la transacción:", error);
            alert("❌ Ocurrió un error al registrar la venta. Revise su conexión.");
        } finally {
            checkSaveButtonStatus();
            UI.elements.btnConfirmSale.disabled = false;
            UI.elements.btnConfirmSale.innerHTML = originalText;
        }
    });
};