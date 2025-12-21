import { kelimeyiCevir } from '../services/api.js';
import { deftereEkle } from '../services/storage.js';

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
    utterance.pitch = 1;
    utterance.volume = 1;
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

      // Çift tıkla sadece kelimeyi oku
      span.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        sesliOku(part.trim());
      });

      hikayeAlani.appendChild(span);
    }
  });

  // Hikayeyi tamamen oku butonu
  const okuButon = document.createElement('button');
  okuButon.textContent = 'Hikayeyi Sesli Oku';
  okuButon.style.marginTop = '30px';
  okuButon.style.padding = '12px 24px';
  okuButon.style.background = '#006064';
  okuButon.style.color = 'white';
  okuButon.style.border = 'none';
  okuButon.style.borderRadius = '12px';
  okuButon.style.fontSize = '1.1em';
  okuButon.style.cursor = 'pointer';
  okuButon.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
  okuButon.onclick = () => sesliOku(metin);

  hikayeAlani.appendChild(document.createElement('br'));
  hikayeAlani.appendChild(okuButon);
}

export function kelimeEventiEkle(hedefDil = 'tr') {
  document.querySelectorAll('.kelime').forEach(kelime => {
    kelime.onclick = async (event) => {
      const original = kelime.textContent.trim();

      // Get word position for popup placement
      const rect = kelime.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Popup'ı aç ve yükleniyor mesajı
      ceviriIcerik.innerHTML = `<div style="padding: 20px 0; font-size: 1.1em;">${hedefDil === 'tr' ? 'Çeviriliyor...' : 'Translating...'}</div>`;
      popup.classList.remove('hidden');
      overlay.classList.remove('hidden');

      // Position popup near the clicked word
      popup.style.position = 'absolute';
      popup.style.top = `${rect.bottom + scrollTop + 10}px`;
      popup.style.left = `${rect.left + scrollLeft}px`;
      popup.style.transform = 'none';

      // Adjust if popup goes off-screen
      setTimeout(() => {
        const popupRect = popup.getBoundingClientRect();
        if (popupRect.right > window.innerWidth) {
          popup.style.left = `${window.innerWidth - popupRect.width - 20}px`;
        }
        if (popupRect.bottom > window.innerHeight + scrollTop) {
          popup.style.top = `${rect.top + scrollTop - popupRect.height - 10}px`;
        }
      }, 10);

      try {
        const translation = await kelimeyiCevir(original, hedefDil);

        // Sesli okuma butonu
        const audioBtn = document.createElement('button');
        audioBtn.innerHTML = '🔊 ' + (hedefDil === 'tr' ? 'Dinle' : 'Listen');
        audioBtn.style.display = 'inline-block';
        audioBtn.style.margin = '10px 5px';
        audioBtn.style.padding = '10px 20px';
        audioBtn.style.background = '#4285F4';
        audioBtn.style.color = 'white';
        audioBtn.style.border = 'none';
        audioBtn.style.borderRadius = '8px';
        audioBtn.style.fontSize = '1em';
        audioBtn.style.fontWeight = 'bold';
        audioBtn.style.cursor = 'pointer';
        audioBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        audioBtn.style.transition = 'all 0.2s';

        audioBtn.onmouseover = () => {
          audioBtn.style.background = '#1a73e8';
          audioBtn.style.transform = 'translateY(-2px)';
        };
        audioBtn.onmouseout = () => {
          audioBtn.style.background = '#4285F4';
          audioBtn.style.transform = 'translateY(0)';
        };

        audioBtn.onclick = (e) => {
          e.stopPropagation();
          sesliOku(original);
        };

        // Deftere Ekle butonu
        const defterBtn = document.createElement('button');
        defterBtn.innerHTML = '📖 ' + (hedefDil === 'tr' ? 'Deftere Ekle' : 'Add to Notebook');
        defterBtn.style.display = 'inline-block';
        defterBtn.style.margin = '10px 5px';
        defterBtn.style.padding = '10px 20px';
        defterBtn.style.background = '#006064';
        defterBtn.style.color = 'white';
        defterBtn.style.border = 'none';
        defterBtn.style.borderRadius = '8px';
        defterBtn.style.fontSize = '1em';
        defterBtn.style.fontWeight = 'bold';
        defterBtn.style.cursor = 'pointer';
        defterBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        defterBtn.style.transition = 'all 0.2s';

        defterBtn.onmouseover = () => {
          defterBtn.style.background = '#004d4d';
          defterBtn.style.transform = 'translateY(-2px)';
        };
        defterBtn.onmouseout = () => {
          defterBtn.style.background = '#006064';
          defterBtn.style.transform = 'translateY(0)';
        };

        defterBtn.onclick = (e) => {
          e.stopPropagation();
          deftereEkle(original, translation, hedefDil);
          defterBtn.innerHTML = '✓ ' + (hedefDil === 'tr' ? 'Eklendi!' : 'Added!');
          defterBtn.style.background = '#4caf50';
          setTimeout(() => {
            defterBtn.innerHTML = '📖 ' + (hedefDil === 'tr' ? 'Deftere Ekle' : 'Add to Notebook');
            defterBtn.style.background = '#006064';
          }, 2000);
        };

        // Popup içeriği — kelime, çeviri ve butonlar
        ceviriIcerik.innerHTML = `
          <div style="margin-bottom: 15px;">
            <strong style="font-size: 1.8em; display: block; margin-bottom: 8px; color: #006064;">${original}</strong>
            <span style="font-size: 1.5em; display: block; margin-bottom: 5px; color: #333;">${translation}</span>
            <small style="color: #666; display: block;">(${hedefDil === 'tr' ? 'Türkçe' : 'English'})</small>
          </div>
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          </div>
        `;

        const buttonContainer = ceviriIcerik.querySelector('div:last-child');
        buttonContainer.appendChild(audioBtn);
        buttonContainer.appendChild(defterBtn);

        // Otomatik sesli oku
        sesliOku(original);
      } catch (err) {
        ceviriIcerik.innerHTML = `<div style="color: #d32f2f; padding: 20px 0;">${hedefDil === 'tr' ? 'Hata oluştu' : 'Error occurred'}</div>`;
      }
    };
  });
}

// Popup kapatma
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