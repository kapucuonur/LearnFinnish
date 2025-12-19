import { hikayeUret } from './api.js';
import { hikayeYaz, kelimeEventiEkle } from './dom.js';

let hedefDil = 'tr'; // Varsayılan Türkçe çeviri

function updateUI() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === hedefDil);
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    hedefDil = btn.dataset.lang;
    updateUI();
  });
});

const buton = document.getElementById('uret-hikaye');
const konuInput = document.getElementById('konu');

buton.addEventListener('click', async () => {
  buton.disabled = true;
  buton.textContent = 'Hikaye üretiliyor...';

  try {
    const konu = konuInput.value.trim();
    const hikaye = await hikayeUret(konu);
    hikayeYaz(hikaye);
    kelimeEventiEkle(hedefDil); // Hedef dil parametresi
  } catch (err) {
    alert('Hata: ' + err.message);
  }

  buton.disabled = false;
  buton.textContent = 'Yeni Hikaye Üret';
});

updateUI();