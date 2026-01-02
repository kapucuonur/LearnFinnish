import { translateWord } from '../services/api.js';
import { addWord } from '../services/storage.js';

const storyArea = document.getElementById('story-area');
const popup = document.getElementById('translation-popup');
const translationContent = document.getElementById('translation-content');
const closeBtn = document.getElementById('close-popup');
const overlay = document.querySelector('.overlay');

function speakText(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fi-FI';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  }
}

export function writeStory(text, targetElement = storyArea) {
  const parts = text.split(/(\s+|[.,!?;:()"'-])/).filter(p => p !== '');

  targetElement.innerHTML = '';

  parts.forEach(part => {
    if (/^\s+$|[.,!?;:()"'-]/.test(part)) {
      if (part.includes('\n')) {
        targetElement.appendChild(document.createElement('br'));
        if (part.split('\n').length > 2) targetElement.appendChild(document.createElement('br')); // Double break for multiple newlines
      } else {
        targetElement.appendChild(document.createTextNode(part));
      }
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = part;

      // Double click to read word only
      span.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        speakText(part.trim());
      });

      targetElement.appendChild(span);
    }
  });

  // Read full story button
  const readBtn = document.createElement('button');
  readBtn.textContent = '🔊 Read Story Aloud';
  readBtn.className = 'read-story-btn';
  readBtn.style.marginTop = '30px';
  readBtn.style.padding = '12px 24px';
  readBtn.style.background = '#006064';
  readBtn.style.color = 'white';
  readBtn.style.border = 'none';
  readBtn.style.borderRadius = '12px';
  readBtn.style.fontSize = '1.1em';
  readBtn.style.cursor = 'pointer';
  readBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
  readBtn.onclick = () => speakText(text);

  targetElement.appendChild(document.createElement('br'));
  targetElement.appendChild(readBtn);
}

export function addWordEvents(targetLang = 'en') {
  document.querySelectorAll('.word').forEach(word => {
    word.onclick = async (event) => {
      const original = word.textContent.trim();

      // Get word position for popup placement
      const rect = word.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Popup open and loading message
      translationContent.innerHTML = `<div style="padding: 20px 0; font-size: 1.1em;">Translating...</div>`;
      popup.classList.remove('hidden');
      overlay.classList.remove('hidden');

      // ... positioning logic ... (skipping for brevity in replace, effectively I should just target the specific lines)

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
        // Find the sentence containing this word for context
        const allText = storyArea.textContent;
        const sentences = allText.match(/[^.!?]+[.!?]+/g) || [allText];

        // Find which sentence contains this word
        let contextSentence = '';
        for (const sentence of sentences) {
          if (sentence.includes(original)) {
            contextSentence = sentence.trim();
            break;
          }
        }

        // If no sentence found, use the whole text (fallback)
        if (!contextSentence) {
          contextSentence = allText.substring(0, 200); // First 200 chars
        }

        const translation = await translateWord(original, contextSentence);

        // Listen button
        const audioBtn = document.createElement('button');
        audioBtn.innerHTML = '🔊 Listen';
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
          speakText(original);
        };

        // Add to notebook button
        const notebookBtn = document.createElement('button');
        notebookBtn.innerHTML = '📖 Add to Notebook';
        notebookBtn.style.display = 'inline-block';
        notebookBtn.style.margin = '10px 5px';
        notebookBtn.style.padding = '10px 20px';
        notebookBtn.style.background = '#006064';
        notebookBtn.style.color = 'white';
        notebookBtn.style.border = 'none';
        notebookBtn.style.borderRadius = '8px';
        notebookBtn.style.fontSize = '1em';
        notebookBtn.style.fontWeight = 'bold';
        notebookBtn.style.cursor = 'pointer';
        notebookBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        notebookBtn.style.transition = 'all 0.2s';

        notebookBtn.onmouseover = () => {
          notebookBtn.style.background = '#004d4d';
          notebookBtn.style.transform = 'translateY(-2px)';
        };
        notebookBtn.onmouseout = () => {
          if (notebookBtn.innerHTML.includes('Added')) {
            notebookBtn.style.background = '#4caf50';
          } else {
            notebookBtn.style.background = '#006064';
          }
          notebookBtn.style.transform = 'translateY(0)';
        };

        notebookBtn.onclick = (e) => {
          e.stopPropagation();
          addWord(original, translation, 'en');
          notebookBtn.innerHTML = '✓ Added!';
          notebookBtn.style.background = '#4caf50';

          setTimeout(() => {
            notebookBtn.innerHTML = '📖 Add to Notebook';
            notebookBtn.style.background = '#006064';
          }, 2000);
        };

        // Popup content — word, translation and buttons
        translationContent.innerHTML = `
          <div style="margin-bottom: 15px;">
            <strong style="font-size: 1.8em; display: block; margin-bottom: 8px; color: #006064;">${original}</strong>
            <span style="font-size: 1.5em; display: block; margin-bottom: 5px; color: #333;">${translation}</span>
            <small style="color: #666; display: block;">(English)</small>
          </div>
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          </div>
        `;

        const buttonContainer = translationContent.querySelector('div:last-child');
        buttonContainer.appendChild(audioBtn);
        buttonContainer.appendChild(notebookBtn);

        // Auto speak
        speakText(original);
      } catch (err) {
        translationContent.innerHTML = `<div style="color: #d32f2f; padding: 20px 0;">Error occurred</div>`;
      }
    };
  });
}

// Popup kapatma
closeBtn.onclick = () => {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
  speechSynthesis.cancel();
};

overlay.onclick = () => {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
  speechSynthesis.cancel();
};