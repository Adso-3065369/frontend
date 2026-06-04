# Especificación Técnica de Componentes Atómicos UI (Vanilla JS)

Este documento define el estándar arquitectónico innegociable para la creación de componentes de interfaz de usuario basados en funciones de renderizado de Vanilla JavaScript mediante template literals y Tailwind CSS.

## 1. Patrón Arquitectónico
Todo componente debe ser exportado como una función pura que reciba un único objeto de propiedades (`props`) destruturado con valores por defecto, y retorne un `string` con marcado HTML válido.

## 2. Documentación Estricta (JSDoc)
Es obligatorio anteceder la declaración de la función con un bloque JSDoc. Debe contener:
* **`@file`:** Nombre del archivo.
* **`@description`:** Explicación técnica de la responsabilidad del componente.
* **`@param {Type} [props.name=default]`:** Definición exhaustiva de cada propiedad esperada en el objeto de destructuración.
* **`@returns {string}`:** Declaración del valor de retorno.

## 3. Bloques de Procesamiento Interno
El cuerpo del componente debe estructurarse estrictamente en 6 bloques secuenciales, documentados con comentarios en línea:

1. **Clases Base:** Una constante `baseClasses` tipo string que contenga las utilidades de Tailwind CSS compartidas independientemente de la variante o tamaño (animaciones, outline, comportamientos disabled).
2. **Diccionario de Variantes Visuales:** Un objeto `variants` que mapee obligatoria y estrictamente las siguientes claves semánticas con sus respectivas clases de Tailwind (fondos, bordes, textos, estados hover/focus): `primary`, `secondary`, `danger`, `success`, `ghost`, `outline-primary`, `outline-secondary`, `outline-danger`, `outline-success`.
3. **Diccionario de Tamaños:** Un objeto `sizes` que mapee las proporciones estructurales obligatoriamente bajo las siguientes claves exactas: `sm`, `md`, `lg`.
4. **Resolución de clases:** Evaluación e inyección de caídas (fallbacks) de diccionarios apuntando siempre a la variante `primary` y tamaño `md` en caso de fallo, seguida de la concatenación final en una variable `finalClasses` usando interpolación y `.trim()`. Soporta inyección de clases externas a través de `props.className`.
5. **Resolución de atributos:** Evaluación ternaria e interpolación condicional de atributos HTML nativos (`id`, `disabled`, `type`, etc.). Es obligatorio iterar sobre el objeto `dataset` para generar la cadena de atributos `data-*` y permitir la delegación de eventos en el DOM.
6. **Renderizado Condicional del Template:** Retorno explícito del string usando template literals (backticks). Debe manejar sub-estructuras de forma condicional (evaluar si existe texto, icono o label antes de inyectar sus respectivas etiquetas HTML).

## 4. Gestión de Estilos Corporativos y Estados
* **Brand:** Referenciar colores corporativos usando las variables de Tailwind configuradas previamente (ej. `text-brand`, `bg-brand`, `ring-brand`).
* **Disabled States:** Utilizar el modificador `disabled:` de Tailwind CSS en las clases base para centralizar la gestión visual y de puntero del estado inactivo.
* **Events:** El componente no debe adjuntar event listeners (`addEventListener`). Toda la interacción debe ser puramente declarativa y delegarse al DOM superior utilizando atributos `data-*` inyectados vía `props.dataset`.

## 5. Protocolo de Generación Asistida por IA

Para la creación de nuevos componentes, está estrictamente prohibido delegar la arquitectura al LLM. Se debe utilizar la técnica de "Micro-Prompting con Contexto Inicial" para reducir el consumo de tokens y garantizar la consistencia.

### Fase 1: Inicialización (Enviar una sola vez por chat)
Copiar y pegar el siguiente bloque para establecer el contrato en la ventana de contexto del modelo:

> Actúa como un desarrollador frontend experto. Memoriza el siguiente contrato arquitectónico para la creación de componentes UI (Vanilla JS). Todas mis peticiones futuras deben seguir estas reglas estrictamente. No confirmes de recibido con explicaciones, solo responde: "Contrato asimilado. Esperando componentes."
> 
> REGLAS:
> 1. Exportar función pura destructurando un objeto `props` con valores por defecto. Retornar string de HTML válido (template literals).
> 2. Incluir JSDoc estricto (@file, @description, @param, @returns).
> 3. Estructura interna de 6 bloques secuenciales:
>    - Bloque 1: `baseClasses` (string con Tailwind).
>    - Bloque 2: `variants` (Obligatorio mapear exactamente estas claves: primary, secondary, danger, success, ghost, outline-primary, outline-secondary, outline-danger, outline-success).
>    - Bloque 3: `sizes` (Obligatorio mapear exactamente estas claves: sm, md, lg).
>    - Bloque 4: Resolución en `finalClasses` (interpolación + `.trim()`).
>    - Bloque 5: Resolución de atributos HTML y mapeo de `dataset` a `data-*`.
>    - Bloque 6: Retorno de HTML condicional.
> 4. No usar `addEventListener`. Delegar eventos vía `dataset`.
> 5. Usar prefijo `brand` para colores corporativos. Manejar estados `disabled:`.
> 
> No generes nada aún.

### Fase 2: Petición de Componente (Micro-Prompt)
Utilizar la siguiente estructura minificada para solicitar cada nuevo elemento:

> Componente: [NOMBRE]
> Base HTML: [ETIQUETA_BASE_EJEMPLO: <input>]
> Props: 
> - [prop1] ([tipo], default: [valor])
> - [prop2] ([tipo])
> 
> Solo devuelve el código JS.