# Sistema de diseño · Conexión Caribe

Estas son las reglas de UI para la web pública y el panel. Todo valor visual sale de aquí: si hace falta uno nuevo, primero se agrega a este documento y a `apps/web/src/app/globals.css`, y después se usa.

**Concepto: "agua clara".** La base es clara y fresca: blanco agua y lagunas turquesa con degradados suaves. El mar profundo (navy) ancla el texto y las franjas oscuras. El turquesa es la firma de marca y el dorado solo aparece en detalles. Debe sentirse **organizado, confiable y de vacaciones**, nunca corporativo ni recargado.

## 1. Color

### Paleta (tokens Tailwind `--color-*`)

| Token | Hex | Uso |
|---|---|---|
| `canvas` | `#F7FBFB` | Blanco agua: fondo de página (web y panel) |
| `white` | `#FFFFFF` | Superficies: cards, inputs, header |
| `line` | `#D8E7E8` | Bordes de cards y separadores (decorativos) |
| `field-border` | `#85919E` | Borde de inputs en reposo (3.2:1, WCAG 1.4.11) |
| `ink-900` | `#01274B` | Navy del logo: texto principal, franjas oscuras, footer |
| `ink-700` | `#34506B` | Texto secundario y párrafos largos |
| `ink-500` | `#52677D` | Texto atenuado: ayudas, metadatos |
| `teal-50` | `#E6F7F6` | Fondo de íconos, chips y estados activos suaves |
| `teal-100` | `#D2F0EF` | Barras inactivas, números decorativos |
| `teal-200` | `#A6E2E0` | Detalles decorativos |
| `teal-300` | `#3CCBCB` | Laguna: solo en degradados con `teal-400` y siempre con texto `ink-900` (botón de la barra del hero) |
| `teal-400` | `#01AEB5` | Turquesa del logo: acentos, CTA sobre fondo oscuro |
| `teal-600` | `#087571` | Acción principal (botones, enlaces) sobre fondo claro |
| `teal-700` | `#065E5B` | Hover y pressed de la acción principal |
| `gold-400` | `#CB9E55` | Dorado champán del logo: detalles y sello "Premium". **No** para texto sobre claro |
| `gold-700` | `#7A5A22` | Texto dorado sobre claro |
| `palm-600` | `#2F6B4F` | Éxito y confirmado |
| `danger-600` | `#B42318` | Error |

### Reglas
- **60/30/10:** 60 % fondos claros (canvas, blanco, laguna), 30 % azul (`ink-900` en texto y franjas de mar profundo), 10 % turquesa (acciones y acentos). El dorado ocupa menos del 2 %.
- **Una sola acción principal (`teal-600`) por bloque.** Sobre fondo `ink-900`, el CTA principal es `teal-400` con texto `ink-900`.
- Las secciones alternan `canvas` y `bg-lagoon`. Nunca dos franjas oscuras seguidas.
- No hay colores arena ni beige: los fondos claros son siempre blancos o turquesa muy claro.

### Fondos de agua (utilidades en `globals.css`)
| Utilidad | Qué es | Uso |
|---|---|---|
| `bg-lagoon` | Degradado vertical `#EFFAFA` → `#E1F4F4` con dos reflejos turquesa (arriba a la izquierda y abajo a la derecha) | Secciones alternas claras |
| `bg-shallows` | Degradado diagonal de `#C8EEED` a `#F1FBFB`, con un brillo blanco arriba a la derecha | Bloques y tarjetas destacadas sobre `canvas` (p. ej. "¿Ninguno encaja?", la tarjeta de servicios del bento) |
| `bg-deep-sea` | Degradado navy `#01274B` → `#033F5D` con un reflejo turquesa abajo a la derecha | Franjas oscuras, footer, CTA band y paneles navy. El reflejo va abajo para que el texto `teal-400` de arriba siga sobre navy |
| `mask-wave-y` / `mask-wave-top` / `mask-wave-bottom` | Recorta la franja con forma de ola arriba y abajo, solo arriba o solo abajo | Franjas `bg-deep-sea` de ancho completo (paquetes del inicio, footer) y cabeceras `PageHero` sin foto, siempre con `WaveFoam` |

