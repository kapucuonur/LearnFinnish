import { hikayeUret } from './api.js';
import { hikayeYaz, kelimeEventiEkle } from './dom.js';
import { defteriListele, defterSayisiniGuncelle, defteriTemizle } from './defter.js';

let currentLang = 'tr';

// Variable for PWA install prompt
let deferredPrompt;

// Update UI for language change
function updateUI() {
  // Update page title
  const titleEl = document.querySelector('title');
  titleEl.textContent = titleEl.dataset[currentLang === 'tr' ? 'tr' : 'en'];

  // Update all elements with data-tr / data-en attributes
  document.querySelectorAll('[data-tr]').forEach(el => {
    const key = currentLang === 'tr' ? 'tr' : 'en';
    if (el.dataset[key]) {
      el.textContent = el.dataset[key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder-tr]').forEach(el => {
    const key = currentLang === 'tr' ? 'placeholderTr' : 'placeholderEn';
    el.placeholder = el.dataset[key];
  });

  // Update loading text in translation popup
  const loadingEl = document.getElementById('ceviri-icerik');
  loadingEl.textContent = loadingEl.dataset[currentLang === 'tr' ? 'tr' : 'en'];

  // Update active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

  // Update word notebook count
  defterSayisiniGuncelle();
}

// Language switcher
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    updateUI();
  });
});

// Story generation button
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

// Tab switching: Story vs Word Notebook
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
  defteriListele(); // Load word list when tab is opened
});

// Clear notebook button
document.getElementById('defter-temizle').addEventListener('click', () => {
  const confirmMsg = currentLang === 'tr' 
    ? 'Defterdeki tüm kelimeleri silmek istediğine emin misin?' 
    : 'Are you sure you want to clear all words from your notebook?';
  
  if (confirm(confirmMsg)) {
    defteriTemizle();
    defteriListele(); // Refresh list after clearing
  }
});

// PWA Install Prompt - Show "Install App" button on mobile
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

// Initial UI update and notebook count on page load
updateUI();
defterSayisiniGuncelle();