import { PHRASE_CATEGORIES } from '../data/phrases.js';
import { createFlashcard } from './Flashcard.js';

export function initPhrasesSection() {
    const tabPhrases = document.getElementById('tab-phrases');
    const phrasesArea = document.getElementById('phrases-area');

    // Other tabs/areas to hide when phrases is active
    const otherTabs = ['tab-story', 'tab-flashcard', 'tab-notebook'];
    const otherAreas = ['story-area', 'flashcard-alani', 'notebook-area'];

    const categoriesContainer = document.getElementById('phrases-categories');
    const playerContainer = document.getElementById('phrases-player');
    const phrasesTitle = document.getElementById('phrases-title');
    const backBtn = document.getElementById('phrases-back');

    // Player controls
    const prevBtn = document.getElementById('phrases-prev');
    const nextBtn = document.getElementById('phrases-next');
    const flipBtn = document.getElementById('phrases-flip');

    let currentCategory = null;
    let currentIndex = 0;

    if (!tabPhrases || !phrasesArea) return;

    // Initialize Categories View
    renderCategories();

    // Tab Click Handler
    tabPhrases.addEventListener('click', () => {
        // Activate Tab
        tabPhrases.classList.add('active');
        otherTabs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });

        // Show Area
        phrasesArea.classList.remove('hidden');
        otherAreas.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        // Reset to categories view
        showCategories();
    });

    function renderCategories() {
        categoriesContainer.innerHTML = '';

        PHRASE_CATEGORIES.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'phrase-category-card';
            card.innerHTML = `
                <div class="category-icon">${cat.icon}</div>
                <div class="category-content">
                    <h3 class="category-title">${cat.title}</h3>
                    <p class="category-desc">${cat.description}</p>
                    <button class="btn btn-sm btn-secondary start-btn">Start</button>
                </div>
            `;

            // Whole card click or button click
            card.addEventListener('click', () => startCategory(cat));
            categoriesContainer.appendChild(card);
        });
    }

    function startCategory(category) {
        currentCategory = category;
        currentIndex = 0;

        // Update Title
        phrasesTitle.textContent = category.title;

        // Switch Views
        categoriesContainer.classList.add('hidden');
        playerContainer.classList.remove('hidden');

        // Initialize Card
        updateCard();
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
            'phrases-flashcard-container'
        );
    }

    // Player Interactions
    backBtn.addEventListener('click', showCategories);

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateCard();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateCard();
    });

    flipBtn.addEventListener('click', () => {
        const card = document.querySelector('#phrases-flashcard-container .flashcard');
        if (card) {
            card.classList.toggle('flipped');
        }
    });

    // Keyboard support for player
    document.addEventListener('keydown', (e) => {
        if (phrasesArea.classList.contains('hidden') || playerContainer.classList.contains('hidden')) return;

        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipBtn.click();
        }
    });
}
