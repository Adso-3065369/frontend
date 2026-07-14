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

/**
 * @description Envía los datos del formulario de registro al servidor.
 * En caso de error, el catch procesa el fallo en tres niveles de compatibilidad:
 * 
 * 1. **Escenario de Array (Formatos estándar de validación Zod):** Si el servidor retorna
 *    una lista estructurada de errores `[{ field: 'campo', message: 'motivo' }]`, se itera sobre 
 *    el array, se transforma en un mapa clave-valor `{ campo: 'motivo' }` y se llama a 
 *    `displayFormErrors` para pintar los mensajes de error directamente debajo de cada input.
 * 
 * 2. **Escenario de Objeto:** Si el backend responde con un objeto directo de errores `{ campo: 'motivo' }`,
 *    se delega la inyección visual a `displayFormErrors`.
 * 
 * 3. **Fallback Semántico (Mensaje plano):** Si solo retorna un texto o mensaje general, se realiza un mapeo 
 *    según un diccionario semántico de palabras clave (ej: si el mensaje menciona 'existe' o 'registrado', 
 *    se asume que es un error en el campo 'email') para pintar la advertencia inline en el campo correspondiente.
 * 
 * @param {FormData} formData - Datos extraídos del formulario.
 * @param {Object} authRepo - Repositorio para la comunicación con la API.
 * @param {HTMLButtonElement} submitBtn - Botón de envío para gestionar los estados visuales (carga/deshabilitado).
 * @param {HTMLFormElement} form - Instancia del formulario para inyectar errores dinámicamente.
 * @returns {Promise<void>}
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

        // Extracción del error estructurado del backend
        const serverMessage = error.response?.data?.message || error.message || "Fallo en el registro.";
        const serverErrors  = error.response?.data?.errors;

        // -----------------------------------------------------------------------
        // ESCENARIO 1: Backend envía el DTO estructurado como ARRAY
        // Ej: [{ field: "email", message: "Este correo ya se encuentra registrado." }]
        // -----------------------------------------------------------------------
        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
            const errorsAsObject = {};
            serverErrors.forEach(({ field, message }) => {
                if (field && message) errorsAsObject[field] = message;
            });
            displayFormErrors(form, errorsAsObject);
            return;
        }

        // -----------------------------------------------------------------------
        // ESCENARIO 2: Backend envía el DTO estructurado como OBJETO
        // Ej: { email: "Este correo ya se encuentra registrado." }
        // -----------------------------------------------------------------------
        if (serverErrors && typeof serverErrors === 'object' && !Array.isArray(serverErrors) && Object.keys(serverErrors).length > 0) {
            displayFormErrors(form, serverErrors);
            return;
        }

        // -----------------------------------------------------------------------
        // ESCENARIO 3: Fallback semántico — el backend solo envía un mensaje de texto
        // Se intenta asociar el mensaje al campo más probable del formulario
        // -----------------------------------------------------------------------
        const normalizedMessage = serverMessage.toLowerCase();
        const semanticDictionary = {
            email:    ['correo', 'email', 'usuario', 'registrado', 'existe', 'duplicado'],
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
            fullName: { required: true, minLength: 3, message: 'El nombre completo es requerido.' },
            email: { required: true, isEmail: true, message: 'Ingrese un correo electrónico válido.' },
            password: { required: true, minLength: 6, message: 'La contraseña debe tener al menos 6 caracteres.' },
            passwordConfirm: { required: true, minLength: 6, message: 'Confirme su contraseña por seguridad.' }
        };

        // Ejecutamos el validador de utils
        let { isValid, errors } = validateForm(formData, rules);

        // se guardan los errores del formulario si se daña o viene vacia esto lo borrar y crea una caja  nueva y limpia con el {} para que el sistema no se trabe ni se rompa 
        if (!errors || Array.isArray(errors)) { errors = {}; }

        // creamos una lista en blanco llamada error en el cual va a ir anotando en fila los problemas que se encuentre ala hora de validar un registro de usuario 
        // usando la orden .push() para ir agregando los errores que se vayan encontrando en el formulario de registro de usuario
        const error = [];

        // el namevalue agarra el nombre que escribio el usuario y le quita los espacios de mas.
        const nameValue = formData.get('fullName')?.trim() || '';
        // la expresion  solo_Letras permite que el nombre completo solo contenga letras y espacios, no se permiten numeros ni caracteres especiales.
        const solo_Letras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

        // hacemos una condicional si el usuario escribe algun numero o caracter especial se congela el envio del  isvalid = false y manda el error en el campo de fullName.
        if (nameValue !== '' && !solo_Letras.test(nameValue)) {
            isValid = false;
            error.push({
                field: 'fullName',
                message: 'El nombre completo solo debe contener letras no se permiten numeros ni caracteres especiales.'
            });
        }

        // =======================================================================
        //  RESTRICCIONES DE CORREO ELECTRÓNICO
        // =======================================================================
        const emailValue = formData.get('email')?.trim() || '';
        const regexEmailEstricto = /^[^0-9][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (emailValue !== '') {
            if (/^[0-9]/.test(emailValue)) {
                isValid = false;
                error.push({
                    field: 'email',
                    message: 'El correo electrónico no puede iniciar con números.'
                });
            } else if (!regexEmailEstricto.test(emailValue)) {
                isValid = false;
                error.push({
                    field: 'email',
                    message: 'Ingrese un formato de correo válido (ejemplo: usuario@dominio.com).'
                });
            }
        }
        // =======================================================================

        // Regla de Negocio Local: Coincidencia de Contraseñas
        const password = formData.get('password');
        const passwordConfirm = formData.get('passwordConfirm');

        if (password && passwordConfirm && password !== passwordConfirm) {
            isValid = false;
            error.push({
                field: 'passwordConfirm',
                message: 'La confirmacion de la contraseña no coincide.'
            });
        }

        error.forEach(error => {
            errors[error.field] = error.message;
        });

        displayFormErrors(form, errors);

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');

        await submitToServer(formData, authRepo, submitBtn, form);
    });
};