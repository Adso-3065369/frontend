import { createRepository } from '@/repositories';
import { Checkbox } from '@/components/ui';
import { validateForm, displayFormErrors } from '@/utils';

/**
 * @file RoleEditHandler.js
 * @description Orquesta la edición de roles aplicando separación de responsabilidades
 * para la inicialización visual, validación local y ejecución transaccional.
 */

// ============================================================================
// 1. FASE DE INICIALIZACIÓN: Carga concurrente y renderizado del DOM
// ============================================================================
const initializeView = async (roleId, roleRepo, permissionRepo) => {
    const permissionsContainer = document.getElementById('permissions-container');
    if (!permissionsContainer) return;

    try {
        const [roleRes, permissionsRes] = await Promise.all([
            roleRepo.getById(roleId),
            permissionRepo.getAll('?paginate=false')
        ]);

        const role = roleRes.data || roleRes; 
        const permissionsPayload = permissionsRes.data || permissionsRes;
        const allPermissions = Array.isArray(permissionsPayload) ? permissionsPayload : (permissionsPayload.data || []);

        if (!role) {
            alert("El perfil especificado no existe o fue eliminado del sistema.");
            window.location.hash = '#/roles';
            return;
        }

        const assignedPermissionIds = (role.permissions || []).map(p => {
            return typeof p === 'object' ? String(p.id) : String(p);
        });

        document.getElementById('roleId').value = role.id;
        document.getElementById('roleName').value = role.name;
        document.getElementById('description').value = role.description;

        if (allPermissions.length === 0) {
            permissionsContainer.innerHTML = '<p class="text-text-secondary text-sm italic">No hay permisos disponibles en el sistema.</p>';
            return;
        }

        const checkboxesHtml = allPermissions.map(perm => Checkbox({
            id: `perm_${perm.id}`,
            name: 'permissions',
            value: perm.id,
            label: perm.name || perm.code,
            description: perm.description || `Código técnico: ${perm.code}`,
            checked: assignedPermissionIds.includes(String(perm.id)),
            variant: 'brand'
        })).join('');

        // Corrección de anidación: Sobrescribimos las clases de la vista para evitar conflictos
        // e inyectamos los elementos como hijos directos.
        permissionsContainer.className = "w-full grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 items-stretch";
        permissionsContainer.innerHTML = checkboxesHtml;
        
    } catch (error) {
        console.error("Error crítico al inicializar la vista de edición:", error);
        alert("No se pudo recuperar la configuración del rol. Verifique su conexión.");
        window.location.hash = '#/roles';
    }
};

// ============================================================================
// 2. FASE DE SERVIDOR: Sanitización y ejecución de la transacción
// ============================================================================
const submitToServer = async (roleId, formData, roleRepo, submitBtn) => {
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> <span>Actualizando...</span>';
    submitBtn.disabled = true;

    try {
        const updatedRoleData = {
            name: formData.get('roleName').trim(),
            description: formData.get('description').trim(),
            permissionIds: formData.getAll('permissions').map(id => parseInt(id, 10))
        };            

        await roleRepo.update(roleId, updatedRoleData);
        
        alert(`El rol ha sido actualizado exitosamente.`);
        window.location.hash = '#/roles';

    } catch (error) {
        console.error("Fallo durante la transacción de actualización:", error);
        
        const errorMessage = error.message || error.response?.data?.message || "Ocurrió un error transaccional. Intente nuevamente.";
        alert(errorMessage);
        
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
    }
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL: Eventos y Validaciones
// ============================================================================
export const RoleEditHandler = async (params) => {
    const roleId = params.id;
    const roleRepo = createRepository('roles');
    const permissionRepo = createRepository('permissions');

    const form = document.getElementById('form-edit-role');
    if (!form) return;

    await initializeView(roleId, roleRepo, permissionRepo);

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
                message: 'Operación denegada: Debe asignar al menos un permiso al perfil.'
            }
        };

        const { isValid, errors } = validateForm(formData, rules);
        displayFormErrors(form, errors);

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        await submitToServer(roleId, formData, roleRepo, submitBtn);
    });
};