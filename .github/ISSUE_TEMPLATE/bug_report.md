---
name: "Reporte de Bug"
about: Documenta un fallo en el sistema con evidencia técnica y pasos exactos.
title: "fix: [Descripción corta del error]"
labels: bug, triage
assignees: ''
---

> **ADVERTENCIA TÉCNICA:** Un bug sin pasos de reproducción exactos y evidencia visual será cerrado inmediatamente. No asumas la causa, describe el comportamiento real con datos. Borra los textos de ejemplo antes de enviar.

## 1. Contexto de Ejecución (Entorno)
* **Sistema Operativo:** *Ejemplo: Windows 11 / Ubuntu 22.04*
* **Navegador y Versión:** *Ejemplo: Chrome 120 / Firefox 115*
* **Resolución de Pantalla:** *Ejemplo: 1920x1080 (Desktop) / 390x844 (Mobile)*

## 2. Flujo de Reproducción (Anatomía del Fallo)
*Enumera los pasos exactos y milimétricos para detonar el error. Si el revisor no puede replicarlo en 2 minutos, el reporte es inválido.*

**Pasos:**
1. *Ejemplo: Iniciar sesión con el rol 'Cajero'.*
2. *Ejemplo: Navegar hacia la ruta `/inventario/crear`.*
3. *Ejemplo: Dejar el campo 'Precio' vacío y escribir 'ABC' en 'Cantidad'.*
4. *Ejemplo: Hacer clic en el botón 'Guardar Producto'.*

## 3. Contraste de Expectativas
**Comportamiento Actual (El Error):**
* *Ejemplo: El botón permite múltiples clics, la interfaz se congela y la consola arroja un error 500.*

**Comportamiento Esperado (El Contrato Lógico):**
* *Ejemplo: El formulario debería bloquear el botón, validar que 'Cantidad' sea un número, y mostrar un texto en rojo debajo del input indicando el error sin hacer la petición al servidor.*

## 4. Evidencia Técnica Estricta
*Adjunta la información cruda. Arrastra las imágenes directamente aquí.*

- [ ] **Captura de Pantalla o Video:** [Inserta aquí]
- [ ] **Log de Consola:** *Ejemplo: `Uncaught TypeError: Cannot read properties of undefined (reading 'map') at ProductList.vue:45`*
- [ ] **Fallo de Red (Opcional pero recomendado):** *Ejemplo: Petición a `/api/products` devolvió código `422 Unprocessable Entity`.*