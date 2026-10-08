# INTEGRA SALUD - Landing estatica SEO + CRO

Landing one-page estatica, lista para abrir con doble clic en `index.html` y desplegar en Netlify, Vercel, GitHub Pages o Cloudflare Pages.

## Estructura

- `index.html`
- `404.html`
- `config/site.config.js`
- `css/styles.css`
- `js/main.js`
- `assets/`
- `sitemap.xml`
- `robots.txt`
- `site.webmanifest`

## Como clonar para un nuevo cliente en 10 minutos

1. Cambia los datos del negocio en `config/site.config.js`:
   - `brand.name`, `brand.slogans`, `brand.description`, `brand.city`, `brand.domain`
   - `contact.phoneDisplay`, `contact.phoneRaw`, `contact.phoneLink`, `contact.email`, `contact.whatsappNumber`
   - `social.*`
   - `theme.*` (colores)
   - `services`, `alliedEntities`, `faqs`, `testimonials`, `cta`, `legal`
   - `analytics.ga4Id` y `analytics.metaPixelId` (opcionales)
2. Reemplaza logo e imagenes en `assets/`:
   - `logo.svg`
   - `hero-family.webp`
   - `og-image.jpg` (1200x630)
   - Favicons (`favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `favicon-192.png`, `favicon-512.png`)
3. Ajusta dominio y ciudad en:
   - `config/site.config.js` (`brand.domain`, `brand.city`)
   - `sitemap.xml` (`<loc>`)
   - `robots.txt` (`Sitemap:`)
4. Verifica metadatos SEO en `index.html`:
   - `<title>`
   - `<meta name="description">`
   - Open Graph y Twitter
5. Publica en hosting estatico.

## Publicacion rapida

### Netlify
1. Arrastra la carpeta del proyecto al panel de Netlify.
2. Asigna dominio personalizado.

### Vercel
1. Importa repositorio o sube la carpeta.
2. Framework preset: `Other`.

### GitHub Pages
1. Sube el contenido a un repositorio.
2. Activa Pages en branch principal, carpeta root.

### Cloudflare Pages
1. Conecta repositorio o sube archivos.
2. Build command vacio, output `.`

## Conectar dominio

1. Crea registros DNS del proveedor hacia tu plataforma:
   - Netlify/Vercel/Cloudflare: siguen su asistente DNS.
2. Espera propagacion (5 min a 24 h).
3. Verifica HTTPS activo.
4. Actualiza `brand.domain`, `canonical`, `sitemap.xml` y `robots.txt`.

## Formulario

- El formulario abre WhatsApp con datos prellenados.
- Compatible con Netlify Forms por `data-netlify="true"`.
- Para Formspree, reemplaza `action` del formulario por tu endpoint.

## Checklist de clonacion

- [ ] Marca, ciudad y dominio actualizados.
- [ ] WhatsApp, telefono y correo correctos.
- [ ] Servicios y FAQ del cliente actualizados.
- [ ] Testimonios reales (si hay autorizacion).
- [ ] IDs GA4 y Meta Pixel configurados (opcional).
- [ ] Logo, hero y OG image reemplazados.
- [ ] Sitemap y robots con dominio real.
- [ ] Prueba movil, CTA y enlaces de conversion.
- [ ] Prueba Lighthouse (Performance/SEO/Accesibilidad/Best Practices).

## Nota legal

Informacion de caracter informativo; las condiciones dependen de cada entidad.
Tratamiento de datos personales conforme a la Ley 1581 de 2012 de Colombia.
