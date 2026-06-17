# Guía de Colaboración Interna

¡Gracias por formar parte de este equipo! Para mantener la estabilidad del código en producción y asegurar un entorno de desarrollo de nivel industrial, transparente y altamente organizado, trabajamos bajo un **modelo centralizado de ramas** basado en la estrategia **GitFlow**.

Seguimos una política estricta de **cero tareas ni Pull Requests (PR) sueltos**.

---

## 1. Configuración del Entorno (Repositorio Centralizado)

Como colaborador oficial, tienes acceso directo de escritura al repositorio de la organización. Trabajaremos sobre un único origen (`origin`).

### ¿Cómo iniciar?
1. **Clonar el repositorio:** Descarga el proyecto directamente a tu entorno local.
   ```bash
   git clone  https://github.com/Adso-3065369/frontend.git
    ```
2. **Navegar al proyecto:**
    ```bash
    cd frontend
    ```
## 2. Sincronización y Gestión de Conflictos

Antes de iniciar cualquier desarrollo o abrir una nueva rama, es obligatorio alinear tu base local con la rama principal de integración (`develop`):

    
    git checkout develop
    git pull origin develop
    
Gestión de Conflictos: Si surgen conflictos al descargar cambios o al intentar integrar tu código, detente inmediatamente. Resuelve las marcas (`<<<<, ====, >>>>`) en tu editor de código, guarda, ejecuta git add . y realiza el commit. Está estrictamente prohibido programar sobre una base de código local desactualizada o con conflictos pendientes.

## 3. Estrategia de Ramas (GitFlow)

Cada línea de código debe tener un propósito claro. No se trabaja directamente sobre `develop` ni `main`. Las ramas se derivan y reintegran siguiendo esta matriz de control:

| Tipo de Rama | Origen | Destino | Propósito |
| :--- | :--- | :--- | :--- |
| **`feature/`** | `develop` | `develop` | Nuevas funcionalidades del software. |
| **`docs/`** | `develop` | `develop` | Ajustes exclusivamente documentales o de guías. |
| **`refactor/`** | `develop` | `develop` | Optimización de código sin alterar el comportamiento lógico. |
| **`bugfix/`** | `develop` | `develop` | Corrección de errores encontrados en la etapa de pruebas. |
| **`hotfix/`** | `main` | `main` y `develop` | Solución inmediata a fallos críticos directamente en producción. |

## 4. Estándares de Mensajes (Conventional Commits)

Los mensajes de confirmación deben ser descriptivos y seguir un formato estandarizado universalmente: `tipo: descripción`.
* *Ejemplo correcto:* `feat: implementar middleware de validación de roles`
* *Ejemplo incorrecto:* `cambios en el login`

---

## 5. El Flujo de Trabajo Cerrado (Issues, Milestones y PRs)

Para evitar el desorden administrativo, implementamos un flujo completamente trazable. **No se concibe la existencia de una tarea sin planificación ni de un cambio en el código sin un requerimiento previo.**

### A. Tipificación y Estructura Estricta de Tareas (Issues)
No se permiten tareas creadas por rellenar campos o con información vaga. Cada Issue en nuestro tablero debe cumplir obligatoriamente con los siguientes pilares: contar con un responsable único asignado desde el primer momento y pertenecer a un hito (*Milestone*) para definir su ventana de entrega. Además, su contenido debe acatar nuestra tipificación formal:

**1. Nuevas Funcionalidades (Features / Mejoras):**
Las funcionalidades no se programan por intuición; toda nueva característica debe tener un valor de negocio justificable. El Issue debe basarse obligatoriamente en nuestra plantilla de desarrollo, la cual exige:
* **Justificación y Valor de Negocio:** Explicación clara de qué problema resuelve o qué proceso optimiza dentro del sistema.
* **Historia de Usuario (Agile):** Definición estructurada del requerimiento (*Como [rol], quiero [funcionalidad], para que [objetivo]*).
* **Propuesta de Arquitectura:** Planificación técnica de la implementación tanto en Frontend como en Backend (si aplica), respetando la separación de responsabilidades.
* **Definition of Done (Criterios de Aceptación):** Una lista de verificación exacta y medible. *El Pull Request asociado no será aprobado a menos que cumpla estrictamente con cada criterio listado en el Issue.*

