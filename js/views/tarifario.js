views['tarifario'] = {
  render() {
    document.getElementById('app').innerHTML = `
<div class="content" style="max-width:900px">
  <div class="tariff-search">
    <input type="text" id="tariff-q" placeholder="Buscar servicio… (ej: barniz, suaje, diseño)"/>
    <select id="tariff-cat" style="width:200px">
      <option value="">Todas las categorías</option>
      <option value="preprensa">Pre-prensa</option>
      <option value="produccion">Producción</option>
      <option value="recubrimiento">Recubrimientos</option>
      <option value="acabados">Acabados</option>
    </select>
  </div>

  <!-- PRE-PRENSA — CRUD -->
  <div class="tariff-category" data-cat="preprensa" id="section-preprensa">
    <div class="tariff-cat-header" style="display:flex;align-items:center;justify-content:space-between">
      <span>Pre-prensa</span>
      <button class="btn-primary" id="btn-add-pp" style="font-size:12px;padding:6px 14px">+ Agregar</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden" id="card-preprensa">
      <table class="tariff-table">
        <thead><tr>
          <th style="width:28%">Servicio</th><th style="width:24%">Nota</th>
          <th>Tamaño / Nivel</th><th class="price-col">Precio MXN</th>
          <th>Unidad</th><th style="width:96px"></th>
        </tr></thead>
        <tbody id="pp-tbody"></tbody>
      </table>
    </div>
    <div id="pp-add-form" style="display:none;margin-top:12px"></div>
  </div>

  <!-- PRODUCCIÓN / PRENSA — CRUD -->
  <div class="tariff-category" data-cat="produccion" id="section-produccion">
    <div class="tariff-cat-header" style="display:flex;align-items:center;justify-content:space-between">
      <span>Producción — Prensa</span>
      <button class="btn-primary" id="btn-add-pr" style="font-size:12px;padding:6px 14px">+ Agregar</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden" id="card-produccion">
      <table class="tariff-table">
        <thead><tr>
          <th style="width:28%">Servicio</th><th style="width:24%">Nota</th>
          <th>Tamaño / Nivel</th><th class="price-col">Precio MXN</th>
          <th>Unidad</th><th style="width:96px"></th>
        </tr></thead>
        <tbody id="pr-tbody"></tbody>
      </table>
    </div>
    <div id="pr-add-form" style="display:none;margin-top:12px"></div>
  </div>

  <!-- RECUBRIMIENTOS — CRUD -->
  <div class="tariff-category" data-cat="recubrimiento" id="section-recubrimiento">
    <div class="tariff-cat-header" style="display:flex;align-items:center;justify-content:space-between">
      <span>Recubrimientos</span>
      <button class="btn-primary" id="btn-add-rc" style="font-size:12px;padding:6px 14px">+ Agregar</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden" id="card-recubrimiento">
      <table class="tariff-table">
        <thead><tr>
          <th style="width:28%">Servicio</th><th style="width:24%">Nota</th>
          <th>Tamaño / Nivel</th><th class="price-col">Precio MXN</th>
          <th>Unidad</th><th style="width:96px"></th>
        </tr></thead>
        <tbody id="rc-tbody"></tbody>
      </table>
    </div>
    <div id="rc-add-form" style="display:none;margin-top:12px"></div>
  </div>

  <!-- ACABADOS — CRUD -->
  <div class="tariff-category" data-cat="acabados" id="section-acabados">
    <div class="tariff-cat-header" style="display:flex;align-items:center;justify-content:space-between">
      <span>Acabados &amp; Terminados</span>
      <button class="btn-primary" id="btn-add-ac" style="font-size:12px;padding:6px 14px">+ Agregar</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden" id="card-acabados">
      <table class="tariff-table">
        <thead><tr>
          <th style="width:28%">Servicio</th><th style="width:24%">Nota</th>
          <th>Tamaño / Nivel</th><th class="price-col">Precio MXN</th>
          <th>Unidad</th><th style="width:96px"></th>
        </tr></thead>
        <tbody id="ac-tbody"></tbody>
      </table>
    </div>
    <div id="ac-add-form" style="display:none;margin-top:12px"></div>
  </div>

  <div style="font-size:11px;color:var(--text3);margin-top:8px;padding:12px;background:var(--white);border-radius:var(--radius-sm);border:1px solid var(--border)">
    💡 <strong>CH</strong> = Chico (PM52) &nbsp;|&nbsp; <strong>MD</strong> = Mediano (PM74) &nbsp;|&nbsp; <strong>GD</strong> = Grande (CD102) &nbsp;|&nbsp; Precios sin IVA
  </div>
</div>
`;
  },

  init() {

    // ── Shared price formatter (acepta número o texto como "5%") ──
    function fmtPrecio(v) {
      const s = String(v).trim();
      if (!s) return '$0';
      if (/[%a-zA-Z]/.test(s)) return s; // texto libre: "5%", "cotizar", etc.
      const num = Number(s.replace(/[$,]/g, ''));
      if (isNaN(num)) return s;
      return num % 1 === 0 ? '$' + num.toLocaleString('es-MX') : '$' + num.toFixed(2);
    }

    // ── CRUD section factory ──────────────────────────────────────
    // cfg: { tbodyId, addFormId, addBtnId, cardId, prefix, addTitle, getItems, saveItems }
    function makeCrud(cfg) {
      const { tbodyId, addFormId, addBtnId, cardId, prefix, addTitle, getItems, saveItems } = cfg;
      const pfx = prefix + '-'; // e.g. 'pp-' or 'ac-'

      function rowHTML(item) {
        return `<tr data-id="${item.id}" class="${prefix}-row"
            data-search="${item.nombre.toLowerCase()} ${item.nota.toLowerCase()} ${item.tamano.toLowerCase()}"
            style="transition:opacity .18s,transform .18s">
          <td><div class="svc-name">${item.nombre}</div></td>
          <td><div class="svc-note" style="color:var(--text2);font-size:12px">${item.nota || '—'}</div></td>
          <td style="font-size:12px;font-weight:600;color:var(--text3)">${item.tamano || '—'}</td>
          <td class="price-col"><span class="price-chip navy">${fmtPrecio(item.precio)}</span></td>
          <td style="font-size:12px;color:var(--text3)">${item.unidad}</td>
          <td style="white-space:nowrap">
            <span class="save-link ${pfx}edit">Editar</span>
            &nbsp;·&nbsp;
            <span class="save-link ${pfx}del" style="color:#E05555">Eliminar</span>
          </td>
        </tr>`;
      }

      function editRowHTML(item) {
        return `<tr data-id="${item.id}" class="${prefix}-row" style="background:var(--teal-bg)">
          <td><input class="tf-f ${pfx}nombre" value="${item.nombre}" placeholder="Servicio" style="width:100%"/></td>
          <td><input class="tf-f ${pfx}nota" value="${item.nota}" placeholder="Nota (opcional)" style="width:100%"/></td>
          <td><input class="tf-f ${pfx}tam" value="${item.tamano}" placeholder="— o CH" style="width:90px"/></td>
          <td><input class="tf-f ${pfx}precio" type="text" value="${item.precio}" placeholder="80 ó 5%" style="width:78px"/></td>
          <td><input class="tf-f ${pfx}unidad" value="${item.unidad}" placeholder="por pieza" style="width:88px"/></td>
          <td style="white-space:nowrap">
            <span class="save-link ${pfx}save">Guardar</span>
            &nbsp;·&nbsp;
            <span class="save-link ${pfx}cancel" style="color:var(--text3)">Cancelar</span>
          </td>
        </tr>`;
      }

      function deleteRowHTML(item) {
        return `<tr data-id="${item.id}" class="${prefix}-row" style="background:rgba(224,85,85,.06)">
          <td colspan="6">
            <div style="display:flex;align-items:center;gap:16px;padding:2px 0">
              <span style="font-size:13px;color:var(--text2);font-weight:500">¿Eliminar <strong>${item.nombre}</strong>?</span>
              <span class="${pfx}confirm-del" style="font-size:13px;font-weight:700;color:#E05555;cursor:pointer;flex-shrink:0">Sí, eliminar</span>
              <span class="save-link ${pfx}cancel-del" style="flex-shrink:0">Cancelar</span>
            </div>
          </td>
        </tr>`;
      }

      function flash() {
        const card = document.getElementById(cardId);
        if (!card) return;
        card.style.transition = 'box-shadow .15s';
        card.style.boxShadow = '0 0 0 2px var(--teal)';
        setTimeout(() => { card.style.boxShadow = ''; }, 700);
      }

      function renderRows() {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = getItems().map(rowHTML).join('');
        attachListeners();
      }

      function attachListeners() {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;

        tbody.querySelectorAll(`.${pfx}edit`).forEach(btn => {
          btn.addEventListener('click', () => {
            const tr   = btn.closest('tr');
            const item = getItems().find(x => x.id === tr.dataset.id);
            if (item) { tr.outerHTML = editRowHTML(item); attachListeners(); }
          });
        });

        tbody.querySelectorAll(`.${pfx}del`).forEach(btn => {
          btn.addEventListener('click', () => {
            const tr   = btn.closest('tr');
            const item = getItems().find(x => x.id === tr.dataset.id);
            if (item) { tr.outerHTML = deleteRowHTML(item); attachListeners(); }
          });
        });

        tbody.querySelectorAll(`.${pfx}confirm-del`).forEach(btn => {
          btn.addEventListener('click', () => {
            const tr = btn.closest('tr');
            saveItems(getItems().filter(x => x.id !== tr.dataset.id));
            tr.style.opacity = '0';
            setTimeout(renderRows, 200);
          });
        });

        tbody.querySelectorAll(`.${pfx}cancel-del`).forEach(btn => {
          btn.addEventListener('click', () => {
            const tr   = btn.closest('tr');
            const item = getItems().find(x => x.id === tr.dataset.id);
            if (item) { tr.outerHTML = rowHTML(item); attachListeners(); }
          });
        });

        tbody.querySelectorAll(`.${pfx}save`).forEach(btn => {
          btn.addEventListener('click', () => {
            const tr     = btn.closest('tr');
            const oldId  = tr.dataset.id;
            const nombre = tr.querySelector(`.${pfx}nombre`).value.trim();
            if (!nombre) { tr.querySelector(`.${pfx}nombre`).focus(); return; }
            const updated = {
              id:     oldId,
              nombre,
              nota:   tr.querySelector(`.${pfx}nota`).value.trim(),
              tamano: tr.querySelector(`.${pfx}tam`).value.trim() || '—',
              precio: tr.querySelector(`.${pfx}precio`).value.trim() || '0',
              unidad: tr.querySelector(`.${pfx}unidad`).value.trim() || 'por pieza',
            };
            saveItems(getItems().map(x => x.id === oldId ? updated : x));
            tr.outerHTML = rowHTML(updated);
            attachListeners();
            flash();
          });
        });

        tbody.querySelectorAll(`.${pfx}cancel`).forEach(btn => {
          btn.addEventListener('click', () => {
            const tr   = btn.closest('tr');
            const item = getItems().find(x => x.id === tr.dataset.id);
            if (item) { tr.outerHTML = rowHTML(item); attachListeners(); }
          });
        });
      }

      function showAddForm() {
        const formEl = document.getElementById(addFormId);
        const addBtn = document.getElementById(addBtnId);
        formEl.style.display = '';
        addBtn.disabled = true; addBtn.style.opacity = '0.5';
        formEl.innerHTML = `
          <div class="card" style="padding:16px 20px;animation:fadeSlideIn .2s cubic-bezier(.25,1,.5,1)">
            <div class="card-title" style="margin-bottom:14px;font-size:13px">${addTitle}</div>
            <div class="row2" style="margin-bottom:12px">
              <div class="fg"><label>Nombre del servicio</label><input id="${prefix}-np-nombre" placeholder="Ej. Troquelado especial"/></div>
              <div class="fg"><label>Nota (opcional)</label><input id="${prefix}-np-nota" placeholder="Ej. Una sola vez por proyecto"/></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:16px">
              <div class="fg"><label>Tamaño / Nivel</label><input id="${prefix}-np-tam" placeholder="— o CH, MD, GD"/></div>
              <div class="fg"><label>Precio (MXN)</label><input id="${prefix}-np-precio" type="text" placeholder="80 ó 5%"/></div>
              <div class="fg"><label>Unidad</label><input id="${prefix}-np-unidad" placeholder="por proyecto, por pieza…"/></div>
            </div>
            <div class="btn-row">
              <button class="btn-primary" id="${prefix}-np-submit">Agregar servicio</button>
              <button class="btn-ghost" id="${prefix}-np-cancel">Cancelar</button>
            </div>
          </div>`;

        document.getElementById(`${prefix}-np-cancel`).addEventListener('click', hideAddForm);
        document.getElementById(`${prefix}-np-submit`).addEventListener('click', () => {
          const nombre = document.getElementById(`${prefix}-np-nombre`).value.trim();
          if (!nombre) { document.getElementById(`${prefix}-np-nombre`).focus(); return; }
          const newItem = {
            id:     prefix + Date.now(),
            nombre,
            nota:   document.getElementById(`${prefix}-np-nota`).value.trim(),
            tamano: document.getElementById(`${prefix}-np-tam`).value.trim() || '—',
            precio: document.getElementById(`${prefix}-np-precio`).value.trim() || '0',
            unidad: document.getElementById(`${prefix}-np-unidad`).value.trim() || 'por pieza',
          };
          saveItems([...getItems(), newItem]);
          hideAddForm();
          renderRows();
          flash();
        });
      }

      function hideAddForm() {
        const formEl = document.getElementById(addFormId);
        const addBtn = document.getElementById(addBtnId);
        if (formEl) { formEl.style.display = 'none'; formEl.innerHTML = ''; }
        if (addBtn) { addBtn.disabled = false; addBtn.style.opacity = ''; }
      }

      // Boot: render rows, bind add button
      renderRows();
      document.getElementById(addBtnId).addEventListener('click', showAddForm);
    }

    // ── Instantiate both CRUD sections ────────────────────────────
    makeCrud({
      prefix:    'pp',
      tbodyId:   'pp-tbody',
      addFormId: 'pp-add-form',
      addBtnId:  'btn-add-pp',
      cardId:    'card-preprensa',
      addTitle:  'Nuevo servicio — Pre-prensa',
      getItems:  getPreprensa,
      saveItems: savePreprensa,
    });

    makeCrud({
      prefix:    'rc',
      tbodyId:   'rc-tbody',
      addFormId: 'rc-add-form',
      addBtnId:  'btn-add-rc',
      cardId:    'card-recubrimiento',
      addTitle:  'Nuevo servicio — Recubrimientos',
      getItems:  getRecubrimientos,
      saveItems: saveRecubrimientos,
    });

    makeCrud({
      prefix:    'pr',
      tbodyId:   'pr-tbody',
      addFormId: 'pr-add-form',
      addBtnId:  'btn-add-pr',
      cardId:    'card-produccion',
      addTitle:  'Nuevo servicio — Producción & Prensa',
      getItems:  getProduccion,
      saveItems: saveProduccion,
    });

    makeCrud({
      prefix:    'ac',
      tbodyId:   'ac-tbody',
      addFormId: 'ac-add-form',
      addBtnId:  'btn-add-ac',
      cardId:    'card-acabados',
      addTitle:  'Nuevo servicio — Acabados & Terminados',
      getItems:  getAcabados,
      saveItems: saveAcabados,
    });

    // ── Search / filter ───────────────────────────────────────────
    function filterTariff() {
      const q    = document.getElementById('tariff-q').value;
      const cat  = document.getElementById('tariff-cat').value;
      const term = q.toLowerCase().trim();
      document.querySelectorAll('#app .tariff-category').forEach(section => {
        const catMatch = !cat || section.dataset.cat === cat;
        if (!catMatch) {
          section.style.opacity = '0'; section.style.pointerEvents = 'none';
          setTimeout(() => { section.style.display = 'none'; }, 180);
          return;
        }
        section.style.display = ''; section.style.pointerEvents = '';
        requestAnimationFrame(() => { section.style.opacity = '1'; });
        let anyVisible = false;
        section.querySelectorAll('tbody tr').forEach(row => {
          const search = (row.dataset.search || '') + (row.textContent || '');
          const show   = !term || search.toLowerCase().includes(term);
          if (show) {
            row.style.display = ''; row.style.opacity = '0';
            requestAnimationFrame(() => { row.style.opacity = '1'; row.style.transform = 'none'; });
            anyVisible = true;
          } else {
            row.style.opacity = '0'; row.style.transform = 'translateX(-4px)';
            setTimeout(() => { if (row.style.opacity === '0') row.style.display = 'none'; }, 180);
          }
        });
        if (!anyVisible) setTimeout(() => { section.style.display = 'none'; }, 200);
      });
    }

    document.getElementById('tariff-q').addEventListener('input', filterTariff);
    document.getElementById('tariff-cat').addEventListener('change', filterTariff);

    // stagger sections on load
    document.querySelectorAll('#app .tariff-category').forEach((sec, i) => {
      sec.style.opacity = '0'; sec.style.transform = 'translateY(10px)';
      sec.style.transition = 'opacity .3s ease, transform .3s ease';
      setTimeout(() => { sec.style.opacity = '1'; sec.style.transform = 'none'; }, 60 + i * 80);
    });
    document.querySelectorAll('.tariff-table tr').forEach(tr => {
      tr.style.transition = 'opacity .18s ease, transform .18s ease';
    });
  }
};
