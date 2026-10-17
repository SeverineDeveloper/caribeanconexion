# Conexión Caribe – Plan de desarrollo web y plataforma

Documento técnico y de negocio para el desarrollador · Versión 1.0 · Prototipo visual de referencia: https://claude.ai/artifact/CDDKbBSmcYstDnfXggP4Fj

## 1. Entender el negocio

**Conexión Caribe** es una empresa de turismo y concierge local en República Dominicana (Punta Cana, Bávaro, Bayahíbe, Higüey, La Romana). Su promesa es: *"Tú compras el vuelo. Nosotros organizamos todo lo demás."* Eslogan secundario: *"Tu viaje. Nuestra conexión."*

El cliente (turista de cualquier país, empresas, agencias) llega a la web o a WhatsApp, cuenta qué necesita y el equipo le arma una propuesta con alojamiento, traslados, excursiones y servicios extra. Todo queda organizado en un solo lugar.

**Lo importante para el desarrollador:**

- No es un buscador de hoteles tipo Booking. Es una **plataforma de propuestas y coordinación**: el cliente elige o describe, el equipo confirma disponibilidad y precio, y el sistema gestiona todo el ciclo.
- El **WhatsApp (+1 829-631-3468)** es el canal comercial principal. La web alimenta WhatsApp y WhatsApp alimenta el panel.
- El negocio opera con **proveedores externos** (hoteles, propietarios de apartamentos y villas, lanchas, buggies, chefs, masajistas). El sistema debe ayudar a coordinarlos.
- Hay **cuatro públicos**: turista individual (parejas, familias, amigos), grupos corporativos, agencias internacionales (B2B) y propietarios que quieren listar su propiedad.
- Los precios son **referenciales** y varían por fecha, disponibilidad, temporada y cantidad de pasajeros. Nunca se promete un precio final sin confirmación del equipo, salvo que el administrador lo habilite.

## 2. Objetivos del sistema

1. Captar viajeros y leads de todo el mundo con una web multilingüe, rápida y bien posicionada en Google.
2. Automatizar el primer contacto y la toma de datos (onboarding) por WhatsApp con un chatbot, con traspaso a una persona cuando haga falta.
3. Dar al equipo un **panel de gestión** para ver, cotizar, confirmar y operar los paquetes de cada cliente.
4. Tener un **catálogo de servicios administrable** (alojamientos, vehículos, excursiones, extras) que se publique en la web sin tocar código.
5. Mostrar alojamientos tipo Airbnb con disponibilidad actualizada, de forma legal y estable (ver sección 7).
6. Ofrecer al cliente un espacio **"Mi viaje"** con su itinerario confirmado.

## 3. Roles de usuario

- **Visitante / cliente:** navega, arma su viaje, chatea por WhatsApp, ve "Mi viaje" con enlace seguro.
- **Administrador:** acceso total, usuarios, catálogo, precios, configuración, reportes.
- **Agente de ventas:** gestiona leads, cotiza, envía propuestas, confirma reservas.
- **Operaciones:** ve itinerarios confirmados, asigna proveedores y vehículos, marca servicios como realizados.
- **Proveedor / propietario** (fase 3): accede a un portal limitado para su inventario y reservas.
- **Agencia aliada B2B** (fase 3): cuenta con tarifas netas y solicitudes de cotización.

## 4. Arquitectura y tecnología recomendada

El desarrollador puede proponer alternativas equivalentes, pero estas son las recomendaciones:

- **Frontend web:** Next.js (React) con TypeScript, renderizado en servidor (SSR/SSG) para SEO. Tailwind CSS o CSS modules. Debe respetar la identidad visual del prototipo.
- **Backend/API:** Node.js con NestJS o rutas API de Next.js. API REST documentada (OpenAPI).
- **Base de datos:** PostgreSQL administrado (Supabase, Neon o RDS) con Prisma como ORM.
- **Autenticación del panel:** Auth.js, Supabase Auth o similar, con roles y 2FA para administradores.
- **Almacenamiento de imágenes:** Cloudinary o S3 + CDN, con redimensionado y formato WebP/AVIF automático.
- **Colas y tareas programadas:** Redis (BullMQ) o cron gestionado, para mensajes de WhatsApp, sincronización de calendarios y recordatorios.
- **WhatsApp:** WhatsApp Business Platform (Cloud API de Meta), ver sección 8.
- **Correo transaccional:** Resend, Postmark o SendGrid.
- **Pagos (fase 3):** Stripe y/o pasarela local dominicana (por ejemplo Azul o CardNET); enlaces de pago por WhatsApp.
- **Hosting:** Vercel o similar para la web; contenedor o servicio administrado para workers; dominio propio con HTTPS.
- **Monitoreo:** Sentry, logs centralizados, backups diarios de la base de datos.
- **Idiomas:** next-intl o i18next. Español, inglés y francés desde el inicio; portugués, italiano y alemán deben poder añadirse solo agregando archivos de traducción y sin cambiar código.

