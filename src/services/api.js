// API Service

import { API_ENDPOINTS } from '../config/constants.js';

export async function generateStory(topic) {
  try {
    const response = await fetch(API_ENDPOINTS.STORY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      throw new Error('Story generation failed');
    }

    const data = await response.json();
    return data.story;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function translateWord(word, context = '') {
  try {
    const targetLang = 'en'; // Force English
    const response = await fetch(API_ENDPOINTS.TRANSLATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: word,
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