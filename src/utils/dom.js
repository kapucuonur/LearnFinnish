import { translateWord } from '../services/api.js';
import { addWord } from '../services/storage.js';

const storyArea = document.getElementById('story-area');
const popup = document.getElementById('translation-popup');
const translationContent = document.getElementById('translation-content');
const closeBtn = document.getElementById('close-popup');
const overlay = document.querySelector('.overlay');

// Google TTS Player for Natural Voice
class GoogleTTSPlayer {
  constructor() {
    this.audio = new Audio();
    this.queue = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.onStateChange = null;

    this.audio.addEventListener('ended', () => this.playNext());
    this.audio.addEventListener('error', (e) => {
      console.error('Audio playback error', e);
      this.stop();
    });
  }

  // Split text into chunks < 200 chars (Google TTS limit)
  chunkText(text) {
    // Split by sentence endings but keep the punctuation
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    sentences.forEach(sentence => {
      if ((currentChunk + sentence).length < 200) {
        currentChunk += sentence + ' ';
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence + ' ';
      }
    });
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }

  play(text) {
    this.stop(); // Reset
    this.queue = this.chunkText(text);
    this.currentIndex = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.playNext();
    this.broadcastState();
  }

  playNext() {
    if (this.currentIndex >= this.queue.length) {
      this.stop();
      return;
    }

    const text = this.queue[this.currentIndex];
    const encodedText = encodeURIComponent(text);
    // Use Google Translate TTS endpoint
    this.audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&tl=fi&client=tw-ob&q=${encodedText}`;
    this.audio.play().catch(e => console.error('Play error:', e));
    this.currentIndex++;
  }

  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.audio.pause();
      this.isPaused = true;
      this.broadcastState();
    }
  }

  resume() {
    if (this.isPlaying && this.isPaused) {
      this.audio.play();
      this.isPaused = false;
      this.broadcastState();
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.queue = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.broadcastState();
  }

  broadcastState() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused
      });
    }
  }
}

const ttsPlayer = new GoogleTTSPlayer();

function speakText(text) {
  // Simple direct playback for single words
  const audio = new Audio(\`https://translate.google.com/translate_tts?ie=UTF-8&tl=fi&client=tw-ob&q=\${encodeURIComponent(text)}\`);
  audio.play();
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

  // Audio Control Panel
  const controlPanel = document.createElement('div');
  controlPanel.className = 'audio-controls';
  controlPanel.style.marginTop = '30px';
  controlPanel.style.display = 'flex';
  controlPanel.style.gap = '15px';
  controlPanel.style.justifyContent = 'center';

  // Helper to create control buttons
  const createBtn = (text, onClick, bgColor = '#006064') => {
    const btn = document.createElement('button');
    btn.innerHTML = text;
    btn.style.padding = '12px 24px';
    btn.style.background = bgColor;
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '12px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    btn.style.transition = 'all 0.2s';
    btn.onclick = onClick;
    
    btn.onmouseover = () => { if(!btn.disabled) btn.style.transform = 'translateY(-2px)'; };
    btn.onmouseout = () => { if(!btn.disabled) btn.style.transform = 'translateY(0)'; };
    
    return btn;
  };

  const playBtn = createBtn('▶️ Read Aloud', () => ttsPlayer.play(text), '#2e7d32');
  const pauseBtn = createBtn('⏸️ Pause', () => ttsPlayer.pause(), '#f57c00');
  const stopBtn = createBtn('⏹️ Stop', () => ttsPlayer.stop(), '#d32f2f');
  const resumeBtn = createBtn('▶️ Resume', () => ttsPlayer.resume(), '#2e7d32');

  // Initial Visibility
  pauseBtn.style.display = 'none';
  stopBtn.style.display = 'none';
  resumeBtn.style.display = 'none';

  // Subscribe to state changes
  ttsPlayer.onStateChange = (state) => {
    if (!state.isPlaying) {
      // Stopped
      playBtn.style.display = 'block';
      pauseBtn.style.display = 'none';
      stopBtn.style.display = 'none';
      resumeBtn.style.display = 'none';
    } else if (state.isPaused) {
      // Paused
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      resumeBtn.style.display = 'block';
    } else {
      // Playing
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'block';
      stopBtn.style.display = 'block';
      resumeBtn.style.display = 'none';
    }
  };

  controlPanel.appendChild(playBtn);
  controlPanel.appendChild(resumeBtn);
  controlPanel.appendChild(pauseBtn);
  controlPanel.appendChild(stopBtn);

  targetElement.appendChild(document.createElement('br'));
  targetElement.appendChild(controlPanel);
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
      translationContent.innerHTML = `< div style = "padding: 20px 0; font-size: 1.1em;" > Translating...</div > `;
      popup.classList.remove('hidden');
      overlay.classList.remove('hidden');

      // ... positioning logic ... (skipping for brevity in replace, effectively I should just target the specific lines)

      // Position popup near the clicked word
      popup.style.position = 'absolute';
      popup.style.top = `${ rect.bottom + scrollTop + 10 }px`;
      popup.style.left = `${ rect.left + scrollLeft }px`;
      popup.style.transform = 'none';

      // Adjust if popup goes off-screen
      setTimeout(() => {
        const popupRect = popup.getBoundingClientRect();
        if (popupRect.right > window.innerWidth) {
          popup.style.left = `${ window.innerWidth - popupRect.width - 20 }px`;
        }
        if (popupRect.bottom > window.innerHeight + scrollTop) {
          popup.style.top = `${ rect.top + scrollTop - popupRect.height - 10 }px`;
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
  < div style = "margin-bottom: 15px;" >
            <strong style="font-size: 1.8em; display: block; margin-bottom: 8px; color: #006064;">${original}</strong>
            <span style="font-size: 1.5em; display: block; margin-bottom: 5px; color: #333;">${translation}</span>
            <small style="color: #666; display: block;">(English)</small>
          </div >
    <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
    </div>
  `;

        const buttonContainer = translationContent.querySelector('div:last-child');
        buttonContainer.appendChild(audioBtn);
        buttonContainer.appendChild(notebookBtn);

        // Auto speak
        speakText(original);
      } catch (err) {
        translationContent.innerHTML = `< div style = "color: #d32f2f; padding: 20px 0;" > Error occurred</div > `;
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