import { hikayeUret } from './api.js';
import { hikayeYaz, kelimeEventiEkle } from './dom.js';

let currentLang = 'tr'; // tr veya en

function updateUI() {
  // Title güncelle
  document.querySelector('title').textContent = 
    document.querySelector('title').dataset[currentLang === 'tr' ? 'tr' : 'en'];

  // Tüm data-tr / data-en olanları güncelle
  document.querySelectorAll('[data-tr]').forEach(el => {
    el.textContent = el.dataset[currentLang === 'tr' ? 'tr' : 'en'];
  });

  // Placeholder'lar
  document.querySelectorAll('[data-placeholder-tr]').forEach(el => {
    el.placeholder = el.dataset[currentLang === 'tr' ? 'placeholderTr' : 'placeholderEn'];
  });

  // Popup loading text
  document.getElementById('ceviri-icerik').textContent = 
    document.getElementById('ceviri-icerik').dataset[currentLang === 'tr' ? 'tr' : 'en'];

  // Aktif dil butonu
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    updateUI();
  });
});

const buton = document.getElementById('uret-hikaye');
const konuInput = document.getElementById('konu');

buton.addEventListener('click', async () => {
  buton.disabled = true;
  buton.textContent = currentLang === 'tr' ? 'Hikâye üretiliyor...' : 'Generating story...';

  try {
    const konu = konuInput.value.trim();
    const hikaye = await hikayeUret(konu);
    hikayeYaz(hikaye);
    kelimeEventiEkle(currentLang); // currentLang = tr veya en
  } catch (err) {
    alert(currentLang === 'tr' ? 'Hata: ' + err.message : 'Error: ' + err.message);
  }

  buton.disabled = false;
  updateUI(); // Buton textini geri yükle
});

updateUI(); // Sayfa yüklendiğinde