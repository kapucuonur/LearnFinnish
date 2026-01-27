import { VOCABULARY_CATEGORIES } from '../data/vocabulary.js';
import { createFlashcard } from './Flashcard.js';

export function initVocabularySection() {
    // Navigation Button
    const btnVocab = document.getElementById('btn-vocab');

    // Content Area
    const vocabArea = document.getElementById('vocabulary-area');

    // Internal Containers
    const categoriesContainer = document.getElementById('vocab-categories');
    const playerContainer = document.getElementById('vocab-player');
    const vocabTitle = document.getElementById('vocab-title');
    const backBtn = document.getElementById('vocab-back');

    // Player controls
    const prevBtn = document.getElementById('vocab-prev');
    const nextBtn = document.getElementById('vocab-next');
    const flipBtn = document.getElementById('vocab-flip');

    let currentCategory = null;
    let currentIndex = 0;

    if (!btnVocab || !vocabArea) return;

    // Initialize Categories View
    renderCategories();

    function renderCategories() {
        categoriesContainer.innerHTML = '';

        VOCABULARY_CATEGORIES.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'phrase-category-card'; // Reuse phrase card styles
            card.innerHTML = `
                <div class="category-icon">${cat.icon}</div>
                <div class="category-content">
                    <h3 class="category-title">${cat.title}</h3>
                    <p class="category-desc">${cat.description}</p>
                    <button class="btn btn-sm btn-secondary start-btn">Start</button>
                </div>
            `;

            card.addEventListener('click', () => startCategory(cat));
            categoriesContainer.appendChild(card);
        });
    }

    function startCategory(category) {
        currentCategory = category;
        currentIndex = 0;

        // Update Title
        vocabTitle.textContent = category.title;

        // Switch Views
        categoriesContainer.classList.add('hidden');
        playerContainer.classList.remove('hidden');

        // Initialize Card
        updateCard();
    }

    // Public method to reset to categories view (used by main navigation)
    window.resetVocabularyView = function () {
        showCategories();
    }

    function showCategories() {
        playerContainer.classList.add('hidden');
        categoriesContainer.classList.remove('hidden');
        currentCategory = null;
    }

    function updateCard() {
        if (!currentCategory) return;

        const words = currentCategory.words;

        // Loop logic
        if (currentIndex >= words.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = words.length - 1;

        createFlashcard(
            words,
            currentIndex,
            () => { }, // onFlip
            () => nextBtn.click(), // onNext
            () => prevBtn.click(), // onPrev
            'vocab-flashcard-container'
        );
    }

    // Player Interactions
    if (backBtn) backBtn.addEventListener('click', showCategories);

    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateCard();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateCard();
    });

    if (flipBtn) flipBtn.addEventListener('click', () => {
        const card = document.querySelector('#vocab-flashcard-container .flashcard');
        if (card) {
            card.classList.toggle('flipped');
        }
    });

    // Keyboard support for player
    document.addEventListener('keydown', (e) => {
        if (vocabArea.classList.contains('hidden') || playerContainer.classList.contains('hidden')) return;

        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipBtn.click();
        }
    });
}