**2. Reportes de Errores (Bugs):**
Todo fallo en el sistema debe documentarse como una prueba de caja negra formal para asegurar los estándares de calidad del proyecto. Si la tarea implica solucionar un error, el Issue debe basarse obligatoriamente en nuestra plantilla de reporte, la cual exige:
* **Contexto del Entorno:** Sistema operativo, navegador, resolución de pantalla y versiones exactas.
* **Flujo de Reproducción:** Pasos milimétricos para detonar el fallo. *Si un Líder del Equipo no puede replicar el error en 2 minutos siguiendo las instrucciones, el Issue será cerrado inmediatamente como inválido.*
* **Contraste de Expectativas:** Explicación precisa del comportamiento actual (el error) frente al contrato lógico esperado.
* **Evidencia Técnica Estricta:** Capturas, logs de consola crudos o respuestas de red (ej. HTTP 422, 500). Sin evidencia visual o de terminal, no hay soporte.

### B. Arquitectura Obligatoria de un PR Profesional
Queda **estrictamente prohibido** abrir un Pull Request suelto o empujar código directamente a `develop`. Al crear un PR en GitHub, se deben auditar los siguientes campos:

* **Vínculo Explícito al Issue:** La descripción del PR debe incluir obligatoriamente la palabra clave que enlace y cierre automáticamente la tarea (ej. `Closes #12` o `Resolves #45`). Si un PR no cierra un Issue documentado, será rechazado automáticamente por el sistema.
* **Título:** Breve, en minúsculas y alineado al estándar de commits (ej. `fix: corregir redirección en el flujo de autenticación`).
* **Cuerpo Técnico:**
    * **¿Qué hace este cambio?:** Resumen preciso del código inyectado o del fallo corregido.
    * **Pruebas realizadas:** Evidencia documentada de las pruebas técnicas realizadas para garantizar el correcto funcionamiento o la mitigación del bug.

### C. Ciclo de Vida y Validación Jerárquica
1. **Abierto (Open):** El PR entra en cola de revisión. El código queda congelado para el colaborador.
2. **Auditoría Técnica:** Un **Líder del Equipo** evaluará el código, verificará el cumplimiento de los estándares y comprobará la trazabilidad con el *Issue* y el *Milestone*.
3. **Feedback y Cambios Solicitados:** Si el Líder del Equipo solicita correcciones, el colaborador deberá resolverlas en su misma rama local y hacer un nuevo *push*. El PR se actualizará solo.
4. **Fusión (Merged):** **Únicamente los Líderes del Equipo tienen el permiso de ejecutar la fusión (Merge) final y cerrar formalmente el ciclo de la tarea.** El colaborador tiene prohibido manipular el estado final del PR o de la tarea de forma manual.

---

## 6. Proceso Paso a Paso para el Colaborador

1. **Selección del Requerimiento:** Dirígete al tablero del proyecto, toma una tarea (Issue) asignada a tu nombre y verifica a qué *Milestone* pertenece.
2. **Sincronización:** Asegura que la rama `develop` local esté actualizada (`git pull origin develop`).
3. **Creación de Rama:** Desde `develop`, ejecuta `git checkout -b tipo/nombre-tarea`.
4. **Desarrollo:** Escribe código limpio, modular y documentado con JSDoc. Realiza commits lógicos y atómicos.
5. **Subida de Cambios:** Ejecuta `git push origin tipo/nombre-tarea` hacia el repositorio central.
6. **Apertura de PR:** Abre la solicitud de extracción en GitHub seleccionando la rama `develop` como destino e inyectando la vinculación `Closes #ID` en la descripción.
7. **Validación:** Atiende las observaciones del Líder del Equipo hasta obtener la aprobación formal y la posterior fusión.

---

## 7. Estándares de Calidad del Código
* **Documentación (JSDoc):** Obligatorio para definir la arquitectura de cada función, parámetro y módulo desarrollado.
* **Seguridad Absoluta:** Prohibido incluir archivos de entorno `.env`, llaves privadas, contraseñas o tokens en los commits.
* **Limpieza de Código:** El código final debe estar libre de herramientas de depuración local (cero `console.log` o comentarios de pruebas remanentes).

---
> "En esta fábrica de software, la trazabilidad es nuestra mayor garantía de calidad. Cada Pull Request es la respuesta directa a una tarea planificada, asignada y estructurada bajo la supervisión de nuestros líderes."