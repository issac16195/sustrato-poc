// ─── Shared state ────────────────────────────────────────────────
let sec = 0, timerOn = false, timerInt;

// ─── Global money formatter ───────────────────────────────────────
function fmtMXN(n) {
  const num = parseFloat(String(n).replace(/[$,]/g, '')) || 0;
  return '$' + num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Machine store (localStorage-backed) ─────────────────────────
const DEFAULT_MACHINES = [
  { id:'PM52',  name:'PM52',  tag:'Chica',   tamW:37,  tamH:51,  utilW:35, utilH:49,  gramaje:'16 pts', cph:850,  pliegoPrice:0.45 },
  { id:'PM74',  name:'PM74',  tag:'Mediana', tamW:52,  tamH:72,  utilW:50, utilH:70,  gramaje:'20 pts', cph:1200, pliegoPrice:0.65 },
  { id:'CD102', name:'CD102', tag:'Grande',  tamW:72,  tamH:102, utilW:79, utilH:100, gramaje:'24 pts', cph:2100, pliegoPrice:1.20 },
];
function getMachines() {
  try {
    const raw = localStorage.getItem('sustrato_machines');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return arr; }
  } catch {}
  return DEFAULT_MACHINES.map(m => ({...m}));
}
function saveMachines(arr) {
  localStorage.setItem('sustrato_machines', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('machines', arr);
}

// ─── Tarifario stores ─────────────────────────────────────────────
const DEFAULT_PREPRENSA = [
  { id:'pp1',  nombre:'Diseño A',            nota:'Nivel básico — layouts simples',         tamano:'—',           precio:500,  unidad:'por proyecto' },
  { id:'pp2',  nombre:'Diseño B',            nota:'Nivel intermedio',                       tamano:'—',           precio:1000, unidad:'por proyecto' },
  { id:'pp3',  nombre:'Diseño C',            nota:'Nivel complejo',                         tamano:'—',           precio:2000, unidad:'por proyecto' },
  { id:'pp4',  nombre:'Fotografía',          nota:'',                                       tamano:'—',           precio:250,  unidad:'por toma' },
  { id:'pp5',  nombre:'Prueba de color',     nota:'Matchprint / prueba digital de color',   tamano:'CH 33×45 cm', precio:342,  unidad:'por pieza' },
  { id:'pp6',  nombre:'Prueba de color',     nota:'',                                       tamano:'MD 61×45 cm', precio:466,  unidad:'por pieza' },
  { id:'pp7',  nombre:'Prueba de color',     nota:'',                                       tamano:'GD 61×80 cm', precio:933,  unidad:'por pieza' },
  { id:'pp8',  nombre:'Negativo / Positivo', nota:'',                                       tamano:'CH 33×45 cm', precio:200,  unidad:'por pieza' },
  { id:'pp9',  nombre:'Negativo / Positivo', nota:'',                                       tamano:'MD 61×45 cm', precio:400,  unidad:'por pieza' },
  { id:'pp10', nombre:'Negativo / Positivo', nota:'',                                       tamano:'GD 61×80 cm', precio:800,  unidad:'por pieza' },
];
function getPreprensa() {
  try {
    const raw = localStorage.getItem('sustrato_preprensa');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return arr; }
  } catch {}
  return DEFAULT_PREPRENSA.map(x => ({...x}));
}
function savePreprensa(arr) {
  localStorage.setItem('sustrato_preprensa', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('preprensa', arr);
}

const DEFAULT_ACABADOS = [
  { id:'ac1',  nombre:'Suaje (matriz)',           nota:'Una sola vez por proyecto',       tamano:'PM52', precio:1500, unidad:'por proyecto' },
  { id:'ac2',  nombre:'Suaje (matriz)',           nota:'',                                tamano:'PM74', precio:3000, unidad:'por proyecto' },
  { id:'ac3',  nombre:'Suaje (matriz)',           nota:'',                                tamano:'CD102',precio:6000, unidad:'por proyecto' },
  { id:'ac4',  nombre:'Arreglo de suajado',       nota:'Una sola vez por proyecto',       tamano:'PM52', precio:150,  unidad:'por proyecto' },
  { id:'ac5',  nombre:'Arreglo de suajado',       nota:'',                                tamano:'PM74', precio:300,  unidad:'por proyecto' },
  { id:'ac6',  nombre:'Arreglo de suajado',       nota:'',                                tamano:'CD102',precio:600,  unidad:'por proyecto' },
  { id:'ac7',  nombre:'Suajado',                  nota:'De 1 a 1,000 pzas',              tamano:'PM52', precio:150,  unidad:'por millar' },
  { id:'ac8',  nombre:'Suajado',                  nota:'',                                tamano:'PM74', precio:300,  unidad:'por millar' },
  { id:'ac9',  nombre:'Suajado',                  nota:'',                                tamano:'CD102',precio:600,  unidad:'por millar' },
  { id:'ac10', nombre:'Desbarbado',               nota:'Limpieza de rebaba post-suajado', tamano:'PM52', precio:0.10, unidad:'por pieza' },
  { id:'ac11', nombre:'Desbarbado',               nota:'',                                tamano:'PM74', precio:0.20, unidad:'por pieza' },
  { id:'ac12', nombre:'Desbarbado',               nota:'',                                tamano:'CD102',precio:0.30, unidad:'por pieza' },
  { id:'ac13', nombre:'Encolado',                 nota:'Mín. $350',                       tamano:'PM52', precio:0.30, unidad:'por pieza' },
  { id:'ac14', nombre:'Encolado',                 nota:'',                                tamano:'PM74', precio:0.60, unidad:'por pieza' },
  { id:'ac15', nombre:'Encolado',                 nota:'',                                tamano:'CD102',precio:1.20, unidad:'por pieza' },
  { id:'ac16', nombre:'Pegado lineal',            nota:'Folders, cajas simples',          tamano:'PM52', precio:0.30, unidad:'por pieza' },
  { id:'ac17', nombre:'Pegado lineal',            nota:'',                                tamano:'PM74', precio:0.60, unidad:'por pieza' },
  { id:'ac18', nombre:'Pegado lineal',            nota:'',                                tamano:'CD102',precio:1.20, unidad:'por pieza' },
  { id:'ac19', nombre:'Pegado fondo automático',  nota:'',                                tamano:'PM52', precio:0.90, unidad:'por pieza' },
  { id:'ac20', nombre:'Pegado fondo automático',  nota:'',                                tamano:'PM74', precio:1.80, unidad:'por pieza' },
  { id:'ac21', nombre:'Pegado fondo automático',  nota:'',                                tamano:'CD102',precio:3.60, unidad:'por pieza' },
  { id:'ac22', nombre:'Doblado',                  nota:'',                                tamano:'PM52', precio:60,   unidad:'por millar' },
  { id:'ac23', nombre:'Doblado',                  nota:'',                                tamano:'PM74', precio:120,  unidad:'por millar' },
  { id:'ac24', nombre:'Doblado',                  nota:'',                                tamano:'CD102',precio:220,  unidad:'por millar' },
  { id:'ac25', nombre:'Plecado',                  nota:'',                                tamano:'PM52', precio:50,   unidad:'por millar' },
  { id:'ac26', nombre:'Plecado',                  nota:'',                                tamano:'PM74', precio:100,  unidad:'por millar' },
  { id:'ac27', nombre:'Plecado',                  nota:'',                                tamano:'CD102',precio:180,  unidad:'por millar' },
  { id:'ac28', nombre:'Foliado',                  nota:'Numeración consecutiva',          tamano:'—',    precio:0.05, unidad:'por pieza'  },
  { id:'ac29', nombre:'Hot stamping',             nota:'',                                tamano:'PM52', precio:0.80, unidad:'por pieza'  },
  { id:'ac30', nombre:'Hot stamping',             nota:'',                                tamano:'PM74', precio:1.50, unidad:'por pieza'  },
  { id:'ac31', nombre:'Hot stamping',             nota:'',                                tamano:'CD102',precio:2.50, unidad:'por pieza'  },
  { id:'ac32', nombre:'Redondeo esquinas',        nota:'',                                tamano:'—',    precio:0.10, unidad:'por pieza'  },
];
function getAcabados() {
  try {
    const raw = localStorage.getItem('sustrato_acabados');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return migrateTamanoToMaqId(arr); }
  } catch {}
  return DEFAULT_ACABADOS.map(x => ({...x}));
}
function saveAcabados(arr) {
  localStorage.setItem('sustrato_acabados', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('acabados', arr);
}

const DEFAULT_PRODUCCION = [
  { id:'pr1', nombre:'Corte a prensa',         nota:'Se suma sobre el costo de papel',     tamano:'—',    precio:'5%',  unidad:'sobre papel' },
  { id:'pr2', nombre:'Láminas para impresión', nota:'4 láminas = color completo CMYK',     tamano:'PM52', precio:'80',  unidad:'por lámina' },
  { id:'pr3', nombre:'Láminas para impresión', nota:'',                                    tamano:'PM74', precio:'160', unidad:'por lámina' },
  { id:'pr4', nombre:'Láminas para impresión', nota:'',                                    tamano:'CD102',precio:'320', unidad:'por lámina' },
  { id:'pr5', nombre:'Impresión',              nota:'Unitario por color · 1 a 1,000 pzas', tamano:'PM52', precio:'80',  unidad:'por color' },
  { id:'pr6', nombre:'Impresión',              nota:'',                                    tamano:'PM74', precio:'160', unidad:'por color' },
  { id:'pr7', nombre:'Impresión',              nota:'',                                    tamano:'CD102',precio:'320', unidad:'por color' },
];
// ─── Migración: convierte tamano 'CH'/'MD'/'GD' a ids de máquina ─────────────
function migrateTamanoToMaqId(arr) {
  const machines = getMachines();
  const map = {
    CH: machines.find(m => m.tag === 'Chica')?.id,
    MD: machines.find(m => m.tag === 'Mediana')?.id,
    GD: machines.find(m => m.tag === 'Grande')?.id,
  };
  return arr.map(x => {
    const prefix = x.tamano?.match(/^(CH|MD|GD)/)?.[1];
    if (prefix && map[prefix]) return { ...x, tamano: map[prefix] };
    // 'CH/MD/GD' multi-value → universal
    if (x.tamano?.includes('/')) return { ...x, tamano: '—' };
    return x;
  });
}

function getProduccion() {
  try {
    const raw = localStorage.getItem('sustrato_produccion');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return migrateTamanoToMaqId(arr); }
  } catch {}
  return DEFAULT_PRODUCCION.map(x => ({...x}));
}
function saveProduccion(arr) {
  localStorage.setItem('sustrato_produccion', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('produccion', arr);
}

const DEFAULT_RECUBRIMIENTOS = [
  { id:'rc1',  nombre:'Barniz máquina',                      nota:'De 1 a 1,000 pzas por lado', tamano:'PM52',  precio:'100',  unidad:'por lado' },
  { id:'rc2',  nombre:'Barniz máquina',                      nota:'',                            tamano:'PM74',  precio:'200',  unidad:'por lado' },
  { id:'rc3',  nombre:'Barniz máquina',                      nota:'',                            tamano:'CD102', precio:'400',  unidad:'por lado' },
  { id:'rc4',  nombre:'Barniz UV Brillante',                 nota:'Mín. $500',                   tamano:'—',     precio:'2.50', unidad:'por m²' },
  { id:'rc5',  nombre:'Barniz UV Mate',                      nota:'Mín. $1,000',                 tamano:'—',     precio:'5.00', unidad:'por m²' },
  { id:'rc6',  nombre:'Plástico Brillante',                  nota:'Mín. $500',                   tamano:'—',     precio:'6.00', unidad:'por m²' },
  { id:'rc7',  nombre:'Plástico Mate',                       nota:'Mín. $500',                   tamano:'—',     precio:'7.00', unidad:'por m²' },
  { id:'rc8',  nombre:'Arreglo de barniz a registro',        nota:'Una sola vez por proyecto',   tamano:'PM52',  precio:'1000', unidad:'por proyecto' },
  { id:'rc9',  nombre:'Arreglo de barniz a registro',        nota:'',                            tamano:'PM74',  precio:'2000', unidad:'por proyecto' },
  { id:'rc10', nombre:'Arreglo de barniz a registro',        nota:'',                            tamano:'CD102', precio:'3000', unidad:'por proyecto' },
  { id:'rc11', nombre:'Aplicación barniz registro UV Br.',   nota:'Mín. $1,800',                 tamano:'—',     precio:'7.00', unidad:'por m²' },
];
function getRecubrimientos() {
  try {
    const raw = localStorage.getItem('sustrato_recubrimientos');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return migrateTamanoToMaqId(arr); }
  } catch {}
  return DEFAULT_RECUBRIMIENTOS.map(x => ({...x}));
}
function saveRecubrimientos(arr) {
  localStorage.setItem('sustrato_recubrimientos', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('recubrimientos', arr);
}

// ─── Procesos store ──────────────────────────────────────────────
const DEFAULT_PROCESOS = [
  // Pre-prensa
  { id:'diseno',      name:'Diseño',                  sub:'Nivel básico (A) · Intermedio (B) · Complejo (C)', cat:'Pre-prensa',    tarifaSrc:null, tarifaNombres:[], active:true  },
  { id:'foto',        name:'Fotografía',               sub:'Por toma',                                         cat:'Pre-prensa',    tarifaSrc:null, tarifaNombres:[], active:true  },
  { id:'prueba',      name:'Prueba de color',          sub:'Matchprint / impresión de referencia',             cat:'Pre-prensa',    tarifaSrc:null, tarifaNombres:[], active:true  },
  { id:'negpos',      name:'Negativo / Positivo',      sub:'Chico · Mediano · Grande',                         cat:'Pre-prensa',    tarifaSrc:null, tarifaNombres:[], active:true  },
  // Materiales (manejados aparte en cotizador)
  { id:'papeles',     name:'Papeles',                  sub:'Tabla anexa de sustratos',                         cat:'Materiales',    tarifaSrc:null, tarifaNombres:[], active:true  },
  { id:'laminas',     name:'Láminas para impresión',   sub:'Según máquina seleccionada',                       cat:'Materiales',    tarifaSrc:null, tarifaNombres:[], active:true  },
  // Producción (impresión manejada aparte; recubrimientos y grabados sí generan chip)
  { id:'impresion',   name:'Impresión',                sub:'4 tintas CMYK',                                    cat:'Producción',    tarifaSrc:null, tarifaNombres:[], active:true  },
  { id:'recubr',      name:'Recubrimiento',            sub:'Barniz en máquina',                                cat:'Producción',    tarifaSrc:'rc', tarifaNombres:['Barniz máquina'],                                                active:true  },
  { id:'recubr_r',    name:'Recubrimiento a registro', sub:'Solo áreas específicas',                           cat:'Producción',    tarifaSrc:'rc', tarifaNombres:['Arreglo de barniz a registro','Aplicación barniz registro UV Br.'], active:false },
  { id:'grabados',    name:'Grabados',                 sub:'Hotstamping · Grabado en seco',                    cat:'Producción',    tarifaSrc:'ac', tarifaNombres:['Hot stamping'],                                                  active:true  },
  // Acabados
  { id:'suaje',       name:'Suaje',                    sub:'Matriz · Arreglo · Suajado · Desbarbado',          cat:'Acabados',      tarifaSrc:'ac', tarifaNombres:['Suaje (matriz)','Arreglo de suajado','Suajado'],                 active:true  },
  { id:'redondeo',    name:'Redondeo de esquinas',     sub:'',                                                 cat:'Acabados',      tarifaSrc:'ac', tarifaNombres:['Redondeo esquinas'],                                             active:false },
  { id:'ponchado',    name:'Ponchado',                 sub:'Orificio chico o mediano',                         cat:'Acabados',      tarifaSrc:null, tarifaNombres:[], active:false },
  { id:'compag',      name:'Compaginado',              sub:'Manual o automático',                               cat:'Acabados',      tarifaSrc:null, tarifaNombres:[], active:false },
  { id:'encuad',      name:'Encuadernado',             sub:'Rústico · Hotmelt · Grapa · Encolado',             cat:'Acabados',      tarifaSrc:null, tarifaNombres:[], active:false },
  { id:'doblez',      name:'Doblez',                   sub:'Cruz · Mapa · Tríptico · Díptico',                 cat:'Acabados',      tarifaSrc:'ac', tarifaNombres:['Doblado'],                                                       active:true  },
  { id:'plecado',     name:'Plecado',                  sub:'Rallado para doblez',                              cat:'Acabados',      tarifaSrc:'ac', tarifaNombres:['Plecado'],                                                       active:true  },
  { id:'wire',        name:'Wire-O / Arillo',          sub:'Metálico · Espiral · Gancho',                      cat:'Acabados',      tarifaSrc:null, tarifaNombres:[], active:false },
  { id:'corte',       name:'Corte',                    sub:'Guillotina · Trilateral',                          cat:'Acabados',      tarifaSrc:null, tarifaNombres:[], active:false },
  { id:'folio',       name:'Folio / Perforado',        sub:'Numeración consecutiva',                           cat:'Acabados',      tarifaSrc:'ac', tarifaNombres:['Foliado'],                                                       active:true  },
  { id:'pegado',      name:'Pegado',                   sub:'Folders · Caja lineal · Fondo automático',         cat:'Acabados',      tarifaSrc:'ac', tarifaNombres:['Pegado lineal'],                                                 active:false },
  // Recubrimientos
  { id:'barniz_uv',   name:'Barniz UV',                sub:'Brillo o mate',                                    cat:'Recubrimientos', tarifaSrc:'rc', tarifaNombres:['Barniz UV Brillante'],                                          active:true  },
  { id:'laminado',    name:'Laminado',                 sub:'Brillante o mate',                                 cat:'Recubrimientos', tarifaSrc:'rc', tarifaNombres:['Plástico Mate'],                                                active:true  },
  // Logística
  { id:'empacado',    name:'Empacado',                 sub:'Por caja o empaque individual',                    cat:'Logística',     tarifaSrc:null, tarifaNombres:[], active:true  },
  { id:'envarillado', name:'Envarillado',              sub:'Superior o inferior',                              cat:'Logística',     tarifaSrc:null, tarifaNombres:[], active:false },
  { id:'empalmado',   name:'Empalmado',                sub:'SBS+Micro · SBS+Corrugado',                        cat:'Logística',     tarifaSrc:null, tarifaNombres:[], active:false },
  { id:'envio',       name:'Envío',                    sub:'Por pieza · Por kilo · Por distancia',             cat:'Logística',     tarifaSrc:null, tarifaNombres:[], active:true  },
];
function getProcesos() {
  try {
    const raw = localStorage.getItem('sustrato_procesos');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return arr; }
  } catch {}
  return DEFAULT_PROCESOS.map(p => ({...p}));
}
function saveProcesos(arr) {
  localStorage.setItem('sustrato_procesos', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('procesos', arr);
}

// ─── Clientes store ──────────────────────────────────────────────
function getClientes() {
  try {
    const raw = localStorage.getItem('sustrato_clientes');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
function saveClientes(arr) {
  localStorage.setItem('sustrato_clientes', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('clientes', arr);
}

// ─── Views registry (populated by each view file) ────────────────
const views = {};

// ─── Title / subtitle maps ────────────────────────────────────────
const titles = {
  cotizar:  'Nueva cotización',
  procesos: 'Procesos de producción',
  maquinas: 'Máquinas',
  sustratos:'Sustratos & Mermas',
  dashboard:'Resumen',
  plan:     'Plan y facturación',
  clientes: 'Clientes',
  tarifario:'Tarifario de servicios',
  perfil:   'Mi imprenta',
};
const subs = {
  cotizar:  'Proyecto general · 3 pasos',
  procesos: 'Configura procesos por tipo de proyecto',
  maquinas: 'Costos de operación por prensa',
  sustratos:'Precios de papel y tabla de mermas',
  dashboard:'Resumen del taller',
  plan:     'Suscripción mensual',
  clientes: 'Directorio de clientes · CRM básico',
  tarifario:'Precios de procesos y acabados · sin IVA',
  perfil:   'Datos de tu taller · aparecerán en PDFs y cotizaciones',
};

// ─── Profile helpers ──────────────────────────────────────────────
function getProfile() {
  try {
    const raw = localStorage.getItem('sustrato_profile');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}
function saveProfile(obj) {
  localStorage.setItem('sustrato_profile', JSON.stringify(obj));
  if (typeof fsWrite === 'function') fsWrite('profile', obj);
}

// ─── Cotizaciones helpers ─────────────────────────────────────────
function getCotizaciones() {
  try {
    const raw = localStorage.getItem('sustrato_cotizaciones');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
function saveCotizaciones(arr) {
  localStorage.setItem('sustrato_cotizaciones', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('cotizaciones', arr);
}
function registrarCotizacion(record) {
  const arr = getCotizaciones();
  // Evitar duplicado si se descarga dos veces la misma cotización
  const exists = arr.find(c => c.id === record.id);
  if (!exists) arr.unshift(record);
  saveCotizaciones(arr);
}
function convertirANotaVenta(cotId) {
  const arr = getCotizaciones();
  const cot = arr.find(c => c.id === cotId);
  if (cot) { cot.estado = 'nota_venta'; cot.fechaNota = new Date().toISOString(); }
  saveCotizaciones(arr);
}

// ─── Router ───────────────────────────────────────────────────────
function showView(id, el) {
  // render HTML into #app
  const app = document.getElementById('app');
  if (views[id] && views[id].render) {
    views[id].render();
  }
  // update topbar
  document.getElementById('top-title').textContent = titles[id] || id;
  document.getElementById('top-sub').textContent   = subs[id]   || '';
  // highlight nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  // run init (event listeners, recalcs, etc.)
  if (views[id] && views[id].init) {
    views[id].init();
  }
  // side-effects
  if (id === 'cotizar' && !timerOn) startTimer();
}

// ─── Timer ────────────────────────────────────────────────────────
function startTimer() {
  timerOn = true;
  timerInt = setInterval(() => {
    sec++;
    const m = Math.floor(sec / 60), s = sec % 60;
    document.getElementById('timer').textContent = '⏱ ' + m + ':' + (s < 10 ? '0' : '') + s;
  }, 1000);
}

// ─── Shared util ─────────────────────────────────────────────────
function getMerma(n) {
  return n <= 500 ? 200 : n <= 1000 ? 300 : n <= 5000 ? 400 : n <= 10000 ? 700 : 750;
}

// ─── Pricing engine helpers ───────────────────────────────────────

// Lee precios de papel del localStorage (guardados en onboarding/sustratos)
function getPapelPrices() {
  try {
    const raw = localStorage.getItem('sustrato_papel');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

// Devuelve $/pliego para un tipo+gramaje. Fallback: pliegoPrice de la máquina.
function getPapelPriceFor(tipoPapel, gramaje, fallback) {
  const prices = getPapelPrices();
  if (prices && prices[tipoPapel] && prices[tipoPapel][gramaje] != null) {
    return +prices[tipoPapel][gramaje];
  }
  // Defaults integrados si no hay sustrato_papel configurado
  const defaults = {
    bond:      { '75g':0.38,'90g':0.45,'105g':0.54,'120g':0.62 },
    couche:    { '100g':0.55,'150g':0.65,'200g':0.80,'250g':0.98,'300g':1.15,'350g':1.30 },
    sulfatado: { '12 pts':1.10,'14 pts':1.28,'16 pts':1.48,'18 pts':1.72,'20 pts':1.95,'24 pts':2.30 },
  };
  if (defaults[tipoPapel] && defaults[tipoPapel][gramaje] != null) {
    return +defaults[tipoPapel][gramaje];
  }
  return fallback || 0.65;
}

// Mapea id de máquina → 'CH'|'MD'|'GD'
function getMaqSize(maqId) {
  const m = getMachines().find(x => x.id === maqId);
  if (!m) return 'GD';
  return m.tag === 'Chica' ? 'CH' : m.tag === 'Mediana' ? 'MD' : 'GD';
}

// Busca entrada en un array de tarifario por nombre y machine id
function lookupTarifa(arr, nombre, maqId) {
  return arr.find(x => x.nombre === nombre &&
    (x.tamano === maqId || x.tamano === '—'));
}

// Extrae mínimo de nota tipo "Mín. $500" → 500
function parseMinimo(nota) {
  const m = (nota || '').match(/[Mm]ín\.?\s*\$?([\d,]+)/);
  return m ? parseFloat(m[1].replace(',', '')) : 0;
}

// Aplica la fórmula correcta según unidad de un entry de tarifario
// ctx puede incluir: cant, pliegos, utilW_m, utilH_m, tintas, millares
function applyUnidad(entry, ctx) {
  const { cant = 0, pliegos = 0, utilW_m = 0, utilH_m = 0, tintas = 1, millares = 1 } = ctx;
  const precio = parseFloat(entry.precio) || 0;
  let costo = 0;
  switch (entry.unidad) {
    case 'por pieza':    costo = precio * cant; break;
    case 'por millar':   costo = precio * Math.ceil(cant / 1000); break;
    case 'por proyecto': costo = precio; break;
    case 'por pliego':   costo = precio * pliegos; break;
    case 'por m²':       costo = utilH_m * utilW_m * pliegos * precio; break;
    case 'por lado':     costo = precio * Math.ceil(cant / 1000); break;
    case 'por lámina':   costo = precio * tintas; break;
    case 'por color':    costo = precio * tintas * millares; break;
    case 'sobre papel':  costo = precio; break; // porcentaje — el caller maneja esto
    default:             costo = precio;
  }
  const min = parseMinimo(entry.nota);
  return min > 0 ? Math.max(costo, min) : costo;
}

// Calcula costo de un terminado seleccionado usando el id del proceso y maqId de la máquina.
function calcTerminadoCosto(procId, maqId, cant, pliegos, utilW_m, utilH_m, tintas = 1, millares = 1) {
  const proc = getProcesos().find(p => p.id === procId);
  if (!proc || !proc.tarifaSrc) return 0;
  const ctx = { cant, pliegos, utilW_m, utilH_m, tintas, millares };
  const arr = proc.tarifaSrc === 'rc' ? getRecubrimientos()
            : proc.tarifaSrc === 'ac' ? getAcabados()
            : proc.tarifaSrc === 'pp' ? getPreprensa()
            : getProduccion();
  let total = 0;
  for (const nom of proc.tarifaNombres) {
    const entry = lookupTarifa(arr, nom, maqId);
    if (entry) total += applyUnidad(entry, ctx);
  }
  return total;
}

// ─── Boot ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  startTimer();
  showView('cotizar', document.querySelector('.nav-item.active'));
});
