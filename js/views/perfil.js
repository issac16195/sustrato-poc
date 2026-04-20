views['perfil'] = {
  render() {
    const p = getProfile();
    document.getElementById('app').innerHTML = `
<div class="content" style="max-width:680px">

  <!-- Logo -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-title">Logo de la imprenta</div>
    <div class="perfil-logo-row">
      <div class="perfil-logo-preview" id="logo-preview">
        ${p.logo
          ? `<img src="${p.logo}" alt="Logo"/>`
          : `<div class="perfil-logo-placeholder">
               <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="22" rx="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="11" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 23l7-6 5 5 4-4 6 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
               <span>Sin logo</span>
             </div>`
        }
      </div>
      <div class="perfil-logo-actions">
        <label class="btn-ghost" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px">
          <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          Subir logo
          <input type="file" id="logo-input" accept="image/*" style="display:none"/>
        </label>
        ${p.logo ? `<button class="btn-ghost perfil-logo-remove" id="logo-remove" style="color:#E05555;border-color:#E05555">Eliminar</button>` : ''}
        <p style="font-size:11px;color:var(--text3);margin-top:6px">PNG, JPG o SVG · máx. 2 MB · recomendado 400×200 px</p>
      </div>
    </div>
  </div>

  <!-- Datos de la imprenta -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-title">Datos de la imprenta</div>
    <div class="row2" style="margin-bottom:14px">
      <div class="fg">
        <label>Nombre de la imprenta</label>
        <input id="pf-imprenta" type="text" placeholder="Ej. Impresos García" value="${esc(p.imprenta)}"/>
      </div>
      <div class="fg">
        <label>Nombre del responsable</label>
        <input id="pf-nombre" type="text" placeholder="Ej. Carlos García" value="${esc(p.nombre)}"/>
      </div>
    </div>
    <div class="row2" style="margin-bottom:14px">
      <div class="fg">
        <label>Teléfono / WhatsApp</label>
        <input id="pf-tel" type="tel" placeholder="Ej. 33 1234 5678" value="${esc(p.tel)}"/>
      </div>
      <div class="fg">
        <label>Correo electrónico</label>
        <input id="pf-email" type="email" placeholder="Ej. cotizaciones@impresos.com" value="${esc(p.email)}"/>
      </div>
    </div>
    <div class="fg" style="margin-bottom:14px">
      <label>Dirección</label>
      <input id="pf-direccion" type="text" placeholder="Ej. Av. López Mateos 1234, Col. Centro" value="${esc(p.direccion)}"/>
    </div>
    <div class="row2">
      <div class="fg">
        <label>Ciudad / Estado</label>
        <input id="pf-ciudad" type="text" placeholder="Ej. Guadalajara, Jalisco" value="${esc(p.ciudad)}"/>
      </div>
      <div class="fg">
        <label>RFC (opcional)</label>
        <input id="pf-rfc" type="text" placeholder="Ej. GACA800101AA1" value="${esc(p.rfc)}" style="text-transform:uppercase"/>
      </div>
    </div>
  </div>

  <!-- Acciones -->
  <div style="display:flex;align-items:center;gap:12px">
    <button class="btn-primary" id="pf-save">Guardar cambios</button>
    <div id="pf-saved" style="font-size:13px;color:var(--teal-dark);opacity:0;transition:opacity .3s">✓ Guardado</div>
  </div>

</div>`;
  },

  init() {
    // Logo upload
    document.getElementById('logo-input').addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { alert('El archivo es mayor a 2 MB.'); return; }
      const reader = new FileReader();
      reader.onload = e => {
        const preview = document.getElementById('logo-preview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Logo"/>`;
        // Store temporarily in DOM data attr; saved on Guardar
        preview.dataset.logo = e.target.result;
        // Show remove button if not there
        if (!document.getElementById('logo-remove')) {
          const lbl = document.querySelector('.perfil-logo-actions label');
          const btn = document.createElement('button');
          btn.className = 'btn-ghost perfil-logo-remove';
          btn.id = 'logo-remove';
          btn.style.cssText = 'color:#E05555;border-color:#E05555';
          btn.textContent = 'Eliminar';
          lbl.insertAdjacentElement('afterend', btn);
          btn.addEventListener('click', clearLogo);
        }
      };
      reader.readAsDataURL(file);
    });

    function clearLogo() {
      const preview = document.getElementById('logo-preview');
      preview.dataset.logo = '';
      preview.innerHTML = `<div class="perfil-logo-placeholder">
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="22" rx="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="11" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 23l7-6 5 5 4-4 6 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Sin logo</span>
      </div>`;
      const removeBtn = document.getElementById('logo-remove');
      if (removeBtn) removeBtn.remove();
    }

    const removeBtn = document.getElementById('logo-remove');
    if (removeBtn) removeBtn.addEventListener('click', clearLogo);

    // RFC to uppercase
    const rfcInput = document.getElementById('pf-rfc');
    rfcInput.addEventListener('input', () => { rfcInput.value = rfcInput.value.toUpperCase(); });

    // Save
    document.getElementById('pf-save').addEventListener('click', () => {
      const preview = document.getElementById('logo-preview');
      const current = getProfile();
      const logo = preview.dataset.logo !== undefined
        ? preview.dataset.logo
        : (current.logo || '');

      const updated = {
        ...current,
        logo,
        imprenta:  document.getElementById('pf-imprenta').value.trim(),
        nombre:    document.getElementById('pf-nombre').value.trim(),
        tel:       document.getElementById('pf-tel').value.trim(),
        email:     document.getElementById('pf-email').value.trim(),
        direccion: document.getElementById('pf-direccion').value.trim(),
        ciudad:    document.getElementById('pf-ciudad').value.trim(),
        rfc:       document.getElementById('pf-rfc').value.trim(),
      };
      saveProfile(updated);

      const savedEl = document.getElementById('pf-saved');
      savedEl.style.opacity = '1';
      setTimeout(() => { savedEl.style.opacity = '0'; }, 2500);
    });
  }
};

function esc(v) { return (v||'').replace(/"/g,'&quot;'); }
