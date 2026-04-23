// ── Sustratos & Mermas view ──────────────────────────────────────────────────
(function() {

const CATS = [
  'BOND','COUCHE','OPALINA','TEXCOTE','SULFATADO',
  'CARTULINA SULFATADA','SBS MULTICAPA','MICRO FLAUTA E',
  'CORRUGADO FLAUTA B','HUEVERO','PLIEGOS VARIOS',
];
const SHORT = {
  'BOND':'BOND','COUCHE':'COUCHÉ','OPALINA':'OPALINA','TEXCOTE':'TEXCOTE',
  'SULFATADO':'SULFATADO','CARTULINA SULFATADA':'CARTULINA','SBS MULTICAPA':'SBS',
  'MICRO FLAUTA E':'MICRO E','CORRUGADO FLAUTA B':'CORRUGADO B',
  'HUEVERO':'HUEVERO','PLIEGOS VARIOS':'VARIOS'
};

let _activeTab  = 'BOND';
let _editingId  = null;

// ── Render shell ────────────────────────────────────────────────────────────
views['sustratos'] = {
  render() {
    const tabsHtml = CATS.map(c => `
      <div class="papel-tab${c === _activeTab ? ' active' : ''}" data-cat="${c}">
        ${SHORT[c] || c}
      </div>`).join('');

    document.getElementById('app').innerHTML = `
<div class="content">

  <!-- Tab bar -->
  <div class="papel-tab-bar">${tabsHtml}</div>

  <!-- Dynamic panel -->
  <div id="papel-panel"></div>

  <!-- Add / Edit modal -->
  <div class="cl-modal-bg" id="papel-modal-bg" style="display:none">
    <div class="cl-modal" style="width:520px;max-width:95vw">
      <div class="cl-modal-head" id="papel-modal-title">Agregar papel</div>
      <div class="cl-modal-body">
        <div class="row2" style="gap:12px;margin-bottom:12px">
          <div class="fg">
            <label>Categoría</label>
            <select id="pm-cat">
              ${CATS.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="fg">
            <label>Material</label>
            <input type="text" id="pm-mat" placeholder="Bond, Couché, Kraft…"/>
          </div>
        </div>
        <div class="row2" style="gap:12px;margin-bottom:12px">
          <div class="fg">
            <label>Medida <span style="color:var(--text3);font-weight:400">(cm)</span></label>
            <input type="text" id="pm-med" placeholder="57X87"/>
          </div>
          <div class="fg">
            <label>Gramaje <span style="color:var(--text3);font-weight:400">(g, opcional)</span></label>
            <input type="number" id="pm-gramos" min="1" placeholder="150"/>
          </div>
        </div>
        <div class="row2" style="gap:12px;margin-bottom:12px">
          <div class="fg">
            <label>Puntos / Calibre <span style="color:var(--text3);font-weight:400">(opcional)</span></label>
            <input type="number" id="pm-puntos" min="1" placeholder="12"/>
          </div>
          <div class="fg">
            <label>Precio por millar <span style="color:var(--text3);font-weight:400">MXN</span></label>
            <div class="price-cell">
              <span class="price-prefix">$</span>
              <input type="number" id="pm-precio" min="0" step="1" placeholder="2000"/>
            </div>
          </div>
        </div>
        <div class="row2" style="gap:12px">
          <div class="fg">
            <label>Máquina <span style="color:var(--text3);font-weight:400">(opcional)</span></label>
            <input type="text" id="pm-maq" placeholder="PM52, PM74…"/>
          </div>
          <div class="fg">
            <label>Observaciones</label>
            <input type="text" id="pm-obs" placeholder="Notas adicionales"/>
          </div>
        </div>
      </div>
      <div class="cl-modal-foot">
        <button class="btn-ghost" id="papel-modal-cancel">Cancelar</button>
        <button class="btn-primary" id="papel-modal-save">Guardar papel</button>
      </div>
    </div>
  </div>

</div>`;
  },

  // ── Init (bind persistent events) ──────────────────────────────────────────
  init() {
    renderPanel(_activeTab);

    // Tab switching
    document.querySelectorAll('.papel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        _activeTab = tab.dataset.cat;
        document.querySelectorAll('.papel-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === _activeTab));
        renderPanel(_activeTab);
      });
    });

    // Modal close
    document.getElementById('papel-modal-cancel').addEventListener('click', closeModal);
    document.getElementById('papel-modal-bg').addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById('papel-modal-save').addEventListener('click', savePapelModal);
  }
};

