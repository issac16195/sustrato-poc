views['plan'] = {
  render() {
    document.getElementById('app').innerHTML = `
<div class="content">
  <div class="plan-card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:.3px">Plan Profesional</div>
        <div style="font-size:12px;color:var(--slate);margin-top:3px;font-weight:500">Para imprentas activas</div>
      </div>
      <span class="badge badge-green">Recomendado</span>
    </div>
    <div class="plan-price">$499 <span>MXN/mes + IVA</span></div>
    <div style="font-size:12px;color:rgba(255,255,255,.35);margin-top:4px;margin-bottom:20px">Sin tarjeta durante el periodo de prueba</div>
    <div class="plan-features">
      <div class="plan-feature"><div class="plan-feature-check"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#00BDA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Cotizaciones ilimitadas</div>
      <div class="plan-feature"><div class="plan-feature-check"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#00BDA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>PDF + envío por WhatsApp</div>
      <div class="plan-feature"><div class="plan-feature-check"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#00BDA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Todos los módulos activos</div>
      <div class="plan-feature"><div class="plan-feature-check"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#00BDA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Soporte prioritario</div>
    </div>
    <button class="btn-primary" style="width:100%;justify-content:center;display:flex;align-items:center">Activar plan →</button>
  </div>
</div>
`;
  },
  init() {}
};
