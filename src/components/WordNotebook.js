// Word Notebook Component
import { renderWordList, clearNotebook, getWords } from '../services/storage.js';
import { createFlashcard, updateProgress } from './Flashcard.js';

// Module-level state
let currentCardIndex = 0;
let flashcardWords = [];

// Helper to load and show flashcards
export function loadFlashcards() {
    flashcardWords = getWords();
    // Shuffle by default when loading to keep it fresh
    for (let i = flashcardWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcardWords[i], flashcardWords[j]] = [flashcardWords[j], flashcardWords[i]];
    }
    currentCardIndex = 0;
    showCurrentCard();
}

// Helper to show current card
function showCurrentCard() {
    const nextBtn = document.getElementById('next-card-btn');
    const prevBtn = document.getElementById('prev-card-btn');

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
        () => { if (nextBtn) nextBtn.click() }, // onNext
        () => { if (prevBtn) prevBtn.click() }, // onPrev
        'flashcard-container'
    );

    updateProgress(currentCardIndex + 1, flashcardWords.length);
}

export function initWordNotebook() {
    // Flashcard controls
    const prevBtn = document.getElementById('prev-card-btn');
    const nextBtn = document.getElementById('next-card-btn');
    const shuffleBtn = document.getElementById('shuffle-cards-btn');

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
