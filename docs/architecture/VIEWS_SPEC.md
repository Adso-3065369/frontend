# Especificación Técnica de Vistas (Create / Edit)

Este documento define el estándar arquitectónico innegociable para la creación de Vistas de interfaz de usuario en Vanilla JavaScript. Las Vistas son módulos de renderizado puramente declarativos que estructuran la página antes de que el Handler (Orquestador) inyecte la lógica y los datos dinámicos.

## 1. Patrón Arquitectónico
Toda vista debe ser exportada como una función asíncrona pura (`async () => {}`) que retorne un `string` de HTML válido utilizando template literals. La vista actúa como un esqueleto estático. 

**Restricción Crítica:** Está estrictamente prohibido incluir lógica de negocio, peticiones `fetch`, instanciación de repositorios o adjuntar event listeners (`addEventListener`) dentro de una Vista.

## 2. Documentación Estricta (JSDoc)
Es obligatorio anteceder la declaración de la función con un bloque JSDoc.
* **`@file`:** Nombre del archivo (ej. `EntityCreateView.js`).
* **`@description`:** Explicación técnica de la interfaz (ej. "Interfaz de creación de entidades adaptada al sistema de diseño base").

## 3. Estructura Interna Obligatoria (Layout)
El cuerpo del template literal devuelto debe estructurarse estrictamente bajo esta jerarquía:

1. **Contenedor Principal y Cabecera:**
   * Un `div` envolvente con control de ancho máximo (`max-w-3xl`, `mx-auto`, `p-6`).
   * Títulos `h1` descriptivos y párrafos secundarios para guiar al usuario, utilizando las variables semánticas de texto (`text-text-secondary`).

2. **Formulario Estructural (`<form>`):**
   * Es obligatorio el uso del atributo `novalidate` para anular la validación nativa del navegador y delegarla al Handler.
   * Debe tener un `id` único y estandarizado (ej. `form-create-[entity]` o `form-edit-[entity]`).
   * Debe utilizar las clases de contenedor del sistema (ej. `app-card`).

3. **Grid de Campos (Sistema de Rejilla):**
   * Los componentes de entrada (`Input`, `Select`) deben organizarse dentro de un contenedor grid (ej. `grid grid-cols-1 md:grid-cols-2`).
   * Cada componente inyectado debe estar envuelto en un `div` que controle su expansión en columnas (`md:col-span-1` o `md:col-span-2`).

4. **Contenedores de Inyección Dinámica (Placeholders):**
   * Para dependencias relacionales que requieren datos del servidor (como un `Select` de categorías o roles), la vista **no** debe intentar cargar las opciones. 
   * En su lugar, debe renderizar el componente con un estado inicial (ej. `options: []`, `placeholder: 'Cargando...'`) y envolverlo en un `div` con un `id` estricto (ej. `id="category-select-container"`). El Handler reemplazará el contenido de este contenedor en su "Fase 1".

5. **Barra de Acciones (Footer del Formulario):**
   * Un contenedor al final del formulario (`flex items-center justify-end`).
   * Debe incluir obligatoriamente dos elementos:
     - Un componente `Link` (variante `ghost`) apuntando a la ruta de cancelación (ej. `href: '#/entidades'`).
     - Un componente `Button` (variante `primary`, `type: 'submit'`) para disparar el evento de guardado.

## 4. Consumo de Componentes
Todos los elementos interactivos de la vista deben importarse exclusivamente desde el índice de componentes UI (`import { Input, Select, Button, Link } from '@/components/ui';`). Está prohibido escribir etiquetas `<input>` o `<button>` directamente en el template literal si existe un componente atómico para ello.

## 5. Protocolo de Generación Asistida por IA (Micro-Prompting)

Para garantizar la consistencia en la generación de Vistas y reducir la carga cognitiva/consumo de tokens, se debe utilizar el siguiente protocolo en dos fases.

### Fase 1: Inicialización (Contexto Base)
Enviar este comando al modelo una única vez al inicio de la sesión:

> Actúa como un desarrollador frontend experto. Memoriza este contrato arquitectónico para crear "Vistas" (Vanilla JS). Responde únicamente: "Contrato de Vistas asimilado."
>
> REGLAS DE ARQUITECTURA:
> 1. Exportar función `async` que retorne string HTML (template literals). Cero lógica, cero fetch, cero listeners. SRP estricto.
> 2. Contenedor principal con grid. Cabecera (h1, p).
> 3. Formulario principal con `novalidate` e ID estandarizado (`form-create-[entidad]`).
> 4. Invocación de componentes atómicos importados desde `@/components/ui` (`Input`, `Select`, `Button`, `Link`).
> 5. Para campos relacionales (foreign keys), usar contenedores placeholder con ID único (`[field]-select-container`) para que el Handler los llene.
> 6. Barra inferior con Link de Cancelar y Button de Submit.
> 
> No generes código hasta recibir los requerimientos.

### Fase 2: Petición de la Vista
Utiliza esta estructura minificada para pedir el código:

> Vista: [Nombre, ej: UserCreateView]
> Entidad: [Nombre de la entidad]
> Ruta retorno (Cancelar): [ej: #/usuarios]
> Campos requeridos:
> - [nombre_campo] (Tipo de componente, Ej: Input de texto)
> - [nombre_campo_relacional] (Contenedor Placeholder para Select)
> 
> Genera únicamente el código JS de la vista bajo el estándar.