import { createRepository } from '@/repositories'; 
import { validateForm, displayFormErrors } from '@/utils';
import { AuthService } from '@/services';
import { Navbar } from '@/components/layout/navbar/Navbar.js';
import { NavbarController } from '@/components/layout/navbar/NavbarController.js';

/**
 * @file RegisterHandler.js
 * @version 1.1.0
 * @description Orquestador estricto para el autoregistro. 
 * Implementa el mapeo de errores semántico y delega la validación de unicidad al backend.
 */

const submitToServer = async (formData, authRepo, submitBtn, form) => {
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="animate-pulse"><i class="ri-loader-4-line animate-spin"></i> Creando cuenta...</span>';
    submitBtn.disabled = true;

    try {
        // 1. Preparación del Payload alineado al contrato del backend (name, email, password)
        const newUserPayload = {
            name: formData.get('fullName').trim(),
            email: formData.get('email').trim().toLowerCase(),
            password: formData.get('password')
        };

        // 2. Ejecución de la petición POST (Delegamos la validación de duplicados al backend)
        const response = await authRepo.create(newUserPayload);

        // Soporte para respuestas directas o empaquetadas
        const payload = response.data || response;

        // 3. Auto-Autenticación
        // Asumiendo que el backend de registro devuelve la estructura del usuario y los tokens
        // Si su API requiere un login explícito después del registro, deberá encadenar esa llamada aquí.
        if (payload.accessToken) {
            const { user, accessToken, refreshToken } = payload;
            
            const rawPermissions = (user.roles || []).reduce((acc, role) => acc.concat(role.permissions || []), []);
            
            const sessionData = {
                id: user.id,
                fullName: user.name,
                email: user.email,
                roles: (user.roles || []).map(r => r.name),
                permissions: [...new Set(rawPermissions)]
            };
            
            AuthService.login(sessionData, accessToken, refreshToken);
        }

        // 4. Actualización del Estado Visual de la SPA
        const navbarContainer = document.getElementById('navbar');
        if (navbarContainer) {
            navbarContainer.innerHTML = Navbar();
            NavbarController(); 
        }

        alert(`¡Registro exitoso! Bienvenido(a) al sistema.`);
        window.location.hash = '#/dashboard';

    } catch (error) {
        console.error("[RegisterHandler] Fallo transaccional detectado:", error);
        
        // Reversión visual obligatoria
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Extracción y normalización del error
        const serverMessage = error.response?.data?.message || error.message || "Fallo en el registro.";
        const normalizedMessage = serverMessage.toLowerCase();
        const serverErrors = error.response?.data?.errors;

        // ESCENARIO IDEAL: DTO Estructurado Estricto
        if (serverErrors && typeof serverErrors === 'object' && !Array.isArray(serverErrors) && Object.keys(serverErrors).length > 0) {
            displayFormErrors(form, serverErrors);
            return; 
        }

        // ESCENARIO DE CONTINGENCIA: Mapeo Semántico Dinámico
        const semanticDictionary = {
            email: ['correo', 'email', 'usuario', 'registrado', 'existe', 'duplicado'],
            password: ['contraseña', 'password', 'clave', 'seguridad', 'corta'],
            fullName: ['nombre', 'name']
        };

        const dynamicErrors = {};

        Object.entries(semanticDictionary).forEach(([fieldName, keywords]) => {
            if (keywords.some(keyword => normalizedMessage.includes(keyword))) {
                dynamicErrors[fieldName] = serverMessage;
            }
        });

        if (Object.keys(dynamicErrors).length > 0) {
            displayFormErrors(form, dynamicErrors);
        } else {
            alert(`Fallo del servidor:\n${serverMessage}`);
        }
    }
};

export const RegisterHandler = async () => {
    const form = document.getElementById('form-register');
    
    // 🚀 CORRECCIÓN: Apuntamos al endpoint de autenticación, no al CRUD genérico de usuarios
    // Ajuste la ruta 'auth/register' según la definición exacta de su enrutador Node.js
    const authRepo = createRepository('auth/register');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const rules = {
            fullName: { required: true, minLength: 3, message: 'El nombre completo debe tener al menos 3 caracteres.' },
            email: { required: true, isEmail: true, message: 'Ingrese un correo electrónico válido (ej: usuario@dominio.com).' },
            password: {
                required: true,
                minLength: 8,
                isStrongPassword: true,
                minLengthMessage: 'La contraseña debe tener al menos 8 caracteres.',
                strongMessage: 'La contraseña debe contener al menos una mayúscula (A-Z), una minúscula (a-z) y un número (0-9).'
            },
            passwordConfirm: { required: true, minLength: 8, message: 'Confirme su contraseña.' }
        };

        let { isValid, errors } = validateForm(formData, rules);

        // Regla de Negocio Local: Coincidencia de Contraseñas
        const password = formData.get('password');
        const passwordConfirm = formData.get('passwordConfirm');

        if (password && passwordConfirm && password !== passwordConfirm) {
            isValid = false;
            errors.passwordConfirm = 'Las contraseñas ingresadas no coinciden.';
        }

        displayFormErrors(form, errors);

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        
        await submitToServer(formData, authRepo, submitBtn, form);
    });
};