## 5. Web pública

El prototipo HTML es la **referencia de diseño, estructura y textos**. Hay que reconstruirlo sobre la plataforma real y conectarlo a datos dinámicos.

**Identidad visual:** turquesa Caribe (#0FB5B0), azul profundo (#0A2A4A), blanco, beige arena (#F3E7D3), verde palma (#2F6B4F) y dorado (#C9A227) como acento. Debe transmitir confianza, organización, vacaciones y profesionalismo. Tipografías del prototipo: Fraunces (títulos) y DM Sans (texto).

**Estructura y páginas:**

- Inicio (hero con "Tú compras el vuelo...", botones ARMA MI VIAJE y WhatsApp).
- Alojamiento: listado y ficha por apartamento, hotel o villa.
- Traslados.
- Excursiones: listado y ficha por excursión (Saona, Buggies, Catalina, Higüey, Catamaranes, Yates, Santo Domingo).
- Paquetes: Pareja Caribe, Familia Punta Cana, Amigos & Aventura, Cumpleaños Caribe, Escapada Económica, Experiencia Premium.
- Servicios adicionales: supermercado, rent a car, masajes, chef, decoración, fotografía.
- Grupos corporativos, Agencias (B2B), Propietarios.
- Arma tu viaje, Mi viaje, Confianza (testimonios, FAQ, políticas), Contacto.
- Páginas legales: privacidad, términos, cancelación.

**Funciones globales:**

- Menú fijo, selector de idioma, selector de moneda (USD, DOP, COP, EUR, CAD) y botón flotante de WhatsApp "Habla con nosotros".
- **Monedas:** precios base en USD; conversión con tipos de cambio obtenidos de una API (actualización diaria) y con un margen configurable en el panel. Aclarar siempre que el precio puede variar por fecha, disponibilidad, temporada y cantidad de pasajeros.
- **Mensajes de WhatsApp preconfigurados** por botón y por ficha (por ejemplo: "Hola Conexión Caribe. Estoy interesado en la excursión a Isla Saona para 4 personas").
- **Accesibilidad y rendimiento:** responsive, contraste adecuado, navegación por teclado, Core Web Vitals en verde.

**SEO:**

- URLs limpias por idioma (/es, /en, /fr), etiquetas hreflang, sitemap.xml, robots.txt, datos estructurados (TravelAgency, Product/Offer, FAQPage, LocalBusiness), metadatos únicos por página.
- Palabras clave a trabajar en contenido y títulos: Punta Cana apartments, vacation rentals, airport transfer, excursions, Saona Island tours, buggies, concierge, Airbnb services, private transportation, villa rental, corporate travel, Dominican Republic vacation packages, y sus equivalentes en español y francés (apartamentos Punta Cana, traslado aeropuerto Punta Cana, excursiones Punta Cana, isla Saona desde Punta Cana, viajes corporativos República Dominicana).
- Cada excursión, alojamiento y servicio tiene su propia página indexable.

## 6. Panel de gestión: catálogo de servicios

Todo lo que se muestra en la web debe salir del catálogo. El equipo debe poder crear, editar, pausar y borrar elementos sin programador.

**Campos comunes a cualquier elemento del catálogo:**

- Nombre, descripción corta y larga (por idioma: ES, EN, FR y preparado para más).
- Categoría, etiquetas, zona geográfica, estado (borrador, publicado, pausado).
- Galería de fotos con orden y foto principal; video opcional.
- Qué incluye y qué no incluye; duración; punto de salida; capacidad mínima y máxima; edad mínima.
- Precio base en USD, con reglas: por persona, por vehículo, por noche o por paquete; precio de niños; temporadas (alta, media, baja); precios especiales por fechas.
- Regla de confirmación: *consulta* (siempre se confirma con el equipo) o *inmediata* (si el administrador lo habilita).
- Proveedor asociado y costo interno (invisible al público) para calcular margen.
- Campos SEO: título, descripción y URL por idioma.
- Botón "Vista previa en la web".

**Tipos de elementos:**

1. **Alojamientos** (apartamento, hotel, villa): dirección aproximada, zona (Bávaro, Los Corales, El Cortecito, Punta Cana, Cap Cana, Cabeza de Toro), habitaciones, baños, huéspedes, amenidades, reglas, ubicación en mapa, enlace al anuncio externo y calendario de disponibilidad (ver sección 7).
2. **Traslados:** rutas con origen, destino y tipo de vehículo; tarifa por ruta y por vehículo; recargos nocturnos; tarifas de grupos con autobús.
3. **Vehículos (flota y rent a car):** categoría (económico, SUV, familiar, 7 pasajeros, premium, minibús, autobús), marca y modelo, año, capacidad de personas y maletas, transmisión, fotos, tarifa diaria y semanal, depósito, seguro, entrega en aeropuerto, hotel o apartamento, y **calendario de disponibilidad por unidad** para evitar dobles reservas.
4. **Excursiones y experiencias:** Saona, Buggies, Catalina, Higüey, Catamaranes, Yates, Santo Domingo y las que se agreguen; días de operación, horarios, punto de encuentro y modalidad (compartida o privada).
5. **Servicios adicionales:** supermercado (con **catálogo de productos y precios** para armar la compra), masajes, chef privado, decoración, fotografía y video, con sus variantes.
6. **Paquetes plantilla:** combinación de elementos del catálogo con precio sugerido, que luego se personalizan por cliente.

**Funciones del panel de catálogo:** duplicar elemento, importar y exportar en CSV, historial de cambios, reglas de precios por temporada, carga masiva de fotos y control por roles (solo administrador cambia precios).

## 7. Alojamientos tipo Airbnb: cómo conectarlos

**Advertencia técnica importante:** Airbnb **no ofrece una API pública abierta** para que terceros lean sus anuncios. Su API está limitada a socios autorizados. **No se debe hacer scraping** del sitio de Airbnb, porque viola sus términos y puede causar bloqueos o problemas legales. El desarrollador debe verificar el estado actual de estas opciones antes de empezar.

**Estrategia recomendada (de menor a mayor complejidad):**

1. **Fichas propias + enlace al anuncio (fase 1).** Cada propiedad se registra en el catálogo con sus fotos, descripción y amenidades, y un campo para el enlace de Airbnb/Booking. La web muestra la ficha propia y el botón "Solicitar disponibilidad" lleva al flujo de Conexión Caribe. Es la opción más segura.
2. **Sincronización por iCal (fase 2).** Airbnb permite que cada anfitrión exporte un enlace de calendario iCal. El propietario pega esa URL en el panel (o la carga el equipo). Un proceso programado la lee cada 30 a 60 minutos y marca como no disponibles las fechas ocupadas. Esto muestra disponibilidad real sin API privada. Limitaciones: no trae precios ni datos de reserva, y puede tener retraso.
3. **Channel manager o PMS (fase 3, opcional).** Si los propietarios usan Hostaway, Guesty, Hospitable, Lodgify o Smoobu, se integra su API oficial para leer disponibilidad, tarifas y, en algunos casos, crear reservas. Es la vía profesional para volumen.
4. **Aliado oficial de Airbnb:** solo si el negocio decide aplicar como socio; es un proceso comercial aparte.

**Reglas de negocio:**

- Evitar dobles reservas: al confirmar un paquete con alojamiento, se bloquean las fechas en el calendario propio.
- Los propietarios deben aceptar que se publique su propiedad (consentimiento guardado en el sistema).
- Se debe poder mostrar la propiedad en un **mapa** con una ubicación aproximada, no exacta, por seguridad.

## 8. Chatbot de WhatsApp (onboarding del cliente)

**Tecnología:** WhatsApp Business Platform, Cloud API de Meta, con webhook propio. El número +1 829-631-3468 debe registrarse en la plataforma; si hoy se usa en la app de WhatsApp Business, el desarrollador debe verificar el procedimiento de migración o coexistencia vigente para no perder el historial ni dejar de recibir mensajes. Se requiere verificación del negocio en Meta Business.

**Reglas de la plataforma a tener en cuenta:**

- Fuera de la ventana de 24 horas desde el último mensaje del cliente, solo se pueden enviar **plantillas aprobadas** por Meta. Hay que diseñar y enviar a aprobar las plantillas con anticipación (bienvenida, propuesta lista, recordatorio, confirmación, encuesta).
- Se debe registrar el consentimiento (opt-in) y respetar el opt-out ("STOP").
- Los mensajes con botones y listas interactivas mejoran la conversión y reducen los errores.

**Flujo de onboarding (máquina de estados):**

1. **Saludo y idioma.** Detectar idioma (ES/EN/FR) por el primer mensaje o preguntarlo con botones.
2. **Propósito.** Botones: Armar mi viaje · Solo traslado · Excursión · Soy agencia/empresa · Soy propietario · Hablar con una persona.
3. **Datos del viaje.** Nombre, país, fechas de llegada y salida, adultos y niños, presupuesto aproximado, tipo de alojamiento y servicios de interés (lista interactiva con los servicios del catálogo).
4. **Detalles según servicio.** Por ejemplo: número de vuelo para el traslado, hotel o dirección, preferencias alimentarias para la compra del supermercado.
5. **Resumen y confirmación.** El bot muestra lo recopilado y pregunta si es correcto.
6. **Creación de lead y paquete borrador** en el panel, con todo el historial de la conversación.
7. **Traspaso a un agente.** Notificación inmediata al agente (panel, correo y/o WhatsApp interno). El agente continúa la conversación desde el panel (bandeja de entrada compartida) o desde su app, y el bot se pausa en esa conversación.
8. **Seguimiento automático:** recordatorios si el cliente no responde, envío de la propuesta con enlace a "Mi viaje", y mensajes previos a la llegada (instrucciones del traslado, recordatorio de la compra).

**Casos especiales:** el bot debe reconocer cuando el cliente escribe texto libre y enrutar al agente; si no entiende dos veces seguidas, ofrecer hablar con una persona; ante quejas o urgencias, escalar de inmediato.

**IA opcional (fase 2):** una capa de modelo de lenguaje puede interpretar mensajes libres y completar campos, siempre con reglas estrictas: no inventar precios ni disponibilidad, usar solo datos del catálogo y entregar al humano ante dudas. Todas las respuestas sobre precios deben decir que son referenciales hasta la confirmación.

**Integración con la web:** los botones de WhatsApp de la web envían un mensaje con un **código de origen** (por ejemplo, ficha de Isla Saona) para que el bot y el agente sepan qué le interesó al cliente. El formulario "Arma tu viaje" crea el lead en el sistema y además abre o envía el mensaje de WhatsApp.

## 9. Panel de gestión de paquetes y reservas

**Embudo (pipeline) de cada solicitud:** Nuevo lead → En cotización → Propuesta enviada → Confirmado → Pagado (anticipo o total) → En curso → Completado. Estados alternos: Perdido y Cancelado.

**Pantallas del panel:**

- **Dashboard:** leads nuevos, propuestas pendientes, llegadas de la semana, ingresos estimados y conversión por canal.
- **Bandeja de WhatsApp:** conversaciones, etiquetas, asignación a agentes, respuestas rápidas y notas internas.
- **Leads y clientes (CRM):** ficha con datos, historial, viajes anteriores, notas y país.
- **Constructor de paquetes:** el agente agrega al viaje elementos del catálogo (alojamiento, traslados, excursiones, extras) con fechas y cantidades. El sistema calcula el total en USD y en la moneda del cliente, muestra costo y margen (solo roles internos) y permite aplicar descuentos.
- **Propuesta:** genera una propuesta en PDF y una página web privada con foto y descripción de cada servicio, que se envía por WhatsApp y correo. El cliente puede **aceptar o pedir cambios** desde ahí.
- **Itinerario día por día:** vista tipo línea de tiempo (como el ejemplo "Mi viaje" del prototipo: Día 1 llegada PUJ, transfer, apartamento, supermercado; Día 2 masaje; Día 3 Saona; etc.).
- **Operaciones:** agenda diaria de servicios, asignación de vehículo y conductor, proveedor, guía, estado de cada servicio y confirmación enviada al proveedor.
- **Calendarios:** disponibilidad de alojamientos y de cada vehículo con detección de conflictos.
- **Pagos:** registro de anticipos y saldos, enlaces de pago, recibos y estado.
- **Reportes:** ventas por servicio, por canal, por agente, por país y por proveedor.
- **Configuración:** usuarios y roles, plantillas de mensajes, tipos de cambio y márgenes, políticas de cancelación, textos legales.

**"Mi viaje" para el cliente:** enlace seguro (token único, sin necesidad de contraseña) que muestra el itinerario confirmado, datos del traslado, contactos de emergencia, documentos y botón de WhatsApp. Debe verse bien en el móvil y estar en el idioma del cliente.

**Notificaciones:** al agente por cada lead nuevo; al cliente por cada cambio; al proveedor cuando se le asigna un servicio; recordatorios 48 y 24 horas antes de cada servicio.

## 10. Módulos B2B, corporativo y propietarios

- **Grupos corporativos:** formulario de solicitud de propuesta con tamaño del grupo, fechas, presupuesto, tipo de evento y servicios (team building, cenas, reconocimiento, autobuses, etc.). Crea un lead de tipo corporativo con su propio flujo de cotización y propuesta multi-día.
- **Agencias aliadas:** formulario "Quiero ser aliado", aprobación manual, portal con tarifas netas, solicitud de cotizaciones y reservas, y comisiones o márgenes definidos por agencia.
- **Propietarios:** formulario "Publicar mi propiedad" que alimenta una lista de propiedades pendientes de revisión; el equipo valida, completa la ficha y la publica. En fase 3, portal del propietario con su calendario y sus reservas.

## 11. Modelo de datos (resumen)

Tablas principales, que el desarrollador puede ampliar:

- **users** (rol, idioma, estado) y **agents**.
- **customers** (nombre, país, WhatsApp, correo, idioma, origen, consentimiento).
- **leads** (cliente, fuente, tipo: turista, corporativo, agencia, propietario; estado, agente asignado).
- **conversations** y **messages** (canal, dirección, contenido, plantilla usada, estado de entrega).
- **catalog\_items** (tipo, estado, categoría, proveedor, capacidad, reglas de precio) con **catalog\_translations** (item, idioma, nombre, descripción, SEO) y **media**.
- **price\_rules** (item, temporada, rango de fechas, tipo de cobro, precio, moneda base).
- **properties** (alojamientos), **property\_calendars** (enlace iCal, última sincronización) y **availability\_blocks**.
- **vehicles**, **vehicle\_bookings** y **drivers**.
- **suppliers** (proveedores y propietarios) y **supplier\_contacts**.
- **packages** (plantillas) y **trips** (viaje de un cliente), con **trip\_items** (elemento del catálogo, fecha, cantidad, precio, costo, estado, proveedor asignado).
- **proposals** (versión, enlace, aceptado o rechazado).
- **payments** (monto, moneda, método, estado).
- **agencies** y **agency\_rates**.
- **exchange\_rates** y **settings**.
- **audit\_log** (quién cambió qué y cuándo).

## 12. Seguridad, privacidad y cumplimiento

- HTTPS en todo el sitio, contraseñas con hash seguro, 2FA para administradores, permisos por rol y registro de auditoría.
- Datos personales mínimos y cifrado de datos sensibles. Los pagos se procesan solo con la pasarela, sin guardar tarjetas en el sistema.
- Aviso de privacidad y banner de cookies. Atender el RGPD para clientes europeos y la normativa dominicana de protección de datos personales (Ley 172-13); el desarrollador y el negocio deben validar los requisitos vigentes con un asesor legal.
- Consentimiento explícito para mensajes por WhatsApp y opción de baja.
- Protección contra spam y bots en formularios, límites de peticiones y validación de entradas.
- Copias de seguridad automáticas diarias y plan de recuperación.

## 13. Fases y cronograma estimado

Los tiempos son una estimación para un equipo pequeño (1 a 2 desarrolladores y un diseñador a medio tiempo) y deben ajustarse tras el análisis detallado.

**Fase 0 · Preparación (1 a 2 semanas):** dominio, cuentas de Meta Business, WhatsApp Cloud API, hosting, repositorio, entorno de pruebas, definición final del stack, textos y fotos del negocio, diseño de la identidad en Figma a partir del prototipo.

**Fase 1 · MVP (6 a 8 semanas):**

- Web pública multilingüe (ES, EN, FR) con páginas dinámicas desde el catálogo.
- Selector de monedas y SEO técnico.
- Panel con login, roles y **catálogo de servicios completo** (alojamientos con ficha propia, vehículos, excursiones y extras).
- Formulario "Arma tu viaje" que crea leads y notifica al equipo.
- Chatbot de WhatsApp básico: onboarding guiado, creación de lead, traspaso a agente y bandeja de entrada simple.
- Constructor de paquetes y propuesta en PDF.

**Fase 2 · Operación y automatización (4 a 6 semanas):**

- Pipeline completo, "Mi viaje" para el cliente y página de propuesta con aceptación.
- Sincronización de calendarios iCal de propiedades y calendario de vehículos.
- Módulo de operaciones y asignación de proveedores.
- Recordatorios y plantillas automáticas de WhatsApp.
- Capa de IA opcional para el chatbot.

**Fase 3 · Crecimiento (4 a 8 semanas):**

- Pagos en línea, portal de propietarios y portal de agencias B2B.
- Integración con channel manager (Hostaway, Guesty u otro).
- Reportes avanzados, reseñas, portugués, italiano y alemán.

## 14. Criterios de aceptación del MVP

- Un administrador puede publicar un vehículo y una excursión nuevos, con fotos, precios y traducciones, y verlos en la web en menos de un minuto.
- Un cliente puede escribir al WhatsApp, completar el onboarding y ver su lead creado en el panel con todos los datos.
- Un agente puede armar un paquete con alojamiento, traslado y excursión, ver el total en USD y en otra moneda, y enviar la propuesta.
- La web funciona en móvil, tablet y escritorio, con puntuación de rendimiento alta en Lighthouse y sin errores de accesibilidad graves.
- El cambio de idioma y de moneda funciona en todas las páginas.
- Ningún precio se muestra sin la aclaración de que es referencial.
- Existen copias de seguridad, registro de errores y manual básico para el equipo.

## 15. Qué debe entregar el negocio al desarrollador

- Logo y archivos de marca, y fotos y videos propios en alta calidad.
- Lista real de servicios, precios, temporadas y condiciones.
- Datos de proveedores, propiedades y vehículos para la carga inicial del catálogo.
- Políticas de cancelación, términos y política de privacidad redactados o revisados por un abogado.
- Textos finales en español, y revisión de las traducciones al inglés y al francés.
- Acceso a las cuentas de Meta Business, dominio, correo y redes sociales (Instagram, Facebook, TikTok y YouTube).
- Definición de métodos de pago aceptados y datos para la pasarela.

## 16. Preguntas abiertas para decidir con el negocio

1. ¿El cliente podrá reservar y pagar de forma inmediata en algunos servicios, o todo pasa por cotización?
2. ¿Qué porcentaje de anticipo se cobrará y cuál es la política de reembolso?
3. ¿Los propietarios usan un channel manager o solo la app de Airbnb?
4. ¿Cuántos agentes usarán el panel y quién atenderá WhatsApp fuera de horario?
5. ¿Se quiere un chatbot con IA desde el inicio o primero uno de flujo guiado?
6. ¿Qué proveedores de pago se prefieren y en qué monedas se cobrará?
7. ¿La empresa está constituida y tiene los documentos para verificar el negocio en Meta?

## 17. Cómo usar el prototipo

El archivo HTML del prototipo contiene la estructura, los textos, la paleta, los tipos de letra y el flujo del formulario. Úsalo como guía visual y de contenido. Las ilustraciones de colores son marcadores de posición: deben sustituirse por fotografías reales del Caribe dominicano (Punta Cana, Bávaro, Bayahíbe, Isla Saona, Playa Macao, apartamentos, villas, catamaranes, buggies, parejas, familias, grupos y equipos corporativos). Los precios y tipos de cambio del prototipo son de ejemplo.
