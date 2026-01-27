import { getWords } from '../services/storage.js';

// export function createFlashcard(wordList = [], index = 0, onFlip, onNext, onPrev) {
export function createFlashcard(wordList = [], index = 0, onFlip, onNext, onPrev, containerOrId = 'flashcard-container') {
    let container;

    if (typeof containerOrId === 'string') {
        container = document.getElementById(containerOrId);
    } else {
        container = containerOrId;
    }

    if (!container) {
        console.error('Flashcard container not found:', containerOrId);
        return;
    }

    // Clear container
    container.innerHTML = '';

    // If no words
    if (!wordList || wordList.length === 0) {
        container.innerHTML = `
            <div class="empty-flashcard">
                <div class="empty-icon">🎴</div>
                <p>No words available to practice.</p>
            </div>
        `;
        return;
    }

    const word = wordList[index];

    // Create card element
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        if (onFlip) onFlip();
    });

    // Valid word check - flexible for both formats (storage vs phrases)
    // Phrases have 'word' and 'translation' properties just like storage items
    if (!word || !word.word || !word.translation) {
        console.error('Invalid word data:', word);
        return;
    }

    // Support for example sentence (Phrases feature)
    const exampleHtml = word.example ? `<div class="card-example" style="margin-top:15px; font-style:italic; opacity:0.8; font-size:0.9em;">"${word.example}"</div>` : '';

    card.innerHTML = `
        <div class="flashcard-inner">
            <div class="flashcard-front">
                <div class="card-label">Finnish</div>
                <div class="card-word">${word.word}</div>
                <div class="card-hint">Click to flip</div>
            </div>
            <div class="flashcard-back">
                <div class="card-label">English</div>
                <div class="card-word">${word.translation}</div>
                ${exampleHtml}
            </div>
        </div>
    `;

    container.appendChild(card);
}

// Update flashcard progress
export function updateProgress(current, total) {
    const progressEl = document.getElementById('flashcard-progress');
    if (progressEl) {
        progressEl.textContent = `${current} / ${total}`;
    }
}