// ── Render panel for active tab ────────────────────────────────────────────
function renderPanel(cat) {
  const panel = document.getElementById('papel-panel');
  if (!panel) return;

  const papeles = getPapeles().filter(p => p.categoria === cat);

  let rows;
  if (papeles.length === 0) {
    rows = `<tr><td colspan="8">
      <div class="papel-empty">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" style="opacity:.3;margin-bottom:8px">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <div>Sin papeles en esta categoría</div>
        <div style="font-size:11px;margin-top:4px;color:var(--text3)">Usa "+ Agregar papel" para comenzar</div>
      </div>
    </td></tr>`;
  } else {
    rows = papeles.map(p => {
      const precioU = p.precioMillar / 1000;
      const gramStr  = p.gramos  != null ? p.gramos  + 'g'   : '—';
      const punStr   = p.puntos  != null ? p.puntos  + ' pts' : '—';
      return `<tr data-id="${p.id}">
        <td><span style="font-weight:600;color:var(--text)">${p.material}</span></td>
        <td><span class="gramaje-tag" style="font-size:11px">${p.medida || '—'}</span></td>
        <td>${gramStr}</td>
        <td>${punStr}</td>
        <td style="font-weight:600">${fmtMXN(p.precioMillar)}</td>
        <td style="color:var(--text3)">${fmtMXN(precioU)}</td>
        <td style="max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text3);font-size:12px">${p.observaciones || '—'}</td>
        <td>
          <div style="display:flex;gap:4px;justify-content:flex-end">
            <button class="dash-icon-btn papel-edit-btn" title="Editar">
              <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M11.5 2.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </button>
            <button class="dash-icon-btn dash-del-btn papel-del-btn" title="Eliminar">
              <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  panel.innerHTML = `
<div class="card" style="margin-top:16px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
    <div>
      <div class="card-title">${cat}</div>
      <div style="font-size:11px;color:var(--text3);margin-top:2px;font-weight:500">
        ${papeles.length} entrada${papeles.length !== 1 ? 's' : ''} · $/Unidad = precio por pliego
      </div>
    </div>
    <button class="btn-primary" id="papel-add-btn" style="font-size:12px;padding:8px 14px;gap:6px">
      <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Agregar papel
    </button>
  </div>
  <div style="overflow-x:auto;-webkit-overflow-scrolling:touch">
    <table class="config-table papel-table">
      <thead>
        <tr>
          <th>Material</th>
          <th>Medida</th>
          <th>Gramaje</th>
          <th>Puntos</th>
          <th>$/Millar</th>
          <th>$/Unidad</th>
          <th>Obs.</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</div>`;

  // Add button
  document.getElementById('papel-add-btn').addEventListener('click', () => openModal(null, cat));

  // Edit buttons
  document.querySelectorAll('.papel-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.closest('tr').dataset.id, cat));
  });

  // Delete buttons
  document.querySelectorAll('.papel-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.closest('tr').dataset.id;
      const p  = getPapeles().find(x => x.id === id);
      if (!p) return;
      if (confirm(`¿Eliminar "${p.material} ${p.medida || ''} ${p.gramos ? p.gramos + 'g' : ''}"?`.replace(/\s+/g,' '))) {
        savePapeles(getPapeles().filter(x => x.id !== id));
        renderPanel(_activeTab);
      }
    });
  });
}

// ── Modal helpers ──────────────────────────────────────────────────────────
function openModal(id, defaultCat) {
  _editingId = id || null;
  const isEdit = !!_editingId;
  document.getElementById('papel-modal-title').textContent = isEdit ? 'Editar papel' : 'Agregar papel';

  if (isEdit) {
    const p = getPapeles().find(x => x.id === _editingId);
    if (!p) return;
    document.getElementById('pm-cat').value    = p.categoria;
    document.getElementById('pm-mat').value    = p.material;
    document.getElementById('pm-med').value    = p.medida || '';
    document.getElementById('pm-gramos').value = p.gramos  != null ? p.gramos  : '';
    document.getElementById('pm-puntos').value = p.puntos  != null ? p.puntos  : '';
    document.getElementById('pm-precio').value = p.precioMillar;
    document.getElementById('pm-maq').value    = p.maquina || '';
    document.getElementById('pm-obs').value    = p.observaciones || '';
  } else {
    document.getElementById('pm-cat').value    = defaultCat || 'BOND';
    document.getElementById('pm-mat').value    = '';
    document.getElementById('pm-med').value    = '';
    document.getElementById('pm-gramos').value = '';
    document.getElementById('pm-puntos').value = '';
    document.getElementById('pm-precio').value = '';
    document.getElementById('pm-maq').value    = '';
    document.getElementById('pm-obs').value    = '';
  }

  document.getElementById('papel-modal-bg').style.display = 'flex';
  setTimeout(() => document.getElementById('pm-mat').focus(), 50);
}

function closeModal() {
  document.getElementById('papel-modal-bg').style.display = 'none';
}

function savePapelModal() {
  const precioEl = document.getElementById('pm-precio');
  const precio   = parseFloat(precioEl.value);
  if (!precio || precio <= 0) {
    precioEl.style.borderColor = '#e05252';
    precioEl.focus();
    return;
  }
  precioEl.style.borderColor = '';

  const cat  = document.getElementById('pm-cat').value;
  const mat  = document.getElementById('pm-mat').value.trim();
  const g    = document.getElementById('pm-gramos').value;
  const pts  = document.getElementById('pm-puntos').value;

  const entry = {
    id:           _editingId || ('pap-' + Date.now()),
    categoria:    cat,
    material:     mat || cat,
    medida:       document.getElementById('pm-med').value.trim().toUpperCase() || '',
    gramos:       g   !== '' ? parseInt(g)   : null,
    puntos:       pts !== '' ? parseInt(pts) : null,
    precioMillar: precio,
    observaciones:document.getElementById('pm-obs').value.trim(),
    maquina:      document.getElementById('pm-maq').value.trim(),
  };

  let arr = getPapeles();
  if (_editingId) {
    arr = arr.map(p => p.id === _editingId ? entry : p);
  } else {
    arr = [...arr, entry];
  }

  savePapeles(arr);
  closeModal();
  _activeTab = entry.categoria;
  document.querySelectorAll('.papel-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === _activeTab));
  renderPanel(_activeTab);
}


})();
