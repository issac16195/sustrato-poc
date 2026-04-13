views['sustratos'] = {
  render() {
    document.getElementById('app').innerHTML = `
<div class="content" style="max-width:700px">
  <div class="tabs">
    <div class="tab active" data-panel="t-bond">Bond</div>
    <div class="tab" data-panel="t-couche">Couché</div>
    <div class="tab" data-panel="t-sulfatado">Sulfatado</div>
    <div class="tab" data-panel="t-mermas">Mermas</div>
  </div>

  <!-- BOND -->
  <div class="tab-panel active" id="t-bond">
    <div class="card">
      <div class="sust-header">
        <div>
          <div class="card-title">Papel Bond — costo por pliego</div>
          <div class="sust-sizes-label">Tamaños disponibles</div>
          <div class="sust-sizes">
            <span class="sust-size-chip">57×87 cm</span>
            <span class="sust-size-chip">61×90 cm</span>
            <span class="sust-size-chip">70×95 cm</span>
          </div>
        </div>
      </div>
      <table class="config-table sust-table">
        <thead><tr><th>Gramaje</th><th>$/pliego MXN</th><th></th></tr></thead>
        <tbody>
          <tr><td><span class="gramaje-tag">75g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="0.38" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">90g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="0.45" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">105g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="0.54" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">120g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="0.62" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- COUCHÉ -->
  <div class="tab-panel" id="t-couche">
    <div class="card">
      <div class="sust-header">
        <div>
          <div class="card-title">Papel Couché — costo por pliego</div>
          <div class="sust-sizes-label">Tamaños disponibles</div>
          <div class="sust-sizes">
            <span class="sust-size-chip">57×87 cm</span>
            <span class="sust-size-chip">61×96 cm</span>
            <span class="sust-size-chip">70×85 cm</span>
            <span class="sust-size-chip">72×102 cm</span>
          </div>
        </div>
      </div>
      <table class="config-table sust-table">
        <thead><tr><th>Gramaje</th><th>$/pliego MXN</th><th></th></tr></thead>
        <tbody>
          <tr><td><span class="gramaje-tag">100g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="0.55" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">150g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="0.65" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">200g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="0.80" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">250g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="0.98" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">300g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="1.15" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">350g</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="1.30" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- SULFATADO -->
  <div class="tab-panel" id="t-sulfatado">
    <div class="card">
      <div class="sust-header">
        <div>
          <div class="card-title">Sulfatado — costo por pliego</div>
          <div class="sust-sizes-label">Tamaños disponibles</div>
          <div class="sust-sizes">
            <span class="sust-size-chip">70×95 cm</span>
            <span class="sust-size-chip">71×125 cm</span>
            <span class="sust-size-chip">90×125 cm</span>
          </div>
        </div>
      </div>
      <table class="config-table sust-table">
        <thead><tr><th>Calibre</th><th>$/pliego MXN</th><th></th></tr></thead>
        <tbody>
          <tr><td><span class="gramaje-tag">12 pts</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="1.10" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">14 pts</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="1.28" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">16 pts</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="1.48" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">18 pts</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="1.72" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">20 pts</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="1.95" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
          <tr><td><span class="gramaje-tag">24 pts</span></td><td><div class="price-cell"><span class="price-prefix">$</span><input type="number" value="2.30" step="0.01"/></div></td><td><span class="save-link sust-save">Guardar</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- MERMAS -->
  <div class="tab-panel" id="t-mermas">
    <div class="card">
      <div class="card-title">Tabla de mermas por volumen</div>
      <p style="font-size:12px;color:var(--text3);margin-bottom:20px;font-weight:500;line-height:1.5">Excedentes que se suman automáticamente al calcular cada cotización. El motor toma el rango que corresponde a la cantidad pedida.</p>
      <table class="config-table sust-table">
        <thead><tr><th>Rango de cantidad</th><th>Merma (piezas)</th><th></th></tr></thead>
        <tbody>
          <tr>
            <td><div class="merma-range"><span class="merma-from">100</span><span class="merma-sep">—</span><span class="merma-to">500</span><span class="merma-unit">pzas</span></div></td>
            <td><div class="price-cell"><input type="number" value="200" style="width:80px"/><span style="font-size:12px;color:var(--text3);margin-left:6px">pzas</span></div></td>
            <td><span class="save-link sust-save">Guardar</span></td>
          </tr>
          <tr>
            <td><div class="merma-range"><span class="merma-from">501</span><span class="merma-sep">—</span><span class="merma-to">1,000</span><span class="merma-unit">pzas</span></div></td>
            <td><div class="price-cell"><input type="number" value="300" style="width:80px"/><span style="font-size:12px;color:var(--text3);margin-left:6px">pzas</span></div></td>
            <td><span class="save-link sust-save">Guardar</span></td>
          </tr>
          <tr>
            <td><div class="merma-range"><span class="merma-from">1,001</span><span class="merma-sep">—</span><span class="merma-to">5,000</span><span class="merma-unit">pzas</span></div></td>
            <td><div class="price-cell"><input type="number" value="400" style="width:80px"/><span style="font-size:12px;color:var(--text3);margin-left:6px">pzas</span></div></td>
            <td><span class="save-link sust-save">Guardar</span></td>
          </tr>
          <tr>
            <td><div class="merma-range"><span class="merma-from">5,001</span><span class="merma-sep">—</span><span class="merma-to">10,000</span><span class="merma-unit">pzas</span></div></td>
            <td><div class="price-cell"><input type="number" value="700" style="width:80px"/><span style="font-size:12px;color:var(--text3);margin-left:6px">pzas</span></div></td>
            <td><span class="save-link sust-save">Guardar</span></td>
          </tr>
          <tr>
            <td><div class="merma-range"><span class="merma-from">10,001</span><span class="merma-sep">—</span><span class="merma-to">∞</span><span class="merma-unit">sin límite</span></div></td>
            <td><div class="price-cell"><input type="number" value="750" style="width:80px"/><span style="font-size:12px;color:var(--text3);margin-left:6px">pzas</span></div></td>
            <td><span class="save-link sust-save">Guardar</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
`;
  },

  init() {
    // Tab switching
    document.querySelectorAll('#app .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const panelId = tab.dataset.panel;
        document.querySelectorAll('#app .tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('#app .tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(panelId);
        panel.classList.add('active');
        panel.style.animation = 'fadeSlideIn .18s cubic-bezier(.25,1,.5,1)';
      });
    });

    // Per-row Guardar feedback
    document.querySelectorAll('.sust-save').forEach(btn => {
      btn.addEventListener('click', () => {
        const orig = btn.textContent;
        btn.textContent = '✓ Guardado';
        btn.style.color = 'var(--teal)';
        setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1800);
      });
    });
  }
};