`WaveFoam` (`components/site/wave-foam.tsx`) dibuja la espuma: una franja turquesa al 22 % justo bajo el borde de la ola, del mismo alto que la máscara: la variable `--wave-h` (32 / 48 / 72 px en móvil / `sm` / `lg`), definida una sola vez en `:root`. La máscara es la que da la forma, así no hay dos capas superpuestas ni línea de costura. Las cabeceras de página sin foto (traslados, servicios, contacto y legales) usan `bg-deep-sea` y terminan en ola; su sol y su ola decorativos se ocultan en móvil para no tapar el texto. Las cabeceras con foto y los medios a pantalla completa (visor de fotos, video) siguen en `ink-900` liso.
- El texto siempre en `ink-900`, `ink-700` o `ink-500`. No se usa gris neutro de Tailwind ni negro puro.
- Contrastes verificados (AA):

  | Combinación | Contraste |
  |---|---|
  | `ink-900` sobre `canvas` | 14.5:1 |
  | `ink-500` sobre `bg-lagoon` (punto más oscuro) | 4.7:1 |
  | `teal-600` sobre `bg-lagoon` (punto más oscuro) | 4.6:1 |
  | blanco sobre `bg-deep-sea` | 10.5:1 o más |
  | blanco sobre `teal-600` | 5.5:1 |
  | `teal-400` sobre `ink-900` | 5.5:1 |
  | `gold-700` sobre blanco | 6.0:1 |

## 2. Tipografía

| Rol | Fuente | Tamaño / interlineado | Peso | Uso |
|---|---|---|---|---|
| `display-xl` | Fraunces | `clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)` / 1.05, tracking −0.02em | 600 | H1 del hero |
| `display-lg` | Fraunces | `clamp(2rem, 1.5rem + 2vw, 3rem)` / 1.1 | 600 | H2 de sección |
| `display-md` | Fraunces | 1.5rem / 1.25 | 600 | H3 destacados, títulos de auth |
| `title` | DM Sans | 1.125rem / 1.4 | 600 | Títulos de card y de módulo |
| `body-lg` | DM Sans | 1.125rem / 1.65 | 400 | Entradillas (lead) |
| `body` | DM Sans | 1rem / 1.6 | 400 | Texto base (**nunca menos de 16 px en inputs**) |
| `small` | DM Sans | 0.875rem / 1.5 | 400–500 | Labels, ayudas, metadatos |
| `eyebrow` | DM Sans | 0.8125rem, mayúsculas, tracking 0.14em | 600 | Antetítulo de sección |

- Fraunces solo en H1–H3. La UI (botones, labels, tablas) va en DM Sans.
- Párrafos con ancho máximo de **62ch**. Los títulos se cortan con `text-balance` y el cuerpo con `text-pretty`.
- Itálica de Fraunces para **una** palabra de énfasis por título, como mucho.

## 3. Espaciado y layout

Escala base de 4 px (unidades de Tailwind): 1 · 2 · 3 · 4 · 5 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 28 · 32.

| Elemento | Móvil | Escritorio |
|---|---|---|
| Contenedor | `max-w-7xl`, `px-5` | `px-8` |
| Padding vertical de sección | `py-20` (80) | `lg:py-28` (112) |
| Cabecera de sección → contenido | `mt-10` | `lg:mt-14` |
| Separación entre cards de una grilla | `gap-5` | `lg:gap-8` |
| Padding de card | `p-6` | `sm:p-8` |
| Header del sitio | `h-16` | `lg:h-20` |

- **Nada toca un borde.** Todo contenido dentro de una superficie lleva al menos 24 px (`p-6`) de aire.
- La grilla de cards es de 1 columna en móvil, 2 en `sm` y 3 en `lg`. Las cards de una fila tienen el mismo alto.

## 4. Formularios

| Regla | Valor |
|---|---|
| Label → input | 8 px (`gap-2`) |
| Campo → campo | 20 px (`gap-5`) |
| Grupo → grupo (fieldset) | 32 px (`gap-8`), con título de grupo `title` |
| Último campo → acciones | 32 px (`mt-8`) |
| Alto de input | 48 px, texto 16 px, padding horizontal 16 px, radio 12 px, borde 1 px `field-border` |
| Foco | Borde `teal-600` más anillo de 3 px `teal-400` al 35 % |
| Error | Borde `danger-600` y mensaje `small` debajo, nunca solo color |
| Botón de envío | Alto de 48 px; ancho completo en formularios de una columna |
| Ancho del formulario | Máximo 400 px en accesos, 640 px en formularios largos |

- Labels siempre visibles encima del campo. El placeholder no reemplaza al label.
- Los mensajes de error y éxito del formulario van en un `Alert` arriba del primer campo.

