import { hikayeUret } from './api.js';
import { hikayeYaz, kelimeEventiEkle } from './dom.js';
import { defteriListele, defterSayisiniGuncelle, defteriTemizle } from './defter.js';
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './auth.js';

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
const loginBtn = document.createElement('button');
loginBtn.textContent = currentLang === 'tr' ? 'Google ile Giriş Yap' : 'Sign in with Google';
loginBtn.style.margin = '20px auto';
loginBtn.style.display = 'block';
loginBtn.style.padding = '12px 24px';
loginBtn.style.background = '#4285F4';
loginBtn.style.color = 'white';
loginBtn.style.border = 'none';
loginBtn.style.borderRadius = '8px';
loginBtn.style.cursor = 'pointer';

const userInfo = document.createElement('div');
userInfo.style.margin = '20px auto';
userInfo.style.textAlign = 'center';
userInfo.style.display = 'none';

const userEmail = document.createElement('span');
userEmail.style.marginRight = '10px';
const logoutBtn = document.createElement('button');
logoutBtn.textContent = currentLang === 'tr' ? 'Çıkış Yap' : 'Sign Out';
logoutBtn.style.padding = '8px 16px';
logoutBtn.style.background = '#d32f2f';
logoutBtn.style.color = 'white';
logoutBtn.style.border = 'none';
logoutBtn.style.borderRadius = '6px';

userInfo.appendChild(userEmail);
userInfo.appendChild(logoutBtn);

// Butonları header'a ekle
const header = document.querySelector('.header');
header.appendChild(loginBtn);
header.appendChild(userInfo);

loginBtn.onclick = () => signInWithPopup(auth, provider);

logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = 'none';
    userInfo.style.display = 'block';
    userEmail.textContent = `Hoş geldin, ${user.displayName || user.email}!`;
    console.log('Giriş yapan kullanıcı:', user.uid);
    // Premium özellikleri aktif et (ileride Firestore'dan kontrol ederiz)
  } else {
    loginBtn.style.display = 'block';
    userInfo.style.display = 'none';
  }
});

// Sayfa yüklendiğinde
updateUI();
defterSayisiniGuncelle();