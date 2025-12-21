const DEFTER_KEY = 'LearnFinnish_kelimeler';

export function deftereEkle(kelime, ceviri, hedefDil) {
  const defter = JSON.parse(localStorage.getItem(DEFTER_KEY) || '[]');
  const yeniKelime = {
    kelime,
    ceviri,
    hedefDil,
    tarih: new Date().toISOString()
  };

  // Aynı kelime varsa ekleme
  if (!defter.some(k => k.kelime === kelime && k.hedefDil === hedefDil)) {
    defter.unshift(yeniKelime); // En üste ekle
    localStorage.setItem(DEFTER_KEY, JSON.stringify(defter));
    defterSayisiniGuncelle();
  }
}

export function defterdenSil(kelime, hedefDil) {
  let defter = JSON.parse(localStorage.getItem(DEFTER_KEY) || '[]');
  defter = defter.filter(k => !(k.kelime === kelime && k.hedefDil === hedefDil));
  localStorage.setItem(DEFTER_KEY, JSON.stringify(defter));
  defterSayisiniGuncelle();
}

export function defteriListele() {
  const defter = JSON.parse(localStorage.getItem(DEFTER_KEY) || '[]');
  const liste = document.getElementById('kelime-listesi');
  liste.innerHTML = '';

  if (defter.length === 0) {
    liste.innerHTML = '<li style="text-align:center; color:#999;">Henüz kelime eklenmemiş.</li>';
    return;
  }

  defter.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="kelime-defter-item">
        <strong>${item.kelime}</strong><br>
        ${item.ceviri} <small>(${item.hedefDil === 'tr' ? 'Türkçe' : 'English'})</small>
      </div>
      <div>
        <button class="ses-oku-btn" data-kelime="${item.kelime}">🔊</button>
        <button class="kelime-sil" data-kelime="${item.kelime}" data-dil="${item.hedefDil}">Sil</button>
      </div>
    `;
    liste.appendChild(li);
  });

  // Sesli oku butonları
  document.querySelectorAll('.ses-oku-btn').forEach(btn => {
    btn.onclick = () => sesliOku(btn.dataset.kelime);
  });

  // Sil butonları
  document.querySelectorAll('.kelime-sil').forEach(btn => {
    btn.onclick = () => {
      defterdenSil(btn.dataset.kelime, btn.dataset.dil);
      defteriListele();
    };
  });
}

export function defterSayisiniGuncelle() {
  const defter = JSON.parse(localStorage.getItem(DEFTER_KEY) || '[]');
  const sayiEl = document.getElementById('defter-sayi');
  if (sayiEl) {
    sayiEl.textContent = defter.length;
  }
}

export function defteriTemizle() {
  if (confirm('Defterdeki tüm kelimeleri silmek istediğine emin misin?')) {
    localStorage.removeItem(DEFTER_KEY);
    defterSayisiniGuncelle();
    defteriListele();
  }
}