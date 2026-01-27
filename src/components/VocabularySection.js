import { VOCABULARY_CATEGORIES } from '../data/vocabulary.js';
import { createFlashcard } from './Flashcard.js';

export function initVocabularySection() {
    // Navigation Button
    const btnVocab = document.getElementById('btn-vocab');

    // Content Area
    const vocabArea = document.getElementById('vocabulary-area');

    // Internal Containers
    const categoriesContainer = document.getElementById('vocab-categories');
    const partsContainer = document.getElementById('vocab-parts'); // New container for parts
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

        // Update Title
        vocabTitle.textContent = category.title;

        // Render Parts
        renderParts(category);

        // Switch Views
        categoriesContainer.classList.add('hidden');
        partsContainer.classList.remove('hidden');
        playerContainer.classList.add('hidden');

        // Update back button to go back to categories
        backBtn.onclick = showCategories;
    }

    function renderParts(category) {
        partsContainer.innerHTML = '';
        const totalWords = category.words.length;
        const chunkSize = 25;
        const totalParts = Math.ceil(totalWords / chunkSize);

        if (totalWords === 0) {
            partsContainer.innerHTML = '<p style="text-align:center; color:white;">No words available yet.</p>';
            return;
        }

        // Color palette for parts (matching the screenshot vibe)
        const colors = ['#FFF9C4', '#E3F2FD', '#FFE0B2', '#F3E5F5', '#E0F2F1'];

        for (let i = 0; i < totalParts; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, totalWords);
            const partNum = i + 1;

            const btn = document.createElement('button');
            btn.className = 'part-btn';
            // Styling inline for now to ensure it looks good immediately
            btn.style.cssText = `
                background: ${colors[i % colors.length]};
                border: none;
                border-radius: 15px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.2s;
                height: 120px;
                width: 100%;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;

            btn.innerHTML = `
                <span style="font-size: 1.5em; font-weight: bold; color: #333; margin-bottom: 5px;">${start + 1}-${end}</span>
                <span style="font-size: 1em; color: #666;">Part ${partNum}</span>
            `;

            btn.onmouseover = () => btn.style.transform = 'translateY(-3px)';
            btn.onmouseout = () => btn.style.transform = 'translateY(0)';

            btn.onclick = () => {
                const slice = category.words.slice(start, end);
                startPlayer(slice);
            };

            partsContainer.appendChild(btn);
        }
    }

    function startPlayer(words) {
        currentIndex = 0;
        // Store current subset of words in a property we can access in updateCard
        currentCategory.currentWords = words;

        partsContainer.classList.add('hidden');
        playerContainer.classList.remove('hidden');

        // Update back button to go back to parts
        backBtn.onclick = () => startCategory(currentCategory);

        updateCard();
    }

    // Public method to reset to categories view (used by main navigation)
    window.resetVocabularyView = function () {
        showCategories();
    }

    function showCategories() {
        playerContainer.classList.add('hidden');
        partsContainer.classList.add('hidden');
        categoriesContainer.classList.remove('hidden');
        currentCategory = null;
        vocabTitle.textContent = 'Vocabulary'; // Reset title
        backBtn.onclick = showCategories; // Reset default back
    }

    function updateCard() {
        if (!currentCategory) return;

        const words = currentCategory.currentWords || currentCategory.words;

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
