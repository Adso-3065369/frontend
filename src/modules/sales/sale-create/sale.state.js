export const saleState = {
    client: null,
    cart: [],
    total: 0,

    setClient(id, name, document_number) {
        this.client = { id, name, document_number };
    },

    removeClient() {
        this.client = null;
    },

    addToCart(product) {
        if (product.stock <= 0) return { success: false, message: 'Producto agotado en inventario.' };

        const existingIndex = this.cart.findIndex(item => item.product_id === product.id);

        if (existingIndex !== -1) {
            const item = this.cart[existingIndex];
            // Validación al agregar desde el modal
            if (item.quantity >= product.stock) {
                return { success: false, message: `Operación rechazada. Stock máximo disponible: ${product.stock} unidades.` };
            }
            item.quantity += 1;
            item.subtotal = item.quantity * item.price;
        } else {
            // 🚀 MODELO ENRIQUECIDO: Ahora el ítem del carrito transporta su propio límite de stock
            this.cart.push({
                product_id: product.id,
                code: product.code,
                name: product.name,
                price: product.price,
                quantity: 1,
                subtotal: product.price,
                stock: product.stock // <- Guardado localmente en el estado del carrito
            });
        }
        this.calculateTotal();
        return { success: true };
    },

    // 🚀 REFACTORIZADO: Ahora valida el stock al presionar el botón (+) de la tabla
    updateQuantity(productId, action) {
        const index = this.cart.findIndex(i => i.product_id === productId);
        if (index === -1) return { success: false, message: 'Producto no encontrado en el carrito.' };

        const item = this.cart[index];
        
        if (action === 'increase') {
            // 🔒 BLINDAJE DE SEGURIDAD: Comparamos la cantidad actual contra su stock heredado
            if (item.quantity >= item.stock) {
                return { 
                    success: false, 
                    message: `No se pueden añadir más unidades de "${item.name}". Se ha alcanzado el límite de existencias en el inventario (${item.stock} unds).` 
                };
            }
            item.quantity += 1;
            item.subtotal = item.quantity * item.price;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
            item.subtotal = item.quantity * item.price;
        } else if (action === 'remove') {
            this.cart.splice(index, 1);
        }
        
        this.calculateTotal();
        return { success: true }; // Retornamos un estado unificado de éxito
    },

    calculateTotal() {
        this.total = this.cart.reduce((acc, item) => acc + item.subtotal, 0);
    },

    getPayload() {
        return {
            client_id: this.client ? this.client.id : null,
            details: this.cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        };
    }
};