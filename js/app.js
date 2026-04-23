// ─── Shared state ────────────────────────────────────────────────
let sec = 0, timerOn = false, timerInt;

// ─── Global money formatter ───────────────────────────────────────
function fmtMXN(n) {
  const num = parseFloat(String(n).replace(/[$,]/g, '')) || 0;
  return '$' + num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Machine store (localStorage-backed) ─────────────────────────
const DEFAULT_MERMAS = [
  { desde: 100,   hasta: 500,   merma: 200 },
  { desde: 501,   hasta: 1000,  merma: 300 },
  { desde: 1001,  hasta: 5000,  merma: 400 },
  { desde: 5001,  hasta: 10000, merma: 700 },
  { desde: 10001, hasta: null,  merma: 750 },
];
const DEFAULT_MACHINES = [
  { id:'PM52',  name:'PM52',  tag:'Chica',   tamW:37,  tamH:51,  utilW:35, utilH:49,  gramaje:'16 pts', cph:850,  pliegoPrice:0.45, mermas: DEFAULT_MERMAS.map(r=>({...r})) },
  { id:'PM74',  name:'PM74',  tag:'Mediana', tamW:52,  tamH:72,  utilW:50, utilH:70,  gramaje:'20 pts', cph:1200, pliegoPrice:0.65, mermas: DEFAULT_MERMAS.map(r=>({...r})) },
  { id:'CD102', name:'CD102', tag:'Grande',  tamW:72,  tamH:102, utilW:79, utilH:100, gramaje:'24 pts', cph:2100, pliegoPrice:1.20, mermas: DEFAULT_MERMAS.map(r=>({...r})) },
];
function getMachines() {
  try {
    const raw = localStorage.getItem('sustrato_machines');
    if (raw) {
      const arr = JSON.parse(raw);
      if (arr.length) return arr.map(m => ({
        ...m,
        mermas: m.mermas || DEFAULT_MERMAS.map(r => ({...r}))
      }));
    }
  } catch {}
  return DEFAULT_MACHINES.map(m => ({...m, mermas: m.mermas.map(r=>({...r}))}));
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
// Devuelve la merma para cantidad n según los rangos configurados por máquina.
// Si maqId no se provee o la máquina no tiene rangos, usa tabla global por defecto.
function getMerma(n, maqId) {
  if (maqId) {
    const maq = getMachines().find(m => m.id === maqId);
    if (maq && maq.mermas && maq.mermas.length) {
      const rng = maq.mermas.find(r => n >= r.desde && (r.hasta === null || n <= r.hasta));
      return rng ? rng.merma : 0;
    }
  }
  // Fallback global
  return n <= 500 ? 200 : n <= 1000 ? 300 : n <= 5000 ? 400 : n <= 10000 ? 700 : 750;
}

// ─── Papeles store ────────────────────────────────────────────────
const DEFAULT_PAPELES = [
  // BOND
  { id:'pap-1',  categoria:'BOND',               material:'Bond',              medida:'57X87',  puntos:null, gramos:75,  precioMillar:1057, observaciones:'', maquina:'' },
  { id:'pap-2',  categoria:'BOND',               material:'Bond',              medida:'57X87',  puntos:null, gramos:90,  precioMillar:1198, observaciones:'', maquina:'' },
  { id:'pap-3',  categoria:'BOND',               material:'Bond',              medida:'58X88',  puntos:null, gramos:105, precioMillar:1356, observaciones:'', maquina:'' },
  { id:'pap-4',  categoria:'BOND',               material:'Bond',              medida:'58X88',  puntos:null, gramos:120, precioMillar:1526, observaciones:'', maquina:'' },
  // COUCHE
  { id:'pap-5',  categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:90,  precioMillar:1668, observaciones:'', maquina:'' },
  { id:'pap-6',  categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:100, precioMillar:1834, observaciones:'', maquina:'' },
  { id:'pap-7',  categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:115, precioMillar:1987, observaciones:'', maquina:'' },
  { id:'pap-8',  categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:135, precioMillar:2325, observaciones:'', maquina:'' },
  { id:'pap-9',  categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:150, precioMillar:2120, observaciones:'', maquina:'' },
  { id:'pap-10', categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:200, precioMillar:2987, observaciones:'', maquina:'' },
  { id:'pap-11', categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:250, precioMillar:3654, observaciones:'', maquina:'' },
  { id:'pap-12', categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:300, precioMillar:4120, observaciones:'', maquina:'' },
  { id:'pap-13', categoria:'COUCHE',             material:'Couché',            medida:'58X88',  puntos:null, gramos:350, precioMillar:4876, observaciones:'', maquina:'' },
  { id:'pap-14', categoria:'COUCHE',             material:'Couché',            medida:'70X100', puntos:null, gramos:150, precioMillar:3012, observaciones:'', maquina:'' },
  // OPALINA
  { id:'pap-15', categoria:'OPALINA',            material:'Opalina',           medida:'58X88',  puntos:null, gramos:130, precioMillar:2100, observaciones:'', maquina:'' },
  { id:'pap-16', categoria:'OPALINA',            material:'Opalina',           medida:'58X88',  puntos:null, gramos:180, precioMillar:2876, observaciones:'', maquina:'' },
  { id:'pap-17', categoria:'OPALINA',            material:'Opalina',           medida:'70X100', puntos:null, gramos:130, precioMillar:2658, observaciones:'', maquina:'' },
  // TEXCOTE
  { id:'pap-18', categoria:'TEXCOTE',            material:'Texcote C1S',       medida:'58X88',  puntos:12,   gramos:null,precioMillar:3245, observaciones:'Cara/vuelta', maquina:'PM52' },
  { id:'pap-19', categoria:'TEXCOTE',            material:'Texcote C2S',       medida:'58X88',  puntos:12,   gramos:null,precioMillar:3456, observaciones:'Dos caras',   maquina:'PM52' },
  { id:'pap-20', categoria:'TEXCOTE',            material:'Texcote C1S',       medida:'70X100', puntos:12,   gramos:null,precioMillar:4123, observaciones:'',             maquina:'PM74' },
  // SULFATADO
  { id:'pap-21', categoria:'SULFATADO',          material:'Sulfatado',         medida:'58X88',  puntos:12,   gramos:null,precioMillar:1456, observaciones:'', maquina:'' },
  { id:'pap-22', categoria:'SULFATADO',          material:'Sulfatado',         medida:'58X88',  puntos:14,   gramos:null,precioMillar:1765, observaciones:'', maquina:'' },
  { id:'pap-23', categoria:'SULFATADO',          material:'Sulfatado',         medida:'70X100', puntos:16,   gramos:null,precioMillar:2234, observaciones:'', maquina:'' },
  { id:'pap-24', categoria:'SULFATADO',          material:'Sulfatado',         medida:'70X100', puntos:18,   gramos:null,precioMillar:2456, observaciones:'', maquina:'' },
  { id:'pap-25', categoria:'SULFATADO',          material:'Sulfatado',         medida:'70X100', puntos:20,   gramos:null,precioMillar:2765, observaciones:'', maquina:'' },
  { id:'pap-26', categoria:'SULFATADO',          material:'Sulfatado',         medida:'70X100', puntos:24,   gramos:null,precioMillar:3123, observaciones:'', maquina:'' },
  // CARTULINA SULFATADA
  { id:'pap-27', categoria:'CARTULINA SULFATADA',material:'Cartulina Sulfatada',medida:'58X88', puntos:null, gramos:162, precioMillar:2456, observaciones:'', maquina:'' },
  { id:'pap-28', categoria:'CARTULINA SULFATADA',material:'Cartulina Sulfatada',medida:'58X88', puntos:null, gramos:215, precioMillar:3123, observaciones:'', maquina:'' },
  { id:'pap-29', categoria:'CARTULINA SULFATADA',material:'Cartulina Sulfatada',medida:'70X100',puntos:null, gramos:215, precioMillar:3876, observaciones:'', maquina:'' },
  // SBS MULTICAPA
  { id:'pap-30', categoria:'SBS MULTICAPA',      material:'SBS Multicapa',     medida:'70X96',  puntos:10,   gramos:215, precioMillar:4874, observaciones:'', maquina:'' },
  { id:'pap-31', categoria:'SBS MULTICAPA',      material:'SBS Multicapa',     medida:'70X96',  puntos:12,   gramos:215, precioMillar:5234, observaciones:'', maquina:'' },
  { id:'pap-32', categoria:'SBS MULTICAPA',      material:'SBS Multicapa',     medida:'79X109', puntos:10,   gramos:215, precioMillar:5876, observaciones:'', maquina:'' },
  // MICRO FLAUTA E
  { id:'pap-33', categoria:'MICRO FLAUTA E',     material:'Micro Flauta E',    medida:'36X50',  puntos:null, gramos:null,precioMillar:2185, observaciones:'Sin gramaje fijo', maquina:'' },
  { id:'pap-34', categoria:'MICRO FLAUTA E',     material:'Micro Flauta E',    medida:'50X70',  puntos:null, gramos:null,precioMillar:2987, observaciones:'', maquina:'' },
  // CORRUGADO FLAUTA B
  { id:'pap-35', categoria:'CORRUGADO FLAUTA B', material:'Corrugado Flauta B',medida:'36X50',  puntos:null, gramos:null,precioMillar:1415, observaciones:'', maquina:'' },
  { id:'pap-36', categoria:'CORRUGADO FLAUTA B', material:'Corrugado Flauta B',medida:'50X70',  puntos:null, gramos:null,precioMillar:1987, observaciones:'', maquina:'' },
  // HUEVERO
  { id:'pap-37', categoria:'HUEVERO',            material:'Huevero',           medida:'30X40',  puntos:null, gramos:null,precioMillar:987,  observaciones:'', maquina:'' },
  { id:'pap-38', categoria:'HUEVERO',            material:'Huevero',           medida:'50X70',  puntos:null, gramos:null,precioMillar:1654, observaciones:'', maquina:'' },
  // PLIEGOS VARIOS
  { id:'pap-39', categoria:'PLIEGOS VARIOS',     material:'Kraft',             medida:'70X100', puntos:null, gramos:null,precioMillar:654,  observaciones:'', maquina:'' },
  { id:'pap-40', categoria:'PLIEGOS VARIOS',     material:'Manila',            medida:'57X87',  puntos:null, gramos:null,precioMillar:543,  observaciones:'', maquina:'' },
];
function getPapeles() {
  try {
    const raw = localStorage.getItem('sustrato_papeles');
    if (raw) { const arr = JSON.parse(raw); if (arr.length) return arr; }
  } catch {}
  return DEFAULT_PAPELES.map(p => ({...p}));
}
function savePapeles(arr) {
  localStorage.setItem('sustrato_papeles', JSON.stringify(arr));
  if (typeof fsWrite === 'function') fsWrite('papeles', arr);
}

// ─── Pricing engine helpers ───────────────────────────────────────

// Devuelve $/pliego para un tipo+gramaje buscando en el catálogo de papeles.
// gramaje puede ser '75g' (gramos), '12 pts' (puntos), o '36X50' (medida).
// Busca por categoría (case-insensitive) detectando el tipo de identificador.
function getPapelPriceFor(tipoPapel, gramaje, fallback) {
  const papeles = getPapeles();
  const cat = (tipoPapel || '').toLowerCase();
  let entry;

  if (gramaje && /^\d+g$/.test(gramaje.trim())) {
    // Gramaje en gramos: '75g', '150g' …
    const g = parseInt(gramaje);
    entry = papeles.find(p => p.categoria.toLowerCase() === cat && p.gramos === g);
  } else if (gramaje && /pts/.test(gramaje)) {
    // Calibre en puntos: '12 pts', '14 pts' …
    const pts = parseInt(gramaje);
    entry = papeles.find(p => p.categoria.toLowerCase() === cat && p.puntos === pts);
  } else {
    // Medida directa: '36X50', '50X70' … (tipos sin gramaje fijo)
    entry = papeles.find(p => p.categoria.toLowerCase() === cat && p.medida === gramaje);
  }

  return entry ? entry.precioMillar / 1000 : (fallback || 0.65);
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
