// Word Notebook Component
import { renderWordList, clearNotebook } from '../services/storage.js';
import { getCurrentLang } from './LanguageSwitcher.js';
import { initFlashcards, reloadFlashcards } from './Flashcard.js';

export function initTabs() {
    const tabHikaye = document.getElementById('tab-hikaye');
    const tabFlashcard = document.getElementById('tab-flashcard');
    const tabDefter = document.getElementById('tab-defter');
    const hikayeAlani = document.getElementById('hikaye-alani');
    const flashcardAlani = document.getElementById('flashcard-alani');
    const defterAlani = document.getElementById('defter-alani');

    if (!tabHikaye || !tabFlashcard || !tabDefter) return;

    tabHikaye.addEventListener('click', () => {
        tabHikaye.classList.add('active');
        tabFlashcard.classList.remove('active');
        tabDefter.classList.remove('active');
        hikayeAlani.classList.remove('hidden');
        flashcardAlani.classList.add('hidden');
        defterAlani.classList.add('hidden');
    });

    tabFlashcard.addEventListener('click', () => {
        tabHikaye.classList.remove('active');
        tabFlashcard.classList.add('active');
        tabDefter.classList.remove('active');
        hikayeAlani.classList.add('hidden');
        flashcardAlani.classList.remove('hidden');
        defterAlani.classList.add('hidden');

        // Initialize flashcards when tab is opened
        initFlashcards();
    });

    tabDefter.addEventListener('click', () => {
        tabHikaye.classList.remove('active');
        tabFlashcard.classList.remove('active');
        tabDefter.classList.add('active');
        hikayeAlani.classList.add('hidden');
        flashcardAlani.classList.add('hidden');
        defterAlani.classList.remove('hidden');
        renderWordList();
    });
}

export function initNotebookClear() {
    const clearBtn = document.getElementById('defter-temizle');

    if (!clearBtn) return;

    clearBtn.addEventListener('click', () => {
        const currentLang = getCurrentLang();
        const confirmMsg = currentLang === 'tr'
            ? 'Defterdeki tüm kelimeleri silmek istediğine emin misin?'
            : 'Are you sure you want to clear all words from your notebook?';

        if (confirm(confirmMsg)) {
            clearNotebook();
            renderWordList();
            // Reload flashcards after clearing notebook
            reloadFlashcards();
        }
    });
}
