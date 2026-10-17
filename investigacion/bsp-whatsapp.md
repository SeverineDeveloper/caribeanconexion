# Comparativa de BSP de WhatsApp con coexistencia

Investigación del 2026-10-17 para la tarea 9 de [PLAN.md](../PLAN.md) §6 («Comparar 2 o 3 BSP con coexistencia y elegir uno»). Contexto: Conexión Caribe usa el número +1 829-631-3468 en la app WhatsApp Business y quiere seguir respondiendo desde el móvil mientras el bot (en nuestro VPS) hace el onboarding. Presupuesto total de servicios < USD 50/mes y < 10 solicitudes por semana.

**Cómo leer este documento.** Todo lo que sigue sale de páginas oficiales de cada proveedor y de Meta, leídas el 2026-10-17. Lo que no pude confirmar en una fuente oficial va marcado con **(por verificar)**. Las páginas de precios y de documentación cambian a menudo, así que las cifras son las de esa fecha.

## 1. Recomendación en breve

1. **Elegir YCloud (plan Free, USD 0/mes) como primera opción**, condicionado a una prueba corta de validación (sección 6) que se haga **antes de escribir el adaptador**.
2. **Respaldo, en este orden:** Kapso Free (API compatible con Meta) → Telnyx pago por uso → Dualhook (USD 12/mes) → 360dialog (EUR 49/mes por número, solo si se sube el presupuesto).
3. **Descartar Twilio** (no documenta coexistencia; su soporte indica borrar la cuenta de WhatsApp para usar el número) y **no empezar con Gupshup** (coexistencia en beta cerrada y con fallos conocidos de Meta justo en los *echoes*).
4. **Hallazgo que toca el presupuesto:** desde el 1 de octubre de 2026 Meta cobra los mensajes de servicio (respuestas libres dentro de las 24 h) después de los primeros 1.000 por número al mes, y las plantillas *utility* dentro de la ventana también dejan de ser gratis. Con el volumen actual el costo sigue siendo bajo, pero la frase del PLAN.md §7 («responder dentro de la ventana de 24 h no tiene costo») ya no es correcta. Detalle en la sección 5.

## 2. Tabla comparativa

Precios en USD salvo que se indique. «Echoes» = mensajes enviados desde la app que llegan al webhook (`smb_message_echoes` en Meta).

| | **YCloud** | **360dialog** | **Twilio** | **Gupshup** | **Telnyx** | **Kapso** | **Dualhook** |
|---|---|---|---|---|---|---|---|
| **Coexistencia** | Sí, documentada | Sí, documentada | **No documentada** | Sí, pero «closed beta» | Sí, documentada | Sí, documentada | Sí (documentación escasa) |
| **Cuota mensual** | **0** (plan Free). Pagos: 39 / 89 / 399 | **EUR 49 por número** (Regular); 99 / 500 en planes altos | 0 | 0 (sin suscripción) | 0 (sin cuota ni mínimo) | **0** (Free). Pro: 25 | **12** tras 14 días de prueba (con tarjeta) |
| **Recargo por mensaje sobre Meta** | 0 (anunciado «zero mark-up») | «Sin recargo» en la página de clientes, pero la tabla de socios cita 7 % en marketing por el endpoint estándar **(por verificar)** | 0,005 por mensaje, entrante o saliente | ≈ 0,001 por mensaje (cifra «desde»), más 6 % en marketing por Cloud API desde 2026-01-01 | 0,004 por mensaje | 0 sobre Meta; el plan limita a 2.000 mensajes al mes en Free | 0 |
| **¿La coexistencia entra en el plan gratis?** | **Por verificar.** La página de precios no la excluye. Free incluye 2 canales, API y webhooks. El add-on «Channels» (5/canal) dice «no disponible en Free». | No hay plan gratis | No aplica | No aplica (pago por uso) | No aplica (pago por uso) | La documentación no menciona restricción de plan **(por verificar)** | No hay plan gratis, solo prueba de 14 días |
| **Webhooks hacia nuestro servidor** | Sí, en todos los planes, incluido Free | Sí, formato Meta | Sí (formato propio de Twilio) | Sí, v3 reenvía eventos de Meta sin cambios | Sí (formato propio) | Sí (reenvío encadenado con firma) | Sí, **directo de Meta a nuestro servidor** |
| **Echoes de la app** | `whatsapp.smb.message.echoes`, **pero hay una contradicción en su documentación** (ver §3.1) | `smb_message_echoes` en el sobre estándar de Cloud API | No | `smb_message_echoes` reenviado, **con fallos conocidos de Meta** | `message.echo` (`origin: whatsapp_business_app`) | Evento propio `whatsapp.message.sent` **(por verificar)** | `smb_message_echoes` de Meta **(por verificar)** |
| **Botones, listas y plantillas por API** | Sí (botones y plantillas confirmados; lista **por verificar** en su OpenAPI) | Sí (es la Cloud API de Meta) | Sí, pero sin coexistencia | Sí | Sí (botones, listas y plantillas) | Sí (proxy compatible con Meta) | Sí (runtime «compatible con Graph») |
| **Tipo de API** | **Propia**, con cuerpo parecido al de Meta y sobre de webhook propio | **Cloud API de Meta «pass-through»**: `https://waba-v2.360dialog.io` + cabecera `D360-API-KEY` | Propia (Twilio Messaging) | Propia (API de Gupshup) **(por verificar)** | Propia (`whatsapp_message` dentro de `/messages`) | **Proxy compatible con Meta** (objetos de Meta por defecto) | Compatible con Graph; recibe webhooks de Meta en bruto |
| **República Dominicana (+1 829)** | No figura entre los países no soportados (solo Nigeria y Sudáfrica en su página; su blog de marzo 2026 añade otros, sin RD) | Sin lista de exclusiones en la documentación leída | No aplica | Excluye Nigeria y Sudáfrica; RD no figura | No indica países | No indica países | No indica países |
| **Verificación del negocio** | **Obligatoria** | Meta la exige (alternativas: verificación liderada por el socio o Meta Verified) | No aplica | Pide Facebook Business Manager y chats compartidos | Meta la exige | Meta la exige; coexistencia no la evita | Meta la exige (Embedded Signup) |
| **Soporte** | Docs y correo (lun–vie, UTC+8) en Free | 24/7 en Regular | No evaluado | Correo del equipo de socios | No evaluado | No evaluado | No evaluado |
| **Costo estimado con nuestro volumen (§5)** | **≈ 0** más tarifas Meta | **≈ 57–59** más tarifas Meta | ≈ 8 | ≈ 2 | ≈ 3–6 | 0 (si cabe en 2.000 mensajes) | 12 |
| **¿Cabe en el presupuesto?** | Sí | **No** (supera él solo el margen) | No es viable | Sí, pero con riesgo técnico | Sí | Sí | Solo con Haiku 5.5 (ver §5) |

