# Sistema de diseño · Conexión Caribe

Estas son las reglas de UI para la web pública y el panel. Todo valor visual sale de aquí: si hace falta uno nuevo, primero se agrega a este documento y a `apps/web/src/app/globals.css`, y después se usa.

**Concepto: "agua clara y arena".** La base es clara y cálida (arena, blanco roto). El azul profundo ancla el texto y las franjas oscuras. El turquesa es la firma de marca y el dorado solo aparece en detalles. Debe sentirse **organizado, confiable y de vacaciones**, nunca corporativo ni recargado.

## 1. Color

### Paleta (tokens Tailwind `--color-*`)

| Token | Hex | Uso |
|---|---|---|
| `canvas` | `#FCFAF6` | Fondo de página (web y panel) |
| `white` | `#FFFFFF` | Superficies: cards, inputs, header |
| `sand-100` | `#F5ECDD` | Secciones alternas, bloques suaves |
| `sand-200` | `#F3E7D3` | Arena de marca: destacados, fondos de ilustración |
| `sand-300` | `#E6D5B8` | Detalles decorativos |
| `line` | `#E8E0D2` | Bordes de cards y separadores (decorativos) |
| `field-border` | `#85919E` | Borde de inputs en reposo (3.2:1, WCAG 1.4.11) |
| `ink-900` | `#0A2A4A` | Texto principal, franjas oscuras, footer |
| `ink-700` | `#34506B` | Texto secundario y párrafos largos |
| `ink-500` | `#52677D` | Texto atenuado: ayudas, metadatos |
| `teal-50` | `#E6F7F6` | Fondo de íconos y estados activos suaves |
| `teal-400` | `#0FB5B0` | Turquesa de marca: acentos, ilustración, CTA sobre fondo oscuro |
| `teal-600` | `#087571` | Acción principal (botones, enlaces) sobre fondo claro |
| `teal-700` | `#065E5B` | Hover y pressed de la acción principal |
| `gold-400` | `#C9A227` | Detalles: estrellas, sello "Premium". **No** para texto sobre claro |
| `gold-700` | `#7A5F0E` | Texto dorado sobre claro |
| `palm-600` | `#2F6B4F` | Éxito y confirmado |
| `danger-600` | `#B42318` | Error |

### Reglas
- **60/30/10:** 60 % fondos claros (canvas, blanco, arena), 30 % azul (`ink-900` en texto y franjas oscuras), 10 % turquesa (acciones y acentos). El dorado ocupa menos del 2 %.
- **Una sola acción principal (`teal-600`) por bloque.** Sobre fondo `ink-900`, el CTA principal es `teal-400` con texto `ink-900`.
- Las secciones alternan `canvas` y `sand-100`. Nunca dos franjas oscuras seguidas.
- El texto siempre en `ink-900`, `ink-700` o `ink-500`. No se usa gris neutro de Tailwind ni negro puro.
- Contrastes verificados (AA):

  | Combinación | Contraste |
  |---|---|
  | `ink-900` sobre `canvas` | 14:1 |
  | `ink-500` sobre `sand-100` | 5.0:1 |
  | blanco sobre `teal-600` | 5.5:1 |
  | `teal-400` sobre `ink-900` | 5.7:1 |
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

## 7. Iconografía e imagen

- Íconos de [Lucide](https://lucide.dev) con trazo de 1.75 y tamaño 20–24 px. Dentro de un círculo `teal-50` de 48 px cuando acompañan a una card.
- Las fotos son reales del cliente, sin bancos genéricos, con radio `radius-card` y proporciones 4:3 en móvil y 4:5 desde `sm` (hero), 4:3 (cards) y 16:9 (banners).
- Mientras no lleguen las fotos se usan ilustraciones de marca (degradado mar y arena, sol dorado), nunca cajas grises.

## 8. Movimiento

Hover a 150 ms, entradas a 250 ms, curva `ease-out`. Se respeta `prefers-reduced-motion`. Nada parpadea ni rebota.

## 9. Panel de gestión

- Fondo `canvas`. Sidebar blanca de 264 px con borde `line`. Topbar de 64 px.
- Ítem de navegación: 40 px de alto, ícono de 20 px, radio 12 px. El activo va en `teal-50` con texto `teal-700`. Los módulos futuros aparecen atenuados con la etiqueta "Pronto".
- Contenido con `p-6` y `lg:p-10`, ancho máximo `max-w-6xl`.
- Encabezado de página: título `display-md`, descripción `ink-500` y acciones a la derecha, con 32 px antes del contenido.
- Pantallas de acceso: en `lg` se divide la pantalla, con un panel de marca `ink-900` a la izquierda y el formulario sobre `canvas` a la derecha. En móvil, solo el formulario con el logo.
