import { getWords } from '../services/storage.js';

export function createFlashcard(wordList = [], index = 0, onFlip, onNext, onPrev) {
    const container = document.getElementById('flashcard-container');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // If no words
    if (!wordList || wordList.length === 0) {
        container.innerHTML = `
            <div class="empty-flashcard">
                <div class="empty-icon">🎴</div>
                <p>No words added yet. Add words to your notebook by clicking on them in the stories!</p>
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

    // Valid word check - match storage format
    if (!word || !word.word || !word.translation) {
        console.error('Invalid word data:', word);
        return;
    }

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
