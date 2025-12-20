import { kelimeyiCevir } from './api.js';
import { deftereEkle } from './defter.js'; // <-- BU SATIRI EKLE!

const hikayeAlani = document.getElementById('hikaye-alani');
const popup = document.getElementById('ceviri-popup');
const ceviriIcerik = document.getElementById('ceviri-icerik');
const kapatBtn = document.getElementById('kapat-popup');
const overlay = document.querySelector('.overlay');

function sesliOku(metin) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(metin);
    utterance.lang = 'fi-FI';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }
}

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
      span.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        sesliOku(part.trim());
      });
      hikayeAlani.appendChild(span);
    }
  });

  const okuButon = document.createElement('button');
  okuButon.textContent = 'Hikayeyi Sesli Oku';
  okuButon.style.marginTop = '20px';
  okuButon.style.padding = '10px 20px';
  okuButon.style.background = '#006064';
  okuButon.style.color = 'white';
  okuButon.style.border = 'none';
  okuButon.style.borderRadius = '8px';
  okuButon.onclick = () => sesliOku(metin);
  hikayeAlani.appendChild(document.createElement('br'));
  hikayeAlani.appendChild(okuButon);
}

export function kelimeEventiEkle(hedefDil = 'tr') {
  document.querySelectorAll('.kelime').forEach(kelime => {
    kelime.onclick = async () => {
      const original = kelime.textContent.trim();

      // Popup içeriğini sıfırla
      ceviriIcerik.innerHTML = hedefDil === 'tr' ? 'Çeviriliyor...' : 'Translating...';
      popup.classList.remove('hidden');
      overlay.classList.remove('hidden');

      try {
        const translation = await kelimeyiCevir(original, hedefDil);

        // Deftere Ekle butonu (küçük ve güzel)
        const defterBtn = document.createElement('button');
        defterBtn.textContent = hedefDil === 'tr' ? 'Deftere Ekle' : 'Add to Notebook';
defterBtn.style.marginTop = '15px';
defterBtn.style.padding = '10px 20px';
defterBtn.style.background = '#006064';
defterBtn.style.color = 'white';
defterBtn.style.border = 'none';
defterBtn.style.borderRadius = '8px';
defterBtn.style.fontSize = '1em';
defterBtn.style.cursor = 'pointer';
defterBtn.style.display = 'block';
defterBtn.style.marginLeft = 'auto';
defterBtn.style.marginRight = 'auto';

        defterBtn.onclick = (e) => {
          e.stopPropagation();
          deftereEkle(original, translation, hedefDil);
          alert(hedefDil === 'tr' ? `${original} deftere eklendi!` : `${original} added to notebook!`);
        };

        ceviriIcerik.innerHTML = `
  <div style="margin-bottom: 15px;">
    <strong style="font-size:1.4em; display:block;">${original}</strong>
    <span style="font-size:1.2em; display:block; margin:10px 0;">${translation}</span>
    <small style="display:block; color:#666;">(${hedefDil === 'tr' ? 'Türkçe' : 'English'})</small>
  </div>
`;
ceviriIcerik.appendChild(defterBtn);

        sesliOku(original);
      } catch (err) {
        ceviriIcerik.textContent = hedefDil === 'tr' ? 'Hata oluştu' : 'Error occurred';
      }
    };
  });
}

kapatBtn.onclick = () => {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
  speechSynthesis.cancel();
};

overlay.onclick = () => {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
  speechSynthesis.cancel();
};