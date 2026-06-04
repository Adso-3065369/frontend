export const SearchService = {
    async findClients(term, repo, container) {
        if (term.length < 3) {
            container.innerHTML = '<div class="p-4 text-center text-sm text-text-secondary">Escriba al menos 3 caracteres...</div>';
            return;
        }
        container.innerHTML = `<div class="p-6 text-center text-brand"><i class="ri-loader-4-line animate-spin text-3xl block mb-2"></i><span class="text-sm">Buscando clientes...</span></div>`;

        try {
            const response = await repo.getAll(`?search=${term}&limit=10&paginate=false`);
            const clients = response.data || response;

            if (!clients || clients.length === 0) {
                container.innerHTML = `<div class="p-6 text-center text-text-secondary"><i class="ri-user-search-line text-3xl block mb-2 opacity-50"></i>Sin resultados.</div>`;
                return;
            }

            container.innerHTML = clients.map(c => `
                <button type="button" data-action="select-client" data-id="${c.id}" data-name="${c.name}" data-doc="${c.document_number}" class="w-full text-left p-4 border-b border-gray-800 hover:bg-bg-hover transition-colors flex justify-between items-center group first:rounded-t-lg last:rounded-b-lg last:border-b-0">
                    <div>
                        <div class="font-bold text-white group-hover:text-brand">${c.name}</div>
                        <div class="text-sm text-text-secondary font-mono mt-1">${c.document_number}</div>
                    </div>
                    <i class="ri-arrow-right-s-line text-xl text-gray-600 group-hover:text-brand"></i>
                </button>
            `).join('');
        } catch (error) {
            container.innerHTML = '<div class="p-4 text-center text-sm text-red-500">Error de comunicación.</div>';
        }
    },

    async findProducts(term, repo, container) {
        if (term.length < 2) { 
            container.innerHTML = '<div class="p-4 text-center text-sm text-text-secondary">Escriba al menos 2 caracteres...</div>';
            return;
        }
        container.innerHTML = `<div class="p-6 text-center text-brand"><i class="ri-loader-4-line animate-spin text-3xl block mb-2"></i><span class="text-sm">Escaneando catálogo...</span></div>`;

        try {
            const response = await repo.getAll(`?search=${term}&limit=10&paginate=false`);
            const products = response.data || response;

            if (!products || products.length === 0) {
                container.innerHTML = `<div class="p-6 text-center text-text-secondary">Sin resultados.</div>`;
                return;
            }

            container.innerHTML = products.map(p => {
                const outOfStock = p.stock <= 0;
                return `
                    <button type="button" data-action="add-to-cart" data-id="${p.id}" data-code="${p.code || 'S/N'}" data-name="${p.name}" data-price="${p.price}" data-stock="${p.stock}" ${outOfStock ? 'disabled' : ''} class="w-full text-left p-4 border-b border-gray-800 hover:bg-bg-hover disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex justify-between items-center group first:rounded-t-lg last:rounded-b-lg last:border-b-0">
                        <div class="space-y-1 text-left">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-white group-hover:text-brand">${p.name}</span>
                                <span class="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono uppercase">${p.category || 'Sin Cat.'}</span>
                            </div>
                            <div class="text-xs text-text-secondary font-mono">Cód: ${p.code || 'N/A'} | Stock: <span class="${outOfStock ? 'text-red-500' : 'text-gray-300'}">${p.stock}</span></div>
                        </div>
                        <div class="text-right font-black text-brand text-lg">$${parseFloat(p.price).toLocaleString('es-CO')}</div>
                    </button>
                `;
            }).join('');
        } catch (error) {
            container.innerHTML = '<div class="p-4 text-center text-sm text-red-500">Error al escanear.</div>';
        }
    }
};