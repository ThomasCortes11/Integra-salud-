/**
 * Datos de contacto y medición de INTEGRA SALUD.
 *
 * Los textos de la página viven en index.html (así Google los lee sin JavaScript).
 * Aquí solo va lo que se reutiliza en muchos botones: WhatsApp, teléfono y analítica.
 * Si cambias el número, cámbialo también en index.html (búscalo con Ctrl+F) para que
 * Google y quien navega sin JavaScript vean el mismo dato.
 */
window.SITE_CONFIG = {
  contact: {
    /** Número de WhatsApp con indicativo de país, sin + ni espacios. */
    whatsappNumber: "573184479028",
    /** Mensaje por defecto de los botones de WhatsApp. */
    whatsappDefaultMessage: "Hola, quiero asesoría en salud con INTEGRA SALUD.",
    phoneLink: "tel:+573184479028",
  },
  analytics: {
    /** ID de Google Analytics 4 (ej. "G-XXXXXXX"). Vacío = desactivado. */
    ga4Id: "",
    /** ID del Pixel de Meta (Facebook/Instagram Ads). Vacío = desactivado. */
    metaPixelId: "",
  },
};
