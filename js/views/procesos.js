views['procesos'] = {
  render() {
    document.getElementById('app').innerHTML = `
<div class="view active">
  <div class="content">
    <p style="font-size:13px;color:var(--text2);margin-bottom:18px;font-weight:500">Selecciona el tipo de proyecto. Los procesos obligatorios se activan según tu configuración.</p>
    <div class="type-selector">
      <div class="type-btn yellow active" id="tbtn-general">
        <div class="dot"></div><div class="tlabel">Impresión general</div><div class="tsub">Posters · tarjetas · fliers</div>
      </div>
      <div class="type-btn ggreen" id="tbtn-pliegos">
        <div class="dot"></div><div class="tlabel">Varios pliegos</div><div class="tsub">Revistas · libros · folletos</div>
      </div>
      <div class="type-btn blue" id="tbtn-empaque">
        <div class="dot"></div><div class="tlabel">Empaque</div><div class="tsub">Corrugado · plegadizo</div>
      </div>
    </div>
    <div class="legend">
      <div class="legend-item"><div class="ldot ld-o"></div>Obligatorio (de tu configuración)</div>
      <div class="legend-item"><div class="ldot ld-op"></div>Opcional</div>
    </div>
    <div id="proc-grid"></div>
  </div>
  <div class="sticky-footer">
    <div class="foot-summary"><strong id="cnt-oblig">0</strong> obligatorios · <strong id="cnt-opc">0</strong> opcionales activos</div>
    <button class="btn-primary" style="margin-left:auto" id="btn-usar-procs">Usar en cotización →</button>
  </div>
</div>
`;
  },

  init() {
    const PROCS = [
      {id:'diseno',     name:'Diseño',              sub:'Nivel básico (A) · Intermedio (B) · Complejo (C)', cat:'Pre-prensa'},
      {id:'foto',       name:'Fotografía',           sub:'Por toma',                                         cat:'Pre-prensa'},
      {id:'prueba',     name:'Prueba de color',      sub:'Chica 33×45 · Mediana 61×45 · Grande 61×80',       cat:'Pre-prensa'},
      {id:'negpos',     name:'Negativo / Positivo',  sub:'Chico · Mediano · Grande',                         cat:'Pre-prensa'},
      {id:'papeles',    name:'Papeles',              sub:'Tabla anexa de sustratos',                          cat:'Materiales'},
      {id:'laminas',    name:'Láminas para impresión',sub:'Según máquina seleccionada',                      cat:'Materiales'},
      {id:'impresion',  name:'Impresión',            sub:'4 tintas CMYK',                                     cat:'Producción'},
      {id:'recubr',     name:'Recubrimiento',        sub:'Barniz máquina · Acrílico · UV · Plástico mate',   cat:'Producción'},
      {id:'recubr_r',   name:'Recubrimiento a registro',sub:'Solo áreas específicas',                        cat:'Producción'},
      {id:'grabados',   name:'Grabados',             sub:'Hotstamping · Grabado en seco · Arreglo',          cat:'Producción'},
      {id:'suaje',      name:'Suaje',                sub:'Matriz · Arreglo · Suajado · Plecado · Desbarbado',cat:'Acabados'},
      {id:'redondeo',   name:'Redondeo de esquinas', sub:'',                                                  cat:'Acabados'},
      {id:'ponchado',   name:'Ponchado',             sub:'Orificio chico o mediano',                          cat:'Acabados'},
      {id:'compag',     name:'Compaginado',          sub:'Manual o automático',                               cat:'Acabados'},
      {id:'encuad',     name:'Encuadernado',         sub:'Rústico · Hotmelt · Grapa · Encolado de forma',    cat:'Acabados'},
      {id:'doblez',     name:'Doblez',               sub:'Cruz · Mapa · Tríptico · Díptico · Arreglo',       cat:'Acabados'},
      {id:'wire',       name:'Wire-O / Arillo',      sub:'Metálico · Espiral · Gancho para colgar',          cat:'Acabados'},
      {id:'corte',      name:'Corte',                sub:'Guillotina · Trilateral',                           cat:'Acabados'},
      {id:'folio',      name:'Folio / Perforado',    sub:'Foliado numerado o perforado',                      cat:'Acabados'},
      {id:'pegado',     name:'Pegado',               sub:'Folders · Caja lineal · Fondo automático',         cat:'Acabados'},
      {id:'empacado',   name:'Empacado',             sub:'Por caja o por empaque individual',                 cat:'Logística'},
      {id:'envarillado',name:'Envarillado',          sub:'Superior o inferior',                               cat:'Logística'},
      {id:'empalmado',  name:'Empalmado',            sub:'SBS+Micro · SBS+Corrugado · Liner+Micro · Liner+Corrugado', cat:'Logística'},
      {id:'envio',      name:'Envío',                sub:'Por pieza · Por kilo · Por distancia',              cat:'Logística'},
    ];

    const OBLIG = {
      general: ['diseno','foto','prueba','papeles','laminas','impresion','recubr','grabados','suaje','redondeo','ponchado','corte','empacado','envio'],
      pliegos: ['diseno','foto','prueba','papeles','laminas','impresion','recubr','recubr_r','grabados','suaje','redondeo','ponchado','compag','encuad','doblez','wire','corte','empacado','envarillado','envio'],
      empaque: ['diseno','foto','prueba','negpos','papeles','laminas','impresion','recubr','recubr_r','grabados','suaje','pegado','empacado','empalmado','envio'],
    };

    let curType = 'general';
    const optSel = {};

    function renderProcs() {
      const ob   = OBLIG[curType];
      const grid = document.getElementById('proc-grid');
      grid.innerHTML = '';
      let lastCat = '';
      PROCS.forEach(p => {
        if (p.cat !== lastCat) {
          const d = document.createElement('div');
          d.className = 'proc-section';
          d.textContent = p.cat;
          grid.appendChild(d);
          lastCat = p.cat;
        }
        const isOb  = ob.includes(p.id);
        const isSel = isOb || optSel[curType + p.id];
        const row   = document.createElement('div');
        row.className = 'proc-row' + (isOb ? ' oblig' : '');
        row.innerHTML = `<div class="proc-check ${isOb ? 'locked' : isSel ? 'checked' : ''}"></div><div class="proc-info"><div class="proc-name">${p.name}</div>${p.sub ? '<div class="proc-sub">' + p.sub + '</div>' : ''}</div><span class="proc-badge ${isOb ? 'pb-oblig' : 'pb-opc'}">${isOb ? 'Obligatorio' : 'Opcional'}</span>`;
        if (!isOb) row.onclick = () => { optSel[curType + p.id] = !optSel[curType + p.id]; renderProcs(); };
        grid.appendChild(row);
      });
      document.getElementById('cnt-oblig').textContent = ob.length;
      document.getElementById('cnt-opc').textContent   = PROCS.filter(p => !ob.includes(p.id) && optSel[curType + p.id]).length;
    }

    function switchType(t, btn) {
      curType = t;
      document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProcs();
    }

    document.getElementById('tbtn-general').addEventListener('click', function() { switchType('general', this); });
    document.getElementById('tbtn-pliegos').addEventListener('click', function() { switchType('pliegos', this); });
    document.getElementById('tbtn-empaque').addEventListener('click', function() { switchType('empaque', this); });
    document.getElementById('btn-usar-procs').addEventListener('click', () => alert('Procesos guardados para esta cotización'));

    renderProcs();
  }
};
