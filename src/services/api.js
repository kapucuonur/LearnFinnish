// API Service

import { API_ENDPOINTS } from '../config/constants.js';

export async function hikayeUret(konu) {
  try {
    const response = await fetch(API_ENDPOINTS.HIKAYE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ konu }),
    });

    if (!response.ok) {
      throw new Error('Story generation failed');
    }

    const data = await response.json();
    return data.hikaye;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function kelimeyiCevir(kelime, context = '') {
  try {
    const targetLang = 'en'; // Force English
    const response = await fetch(API_ENDPOINTS.TRANSLATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: kelime,
        targetLang,
        context
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Translation API Error:', error);
    throw new Error('Translation error');
  }
}