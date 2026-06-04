import { createRepository } from '@/repositories';
import { Checkbox } from '@/components/ui';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file RoleCreateHandler.js
 * @description Orquesta la creación de roles aplicando separación de responsabilidades
 * para la inicialización visual, validación local y ejecución transaccional.
 */

// ============================================================================
// 1. FASE DE INICIALIZACIÓN: Carga de catálogos y renderizado del DOM
// ============================================================================
const initializeView = async (permissionRepo, permissionsContainer) => {
    try {
        const response = await permissionRepo.getAll('?paginate=false');
        
        const payload = response.data || response;
        const permissions = Array.isArray(payload) ? payload : (payload.data || []);
        
        if (permissions.length === 0) {
            permissionsContainer.innerHTML = '<p class="text-text-secondary text-sm italic">No hay permisos disponibles en el sistema.</p>';
            return;
        }

        const checkboxesHtml = permissions.map(perm => Checkbox({
            id: `perm_${perm.id}`,
            name: 'permissions',
            value: perm.id,
            label: perm.name || perm.code,
            description: perm.description || `Código técnico: ${perm.code}`,
            variant: 'brand'
        })).join('');

        // Corrección de anidación: Sobrescribimos las clases de la vista para evitar conflictos
        // e inyectamos los elementos como hijos directos.
        permissionsContainer.className = "w-full grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 items-stretch";
        permissionsContainer.innerHTML = checkboxesHtml;
        
    } catch (error) {
        console.error("Fallo de red al obtener el catálogo de permisos:", error);
        permissionsContainer.innerHTML = `
            <div class="col-span-full bg-red-50 text-red-600 p-4 rounded-lg text-sm font-bold border border-red-200">
                Ocurrió un error de conexión al inicializar la matriz de accesos. Por favor, recargue la página.
            </div>
        `;
    }
};

// ============================================================================
// 2. FASE DE SERVIDOR: Sanitización y ejecución de la transacción
// ============================================================================
const submitToServer = async (formData, roleRepo, submitBtn) => {
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> <span>Guardando configuración...</span>';
    submitBtn.disabled = true;

    try {
        const newRolePayload = {
            name: formData.get('roleName').trim(),
            description: formData.get('description').trim(),
            permissionIds: formData.getAll('permissions').map(id => parseInt(id, 10))
        };

        await roleRepo.create(newRolePayload);
        
        alert(`El perfil "${newRolePayload.name}" ha sido registrado exitosamente en el sistema.`);
        window.location.hash = '#/roles';

    } catch (error) {
        console.error("Fallo transaccional al crear el rol:", error);
        
        const errorMessage = error.message || error.response?.data?.message || "No se pudo registrar el perfil en el servidor. Intente nuevamente.";
        alert(errorMessage);
        
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
    }
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL: Eventos y Validaciones
// ============================================================================
export const RoleCreateHandler = async () => {
    const roleRepo = createRepository('roles');
    const permissionRepo = createRepository('permissions');

    const form = document.getElementById('form-create-role');
    const permissionsContainer = document.getElementById('permissions-container');

    if (!form || !permissionsContainer) return;

    await initializeView(permissionRepo, permissionsContainer);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const rules = {
            roleName: { 
                required: true, 
                minLength: 3, 
                message: 'El nombre del rol es obligatorio y debe contener al menos 3 caracteres.' 
            },
            description: {
                required: true,
                message: 'La descripción del rol es obligatoria.'
            },
            permissions: {
                required: true,
                message: 'Operación denegada: Debe seleccionar al menos un permiso para crear el rol.'
            }
        };

        const { isValid, errors } = validateForm(formData, rules);
        displayFormErrors(form, errors);

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        await submitToServer(formData, roleRepo, submitBtn);
    });
};