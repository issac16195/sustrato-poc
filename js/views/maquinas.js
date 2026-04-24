views['maquinas'] = {
  render() {
    document.getElementById('app').innerHTML = `
<div class="content">
  <div class="card" id="maq-card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div class="card-title" style="margin-bottom:2px">Prensas disponibles</div>
        <p style="font-size:12px;color:var(--text3);font-weight:500">El motor usa estos datos para calcular la imposición y el costo de cada cotización.</p>
      </div>
      <button class="btn-primary" id="btn-add-maq" style="white-space:nowrap;flex-shrink:0">+ Nueva máquina</button>
    </div>
    <div id="maq-table-wrap" style="overflow-x:auto;margin:0 -4px"></div>
    <div id="maq-add-form" style="display:none"></div>
  </div>
</div>
`;
  },

  init() {

    // ── Render table ──────────────────────────────────────────────
    function renderTable() {
      const machines = getMachines();
      const wrap = document.getElementById('maq-table-wrap');
      if (!machines.length) {
        wrap.innerHTML = `<div style="text-align:center;padding:32px 0;color:var(--text3);font-size:13px">
          <div style="font-size:28px;margin-bottom:8px">🖨</div>
          No hay máquinas registradas. Agrega una para comenzar.
        </div>`;
        return;
      }
      wrap.innerHTML = `
        <table class="config-table" id="maq-table">
          <thead>
            <tr>
              <th>Máquina</th>
              <th>Tam. máx. (cm)</th>
              <th>Área útil (cm)</th>
              <th>División</th>
              <th>Gramaje máx.</th>
              <th>$/pliego</th>
              <th>$/hora</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="maq-tbody">
            ${machines.map(m => rowHTML(m)).join('')}
          </tbody>
        </table>`;
      attachRowListeners();
    }

    // ── Display row ───────────────────────────────────────────────
    function rowHTML(m) {
      const divLabel = m.division === 4 ? 'Cuarto (÷4)' : m.division === 2 ? 'Medio (÷2)' : 'Pliego (÷1)';
      return `<tr data-id="${m.id}" class="maq-row">
        <td><strong>${m.name}</strong><br><span style="font-size:11px;color:var(--text3)">${m.tag}</span></td>
        <td>${m.tamW}×${m.tamH}</td>
        <td>${m.utilW}×${m.utilH}</td>
        <td><span style="font-size:11px;font-weight:600;color:var(--teal)">${divLabel}</span></td>
        <td>${m.gramaje}</td>
        <td>${fmtMXN(m.pliegoPrice)}</td>
        <td>${fmtMXN(m.cph)}</td>
        <td style="white-space:nowrap">
          <span class="save-link mq-edit-btn">Editar</span>
          &nbsp;·&nbsp;
          <span class="save-link mq-merma-btn" style="color:var(--teal)">Mermas</span>
          &nbsp;·&nbsp;
          <span class="save-link mq-del-btn" style="color:#E05555">Eliminar</span>
        </td>
      </tr>`;
    }

    // ── Edit panel (full-width row with a proper form) ─────────────
    // Replaces the old cramped editRowHTML — uses an expandable panel
    // below the display row (same pattern as the merma panel).
    function editPanelHTML(m) {
      const div = m.division || 1;
      return `<tr class="maq-edit-panel-row" data-for="${m.id}">
        <td colspan="8" style="padding:0;border-top:2px solid var(--navy)">
          <div class="maq-edit-panel">
            <div class="maq-edit-panel-title">
              <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              Editando · ${m.name}
            </div>

            <div class="maq-edit-grid-3">
              <div class="fg">
                <label>Nombre *</label>
                <input class="mq-f mq-name" value="${m.name}" placeholder="PM52" type="text"/>
              </div>
              <div class="fg">
                <label>Tag / descripción</label>
                <input class="mq-f mq-tag" value="${m.tag}" placeholder="Chica" type="text"/>
              </div>
              <div class="fg">
                <label>División de pliego</label>
                <select class="mq-f mq-div">
                  <option value="1" ${div===1?'selected':''}>Pliego completo (÷1)</option>
                  <option value="2" ${div===2?'selected':''}>Medio pliego (÷2)</option>
                  <option value="4" ${div===4?'selected':''}>Cuarto de pliego (÷4)</option>
                </select>
              </div>
            </div>

            <div class="maq-edit-grid-4">
              <div class="fg">
                <label>Tam. máx. — ancho (cm)</label>
                <input class="mq-f mq-tw" type="number" value="${m.tamW}" placeholder="72"/>
              </div>
              <div class="fg">
                <label>Tam. máx. — alto (cm)</label>
                <input class="mq-f mq-th" type="number" value="${m.tamH}" placeholder="102"/>
              </div>
              <div class="fg">
                <label>Área útil — ancho (cm)</label>
                <input class="mq-f mq-uw" type="number" value="${m.utilW}" placeholder="79"/>
              </div>
              <div class="fg">
                <label>Área útil — alto (cm)</label>
                <input class="mq-f mq-uh" type="number" value="${m.utilH}" placeholder="100"/>
              </div>
            </div>

            <div class="maq-edit-grid-3">
              <div class="fg">
                <label>Gramaje máx.</label>
                <input class="mq-f mq-gram" value="${m.gramaje}" placeholder="24 pts" type="text"/>
              </div>
              <div class="fg">
                <label>$ / pliego (MXN)</label>
                <input class="mq-f mq-pp" type="number" step="0.01" value="${m.pliegoPrice}" placeholder="1.20"/>
              </div>
              <div class="fg">
                <label>$ / hora (MXN)</label>
                <input class="mq-f mq-cph" type="number" value="${m.cph}" placeholder="2100"/>
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
              <button class="btn-primary mq-save-btn" style="font-size:13px;padding:9px 22px">Guardar cambios</button>
              <button class="btn-ghost mq-cancel-btn" style="font-size:13px;padding:9px 16px">Cancelar</button>
            </div>
          </div>
        </td>
      </tr>`;
    }

    // ── Delete confirm row ────────────────────────────────────────
    function deleteRowHTML(m) {
      return `<tr data-id="${m.id}" class="maq-row maq-deleting">
        <td colspan="8" style="background:rgba(224,85,85,.06);border-radius:var(--radius-sm)">
          <div style="display:flex;align-items:center;gap:16px;padding:4px 0">
            <span style="font-size:13px;color:var(--text2);font-weight:500">¿Eliminar <strong>${m.name}</strong>? Esta acción no se puede deshacer.</span>
            <span class="mq-confirm-del" style="font-size:13px;font-weight:700;color:#E05555;cursor:pointer;flex-shrink:0">Sí, eliminar</span>
            <span class="mq-cancel-del save-link" style="flex-shrink:0">Cancelar</span>
          </div>
        </td>
      </tr>`;
    }

    // ── Merma expand row ─────────────────────────────────────────
    function mermaRowHTML(m) {
      const mermas = m.mermas || DEFAULT_MERMAS.map(r => ({...r}));
      const rows = mermas.map((r, i) => {
        const hastaVal = r.hasta !== null ? r.hasta : '';
        return `<tr class="merma-inner-row" data-idx="${i}">
          <td>
            <div style="display:flex;align-items:center;gap:4px">
              <input class="mq-f mq-merma-desde" type="number" min="0" value="${r.desde}" style="width:80px"/>
              <span style="color:var(--text3);font-size:11px">pzas</span>
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:4px">
              <input class="mq-f mq-merma-hasta" type="number" min="0" value="${hastaVal}" placeholder="∞" style="width:80px"/>
              <span style="color:var(--text3);font-size:11px">pzas</span>
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:4px">
              <input class="mq-f mq-merma-val" type="number" min="0" value="${r.merma}" style="width:80px"/>
              <span style="color:var(--text3);font-size:11px">pzas</span>
            </div>
          </td>
          <td>
            <button class="dash-icon-btn dash-del-btn mq-merma-del" title="Eliminar rango">
              <svg width="12" height="12" fill="none" viewBox="0 0 16 16"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </td>
        </tr>`;
      }).join('');

      return `<tr class="merma-expand-row" data-for="${m.id}">
        <td colspan="8" style="padding:0;border-top:2px solid var(--teal);background:rgba(0,168,120,.03)">
          <div style="padding:14px 16px 16px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
              <div>
                <span style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;color:var(--navy)">
                  Mermas · ${m.name}
                </span>
                <span style="font-size:11px;color:var(--text3);margin-left:8px;font-weight:500">
                  Piezas extra que el motor suma a cada tirada para absorber el desperdicio de arranque
                </span>
              </div>
              <button class="btn-ghost mq-merma-close" data-maq="${m.id}" style="font-size:12px;padding:5px 10px">✕ Cerrar</button>
            </div>
            <div style="overflow-x:auto">
              <table class="config-table merma-inner-table" style="min-width:380px" data-maq="${m.id}">
                <thead>
                  <tr>
                    <th>Desde (pzas)</th>
                    <th>Hasta (pzas)</th>
                    <th>Merma (pzas)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="merma-inner-tbody">
                  ${rows}
                </tbody>
              </table>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;flex-wrap:wrap;gap:8px">
              <button class="btn-ghost mq-merma-add" data-maq="${m.id}" style="font-size:12px;padding:6px 12px;gap:6px">
                <svg width="11" height="11" fill="none" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Agregar rango
              </button>
              <button class="btn-primary mq-merma-save" data-maq="${m.id}" style="font-size:12px;padding:7px 16px">
                Guardar mermas
              </button>
            </div>
          </div>
        </td>
      </tr>`;
    }

    // ── Close any open edit/merma panels ─────────────────────────
    function closeAllPanels(tbody) {
      tbody.querySelectorAll('.maq-edit-panel-row').forEach(r => r.remove());
      tbody.querySelectorAll('.maq-row.maq-editing').forEach(r => r.classList.remove('maq-editing'));
    }

    // ── Toggle merma panel ────────────────────────────────────────
    function toggleMermaPanel(maqId, sourceTr) {
      const tbody = document.getElementById('maq-tbody');
      if (!tbody) return;
      const existing = tbody.querySelector(`.merma-expand-row[data-for="${maqId}"]`);
      if (existing) { existing.remove(); return; }
      tbody.querySelectorAll('.merma-expand-row').forEach(r => r.remove());
      const m = getMachines().find(x => x.id === maqId);
      if (!m) return;
      const tmp = document.createElement('tbody');
      tmp.innerHTML = mermaRowHTML(m);
      sourceTr.insertAdjacentElement('afterend', tmp.querySelector('tr'));
      attachMermaListeners(tbody.querySelector(`.merma-expand-row[data-for="${maqId}"]`), maqId);
    }

    // ── Merma panel event listeners ───────────────────────────────
    function attachMermaListeners(panel, maqId) {
      panel.querySelector('.mq-merma-close').addEventListener('click', () => panel.remove());

      panel.querySelector('.mq-merma-add').addEventListener('click', () => {
        const tbody = panel.querySelector('.merma-inner-tbody');
        const idx   = tbody.querySelectorAll('.merma-inner-row').length;
        const newRow = document.createElement('tr');
        newRow.className = 'merma-inner-row';
        newRow.dataset.idx = idx;
        newRow.innerHTML = `
          <td><div style="display:flex;align-items:center;gap:4px">
            <input class="mq-f mq-merma-desde" type="number" min="0" placeholder="0" style="width:80px"/>
            <span style="color:var(--text3);font-size:11px">pzas</span>
          </div></td>
          <td><div style="display:flex;align-items:center;gap:4px">
            <input class="mq-f mq-merma-hasta" type="number" min="0" placeholder="∞" style="width:80px"/>
            <span style="color:var(--text3);font-size:11px">pzas</span>
          </div></td>
          <td><div style="display:flex;align-items:center;gap:4px">
            <input class="mq-f mq-merma-val" type="number" min="0" placeholder="0" style="width:80px"/>
            <span style="color:var(--text3);font-size:11px">pzas</span>
          </div></td>
          <td>
            <button class="dash-icon-btn dash-del-btn mq-merma-del" title="Eliminar">
              <svg width="12" height="12" fill="none" viewBox="0 0 16 16"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </td>`;
        tbody.appendChild(newRow);
        newRow.querySelector('.mq-merma-desde').focus();
        newRow.querySelector('.mq-merma-del').addEventListener('click', () => newRow.remove());
      });

      panel.querySelectorAll('.mq-merma-del').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.merma-inner-row').remove());
      });

      panel.querySelector('.mq-merma-save').addEventListener('click', () => {
        const rows = panel.querySelectorAll('.merma-inner-row');
        const mermas = [];
        let valid = true;
        rows.forEach(row => {
          const desde   = parseInt(row.querySelector('.mq-merma-desde').value);
          const hastaRaw = row.querySelector('.mq-merma-hasta').value;
          const hasta   = hastaRaw !== '' ? parseInt(hastaRaw) : null;
          const merma   = parseInt(row.querySelector('.mq-merma-val').value);
          if (isNaN(desde) || isNaN(merma)) { valid = false; return; }
          mermas.push({ desde, hasta, merma });
        });
        if (!valid) return;
        mermas.sort((a, b) => a.desde - b.desde);
        const arr = getMachines().map(m => m.id === maqId ? { ...m, mermas } : m);
        saveMachines(arr);
        const btn = panel.querySelector('.mq-merma-save');
        const orig = btn.textContent;
        btn.textContent = '✓ Mermas guardadas';
        btn.style.background = 'var(--teal-dark)';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1800);
        flashSaved();
      });
    }

    // ── Row-level event listeners ─────────────────────────────────
    function attachRowListeners() {
      const tbody = document.getElementById('maq-tbody');
      if (!tbody) return;

      // ── Editar → open edit panel ──────────────────────────────
      tbody.querySelectorAll('.mq-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr = btn.closest('tr');
          const id = tr.dataset.id;
          const m  = getMachines().find(x => x.id === id);
          if (!m) return;

          // Close any existing edit or merma panels
          closeAllPanels(tbody);
          tbody.querySelector(`.merma-expand-row[data-for="${id}"]`)?.remove();

          // Highlight the display row
          tr.classList.add('maq-editing');

          // Insert edit panel after the display row
          const tmp = document.createElement('tbody');
          tmp.innerHTML = editPanelHTML(m);
          const panelTr = tmp.querySelector('tr');
          tr.insertAdjacentElement('afterend', panelTr);
          panelTr.querySelector('.mq-name').focus();

          // ── Save ─────────────────────────────────────────────
          panelTr.querySelector('.mq-save-btn').addEventListener('click', () => {
            const name     = panelTr.querySelector('.mq-name').value.trim();
            const tag      = panelTr.querySelector('.mq-tag').value.trim();
            const tamW     = +panelTr.querySelector('.mq-tw').value  || 0;
            const tamH     = +panelTr.querySelector('.mq-th').value  || 0;
            const utilW    = +panelTr.querySelector('.mq-uw').value  || 0;
            const utilH    = +panelTr.querySelector('.mq-uh').value  || 0;
            const division = +panelTr.querySelector('.mq-div').value || 1;
            const gramaje  =  panelTr.querySelector('.mq-gram').value.trim();
            const pliegoPrice = +panelTr.querySelector('.mq-pp').value  || 0;
            const cph      = +panelTr.querySelector('.mq-cph').value  || 0;
            if (!name) { panelTr.querySelector('.mq-name').classList.add('err'); panelTr.querySelector('.mq-name').focus(); return; }
            const newId  = name.toUpperCase().replace(/\s+/g, '');
            const oldMachine = getMachines().find(x => x.id === id);
            const updated = { id: newId, name, tag, tamW, tamH, utilW, utilH, gramaje, cph, pliegoPrice, division,
              mermas: oldMachine?.mermas || DEFAULT_MERMAS.map(r => ({...r})) };
            const arr = getMachines().map(x => x.id === id ? updated : x);
            saveMachines(arr);
            panelTr.remove();
            tr.classList.remove('maq-editing');
            tr.outerHTML = rowHTML(updated);
            attachRowListeners();
            flashSaved();
          });

          // ── Cancel ───────────────────────────────────────────
          panelTr.querySelector('.mq-cancel-btn').addEventListener('click', () => {
            panelTr.remove();
            tr.classList.remove('maq-editing');
          });
        });
      });

      // ── Mermas ───────────────────────────────────────────────
      tbody.querySelectorAll('.mq-merma-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr = btn.closest('tr');
          // Close edit panel if open for another machine
          closeAllPanels(tbody);
          toggleMermaPanel(tr.dataset.id, tr);
        });
      });

      // ── Eliminar ──────────────────────────────────────────────
      tbody.querySelectorAll('.mq-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr = btn.closest('tr');
          const id = tr.dataset.id;
          const m  = getMachines().find(x => x.id === id);
          if (!m) return;
          closeAllPanels(tbody);
          tbody.querySelector(`.merma-expand-row[data-for="${id}"]`)?.remove();
          tr.outerHTML = deleteRowHTML(m);
          attachRowListeners();
        });
      });

      tbody.querySelectorAll('.mq-confirm-del').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr  = btn.closest('tr');
          const id  = tr.dataset.id;
          const arr = getMachines().filter(x => x.id !== id);
          saveMachines(arr);
          tr.style.animation = 'rowFadeOut .25s ease forwards';
          setTimeout(renderTable, 260);
        });
      });

      tbody.querySelectorAll('.mq-cancel-del').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr = btn.closest('tr');
          const id = tr.dataset.id;
          const m  = getMachines().find(x => x.id === id);
          if (m) { tr.outerHTML = rowHTML(m); attachRowListeners(); }
        });
      });
    }

    // ── Add form ──────────────────────────────────────────────────
    function showAddForm() {
      const formEl = document.getElementById('maq-add-form');
      formEl.style.display = '';
      formEl.innerHTML = `
        <div style="border-top:1px solid var(--border);margin-top:20px;padding-top:20px">
          <div class="card-title" style="margin-bottom:14px;font-size:13px">Nueva máquina</div>
          <div class="row2" style="margin-bottom:12px">
            <div class="fg"><label>Nombre</label><input id="nw-name" placeholder="Ej. KBA105"/></div>
            <div class="fg"><label>Tag / descripción corta</label><input id="nw-tag" placeholder="Ej. Extra grande"/></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:12px">
            <div class="fg"><label>Tam. máx. — ancho (cm)</label><input id="nw-tw" type="number" placeholder="72"/></div>
            <div class="fg"><label>Tam. máx. — alto (cm)</label><input id="nw-th" type="number" placeholder="102"/></div>
            <div class="fg"><label>Gramaje máx.</label><input id="nw-gram" placeholder="24 pts"/></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:12px">
            <div class="fg"><label>Área útil — ancho (cm)</label><input id="nw-uw" type="number" placeholder="79"/></div>
            <div class="fg"><label>Área útil — alto (cm)</label><input id="nw-uh" type="number" placeholder="100"/></div>
            <div class="fg"><label>Costo / hora (MXN)</label><input id="nw-cph" type="number" placeholder="2100"/></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
            <div class="fg"><label>Costo por pliego (MXN)</label><input id="nw-pp" type="number" step="0.01" placeholder="1.20"/></div>
            <div class="fg"><label>División de pliego</label>
              <select id="nw-div">
                <option value="1">Pliego completo (÷1)</option>
                <option value="2">Medio pliego (÷2)</option>
                <option value="4">Cuarto de pliego (÷4)</option>
              </select>
            </div>
          </div>
          <div class="btn-row">
            <button class="btn-primary" id="nw-submit">Agregar máquina</button>
            <button class="btn-ghost" id="nw-cancel">Cancelar</button>
          </div>
        </div>`;

      formEl.style.animation = 'fadeSlideIn .22s cubic-bezier(.25,1,.5,1)';
      document.getElementById('nw-cancel').addEventListener('click', hideAddForm);
      document.getElementById('nw-submit').addEventListener('click', () => {
        const name  = document.getElementById('nw-name').value.trim();
        const tag   = document.getElementById('nw-tag').value.trim() || 'Custom';
        const tamW  = +document.getElementById('nw-tw').value   || 0;
        const tamH  = +document.getElementById('nw-th').value   || 0;
        const utilW = +document.getElementById('nw-uw').value   || 0;
        const utilH = +document.getElementById('nw-uh').value   || 0;
        const gramaje = document.getElementById('nw-gram').value.trim() || '—';
        const cph   = +document.getElementById('nw-cph').value  || 0;
        const pliegoPrice = +document.getElementById('nw-pp').value || 0;
        const division    = +document.getElementById('nw-div').value || 1;
        if (!name)  { document.getElementById('nw-name').focus();  return; }
        if (!utilW || !utilH) { document.getElementById('nw-uw').focus(); return; }
        const id = name.toUpperCase().replace(/\s+/g, '');
        const arr = getMachines();
        if (arr.find(m => m.id === id)) {
          document.getElementById('nw-name').style.borderColor = '#E05555';
          return;
        }
        arr.push({ id, name, tag, tamW, tamH, utilW, utilH, gramaje, cph, pliegoPrice, division,
          mermas: DEFAULT_MERMAS.map(r => ({...r})) });
        saveMachines(arr);
        hideAddForm();
        renderTable();
        flashSaved();
      });
      document.getElementById('btn-add-maq').disabled = true;
      document.getElementById('btn-add-maq').style.opacity = '0.5';
    }

    function hideAddForm() {
      const formEl = document.getElementById('maq-add-form');
      if (!formEl) return;
      formEl.style.display = 'none';
      formEl.innerHTML = '';
      const btn = document.getElementById('btn-add-maq');
      if (btn) { btn.disabled = false; btn.style.opacity = ''; }
    }

    // ── Saved flash ───────────────────────────────────────────────
    function flashSaved() {
      const card = document.getElementById('maq-card');
      if (!card) return;
      card.style.boxShadow = '0 0 0 2px var(--teal)';
      setTimeout(() => { card.style.boxShadow = ''; }, 700);
    }

    // ── Boot ──────────────────────────────────────────────────────
    renderTable();
    document.getElementById('btn-add-maq').addEventListener('click', showAddForm);
  }
};
