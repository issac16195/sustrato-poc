views['dashboard'] = {
  render() {
    document.getElementById('app').innerHTML = `
<div class="content">
  <div class="dash-metrics">
    <div class="dmet"><div class="dmet-label">Cotizaciones hoy</div><div class="dmet-val">7</div></div>
    <div class="dmet"><div class="dmet-label">Este mes</div><div class="dmet-val">43</div></div>
    <div class="dmet"><div class="dmet-label">Valor cotizado</div><div class="dmet-val">$218k</div></div>
    <div class="dmet"><div class="dmet-label">Margen promedio</div><div class="dmet-val green">31%</div></div>
  </div>
  <div class="card">
    <div class="card-title">Cotizaciones recientes</div>
    <table class="recent-table">
      <thead><tr><th>Proyecto</th><th>Tipo</th><th>Cantidad</th><th>Máquina</th><th>Valor</th><th>Margen</th></tr></thead>
      <tbody>
        <tr><td>Posters Evento Mayo</td><td>General</td><td>5,000</td><td>CD102</td><td>$6,480</td><td style="color:var(--teal);font-weight:700">33%</td></tr>
        <tr><td>Tarjetas Corporativas</td><td>General</td><td>1,000</td><td>PM52</td><td>$2,100</td><td style="color:var(--teal);font-weight:700">28%</td></tr>
        <tr><td>Revista Mensual</td><td>Editorial</td><td>500</td><td>PM74</td><td>$18,400</td><td style="color:var(--teal);font-weight:700">35%</td></tr>
        <tr><td>Caja Cosméticos</td><td>Empaque</td><td>2,000</td><td>CD102</td><td>$34,200</td><td style="color:var(--teal);font-weight:700">29%</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
  },
  init() {
    function countUp(el, target, prefix, suffix, duration) {
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * ease).toLocaleString('es-MX') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const metrics = document.querySelectorAll('.dmet-val');
    if (metrics[0]) countUp(metrics[0], 7,  '', '',  600);
    if (metrics[1]) countUp(metrics[1], 43, '', '',  750);
    if (metrics[3]) countUp(metrics[3], 31, '', '%', 850);

    // staggered table row entrance
    document.querySelectorAll('.recent-table tbody tr').forEach((tr, i) => {
      tr.style.opacity = '0';
      tr.style.transform = 'translateX(-10px)';
      tr.style.transition = 'opacity .25s ease, transform .25s ease';
      setTimeout(() => { tr.style.opacity = '1'; tr.style.transform = 'none'; }, 180 + i * 65);
    });
  }
};
