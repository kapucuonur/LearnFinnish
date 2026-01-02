// Word Notebook Component
import { renderWordList, clearNotebook } from '../services/storage.js';

export function initWordNotebook() {
    const tabStory = document.getElementById('tab-story');
    const tabFlashcard = document.getElementById('tab-flashcard');
    const tabNotebook = document.getElementById('tab-notebook');
    const storyArea = document.getElementById('story-area');
    const flashcardAlani = document.getElementById('flashcard-alani');
    const notebookArea = document.getElementById('notebook-area');

    if (!tabStory || !tabFlashcard || !tabNotebook) return;

    tabStory.addEventListener('click', () => {
        tabStory.classList.add('active');
        tabFlashcard.classList.remove('active');
        tabNotebook.classList.remove('active');
        storyArea.classList.remove('hidden');
        flashcardAlani.classList.add('hidden');
        notebookArea.classList.add('hidden');
    });

    tabFlashcard.addEventListener('click', () => {
        tabStory.classList.remove('active');
        tabFlashcard.classList.add('active');
        tabNotebook.classList.remove('active');
        storyArea.classList.add('hidden');
        flashcardAlani.classList.remove('hidden');
        notebookArea.classList.add('hidden');
    });

    tabNotebook.addEventListener('click', () => {
        tabStory.classList.remove('active');
        tabFlashcard.classList.remove('active');
        tabNotebook.classList.add('active');
        storyArea.classList.add('hidden');
        flashcardAlani.classList.add('hidden');
        notebookArea.classList.remove('hidden');
        renderWordList();
    });
}

export function initNotebookClear() {
    const clearBtn = document.getElementById('notebook-clear');

    if (!clearBtn) return;

    clearBtn.addEventListener('click', () => {
        const confirmMsg = 'Are you sure you want to clear all words from your notebook?';

        if (confirm(confirmMsg)) {
            clearNotebook();
            renderWordList();
        }
    });
}
