// Flashcard Component
import { defteriListele } from '../services/storage.js';
import { getCurrentLang } from './LanguageSwitcher.js';
import { canViewFlashcards, incrementFlashcardCount } from '../services/usageLimits.js';
import { showUsageLimitModal } from './UsageLimitModal.js';

const DEFTER_KEY = 'LearnFinnish_kelimeler';

let currentCardIndex = 0;
let flashcards = [];
let isFlipped = false;

// Get flashcards from word notebook
function getFlashcards() {
    const defter = JSON.parse(localStorage.getItem(DEFTER_KEY) || '[]');
    return defter;
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Display current flashcard
function displayCard() {
    const cardContainer = document.getElementById('flashcard-container');
    const progressEl = document.getElementById('flashcard-progress');
    const prevBtn = document.getElementById('prev-card-btn');
    const nextBtn = document.getElementById('next-card-btn');

    if (!cardContainer) return;

    if (flashcards.length === 0) {
        const currentLang = getCurrentLang();
        cardContainer.innerHTML = `
      <div class="no-flashcards">
        <p data-tr="Henüz kelime eklenmemiş. Hikayedeki kelimelere tıklayarak kelime defterine ekleyin!" 
           data-en="No words added yet. Click on words in the story to add them to your notebook!">
          ${currentLang === 'tr'
                ? 'Henüz kelime eklenmemiş. Hikayedeki kelimelere tıklayarak kelime defterine ekleyin!'
                : 'No words added yet. Click on words in the story to add them to your notebook!'}
        </p>
      </div>
    `;
        if (progressEl) progressEl.textContent = '0 / 0';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
    }

    const card = flashcards[currentCardIndex];
    isFlipped = false;

    cardContainer.innerHTML = `
    <div class="flashcard" id="flashcard">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="card-label" data-tr="Fince" data-en="Finnish">Fince</div>
          <div class="card-word">${card.kelime}</div>
          <div class="card-hint" data-tr="Kartı çevirmek için tıklayın" data-en="Click to flip">
            Kartı çevirmek için tıklayın
          </div>
        </div>
        <div class="flashcard-back">
          <div class="card-label">${card.hedefDil === 'tr' ? 'Türkçe' : 'English'}</div>
          <div class="card-word">${card.ceviri}</div>
          <div class="card-hint" data-tr="Kartı çevirmek için tıklayın" data-en="Click to flip">
            Kartı çevirmek için tıklayın
          </div>
        </div>
      </div>
    </div>
  `;

    // Update progress
    if (progressEl) {
        progressEl.textContent = `${currentCardIndex + 1} / ${flashcards.length}`;
    }

    // Enable/disable navigation buttons
    if (prevBtn) prevBtn.disabled = currentCardIndex === 0;
    if (nextBtn) nextBtn.disabled = currentCardIndex === flashcards.length - 1;

    // Add click listener to flip card
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.addEventListener('click', flipCard);
    }
}

// Flip the card
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;

    isFlipped = !isFlipped;

    if (isFlipped) {
        flashcard.classList.add('flipped');
    } else {
        flashcard.classList.remove('flipped');
    }
}

// Navigate to previous card
async function previousCard() {
    if (currentCardIndex > 0) {
        // Check usage limit
        const canView = await canViewFlashcards();
        if (!canView.allowed) {
            showUsageLimitModal('flashcard');
            return;
        }

        currentCardIndex--;
        incrementFlashcardCount();
        displayCard();
    }
}

// Navigate to next card
async function nextCard() {
    if (currentCardIndex < flashcards.length - 1) {
        // Check usage limit
        const canView = await canViewFlashcards();
        if (!canView.allowed) {
            showUsageLimitModal('flashcard');
            return;
        }

        currentCardIndex++;
        incrementFlashcardCount();
        displayCard();
    }
}

// Shuffle flashcards
function shuffleFlashcards() {
    flashcards = shuffleArray(flashcards);
    currentCardIndex = 0;
    displayCard();
}

// Initialize flashcard component
export async function initFlashcards() {
    // Check usage limit before loading
    const canView = await canViewFlashcards();
    if (!canView.allowed) {
        showUsageLimitModal('flashcard');
        return;
    }

    flashcards = getFlashcards();
    currentCardIndex = 0;

    // Increment count for initial view
    if (flashcards.length > 0) {
        incrementFlashcardCount();
    }

    displayCard();

    // Setup navigation buttons
    const prevBtn = document.getElementById('prev-card-btn');
    const nextBtn = document.getElementById('next-card-btn');
    const shuffleBtn = document.getElementById('shuffle-cards-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', previousCard);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextCard);
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', shuffleFlashcards);
    }

    // Keyboard navigation
    document.addEventListener('keydown', async (e) => {
        const flashcardArea = document.getElementById('flashcard-alani');
        if (!flashcardArea || flashcardArea.classList.contains('hidden')) return;

        if (e.key === 'ArrowLeft') {
            await previousCard();
        } else if (e.key === 'ArrowRight') {
            await nextCard();
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipCard();
        }
    });
}

// Reload flashcards (when word notebook changes)
export function reloadFlashcards() {
    flashcards = getFlashcards();
    if (currentCardIndex >= flashcards.length) {
        currentCardIndex = Math.max(0, flashcards.length - 1);
    }
    displayCard();
}
