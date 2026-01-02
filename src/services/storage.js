const NOTEBOOK_KEY = 'LearnFinnish_words';

export function addWord(word, translation, targetLang) {
  const notebook = JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || '[]');
  const newWord = {
    word,
    translation,
    targetLang,
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
    li.innerHTML = `
      <div class="word-notebook-item">
        <div>
          <strong>${item.word}</strong>
          <span>${item.translation}</span>
        </div>
        <button class="word-delete" data-word="${item.word}" data-lang="${item.targetLang}">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  // Speak buttons
  document.querySelectorAll('.ses-oku-btn').forEach(btn => {
    btn.onclick = () => speak(btn.dataset.word);
  });

  // Delete buttons
  document.querySelectorAll('.word-delete').forEach(btn => {
    btn.onclick = () => {
      removeWord(btn.dataset.word, btn.dataset.lang);
      renderWordList();
    };
  });
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