import { createRepository } from '@/repositories';
import { validateForm, displayFormErrors } from '@/utils';
import { AuthService } from '@/services/AuthService.js'; 

/**
 * @file LoginHandler.js
 * @description Orquestador estricto para la autenticación de usuarios.
 * Implementa el mapeo de errores semántico para inyectar fallas de red/credenciales directamente en el DOM.
 */

const submitToServer = async (formData, authRepo, submitBtn, form) => {
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Autenticando...</span>';
    submitBtn.disabled = true;

    try {
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();

        // 1. Petición POST al backend
        const response = await authRepo.create({ email, password });            

        // 2. Desestructuración del payload exitoso
        // Soporta tanto la respuesta cruda de Axios como el formato empaquetado
        const payload = response.data || response;
        const { user, accessToken, refreshToken } = payload;

        // 3. Extracción y aplanamiento de permisos
        const rawPermissions = user.roles.reduce((acc, role) => {
            return acc.concat(role.permissions || []);
        }, []);
        
        const uniquePermissions = [...new Set(rawPermissions)];

        // 4. Construcción del Payload de Sesión
        const sessionData = {
            id: user.id,
            fullName: user.name, 
            email: user.email,
            roles: user.roles.map(r => r.name), 
            permissions: uniquePermissions
        };
        
        // 5. Delegar la persistencia y redireccionar
        AuthService.login(sessionData, accessToken, refreshToken);
        window.location.hash = '#/dashboard';

    } catch (error) {
        console.error("[LoginHandler] Fallo transaccional detectado:", error);
        
        // Reversión visual obligatoria del estado del botón
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Extracción y normalización del mensaje de error
        const serverMessage = error.response?.data?.message || error.message || "Credenciales inválidas.";
        const normalizedMessage = serverMessage.toLowerCase();
        const serverErrors = error.response?.data?.errors;

        // ESCENARIO IDEAL: DTO Estructurado Estricto
        if (serverErrors && typeof serverErrors === 'object' && !Array.isArray(serverErrors) && Object.keys(serverErrors).length > 0) {
            displayFormErrors(form, serverErrors);
            return; 
        }

        // ESCENARIO DE CONTINGENCIA: Mapeo Semántico Dinámico
        // Si el backend responde "Credenciales inválidas", se marcarán ambos campos
        const semanticDictionary = {
            email: ['correo', 'email', 'usuario', 'mail', 'credenciales', 'invalida', 'inválida'],
            password: ['contraseña', 'password', 'clave', 'credenciales', 'invalida', 'inválida']
        };

        const dynamicErrors = {};

        // Búsqueda pura de coincidencias
        Object.entries(semanticDictionary).forEach(([fieldName, keywords]) => {
            if (keywords.some(keyword => normalizedMessage.includes(keyword))) {
                dynamicErrors[fieldName] = serverMessage;
            }
        });

        // Inyección en la interfaz
        if (Object.keys(dynamicErrors).length > 0) {
            displayFormErrors(form, dynamicErrors);
        } else {
            // Fallback genérico para errores críticos no mapeados (ej. Error 500)
            alert(`Fallo sistémico del servidor:\n${serverMessage}`);
        }
    }
};

export const LoginHandler = async () => {
    const form = document.getElementById('form-login');
    const authRepo = createRepository('auth/login');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const rules = {
            email: {
                required: true,
                isEmail: true,
                message: 'Por favor, ingrese un correo electrónico válido.'
            },
            password: {
                required: true,
                minLength: 6,
                message: 'La contraseña debe tener al menos 6 caracteres.'
            }
        };

        const { isValid, errors } = validateForm(formData, rules);
        displayFormErrors(form, errors);

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        
        await submitToServer(formData, authRepo, submitBtn, form);
    });
};