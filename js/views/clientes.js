views['clientes'] = {
  _q: '',

  render() {
    document.getElementById('app').innerHTML = `
<div class="content" style="max-width:900px">

  <!-- Stats -->
  <div class="cl-stats-row">
    <div class="cl-stat-card">
      <div class="cl-stat-val" id="cl-s-total">0</div>
      <div class="cl-stat-lbl">Clientes registrados</div>
    </div>
    <div class="cl-stat-card">
      <div class="cl-stat-val" id="cl-s-nuevos">0</div>
      <div class="cl-stat-lbl">Nuevos este mes</div>
    </div>
    <div class="cl-stat-card">
      <div class="cl-stat-val" id="cl-s-empresas">0</div>
      <div class="cl-stat-lbl">Con empresa registrada</div>
    </div>
  </div>

  <!-- Toolbar -->
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
    <div class="cl-searchbar">
      <svg width="14" height="14" fill="none" viewBox="0 0 16 16" style="flex-shrink:0;color:var(--text3)">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.6"/>
        <path d="M10.5 10.5 14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
      <input id="cl-q" type="text" placeholder="Buscar por nombre, empresa o RFC…"/>
    </div>
    <button class="btn-primary" id="cl-add-btn" style="white-space:nowrap;flex-shrink:0">+ Nuevo cliente</button>
  </div>

  <!-- Table -->
  <div class="card" style="padding:0;overflow:hidden">
    <table class="cl-table">
      <thead><tr>
        <th>Cliente</th>
        <th>Contacto</th>
        <th>RFC</th>
        <th>Registrado</th>
        <th></th>
      </tr></thead>
      <tbody id="cl-tbody"></tbody>
    </table>
    <div id="cl-empty" style="display:none;padding:56px 24px;text-align:center">
      <div style="font-size:38px;margin-bottom:12px">👤</div>
      <div style="font-size:14px;font-weight:600;color:var(--navy);margin-bottom:4px">Sin clientes registrados</div>
      <div style="font-size:12px;color:var(--text3)">Agrega tu primer cliente para comenzar.</div>
    </div>
  </div>
</div>

<!-- Drawer overlay -->
<div class="cl-overlay" id="cl-overlay"></div>

<!-- Drawer -->
<div class="cl-drawer" id="cl-drawer">
  <div id="cl-drawer-inner" style="display:contents"></div>
</div>

<!-- Add/Edit modal -->
<div class="cl-modal-bg" id="cl-modal-bg" style="display:none">
  <div class="cl-modal" id="cl-modal"></div>
</div>
`;
  },

  init() {
    const self = this;

    function initials(c) {
      const p = (c.nombre || '?').trim().split(/\s+/);
      return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
    }

    function fmtDate(ts) {
      if (!ts) return '—';
      return new Date(ts).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function updateStats() {
      const all = getClientes();
      const month = 30 * 24 * 3600 * 1000;
      document.getElementById('cl-s-total').textContent = all.length;
      document.getElementById('cl-s-nuevos').textContent = all.filter(c => Date.now() - c.createdAt < month).length;
      document.getElementById('cl-s-empresas').textContent = all.filter(c => c.empresa).length;
    }

    // ── Table ──────────────────────────────────────────────────────
    function renderTable(q) {
      const all = getClientes();
      const items = q
        ? all.filter(c => (c.nombre + ' ' + (c.empresa || '') + ' ' + (c.rfc || '')).toLowerCase().includes(q.toLowerCase()))
        : all;

      const tbody = document.getElementById('cl-tbody');
      const empty = document.getElementById('cl-empty');

      if (!items.length) {
        tbody.innerHTML = '';
        empty.style.display = '';
        return;
      }
      empty.style.display = 'none';

      tbody.innerHTML = items.map(c => `
        <tr class="cl-row" data-id="${c.id}">
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="cl-avatar">${initials(c)}</div>
              <div>
                <div class="cl-name">${c.nombre}</div>
                ${c.empresa ? `<div class="cl-empresa">${c.empresa}</div>` : ''}
              </div>
            </div>
          </td>
          <td>
            <div class="cl-contact-cell">
              ${c.email ? `<span>${c.email}</span>` : ''}
              ${c.tel  ? `<span>${c.tel}</span>`  : ''}
              ${!c.email && !c.tel ? '<span style="color:var(--text3)">—</span>' : ''}
            </div>
          </td>
          <td>
            ${c.rfc
              ? `<span class="gramaje-tag" style="font-size:11px;font-weight:600">${c.rfc}</span>`
              : '<span style="color:var(--text3)">—</span>'}
          </td>
          <td style="color:var(--text3);font-size:12px;white-space:nowrap">${fmtDate(c.createdAt)}</td>
          <td><span class="save-link cl-open-btn">Ver / editar</span></td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.cl-row').forEach(row => {
        row.addEventListener('click', () => openDrawer(row.dataset.id));
      });
    }

    // ── Drawer ─────────────────────────────────────────────────────
    let _drawerId = null;
    let _editMode = false;

    function openDrawer(id) {
      _drawerId = id;
      _editMode = false;
      renderDrawer();
      document.getElementById('cl-drawer').classList.add('open');
      document.getElementById('cl-overlay').classList.add('open');
    }

    function closeDrawer() {
      document.getElementById('cl-drawer').classList.remove('open');
      document.getElementById('cl-overlay').classList.remove('open');
      setTimeout(() => { _drawerId = null; _editMode = false; }, 320);
    }

    function renderDrawer() {
      const c = getClientes().find(x => x.id === _drawerId);
      if (!c) return;
      const inner = document.getElementById('cl-drawer-inner');

      if (_editMode) {
        inner.innerHTML = `
          <div class="cl-drawer-header">
            <div class="cl-avatar cl-avatar-lg">${initials(c)}</div>
            <div style="flex:1;min-width:0">
              <div class="cl-drawer-name">${c.nombre}</div>
              ${c.empresa ? `<div class="cl-drawer-empresa">${c.empresa}</div>` : ''}
            </div>
            <button class="cl-close-btn" id="cl-x">✕</button>
          </div>
          <div class="cl-drawer-content">
            <div class="cl-drawer-section-label">Datos generales</div>
            <div class="fg" style="margin-bottom:12px"><label>Nombre completo *</label><input id="ed-nombre" value="${c.nombre}"/></div>
            <div class="fg" style="margin-bottom:18px"><label>Empresa</label><input id="ed-empresa" value="${c.empresa || ''}"/></div>
            <div class="cl-drawer-section-label">Contacto</div>
            <div class="fg" style="margin-bottom:12px"><label>Email</label><input id="ed-email" type="email" value="${c.email || ''}"/></div>
            <div class="fg" style="margin-bottom:12px"><label>Teléfono</label><input id="ed-tel" value="${c.tel || ''}"/></div>
            <div class="fg" style="margin-bottom:18px"><label>Dirección</label><input id="ed-dir" value="${c.direccion || ''}"/></div>
            <div class="cl-drawer-section-label">Datos fiscales</div>
            <div class="fg" style="margin-bottom:18px"><label>RFC</label><input id="ed-rfc" value="${c.rfc || ''}"/></div>
            <div class="cl-drawer-section-label">Notas</div>
            <div class="fg"><textarea id="ed-notas" rows="3" style="resize:vertical;width:100%;box-sizing:border-box">${c.notas || ''}</textarea></div>
          </div>
          <div class="cl-drawer-actions">
            <button class="btn-primary" id="cl-save-edit">Guardar cambios</button>
            <button class="btn-ghost" id="cl-cancel-edit">Cancelar</button>
          </div>
        `;

        document.getElementById('cl-x').addEventListener('click', closeDrawer);
        document.getElementById('cl-cancel-edit').addEventListener('click', () => { _editMode = false; renderDrawer(); });
        document.getElementById('cl-save-edit').addEventListener('click', () => {
          const nombre = document.getElementById('ed-nombre').value.trim();
          if (!nombre) { document.getElementById('ed-nombre').focus(); return; }
          const arr = getClientes().map(x => x.id === c.id ? {
            ...x,
            nombre,
            empresa:   document.getElementById('ed-empresa').value.trim(),
            email:     document.getElementById('ed-email').value.trim(),
            tel:       document.getElementById('ed-tel').value.trim(),
            direccion: document.getElementById('ed-dir').value.trim(),
            rfc:       document.getElementById('ed-rfc').value.trim(),
            notas:     document.getElementById('ed-notas').value.trim(),
          } : x);
          saveClientes(arr);
          _editMode = false;
          renderDrawer();
          renderTable(self._q);
          updateStats();
        });

      } else {
        inner.innerHTML = `
          <div class="cl-drawer-header">
            <div class="cl-avatar cl-avatar-lg">${initials(c)}</div>
            <div style="flex:1;min-width:0">
              <div class="cl-drawer-name">${c.nombre}</div>
              <div class="cl-drawer-empresa">${c.empresa || '<span style="opacity:.4">Sin empresa</span>'}</div>
            </div>
            <button class="cl-close-btn" id="cl-x">✕</button>
          </div>
          <div class="cl-drawer-content">
            <div class="cl-drawer-section-label">Contacto</div>
            <div class="cl-info-row">
              <span class="cl-info-key">Email</span>
              <span class="cl-info-val">${c.email || '<span style="color:var(--text3)">—</span>'}</span>
            </div>
            <div class="cl-info-row">
              <span class="cl-info-key">Teléfono</span>
              <span class="cl-info-val">${c.tel || '<span style="color:var(--text3)">—</span>'}</span>
            </div>
            <div class="cl-info-row">
              <span class="cl-info-key">Dirección</span>
              <span class="cl-info-val">${c.direccion || '<span style="color:var(--text3)">—</span>'}</span>
            </div>
            <div class="cl-drawer-section-label" style="margin-top:20px">Datos fiscales</div>
            <div class="cl-info-row">
              <span class="cl-info-key">RFC</span>
              <span class="cl-info-val">
                ${c.rfc ? `<span class="gramaje-tag" style="font-size:11px">${c.rfc}</span>` : '<span style="color:var(--text3)">—</span>'}
              </span>
            </div>
            ${c.notas ? `
            <div class="cl-drawer-section-label" style="margin-top:20px">Notas</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.6;padding:12px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border)">${c.notas}</div>
            ` : ''}
            <div class="cl-drawer-section-label" style="margin-top:20px">Historial</div>
            <div class="cl-info-row">
              <span class="cl-info-key">Alta</span>
              <span class="cl-info-val">${fmtDate(c.createdAt)}</span>
            </div>
          </div>
          <div class="cl-drawer-actions">
            <button class="btn-primary" id="cl-edit-drawer">Editar cliente</button>
            <button class="btn-ghost cl-del-btn" id="cl-del-drawer">Eliminar</button>
          </div>
        `;

        document.getElementById('cl-x').addEventListener('click', closeDrawer);
        document.getElementById('cl-edit-drawer').addEventListener('click', () => { _editMode = true; renderDrawer(); });
        document.getElementById('cl-del-drawer').addEventListener('click', () => {
          if (!confirm(`¿Eliminar a ${c.nombre}? Esta acción no se puede deshacer.`)) return;
          saveClientes(getClientes().filter(x => x.id !== c.id));
          closeDrawer();
          renderTable(self._q);
          updateStats();
        });
      }
    }

    // ── Add modal ──────────────────────────────────────────────────
    function openAddModal(prefill) {
      const bg    = document.getElementById('cl-modal-bg');
      const modal = document.getElementById('cl-modal');
      modal.innerHTML = `
        <div class="cl-modal-head">Nuevo cliente</div>
        <div class="cl-modal-body">
          <div class="row2" style="margin-bottom:12px">
            <div class="fg"><label>Nombre completo *</label><input id="mn-nombre" value="${prefill || ''}"/></div>
            <div class="fg"><label>Empresa</label><input id="mn-empresa"/></div>
          </div>
          <div class="row2" style="margin-bottom:12px">
            <div class="fg"><label>Email</label><input id="mn-email" type="email"/></div>
            <div class="fg"><label>Teléfono</label><input id="mn-tel"/></div>
          </div>
          <div class="row2">
            <div class="fg"><label>RFC</label><input id="mn-rfc"/></div>
            <div class="fg"><label>Dirección</label><input id="mn-dir"/></div>
          </div>
        </div>
        <div class="cl-modal-foot">
          <button class="btn-ghost" id="mn-cancel">Cancelar</button>
          <button class="btn-primary" id="mn-save">Guardar cliente</button>
        </div>
      `;
      bg.style.display = 'flex';
      setTimeout(() => document.getElementById('mn-nombre').focus(), 50);

      document.getElementById('mn-cancel').addEventListener('click', () => { bg.style.display = 'none'; });
      bg.addEventListener('click', e => { if (e.target === bg) bg.style.display = 'none'; });

      document.getElementById('mn-save').addEventListener('click', () => {
        const nombre = document.getElementById('mn-nombre').value.trim();
        if (!nombre) { document.getElementById('mn-nombre').focus(); return; }
        const nc = {
          id:        'cl_' + Date.now(),
          nombre,
          empresa:   document.getElementById('mn-empresa').value.trim(),
          email:     document.getElementById('mn-email').value.trim(),
          tel:       document.getElementById('mn-tel').value.trim(),
          rfc:       document.getElementById('mn-rfc').value.trim(),
          direccion: document.getElementById('mn-dir').value.trim(),
          notas:     '',
          createdAt: Date.now(),
        };
        const arr = getClientes();
        arr.unshift(nc);
        saveClientes(arr);
        bg.style.display = 'none';
        renderTable(self._q);
        updateStats();
        openDrawer(nc.id);
      });
    }

    // ── Events ─────────────────────────────────────────────────────
    document.getElementById('cl-overlay').addEventListener('click', closeDrawer);
    document.getElementById('cl-q').addEventListener('input', e => {
      self._q = e.target.value;
      renderTable(self._q);
    });
    document.getElementById('cl-add-btn').addEventListener('click', () => openAddModal(''));

    // ── Boot ───────────────────────────────────────────────────────
    self._q = '';
    updateStats();
    renderTable('');
  }
};