## 3. Detalle por proveedor

### 3.1 YCloud — candidato principal

**Precio.** Free USD 0 «para siempre» (1 usuario, 2 canales, sin tarjeta); Growth 39; Pro 89; Enterprise 399 al mes. Todos incluyen «API & Webhooks». La tabla comparativa de la página de precios muestra con marca de verificación, en la columna Free, *Message API*, *Template API*, *Contact API* y *Webhooks*. Los cargos de WhatsApp se descuentan de un monedero prepagado «a la tarifa de WhatsApp» y se anuncia «Zero Mark-up» ([precios](https://www.ycloud.com/pricing)). La facturación de plantillas y servicio sigue las reglas de Meta ([billing rule](https://docs.ycloud.com/en/documentation/pricing-and-billing/billing-rule.md)).

**Coexistencia.** Se crea desde la consola: *WhatsApp accounts → Create Channel → WhatsApp Business APP Coexistence*, y se conecta con Facebook o con código QR. Requiere app Business ≥ 2.24.17 y **verificación del negocio**, y el nombre del negocio debe coincidir con el de los documentos legales. Sincroniza hasta 6 meses de historial. Los mensajes enviados desde la app son gratis. El caudal queda fijo en **5 mensajes por segundo** (Meta indica 20; el volumen del cliente no lo alcanza). YCloud no ofrece API para esta incorporación: se hace a mano en su consola ([guía de coexistencia](https://docs.ycloud.com/help-center/whatsapp-accounts-management/create-a-whatsapp-api-account/whatsapp-business-app-coexistence), [página de producto](https://www.ycloud.com/whatsapp-business-app-coexistence)). Su blog añade que hay que abrir la app al menos cada 13 días y que no se soporta Marketing Messages Lite ([blog, 2026-03-09](https://www.ycloud.com/blog/whatsapp-business-app-coexistence-meta-update)).

**Webhooks y echoes.** Usan un sobre propio (`id`, `type`, `apiVersion`, `createTime` y un objeto por tipo), con firma en la cabecera `YCloud-Signature` calculada sobre el cuerpo sin modificar, y reintentos ante respuestas que no sean 2xx ([configurar webhooks](https://docs.ycloud.com/en/api-reference/guides/api-fundamentals/configure-webhooks.md)). Los eventos de la lista incluyen `whatsapp.inbound_message.received` y `whatsapp.message.updated`. La referencia de eventos describe `whatsapp.smb.message.echoes` («mensaje enviado desde la app Business o un dispositivo compañero») con un objeto `whatsappMessage` (`wamid`, `status`, `from`, `to`, `wabaId`, …) ([eventos](https://docs.ycloud.com/reference/webhook-events-payloads), [ejemplos](https://docs.ycloud.com/reference/webhook-payload-examples)).

> **Contradicción a resolver con una prueba.** La guía «Configure webhooks» dice que los eventos `whatsapp.echo_message.created/updated` «no usan el contrato `whatsapp.smb.message.echoes`» y que solo se emiten para Agents creados por la API REST pública. No queda claro si, con un canal de coexistencia, el evento correcto es uno u otro, ni qué campos trae. **Esto decide si el bot puede pausarse cuando el humano responde**, que es un criterio de aceptación del MVP (PLAN.md §9). Hay que verlo con un mensaje real antes de comprometerse.

**Envío.** `POST /whatsapp/messages/sendDirectly` (síncrono) y `POST /whatsapp/messages` (en cola). Los ejemplos de su OpenAPI usan estructuras de Meta (`interactive`, `action.buttons`, `reply.id`); los botones de respuesta y las plantillas están confirmados. La lista interactiva no aparece en la parte del OpenAPI que pude leer (el archivo pesa unos 650 KB y solo leí el primer 15 %) **(por verificar)** ([OpenAPI v2](https://docs.ycloud.com/openapi/endpoints/ycloud-api-v2.yaml)).

**Países.** La página de producto lista como no soportados solo Nigeria y Sudáfrica; el blog de marzo de 2026 añade Australia, Japón, Filipinas, Rusia, Corea del Sur y Turquía, y marca como no soportados la UE y el Reino Unido, algo que otras fuentes ya dan por superado. **República Dominicana no figura en ninguna lista de exclusión.**

**Limitaciones conocidas.** Sin difusiones (broadcast) desde la app; sin edición ni borrado de mensajes; sin mensajes temporales, de una sola vista ni ubicación en vivo en chats 1 a 1; sin grupos, comunidades ni canales; sin llamadas; los medios de más de 14 días no se sincronizan; Meta puede desvincular la cuenta por inactividad. Soporte en horario de UTC+8 y solo por correo en el plan Free.

**Qué obliga al adaptador.** API y webhooks propios, así que `parseWebhook` traduce el sobre de YCloud a nuestro modelo. No es un pass-through, pero el cuerpo de envío se parece al de Meta y el trabajo es acotado.

### 3.2 360dialog — mejor ajuste técnico, fuera de presupuesto

**Precio.** Planes para clientes por número y mes: Marketplace EUR 99, **API Regular EUR 49**, Premium EUR 99, Scale EUR 500. La página dice «sin recargo sobre las tarifas de Meta» y no publica un plan gratis ni prueba ([precios](https://www.360dialog.com/pricing)). La tabla de socios menciona un 7 % de recargo en marketing enviado por el endpoint estándar, y otra fuente lo repite **(por verificar para clientes directos)** ([facturación](https://docs.360dialog.com/partner/get-started/pricing-and-billing)). **EUR 49 equivalen a unos USD 57–59 al mes, por sí solos más que el tope de USD 50 de todo el proyecto.**

**Coexistencia.** El cliente directo se auto-incorpora desde el Hub: *Add channel → «Yes, Business App» → Open Meta Signup → escanear QR*. Pide elegir con cuidado el Business Portfolio (no se puede cambiar después) y completar nombre legal, dirección y sitio web ([onboarding](https://docs.360dialog.com/docs/hub/embedded-signup/coexistence-onboarding), [resumen](https://docs.360dialog.com/docs/hub/embedded-signup/whatsapp-coexistence)). La documentación no lista países excluidos.

**Webhooks.** `smb_message_echoes` llega **con el sobre estándar de Cloud API** (`object`, `entry`, `changes`, `field: "smb_message_echoes"`, `message_echoes[]`). `history` y `smb_app_state_sync` usan un sobre distinto (`id`, `event`, `data`) ([webhooks de coexistencia](https://docs.360dialog.com/partner/waba-management/whatsapp-coexistence/coexistence-webhooks)).

**API.** Es la Cloud API de Meta: base `https://waba-v2.360dialog.io`, autenticación con `D360-API-KEY` y el mismo objeto de mensaje, con diferencias menores (por ejemplo, la subida de medios y `messaging_product`) ([integración](https://docs.360dialog.com/partner/integration/waba-integration)). Es el caso que menos trabajo da al adaptador.

**Limitaciones.** Sin insignia azul (alternativa: Meta Verified); sin API de llamadas; sin migración entre cuentas; la app debe abrirse cada 13 días; los dispositivos Windows y WearOS no generan echoes.

### 3.3 Twilio — descartado

- **Precio:** USD 0,005 por mensaje (entrante y saliente) sobre las tarifas de Meta, sin cuota mensual ([precios](https://www.twilio.com/en-us/whatsapp/pricing)).
- **Coexistencia:** **no aparece** en su documentación de WhatsApp ni en su changelog (lo más cercano es *Embedded Signup v4*, que no la menciona). Su artículo de soporte para números ya registrados en WhatsApp o en la app Business indica **borrar la cuenta de WhatsApp** para poder usarlos ([soporte](https://support.twilio.com/hc/en-us/articles/10665149551515-Twilio-Number-Already-Registered-With-a-WhatsApp-Account)), y su FAQ de Tech Provider exige que «el número no esté registrado en WhatsApp» ([FAQ](https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/faq)). Que Twilio «no soporta coexistencia» lo afirman competidores ([Chakra](https://chakrahq.com/article/whatsapp-coexistence-chakra-twilio-migrate-change/)); la ausencia en su documentación lo respalda, pero no es una declaración de Twilio.
- **Conclusión:** borrar la cuenta destruiría el uso del número en la app, que es justo lo que el cliente quiere conservar.

### 3.4 Gupshup — viable en costo, riesgoso en lo técnico

- **Precio:** pago por uso sin suscripción; cuota fija de Gupshup «desde USD 0,001» por mensaje, más 6 % sobre la tarifa de marketing enviado por Cloud API desde el 2026-01-01 ([modelo de precios](https://support.gupshup.io/hc/en-us/articles/360012075779-Whats-is-Gupshup-s-pricing-model-What-is-Gupshup-fee-and-WhatsApp-fee-in-pricing) —artículo marcado «no actualizado», de junio de 2024—, [cambio de 2026](https://support.gupshup.io/hc/en-us/articles/53700207494169-Gupshup-fee-changes-to-Cloud-API-marketing-w-e-f-1st-Jan-2026)). Su página de precios actual no pude abrirla (404), así que la cifra es la del soporte y el resumen de búsqueda.
- **Coexistencia:** la guía está en una página «closed beta». Pide app con unos 3 meses de antigüedad y actividad, **retirar cualquier método de pago de la app Business**, compartir todos los chats durante el onboarding (si no, hay que repetirlo) y disparar la sincronización de historial en las primeras 24 h ([guía](https://partner-docs.gupshup.io/docs/co-existence-closed-beta-phase)).
- **Webhooks:** reenvía los eventos v3 de Meta sin cambios (los medios llegan como ID, no URL). **Pero la propia guía dice que Meta «tiene problemas actualmente con history, contact sync y `smb_message_echoes`»**, que es el evento que necesitamos. También hay números que Meta considera no elegibles sin criterio publicado.
- **Países:** excluye Nigeria y Sudáfrica; RD no figura.
- **Conclusión:** barato, pero con la función crítica en estado frágil. Solo como último recurso.

### 3.5 Telnyx — alternativa sin cuota mensual

- **Precio:** pago por uso, USD **0,004 por mensaje** además de las tarifas de Meta; «sin cuota de plataforma, mínimo ni contrato»; hace falta tarjeta ([precios](https://www.telnyx.com/pricing/whatsapp)). No pude confirmar si cuenta los mensajes entrantes.
- **Coexistencia:** se elige la opción de coexistencia en el Portal de Telnyx (*Messaging Suite → WhatsApp Messaging → Business Accounts → Add Account*). El número pasa por `sync_pending` y luego `active`; hasta entonces el envío por Cloud API está bloqueado. Caudal de 20 mensajes por segundo ([coexistencia](https://developers.telnyx.com/docs/messaging/whatsapp/coexistence.md)).
- **Webhooks:** los echoes llegan como `message.echo` con `origin: "whatsapp_business_app"`, en el sobre propio de Telnyx. **`history` y `smb_app_state_sync` no se reenvían.** Los webhooks de coexistencia son «de mejor esfuerzo», no un archivo completo ([webhooks](https://developers.telnyx.com/docs/messaging/whatsapp/coexistence/webhooks), [referencia del echo](https://developers.telnyx.com/api-reference/callbacks/whatsapp-business-app-message-echo)).
- **API:** propia, con un objeto `whatsapp_message` que admite texto, botones (hasta 3), listas y plantillas ([enviar](https://developers.telnyx.com/docs/messaging/whatsapp/send-messages)). No encontré un ejemplo del webhook de respuesta a botón o lista **(por verificar)**.
- **Nota útil de su documentación:** los mensajes enviados desde la app **no abren ni extienden la ventana de 24 h de Cloud API**, no generan cobro ni activan la baja (STOP). Aplica a cualquier BSP.
- **Países:** no indica; hay que probar con el número real.

### 3.6 Kapso — respaldo con API compatible con Meta

- **Precio:** Free USD 0 con **2.000 mensajes al mes** (entrantes y salientes cuentan), 1 número y USD 2 de crédito; Pro USD 25 con 100.000 mensajes y 3 números. Las tarifas de Meta se pagan a costo, sin recargo, con créditos de Kapso o con la tarjeta de Meta; **no se puede pasar de créditos a tarjeta de Meta en la misma WABA** ([precios](https://kapso.com/pricing), [preguntas](https://docs.kapso.ai/docs/whatsapp/pricing-faq.md)).
- **Coexistencia:** *Connected numbers → WhatsApp Business App → Meta Embedded Signup → escanear QR*; sin restricción de plan en la guía ([conectar](https://docs.kapso.ai/docs/how-to/whatsapp/connect-whatsapp.md)). Su página de solución de problemas dice que la coexistencia es «conveniente pero menos estable» que una conexión dedicada, con desconexiones ocasionales y algunos primeros mensajes entrantes que tardan en llegar ([problemas](https://docs.kapso.ai/docs/how-to/whatsapp/coexistence-troubleshooting.md)).
- **API:** ofrece un **proxy compatible con Meta** (llamadas a su URL base con objetos de Meta por defecto) y reenvío encadenado de webhooks con firma ([resultados de búsqueda de su documentación](https://docs.kapso.ai/docs/how-to/whatsapp/use-meta-proxy); las páginas devolvían 404 al abrirlas, así que esto es lo que muestran los extractos de búsqueda **(por verificar)**). Para los echoes mencionan un evento propio `whatsapp.message.sent` **(por verificar si cubre los enviados desde la app)**.
- **Riesgo:** proveedor joven; el límite de 2.000 mensajes en Free es ajustado con nuestro volumen (§5).

### 3.7 Dualhook — pass-through puro, pero poco documentado

- **Precio:** Developer USD 12/mes (1 conexión), Team 25 (5), Agency 45 (10), Enterprise 99 (25); prueba de 14 días con tarjeta; «sin recargo por mensaje». Tarifas de Meta aparte ([precios](https://dualhook.com/pricing)).
- **Modelo:** usa *Webhook Override*: **los webhooks de mensajes van directo de Meta a nuestro servidor**, sin almacenar contenido. Los envíos pasan por un runtime «compatible con Graph» con claves `dh_live_` ([docs](https://dualhook.com/docs), [página de socio](https://dualhook.com/tech-partner)). Monitorea la regla de 13 días de la app.
- **Dudas:** se describe como «Meta Tech Partner» y no queda claro que sea Tech Provider o Solution Partner (Meta exige uno de los dos para la coexistencia); no explica quién factura a Meta; no confirma que reenvíe `smb_message_echoes` en bruto; no lista países. Casi toda su comparación con otros proveedores sale de su propio marketing.

### 3.8 Otros revisados

- **Chakra Chat:** Starter USD 12,49/mes (2 números, 10.000 plantillas incluidas), Growth 24,99, Advanced 49,99. Plan gratis solo recibe mensajes, **no envía plantillas**. Anuncia coexistencia y su tabla de países marca República Dominicana con «Full Coexistence Support», pero no confirma qué plan la incluye ni documenta los webhooks de echoes; es más una bandeja con CRM que una API para desarrolladores ([precios](https://chakrahq.com/help/chat/getting-started/understanding-pricing-and-charges), [tabla de países](https://chakrahq.com/product/whatsapp/tools/whatsapp-coexistence-support)).
- **WATI** (desde USD 59/mes según Dualhook) **y respond.io** (desde USD 79) soportan coexistencia, pero su precio rompe el presupuesto. No verifiqué sus páginas.
- **Infobip, Sinch, Vonage, Bird:** no encontré confirmación de coexistencia; por escala y precio quedan fuera.

### 3.9 Alternativa sin BSP: ser Tech Provider de Meta

Meta permite la coexistencia a quien sea Solution Partner **o Tech Provider**. Hacerse Tech Provider no tiene tarifa publicada, pero exige verificar el negocio, pasar la revisión de la app con acceso avanzado a `whatsapp_business_messaging` y `whatsapp_business_management`, grabar dos videos de demostración e implementar Embedded Signup ([guía de Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers)). La página **no aclara si un Tech Provider puede operar solo para su propia empresa**, y el esfuerzo es alto. Daría USD 0 al mes, webhooks y API de Meta sin intermediario, pero hoy es una opción **(por verificar)** para más adelante, no para el MVP.

## 4. Datos de Meta que aplican a cualquier BSP

Fuente: [Onboarding de usuarios de la app Business](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users) y [referencia de `smb_message_echoes`](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/smb_message_echoes).

- **Requisitos:** app Business ≥ 2.24.17; el socio o Tech Provider debe usar Embedded Signup. La cuenta de la app no puede ser nueva: la elegibilidad depende de su antigüedad y calidad de mensajería (PLAN.md §1 habla de 7 días activa; Gupshup pide unos 3 meses de antigüedad con actividad).
- **Sincronización:** después del onboarding hay **24 horas** para sincronizar contactos e historial (hasta 180 días hacia atrás, sin grupos). Si se pierde esa ventana hay que desconectar y repetir el flujo. **La decisión de compartir el historial no se puede cambiar después.**
- **Echoes:** el evento `smb_message_echoes` trae `message_echoes[]` con `from`, `to`, `id`, `timestamp`, `type` y el objeto del tipo. También se emite cuando el humano **borra** (`type: "revoke"`) o **edita** (`type: "edit"`) un mensaje desde la app. El adaptador debe tratar esos tres casos.
- **Dispositivos:** los mensajes enviados desde WhatsApp para Windows o WearOS **no generan echoes**. El cliente debe responder desde el móvil (o un dispositivo compañero soportado), o el bot no se pausará.
- **Inactividad:** el teléfono principal se desconecta tras unos 14 días sin abrir la app (varios proveedores avisan a los 13).
- **Limitaciones:** sin grupos en la API, listas de difusión desactivadas, sin mensajes temporales ni de una sola vista, sin llamadas por API, sin insignia azul oficial.
- **Países:** Meta no publica la lista en esa página. Las fuentes de terceros que revisé no excluyen a RD (ver tabla). Como la lista cambia, **la prueba con el número real es la única confirmación definitiva**.

## 5. Costo con el volumen del cliente

**Supuestos** (menos de 10 solicitudes por semana, unos 40 leads al mes): el bot intercambia unos 40 mensajes por lead, mitad entrantes y mitad salientes, es decir unos 1.600 mensajes al mes en total y unos 800 salientes. Además, unas 40 plantillas *utility* (confirmación, propuesta) y unas 20 de marketing al mes. Son supuestos míos, no datos del cliente.

**Cambio de Meta del 2026-10-01.** Según el aviso de YCloud del 4 de septiembre de 2026, los mensajes de servicio enviados por el negocio (respuestas libres dentro de las 24 h) **se cobran por mensaje entregado, con 1.000 gratis al mes por número de teléfono**, al precio *utility* del país del destinatario. Las plantillas *utility* enviadas en respuesta a un usuario dentro de la ventana dejan de ser gratis ([YCloud](https://www.ycloud.com/blog/whatsapp-api-message-pricing-update-effective-october-1-2026), [Gupshup](https://support.gupshup.io/hc/en-us/articles/62362400519705-WhatsApp-Service-Messages-Pricing-w-e-f-01-Oct-2026), [ChatMaxima](https://chatmaxima.com/blog/whatsapp-service-message-pricing-october-2026/)). La página de precios de Meta que pude abrir todavía decía que los mensajes sin plantilla dentro de la ventana son gratis ([Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)), así que **hay que confirmarlo en la tarifa vigente de Meta antes de fijar el presupuesto**. Los mensajes que el humano envía desde la app siguen siendo gratis.

**Tarifa de RD.** Meta ubica los prefijos 809, 829 y 849 en «Rest of Latin America». Según una reproducción de la tarifa vigente desde el 2026-10-01 ([Gallabox](https://docs.gallabox.com/pricing-and-billing/whatsapp-pricing/rate-card.md), fuente de tercero), esa fila es **marketing USD 0,0851; *utility* y autenticación USD 0,0130**. Confirmarla en la tarifa en USD de Meta.

| Concepto | Cálculo | USD al mes |
|---|---|---|
| Mensajes de servicio salientes | ≈ 800, por debajo de los 1.000 gratis por número | 0 |
| Plantillas *utility* | 40 × 0,0130 | ≈ 0,5 |
| Plantillas de marketing | 20 × 0,0851 | ≈ 1,7 |
| **Meta, total estimado** | | **≈ 2 a 3** (hasta ≈ 7 si se superan los 1.000 de servicio) |

Esto cae dentro del «1 a 3» que ya tenía el PLAN.md §7, pero solo si el bot mantiene bajo el número de mensajes salientes por lead; **conviene corregir esa frase del plan** (no la modifico aquí).

**Cuota del BSP sobre ese volumen:** YCloud 0 · Kapso 0 (1.600 de 2.000 mensajes: poco margen) · Gupshup ≈ 2 · Telnyx ≈ 3 a 6 · Dualhook 12 · 360dialog ≈ 57 a 59 · Twilio ≈ 8.

**Efecto en el presupuesto total.** El PLAN.md §7 suma USD 25 a 45 con Opus 5.5 y 17 a 30 con Haiku 5.5, **sin BSP**. Con Opus 5.5 queda margen de USD 5 como máximo: solo caben las opciones de USD 0 (YCloud, Kapso) o Telnyx en el mejor caso. Con Haiku 5.5 caben también Dualhook (12). **360dialog solo cabe si se cambia de modelo de IA y se acepta un total cercano al tope.**

## 6. Prueba de validación antes de decidir (medio día)

Se puede hacer ya, en paralelo con la verificación del negocio en Meta (tareas 8 y 12 del PLAN.md §6). Si el número del cliente no está disponible todavía, sirve cualquier número con la app Business activa desde hace unos días.

1. Crear una cuenta gratuita en YCloud (sin tarjeta) y comprobar que *Create Channel → WhatsApp Business APP Coexistence* está disponible **en el plan Free**.
2. Incorporar el número por QR, **compartiendo todo el historial** (no se puede cambiar después) y sin retirar la app del teléfono.
3. Configurar un webhook propio (basta un endpoint temporal) suscrito a mensajes entrantes, estados y echoes.
4. Enviar un mensaje desde la app del móvil y **guardar el JSON exacto** que llega: ¿es `whatsapp.smb.message.echoes` o `whatsapp.echo_message.*`? ¿trae el teléfono del cliente, `wamid` y texto? Repetir con un borrado y una edición.
5. Enviar por API un mensaje con botones, uno con lista y una plantilla; capturar el JSON de la respuesta del cliente (botón y lista).
6. Anotar el tiempo de entrega de los echoes y confirmar que la ventana de 24 h no se altera por mensajes de la app.

**Criterio de decisión:** si el paso 4 devuelve el echo con los datos necesarios, se confirma YCloud. Si no, pasar a Kapso Free con la misma prueba y, si tampoco sirve, a Telnyx. Los resultados definen además el contrato de `parseWebhook` de la interfaz `WhatsAppProvider` (PLAN.md §2, decisión 8).

## 7. Riesgos a tener presentes

- **Dependencia del echo para pausar el bot.** Si el proveedor no entrega el echo de forma fiable (Gupshup lo advierte, Telnyx lo declara «de mejor esfuerzo»), el bot respondería encima del humano. El adaptador debe aislar esa lógica y el bot necesita un modo de pausa manual desde el panel como respaldo.
- **El cliente responde desde el móvil.** WhatsApp para Windows no genera echoes ni sincroniza con el panel.
- **Abrir la app Business cada 13 días.** Si se desconecta, el bot deja de recibir y enviar. Conviene una alerta en el panel por falta de actividad.
- **Cuenta de WhatsApp Business App con otros vínculos.** Retirar métodos de pago de la app (Gupshup), desactivar eventos automáticos o resolver una línea de crédito previa (Kapso, YCloud) son bloqueos que ya ocurren en incorporaciones reales.
- **Cambiar de BSP más adelante.** La migración entre cuentas no está soportada para números en coexistencia (360dialog, Gupshup); hay que desconectar y volver a incorporar el número. La interfaz `WhatsAppProvider` reduce el cambio en código, no el trámite con Meta.
- **Soporte limitado en planes gratis.** YCloud Free ofrece documentación y correo en horario de UTC+8. Para producción conviene tener identificados los pasos de autoayuda.

## Fuentes

**Meta**
- [Onboarding de usuarios de la app WhatsApp Business (coexistencia)](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)
- [Referencia del webhook `smb_message_echoes`](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/smb_message_echoes)
- [Cómo ser Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers)
- [Precios de la plataforma](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)

**YCloud**
- [Precios](https://www.ycloud.com/pricing)
- [Coexistencia (página de producto)](https://www.ycloud.com/whatsapp-business-app-coexistence)
- [Coexistencia (guía de ayuda)](https://docs.ycloud.com/help-center/whatsapp-accounts-management/create-a-whatsapp-api-account/whatsapp-business-app-coexistence)
- [Blog: guía de coexistencia, 2026-03-09](https://www.ycloud.com/blog/whatsapp-business-app-coexistence-meta-update)
- [Blog: cambio de precios de Meta del 2026-10-01](https://www.ycloud.com/blog/whatsapp-api-message-pricing-update-effective-october-1-2026)
- [Configurar webhooks](https://docs.ycloud.com/en/api-reference/guides/api-fundamentals/configure-webhooks.md)
- [Eventos y payloads de webhooks](https://docs.ycloud.com/reference/webhook-events-payloads)
- [Ejemplos de payloads](https://docs.ycloud.com/reference/webhook-payload-examples)
- [Reglas de facturación](https://docs.ycloud.com/en/documentation/pricing-and-billing/billing-rule.md)
- [OpenAPI v2](https://docs.ycloud.com/openapi/endpoints/ycloud-api-v2.yaml)

**360dialog**
- [Precios para clientes](https://www.360dialog.com/pricing)
- [Precios y facturación (socios)](https://docs.360dialog.com/partner/get-started/pricing-and-billing)
- [Coexistencia](https://docs.360dialog.com/docs/hub/embedded-signup/whatsapp-coexistence)
- [Onboarding de coexistencia](https://docs.360dialog.com/docs/hub/embedded-signup/coexistence-onboarding)
- [Webhooks de coexistencia](https://docs.360dialog.com/partner/waba-management/whatsapp-coexistence/coexistence-webhooks)
- [Usar la app y la Cloud API a la vez](https://docs.360dialog.com/partner/waba-management/phone-number-and-hosting/using-whatsapp-app-and-cloud-api-simultaneously)
- [API de mensajería](https://docs.360dialog.com/partner/integration/waba-integration)

**Twilio**
- [Precios de WhatsApp](https://www.twilio.com/en-us/whatsapp/pricing)
- [Visión general de WhatsApp con Twilio](https://www.twilio.com/docs/whatsapp/api)
- [Número ya registrado en WhatsApp](https://support.twilio.com/hc/en-us/articles/10665149551515-Twilio-Number-Already-Registered-With-a-WhatsApp-Account)
- [FAQ del programa Tech Provider](https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/faq)
- [Changelog: Embedded Signup v4](https://www.twilio.com/en-us/changelog/whatsapp-esu-v4)

**Gupshup**
- [Coexistencia (beta cerrada)](https://partner-docs.gupshup.io/docs/co-existence-closed-beta-phase)
- [Modelo de precios](https://support.gupshup.io/hc/en-us/articles/360012075779-Whats-is-Gupshup-s-pricing-model-What-is-Gupshup-fee-and-WhatsApp-fee-in-pricing)
- [Cambio de tarifa de marketing, 2026-01-01](https://support.gupshup.io/hc/en-us/articles/53700207494169-Gupshup-fee-changes-to-Cloud-API-marketing-w-e-f-1st-Jan-2026)
- [Mensajes de servicio, 2026-10-01](https://support.gupshup.io/hc/en-us/articles/62362400519705-WhatsApp-Service-Messages-Pricing-w-e-f-01-Oct-2026)

**Telnyx**
- [Precios de WhatsApp](https://www.telnyx.com/pricing/whatsapp)
- [Coexistencia](https://developers.telnyx.com/docs/messaging/whatsapp/coexistence.md)
- [Webhooks de coexistencia](https://developers.telnyx.com/docs/messaging/whatsapp/coexistence/webhooks)
- [Echo de mensajes de la app](https://developers.telnyx.com/api-reference/callbacks/whatsapp-business-app-message-echo)
- [Enviar mensajes de WhatsApp](https://developers.telnyx.com/docs/messaging/whatsapp/send-messages)

**Kapso**
- [Precios](https://kapso.com/pricing)
- [Preguntas de precios](https://docs.kapso.ai/docs/whatsapp/pricing-faq.md)
- [Conectar WhatsApp (coexistencia)](https://docs.kapso.ai/docs/how-to/whatsapp/connect-whatsapp.md)
- [Problemas de coexistencia](https://docs.kapso.ai/docs/how-to/whatsapp/coexistence-troubleshooting.md)
- [Proxy de Meta](https://docs.kapso.ai/docs/how-to/whatsapp/use-meta-proxy) (solo vi extractos de búsqueda; la página devolvía 404)

**Dualhook**
- [Precios](https://dualhook.com/pricing)
- [Página de socio tecnológico](https://dualhook.com/tech-partner)
- [Documentación](https://dualhook.com/docs)
- [Comparativa de proveedores de coexistencia](https://dualhook.com/best-whatsapp-coexistence-providers) (fuente interesada)

**Chakra**
- [Precios y cargos](https://chakrahq.com/help/chat/getting-started/understanding-pricing-and-charges)
- [Soporte de coexistencia por país](https://chakrahq.com/product/whatsapp/tools/whatsapp-coexistence-support)
- [Preguntas de coexistencia](https://chakrahq.com/help/chat/faqs/coexistence-faqs)
- [Artículo sobre Twilio y Gupshup](https://chakrahq.com/article/whatsapp-coexistence-chakra-twilio-migrate-change/) (fuente interesada)

**Tarifas de Meta por mercado**
- [Tarifa «Rest of Latin America» (Gallabox, tercero)](https://docs.gallabox.com/pricing-and-billing/whatsapp-pricing/rate-card.md)
- [ChatMaxima: mensajes de servicio desde 2026-10-01](https://chatmaxima.com/blog/whatsapp-service-message-pricing-october-2026/)
