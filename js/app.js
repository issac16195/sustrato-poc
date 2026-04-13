// ─── Shared state ────────────────────────────────────────────────
let sec = 0, timerOn = false, timerInt;

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
}

const DEFAULT_ACABADOS = [
  { id:'ac1',  nombre:'Suaje (matriz)',           nota:'Una sola vez por proyecto',       tamano:'CH', precio:1500, unidad:'por proyecto' },
  { id:'ac2',  nombre:'Suaje (matriz)',           nota:'',                                tamano:'MD', precio:3000, unidad:'por proyecto' },
  { id:'ac3',  nombre:'Suaje (matriz)',           nota:'',                                tamano:'GD', precio:6000, unidad:'por proyecto' },
  { id:'ac4',  nombre:'Arreglo de suajado',       nota:'Una sola vez por proyecto',       tamano:'CH', precio:150,  unidad:'por proyecto' },
  { id:'ac5',  nombre:'Arreglo de suajado',       nota:'',                                tamano:'MD', precio:300,  unidad:'por proyecto' },
  { id:'ac6',  nombre:'Arreglo de suajado',       nota:'',                                tamano:'GD', precio:600,  unidad:'por proyecto' },
  { id:'ac7',  nombre:'Suajado',                  nota:'De 1 a 1,000 pzas',              tamano:'CH', precio:150,  unidad:'por millar' },
  { id:'ac8',  nombre:'Suajado',                  nota:'',                                tamano:'MD', precio:300,  unidad:'por millar' },
  { id:'ac9',  nombre:'Suajado',                  nota:'',                                tamano:'GD', precio:600,  unidad:'por millar' },
  { id:'ac10', nombre:'Desbarbado',               nota:'Limpieza de rebaba post-suajado', tamano:'CH', precio:0.10, unidad:'por pieza' },
  { id:'ac11', nombre:'Desbarbado',               nota:'',                                tamano:'MD', precio:0.20, unidad:'por pieza' },
  { id:'ac12', nombre:'Desbarbado',               nota:'',                                tamano:'GD', precio:0.30, unidad:'por pieza' },
  { id:'ac13', nombre:'Encolado',                 nota:'Mín. $350',                       tamano:'CH', precio:0.30, unidad:'por pieza' },
  { id:'ac14', nombre:'Encolado',                 nota:'',                                tamano:'MD', precio:0.60, unidad:'por pieza' },
  { id:'ac15', nombre:'Encolado',                 nota:'',                                tamano:'GD', precio:1.20, unidad:'por pieza' },
  { id:'ac16', nombre:'Pegado lineal',            nota:'Folders, cajas simples',          tamano:'CH', precio:0.30, unidad:'por pieza' },
  { id:'ac17', nombre:'Pegado lineal',            nota:'',                                tamano:'MD', precio:0.60, unidad:'por pieza' },
  { id:'ac18', nombre:'Pegado lineal',            nota:'',                                tamano:'GD', precio:1.20, unidad:'por pieza' },
  { id:'ac19', nombre:'Pegado fondo automático',  nota:'',                                tamano:'CH', precio:0.90, unidad:'por pieza' },
  { id:'ac20', nombre:'Pegado fondo automático',  nota:'',                                tamano:'MD', precio:1.80, unidad:'por pieza' },
  { id:'ac21', nombre:'Pegado fondo automático',  nota:'',                                tamano:'GD', precio:3.60, unidad:'por pieza' },
];
function getAcabados() {
  try {
    const raw = localStorage.getItem('sustrato_acabados');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return arr; }
  } catch {}
  return DEFAULT_ACABADOS.map(x => ({...x}));
}
function saveAcabados(arr) {
  localStorage.setItem('sustrato_acabados', JSON.stringify(arr));
}

