# Conexión Caribe – Levantamiento de requerimientos

Resultado de la entrevista del 2026-10-17. Complementa a `Conexión Caribe – Plan de desarrollo web y plataforma.md` (en adelante, "el documento base"). Cuando hay diferencia entre ambos, **manda este archivo**.

## 1. Contexto del proyecto

| Tema | Decisión |
|---|---|
| Relación | Desarrollo para un cliente (dueño de Conexión Caribe). El desarrollador mantiene la plataforma después de la entrega (hosting, actualizaciones y siguientes fases). |
| Fecha objetivo | Sin fecha fija: prima la calidad. |
| Alcance de la primera entrega | MVP completo de la Fase 1, **ampliado** (ver sección 3). |
| Empresa | Constituida en RD (sirve para verificar en Meta). |
| Dominio / web | No existe todavía. |
| Meta Business Manager | No existe todavía. |
| WhatsApp +1 829-631-3468 | Se usa hoy en la app de **WhatsApp Business**. |
| Equipo que usará el panel | 1 a 2 personas (cada una tendrá varios roles). |
| Volumen actual | Menos de 10 solicitudes por semana. |
| Mercados | EE. UU. y Canadá, Latinoamérica, Europa y dominicanos (todos). |
| Material listo | Logo y marca, fotos y videos propios, lista de servicios y precios. |
| Material pendiente | Textos legales (privacidad, términos y cancelación). |

## 2. Modelo de negocio confirmado

- **Inventario de terceros:** las propiedades son de propietarios externos (gestionadas en las apps de Airbnb y Booking, sin channel manager). Excursiones, transporte y servicios extra son subcontratados.
- **Sin flota propia:** en traslados y rent a car, el proveedor pone el vehículo. **No hace falta un calendario por unidad**; basta con controlar el servicio y el proveedor asignado.
- **Confirmación mixta:**
  - **Inmediata** (reserva y pago en la web): traslados de aeropuerto y alojamientos.
  - **Por cotización** (pasa por un agente): excursiones, servicios adicionales, paquetes, corporativos y agencias.
- **Cobro:** anticipo del **30 %** para confirmar. Hoy cobran por transferencia, efectivo, PayPal o enlaces, y tarjeta. El saldo se sigue cobrando por esas vías y se registra en el panel.
- **Pagos en línea en el MVP:** cuenta **PayPal Business registrada en RD**.
  - Checkout en la web para traslados y alojamientos.
  - Enlaces de pago PayPal generados desde el panel para las propuestas cotizadas.
  - La pasarela local (Azul o CardNET) queda para la Fase 3.
- **Fuera de horario:** responde solo el bot. Toma los datos y avisa que un agente contestará en horario laboral.

## 3. Cambios respecto al documento base

| # | Documento base | Decisión |
|---|---|---|
| 1 | Pagos en Fase 3 | **Pagos con PayPal en el MVP**: checkout web y enlaces de pago desde el panel. |
| 2 | Sincronización iCal en Fase 2 | **iCal en el MVP** (cada 30 a 60 min) para permitir reserva inmediata de alojamientos. |
| 3 | Todo por cotización en Fase 1 | **Reserva inmediata en la web** para traslados y alojamientos. |
| 4 | Bandeja de WhatsApp compartida en el panel | **Sin bandeja propia.** Se mantiene la app de WhatsApp Business en **coexistencia** con la Cloud API: el bot atiende, el humano responde desde el móvil y el panel registra toda la conversación. El bot se pausa cuando el humano responde. La coexistencia se conecta **a través de un BSP** (Solution Partner), porque Meta solo la permite a partners. |
| 5 | Chatbot guiado en Fase 1 e IA en Fase 2 | **Chatbot híbrido en el MVP:** el flujo guiado con botones es la base, y la IA solo interpreta texto libre y completa campos. Nunca inventa precios ni disponibilidad. |
| 6 | Calendario por unidad de vehículo | **Eliminado.** Se gestionan tarifas por ruta y tipo de vehículo, y el proveedor asignado por servicio. |
| 7 | Hosting en Vercel y servicios gestionados | **VPS propio con Docker** (web, BD, workers y colas) con presupuesto **menor de USD 50 al mes** para todos los servicios. |
| 8 | Traducciones a cargo del negocio | **Traducción con IA desde el panel**, revisada por una persona antes de publicar. |
| 9 | Diseño en Figma a partir del prototipo | **Mejorar el prototipo directamente en código** (sin Figma). |

