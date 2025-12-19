import { kelimeyiCevir } from './api.js';

const hikayeAlani = document.getElementById('hikaye-alani');
const popup = document.getElementById('ceviri-popup');
const ceviriIcerik = document.getElementById('ceviri-icerik');
const kapatBtn = document.getElementById('kapat-popup');
const overlay = document.querySelector('.overlay');

export function hikayeYaz(metin) {
  const parts = metin.split(/(\s+|[.,!?;:()"'-])/).filter(p => p !== '');

  hikayeAlani.innerHTML = '';

  parts.forEach(part => {
    if (/^\s+$|[.,!?;:()"'-]/.test(part)) {
      hikayeAlani.appendChild(document.createTextNode(part));
    } else {
      const span = document.createElement('span');
      span.className = 'kelime';
      span.textContent = part;
      hikayeAlani.appendChild(span);
    }
  });
}

export function kelimeEventiEkle(hedefDil = 'tr') {
  document.querySelectorAll('.kelime').forEach(kelime => {
    kelime.onclick = async () => {
      const original = kelime.textContent.trim();
      ceviriIcerik.textContent = 'Çeviriliyor...';
      popup.classList.remove('hidden');
      overlay.classList.remove('hidden');

      try {
        const translation = await kelimeyiCevir(original, hedefDil);
        ceviriIcerik.innerHTML = `<strong>${original}</strong> (Fince)<br>${translation} (${hedefDil === 'tr' ? 'Türkçe' : 'English'})`;
      } catch (err) {
        ceviriIcerik.textContent = 'Hata oluştu';
      }
    };
  });
}

kapatBtn.onclick = () => {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
};

overlay.onclick = () => {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
};