### Barra de búsqueda del hero (`QuickPlanner`)
Es la excepción a los campos con borde. Sigue el patrón de los buscadores de viajes: una barra blanca con **segmentos** separados por líneas finas y un botón de color vivo al final. Cada segmento hace de campo; los controles de HeroUI van sin borde.
- Marco de vidrio (`glass`, `p-1.5`, `shadow-raised`) alrededor de una barra blanca con `p-1.5`. Desde `lg`, marco, barra y segmentos son píldoras (`rounded-full`); por debajo, `rounded-panel` y segmentos `rounded-card`.
- Segmento: `px-4 py-3` (`lg:px-5 lg:py-2`), label con la escala `eyebrow` en `teal-700`, valor a 16 px en `ink-900`. Ícono de 20 px en un círculo `teal-50` de 40 px, solo en `sm` y desde `xl` (en móvil y en `md`–`lg` las fechas no cabrían).
- Separadores de 1 px en `ink-900` al 12 %: horizontales en móvil y verticales desde `md`. Se ocultan junto al segmento resaltado.
- Hover: fondo `teal-50`. Foco o menú abierto: fondo `teal-50` con borde interior `teal-600` de 2 px, y el círculo del ícono pasa a `teal-600`. Los menús salen 16 px por debajo, alineados con el texto.
- Viajeros: − y + en círculos de 32 px con borde `field-border` (hover `teal-600`).
- Enviar: degradado de laguna `teal-400` → `teal-300` con texto `ink-900` (5.6:1 y 7.7:1) y sombra turquesa. Es el único botón con texto navy sobre fondo claro. Foco: anillo `ink-900` de 2 px separado por 2 px de blanco.
- Disposición: una columna en móvil; desde `md`, los tres segmentos en fila y el botón debajo a todo el ancho; desde `lg`, una sola fila (unos 80 px de alto).
- Los estilos viven en `globals.css` bajo `.trip-bar`, en la capa `utilities` para ganar a los estados de foco de HeroUI sin `!important`.

## 5. Forma y elevación

| Token | Valor | Uso |
|---|---|---|
| `radius-field` | 12 px | Inputs, selects |
| `radius-card` | 24 px | Cards, imágenes, bloques |
| `radius-panel` | 32 px | Contenedores grandes (CTA band, hero media) |
| Botones | `rounded-full` | Todos los botones y chips |
| `shadow-card` | `0 1px 2px rgb(10 42 74 / .06), 0 1px 1px rgb(10 42 74 / .04)` | Cards en reposo, siempre con borde `line` |
| `shadow-raised` | `0 24px 48px -24px rgb(10 42 74 / .35)` | Elementos flotantes (tarjeta "Mi viaje", menús) |

- Las sombras se tiñen de `ink-900`. Nunca sombra negra genérica.
- Cada superficie lleva borde o sombra, no ambos fuertes.

## 6. Botones

| Variante | Fondo / texto | Cuándo |
|---|---|---|
| Primario | `teal-600` / blanco | La acción principal del bloque |
| Secundario | blanco con borde `field-border` / `ink-900` | Alternativa (p. ej. WhatsApp junto a "Arma mi viaje") |
| Ghost | transparente / `ink-700` | Acciones terciarias, navegación |
| Sobre oscuro | `teal-400` / `ink-900` | CTA principal en franjas `ink-900` |

Tamaños: `sm` 36 px (solo en el panel), `md` 44 px (por defecto) y `lg` 52 px (hero y CTA). Los íconos van a 20 px y a 8 px del texto.

## 7. Logo, iconografía e imagen

### Logo
Los originales del cliente están en `docs/brand/originales/`: JPEG con fondo y el catálogo en PDF. Las versiones para la web, sin fondo, están en `apps/web/src/assets/brand/` y se usan **solo** a través de `components/brand/logo.tsx`:

| Componente | Archivo | Uso |
|---|---|---|
| `<Logo on="light">` | `logo-horizontal-light.png` | Header, panel y menú móvil. Alto de 40 px en móvil y 52 px en escritorio |
| `<Logo on="dark">` | `logo-horizontal-dark.png` | Footer y franjas `ink-900`. Alto mínimo de 48 px |
| `<LogoStacked>` | `logo-stacked-dark.png` (con lema) | Paneles de marca grandes sobre `ink-900`, como el acceso al panel |
| `<LogoMark>` | `logo-mark*.png` | Espacios pequeños donde no cabe el nombre |
| Ícono | `app/icon.png`, `apple-icon.png`, `favicon.ico` | Generados del badge circular |
| Al compartir | `assets/brand/opengraph.jpg` (1200×630), vía `shareImage()` de `lib/metadata.ts` | Vista previa en WhatsApp y redes. Las fichas de excursión usan su portada |

