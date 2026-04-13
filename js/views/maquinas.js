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

    // ── Display row HTML ──────────────────────────────────────────
    function rowHTML(m) {
      return `<tr data-id="${m.id}" class="maq-row">
        <td><strong>${m.name}</strong><br><span style="font-size:11px;color:var(--text3)">${m.tag}</span></td>
        <td>${m.tamW}×${m.tamH}</td>
        <td>${m.utilW}×${m.utilH}</td>
        <td>${m.gramaje}</td>
        <td>$${Number(m.pliegoPrice).toFixed(2)}</td>
        <td>${Number(m.cph).toLocaleString('es-MX')}</td>
        <td style="white-space:nowrap">
          <span class="save-link mq-edit-btn">Editar</span>
          &nbsp;·&nbsp;
          <span class="save-link mq-del-btn" style="color:#E05555">Eliminar</span>
        </td>
      </tr>`;
    }

    // ── Edit row HTML ─────────────────────────────────────────────
    function editRowHTML(m) {
      return `<tr data-id="${m.id}" class="maq-row maq-editing">
        <td>
          <input class="mq-f mq-name" value="${m.name}" placeholder="Nombre" style="width:70px" title="Nombre"/>
          <br>
          <input class="mq-f mq-tag" value="${m.tag}" placeholder="Tag" style="width:70px;margin-top:4px;font-size:11px" title="Tag (ej. Chica)"/>
        </td>
        <td style="white-space:nowrap">
          <input class="mq-f mq-tw" type="number" value="${m.tamW}" style="width:40px"/> ×
          <input class="mq-f mq-th" type="number" value="${m.tamH}" style="width:40px"/>
        </td>
        <td style="white-space:nowrap">
          <input class="mq-f mq-uw" type="number" value="${m.utilW}" style="width:40px"/> ×
          <input class="mq-f mq-uh" type="number" value="${m.utilH}" style="width:40px"/>
        </td>
        <td><input class="mq-f mq-gram" value="${m.gramaje}" style="width:62px"/></td>
        <td>$<input class="mq-f mq-pp" type="number" step="0.01" value="${m.pliegoPrice}" style="width:52px"/></td>
        <td><input class="mq-f mq-cph" type="number" value="${m.cph}" style="width:58px"/></td>
        <td style="white-space:nowrap">
          <span class="save-link mq-save-btn">Guardar</span>
          &nbsp;·&nbsp;
          <span class="save-link mq-cancel-btn" style="color:var(--text3)">Cancelar</span>
        </td>
      </tr>`;
    }

    // ── Delete confirm row HTML ───────────────────────────────────
    function deleteRowHTML(m) {
      return `<tr data-id="${m.id}" class="maq-row maq-deleting">
        <td colspan="7" style="background:rgba(224,85,85,.06);border-radius:var(--radius-sm)">
          <div style="display:flex;align-items:center;gap:16px;padding:4px 0">
            <span style="font-size:13px;color:var(--text2);font-weight:500">¿Eliminar <strong>${m.name}</strong>? Esta acción no se puede deshacer.</span>
            <span class="mq-confirm-del" style="font-size:13px;font-weight:700;color:#E05555;cursor:pointer;flex-shrink:0">Sí, eliminar</span>
            <span class="mq-cancel-del save-link" style="flex-shrink:0">Cancelar</span>
          </div>
        </td>
      </tr>`;
    }

    // ── Attach row listeners ──────────────────────────────────────
    function attachRowListeners() {
      const tbody = document.getElementById('maq-tbody');
      if (!tbody) return;

      tbody.querySelectorAll('.mq-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr = btn.closest('tr');
          const id = tr.dataset.id;
          const m  = getMachines().find(x => x.id === id);
          if (!m) return;
          tr.outerHTML = editRowHTML(m);
          attachRowListeners();
        });
      });

      tbody.querySelectorAll('.mq-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr = btn.closest('tr');
          const id = tr.dataset.id;
          const m  = getMachines().find(x => x.id === id);
          if (!m) return;
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
          if (m) tr.outerHTML = rowHTML(m);
          attachRowListeners();
        });
      });

      tbody.querySelectorAll('.mq-save-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr      = btn.closest('tr');
          const oldId   = tr.dataset.id;
          const name    = tr.querySelector('.mq-name').value.trim();
          const tag     = tr.querySelector('.mq-tag').value.trim();
          const tamW    = +tr.querySelector('.mq-tw').value || 0;
          const tamH    = +tr.querySelector('.mq-th').value || 0;
          const utilW   = +tr.querySelector('.mq-uw').value || 0;
          const utilH   = +tr.querySelector('.mq-uh').value || 0;
          const gramaje = tr.querySelector('.mq-gram').value.trim();
          const pliegoPrice = +tr.querySelector('.mq-pp').value || 0;
          const cph     = +tr.querySelector('.mq-cph').value || 0;
          if (!name) { tr.querySelector('.mq-name').focus(); return; }
          const newId = name.toUpperCase().replace(/\s+/g, '');
          const updated = { id: newId, name, tag, tamW, tamH, utilW, utilH, gramaje, cph, pliegoPrice };
          const arr = getMachines().map(x => x.id === oldId ? updated : x);
          saveMachines(arr);
          tr.outerHTML = rowHTML(updated);
          attachRowListeners();
          flashSaved();
        });
      });

      tbody.querySelectorAll('.mq-cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tr = btn.closest('tr');
          const id = tr.dataset.id;
          const m  = getMachines().find(x => x.id === id);
          if (m) tr.outerHTML = rowHTML(m);
          attachRowListeners();
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
            <div class="fg"><label>Nombre</label><input id="nw-name" placeholder="Ej. KBA105" value=""/></div>
            <div class="fg"><label>Tag / descripción corta</label><input id="nw-tag" placeholder="Ej. Extra grande" value=""/></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:12px">
            <div class="fg">
              <label>Tam. máx. — ancho (cm)</label><input id="nw-tw" type="number" placeholder="72"/>
            </div>
            <div class="fg">
              <label>Tam. máx. — alto (cm)</label><input id="nw-th" type="number" placeholder="102"/>
            </div>
            <div class="fg">
              <label>Gramaje máx.</label><input id="nw-gram" placeholder="24 pts"/>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:16px">
            <div class="fg">
              <label>Área útil — ancho (cm)</label><input id="nw-uw" type="number" placeholder="79"/>
            </div>
            <div class="fg">
              <label>Área útil — alto (cm)</label><input id="nw-uh" type="number" placeholder="100"/>
            </div>
            <div class="fg">
              <label>Costo / hora (MXN)</label><input id="nw-cph" type="number" placeholder="2100"/>
            </div>
          </div>
          <div class="row2" style="margin-bottom:16px">
            <div class="fg">
              <label>Costo por pliego (MXN)</label><input id="nw-pp" type="number" step="0.01" placeholder="1.20"/>
            </div>
            <div></div>
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
        const tamW  = +document.getElementById('nw-tw').value || 0;
        const tamH  = +document.getElementById('nw-th').value || 0;
        const utilW = +document.getElementById('nw-uw').value || 0;
        const utilH = +document.getElementById('nw-uh').value || 0;
        const gramaje = document.getElementById('nw-gram').value.trim() || '—';
        const cph   = +document.getElementById('nw-cph').value || 0;
        const pliegoPrice = +document.getElementById('nw-pp').value || 0;

        if (!name) { document.getElementById('nw-name').focus(); return; }
        if (!utilW || !utilH) { document.getElementById('nw-uw').focus(); return; }

        const id = name.toUpperCase().replace(/\s+/g, '');
        const arr = getMachines();
        if (arr.find(m => m.id === id)) {
          document.getElementById('nw-name').style.borderColor = '#E05555';
          document.getElementById('nw-name').title = 'Ya existe una máquina con este nombre';
          return;
        }
        arr.push({ id, name, tag, tamW, tamH, utilW, utilH, gramaje, cph, pliegoPrice });
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
