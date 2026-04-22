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
    const PROCS = getProcesos();

    const OBLIG = {
      general: ['diseno','foto','prueba','papeles','laminas','impresion','recubr','grabados','suaje','redondeo','ponchado','corte','empacado','envio'],
      pliegos: ['diseno','foto','prueba','papeles','laminas','impresion','recubr','recubr_r','grabados','suaje','redondeo','ponchado','compag','encuad','doblez','wire','corte','empacado','envarillado','envio'],
      empaque: ['diseno','foto','prueba','negpos','papeles','laminas','impresion','recubr','recubr_r','grabados','suaje','pegado','empacado','empalmado','envio'],
    };

    let curType = 'general';
    const optSel = {};

    // ── Precio mínimo desde tarifario ────────────────────────────
    function precioLabel(proc) {
      if (!proc.tarifaSrc || !proc.tarifaNombres.length) return '';
      const arr = proc.tarifaSrc === 'rc' ? getRecubrimientos()
                : proc.tarifaSrc === 'ac' ? getAcabados()
                : proc.tarifaSrc === 'pp' ? getPreprensa()
                : getProduccion();
      const entries = proc.tarifaNombres.flatMap(nom => arr.filter(x => x.nombre === nom));
      if (!entries.length) return '';
      const min = Math.min(...entries.map(e => parseFloat(e.precio) || 0));
      return `desde ${fmtMXN(min)} · ${entries[0]?.unidad || ''}`;
    }

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
        const precio = precioLabel(p);
        const row   = document.createElement('div');
        row.className = 'proc-row' + (isOb ? ' oblig' : '');
        row.innerHTML = `
          <div class="proc-check ${isOb ? 'locked' : isSel ? 'checked' : ''}"></div>
          <div class="proc-info">
            <div class="proc-name">${p.name}</div>
            ${p.sub ? '<div class="proc-sub">' + p.sub + '</div>' : ''}
          </div>
          ${precio ? `<span class="proc-precio">${precio}</span>` : ''}
          <span class="proc-badge ${isOb ? 'pb-oblig' : 'pb-opc'}">${isOb ? 'Obligatorio' : 'Opcional'}</span>
        `;
        if (!isOb) {
          row.onclick = () => {
            optSel[curType + p.id] = !optSel[curType + p.id];
            // Persistir active en el store global
            const procs = getProcesos();
            const stored = procs.find(x => x.id === p.id);
            if (stored) { stored.active = !stored.active; saveProcesos(procs); }
            renderProcs();
          };
        }
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

    document.getElementById('btn-usar-procs').addEventListener('click', () => {
      showView('cotizar', document.querySelector('.nav-item[onclick*="cotizar"]'));
    });

    renderProcs();
  }
};
