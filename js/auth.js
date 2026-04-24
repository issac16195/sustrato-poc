// ─── Sustrato Auth + Firestore sync layer ────────────────────────────────────
// Uses Firebase compat SDK (db, auth globals from firebase-config.js)

const LS_KEYS = [
  'sustrato_machines','sustrato_preprensa','sustrato_acabados',
  'sustrato_produccion','sustrato_recubrimientos','sustrato_clientes',
  'sustrato_papel','sustrato_papeles','sustrato_profile','sustrato_cotizaciones',
  'sustrato_procesos','sustrato_envios','sustrato_onboarded',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function currentUid() {
  return auth.currentUser ? auth.currentUser.uid : null;
}

function userRef(uid) {
  return db.collection('users').doc(uid || currentUid());
}

function configRef(key, uid) {
  return userRef(uid).collection('config').doc(key);
}

// ─── Write to Firestore (fire-and-forget) ─────────────────────────────────────
// Used by every save*() in app.js — keeps saves synchronous from app's POV
function fsWrite(key, data) {
  const uid = currentUid();
  if (!uid) { console.warn('[fsWrite] sin usuario autenticado —', key); return; }
  configRef(key).set(key === 'profile' ? data : { data })
    .then(() => console.log('[fsWrite ✓]', key))
    .catch(e => console.error('[fsWrite ✗]', key, e.code || e.message, e));
}

// ─── Sync Firestore → localStorage (called at login) ─────────────────────────
async function syncUserData(uid) {
  // Todas las colecciones almacenadas como { data: [...] }
  const configKeys = [
    'machines','preprensa','acabados','produccion','recubrimientos',
    'papel','papeles','procesos','envios'
  ];

  const snaps = await Promise.all(configKeys.map(k => configRef(k, uid).get()));
  const missing = []; // llaves no encontradas en Firestore

  snaps.forEach((snap, i) => {
    const lsKey = 'sustrato_' + configKeys[i];
    if (snap.exists) {
      const d = snap.data();
      localStorage.setItem(lsKey, JSON.stringify(d.data !== undefined ? d.data : d));
    } else {
      missing.push(configKeys[i]);
    }
  });

  // Profile (estructura especial — sin envolver .data)
  const profileSnap = await configRef('profile', uid).get();
  if (profileSnap.exists) {
    localStorage.setItem('sustrato_profile', JSON.stringify(profileSnap.data()));
    localStorage.setItem('sustrato_onboarded', '1');
  }

  // Clientes
  const clientesSnap = await configRef('clientes', uid).get();
  if (clientesSnap.exists && clientesSnap.data().data) {
    localStorage.setItem('sustrato_clientes', JSON.stringify(clientesSnap.data().data));
  }

  // Cotizaciones
  const cotsSnap = await configRef('cotizaciones', uid).get();
  if (cotsSnap.exists && cotsSnap.data().data) {
    localStorage.setItem('sustrato_cotizaciones', JSON.stringify(cotsSnap.data().data));
  }

  // Para llaves sin datos en Firestore: subir lo que haya en localStorage.
  // Migra datos existentes (ej. issac); es no-op en dispositivos limpios.
  if (missing.length > 0) _seedMissingKeys(missing, uid);
}

// ─── Sube a Firestore las llaves que no existen aún ───────────────────────────
// Fire-and-forget — no bloquea el flujo de login.
function _seedMissingKeys(keys, uid) {
  for (const k of keys) {
    const raw = localStorage.getItem('sustrato_' + k);
    if (!raw) continue; // nada en LS → el usuario verá DEFAULT_* del código JS
    try {
      const data = JSON.parse(raw);
      configRef(k, uid).set({ data })
        .catch(e => console.warn('[Firestore seed]', k, e));
    } catch(e) {
      console.warn('[Firestore seed parse]', k, e);
    }
  }
}

// ─── Auth actions ─────────────────────────────────────────────────────────────
async function signInUser(email, password) {
  const cred = await auth.signInWithEmailAndPassword(email, password);
  await syncUserData(cred.user.uid);
  return cred;
}

async function signUpUser(email, password) {
  // Just creates the account — onboarding saves the data afterwards
  return auth.createUserWithEmailAndPassword(email, password);
}

async function signInGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const cred = await auth.signInWithPopup(provider);
  // Check if user has a profile (returning vs new)
  const profileSnap = await configRef('profile', cred.user.uid).get();
  if (profileSnap.exists) {
    await syncUserData(cred.user.uid);
    return { cred, isNew: false };
  }
  return { cred, isNew: true };
}

async function signOutUser() {
  LS_KEYS.forEach(k => localStorage.removeItem(k));
  await auth.signOut();
}

// ─── Check if user has completed onboarding ──────────────────────────────────
async function isOnboarded(uid) {
  if (localStorage.getItem('sustrato_onboarded')) return true;
  const snap = await configRef('profile', uid).get();
  return snap.exists;
}
