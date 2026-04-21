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
    <div class="card-title">Cotizaciones recientes</div>
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
      Estás a punto de marcar esta cotización como <strong>pedido confirmado</strong>. Esto indica que el cliente aceptó la propuesta y el trabajo pasará a producción. Esta acción no puede revertirse.
    </div>
    <div class="nv-modal-foot">
      <button class="btn-ghost" id="nv-cancel">Cancelar</button>
      <button class="btn-primary" id="nv-confirm">Confirmar pedido →</button>
    </div>
  </div>
</div>
`;
  },

  init() {
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

    countUp(document.getElementById('dm-hoy'),   cotHoy.length,  '', '',   600);
    countUp(document.getElementById('dm-mes'),   cotMes.length,  '', '',   750);

    // Valor con formato $Xk / $X
    const valEl = document.getElementById('dm-valor');
    if (valorMes >= 1000) {
      countUp(valEl, Math.round(valorMes / 1000), '$', 'k', 850);
    } else {
      countUp(valEl, valorMes, '$', '', 850);
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

    let pendingNvId = null;

    const rows = cots.slice(0, 50).map(c => {
      const fecha = new Date(c.fecha).toLocaleDateString('es-MX', { day:'2-digit', month:'short' });
      const valor = '$' + Math.round(c.precioVenta || 0).toLocaleString('es-MX');
      const margen = (c.margenPct || 0) + '%';
      const esNota = c.estado === 'nota_venta';
      const estadoBadge = esNota
        ? `<span class="badge badge-nota">Nota de venta</span>`
        : `<span class="badge badge-cot">Cotización</span>`;
      const accion = esNota
        ? `<span style="color:var(--text3);font-size:11px">—</span>`
        : `<button class="dash-nv-btn" data-id="${c.id}" title="Convertir a nota de venta">
             <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
             Confirmar pedido
           </button>`;
      return `<tr data-id="${c.id}" class="${esNota ? 'tr-nota' : ''}">
        <td><span class="dash-proyecto">${c.nom}</span><br/><span style="font-size:10px;color:var(--text3)">${fecha}</span></td>
        <td>${c.tipo || '—'}</td>
        <td>${c.clientNombre || '<span style="color:var(--text3)">—</span>'}</td>
        <td>${(c.cant||0).toLocaleString('es-MX')}</td>
        <td>${c.maqName || '—'}</td>
        <td style="font-weight:600">${valor}</td>
        <td style="color:var(--teal);font-weight:700">${margen}</td>
        <td>${estadoBadge}</td>
        <td>${accion}</td>
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

    // ── Botones "Confirmar pedido" ────────────────────────────────
    const modal   = document.getElementById('nv-modal-bg');
    const body    = document.getElementById('nv-modal-body');
    const btnConf = document.getElementById('nv-confirm');
    const btnCan  = document.getElementById('nv-cancel');

    wrap.querySelectorAll('.dash-nv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingNvId = btn.dataset.id;
        const cot = cots.find(c => c.id === pendingNvId);
        body.innerHTML = `Estás a punto de marcar <strong>"${cot?.nom || 'esta cotización'}"</strong> como <strong>pedido confirmado</strong>. Esto indica que el cliente aceptó la propuesta y el trabajo pasará a producción. Esta acción no puede revertirse.`;
        modal.style.display = 'flex';
      });
    });

    btnCan.addEventListener('click', () => { modal.style.display = 'none'; pendingNvId = null; });
    modal.addEventListener('click', e => { if (e.target === modal) { modal.style.display = 'none'; pendingNvId = null; } });

    btnConf.addEventListener('click', () => {
      if (!pendingNvId) return;
      convertirANotaVenta(pendingNvId);
      modal.style.display = 'none';
      // Refresh view
      views['dashboard'].render();
      views['dashboard'].init();
    });
  }
};
