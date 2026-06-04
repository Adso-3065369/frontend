# Especificación Técnica de Manejadores Lógicos (Handlers)

Este documento define el estándar arquitectónico innegociable para la creación de orquestadores de eventos y lógica de negocio (Handlers) en Vanilla JavaScript. Todo manejador debe actuar como un controlador puente entre la vista (DOM), las utilidades de validación y la capa de acceso a datos (Repositorios).

## 1. Patrón Arquitectónico
Un Handler no es una clase monolítica. Es un módulo compuesto por funciones de ámbito local (privadas) y una única función exportada (el Orquestador Principal). Su objetivo es aplicar el patrón *Fail-Fast*: interceptar errores en el cliente antes de tocar el servidor.

## 2. Documentación Estricta (JSDoc)
Es obligatorio documentar el módulo en la cabecera.
* **`@file`:** Nombre del archivo (ej. `EntityCreateHandler.js`).
* **`@description`:** Explicación de la responsabilidad del orquestador (inicialización, validación y comunicación API).

## 3. Estructura Interna Obligatoria (3 Fases)
Todo archivo Handler debe dividirse estrictamente en tres bloques lógicos y secuenciales:

### Fase 1: Inicialización Visual (`initializeView`)
Función asíncrona dedicada exclusivamente a preparar el DOM antes de la interacción del usuario.
* **Responsabilidad:** Cargar dependencias relacionales (ej. datos para `Selects`), renderizar componentes de interfaz iniciales y manejar errores de carga (estado *disabled* o variantes de error en la UI).
* **Restricción:** No debe contener lógica de envío de formularios ni escuchar eventos principales.

### Fase 2: Transacción de Red (`submitToServer` / `processTransaction`)
Función asíncrona aislada para manejar la comunicación con los repositorios.
* **Control de Estado UI:** Debe bloquear el botón de envío y cambiar su contenido por un indicador de carga (`<i class="ri-loader-4-line animate-spin"></i>`). Debe restaurar el estado original al finalizar (éxito o fallo).
* **Construcción del Payload:** Es obligatorio extraer y sanitizar los datos del `FormData` (usando `.trim()`, `.toUpperCase()`, `parseInt`, `parseFloat` según corresponda) antes de enviarlos al repositorio.
* **Gestión de Errores (Mapeo Semántico):** Debe capturar los errores del servidor. Si el backend devuelve un DTO de errores de validación, debe procesarlo. Si devuelve mensajes de texto plano, **es obligatorio implementar un diccionario semántico** que mapee palabras clave del error a los campos específicos del formulario para inyectar la advertencia visual directamente en el input afectado.

### Fase 3: Orquestador Principal (Función Exportada)
Función asíncrona principal que se exporta para ser consumida por el enrutador.
* **Responsabilidad:** Instanciar los repositorios necesarios (`createRepository`), capturar el formulario principal del DOM y ejecutar la Fase 1 (`initializeView`).
* **Delegación de Eventos:** Adjuntar el `addEventListener` ('submit') al formulario.
* **Validación Local:** Definir el objeto estricto de `rules` (reglas, expresiones regulares y mensajes personalizados) y pasarlo a la utilidad `validateForm`.
* **Cierre:** Inyectar los errores locales en el DOM mediante `displayFormErrors`. Si el formulario es válido, ceder el control a la Fase 2 pasándole el `FormData`, las referencias del DOM y los repositorios.

## 4. Protocolo de Generación Asistida por IA (Micro-Prompting)

Para garantizar que el código generado para nuevos Handlers cumpla con este estándar y minimizar el consumo de tokens, utiliza este protocolo de dos fases.

### Fase 1: Inicialización (Contexto Base)
Envía este comando al modelo una única vez al inicio del chat:

> Actúa como un desarrollador de software experto. Memoriza este contrato arquitectónico para crear "Handlers" (Vanilla JS). Responde únicamente: "Contrato de Handlers asimilado."
>
> REGLAS DE ARQUITECTURA:
> 1. Estructura de 3 Fases: `initializeView` (preparar DOM/Selects), `submitToServer` (Payload estricto, control de botón loading, Mapeo Semántico de errores) y Orquestador Principal exportado.
> 2. Uso estricto del patrón Fail-Fast con reglas de validación locales antes del fetch.
> 3. Destructuración de datos vía `FormData`. Sanitización estricta (tipado, trim) en el payload.
> 4. Captura de errores de servidor mapeando texto a inputs usando un `semanticDictionary`.
> 5. Dependencias inyectadas: `createRepository`, componentes UI, utilidades de validación (`validateForm`, `displayFormErrors`).
> 
> No generes código hasta recibir los requerimientos.

### Fase 2: Petición del Handler
Utiliza esta estructura minificada para pedir el código:

> Handler: [Nombre del Handler, ej: UserRegisterHandler]
> Entidad: [Nombre de la tabla/repositorio]
> Dependencias visuales (Fase 1): [Ej: Cargar roles en un select]
> Reglas de validación local (Fase 3):
> - [Campo 1]: [Reglas]
> - [Campo 2]: [Reglas]
> 
> Genera únicamente el código JS cumpliendo las 3 fases del contrato.