views['dashboard'] = {
  render() {
    document.getElementById('app').innerHTML = `
<div class="content">
  <div class="dash-metrics">
    <div class="dmet"><div class="dmet-label">Cotizaciones hoy</div><div class="dmet-val" id="dm-hoy">0</div></div>
    <div class="dmet"><div class="dmet-label">Este mes</div><div class="dmet-val" id="dm-mes">0</div></div>
    <div class="dmet"><div class="dmet-label">Valor cotizado</div><div class="dmet-val" id="dm-valor">$0</div></div>
    <div class="dmet"><div class="dmet-label">Margen promedio</div><div class="dmet-val green" id="dm-margen">—</div></div>
  </div>
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div class="card-title" style="margin-bottom:0">Cotizaciones recientes</div>
      <button class="btn-primary" id="btn-dash-nueva" style="font-size:12px;padding:7px 16px">
        <svg width="13" height="13" fill="none" viewBox="0 0 16 16" style="vertical-align:middle;margin-right:5px"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Nueva cotización
      </button>
    </div>
    <div id="dash-table-wrap"></div>
  </div>
</div>

<!-- Modal confirmar nota de venta -->
<div class="nv-modal-bg" id="nv-modal-bg" style="display:none">
  <div class="nv-modal">
    <div class="nv-modal-icon">
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.6"/><path d="M14 8v6l4 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="nv-modal-title">Confirmar pedido</div>
    <div class="nv-modal-body" id="nv-modal-body">
      Estás a punto de marcar esta cotización como <strong>pedido confirmado</strong>.
    </div>
    <div class="nv-modal-foot">
      <button class="btn-ghost" id="nv-cancel">Cancelar</button>
      <button class="btn-primary" id="nv-confirm">Confirmar pedido →</button>
    </div>
  </div>
</div>

<!-- Modal editar cotización -->
<div class="nv-modal-bg" id="edit-modal-bg" style="display:none">
  <div class="nv-modal" style="max-width:400px">
    <div class="nv-modal-title" style="margin-bottom:18px">Editar cotización</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div>
        <label style="font-size:11px;font-weight:600;color:var(--text2);display:block;margin-bottom:4px">Nombre del proyecto</label>
        <input id="edit-nom" class="form-input" style="width:100%;box-sizing:border-box" type="text" placeholder="Nombre del proyecto"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:600;color:var(--text2);display:block;margin-bottom:4px">Cliente</label>
        <input id="edit-cliente" class="form-input" style="width:100%;box-sizing:border-box" type="text" placeholder="Nombre del cliente"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:600;color:var(--text2);display:block;margin-bottom:4px">Margen (%)</label>
        <input id="edit-margen" class="form-input" style="width:100%;box-sizing:border-box" type="number" min="0" max="99" placeholder="30"/>
      </div>
    </div>
    <div class="nv-modal-foot" style="margin-top:20px">
      <button class="btn-ghost" id="edit-cancel">Cancelar</button>
      <button class="btn-primary" id="edit-save">Guardar cambios →</button>
    </div>
  </div>
</div>

<!-- Modal confirmar eliminar -->
<div class="nv-modal-bg" id="del-modal-bg" style="display:none">
  <div class="nv-modal" style="max-width:360px">
    <div class="nv-modal-icon" style="color:#E05555">
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="1.6"/><path d="M10 10l8 8M18 10l-8 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
    </div>
    <div class="nv-modal-title">Eliminar cotización</div>
    <div class="nv-modal-body" id="del-modal-body">¿Estás seguro? Esta acción no se puede deshacer.</div>
    <div class="nv-modal-foot">
      <button class="btn-ghost" id="del-cancel">Cancelar</button>
      <button class="btn-primary" id="del-confirm" style="background:#E05555;border-color:#E05555">Eliminar</button>
    </div>
  </div>
</div>
`;
  },

  init() {
    // ── Nueva cotización ──────────────────────────────────────────
    document.getElementById('btn-dash-nueva').addEventListener('click', () => {
      showView('cotizar', document.querySelector('.nav-item[onclick*="cotizar"]'));
    });

    const cots = getCotizaciones();
    const now  = new Date();
    const hoy  = now.toISOString().slice(0, 10);
    const mes  = now.toISOString().slice(0, 7);

    // ── Métricas ──────────────────────────────────────────────────
    const cotHoy  = cots.filter(c => c.fecha.slice(0, 10) === hoy);
    const cotMes  = cots.filter(c => c.fecha.slice(0, 7) === mes);
    const valorMes = cotMes.reduce((s, c) => s + (c.precioVenta || 0), 0);
    const margenAvg = cotMes.length
      ? Math.round(cotMes.reduce((s, c) => s + (c.margenPct || 0), 0) / cotMes.length)
      : null;

    function countUp(el, target, prefix, suffix, duration) {
      if (!el) return;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * ease).toLocaleString('es-MX') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    countUp(document.getElementById('dm-hoy'),   cotHoy.length, '', '',  600);
    countUp(document.getElementById('dm-mes'),   cotMes.length, '', '',  750);

    const valEl = document.getElementById('dm-valor');
    if (valEl) {
      const startVal = performance.now();
      const durVal = 850;
      function tickVal(now) {
        const p = Math.min((now - startVal) / durVal, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        valEl.textContent = fmtMXN(valorMes * ease);
        if (p < 1) requestAnimationFrame(tickVal);
      }
      requestAnimationFrame(tickVal);
    }

    if (margenAvg !== null) {
      countUp(document.getElementById('dm-margen'), margenAvg, '', '%', 850);
    }

    // ── Tabla ─────────────────────────────────────────────────────
    const wrap = document.getElementById('dash-table-wrap');
    if (!cots.length) {
      wrap.innerHTML = `<div class="dash-empty">
        <svg width="40" height="40" fill="none" viewBox="0 0 40 40" style="color:var(--border2)"><rect x="7" y="5" width="26" height="30" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M13 15h14M13 21h14M13 27h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <p>Aún no hay cotizaciones guardadas.<br/>Las cotizaciones aparecerán aquí al descargar el PDF o enviar por WhatsApp.</p>
      </div>`;
      return;
    }

    let pendingNvId  = null;
    let pendingDelId = null;
    let pendingEditId = null;

    const rows = cots.slice(0, 50).map(c => {
      const fecha   = new Date(c.fecha).toLocaleDateString('es-MX', { day:'2-digit', month:'short' });
      const valor   = fmtMXN(c.precioVenta || 0);
      const margen  = (c.margenPct || 0) + '%';
      const esNota  = c.estado === 'nota_venta';
      const estadoBadge = esNota
        ? `<span class="badge badge-nota">Nota de venta</span>`
        : `<span class="badge badge-cot">Cotización</span>`;

      const pdfBtn = `<button class="dash-icon-btn dash-pdf-btn" data-id="${c.id}" title="Descargar PDF">
        <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.4"/><path d="M10 2v4h4M8 8v4M6 10l2 2 2-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;
      const editBtn = `<button class="dash-icon-btn dash-edit-btn" data-id="${c.id}" title="Editar">
        <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M11 2l3 3-9 9H2v-3L11 2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
      </button>`;
      const delBtn = `<button class="dash-icon-btn dash-del-btn" data-id="${c.id}" title="Eliminar">
        <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;

      const nvBtn = !esNota
        ? `<button class="dash-nv-btn" data-id="${c.id}" title="Confirmar pedido">
             <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
             Confirmar
           </button>`
        : '';

      return `<tr data-id="${c.id}" class="${esNota ? 'tr-nota' : ''}">
        <td><span class="dash-proyecto">${c.nom}</span><br/><span style="font-size:10px;color:var(--text3)">${fecha}</span></td>
        <td>${c.tipo || '—'}</td>
        <td>${c.clientNombre || '<span style="color:var(--text3)">—</span>'}</td>
        <td>${(c.cant||0).toLocaleString('es-MX')}</td>
        <td>${c.maqName || '—'}</td>
        <td style="font-weight:600">${valor}</td>
        <td style="color:var(--teal);font-weight:700">${margen}</td>
        <td>${estadoBadge}</td>
        <td>
          <div style="display:flex;gap:4px;align-items:center">
            ${pdfBtn}${editBtn}${delBtn}${nvBtn}
          </div>
        </td>
      </tr>`;
    }).join('');

    wrap.innerHTML = `
      <table class="recent-table">
        <thead><tr>
          <th>Proyecto</th><th>Tipo</th><th>Cliente</th><th>Cantidad</th>
          <th>Máquina</th><th>Valor</th><th>Margen</th><th>Estado</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;

    // ── Stagger animation ─────────────────────────────────────────
    wrap.querySelectorAll('tbody tr').forEach((tr, i) => {
      tr.style.opacity = '0';
      tr.style.transform = 'translateX(-8px)';
      tr.style.transition = 'opacity .22s ease, transform .22s ease';
      setTimeout(() => { tr.style.opacity = '1'; tr.style.transform = 'none'; }, 120 + i * 55);
    });

    // ── PDF ───────────────────────────────────────────────────────
    wrap.querySelectorAll('.dash-pdf-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cot = cots.find(c => c.id === btn.dataset.id);
        if (cot) generarPDFCotizacion(cot);
      });
    });

    // ── Editar ────────────────────────────────────────────────────
    const editModal  = document.getElementById('edit-modal-bg');
    const editNom    = document.getElementById('edit-nom');
    const editCli    = document.getElementById('edit-cliente');
    const editMar    = document.getElementById('edit-margen');

    wrap.querySelectorAll('.dash-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingEditId = btn.dataset.id;
        const cot = cots.find(c => c.id === pendingEditId);
        if (!cot) return;
        editNom.value = cot.nom || '';
        editCli.value = cot.clientNombre || '';
        editMar.value = cot.margenPct ?? 30;
        editModal.style.display = 'flex';
        setTimeout(() => editNom.focus(), 80);
      });
    });

    document.getElementById('edit-cancel').addEventListener('click', () => {
      editModal.style.display = 'none'; pendingEditId = null;
    });
    editModal.addEventListener('click', e => {
      if (e.target === editModal) { editModal.style.display = 'none'; pendingEditId = null; }
    });

    document.getElementById('edit-save').addEventListener('click', () => {
      if (!pendingEditId) return;
      const arr = getCotizaciones();
      const cot = arr.find(c => c.id === pendingEditId);
      if (cot) {
        cot.nom          = editNom.value.trim() || cot.nom;
        cot.clientNombre = editCli.value.trim();
        const newMargen  = parseFloat(editMar.value);
        if (!isNaN(newMargen)) {
          cot.margenPct   = newMargen;
          cot.precioVenta = newMargen >= 100 ? cot.costoTotal : cot.costoTotal / (1 - newMargen / 100);
        }
        saveCotizaciones(arr);
      }
      editModal.style.display = 'none';
      pendingEditId = null;
      views['dashboard'].render();
      views['dashboard'].init();
    });

    // ── Eliminar ──────────────────────────────────────────────────
    const delModal  = document.getElementById('del-modal-bg');
    const delBody   = document.getElementById('del-modal-body');

    wrap.querySelectorAll('.dash-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingDelId = btn.dataset.id;
        const cot = cots.find(c => c.id === pendingDelId);
        delBody.innerHTML = `¿Eliminar <strong>"${cot?.nom || 'esta cotización'}"</strong>? Esta acción no se puede deshacer.`;
        delModal.style.display = 'flex';
      });
    });

    document.getElementById('del-cancel').addEventListener('click', () => {
      delModal.style.display = 'none'; pendingDelId = null;
    });
    delModal.addEventListener('click', e => {
      if (e.target === delModal) { delModal.style.display = 'none'; pendingDelId = null; }
    });

    document.getElementById('del-confirm').addEventListener('click', () => {
      if (!pendingDelId) return;
      saveCotizaciones(getCotizaciones().filter(c => c.id !== pendingDelId));
      delModal.style.display = 'none';
      pendingDelId = null;
      views['dashboard'].render();
      views['dashboard'].init();
    });

    // ── Confirmar pedido ──────────────────────────────────────────
    const nvModal  = document.getElementById('nv-modal-bg');
    const nvBody   = document.getElementById('nv-modal-body');

    wrap.querySelectorAll('.dash-nv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingNvId = btn.dataset.id;
        const cot = cots.find(c => c.id === pendingNvId);
        nvBody.innerHTML = `Estás a punto de marcar <strong>"${cot?.nom || 'esta cotización'}"</strong> como <strong>pedido confirmado</strong>. Esta acción no puede revertirse.`;
        nvModal.style.display = 'flex';
      });
    });

    document.getElementById('nv-cancel').addEventListener('click', () => {
      nvModal.style.display = 'none'; pendingNvId = null;
    });
    nvModal.addEventListener('click', e => {
      if (e.target === nvModal) { nvModal.style.display = 'none'; pendingNvId = null; }
    });

    document.getElementById('nv-confirm').addEventListener('click', () => {
      if (!pendingNvId) return;
      convertirANotaVenta(pendingNvId);
      nvModal.style.display = 'none';
      views['dashboard'].render();
      views['dashboard'].init();
    });
  }
};
