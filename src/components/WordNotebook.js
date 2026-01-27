// Word Notebook Component
import { renderWordList, clearNotebook, getWords } from '../services/storage.js';
import { createFlashcard, updateProgress } from './Flashcard.js';

export function initWordNotebook() {
    const tabStory = document.getElementById('tab-story');
    const tabPhrases = document.getElementById('tab-phrases');
    const tabFlashcard = document.getElementById('tab-flashcard');
    const tabNotebook = document.getElementById('tab-notebook');
    const storyArea = document.getElementById('story-area');
    const phrasesArea = document.getElementById('phrases-area');
    const flashcardAlani = document.getElementById('flashcard-alani');
    const notebookArea = document.getElementById('notebook-area');

    // Flashcard controls
    const prevBtn = document.getElementById('prev-card-btn');
    const nextBtn = document.getElementById('next-card-btn');
    const shuffleBtn = document.getElementById('shuffle-cards-btn');

    let currentCardIndex = 0;
    let flashcardWords = [];

    // Helper to load and show flashcards
    function loadFlashcards() {
        flashcardWords = getWords();
        currentCardIndex = 0;
        showCurrentCard();
    }

    // Helper to show current card
    function showCurrentCard() {
        if (!flashcardWords.length) {
            createFlashcard([], 0, null, null, null, 'flashcard-container'); // Show empty state
            updateProgress(0, 0);
            return;
        }

        // Loop around if out of bounds
        if (currentCardIndex >= flashcardWords.length) currentCardIndex = 0;
        if (currentCardIndex < 0) currentCardIndex = flashcardWords.length - 1;

        createFlashcard(
            flashcardWords,
            currentCardIndex,
            () => { }, // onFlip
            () => nextBtn.click(), // onNext (not used by card click by default)
            () => prevBtn.click(),  // onPrev
            'flashcard-container'
        );

        updateProgress(currentCardIndex + 1, flashcardWords.length);
    }

    if (!tabStory || !tabFlashcard || !tabNotebook) return;

    // --- Tab Switching Logic ---

    tabStory.addEventListener('click', () => {
        tabStory.classList.add('active');
        if (tabPhrases) tabPhrases.classList.remove('active');
        tabFlashcard.classList.remove('active');
        tabNotebook.classList.remove('active');

        storyArea.classList.remove('hidden');
        if (phrasesArea) phrasesArea.classList.add('hidden');
        flashcardAlani.classList.add('hidden');
        notebookArea.classList.add('hidden');
    });

    tabFlashcard.addEventListener('click', () => {
        tabStory.classList.remove('active');
        if (tabPhrases) tabPhrases.classList.remove('active');
        tabFlashcard.classList.add('active');
        tabNotebook.classList.remove('active');

        storyArea.classList.add('hidden');
        if (phrasesArea) phrasesArea.classList.add('hidden');
        flashcardAlani.classList.remove('hidden');
        notebookArea.classList.add('hidden');

        // Initialize flashcards when tab is opened
        loadFlashcards();
    });

    tabNotebook.addEventListener('click', () => {
        tabStory.classList.remove('active');
        if (tabPhrases) tabPhrases.classList.remove('active');
        tabFlashcard.classList.remove('active');
        tabNotebook.classList.add('active');

        storyArea.classList.add('hidden');
        if (phrasesArea) phrasesArea.classList.add('hidden');
        flashcardAlani.classList.add('hidden');
        notebookArea.classList.remove('hidden');
        renderWordList();
    });

    // --- Flashcard Button Logic ---

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (flashcardWords.length > 0) {
                currentCardIndex--;
                showCurrentCard();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (flashcardWords.length > 0) {
                currentCardIndex++;
                showCurrentCard();

                // Award XP for review
                import('../services/gamification.js').then(({ addXP }) => {
                    addXP(5, 'Flashcard Reviewed');
                });
            }
        });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            if (flashcardWords.length > 0) {
                // Fisher-Yates shuffle
                for (let i = flashcardWords.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [flashcardWords[i], flashcardWords[j]] = [flashcardWords[j], flashcardWords[i]];
                }
                currentCardIndex = 0;
                showCurrentCard();
            }
        });
    }
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
