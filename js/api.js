const LIBRETRANSLATE_URL = 'https://libretranslate.de/translate';

export async function hikayeUret(konu = '') {
  const prompt = konu
    ? `Konu: "${konu}". Bu konu hakkında 80-120 kelime uzunluğunda, basit ve eğlenceli bir Fince (Suomi) çocuk hikâyesi yaz. Sadece hikâyeyi yaz, başka hiçbir şey ekleme.`
    : `80-120 kelime uzunluğunda, basit ve eğlenceli bir Fince (Suomi) çocuk hikâyesi yaz. Sadece hikâyeyi yaz, başka hiçbir şey ekleme.`;

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

export async function kelimeyiCevir(kelime, hedefDil = 'tr') {
  const source = 'fi'; // Hikaye Fince olduğu için kaynak her zaman fi

  const response = await fetch(LIBRETRANSLATE_URL, {
    method: 'POST',
    body: JSON.stringify({
      q: kelime,
      source: source,
      target: hedefDil, // tr veya en
      format: 'text'
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  return data.translatedText || 'Çeviri bulunamadı';
}