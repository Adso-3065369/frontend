# Sistema de Inventario ADSO | Enterprise Core Frontend
### "Simulación de Ciclo de Vida de Software Corporativo (SDLC)"

---

## Visión del Proyecto
Bienvenido al entorno de desarrollo profesional. Este no es un repositorio académico; es una **simulación de entorno productivo**. Aquí, el código no solo debe "funcionar", debe ser **escalable, auditable y resiliente**. 

Hemos estructurado este sistema para replicar las exigencias de la industria de software de clase mundial: **Consistencia de Interfaces, Seguridad bajo principios Zero-Trust y Arquitectura de Frontend Desacoplada.**

## Metodología de Trabajo (Ecosistema Profesional)
Tu rol en este proyecto no es el de un estudiante, sino el de un **Frontend Developer** en un equipo de desarrollo ágil. Bajo esta premisa, el cumplimiento de los estándares no es opcional:

* **Arquitectura de Capas (N-Tier):** Implementamos una separación estricta de responsabilidades. Si la vista (`view`) conoce los detalles de la infraestructura de red o la lógica de negocio pesada, el código será rechazado.
* **Gatekeeping y Quality Assurance:** El código pasa por un proceso de revisión técnico. Las pruebas de integración en el Frontend no son una sugerencia, son el requisito de aceptación para cualquier *Pull Request*.
* **Gestión Basada en RFCs:** No se implementa funcionalidad sin una Solicitud de Cambio (RFC) documentada y aprobada. Aquí trabajamos bajo **"Diseño antes de Código"**.
* **Seguridad por Diseño:** Implementamos la protección de rutas y la gestión de sesiones en el lado del cliente (middleware), asegurando que la experiencia de usuario sea consistente y segura.

## El Estándar Industrial
Al finalizar este proyecto, no habrás construido "una aplicación"; habrás interiorizado un flujo de trabajo que define tu perfil profesional:

> *"El código profesional es aquel que puede ser mantenido, probado y auditado por alguien que no seas tú. Si no puedes explicar por qué tu vista está desacoplada de tu capa de servicios y repositorios, tu arquitectura aún no está lista para producción."*

---

## Compromisos de Desarrollo
- A. **Disciplina:** Seguimiento estricto del estándar de *Conventional Commits*.
- B. **Rigor:** Calidad sobre cantidad. Un `test` fallido bloquea el despliegue.
- C. **Profesionalismo:** Documentación técnica precisa, Bitácoras de inspección completas y transparencia en el control de versiones.

---

### ¿Estás listo para el despliegue?
En una empresa real, si subes un código que rompe el *build* de producción, hay una interrupción de negocio que afecta a la organización. Aquí, tratamos el código con el mismo nivel de respeto y seriedad.

**Instructor:** John Becerra | **Programa:** ADSO - SENA

## 1 Instalación y Puesta en Marcha

Para iniciar el entorno de desarrollo, sigue estrictamente los pasos de configuración definidos en el ecosistema. Este procedimiento asegura que el entorno local sea una réplica exacta de los requerimientos de producción.

### Requisitos Previos
* **Node.js:** Versión LTS recomendada (v20+).
* **Gestor de Paquetes:** npm (incluido con Node.js).
* **Acceso a la API:** Asegúrate de tener el Backend en ejecución en el puerto configurado en el archivo `.env`.

### Configuración del Entorno
1. **Clonar el Repositorio:**
   `git clone <url-del-repositorio>`
   `cd frontend`

2. **Instalación de Dependencias:**
   `npm install`

3. **Configuración de Variables:**
   Copia el archivo de ejemplo para crear tus variables locales de entorno:
   `cp .env.example .env`
   *(Edita el archivo `.env` con las URLs de tu API local).*

### Ejecución del Proyecto
* **Modo Desarrollo:** Inicia el servidor de Vite para desarrollo activo:
  `npm run dev`

* **Construcción para Producción:** Genera el bundle optimizado en la carpeta `dist/`:
  `npm run build`

* **Validación de Integridad:** Ejecuta el conjunto de pruebas para asegurar que el sistema es estable antes de cualquier integración:
  `npm test`

---

> **NOTA:** Si el servidor de desarrollo no logra conectar con la API, verifica que tus variables de entorno en el archivo `.env` coincidan con el dominio y puerto de tu `Backend` en ejecución. Cualquier cambio en las configuraciones de red requiere un reinicio del proceso del servidor de desarrollo.

## 2. Anatomía del Proyecto (Estructura)

Hemos organizado el código siguiendo el patrón de **Separación de Responsabilidades** para que sea escalable y fácil de mantener. En un entorno profesional, cada directorio tiene una función definida y aislada:

