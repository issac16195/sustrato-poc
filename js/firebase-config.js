// Firebase compat SDK — vanilla JS, no bundler required
// Scripts are loaded via CDN in index.html and onboarding.html

const firebaseConfig = {
  apiKey:            "AIzaSyDNWXwJm-HfVRzhq-j8GJ8Sp3Cok36WCns",
  authDomain:        "sustrato-mvp.firebaseapp.com",
  projectId:         "sustrato-mvp",
  storageBucket:     "sustrato-mvp.firebasestorage.app",
  messagingSenderId: "934675267504",
  appId:             "1:934675267504:web:228cc73e6642e6eb176075",
};

firebase.initializeApp(firebaseConfig);

const db   = firebase.firestore();
const auth = firebase.auth();
