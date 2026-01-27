const NOTEBOOK_KEY = 'LearnFinnish_words';

export function addWord(word, translation, targetLang, example = null) {
  const notebook = JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || '[]');
  const newWord = {
    word,
    translation,
    targetLang,
    example, // { sentence: "...", translation: "..." }
    date: new Date().toISOString()
  };

  // Prevent duplicates
  if (!notebook.some(k => k.word === word && k.targetLang === targetLang)) {
    notebook.unshift(newWord); // Add to top
    localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(notebook));
    updateWordCount();
  }
}

export function removeWord(word, targetLang) {
  let notebook = JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || '[]');
  notebook = notebook.filter(k => !(k.word === word && k.targetLang === targetLang));
  localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(notebook));
  updateWordCount();
}

/**
 * Returns the list of words from storage.
 * @returns {Array} List of word objects
 */
export function getWords() {
  return JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || '[]');
}

export function renderWordList() {
  const notebook = getWords();
  const list = document.getElementById('word-list');
  if (!list) return;

  list.innerHTML = '';

  if (notebook.length === 0) {
    list.innerHTML = '<li style="text-align:center; color:#999;">No words added yet.</li>';
    return;
  }

  notebook.forEach(item => {
    const li = document.createElement('li');
    const safeWord = item.word.replace(/'/g, "&apos;"); // Prevent breaking HTML
    const hasExample = !!item.example;

    // Create unique ID for the example container
    const exampleId = `example-${item.word.replace(/\s+/g, '-')}`;

    li.innerHTML = `
      <div class="word-notebook-item">
        <div class="word-info">
          <div class="word-header">
            <strong>${item.word}</strong>
            <span class="word-translation">${item.translation}</span>
          </div>
          <div id="${exampleId}" class="word-example ${hasExample ? '' : 'hidden'}">
             ${hasExample ? `
                <div class="example-content" style="margin-top: 8px; padding: 10px; background: rgba(0,0,0,0.03); border-left: 3px solid var(--primary); border-radius: 4px;">
                    <p class="fi-sentence" style="font-style: italic; font-weight: 500; margin-bottom: 4px;">"${item.example.sentence}"</p>
                    <p class="en-translation" style="color: #666; font-size: 0.9em;">${item.example.translation}</p>
                </div>
             ` : ''}
          </div>
        </div>
        <div class="word-actions">
           <button class="btn-icon word-example-btn" data-word="${safeWord}" data-lang="${item.targetLang}" title="Show Example">
             💡
           </button>
           <button class="btn-icon text-danger word-delete" data-word="${safeWord}" data-lang="${item.targetLang}" title="Delete">
             🗑️
           </button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });

  // Speak buttons (if any exist, though current HTML doesn't generate them in this version)
  document.querySelectorAll('.ses-oku-btn').forEach(btn => {
    btn.onclick = () => speak(btn.dataset.word);
  });

  // Example Buttons Logic
  document.querySelectorAll('.word-example-btn').forEach(btn => {
    btn.onclick = async (e) => {
      const word = btn.dataset.word;
      const lang = btn.dataset.lang;
      const containerId = `example-${word.replace(/\s+/g, '-')}`;
      const container = document.getElementById(containerId);

      // If already visible and has content, just toggle
      if (container.classList.contains('hidden') === false && container.innerHTML.trim() !== '') {
        container.classList.add('hidden');
        return;
      }

      // If hidden but has content (from previous load), show it
      if (buttonHasExample(word, lang)) {
        container.classList.remove('hidden');
        return;
      }

      // Fetch new example
      btn.disabled = true;
      btn.innerHTML = '⏳'; // Loading spinner

      try {
        const res = await fetch('/api/generate-example', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word })
        });

        const data = await res.json();

        if (data.error) throw new Error(data.error);

        // Save to storage
        saveExampleToWord(word, lang, data);

        // Update UI
        container.innerHTML = `
                <div class="example-content">
                    <p class="fi-sentence">"${data.sentence}"</p>
                    <p class="en-translation">${data.translation}</p>
                </div>
            `;
        container.classList.remove('hidden');

      } catch (err) {
        console.error(err);
        alert('Failed to generate example. Please try again.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '💡';
      }
    };
  });

  // Delete buttons
  document.querySelectorAll('.word-delete').forEach(btn => {
    btn.onclick = () => {
      removeWord(btn.dataset.word, btn.dataset.lang);
      renderWordList();
    };
  });
}

function saveExampleToWord(wordText, targetLang, exampleData) {
  const notebook = getWords();
  // Decode wordText if it was encoded for HTML attribute, but here it comes from dataset which is decoded
  // data-word in HTML is standard string.
  const index = notebook.findIndex(k => k.word === wordText && k.targetLang === targetLang);

  if (index !== -1) {
    notebook[index].example = exampleData;
    localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(notebook));
  }
}

function buttonHasExample(wordText, targetLang) {
  const notebook = getWords();
  const item = notebook.find(k => k.word === wordText && k.targetLang === targetLang);
  return item && !!item.example;
}

function speak(text) {
  // Simple text-to-speech wrapper or import from another util if it exists
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fi-FI'; // Finnish
    window.speechSynthesis.speak(utterance);
  }
}

export function updateWordCount() {
  const notebook = JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || '[]');
  const countEl = document.getElementById('notebook-count');
  if (countEl) {
    countEl.textContent = notebook.length;
  }
}

export function clearNotebook() {
  if (confirm('Are you sure you want to delete all words from your notebook?')) {
    localStorage.removeItem(NOTEBOOK_KEY);
    updateWordCount();
    renderWordList();
  }
}