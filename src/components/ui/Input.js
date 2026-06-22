/**
 * @file Input.js
 * @description Componente de campo de entrada de texto reutilizable basado en Vanilla JS.
 * Soporta múltiples variantes visuales, tamaños, estados de error y deshabilitado,
 * delegación de eventos vía dataset y colores corporativos con prefijo `brand`.
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.id=""] - Atributo `id` del input (y `for` del label asociado).
 * @param {string} [props.label=""] - Texto de la etiqueta visible sobre el input. Si se omite, no se renderiza el label.
 * @param {string} [props.name=""] - Atributo `name` del input.
 * @param {"text"|"email"|"password"|"number"} [props.type="text"] - Tipo de input HTML.
 * @param {string} [props.placeholder=""] - Texto de marcador de posición.
 * @param {boolean} [props.required=false] - Marca el campo como obligatorio (atributo HTML + asterisco en el label).
 * @param {"primary"|"secondary"|"danger"|"success"|"ghost"|"outline-primary"|"outline-secondary"|"outline-danger"|"outline-success"} [props.variant="primary"] - Variante visual del input.
 * @param {"sm"|"md"|"lg"} [props.size="md"] - Tamaño del input.
 * @param {boolean} [props.hasError=false] - Activa el estado visual de error.
 * @param {boolean} [props.disabled=false] - Desactiva el input.
 * @param {Object} [props.dataset={}] - Pares clave-valor mapeados a atributos `data-*`.
 * @returns {string} Cadena de HTML válida que representa el componente Input.
 */
export function Input({
  id          = "",
  label       = "",
  name        = "",
  type        = "text",
  placeholder = "",
  required    = false,
  variant     = "primary",
  size        = "md",
  hasError    = false,
  disabled    = false,
  dataset     = {},
} = {}) {

  // ─── Bloque 1: Base Classes ───────────────────────────────────────────────
  const baseClasses = [
    "w-full",
    "rounded-md",
    "border",
    "font-medium",
    "transition-colors",
    "duration-200",
    "outline-none",
    "placeholder:font-normal",
    "focus:ring-2",
    "focus:ring-offset-1",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "disabled:pointer-events-none",
  ].join(" ");

  // ─── Bloque 2: Variants ───────────────────────────────────────────────────
  const variants = {
    "primary": [
      "bg-brand-primary/5",
      "border-brand",
      "text-brand-primary",
      "placeholder:text-white/50",
      "focus:ring-brand",
      "focus:border-brand",
    ].join(" "),

    "secondary": [
      "bg-brand-secondary/5",
      "border-brand-secondary",
      "text-brand-secondary",
      "placeholder:text-white/50",
      "focus:ring-brand-secondary",
      "focus:border-brand-secondary",
    ].join(" "),

    "danger": [
      "bg-red-50",
      "border-red-500",
      "text-red-700",
      "placeholder:text-white/50",
      "focus:ring-red-500",
      "focus:border-red-500",
    ].join(" "),

    "success": [
      "bg-green-50",
      "border-green-500",
      "text-green-700",
      "placeholder:text-white/50",
      "focus:ring-green-500",
      "focus:border-green-500",
    ].join(" "),

    "ghost": [
      "bg-transparent",
      "border-transparent",
      "text-gray-700",
      "placeholder:text-gray-400",
      "focus:ring-gray-300",
      "focus:border-gray-300",
      "hover:border-gray-200",
    ].join(" "),

    "outline-primary": [
      "bg-transparent",
      "border-brand-primary",
      "text-brand-primary",
      "placeholder:text-brand-primary/40",
      "focus:ring-brand-primary",
      "focus:bg-brand-primary/5",
    ].join(" "),

    "outline-secondary": [
      "bg-transparent",
      "border-brand-secondary",
      "text-brand-secondary",
      "placeholder:text-brand-secondary/40",
      "focus:ring-brand-secondary",
      "focus:bg-brand-secondary/5",
    ].join(" "),

    "outline-danger": [
      "bg-transparent",
      "border-red-500",
      "text-red-600",
      "placeholder:text-red-300",
      "focus:ring-red-400",
      "focus:bg-red-50",
    ].join(" "),

    "outline-success": [
      "bg-transparent",
      "border-green-500",
      "text-green-600",
      "placeholder:text-green-300",
      "focus:ring-green-400",
      "focus:bg-green-50",
    ].join(" "),
  };

  // ─── Bloque 3: Sizes ──────────────────────────────────────────────────────
  const sizes = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-3.5 py-2   text-base",
    lg: "px-4   py-3   text-lg",
  };

  // ─── Bloque 4: Final Classes ──────────────────────────────────────────────
  const errorClasses = hasError
    ? "border-red-500 bg-red-50 text-red-700 placeholder:text-red-400 focus:ring-red-500"
    : "";

  const resolvedVariant = variants[variant] ?? variants["primary"];
  const resolvedSize    = sizes[size]       ?? sizes["md"];

  const finalClasses = `${baseClasses} ${resolvedVariant} ${resolvedSize} ${errorClasses}`.trim();

  // ─── Bloque 5: Atributos HTML y dataset ───────────────────────────────────
  const idAttr        = id        ? `id="${id}"`           : "";
  const requiredAttr  = required  ? "required"             : "";
  const disabledAttr  = disabled  ? "disabled"             : "";
  const ariaInvalid   = hasError  ? 'aria-invalid="true"'  : "";
  const ariaDisabled  = disabled  ? 'aria-disabled="true"' : "";

  const dataAttrs = Object.entries(dataset)
    .map(([key, value]) => `data-${key}="${value}"`)
    .join(" ");

  // ─── Bloque 6: Retorno de HTML condicional ────────────────────────────────
  const labelHTML = label
    ? `<label ${id ? `for="${id}"` : ""} class="block text-sm font-medium text-text-secondary mb-1">
        ${label}${required ? ' <span class="text-red-500">*</span>' : ""}
      </label>`
    : "";

  return `
    ${labelHTML}
    <input
      type="${type}"
      ${idAttr}
      name="${name}"
      placeholder="${placeholder}"
      class="${finalClasses}"
      ${requiredAttr}
      ${ariaInvalid}
      ${ariaDisabled}
      ${disabledAttr}
      ${dataAttrs}
    />
  `.trim();
}