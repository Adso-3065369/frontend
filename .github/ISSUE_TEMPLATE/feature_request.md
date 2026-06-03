---
name: "Nueva Funcionalidad (Feature)"
about: Propón una idea, mejora o módulo utilizando un formato de diseño estructurado.
title: "feat: [Nombre del módulo o funcionalidad]"
labels: enhancement, rfc
assignees: ''
---

> **ADVERTENCIA TÉCNICA:** Las funcionalidades no se programan por intuición. Toda nueva característica debe tener un valor de negocio claro y criterios de aceptación definibles. Borra los textos de ejemplo antes de enviar.

## 1. Justificación y Valor de Negocio
*¿Por qué necesitamos esto? ¿Qué problema resuelve o qué proceso optimiza?*
**Justificación:** * *Ejemplo: Actualmente, los usuarios administradores no tienen forma de saber qué cajero eliminó un producto del sistema. Necesitamos una bitácora de auditoría para garantizar la trazabilidad y seguridad del inventario.*

## 2. Historia de Usuario (Agile)
*Define quién lo necesita, qué necesita y para qué lo necesita.*
- **Como** *[rol del usuario, ej: Administrador del Sistema]*
- **quiero** *[la funcionalidad exacta, ej: una tabla de historial de eliminaciones]*
- **para que** *[el objetivo final, ej: pueda identificar quién y cuándo se borró un registro crítico].*

## 3. Propuesta de Implementación Técnica (Arquitectura)
*¿Cómo planeas construirlo respetando la separación de responsabilidades?*
**Frontend:**
1. *Ejemplo: Crear un nuevo módulo en `src/modules/audit/` con su propia vista.*
2. *Ejemplo: Consumir el endpoint mediante un nuevo servicio `AuditService`.*

**Backend (Si aplica):**
1. *Ejemplo: Crear un middleware que intercepte peticiones `DELETE` y guarde el `user_id` en una tabla `audit_logs`.*

## 4. Definition of Done (Criterios de Aceptación)
*El Pull Request no será aprobado a menos que cumpla estrictamente con esta lista de verificación.*

- [ ] *Ejemplo: La vista de auditoría solo es accesible para usuarios con el rol `ADMIN`.*
- [ ] *Ejemplo: La tabla muestra Fecha, Usuario, Acción y Registro Afectado.*
- [ ] *Ejemplo: La tabla incluye paginación en el servidor (máximo 20 registros por página).*
- [ ] *Ejemplo: Si la API falla al cargar el historial, la UI muestra un componente de error controlado y no colapsa.*