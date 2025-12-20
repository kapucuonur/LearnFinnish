export async function kelimeyiCevir(kelime, hedefDil = 'tr') {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kelime, hedefDil })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(hedefDil === 'tr' ? 'Çeviri hatası' : 'Translation error');
  }

  const data = await response.json();
  return data.translation;
}