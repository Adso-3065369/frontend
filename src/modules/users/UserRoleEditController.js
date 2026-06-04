import { createRepository } from '@/repositories';
import { RoleCheckboxes } from './components';
import { validateForm, displayFormErrors } from '@/utils/validator.js';

/**
 * @file UserRoleEditController.js
 * @description Orquesta la asignación de roles separando la inicialización de la interfaz,
 * la validación local y la sanitización de datos para la transacción.
 */

// ============================================================================
// 1. FASE DE INICIALIZACIÓN: Carga concurrente y renderizado del DOM
// ============================================================================
const initializeView = async (userId, userRepo, roleRepo) => {
    const rolesContainer = document.getElementById('roles-container');
    const userNameDisplay = document.getElementById('user-fullname');
    const userEmailDisplay = document.getElementById('user-email');
    const userInitialDisplay = document.getElementById('user-initial');

    try {
        // Ejecución concurrente para minimizar tiempos de carga
        const [userRes, rolesRes] = await Promise.all([
            userRepo.getById(userId),
            roleRepo.getAll()
        ]);

        // Extracción defensiva
        const user = userRes.data || userRes;
        const allRoles = rolesRes.data || rolesRes;

        if (!user) {
            alert("El usuario solicitado no existe o ha sido eliminado.");
            window.location.hash = '#/usuarios';
            return;
        }
                
        // Actualización reactiva de la tarjeta de información (Alineado con backend: user.name)
        const displayName = user.name || 'Usuario Desconocido';
        userNameDisplay.textContent = displayName;
        userEmailDisplay.textContent = user.email;
        userInitialDisplay.innerHTML = displayName.charAt(0).toUpperCase();

        document.getElementById('userId').value = user.id;

        // Extraemos los IDs del arreglo de objetos 'user.roles' que nos envía la API
        const selectedRoleIds = (user.roles || []).map(r => String(r.id));
        
        rolesContainer.innerHTML = RoleCheckboxes(allRoles, selectedRoleIds);
        
    } catch (error) {
        console.error("Fallo de red al inicializar la vista de asignación:", error);
        if (rolesContainer) {
            rolesContainer.innerHTML = `
                <div class="col-span-full bg-red-50 text-red-600 p-4 rounded-lg text-sm font-bold border border-red-200">
                    Ocurrió un error de conexión al cargar los datos. Verifique la red.
                </div>
            `;
        }
    }
};

// ============================================================================
// 2. FASE DE SERVIDOR: Sanitización y ejecución de la transacción
// ============================================================================
const submitToServer = async (userId, formData, userRepo, submitBtn) => {
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> <span>Guardando Asignación...</span>';
    submitBtn.disabled = true;

    try {
        // SANITIZACIÓN ESTRICTA PARA ZOD
        // mapeando los strings del FormData a números enteros.
        const updatedRolePayload = {
            roleIds: formData.getAll('roles').map(id => parseInt(id, 10))
        };

        // Ejecución de la petición HTTP PUT con el payload sanitizado
        await userRepo.update(`${userId}/roles`, updatedRolePayload);
        
        alert("Niveles de acceso actualizados correctamente.");
        window.location.hash = '#/usuarios';

    } catch (error) {
        console.error("Fallo transaccional al asignar roles:", error);
        
        // Extracción dinámica del error desde la capa de red o el backend
        const errorMessage = error.message || error.response?.data?.message || "No se pudo registrar la asignación en el servidor. Intente nuevamente.";
        alert(errorMessage);
        
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
    }
};

// ============================================================================
// 3. ORQUESTADOR PRINCIPAL: Eventos y Validaciones
// ============================================================================
export const UserRoleEditController = async (params) => {
    const userId = params.id;
    
    // Instanciación de repositorios
    const userRepo = createRepository('users');
    const roleRepo = createRepository('roles');

    const form = document.getElementById('form-edit-user-roles');
    if (!form) return;

    // Lanzamiento de la fase de inicialización
    await initializeView(userId, userRepo, roleRepo);

    // Procesamiento transaccional y validación centralizada
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // Diccionario de reglas de negocio
        const rules = {
            roles: {
                required: true,
                message: 'Operación denegada: El usuario debe poseer al menos un rol (nivel de acceso) en el sistema.'
            }
        };

        // Ejecución del motor centralizado
        const { isValid, errors } = validateForm(formData, rules);
        displayFormErrors(form, errors);

        // Control de flujo Fail-Fast
        if (!isValid) return;

        // Delegación de la petición a la fase de servidor
        const btnUpdate = document.getElementById('btn-update-roles');
        await submitToServer(userId, formData, userRepo, btnUpdate);
    });
};