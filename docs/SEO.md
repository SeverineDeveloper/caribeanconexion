# SEO y visibilidad en IAs · Conexión Caribe

Objetivo: que Google, Bing y los asistentes de IA (ChatGPT, Perplexity, Gemini, Claude, Copilot) encuentren la web, la entiendan y la citen cuando alguien pregunta por excursiones, traslados o viajes a Punta Cana.

Hay dos partes: lo técnico y el contenido, que ya están en la web, y lo de fuera de la web (perfiles, reseñas, menciones), que depende del cliente y pesa tanto como lo primero.

## 1. Qué hay en la web

| Pieza | Dónde | Para qué |
|---|---|---|
| `robots.txt` | `apps/web/src/app/robots.ts` | Permite todo salvo `/admin` y `/api`. Grupos explícitos para los bots de IA (OAI-SearchBot, GPTBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bingbot, CCBot). |
| `sitemap.xml` | `apps/web/src/app/sitemap.ts` | Cada página en ES/EN/FR con sus alternativas `hreflang` y `x-default`. Las páginas salen de `src/lib/public-pages.ts`. |
| `llms.txt` | `apps/web/src/app/llms.txt/route.ts` | Resumen en inglés para asistentes de IA ([llmstxt.org](https://llmstxt.org)): empresa, excursiones con precio, duración, horarios e inclusiones, traslados, guías y contacto. Se genera del catálogo. |
| Datos estructurados | `src/lib/structured-data.ts` y cada página | `TravelAgency` + `WebSite` en todas las páginas; `TouristTrip` con oferta en cada excursión; `ItemList` en /excursiones; `FAQPage`; `BreadcrumbList`; `Article` en guías; `AboutPage`. Todo enlazado a la empresa por `@id`. |
| Metadatos | `src/lib/metadata.ts` | Título y descripción por página, canonical, `hreflang` + `x-default`, Open Graph completo. |
| Contenido que responde | Excursiones, traslados, guías, Sobre nosotros | Bloque "En breve" con los datos clave en una frase, FAQ por excursión (sale de los datos del catálogo) y guías con tablas generadas del catálogo. |

Reglas para mantenerlo:

- **Página pública nueva:** añadirla a `src/lib/public-pages.ts` (sitemap y llms.txt) y usar `pageMetadata()`.
- **Cifras:** precios, duraciones, horarios, rutas y vehículos salen de `src/content/` y de los mensajes; las FAQ, el "En breve" de excursiones y las tablas de las guías los leen de ahí. No escribir cifras a mano en los textos.
- **Guía nueva:** carpeta en `src/content/guides/<slug>/` con `es.ts`, `en.ts`, `fr.ts` e `index.ts`, y registrarla en `src/content/guides/index.ts`. Al actualizar una guía, cambiar `modified`.
- **Datos de la empresa:** `src/content/business.ts`. Los perfiles vacíos no se publican.

## 2. Vista previa vs. dominio definitivo

La vista previa de GitHub Pages se compila con `SITE_NOINDEX=1` (`.github/workflows/pages.yml`): todas las páginas llevan `noindex, nofollow`, el sitemap sale vacío y `robots.txt` bloquea todo. Es una URL temporal y no conviene que buscadores e IAs la aprendan, porque GitHub Pages no permite redirecciones 301 al dominio.

Para activar el SEO en producción no hace falta tocar código:

1. `NEXT_PUBLIC_SITE_URL` con el dominio definitivo (`https://dominio`, sin barra final) en las variables del entorno `production` de GitHub.
2. No definir `SITE_NOINDEX` en producción. Staging ya va con `X-Robots-Tag: noindex` y contraseña desde Caddy.
3. Comprobar después del despliegue: `https://dominio/robots.txt`, `https://dominio/sitemap.xml`, `https://dominio/llms.txt` y que `/es` no tenga `<meta name="robots" content="noindex">`.

## 3. Al publicar el dominio (desarrollador)

- [ ] **Cloudflare: permitir los bots de IA.** Desde 2025 Cloudflare bloquea por defecto los rastreadores de IA en dominios nuevos. En *Security → Bots* (o *AI Crawl Control*) desactivar "Block AI bots", no activar el `robots.txt` gestionado por Cloudflare (reemplazaría al nuestro) y revisar que Bot Fight Mode no ponga desafíos a Googlebot, Bingbot, OAI-SearchBot o PerplexityBot.
- [ ] **Google Search Console:** propiedad de tipo *dominio*, verificada con un registro TXT en Cloudflare (sin tocar código). Enviar `https://dominio/sitemap.xml`.
- [ ] **Bing Webmaster Tools:** importar el sitio desde Search Console y enviar el sitemap. ChatGPT y Copilot usan el índice de Bing para buscar.
- [ ] Probar 2 o 3 páginas en la [prueba de resultados enriquecidos](https://search.google.com/test/rich-results) y en el [validador de schema.org](https://validator.schema.org).
- [ ] Revisar Core Web Vitals en Search Console a las 4 semanas.

## 4. Checklist del cliente (fuera de la web)

Las IAs recomiendan negocios que ven citados en varios sitios fiables, no solo en su propia web. Esto es lo que más mueve la aguja después del contenido:

- [ ] **Google Business Profile** como negocio de área de servicio (sin dirección pública si no hay oficina), categoría principal *Agencia de viajes* u *Operador turístico*, zonas: Punta Cana, Bávaro, Cap Cana, Bayahíbe, La Romana. Mismo nombre, teléfono y web que en la página.
- [ ] **TripAdvisor:** ficha de la empresa y de las excursiones principales.
- [ ] **Instagram y Facebook** (y TikTok si se usa) con el enlace a la web en la bio.
- [ ] **WhatsApp Business:** enlace a la web en el perfil.
- [ ] **Reseñas:** pedir reseña en Google y TripAdvisor a cada cliente al terminar el viaje (el bot de WhatsApp puede enviar el enlace en una fase posterior). Responderlas todas.
- [ ] **Directorios y menciones:** el mismo nombre ("Conexión Caribe"), teléfono (+1 829-269-4285) y web en todos los sitios. Aparecer en blogs de viaje, foros (Reddit r/PuntaCana, TripAdvisor) y medios locales ayuda a que las IAs conozcan la marca.
- [ ] **Pasar los enlaces** de cada perfil para cargarlos en `src/content/business.ts` (se publican como `sameAs`).
- [ ] **Correo comercial** público para `business.ts`.

## 5. Contenido para revisar con el cliente

- Respuestas "¿Qué llevo?" de cada excursión (`ExcursionPages.<excursión>.faqExtra`): son consejos generales.
- Las tres guías (`src/content/guides/`): datos del destino (Saona, aeropuerto, temporadas) y cómo se describe la Saona clásica y la VIP.
- "Sobre nosotros" (`AboutPage` en `messages/*/pages.json`): falta historia propia (año, equipo, fotos del equipo). Con esos datos la página gana mucha credibilidad.
- Edad mínima y punto de recogida por excursión: hoy la FAQ dice que se confirman al reservar. Si el cliente pasa los datos, se añaden a cada ficha.

## 6. Cómo medir

- **Search Console y Bing:** impresiones y clics por consulta e idioma; páginas indexadas.
- **Panel de preguntas a las IAs**, una vez al mes, en ChatGPT (con búsqueda), Perplexity, Gemini y Google (AI Overviews), en ES/EN/FR. Anotar si aparece Conexión Caribe y qué página cita. Preguntas de ejemplo:
  - "excursiones en Punta Cana con traslado desde el hotel"
  - "cuánto tarda el traslado del aeropuerto de Punta Cana a Bávaro"
  - "Saona Island tour from Punta Cana"
  - "Punta Cana buggy tour price"
  - "transfert aéroport Punta Cana Bávaro"
  - "concierge Punta Cana español inglés francés"
- **Tráfico desde IAs:** cuando haya analítica, filtrar las visitas que llegan desde `chatgpt.com`, `perplexity.ai`, `gemini.google.com` y `copilot.microsoft.com`.
