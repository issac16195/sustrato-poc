const PRESET_SIZES = [
  { label:'Carta',         w:21.6,  h:27.9  },
  { label:'Media carta',   w:13.97, h:21.59 },
  { label:'1/4 carta',     w:10.79, h:13.97 },
  { label:'1/8 carta',     w:6.99,  h:10.79 },
  { label:'Personalizado', w:null,  h:null  },
];

views['cotizar'] = {
  render() {
    document.getElementById('app').innerHTML = `
<div class="content">
  <div class="steps">
    <div class="step active" id="s1"><div class="step-n">1</div><span class="step-label">Producto</span></div>
    <div class="step-line"></div>
    <div class="step" id="s2"><div class="step-n">2</div><span class="step-label">Especificaciones</span></div>
    <div class="step-line"></div>
    <div class="step" id="s3"><div class="step-n">3</div><span class="step-label">Resultado</span></div>
  </div>

  <!-- ── PASO 1: TIPO DE PRODUCTO ──────────────────────────────── -->
  <div id="c1">
    <p style="font-size:13px;color:var(--text2);margin-bottom:18px;font-weight:500">¿Qué tipo de proyecto vas a cotizar?</p>
    <div class="prod-grid">
      <div class="prod-card active" id="pc-general">
        <svg class="prod-card-icon" viewBox="0 0 44 44" fill="none">
          <rect x="8" y="6" width="28" height="34" rx="2" stroke="currentColor" stroke-width="1.8"/>
          <path d="M14 15h16M14 21h16M14 27h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <div class="prod-card-title">General</div>
        <div class="prod-card-sub">Posters, tarjetas, volantes, manteletas, etiquetas</div>
      </div>
      <div class="prod-card" id="pc-editorial">
        <svg class="prod-card-icon" viewBox="0 0 44 44" fill="none">
          <path d="M22 8L10 12v22l12 4 12-4V12L22 8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M22 8v28M10 12l12 4 12-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="prod-card-title">Editorial</div>
        <div class="prod-card-sub">Revistas, libros, folletos, catálogos, calendarios</div>
      </div>
      <div class="prod-card" id="pc-empaque">
        <svg class="prod-card-icon" viewBox="0 0 44 44" fill="none">
          <path d="M8 16l14-8 14 8v14l-14 8-14-8V16z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M8 16l14 8 14-8M22 24v16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="prod-card-title">Empaque</div>
        <div class="prod-card-sub">Plegadizo, corrugado, microcorrugado</div>
      </div>
    </div>
    <button class="btn-primary" id="btn-c1-next">Continuar →</button>
  </div>

  <!-- ── PASO 2: ESPECIFICACIONES ─────────────────────────────── -->
  <div id="c2" style="display:none">
    <div class="card">
      <div class="card-title">Especificaciones del proyecto</div>
      <div class="row2" style="margin-bottom:14px">
        <div class="fg" style="position:relative">
          <label>Cliente</label>
          <input type="text" id="cot-cl-inp" placeholder="Buscar cliente…" autocomplete="off"/>
          <div class="cot-cl-dd" id="cot-cl-dd" style="display:none"></div>
          <div id="cot-cl-badge" style="display:none"></div>
        </div>
        <div></div>
      </div>
      <div class="row2">
        <div class="fg"><label>Nombre del proyecto</label><input id="pnombre" type="text" value=""/></div>
        <div class="fg"><label>Cantidad de ejemplares</label><input id="pcantidad" type="number" value="5000"/></div>
      </div>
      <div class="row2">
        <div class="fg"><label>Tipo de papel</label>
          <select id="ptipo">
            <option value="bond">Papel Bond</option>
            <option value="couche" selected>Papel Couché</option>
            <option value="sulfatado">Sulfatado</option>
          </select>
        </div>
        <div class="fg"><label>Gramaje</label>
          <select id="pgramaje">
            <option>100g</option><option selected>150g</option><option>200g</option><option>250g</option><option>300g</option><option>350g</option>
          </select>
        </div>
      </div>
      <div class="row3">
        <div class="fg size-full">
          <label>Medida del producto</label>
          <div id="size-presets" class="size-presets"></div>
          <div id="size-manual" class="size-manual" style="display:none">
            <div class="fg"><label>Ancho (cm)</label><input id="pancho" type="number" step="0.1"/></div>
            <div class="fg"><label>Alto (cm)</label><input id="palto" type="number" step="0.1"/></div>
          </div>
        </div>
        <div class="fg"><label>Tintas</label>
          <select id="ptintas">
            <option value="4/0">4/0 (CMYK un lado)</option>
            <option value="4/4">4/4 (CMYK dos lados)</option>
            <option value="1/0">1/0 (un color)</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom:0">
        <label>Terminados</label>
        <div class="chips" id="chips-terminados"></div>
      </div>
    </div>

    <div class="imp-section-label" style="margin-top:6px">Imposición y máquina óptima</div>
    <div id="alert-maq" class="alert-box" style="display:none">⚠ El producto no cabe en ninguna máquina disponible. Revisa las dimensiones.</div>
    <div class="maq-cards" id="maq-cards"></div>
    <div id="imp-detail-card" class="card" style="padding:16px 20px"></div>

    <div class="btn-row">
      <button class="btn-ghost" id="btn-c2-back">← Atrás</button>
      <button class="btn-primary" id="btn-c2-next">Calcular cotización →</button>
    </div>
  </div>

  <!-- ── PASO 3: RESULTADO ─────────────────────────────────────── -->
  <div id="c3" style="display:none">
    <div class="result-block">
      <div class="result-header">
        <div>
          <div class="result-nombre" id="r-nombre">Posters Cliente XYZ</div>
          <div class="result-sub" id="r-sub">Papel Couché 150g · CD102 · 4/0</div>
        </div>
        <span class="badge badge-green">Lista ✓</span>
      </div>
      <div class="result-grid-4">
        <div class="rmet">
          <div class="rmet-label">Ejemplares finales</div>
          <div class="rmet-val" id="r-ej">5,000</div>
          <div class="rmet-sub" id="r-merma-sub">+ 400 merma</div>
        </div>
        <div class="rmet">
          <div class="rmet-label">Pliegos a imprimir</div>
          <div class="rmet-val" id="r-pliegos">1,080</div>
          <div class="rmet-sub" id="r-maq-sub">en CD102</div>
        </div>
        <div class="rmet">
          <div class="rmet-label">Pzas / pliego</div>
          <div class="rmet-val" id="r-imp-count">5</div>
          <div class="rmet-sub" id="r-imp-sub">imposición</div>
        </div>
        <div class="rmet">
          <div class="rmet-label">Costo de producción</div>
          <div class="rmet-val teal" id="r-costo">$4,320</div>
          <div class="rmet-sub">sin IVA</div>
        </div>
      </div>
      <div class="r-divider"></div>
      <div class="r-section-label">Desglose de costos</div>
      <div id="r-desglose"></div>
      <div class="r-divider"></div>
      <div class="r-margen-row">
        <span class="r-margen-label">Margen deseado</span>
        <div class="r-margen-ctrl">
          <input type="range" id="r-margen-input" min="10" max="60" value="30" step="1"/>
          <span class="r-margen-pct" id="r-margen-pct">30%</span>
        </div>
      </div>
      <div class="r-total">
        <div class="r-total-label">Precio sugerido de venta</div>
        <div class="r-total-val" id="r-precio">$2,544</div>
      </div>
      <div class="r-margin" id="r-margin">Utilidad estimada: $XXX</div>
    </div>
    <div class="btn-row">
      <button class="btn-ghost" id="btn-c3-back">← Editar</button>
      <button class="btn-ghost" id="btn-pdf">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="vertical-align:middle;margin-right:6px"><path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6L9 2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 2v4h4M8 9v4M6 11l2 2 2-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Descargar PDF
      </button>
      <button class="btn-primary" id="btn-wa">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:middle;margin-right:6px"><path d="M8 0a8 8 0 0 0-6.9 12L0 16l4.1-1.1A8 8 0 1 0 8 0zm0 14.5a6.46 6.46 0 0 1-3.3-.9l-.24-.14-2.44.64.65-2.38-.15-.24A6.5 6.5 0 1 1 8 14.5zm3.57-4.87c-.2-.1-1.16-.57-1.34-.64-.18-.07-.3-.1-.43.1-.13.2-.5.64-.62.77-.11.13-.23.14-.42.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.11-1.38-.11-.2-.01-.3.09-.4l.38-.44c.12-.14.15-.24.23-.4.08-.14.04-.27-.02-.38-.06-.1-.43-1.04-.6-1.43-.15-.37-.31-.32-.43-.33l-.37-.01c-.13 0-.33.05-.5.24s-.66.64-.66 1.56.68 1.82.77 1.94c.1.13 1.33 2.04 3.24 2.86.45.2.8.31 1.08.4.45.14.87.12 1.2.07.36-.06 1.12-.46 1.28-.9.16-.45.16-.83.11-.91-.05-.08-.18-.13-.37-.22z"/></svg>
        Enviar por WhatsApp
      </button>
    </div>
    <div class="wa-confirm" id="wa-ok">✅ PDF generado — abriendo WhatsApp...</div>
  </div>
</div>
`;
  },

  init() {
    // ── Machines (from shared store) ──────────────────────────────
    const MACHINES = getMachines().map(m => ({
      ...m, util: { w: m.utilW, h: m.utilH }
    }));

    // ── Client autocomplete ───────────────────────────────────────
    let _clientId = null;
    const clInp  = document.getElementById('cot-cl-inp');
    const clDd   = document.getElementById('cot-cl-dd');
    const clBadge = document.getElementById('cot-cl-badge');

    function clInitials(c) {
      const p = (c.nombre || '?').trim().split(/\s+/);
      return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
    }

    function selectClient(c) {
      _clientId = c.id;
      clInp.style.display = 'none';
      clDd.style.display = 'none';
      clBadge.style.display = 'flex';
      clBadge.innerHTML = `
        <div class="cot-cl-selected">
          <div class="cl-avatar" style="width:22px;height:22px;font-size:10px;flex-shrink:0">${clInitials(c)}</div>
          <span style="font-weight:600;color:var(--navy)">${c.nombre}${c.empresa ? ` <span style="font-weight:400;color:var(--text3)">· ${c.empresa}</span>` : ''}</span>
          <span class="cot-cl-clear" title="Cambiar cliente">✕</span>
        </div>`;
      clBadge.querySelector('.cot-cl-clear').addEventListener('click', clearClient);
    }

    function clearClient() {
      _clientId = null;
      clInp.style.display = '';
      clInp.value = '';
      clBadge.style.display = 'none';
      clInp.focus();
    }

    function openQuickAdd(nombre) {
      const bg = document.createElement('div');
      bg.className = 'cl-modal-bg';
      bg.style.display = 'flex';
      bg.innerHTML = `
        <div class="cl-modal">
          <div class="cl-modal-head">Nuevo cliente</div>
          <div class="cl-modal-body">
            <div class="row2" style="margin-bottom:12px">
              <div class="fg"><label>Nombre completo *</label><input id="qa-nombre" value="${nombre}"/></div>
              <div class="fg"><label>Empresa</label><input id="qa-empresa"/></div>
            </div>
            <div class="row2">
              <div class="fg"><label>Email</label><input id="qa-email" type="email"/></div>
              <div class="fg"><label>Teléfono</label><input id="qa-tel"/></div>
            </div>
          </div>
          <div class="cl-modal-foot">
            <button class="btn-ghost" id="qa-cancel">Cancelar</button>
            <button class="btn-primary" id="qa-save">Guardar y seleccionar</button>
          </div>
        </div>`;
      document.body.appendChild(bg);
      setTimeout(() => document.getElementById('qa-nombre').focus(), 50);

      bg.addEventListener('click', e => { if (e.target === bg) bg.remove(); });
      document.getElementById('qa-cancel').addEventListener('click', () => bg.remove());
      document.getElementById('qa-save').addEventListener('click', () => {
        const n = document.getElementById('qa-nombre').value.trim();
        if (!n) { document.getElementById('qa-nombre').focus(); return; }
        const nc = {
          id: 'cl_' + Date.now(),
          nombre: n,
          empresa:   document.getElementById('qa-empresa').value.trim(),
          email:     document.getElementById('qa-email').value.trim(),
          tel:       document.getElementById('qa-tel').value.trim(),
          rfc: '', direccion: '', notas: '',
          createdAt: Date.now(),
        };
        const arr = getClientes();
        arr.unshift(nc);
        saveClientes(arr);
        bg.remove();
        selectClient(nc);
      });
    }

    clInp.addEventListener('input', () => {
      const q = clInp.value.trim();
      if (!q) { clDd.style.display = 'none'; return; }
      const matches = getClientes()
        .filter(c => (c.nombre + ' ' + (c.empresa || '')).toLowerCase().includes(q.toLowerCase()))
        .slice(0, 5);
      clDd.innerHTML = [
        ...matches.map(c => `
          <div class="cot-cl-item" data-id="${c.id}">
            <div class="cl-avatar" style="width:26px;height:26px;font-size:10px;flex-shrink:0">${clInitials(c)}</div>
            <div>
              <div style="font-weight:600;color:var(--navy)">${c.nombre}</div>
              ${c.empresa ? `<div style="font-size:11px;color:var(--text3)">${c.empresa}</div>` : ''}
            </div>
          </div>`),
        `<div class="cot-cl-item cot-cl-add">
          <span style="font-size:16px;line-height:1;color:var(--teal)">+</span>
          <span>Agregar "<strong>${q}</strong>" como nuevo cliente</span>
        </div>`
      ].join('');
      clDd.style.display = '';
      clDd.querySelectorAll('.cot-cl-item[data-id]').forEach(el => {
        el.addEventListener('click', () => {
          const c = getClientes().find(x => x.id === el.dataset.id);
          if (c) selectClient(c);
        });
      });
      clDd.querySelector('.cot-cl-add').addEventListener('click', () => {
        clDd.style.display = 'none';
        openQuickAdd(q);
      });
    });

    clInp.addEventListener('blur', () => {
      setTimeout(() => { clDd.style.display = 'none'; }, 200);
    });
    clInp.addEventListener('focus', () => {
      if (clInp.value.trim()) clInp.dispatchEvent(new Event('input'));
    });

    // ── Module state ──────────────────────────────────────────────
    let _imps = {};
    let _selectedMaq = 'CD102';
    let _bestMaq = 'CD102';
    let _quoteData = null;

    // ── Step helpers ──────────────────────────────────────────────
    function setStep(n) {
      [1,2,3].forEach(i => {
        const el = document.getElementById('s'+i);
        el.className = 'step' + (i===n?' active': i<n?' done':'');
      });
    }
    function showPanel(p) {
      ['c1','c2','c3'].forEach(id => {
        document.getElementById(id).style.display = id===p ? '' : 'none';
      });
    }

    // ── Count-up animation ────────────────────────────────────────
    function countUp(el, target, prefix, duration) {
      if (!el) return;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now-start)/duration, 1);
        const ease = 1 - Math.pow(1-p, 3);
        el.textContent = prefix + Math.round(target*ease).toLocaleString('es-MX');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // ── Imposition calculator ─────────────────────────────────────
    const SANGRIA = 0.3; // cm bleed on each side

    function calcImp(pW, pH, util) {
      if (pW <= 0 || pH <= 0) return {nx:0,ny:0,count:0,rotated:false,cw:pW,ch:pH,pw:pW,ph:pH};
      const cw1=pW+SANGRIA*2, ch1=pH+SANGRIA*2;
      const nx1=Math.floor(util.w/cw1)||0, ny1=Math.floor(util.h/ch1)||0;
      const cw2=pH+SANGRIA*2, ch2=pW+SANGRIA*2;
      const nx2=Math.floor(util.w/cw2)||0, ny2=Math.floor(util.h/ch2)||0;
      if (nx2*ny2 > nx1*ny1)
        return {nx:nx2,ny:ny2,count:nx2*ny2,rotated:true, cw:cw2,ch:ch2,pw:pH,ph:pW};
      return   {nx:nx1,ny:ny1,count:nx1*ny1,rotated:false,cw:cw1,ch:ch1,pw:pW,ph:pH};
    }

    // ── SVG builder ───────────────────────────────────────────────
    let _svgUid = 0;
    function buildSVG(util, imp, maxPx) {
      const uid = 'h' + (++_svgUid);
      if (!imp || imp.count === 0) {
        return `<svg width="${maxPx}" height="${Math.round(maxPx*0.72)}" viewBox="0 0 ${maxPx} ${Math.round(maxPx*0.72)}">
          <rect width="${maxPx}" height="${Math.round(maxPx*0.72)}" fill="#F1F1ED" rx="3"/>
          <text x="${maxPx/2}" y="${Math.round(maxPx*0.38)}" text-anchor="middle" fill="#8892A4" font-size="11" font-family="Inter,sans-serif" font-weight="600">No apta</text>
        </svg>`;
      }
      // scale so longest side = maxPx
      const aspect = util.h / util.w;
      let svgW, svgH;
      if (aspect >= 1) { svgH = maxPx; svgW = Math.round(maxPx / aspect); }
      else             { svgW = maxPx; svgH = Math.round(maxPx * aspect); }
      const scaleX = svgW / util.w;
      const scaleY = svgH / util.h;

      // Piece rects (actual print area = cw-sangria*2 × ch-sangria*2)
      const s = SANGRIA;
      let pieces = '';
      const showNums = imp.count <= 16 && maxPx >= 180;
      for (let row=0; row<imp.ny; row++) {
        for (let col=0; col<imp.nx; col++) {
          const x = (col*imp.cw + s) * scaleX;
          const y = (row*imp.ch + s) * scaleY;
          const pw = (imp.cw - s*2) * scaleX;
          const ph = (imp.ch - s*2) * scaleY;
          pieces += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1,pw).toFixed(1)}" height="${Math.max(1,ph).toFixed(1)}" fill="#00A878" fill-opacity=".88" rx="1.5"/>`;
          if (showNums) {
            const idx = row*imp.nx + col + 1;
            const fs = Math.min(9, Math.floor(pw*0.38));
            pieces += `<text x="${(x+pw/2).toFixed(1)}" y="${(y+ph/2+fs*0.35).toFixed(1)}" text-anchor="middle" fill="#fff" font-size="${fs}" font-family="Inter,sans-serif" font-weight="700">${idx}</text>`;
          }
        }
      }

      return `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block;margin:auto">
        <defs>
          <pattern id="${uid}" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#CCCCC8" stroke-width="1.2"/>
          </pattern>
        </defs>
        <rect width="${svgW}" height="${svgH}" fill="url(#${uid})" rx="2"/>
        <rect width="${svgW}" height="${svgH}" fill="none" stroke="#1A2035" stroke-width="1.5" rx="2"/>
        ${pieces}
      </svg>`;
    }

    // ── Efficiency helper ─────────────────────────────────────────
    function efficiency(m, imp) {
      if (!imp || imp.count === 0) return 0;
      const used = (imp.cw - SANGRIA*2) * (imp.ch - SANGRIA*2) * imp.count;
      return Math.round(used / (m.util.w * m.util.h) * 100);
    }

    // ── Tintas count ──────────────────────────────────────────────
    function getTintas() {
      const v = document.getElementById('ptintas').value;
      return v === '4/4' ? 8 : v === '1/0' ? 1 : 4;
    }

    // ── Render machine cards ──────────────────────────────────────
    function renderCards() {
      const cardsEl = document.getElementById('maq-cards');
      const detailEl = document.getElementById('imp-detail-card');
      if (!cardsEl || !detailEl) return;

      const cant  = +document.getElementById('pcantidad').value || 0;
      const merma = getMerma(cant, _selectedMaq);

      // Build card HTML
      let html = '';
      for (const m of MACHINES) {
        const imp   = _imps[m.id];
        const nofit = !imp || imp.count === 0;
        const isOpt = m.id === _bestMaq;
        const isSel = m.id === _selectedMaq;
        const eff   = efficiency(m, imp);
        let cls = 'maq-card';
        if (isSel) cls += ' selected';
        if (nofit) cls += ' no-fit';
        const svgStr = buildSVG(m.util, imp, 84);
        html += `<div class="${cls}" data-maq="${m.id}">
          ${isOpt && !nofit ? `<div class="maq-opt-badge">⭐ Óptima</div>` : ''}
          <div class="maq-card-name">${m.name}</div>
          <div class="maq-card-tag">${m.tag} · ${m.util.w}×${m.util.h} cm</div>
          <div class="maq-imp-preview">${svgStr}</div>
          <div class="maq-card-stats">
            <div class="maq-stat">
              <span class="maq-stat-val${nofit?' zero':''}">${nofit?'—':imp.count}</span>
              <div class="maq-stat-lbl">pzas/pliego</div>
            </div>
            <div class="maq-stat">
              <span class="maq-stat-val${nofit?' zero':''}">${nofit?'—':eff+'%'}</span>
              <div class="maq-stat-lbl">eficiencia</div>
            </div>
          </div>
        </div>`;
      }
      cardsEl.innerHTML = html;

      // Card click handlers
      cardsEl.querySelectorAll('.maq-card:not(.no-fit)').forEach(card => {
        card.addEventListener('click', () => {
          _selectedMaq = card.dataset.maq;
          renderCards();
        });
      });

      // Detail panel
      const sel = MACHINES.find(m => m.id === _selectedMaq);
      if (!sel) { detailEl.innerHTML = ''; return; }
      const imp = _imps[sel.id];
      const nofit = !imp || imp.count === 0;

      if (nofit) {
        detailEl.innerHTML = `
          <div class="imp-nofit-msg">
            <strong>No apta para este producto</strong>
            Las dimensiones superan el área útil de la ${sel.name}.
          </div>`;
        return;
      }

      const pliegos  = Math.ceil((cant + merma) / imp.count);
      const tintas   = getTintas();
      const eff      = efficiency(sel, imp);
      const bigSVG   = buildSVG(sel.util, imp, 240);

      detailEl.innerHTML = `
        <div class="card-title" style="margin-bottom:14px">Detalle imposición · ${sel.name}</div>
        <div class="imp-detail">
          <div class="imp-big-preview">${bigSVG}</div>
          <div class="imp-stats">
            <div class="imp-stat-item">
              <span class="imp-stat-n">${imp.count}</span>
              <span class="imp-stat-l">Pzas / pliego</span>
            </div>
            <div class="imp-stat-item">
              <span class="imp-stat-n">${pliegos.toLocaleString('es-MX')}</span>
              <span class="imp-stat-l">Pliegos a imprimir</span>
            </div>
            <div class="imp-stat-item">
              <span class="imp-stat-n">${tintas}</span>
              <span class="imp-stat-l">Planchas (${sel.name})</span>
            </div>
            <div class="imp-stat-item">
              <span class="imp-stat-n">${eff}%</span>
              <span class="imp-stat-l">Eficiencia de pliego</span>
            </div>
            ${imp.rotated ? `<div class="imp-rotation-note">↻ Girado 90° — optimiza la imposición de ${imp.nx}×${imp.ny}</div>` : ''}
          </div>
        </div>`;
    }

    // ── Recalc ────────────────────────────────────────────────────
    function recalc() {
      const pW = +document.getElementById('pancho').value || 0;
      const pH = +document.getElementById('palto').value || 0;

      _imps = {};
      let bestCount = -1;
      _bestMaq = null;
      for (const m of MACHINES) {
        const imp = calcImp(pW, pH, m.util);
        _imps[m.id] = imp;
        if (imp.count > bestCount) { bestCount = imp.count; _bestMaq = m.id; }
      }

      const alrt = document.getElementById('alert-maq');
      if (bestCount === 0) {
        alrt.style.display = 'block';
      } else {
        alrt.style.display = 'none';
        // keep selection only if it still fits; otherwise snap to best
        if (!_selectedMaq || !_imps[_selectedMaq] || _imps[_selectedMaq].count === 0) {
          _selectedMaq = _bestMaq;
        }
      }

      renderCards();
    }

    // ── updateGramajes ────────────────────────────────────────────
    function updateGramajes() {
      const t = document.getElementById('ptipo').value;
      const s = document.getElementById('pgramaje');
      s.innerHTML = '';
      const opts = {
        bond:      ['75g','90g','105g','120g'],
        couche:    ['100g','150g','200g','250g','300g','350g'],
        sulfatado: ['12 pts','14 pts','16 pts','18 pts','20 pts','24 pts'],
      };
      (opts[t]||[]).forEach(o => { const op=document.createElement('option'); op.textContent=o; s.appendChild(op); });
      if (t==='couche') s.value='150g';
    }

    // ── goC3 ──────────────────────────────────────────────────────
    function goC3() {
      const nom   = document.getElementById('pnombre').value || 'Sin nombre';
      const cant  = +document.getElementById('pcantidad').value || 5000;
      const sel   = MACHINES.find(m => m.id === _selectedMaq) || MACHINES[2];
      const merma = getMerma(cant, sel.id);
      const imp   = _imps[sel.id] || {count:1};
      const pliegos = Math.ceil((cant + merma) / Math.max(1, imp.count));
      const tintas  = getTintas();
      const maqId   = sel.id;   // usa el id real de la máquina para lookup en tarifario

      const produccion = getProduccion();
      const tipoPapel  = document.getElementById('ptipo').value;         // bond|couche|sulfatado
      const gramaje    = document.getElementById('pgramaje').value;      // '150g', '12 pts', etc.
      const utilW_m    = (sel.utilW || sel.util?.w || 50) / 100;
      const utilH_m    = (sel.utilH || sel.util?.h || 70) / 100;

      // ── 1. Papel ──────────────────────────────────────────────────
      const papelPx      = getPapelPriceFor(tipoPapel, gramaje, sel.pliegoPrice);
      const costoPapel   = pliegos * papelPx;
      const cortePrensa  = costoPapel * 0.05;

      // ── 2. Láminas ────────────────────────────────────────────────
      const lamEntry  = lookupTarifa(produccion, 'Láminas para impresión', maqId);
      const millares  = Math.ceil(pliegos / 1000);
      const lamCtx    = { cant, pliegos, utilW_m, utilH_m, tintas, millares };
      const costoLam  = lamEntry
        ? applyUnidad(lamEntry, lamCtx)
        : tintas * 0;

      // ── 3. Impresión (por color × millar de pliegos) ──────────────
      const impEntry  = lookupTarifa(produccion, 'Impresión', maqId);
      const costoImp  = impEntry
        ? applyUnidad(impEntry, lamCtx)
        : 0;

      // ── 4. Terminados seleccionados ───────────────────────────────
      const chips = [...document.querySelectorAll('#chips-terminados .chip.on')];
      const termLines = chips.map(ch => {
        const procId = ch.dataset.procId;
        const nombre = ch.textContent.trim();
        const costo  = calcTerminadoCosto(procId, maqId, cant, pliegos, utilW_m, utilH_m, tintas, millares);
        return { nombre, costo };
      });
      const costoTerm = termLines.reduce((s, l) => s + l.costo, 0);

      // ── 5. Total ──────────────────────────────────────────────────
      const costoTotal = costoPapel + cortePrensa + costoLam + costoImp + costoTerm;

      // Helper: renders cost + re-calculates price when margen changes
      function renderResult(margenPct) {
        const precioVenta = margenPct >= 100 ? costoTotal : costoTotal / (1 - margenPct / 100);
        const utilidad    = precioVenta - costoTotal;

        // Métricas superiores
        document.getElementById('r-ej').textContent        = cant.toLocaleString('es-MX');
        document.getElementById('r-pliegos').textContent   = pliegos.toLocaleString('es-MX');
        document.getElementById('r-imp-count').textContent = imp.count.toLocaleString('es-MX');
        document.getElementById('r-costo').textContent     = fmtMXN(costoTotal);

        // Desglose
        const fmt = n => fmtMXN(n);
        const tintasLabel = document.getElementById('ptintas').value;
        const lines = [
          { label: `Papel (${pliegos.toLocaleString('es-MX')} pliegos × ${fmtMXN(papelPx)})`, val: costoPapel },
          { label: 'Corte a prensa (5%)',                                                            val: cortePrensa, sub: true },
          { label: `Láminas (${tintas} ${tintas===1?'tinta':'tintas'} × ${fmtMXN(parseFloat(lamEntry?.precio)||0)})`, val: costoLam },
          { label: `Impresión ${tintasLabel} · ${millares} ${millares===1?'millar':'millares'}`,                 val: costoImp },
          ...termLines.map(l => ({ label: l.nombre, val: l.costo })),
        ];

        document.getElementById('r-desglose').innerHTML = lines.map(l =>
          `<div class="r-row${l.sub?' r-row-sub':''}"><span>${l.label}</span><span>${fmt(l.val)}</span></div>`
        ).join('');

        // Precio y utilidad
        document.getElementById('r-precio').textContent = fmt(precioVenta);
        document.getElementById('r-margin').textContent =
          `Utilidad estimada: ${fmt(utilidad)} · P/U: $${(precioVenta / Math.max(1,cant)).toFixed(4)}`;
      }

      // Bind margen slider
      const slider = document.getElementById('r-margen-input');
      const pctLbl = document.getElementById('r-margen-pct');
      slider.oninput = () => {
        pctLbl.textContent = slider.value + '%';
        renderResult(+slider.value);
      };

      // Meta
      document.getElementById('r-nombre').textContent = nom;
      document.getElementById('r-sub').textContent =
        `${document.getElementById('ptipo').options[document.getElementById('ptipo').selectedIndex].text} ${gramaje} · ${sel.name} · ${document.getElementById('ptintas').value}`;
      document.getElementById('r-merma-sub').textContent = '+ ' + merma.toLocaleString('es-MX') + ' merma';
      document.getElementById('r-maq-sub').textContent   = 'en ' + sel.name;
      document.getElementById('r-imp-sub').textContent   = imp.count + ' pzas/pliego';

      // ── Capturar datos para PDF y persistencia ────────────────────
      const tintasLabel = document.getElementById('ptintas').value;
      const tipoPapelLabel = document.getElementById('ptipo').options[document.getElementById('ptipo').selectedIndex].text;
      const tipoMap = { 'pc-general':'General', 'pc-editorial':'Editorial', 'pc-empaque':'Empaque' };
      const tipoActivo = tipoMap[document.querySelector('.prod-card.active')?.id] || 'General';
      const clienteObj = _clientId ? getClientes().find(c => c.id === _clientId) : null;
      _quoteData = {
        id: 'cot-' + Date.now(),
        nom, cant, merma, pliegos, millares, tintas, tintasLabel,
        tipoPapelLabel, gramaje,
        tipo: tipoActivo,
        maqName: sel.name,
        impCount: imp.count,
        papelPx, costoPapel, cortePrensa,
        lamPrecio: parseFloat(lamEntry?.precio) || 0,
        impPrecio: parseFloat(impEntry?.precio) || 0,
        costoLam, costoImp,
        termLines,
        costoTotal,
        clientId: _clientId || null,
        clientNombre: clienteObj ? (clienteObj.empresa || clienteObj.nombre) : '',
        fecha: new Date(),
      };

      showPanel('c3');
      clearInterval(timerInt);
      timerOn = false;
      setStep(3);

      renderResult(+(slider?.value || 30));
    }

    // ── pickProd ──────────────────────────────────────────────────
    function pickProd(card) {
      document.querySelectorAll('.prod-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    }

    // ── toggleChip ────────────────────────────────────────────────
    function toggleChip(chip) {
      chip.classList.toggle('on');
      chip.classList.remove('popping');
      void chip.offsetWidth;
      chip.classList.add('popping');
    }

    // ── sendWA ────────────────────────────────────────────────────
    function sendWA() {
      if (_quoteData) {
        const margenPct = +(document.getElementById('r-margen-input')?.value || 30);
        const precioVenta = margenPct >= 100 ? _quoteData.costoTotal : _quoteData.costoTotal / (1 - margenPct / 100);
        const qd2 = _quoteData;
        registrarCotizacion({
          id: qd2.id, fecha: qd2.fecha instanceof Date ? qd2.fecha.toISOString() : qd2.fecha,
          nom: qd2.nom, tipo: qd2.tipo, cant: qd2.cant, maqName: qd2.maqName,
          tintasLabel: qd2.tintasLabel, tipoPapelLabel: qd2.tipoPapelLabel, gramaje: qd2.gramaje,
          clientId: qd2.clientId, clientNombre: qd2.clientNombre,
          costoTotal: qd2.costoTotal, margenPct, precioVenta,
          estado: 'cotizacion',
          snap: {
            merma: qd2.merma, pliegos: qd2.pliegos, millares: qd2.millares,
            tintas: qd2.tintas, impCount: qd2.impCount,
            papelPx: qd2.papelPx, costoPapel: qd2.costoPapel, cortePrensa: qd2.cortePrensa,
            lamPrecio: qd2.lamPrecio, costoLam: qd2.costoLam, costoImp: qd2.costoImp,
            termLines: qd2.termLines,
          },
        });
      }
      const btn = document.getElementById('btn-wa');
      const ok  = document.getElementById('wa-ok');
      btn.textContent = '✓ ¡Enviando!';
      btn.style.background = 'var(--teal-dark)';
      setTimeout(() => {
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:middle;margin-right:6px"><path d="M8 0a8 8 0 0 0-6.9 12L0 16l4.1-1.1A8 8 0 1 0 8 0zm0 14.5a6.46 6.46 0 0 1-3.3-.9l-.24-.14-2.44.64.65-2.38-.15-.24A6.5 6.5 0 1 1 8 14.5zm3.57-4.87c-.2-.1-1.16-.57-1.34-.64-.18-.07-.3-.1-.43.1-.13.2-.5.64-.62.77-.11.13-.23.14-.42.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.11-1.38-.11-.2-.01-.3.09-.4l.38-.44c.12-.14.15-.24.23-.4.08-.14.04-.27-.02-.38-.06-.1-.43-1.04-.6-1.43-.15-.37-.31-.32-.43-.33l-.37-.01c-.13 0-.33.05-.5.24s-.66.64-.66 1.56.68 1.82.77 1.94c.1.13 1.33 2.04 3.24 2.86.45.2.8.31 1.08.4.45.14.87.12 1.2.07.36-.06 1.12-.46 1.28-.9.16-.45.16-.83.11-.91-.05-.08-.18-.13-.37-.22z"/></svg>Enviar por WhatsApp`;
        btn.style.background = '';
      }, 1500);
      ok.classList.remove('visible');
      void ok.offsetWidth;
      ok.classList.add('visible');
      setTimeout(() => { ok.classList.remove('visible'); ok.style.display='none'; }, 3500);
    }

    // ── generarPDF ────────────────────────────────────────────────
    function generarPDF() {
      if (!_quoteData) return;
      if (!window.jspdf) { alert('La librería PDF aún está cargando, intenta en un momento.'); return; }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const profile = getProfile();
      const qd = _quoteData;
      const margenPct = +(document.getElementById('r-margen-input')?.value || 30);
      const precioVenta = margenPct >= 100 ? qd.costoTotal : qd.costoTotal / (1 - margenPct / 100);
      const utilidad = precioVenta - qd.costoTotal;

      const TEAL   = [0, 168, 120];
      const NAVY   = [28, 32, 21];
      const GRAY   = [90, 100, 86];
      const LTGRAY = [240, 243, 238];
      const pageW  = 210;
      const margin = 14;
      const fmtN   = n => fmtMXN(n);
      let y = 16;

      // ── Logo ──────────────────────────────────────────────────────
      if (profile.logo) {
        try {
          const ext = profile.logo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
          doc.addImage(profile.logo, ext, margin, y, 36, 16, '', 'FAST');
        } catch(e) {}
      }

      // ── Folio y fecha (derecha) ───────────────────────────────────
      const dia  = qd.fecha.toLocaleDateString('es-MX', { day:'numeric', month:'long', year:'numeric' });
      const folio = `#${qd.fecha.getFullYear()}${String(qd.fecha.getMonth()+1).padStart(2,'0')}${String(qd.fecha.getDate()).padStart(2,'0')}`;
      doc.setFont('helvetica','bold').setFontSize(20).setTextColor(...NAVY);
      doc.text('COTIZACIÓN', pageW - margin, y + 5, { align:'right' });
      doc.setFont('helvetica','normal').setFontSize(8).setTextColor(...GRAY);
      doc.text(folio, pageW - margin, y + 11, { align:'right' });
      doc.text(dia,   pageW - margin, y + 16, { align:'right' });

      // ── Datos de la imprenta (izquierda, bajo logo) ───────────────
      y += 22;
      doc.setFont('helvetica','bold').setFontSize(10).setTextColor(...NAVY);
      doc.text(profile.imprenta || 'Mi Imprenta', margin, y);
      const infoLine = [profile.direccion, profile.ciudad, profile.tel ? 'Tel: ' + profile.tel : '', profile.email, profile.rfc ? 'RFC: ' + profile.rfc : ''].filter(Boolean).join('  ·  ');
      if (infoLine) {
        doc.setFont('helvetica','normal').setFontSize(7.5).setTextColor(...GRAY);
        doc.text(infoLine, margin, y + 5, { maxWidth: pageW - margin * 2 });
      }

      // ── Separador teal ────────────────────────────────────────────
      y += 14;
      doc.setDrawColor(...TEAL).setLineWidth(0.6).line(margin, y, pageW - margin, y);
      y += 7;

      // ── Datos del proyecto ────────────────────────────────────────
      doc.setFont('helvetica','bold').setFontSize(7.5).setTextColor(...TEAL);
      doc.text('PROYECTO', margin, y);
      y += 5;
      doc.setFont('helvetica','bold').setFontSize(13).setTextColor(...NAVY);
      doc.text(qd.nom, margin, y);
      y += 6;
      doc.setFont('helvetica','normal').setFontSize(8).setTextColor(...GRAY);
      doc.text(`${qd.cant.toLocaleString('es-MX')} piezas  ·  +${qd.merma.toLocaleString('es-MX')} merma`, margin, y);
      y += 4.5;
      doc.text(`${qd.tipoPapelLabel} ${qd.gramaje}  ·  ${qd.maqName}  ·  ${qd.tintasLabel}  ·  ${qd.impCount} pzas/pliego  ·  ${qd.pliegos.toLocaleString('es-MX')} pliegos`, margin, y);
      y += 9;

      // ── Tabla de costos ───────────────────────────────────────────
      const bodyRows = [
        [`Papel (${qd.pliegos.toLocaleString('es-MX')} pliegos × $${qd.papelPx.toFixed(2)})`, fmtN(qd.costoPapel)],
        ['  Corte a prensa (5%)',                                                                 fmtN(qd.cortePrensa)],
        [`Láminas (${qd.tintas} × $${qd.lamPrecio})`,                                           fmtN(qd.costoLam)],
        [`Impresión ${qd.tintasLabel} · ${qd.millares} ${qd.millares===1?'millar':'millares'}`,  fmtN(qd.costoImp)],
        ...qd.termLines.map(t => [t.nombre, fmtN(t.costo)]),
      ];

      doc.autoTable({
        startY: y,
        head: [['Concepto', 'Importe']],
        body: bodyRows,
        foot: [
          [{ content:'Costo de producción', styles:{fontStyle:'bold', textColor:NAVY} }, { content:fmtN(qd.costoTotal), styles:{fontStyle:'bold', textColor:NAVY} }],
          [`Margen (${margenPct}%)`, fmtN(utilidad)],
          [{ content:'PRECIO SUGERIDO DE VENTA', styles:{fontStyle:'bold', fontSize:10, textColor:NAVY, fillColor:LTGRAY} },
           { content:fmtN(precioVenta),           styles:{fontStyle:'bold', fontSize:10, textColor:NAVY, fillColor:LTGRAY} }],
        ],
        headStyles: { fillColor:TEAL, textColor:[255,255,255], fontSize:8, fontStyle:'bold', cellPadding:3 },
        bodyStyles: { fontSize:8, textColor:GRAY, cellPadding:2.5 },
        footStyles: { fontSize:8, textColor:GRAY, fillColor:[255,255,255], cellPadding:2.5 },
        columnStyles: { 0:{cellWidth:'auto'}, 1:{halign:'right', cellWidth:38} },
        margin: { left:margin, right:margin },
        theme: 'plain',
        styles: { lineColor:[218,224,216], lineWidth:0.2 },
      });

      y = doc.lastAutoTable.finalY + 5;

      // ── Precio unitario ───────────────────────────────────────────
      const pu = precioVenta / Math.max(1, qd.cant);
      doc.setFont('helvetica','normal').setFontSize(7.5).setTextColor(...GRAY);
      doc.text(`Precio unitario: $${pu.toFixed(4)}`, pageW - margin, y, { align:'right' });
      y += 10;

      // ── Footer ────────────────────────────────────────────────────
      doc.setDrawColor(...TEAL).setLineWidth(0.4).line(margin, y, pageW - margin, y);
      y += 5;
      doc.setFontSize(7).setTextColor(...GRAY);
      doc.text('Precios sin IVA  ·  Cotización válida por 30 días  ·  Generada con Sustrato', margin, y);
      const footContact = [profile.nombre, profile.tel, profile.email].filter(Boolean).join('  ·  ');
      if (footContact) doc.text(footContact, pageW - margin, y, { align:'right' });

      // ── Descarga ──────────────────────────────────────────────────
      const filename = `Cotizacion-${(qd.nom||'proyecto').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]/g,'').trim().replace(/\s+/g,'-')}.pdf`;
      doc.save(filename);

      // ── Persistir en dashboard ────────────────────────────────────
      registrarCotizacion({
        id: qd.id, fecha: qd.fecha instanceof Date ? qd.fecha.toISOString() : qd.fecha,
        nom: qd.nom, tipo: qd.tipo, cant: qd.cant, maqName: qd.maqName,
        tintasLabel: qd.tintasLabel, tipoPapelLabel: qd.tipoPapelLabel, gramaje: qd.gramaje,
        clientId: qd.clientId, clientNombre: qd.clientNombre,
        costoTotal: qd.costoTotal, margenPct, precioVenta,
        estado: 'cotizacion',
        snap: {
          merma: qd.merma, pliegos: qd.pliegos, millares: qd.millares,
          tintas: qd.tintas, impCount: qd.impCount,
          papelPx: qd.papelPx, costoPapel: qd.costoPapel, cortePrensa: qd.cortePrensa,
          lamPrecio: qd.lamPrecio, costoLam: qd.costoLam, costoImp: qd.costoImp,
          termLines: qd.termLines,
        },
      });
    }

    // ── initPresets / selectPreset ────────────────────────────────
    function selectPreset(idx) {
      const ps = PRESET_SIZES[idx];
      document.querySelectorAll('#size-presets .size-chip')
        .forEach((b, i) => b.classList.toggle('active', i === idx));
      const manual = document.getElementById('size-manual');
      if (ps.w === null) {
        manual.style.display = 'grid';
      } else {
        manual.style.display = 'none';
        document.getElementById('pancho').value = ps.w;
        document.getElementById('palto').value  = ps.h;
        recalc();
      }
    }

    function initPresets() {
      const container = document.getElementById('size-presets');
      PRESET_SIZES.forEach((ps, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'size-chip';
        btn.textContent = ps.label;
        btn.addEventListener('click', () => selectPreset(i));
        container.appendChild(btn);
      });
      selectPreset(0);
    }

    // ── Attach listeners ──────────────────────────────────────────
    document.getElementById('btn-c1-next').addEventListener('click', () => { showPanel('c2'); recalc(); setStep(2); });
    document.getElementById('btn-c2-back').addEventListener('click', () => { showPanel('c1'); setStep(1); });
    document.getElementById('btn-c2-next').addEventListener('click', goC3);
    document.getElementById('btn-c3-back').addEventListener('click', () => { showPanel('c2'); recalc(); setStep(2); });
    document.getElementById('btn-wa').addEventListener('click', sendWA);
    document.getElementById('btn-pdf').addEventListener('click', generarPDF);

    document.getElementById('pcantidad').addEventListener('input', () => { if (document.getElementById('c2').style.display !== 'none') renderCards(); });
    ['pancho','palto'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        const chips = document.querySelectorAll('#size-presets .size-chip');
        chips.forEach((b, i) => b.classList.toggle('active', i === chips.length - 1));
        recalc();
      });
    });
    document.getElementById('ptintas').addEventListener('change', renderCards);
    document.getElementById('ptipo').addEventListener('change', updateGramajes);

    document.querySelectorAll('#pc-general,#pc-editorial,#pc-empaque').forEach(card => {
      card.addEventListener('click', () => pickProd(card));
    });
    // Generar chips desde procesos activos con tarifaSrc
    const chipsEl = document.getElementById('chips-terminados');
    if (chipsEl) {
      chipsEl.innerHTML = getProcesos()
        .filter(p => p.active && p.tarifaSrc)
        .map(p => `<div class="chip" data-proc-id="${p.id}">${p.name}</div>`)
        .join('');
      chipsEl.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => toggleChip(chip));
      });
    }

    initPresets();
  }
};

