// js/api.js
export async function hikayeUret(konu = '') {
  const basePrompt = `250-500 kelime uzunluğunda, B1 seviyesinde (intermediate) Fince dilinde bir hikaye yaz.
- Günlük hayat, seyahat, iş, arkadaşlık, şehir hayatı, doğa gibi yetişkin temaları kullan.
- B1 seviyesinde kelime dağarcığı ve gramer kullan: imperfekti, perfekti, sıfat tamlamaları, bağlaçlar (koska, vaikka, että, kun), ki- cümleleri vs.
- Cümleler doğal ve akıcı olsun, çocuk hikayesi gibi basit değil.
- Diyalog ekleyebilirsin ama abartmadan.
- Sadece hikayeyi yaz, başlık, açıklama veya başka hiçbir şey ekleme.`;

  const prompt = konu
    ? `${basePrompt}
Konu: "${konu}". Bu konuya uygun bir hikaye yaz.`
    : basePrompt;

  const response = await fetch('/api/hikaye', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error('Hikaye üretilemedi: ' + err);
  }

  const data = await response.json();
  return data.hikaye.trim();
}

export async function kelimeyiCevir(kelime, hedefDil = 'tr', context = '') {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kelime, hedefDil, context })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.error('API Hata Detayı:', JSON.stringify(errData, null, 2));
    throw new Error(hedefDil === 'tr' ? 'Çeviri hatası' : 'Translation error');
  }

  const data = await response.json();
  return data.translation;
}