- No se recolorea, deforma ni pone sombra al logo. Se deja un margen libre de al menos la altura de la "C" alrededor.
- Lema oficial: **"Tu viaje, nuestra conexión."** (con coma, como en el logo).
- Cuando llegue el logo en vector (SVG o PNG transparente de ≥ 2000 px), se reemplazan los archivos de `assets/brand/` con los mismos nombres.

### Íconos y fotos
- Íconos de [Lucide](https://lucide.dev) con trazo de 1.75 y tamaño 20–24 px. Dentro de un círculo `teal-50` de 48 px cuando acompañan a una card.
- Fotos con radio `radius-card` y proporciones 4:3 en móvil y 1:1 desde `sm` (hero), y 16:9 en las cards de excursión. Siempre con `next/image` y `placeholder="blur"`.
- Las fotos de excursiones viven en `assets/images/excursiones/<slug>/`: `portada.jpg` (16:9, 1920×1080) y la galería `01.jpg`, `02.jpg`… (lado mayor 1600 px). No se editan a mano: se generan con `tools/media/procesar_catalogo.py` desde los originales del cliente (selección y ajustes en `tools/media/catalogo.json`), que también escribe `content/generated/excursion-media.ts`. Los clips van a `public/videos/excursiones/<slug>.mp4`.
- Saona, Catalina, party boat, Samaná y Santo Domingo aún usan las ilustraciones del catálogo PDF (ampliadas con IA). Se reemplazan por fotos reales cuando el cliente las envíe. Nunca se usan cajas grises.
- No se publican fotos con marca de agua ni fotos cuyos derechos no confirmó el cliente.

## 8. Movimiento

Hover a 150 ms, entradas a 250 ms, curva `ease-out` (`[0.22, 1, 0.36, 1]`). Se respeta `prefers-reduced-motion`. Nada parpadea ni rebota.

| Patrón | Componente | Regla |
|---|---|---|
| Aparición al hacer scroll | `Reveal`, `RevealGroup` y `RevealItem` (`components/motion/reveal.tsx`) | Opacidad más 28 px hacia arriba, 0,7 s, una sola vez. En grupos, escalonado de 0,09 s. |
| Carrusel | `Carousel` (`components/ui/carousel.tsx`, Embla) | Arrastre, flechas y puntos accesibles. Autoplay solo en franjas de inspiración (paquetes): se detiene al interactuar y nunca con movimiento reducido. |
| Video del hero | `HeroVideo` | Primero la foto (LCP). El video se carga solo en pantallas de 768 px o más, sin ahorro de datos y sin movimiento reducido. Siempre tiene botón de pausa (WCAG 2.2.2). |
| Franja de destinos | `Marquee` | Desplazamiento continuo que se pausa al pasar el mouse y queda quieto con movimiento reducido. |
| Filtros | `ExcursionsExplorer` | Reordenamiento con `layout` y entrada o salida a escala 0,96. |
| Galería de excursión | `ExcursionGallery` | Mosaico de hasta 5 fotos (1 grande y 4 pequeñas desde `sm`). El visor es un `<dialog>` modal a pantalla completa sobre `ink-900`, con flechas, teclado, contador y pie de foto; Escape cierra. |
| Clip de excursión | `ExcursionVideo` | Póster con botón de reproducir; el video (sin audio, en bucle) solo se descarga al pulsarlo y siempre se puede pausar. |
| Pasos de formulario | `Planner` | Deslizamiento horizontal de 40 px según la dirección. |
| Header | `HeaderShell` | Transparente sobre el video del inicio y blanco al hacer scroll de más de 24 px. |

## 9. Panel de gestión

- Fondo `canvas`. Sidebar blanca de 264 px con borde `line`. Topbar de 64 px.
- Ítem de navegación: 40 px de alto, ícono de 20 px, radio 12 px. El activo va en `teal-50` con texto `teal-700`. Los módulos futuros aparecen atenuados con la etiqueta "Pronto".
- Contenido con `p-6` y `lg:p-10`, ancho máximo `max-w-6xl`.
- Encabezado de página: título `display-md`, descripción `ink-500` y acciones a la derecha, con 32 px antes del contenido.
- Pantallas de acceso: en `lg` se divide la pantalla, con un panel de marca `bg-deep-sea` a la izquierda y el formulario sobre `canvas` a la derecha. En móvil, solo el formulario con el logo.