// ── Genera PDF desde un registro del dashboard ───────────────────
function generarPDFCotizacion(rec) {
  if (!rec.snap) {
    alert('Este registro fue guardado con una versión anterior y no tiene los datos necesarios para regenerar el PDF. Abre la cotización nuevamente desde "Nueva cotización" para descargarla.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc     = new jsPDF({ unit:'mm', format:'a4' });
  const profile = getProfile();
  const s       = rec.snap;
  const margenPct   = rec.margenPct || 30;
  const precioVenta = rec.precioVenta || rec.costoTotal;
  const utilidad    = precioVenta - rec.costoTotal;

  const TEAL   = [0,168,120];
  const NAVY   = [28,32,21];
  const GRAY   = [90,100,86];
  const LTGRAY = [240,243,238];
  const pageW  = 210;
  const margin = 14;
  const fmtN   = n => fmtMXN(n);
  let y = 16;

  if (profile.logo) {
    try {
      const ext = profile.logo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(profile.logo, ext, margin, y, 36, 16, '', 'FAST');
    } catch(e) {}
  }

  const fecha = new Date(rec.fecha);
  const dia   = fecha.toLocaleDateString('es-MX', { day:'numeric', month:'long', year:'numeric' });
  const folio = `#${fecha.getFullYear()}${String(fecha.getMonth()+1).padStart(2,'0')}${String(fecha.getDate()).padStart(2,'0')}`;
  doc.setFont('helvetica','bold').setFontSize(20).setTextColor(...NAVY);
  doc.text('COTIZACIÓN', pageW - margin, y + 5, { align:'right' });
  doc.setFont('helvetica','normal').setFontSize(8).setTextColor(...GRAY);
  doc.text(folio, pageW - margin, y + 11, { align:'right' });
  doc.text(dia,   pageW - margin, y + 16, { align:'right' });

  y += 22;
  doc.setFont('helvetica','bold').setFontSize(10).setTextColor(...NAVY);
  doc.text(profile.imprenta || 'Mi Imprenta', margin, y);
  const infoLine = [profile.direccion, profile.ciudad, profile.tel ? 'Tel: '+profile.tel : '', profile.email, profile.rfc ? 'RFC: '+profile.rfc : ''].filter(Boolean).join('  ·  ');
  if (infoLine) { doc.setFont('helvetica','normal').setFontSize(7.5).setTextColor(...GRAY); doc.text(infoLine, margin, y+5, { maxWidth: pageW - margin*2 }); }

  y += 14;
  doc.setDrawColor(...TEAL).setLineWidth(0.6).line(margin, y, pageW - margin, y);
  y += 7;

  doc.setFont('helvetica','bold').setFontSize(7.5).setTextColor(...TEAL);
  doc.text('PROYECTO', margin, y);
  y += 5;
  doc.setFont('helvetica','bold').setFontSize(13).setTextColor(...NAVY);
  doc.text(rec.nom, margin, y);
  y += 6;
  doc.setFont('helvetica','normal').setFontSize(8).setTextColor(...GRAY);
  doc.text(`${(rec.cant||0).toLocaleString('es-MX')} piezas  ·  +${(s.merma||0).toLocaleString('es-MX')} merma`, margin, y);
  y += 4.5;
  doc.text(`${rec.tipoPapelLabel||''} ${rec.gramaje||''}  ·  ${rec.maqName||''}  ·  ${rec.tintasLabel||''}  ·  ${s.impCount||0} pzas/pliego  ·  ${(s.pliegos||0).toLocaleString('es-MX')} pliegos`, margin, y);
  y += 9;

  const bodyRows = [
    [`Papel (${(s.pliegos||0).toLocaleString('es-MX')} pliegos × ${fmtN(s.papelPx||0)})`, fmtN(s.costoPapel||0)],
    ['  Corte a prensa (5%)', fmtN(s.cortePrensa||0)],
    [`Láminas (${s.tintas||0} × ${fmtN(s.lamPrecio||0)})`, fmtN(s.costoLam||0)],
    [`Impresión ${rec.tintasLabel||''} · ${s.millares||0} ${(s.millares||0)===1?'millar':'millares'}`, fmtN(s.costoImp||0)],
    ...(s.termLines||[]).map(t => [t.nombre, fmtN(t.costo)]),
  ];

  doc.autoTable({
    startY: y,
    head: [['Concepto','Importe']],
    body: bodyRows,
    foot: [
      [{ content:'Costo de producción', styles:{fontStyle:'bold',textColor:NAVY} }, { content:fmtN(rec.costoTotal), styles:{fontStyle:'bold',textColor:NAVY} }],
      [`Margen (${margenPct}%)`, fmtN(utilidad)],
      [{ content:'PRECIO SUGERIDO DE VENTA', styles:{fontStyle:'bold',fontSize:10,textColor:NAVY,fillColor:LTGRAY} },
       { content:fmtN(precioVenta),            styles:{fontStyle:'bold',fontSize:10,textColor:NAVY,fillColor:LTGRAY} }],
    ],
    headStyles: { fillColor:TEAL, textColor:[255,255,255], fontSize:8, fontStyle:'bold', cellPadding:3 },
    bodyStyles: { fontSize:8, textColor:GRAY, cellPadding:2.5 },
    footStyles: { fontSize:8, textColor:GRAY, fillColor:[255,255,255], cellPadding:2.5 },
    columnStyles: { 0:{cellWidth:'auto'}, 1:{halign:'right',cellWidth:38} },
    margin: { left:margin, right:margin },
    theme: 'plain',
    styles: { lineColor:[218,224,216], lineWidth:0.2 },
  });

  y = doc.lastAutoTable.finalY + 5;
  const pu = precioVenta / Math.max(1, rec.cant||1);
  doc.setFont('helvetica','normal').setFontSize(7.5).setTextColor(...GRAY);
  doc.text(`Precio unitario: ${fmtN(pu)}`, pageW - margin, y, { align:'right' });
  y += 10;
  doc.setDrawColor(...TEAL).setLineWidth(0.4).line(margin, y, pageW - margin, y);
  y += 5;
  doc.setFontSize(7).setTextColor(...GRAY);
  doc.text('Precios sin IVA  ·  Cotización válida por 30 días  ·  Generada con Sustrato', margin, y);
  const footContact = [profile.nombre, profile.tel, profile.email].filter(Boolean).join('  ·  ');
  if (footContact) doc.text(footContact, pageW - margin, y, { align:'right' });

  const filename = `Cotizacion-${(rec.nom||'proyecto').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]/g,'').trim().replace(/\s+/g,'-')}.pdf`;
  doc.save(filename);
}