```text
├── .github/            # Flujos de trabajo (CI/CD para despliegue automatizado)
├── dist/               # Artefactos finales (Código transpilado listo para producción)
├── docs/               # Manuales de usuario, guías de estilo y bitácoras de cambios
├── node_modules/       # Dependencias del ecosistema (Ignoradas en control de versiones)
├── public/             # Assets estáticos (Favicons, imágenes, manifiestos)
├── src/
│   ├── api/            # La Terminal de Carga (Configuración de Axios e interceptores)
│   ├── components/     # Piezas de Ensamblaje (UI components atómicos y reutilizables)
│   ├── layouts/        # Planos Estructurales (Plantillas maestras de navegación)
│   ├── middlewares/    # Inspectores de Frontera (Protección de rutas y autenticación)
│   ├── modules/        # Departamentos Autónomos (Lógica y vistas encapsuladas por dominio)
│   ├── repositories/   # Almacenes de Datos (Abstracción de consumo de API)
│   ├── router/         # Panel de Control (Configuración del enrutamiento de la SPA)
│   ├── services/       # Los Especialistas (Lógica de negocio y transformación de datos)
│   ├── utils/          # Caja de Herramientas (Funciones globales y constantes)
│   ├── views/          # El Escenario (Páginas finales que integran la UI)
│   ├── main.js         # El Punto de Inyección (Inicialización de la aplicación)
│   └── style.css       # Estilos globales y reset del sistema
├── .env                # Secretos y endpoints de conexión local
├── .env.example        # Plantilla pública de variables de entorno requeridas
├── .gitignore          # Reglas de exclusión de archivos (node_modules, .env)
├── CONTRIBUTING.md     # Estándares de commits y normativa de Pull Requests
├── index.html          # El Documento Base (Punto de entrada HTML5)
├── jsconfig.json       # Configuración del entorno de desarrollo (Paths y alias)
├── LICENSE             # Licencia legal del código fuente
├── package.json        # Manifiesto de dependencias y scripts de construcción (Vite)
├── package-lock.json   # Árbol exacto de versiones de dependencias
├── README.md           # Documentación principal del Frontend
├── TEAM_AGREEMENT.md   # Acuerdos y normativas disciplinarias para el equipo
└── vite.config.js      # El Motor de Construcción (Configuración de Vite)
```

> **Regla de Oro:** La lógica de negocio no debe residir en las vistas (`src/views`). Las vistas solo deben orquestar la UI y delegar el procesamiento a los `services` y la obtención de datos a los `repositories`.

## 3. Anatomía del Frontend (Arquitectura por Capas)

En este ecosistema, el Frontend no es solo "vistas y botones". Hemos estructurado el proyecto como una aplicación empresarial donde cada carpeta cumple una misión crítica:

| Carpeta | Analogía | Responsabilidad Técnica |
| :--- | :--- | :--- |
| **`src/api/`** | **La Terminal de Carga** | Centraliza todas las peticiones HTTP hacia el Backend. Define los clientes de Axios y los interceptores de seguridad. |
| **`src/components/`** | **Las Piezas de Ensamblaje** | Componentes atómicos e independientes (botones, inputs, tablas) reutilizables en toda la interfaz. |
| **`src/layouts/`** | **Los Planos Estructurales** | Define las plantillas maestras (ej. Sidebar + Navbar + Content) para mantener consistencia visual. |
| **`src/middlewares/`** | **Los Inspectores de Frontera** | Controla el acceso a rutas protegidas antes de que el usuario vea un componente (ej. validación de sesión). |
| **`src/modules/`** | **Los Departamentos Autónomos** | Agrupa funcionalidades completas (ej. `auth`, `products`, `sales`) encapsulando vistas y lógica de cada sección. |
| **`src/repositories/`** | **Los Almacenes de Datos** | Abstrae la comunicación con la API. Los servicios no llaman a la API directamente, sino que solicitan datos al repositorio. |
| **`src/router/`** | **El Panel de Control** | Define la navegación y el árbol de rutas del sistema, conectando URLs con sus respectivos layouts y módulos. |
| **`src/services/`** | **Los Especialistas** | Ejecutan la lógica de negocio y transformación de datos necesaria antes de enviarlos a la vista o recibirlos del repositorio. |
| **`src/utils/`** | **La Caja de Herramientas** | Funciones de apoyo, formateadores de fechas, validadores de strings y constantes globales. |
| **`src/views/`** | **El Escenario** | La capa final de presentación donde se ensamblan los componentes, layouts y servicios para la experiencia del usuario. |

---

> *"Un Frontend profesional no se construye a base de archivos gigantes, sino mediante una orquestación precisa de capas independientes. Si tu vista (`view`) está ejecutando lógica de conexión a la API directamente, estás rompiendo la arquitectura."*

## 3. El Ciclo de Vida de una Acción (El Pipeline del Frontend)

Para entender cómo fluyen los datos y eventos en nuestro sistema, analiza el proceso desde el inicio de la interacción hasta la sincronización de los datos. Este es el conducto estricto que debe seguir cualquier operación:

* **El Disparador (Interacción/Ciclo de Vida):** El flujo inicia mediante una acción del usuario (clic en un botón, envío de un formulario) o una recarga del navegador (F5, inicialización del componente).
* **Manejador de la Vista (`views/`):** La vista captura el evento. En esta etapa, el manejador se encarga del comportamiento de la interfaz, pudiendo invocar utilidades (`utils/`) para validaciones preliminares o manipulación del DOM antes de solicitar datos.
* **Delegación de Responsabilidad (`services/`):** La vista transfiere el control al servicio. El servicio estructura el *payload*, aplica las reglas de negocio del cliente y decide qué datos se deben consultar o mutar.
* **Puente de Datos (`repositories/`):** El servicio no hace peticiones HTTP directamente, sino que delega la operación al repositorio. Este actúa como el contrato de datos exclusivo para el dominio específico (ej. `RoleRepository`).
* **Consumo de la API (`api/`):** El repositorio se comunica con la clase o instancia base de la API (Axios). Esta capa es la única que ejecuta la solicitud HTTP, inyectando los tokens de seguridad e interceptando respuestas a nivel de red.
* **Retorno y Sincronización:** La API retorna la respuesta (datos requeridos o confirmación de la acción). El flujo se invierte: el repositorio recibe el JSON, lo entrega al servicio y este actualiza el estado, permitiendo que la vista refleje los cambios en pantalla.

> **CONTROL DE INTEGRIDAD:** Toda excepción en la red o error en la respuesta debe ser capturada y normalizada por el interceptor de la API. La vista no debe procesar errores puros (como un error 500 o fallas de conexión), sino reaccionar a mensajes estandarizados provistos por las capas inferiores para mantener la interfaz consistente.