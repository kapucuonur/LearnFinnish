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
      throw new Error('Server translation failed');
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.warn('Server translation failed, trying client-side fallback:', error);

    // Client-side Fallback: MyMemory API direct call
    try {
      const encodedText = encodeURIComponent(word.trim());
      const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=fi|en`;
      const fallbackRes = await fetch(url);

      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (data.responseStatus === 200) {
          let result = data.responseData.translatedText.trim();
          // Clean up
          result = result.replace(/^["']|["']$/g, '').replace(/\.$/, '').trim();
          if (result.length > 50) result = result.split(/\s+/).slice(0, 3).join(' ');
          console.log('Client-side fallback success:', result);
          return result;
        }
      }
    } catch (fallbackErr) {
      console.error('Client-side fallback also failed:', fallbackErr);
    }

    throw new Error('Translation error');
  }
}