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
    // Use our internal proxy to avoid CORs/Blocking issues
    this.audio.src = `/api/tts?text=${encodedText}`;
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
  // Simple direct playback for single words using proxy
  const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
  audio.play();
}

// Vocabulary Cache
let currentVocabulary = {};

export function writeStory(text, targetElement = storyArea, vocabulary = {}, topic = '') {
  // Clear previous content
  targetElement.innerHTML = '';

  // Store text on the element for toggling later
  targetElement.dataset.fullText = text;

  // Store vocabulary
  currentVocabulary = vocabulary || {};
  console.log("Hybrid Model: Loaded vocabulary:", currentVocabulary);

  // Render Sticky Header if topic exists
  if (topic) {
    const header = document.createElement('div');
    header.className = 'story-header sticky-section-header';
    header.style.marginBottom = '20px'; // Add some spacing
    // Capitalize topic
    const displayTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    header.innerHTML = `<h3 style="margin:0; font-size: 1.2rem; color: var(--color-primary);">📄 ${displayTopic}</h3>`;
    targetElement.appendChild(header);
  }

  // Create content container to hold the text modes
  const contentContainer = document.createElement('div');
  contentContainer.className = 'story-content-wrapper';
  targetElement.appendChild(contentContainer);

  // Default: Render Paragraph Mode into the content container
  renderParagraphMode(text, contentContainer);
}

function renderParagraphMode(text, targetElement) {
  targetElement.innerHTML = '';

  // Create container for paragraph text
  const paragraphContainer = document.createElement('div');
  paragraphContainer.className = 'story-text-container';

  // Existing paragraph rendering logic
  const parts = text.split(/(\s+|[.,!?;:()"'-])/).filter(p => p !== '');

  parts.forEach(part => {
    if (/^\s+$|[.,!?;:()"'-]/.test(part)) {
      if (part.includes('\n')) {
        paragraphContainer.appendChild(document.createElement('br'));
        if (part.split('\n').length > 2) paragraphContainer.appendChild(document.createElement('br'));
      } else {
        paragraphContainer.appendChild(document.createTextNode(part));
      }
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = part;

      // Context menu logic (will be attached globally or here)
      // Note: addWordEvents handles the clicks later, but dblclick is specific
      span.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        speakText(part.trim());
      });

      paragraphContainer.appendChild(span);
    }
  });

  targetElement.appendChild(paragraphContainer);

  // Add Toggle Button
  const toggleContainer = document.createElement('div');
  toggleContainer.className = 'practice-mode-toggle';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn-practice-toggle';
  toggleBtn.innerHTML = '🎙️ Start Speaking Practice';
  toggleBtn.onclick = () => {
    renderSentenceMode(text, targetElement);
  };

  toggleContainer.appendChild(toggleBtn);
  targetElement.appendChild(toggleContainer);

  // Re-attach word click events
  addWordEvents('en');
}

function renderSentenceMode(text, targetElement) {
  targetElement.innerHTML = '';

  // Back Button
  const backBtn = document.createElement('button');
  backBtn.className = 'btn-practice-back';
  backBtn.innerHTML = '⬅ Back to Reading';
  backBtn.onclick = () => {
    renderParagraphMode(text, targetElement);
  };
  targetElement.appendChild(backBtn);

  // 1. Split text into sentences (keeping delimiters)
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];

  sentences.forEach((sentence, index) => {
    const sentenceContainer = document.createElement('div');
    sentenceContainer.className = 'sentence-container';

    // 2. Render Words for Translation (Existing Logic)
    const textSpan = document.createElement('div');
    textSpan.className = 'sentence-text';

    const parts = sentence.trim().split(/(\s+|[.,!?;:()"'-])/).filter(p => p !== '');

    parts.forEach(part => {
      if (/^\s+$|[.,!?;:()"'-]/.test(part)) {
        textSpan.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = part;

        span.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          speakText(part.trim());
        });

        textSpan.appendChild(span);
      }
    });

    sentenceContainer.appendChild(textSpan);

    // 3. Action Bar (Listen, Record, Playback)
    const actionBar = document.createElement('div');
    actionBar.className = 'sentence-actions';

    // --- Listen Button (AI) ---
    const listenBtn = document.createElement('button');
    listenBtn.className = 'action-btn btn-listen';
    listenBtn.innerHTML = '🔊 Listen';
    listenBtn.onclick = () => {
      ttsPlayer.play(sentence.trim());
    };

    // --- Record Button (User) ---
    const recordBtn = document.createElement('button');
    recordBtn.className = 'action-btn btn-record';
    recordBtn.innerHTML = '🎙️ Record';

    let mediaRecorder = null;
    let audioChunks = [];
    let audioUrl = null;
    let playbackAudio = null;

    // --- Playback Button (User Recording) ---
    const playbackBtn = document.createElement('button');
    playbackBtn.className = 'action-btn btn-playback';
    playbackBtn.innerHTML = '▶️ My Recording';
    playbackBtn.style.display = 'none';

    playbackBtn.onclick = () => {
      if (audioUrl) {
        playbackAudio = new Audio(audioUrl);
        playbackAudio.play();
      }
    };

    recordBtn.onclick = async () => {
      if (recordBtn.classList.contains('recording')) {
        // STOP RECORDING
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = '🎙️ Record';
      } else {
        // START RECORDING
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];

          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioUrl = URL.createObjectURL(audioBlob);
            playbackBtn.style.display = 'inline-flex'; // Show playback button
            stream.getTracks().forEach(track => track.stop()); // Stop mic
          };

          mediaRecorder.start();
          recordBtn.classList.add('recording');
          recordBtn.innerHTML = '⏹️ Stop';
          playbackBtn.style.display = 'none'; // Hide previous recording

        } catch (err) {
          console.error('Microphone access denied:', err);
          alert('Microphone access is required to record your voice.');
        }
      }
    };

    actionBar.appendChild(listenBtn);
    actionBar.appendChild(recordBtn);
    actionBar.appendChild(playbackBtn);

    sentenceContainer.appendChild(actionBar);
    targetElement.appendChild(sentenceContainer);
  });

  // Re-attach word click events for new elements
  addWordEvents('en');
}