const DEFAULT_PRODUCCION = [
  { id:'pr1', nombre:'Corte a prensa',         nota:'Se suma sobre el costo de papel',      tamano:'—',              precio:'5%',  unidad:'sobre papel' },
  { id:'pr2', nombre:'Láminas para impresión', nota:'4 láminas = color completo CMYK',      tamano:'CH 459×525 mm',  precio:'80',  unidad:'por lámina' },
  { id:'pr3', nombre:'Láminas para impresión', nota:'',                                     tamano:'MD 605×745 mm',  precio:'160', unidad:'por lámina' },
  { id:'pr4', nombre:'Láminas para impresión', nota:'',                                     tamano:'GD 790×1030 mm', precio:'320', unidad:'por lámina' },
  { id:'pr5', nombre:'Impresión',              nota:'Unitario por color · 1 a 1,000 pzas',  tamano:'CH',             precio:'80',  unidad:'por color' },
  { id:'pr6', nombre:'Impresión',              nota:'',                                     tamano:'MD',             precio:'160', unidad:'por color' },
  { id:'pr7', nombre:'Impresión',              nota:'',                                     tamano:'GD',             precio:'320', unidad:'por color' },
];
function getProduccion() {
  try {
    const raw = localStorage.getItem('sustrato_produccion');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return arr; }
  } catch {}
  return DEFAULT_PRODUCCION.map(x => ({...x}));
}
function saveProduccion(arr) {
  localStorage.setItem('sustrato_produccion', JSON.stringify(arr));
}

const DEFAULT_RECUBRIMIENTOS = [
  { id:'rc1',  nombre:'Barniz máquina',                      nota:'De 1 a 1,000 pzas por lado', tamano:'CH',         precio:'100',  unidad:'por lado' },
  { id:'rc2',  nombre:'Barniz máquina',                      nota:'',                            tamano:'MD',         precio:'200',  unidad:'por lado' },
  { id:'rc3',  nombre:'Barniz máquina',                      nota:'',                            tamano:'GD',         precio:'400',  unidad:'por lado' },
  { id:'rc4',  nombre:'Barniz UV Brillante',                 nota:'Mín. $500',                   tamano:'CH/MD/GD',   precio:'2.50', unidad:'por m²' },
  { id:'rc5',  nombre:'Barniz UV Mate',                      nota:'Mín. $1,000',                 tamano:'CH/MD/GD',   precio:'5.00', unidad:'por m²' },
  { id:'rc6',  nombre:'Plástico Brillante',                  nota:'Mín. $500',                   tamano:'CH/MD/GD',   precio:'6.00', unidad:'por m²' },
  { id:'rc7',  nombre:'Plástico Mate',                       nota:'Mín. $500',                   tamano:'CH/MD/GD',   precio:'7.00', unidad:'por m²' },
  { id:'rc8',  nombre:'Arreglo de barniz a registro',        nota:'Una sola vez por proyecto',   tamano:'CH',         precio:'1000', unidad:'por proyecto' },
  { id:'rc9',  nombre:'Arreglo de barniz a registro',        nota:'',                            tamano:'MD',         precio:'2000', unidad:'por proyecto' },
  { id:'rc10', nombre:'Arreglo de barniz a registro',        nota:'',                            tamano:'GD',         precio:'3000', unidad:'por proyecto' },
  { id:'rc11', nombre:'Aplicación barniz registro UV Br.',   nota:'Mín. $1,800',                 tamano:'CH/MD/GD',   precio:'7.00', unidad:'por m²' },
];
function getRecubrimientos() {
  try {
    const raw = localStorage.getItem('sustrato_recubrimientos');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return arr; }
  } catch {}
  return DEFAULT_RECUBRIMIENTOS.map(x => ({...x}));
}
function saveRecubrimientos(arr) {
  localStorage.setItem('sustrato_recubrimientos', JSON.stringify(arr));
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
}

// ─── Views registry (populated by each view file) ────────────────
const views = {};

// ─── Title / subtitle maps ────────────────────────────────────────
const titles = {
  cotizar:  'Nueva cotización',
  procesos: 'Procesos de producción',
  maquinas: 'Máquinas',
  sustratos:'Sustratos & Mermas',
  dashboard:'Dashboard',
  plan:     'Plan y facturación',
  clientes: 'Clientes',
  tarifario:'Tarifario de servicios',
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
};

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

// ─── Boot ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  startTimer();
  showView('cotizar', document.querySelector('.nav-item.active'));
});