Se mantiene el stack del documento base: Next.js + TypeScript + PostgreSQL + Prisma + Tailwind. Si la API va en rutas de Next.js o en NestJS se decide en el plan.

Los cuatro públicos están en el MVP:
- Turista individual: flujo completo.
- Grupos corporativos, agencias B2B y propietarios: formularios que crean leads tipados, más el flujo de revisión.
- Los portales de agencias y propietarios siguen en la Fase 3.

## 4. Riesgos y bloqueos

1. **No hay política de cancelación ni reembolso.** Cobrar en línea sin ella expone a disputas de PayPal. **Bloquea la salida a producción de los pagos.** El cliente debe definirla; un abogado debe redactarla junto con privacidad y términos (Ley 172-13 y RGPD).
2. **Doble reserva por el retraso del iCal.** Con pago inmediato, una reserva hecha en Airbnb entre dos sincronizaciones puede chocar. Hay que definir mitigaciones en el plan:
   - releer el iCal en el momento del checkout;
   - márgenes entre reservas;
   - qué se hace ante un conflicto (reubicar o reembolsar).
3. **Precio de los alojamientos de terceros.** El iCal no trae precios. El precio por noche y por temporada se carga en el panel, y hay que acordar con cada propietario cómo se mantiene actualizado.
4. **Meta Business:** hay que crearlo y verificarlo, registrar el número por coexistencia y aprobar las plantillas. Es ruta crítica para el chatbot y tarda días o semanas.
5. **Alcance mayor que la Fase 1 original** (pagos, iCal, IA y checkout web) con un solo desarrollador. La estimación de 6 a 8 semanas del documento base ya no aplica: se recalcula en el plan.
6. **Presupuesto menor de USD 50 al mes:** obliga a usar VPS y planes gratuitos (correo, monitoreo, tipos de cambio). Además hay que estimar el costo de las plantillas de WhatsApp y de la IA con el volumen actual.

## 5. Verificaciones técnicas pendientes (antes o durante el plan)

Resultados en PLAN.md, sección 1.

- [x] Coexistencia de WhatsApp: solo a través de un Solution Partner o Tech Provider. Se decidió usar un BSP. Falta elegir cuál.
- [x] PayPal Business en RD: puede recibir pagos y retirar a un banco local. Falta confirmar con PayPal la moneda de retiro y las comisiones.
- [x] iCal: Airbnb importa calendarios externos cada ~3 h, lo que abre una ventana de doble reserva (mitigaciones en PLAN.md 4.2).
- [x] Tipos de cambio: open.er-api.com (gratis, diario, con DOP/COP/EUR/CAD; exige atribución).
- [x] IA: costo estimado en PLAN.md sección 7. Falta decidir el modelo.
- [ ] Proveedor de VPS: se elige al contratar (los precios de Hetzner subieron en 2026). Los backups van a Cloudflare R2.

## 6. Información pendiente

**Del desarrollador:**
- [ ] Archivo HTML del prototipo dentro de esta carpeta. El enlace del documento base no se puede abrir desde esta cuenta.

**Del cliente:**
- [ ] Nombre de dominio deseado.
- [ ] Cantidades iniciales del catálogo: propiedades, excursiones, rutas de traslado, servicios extra, productos del supermercado y proveedores.
- [x] Logo y catálogo visual en PDF, recibidos el 2026-10-23 y guardados en `docs/brand/originales/`. Falta el logo en vector (SVG o PNG transparente).
- [ ] Fotos y videos en alta resolución (las del PDF son ilustrativas y pequeñas), y la lista de servicios con precios.
- [ ] Política de cancelación y reembolso, y textos legales. El PDF trae un **borrador con los porcentajes en blanco**, marcado "para revisión comercial y legal antes de publicar": no se publica hasta tener los valores y la revisión legal.
- [ ] Horario de atención (para los mensajes del bot fuera de horario).
- [ ] Reglas de los traslados con reserva inmediata: antelación mínima, recargo nocturno, equipaje, número de vuelo obligatorio y cómo se avisa al proveedor.
- [ ] Reglas de los alojamientos con reserva inmediata: estancia mínima, limpieza, depósito, check-in y check-out.
- [ ] Cómo se notifica hoy a los proveedores (WhatsApp, llamada o correo).
- [ ] Consentimiento de cada propietario para publicar su propiedad.
