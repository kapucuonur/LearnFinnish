import { hikayeUret } from './api.js';
import { hikayeYaz, kelimeEventiEkle } from './dom.js';
import { defteriListele, defterSayisiniGuncelle, defteriTemizle } from './defter.js';
import { auth, provider, signInWithGoogle, signOutUser, onAuthStateChanged } from './auth.js';

let currentLang = 'tr';
let deferredPrompt;

function updateUI() {
  const titleEl = document.querySelector('title');
  titleEl.textContent = titleEl.dataset[currentLang === 'tr' ? 'tr' : 'en'];

  document.querySelectorAll('[data-tr]').forEach(el => {
    const key = currentLang === 'tr' ? 'tr' : 'en';
    if (el.dataset[key]) el.textContent = el.dataset[key];
  });

  document.querySelectorAll('[data-placeholder-tr]').forEach(el => {
    const key = currentLang === 'tr' ? 'placeholderTr' : 'placeholderEn';
    el.placeholder = el.dataset[key];
  });

  const loadingEl = document.getElementById('ceviri-icerik');
  loadingEl.textContent = loadingEl.dataset[currentLang === 'tr' ? 'tr' : 'en'];

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

  defterSayisiniGuncelle();
}

// Dil değiştirici
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    updateUI();
  });
});

// Hikaye üret butonu
const buton = document.getElementById('uret-hikaye');
const konuInput = document.getElementById('konu');

buton.addEventListener('click', async () => {
  buton.disabled = true;
  buton.textContent = currentLang === 'tr' ? 'Hikâye üretiliyor...' : 'Generating story...';

  try {
    const konu = konuInput.value.trim();
    const hikaye = await hikayeUret(konu);
    hikayeYaz(hikaye);
    kelimeEventiEkle(currentLang);
  } catch (err) {
    alert(currentLang === 'tr' ? 'Hata: ' + err.message : 'Error: ' + err.message);
  }

  buton.disabled = false;
  updateUI();
});

// Tab değiştirme
document.getElementById('tab-hikaye').addEventListener('click', () => {
  document.getElementById('tab-hikaye').classList.add('active');
  document.getElementById('tab-defter').classList.remove('active');
  document.getElementById('hikaye-alani').style.display = 'block';
  document.getElementById('defter-alani').classList.add('hidden');
});

document.getElementById('tab-defter').addEventListener('click', () => {
  document.getElementById('tab-defter').classList.add('active');
  document.getElementById('tab-hikaye').classList.remove('active');
  document.getElementById('hikaye-alani').style.display = 'none';
  document.getElementById('defter-alani').classList.remove('hidden');
  defteriListele();
});

// Defteri temizle
document.getElementById('defter-temizle').addEventListener('click', () => {
  const confirmMsg = currentLang === 'tr'
    ? 'Defterdeki tüm kelimeleri silmek istediğine emin misin?'
    : 'Are you sure you want to clear all words from your notebook?';

  if (confirm(confirmMsg)) {
    defteriTemizle();
    defteriListele();
  }
});

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = currentLang === 'tr' ? 'Uygulamayı Yükle' : 'Install App';
  installBtn.id = 'pwa-install-btn';
  installBtn.style.position = 'fixed';
  installBtn.style.bottom = '20px';
  installBtn.style.left = '50%';
  installBtn.style.transform = 'translateX(-50%)';
  installBtn.style.padding = '14px 28px';
  installBtn.style.background = '#006064';
  installBtn.style.color = 'white';
  installBtn.style.border = 'none';
  installBtn.style.borderRadius = '50px';
  installBtn.style.fontSize = '1em';
  installBtn.style.zIndex = '1000';
  installBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
  installBtn.style.cursor = 'pointer';

  installBtn.onclick = () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User installed the app');
      }
      installBtn.style.display = 'none';
    });
  };

  document.body.appendChild(installBtn);
});

// Firebase Auth - Giriş Sistemi
const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const premiumInfo = document.getElementById('premium-info');

// Login button handler with loading state
loginBtn.onclick = async () => {
  const originalText = loginBtn.textContent;
  loginBtn.disabled = true;
  loginBtn.textContent = currentLang === 'tr' ? 'Giriş yapılıyor...' : 'Signing in...';

  const result = await signInWithGoogle(currentLang);

  if (!result.success) {
    alert(result.error);
    loginBtn.disabled = false;
    loginBtn.textContent = originalText;
  }
  // Success case is handled by onAuthStateChanged
};

// Logout button handler
logoutBtn.onclick = async () => {
  const result = await signOutUser(currentLang);

  if (!result.success) {
    alert(result.error);
  }
  // Success case is handled by onAuthStateChanged
};

premiumBtn.onclick = () => {
  if (auth.currentUser) {
    // Gerçek ödeme burada olacak (Stripe)
    alert('Ödeme sistemi yakında aktif olacak!');
  } else {
    alert(currentLang === 'tr' ? 'Premium olmak için önce giriş yapmalısınız!' : 'Please sign in to go premium!');
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = 'none';
    loginBtn.disabled = false;
    loginBtn.textContent = loginBtn.dataset[currentLang === 'tr' ? 'tr' : 'en'] || 'Google ile Giriş Yap';
    userInfo.classList.remove('hidden');
    userName.textContent = `${currentLang === 'tr' ? 'Hoş geldin' : 'Welcome'}, ${user.displayName || user.email}!`;
    premiumInfo.style.display = 'none'; // Giriş yapan premium olsun
  } else {
    loginBtn.style.display = 'block';
    loginBtn.disabled = false;
    loginBtn.textContent = loginBtn.dataset[currentLang === 'tr' ? 'tr' : 'en'] || 'Google ile Giriş Yap';
    userInfo.classList.add('hidden');
    premiumInfo.style.display = 'block'; // Giriş yapmadan premium bilgisi görünsün
  }
});

// Sayfa yüklendiğinde
updateUI();
defterSayisiniGuncelle();