export function addWordEvents(targetLang = 'en') {
  document.querySelectorAll('.word').forEach(word => {
    word.onclick = async (event) => {
      const original = word.textContent.trim();
      const cleanWord = original.replace(/[.,!?;:()"'-]/g, '').toLowerCase();

      // Get word position for popup placement
      const rect = word.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Hybrid Model Check
      let translation = null;
      let isInstant = false;

      // 1. Check Cache
      if (currentVocabulary && currentVocabulary[cleanWord]) {
        translation = currentVocabulary[cleanWord];
        isInstant = true;
        console.log(`Hybrid Model: Instant hit for '${cleanWord}' -> '${translation}'`);
      } else if (currentVocabulary) {
        // Try finding case-insensitive key
        const key = Object.keys(currentVocabulary).find(k => k.toLowerCase() === cleanWord);
        if (key) {
          translation = currentVocabulary[key];
          isInstant = true;
        }
      }

      // 2. Show UI (Loading or Instant)
      if (!isInstant) {
        translationContent.innerHTML = `
            <div class="loading-state">
               <div class="spinner"></div>
               <p>Translating <strong>${original}</strong>...</p>
            </div>
          `;
      }

      popup.classList.remove('hidden');
      overlay.classList.remove('hidden');

      // 3. Position Popup
      if (window.innerWidth < 768) {
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '90%';
      } else {
        popup.style.position = 'absolute';
        popup.style.top = `${rect.bottom + scrollTop + 10}px`;
        popup.style.left = `${rect.left + scrollLeft}px`;
        popup.style.transform = 'none';

        setTimeout(() => {
          const popupRect = popup.getBoundingClientRect();
          if (popupRect.right > window.innerWidth) {
            popup.style.left = `${window.innerWidth - popupRect.width - 20}px`;
          }
          if (popupRect.bottom > window.innerHeight + scrollTop) {
            popup.style.top = `${rect.top + scrollTop - popupRect.height - 10}px`;
          }
        }, 10);
      }

      try {
        // 4. Fetch Translation if needed
        if (!isInstant) {
          const allText = storyArea.textContent;
          const sentences = allText.match(/[^.!?]+[.!?]+/g) || [allText];
          let contextSentence = '';
          for (const sentence of sentences) {
            if (sentence.includes(original)) {
              contextSentence = sentence.trim();
              break;
            }
          }
          if (!contextSentence) contextSentence = allText.substring(0, 200);

          translation = await translateWord(original, contextSentence);
        }

        // 5. Render Result
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

        // Notebook button
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

        notebookBtn.onclick = async (e) => {
          e.stopPropagation();

          // Show loading state on button
          const originalBtnText = notebookBtn.innerHTML;
          notebookBtn.innerHTML = '⏳ Saving...';
          notebookBtn.disabled = true;

          try {
            // 1. Get Context Sentence (Re-using logic from Step 4 or getting it fresh)
            let contextSentence = '';
            const allText = storyArea.textContent;
            const sentences = allText.match(/[^.!?]+[.!?]+/g) || [allText];
            for (const sentence of sentences) {
              if (sentence.includes(original)) {
                contextSentence = sentence.trim();
                break;
              }
            }
            if (!contextSentence) contextSentence = original; // Fallback

            // 2. Translate Context Sentence
            let sentenceTranslation = '';
            try {
              sentenceTranslation = await translateWord(contextSentence);
            } catch (tErr) {
              console.warn('Failed to translate context sentence:', tErr);
              sentenceTranslation = '(Translation unavailable)';
            }

            // 3. Save to Notebook with Example
            const exampleData = {
              sentence: contextSentence,
              translation: sentenceTranslation
            };

            addWord(original, translation, 'en', exampleData);

            import('../services/gamification.js').then(({ addXP }) => {
              addXP(10, 'Word Added');
            });

            notebookBtn.innerHTML = '✓ Added!';
            notebookBtn.style.background = '#4caf50';
          } catch (err) {
            console.error('Add to notebook failed:', err);
            notebookBtn.innerHTML = '❌ Error';
            notebookBtn.style.background = '#d32f2f';
          } finally {
            notebookBtn.disabled = false;
            setTimeout(() => {
              notebookBtn.innerHTML = '📖 Add to Notebook';
              notebookBtn.style.background = '#006064';
            }, 3000);
          }
        };

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

        speakText(original);

      } catch (err) {
        console.error(err);
        translationContent.innerHTML = `<div style="color: #d32f2f; padding: 20px 0;">Error: ${err.message}</div>`;
      }
    };
  });
}

// Popup kapatma
if (closeBtn) {
  closeBtn.onclick = () => {
    if (popup) popup.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
    speechSynthesis.cancel();
  };
}

if (overlay) {
  overlay.onclick = () => {
    if (popup) popup.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
    speechSynthesis.cancel();
  };
}