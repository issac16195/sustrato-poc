# Sustrato — Motor de Cotización para Imprentas

SaaS de cotización offset para imprentas mexicanas. Permite configurar máquinas, tarifario y papeles para generar cotizaciones con imposición automática, desglose de costos y exportación a PDF/WhatsApp.

**Producción:** https://sustrato-two.vercel.app

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Vanilla JS · CSS custom properties · HTML |
| Auth | Firebase Authentication (email/pass + Google) |
| Base de datos | Cloud Firestore (multi-tenant por usuario) |
| Deploy | Vercel (deploy directo, sin CI/CD automático) |
| Fuentes | Inter · Barlow Condensed (Google Fonts) |
| PDF | jsPDF + jspdf-autotable |

> **Sin framework.** Todo el estado vive en `localStorage` como caché síncrona y se sincroniza a Firestore en login/escritura.

---

## Arquitectura de datos — Dual Layer

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO (browser)                  │
│                                                      │
│  localStorage  ◄──── lectura sync (instantánea)     │
│       │                                              │
│  save*() ──► fsWrite() ──► Firestore (async)        │
└──────────────────────┬──────────────────────────────┘
                       │
              syncUserData() en login
                       │
              ┌────────▼────────┐
              │   Cloud Firestore │
              │  users/{uid}/    │
              │  config/{key}    │
              └─────────────────┘
```

**Por qué dual layer:**
- Las lecturas en la app son 100% síncronas (sin spinners por cada dato)
- Firestore actúa como backup/sync entre dispositivos
- `save*()` → escribe en `localStorage` + llama `fsWrite()` en fire-and-forget
- Login → `syncUserData()` descarga todo Firestore a `localStorage` antes de mostrar la app

### Claves de Firestore por usuario

```
users/{uid}/config/machines       → array de máquinas configuradas
users/{uid}/config/preprensa      → tarifario pre-prensa
users/{uid}/config/acabados       → tarifario acabados
users/{uid}/config/produccion     → tarifario producción (láminas + impresión)
users/{uid}/config/recubrimientos → tarifario recubrimientos
users/{uid}/config/papeles        → catálogo de papeles y precios
users/{uid}/config/papel          → papel legacy (solo lectura)
users/{uid}/config/procesos       → qué terminados aparecen en el cotizador
users/{uid}/config/envios         → zonas y precios de envío
users/{uid}/config/clientes       → directorio de clientes
users/{uid}/config/cotizaciones   → historial de cotizaciones
users/{uid}/config/profile        → perfil de la imprenta (estructura plana, sin .data)
```

> La mayoría de claves se guardan como `{ data: [...] }`. El perfil es la excepción: se guarda como objeto plano directo.

---

## Estructura de archivos

```
sustrato/
├── index.html              # Shell de la app (nav + main + auth guard)
├── login.html              # Login / registro
├── onboarding.html         # Wizard de primer uso (perfil + máquinas)
├── css/
│   └── styles.css          # Todos los estilos (custom properties, componentes)
└── js/
    ├── firebase-config.js  # Credenciales Firebase (no commitear si son secretas)
    ├── auth.js             # Capa de auth + sync Firestore ↔ localStorage
    ├── app.js              # Estado global, stores, utilidades de cálculo
    └── views/
        ├── cotizar.js      # Motor principal de cotización (3 pasos)
        ├── dashboard.js    # Resumen / historial de cotizaciones
        ├── maquinas.js     # CRUD de prensas
        ├── tarifario.js    # CRUD de precios + sección "Terminados del cotizador"
        ├── sustratos.js    # Catálogo de papeles y mermas
        ├── clientes.js     # Directorio de clientes
        ├── perfil.js       # Datos de la imprenta (logo, nombre, etc.)
        └── plan.js         # Vista de plan (reservada para futuro billing)
```

---

## Conceptos clave del dominio

### División de pliegos

Cada máquina trabaja con un formato de entrada diferente. Los pliegos del catálogo (ej. 58×88 cm) se cortan antes de entrar a la prensa:

| Máquina | División | Sub-pliego de 58×88 |
|---------|---------|---------------------|
| PM52 | ÷4 (cuarto) | 29×44 cm |
| PM74 | ÷2 (medio) | 29×88 ó 58×44 cm |
| CD102 | ÷1 (completo) | 58×88 cm |

**Impacto en el cálculo:**
- El sub-pliego debe caber en `tamW × tamH` de la máquina
- La imposición se calcula sobre `min(sub-pliego, área útil)`
- El costo del papel se basa en **pliegos completos comprados**: `ceil(pliegos_máquina / division)`

### Imposición (`calcImp`)

Dados el ancho/alto del producto y el área útil disponible, calcula cuántas piezas caben en el pliego probando orientación normal y girada 90°. Devuelve `{nx, ny, count, rotated}`.

La sangría (`SANGRIA = 0.3 cm`) se suma a cada pieza para el cálculo de espacio pero no cuenta para el área impresa real.

### Corte final

Todo trabajo no suajado requiere corte de guillotina al final. La fórmula es:

```
cortes = 2 × (nx + ny)
costo  = cortes × precio_por_corte  (configurable en Tarifario → Acabados)
```

Para 1×2 imposición: 2×(1+2) = 6 cortes. Para 2×4: 2×(2+4) = 12 cortes.

### Terminados del cotizador

Los servicios que aparecen como chips seleccionables en el cotizador (Suaje, Barniz UV, Doblado, etc.) se configuran en **Tarifario → Terminados del cotizador**. Cada chip activo agrega su costo al total usando `calcTerminadoCosto()`, que busca el precio en el tarifario correspondiente (acabados o recubrimientos) filtrando por nombre del servicio y máquina seleccionada.

---

## Cómo deployar

> El proyecto de Vercel correcto es `sustrato` (alias `sustrato-two.vercel.app`). **No** usar `sustrato-poc` (ese está conectado al repo de GitHub pero apunta al proyecto incorrecto).

```bash
# Deploy a producción (siempre desde el directorio del proyecto)
cd ~/Claude/sustrato
vercel --prod

# Subir cambios a GitHub
git add -A
git commit -m "feat: descripción del cambio"
git push origin main
```

**Siempre hacer los dos pasos** — Vercel no está conectado al repo de GitHub en este proyecto.

---

## Desarrollo local

No hay build step. Abrir `index.html` directamente en el browser no funciona bien por CORS con Firebase. Usar un servidor local:

```bash
cd ~/Claude/sustrato
npx serve .
# o
python3 -m http.server 8080
```

Firebase usa las credenciales reales de producción incluso en local (no hay emulador configurado).

---

## Versionado de scripts

Para evitar que el CDN de Vercel sirva archivos cacheados tras un deploy, los scripts en `index.html` usan query params de versión:

```html
<script src="js/app.js?v=20"></script>
<script src="js/views/cotizar.js?v=20"></script>
```

**Regla:** cada vez que se modifica un archivo JS, incrementar su `?v=N` en `index.html`.

---

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Cada usuario solo puede leer/escribir su propio nodo `users/{uid}/**`.

---

## Estado del proyecto

PoC activo — sin billing implementado. El límite de usuarios se monitorea manualmente en Firebase Console → Authentication → Users.
