# INTEGRA SALUD — Página web de ventas

Landing de una sola página para **conseguir clientes por WhatsApp** que buscan asesoría en EPS, medicina prepagada, planes complementarios y ARL.

Es HTML, CSS y JavaScript puros: no hay nada que instalar ni compilar. Se publica gratis en Netlify, Vercel, Cloudflare Pages o GitHub Pages.

---

## 🎯 Cómo convierte visitas en clientes

| Elemento | Qué hace |
| --- | --- |
| **Héroe** | Promesa clara (“Elige bien tu EPS, prepagada o ARL. Sin enredos.”), botón de WhatsApp y una conversación de ejemplo que muestra cómo es la atención |
| **Quiz “Encuentra tu opción”** | 3 preguntas (para quién, qué busca, nombre y ciudad). Abre WhatsApp con el caso ya escrito, así el asesor responde directo |
| **¿Te suena familiar?** | Nombra los problemas del cliente (citas demoradas, letra pequeña, trámites) |
| **Servicios** | 6 tarjetas; cada una abre WhatsApp con un mensaje distinto, así se sabe qué le interesa a cada cliente |
| **Comparativo EPS vs. complementario vs. prepagada** | Contenido útil que genera confianza y posiciona en Google |
| **3 pasos + Por qué nosotros** | Quita miedo al proceso |
| **Preguntas frecuentes** | Responde objeciones (costo, preexistencias, traslados, ARL) |
| **Formulario** | Nombre, ciudad, servicio y detalle → WhatsApp con el mensaje listo |
| **Botón flotante (computador) y barra fija (celular)** | WhatsApp y Llamar siempre a un toque |

Todos los botones de WhatsApp (16) llevan un mensaje distinto. Cuando escriba un cliente, el mensaje te dice desde qué parte de la página llegó.

---

## ✏️ Cómo editar

| Quiero cambiar… | Dónde |
| --- | --- |
| Número de WhatsApp, mensaje por defecto, teléfono | `config/site.config.js` **y** busca `3184479028` en `index.html` (Ctrl+F → reemplazar todo) |
| Textos, servicios, preguntas frecuentes | `index.html` (cada sección está marcada con un comentario `<!-- ===== -->`) |
| Colores | `css/styles.css`, al inicio (`--navy-900`, `--wa`, etc.) |
| Google Analytics / Pixel de Meta | `config/site.config.js` → `analytics.ga4Id` y `analytics.metaPixelId` |
| Correo y datos del responsable de datos | `index.html` y `politica-de-privacidad.html` |

> Si cambias una **pregunta frecuente** en `index.html`, cámbiala también en el bloque `FAQPage` del `<head>`, para que Google muestre la misma respuesta.

### Activar testimonios

En `index.html` busca `TESTIMONIOS`. La sección está comentada para que no aparezcan textos de ejemplo. Pon testimonios **reales y autorizados**, borra las marcas de comentario (`<!--` y `-->`) y duplica el bloque `<figure>` por cada testimonio.

---

## 📊 Medir resultados

1. Crea una propiedad de **Google Analytics 4** y pega el ID (`G-XXXXXXX`) en `config/site.config.js`.
2. Si haces publicidad en Facebook o Instagram, pega el ID del **Pixel de Meta**.
3. Eventos que ya se envían:
   - `generate_lead` (GA4) / `Contact` (Meta): cada clic en WhatsApp. El parámetro `source` dice cuál botón fue (`wa_hero`, `wa_quiz`, `wa_srv_prepagada`…).
   - `click_to_call`: clics en “Llamar”.
4. En GA4 marca `generate_lead` como **evento clave** (conversión).

---

## 🚀 Publicar

### Netlify (recomendado, gratis)
1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta del proyecto.
2. En *Domain management* conecta el dominio (`integrasalud.co`).
3. Netlify activa HTTPS automáticamente. La página `404.html` se usa sola.

### Otras opciones
- **Vercel / Cloudflare Pages:** importa el repositorio. Framework: *Other*. Build command: vacío. Carpeta de salida: `.` (raíz).
- **GitHub Pages:** Settings → Pages → rama `main`, carpeta `/ (root)`.

### Si el dominio no es `www.integrasalud.co`
Reemplaza `https://www.integrasalud.co` en `index.html`, `politica-de-privacidad.html`, `sitemap.xml` y `robots.txt`.

### Después de publicar
1. Registra el sitio en [Google Search Console](https://search.google.com/search-console) y envía `sitemap.xml`.
2. Crea o actualiza el **Perfil de Empresa en Google** (Google Maps) con el enlace a la página. Es la fuente número uno de clientes locales.
3. Prueba cómo se ve al compartir el enlace con el [depurador de Facebook](https://developers.facebook.com/tools/debug/).
4. Mide velocidad y calidad con [PageSpeed Insights](https://pagespeed.web.dev/).

Para verla en tu computador basta con abrir `index.html` con doble clic.

---

## 📁 Estructura

```text
index.html                    Página principal (todo el contenido)
politica-de-privacidad.html   Política de tratamiento de datos (Ley 1581 de 2012)
404.html                      Página de error
config/site.config.js         WhatsApp, teléfono y analítica
css/styles.css                Estilos (paleta del logo, responsive)
js/main.js                    Quiz, formulario, menú, enlaces de WhatsApp y medición
assets/                       Logo, símbolo, favicons e imagen para compartir (og-image.jpg)
favicon.ico, site.webmanifest, sitemap.xml, robots.txt
```

---

## ✅ Pendientes del cliente

- [ ] Confirmar o comprar el dominio `integrasalud.co`.
- [ ] Correo propio del negocio (p. ej. `contacto@integrasalud.co`) en lugar de `Saludtotal390@gmail.com`.
- [ ] Razón social y NIT (o cédula) del responsable, para la política de datos.
- [ ] Confirmar que la cifra “+500 personas asesoradas” es real.
- [ ] Confirmar el costo de la asesoría (si es gratis, decirlo vende más: “Asesoría sin costo”).
- [ ] Confirmar con qué entidades se trabaja realmente (Colmédica, Allianz, Sura, Salud Total, Compensar).
- [ ] Horario de atención.
- [ ] Testimonios reales con autorización (nombre, ciudad y texto).
- [ ] Foto real del asesor o del equipo (aumenta mucho la confianza).
- [ ] Enlaces reales de Instagram, Facebook y TikTok, si existen.
- [ ] IDs de Google Analytics y Pixel de Meta.

---

**Aviso legal:** la información del sitio es orientativa; coberturas, condiciones y precios dependen de cada entidad.
