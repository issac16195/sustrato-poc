# Changelog — Sustrato

## 2026-04-23

### Fusión Procesos → Tarifario
- Eliminado nav item "Procesos" del sidebar
- Nueva sección "Terminados del cotizador" en Tarifario con toggles activo/inactivo
- Los chips del cotizador ahora se gestionan desde un solo lugar

### División de pliegos por máquina
- Campo `division` (1/2/4) en cada prensa: pliego completo / medio / cuarto
- Lógica de imposición actualizada: el sub-pliego (papel dividido) debe caber en `tamW×tamH`
- Costo del papel basado en pliegos completos comprados: `ceil(pliegos_máquina / division)`
- CRUD de Máquinas muestra y edita la división

### Corte final automático
- Se agrega a todo trabajo sin suajado: `2 × (nx + ny)` cortes
- Precio configurable en Tarifario → Acabados → "Corte final · por corte"
- Aparece en el desglose de cotización

### Limpieza de UI
- Eliminada tarjeta "Periodo de prueba" del sidebar
- Eliminado cronómetro de la esquina superior derecha

---

## 2026-04-22

### Persistencia multi-tenant Firestore
- `syncUserData()` ahora descarga todas las colecciones al login (incluyendo procesos, envíos, papeles)
- `_seedMissingKeys()`: migración automática de localStorage → Firestore en primer login
- Fix race condition en login.html: redirige a index solo después de completar sync
- Fix proyecto Vercel incorrecto: deploy directo con `vercel --prod`

---

## 2026-04-21

### Motor de cotización
- Imposición basada en medida exacta del papel del catálogo
- Selector de medida de pliego en paso 2
- División de sub-pliego según máquina
- Corte a prensa (5% sobre papel)

### Tarifario
- Secciones: Pre-prensa, Producción, Recubrimientos, Acabados, Logística
- CRUD completo por sección con filtro y búsqueda
- Unidades de cobro: por pieza, millar, proyecto, m², lámina, color, etc.
- Zonas de envío como chips en el cotizador

### Catálogo de papeles
- Tabla de papeles con gramaje, puntos, medida, precio por millar
- Integrado al selector de papel en cotizar

### Clientes
- Directorio con autocomplete en cotizador
- Agregar cliente rápido desde la cotización

### PDF y WhatsApp
- Exportación PDF con logo de la imprenta
- Link a WhatsApp con resumen de cotización
