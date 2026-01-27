// Main Application Entry Point - v5.0 (Renamed to app.js)
// import { initLanguageSwitcher } from './components/LanguageSwitcher.js'; // Removed
import { initAuthSection } from './components/AuthSection.js';
import { initPremiumCard } from './components/PremiumCard.js';
import { initStoryDisplay, updateUsageIndicators } from './components/StoryDisplay.js';
import { initWordNotebook, initNotebookClear } from './components/WordNotebook.js';
import { initPhrasesSection } from './components/PhrasesSection.js';
import { initVocabularySection } from './components/VocabularySection.js';
import { initPWAInstall } from './components/PWAInstall.js';
import { initUsageLimitModal } from './components/UsageLimitModal.js';
import { initThemeToggle } from './components/ThemeToggle.js';
import { initChatbot } from './components/Chatbot.js';
import { initializeStripe, handlePaymentCallback } from './services/payment.js';
import { updateWordCount } from './services/storage.js';
import { STRIPE_PUBLISHABLE_KEY } from './config/constants.js';
import { Router } from './router.js';
import './utils/premium-ads-ios.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize all components
    initThemeToggle();
    initAuthSection();
    initPremiumCard();
    initStoryDisplay();
    initWordNotebook();
    initPhrasesSection();
    initVocabularySection(); // New
    initNotebookClear();
    initPWAInstall();
    initUsageLimitModal();
    initChatbot();

    // 2. Setup Navigation
    setupNavigation();

    // 3. Initialize router for legal pages
    const router = new Router();

    // 4. Initialize Stripe
    initializeStripe(STRIPE_PUBLISHABLE_KEY);

    // 5. Handle payment callback
    handlePaymentCallback('en');

    // 6. Update generic UI states
    updateWordCount();
    await updateUsageIndicators();

    // 7. Initialize Gamification UI
    const { getGamificationStats } = await import('./services/gamification.js');
    const { initDailyQuiz } = await import('./components/DailyQuiz.js');

    initDailyQuiz();

    function updateGamificationUI() {
        const stats = getGamificationStats();
        const display = document.getElementById('xp-display');
        const levelEl = document.getElementById('user-level');
        const barEl = document.getElementById('xp-progress-bar');

        if (display && levelEl && barEl) {
            display.classList.remove('hidden');
            levelEl.textContent = stats.level;
            barEl.style.width = `${stats.progress}%`;
            display.title = `${stats.xp} XP (Next Level: ${stats.nextLevelXP} XP)`;
        }
    }

    // Initial update
    updateGamificationUI();

    // Listen for updates
    window.addEventListener('gamification-update', () => {
        updateGamificationUI();
    });

    console.log('✅ LearnFinnish initialized successfully!');
});

function setupNavigation() {
    console.log('Setup Navigation');
    const navButtons = [
        { id: 'btn-vocab', area: 'vocabulary-area' },
        { id: 'btn-phrases', area: 'phrases-area' },
        { id: 'btn-video', area: 'premium-area' },
        { id: 'btn-samples', area: 'sample-stories-area' },
        { id: 'btn-notebook', area: 'notebook-area' },
        { id: 'btn-flashcards', area: 'flashcard-alani' }
    ];

    // All area IDs that should be exclusive
    const allAreas = [...navButtons.map(n => n.area), 'story-area', 'notebook-area'];

    navButtons.forEach(btnInfo => {
        const btn = document.getElementById(btnInfo.id);
        if (!btn) return;

        btn.addEventListener('click', () => {
            // 1. Reset all buttons
            document.querySelectorAll('.nav-card-btn').forEach(b => b.classList.remove('active'));
            // 2. Activate clicked
            btn.classList.add('active');

            // 3. Hide all areas first
            allAreas.forEach(areaId => {
                const el = document.getElementById(areaId);
                if (el) el.classList.add('hidden');
            });

            // 4. Show target area
            const target = document.getElementById(btnInfo.area);
            if (target) target.classList.remove('hidden');

            // 5. Reset specific views if needed
            if (btnInfo.id === 'btn-vocab' && window.resetVocabularyView) {
                window.resetVocabularyView();
            }
            if (btnInfo.id === 'btn-phrases' && window.resetPhrasesView) {
                // If Phrases component exposes a reset, call it. 
                // Currently it doesn't, but Categories is default view. 
                // We might need to manually reset the phrases view in PhrasesSection.js if user navigates away.
                // For now, hiding/showing usually preserves state, which is fine.
            }
            if (btnInfo.id === 'btn-flashcards') {
                // Trigger a refresh/shuffle if needed when entering flashcards
                const shuffleBtn = document.getElementById('shuffle-cards-btn');
                if (shuffleBtn) shuffleBtn.click();
            }
        });
    });

    // Handle "Generate Story" click -> Show Story Area
    const genBtn = document.getElementById('generate-story');
    if (genBtn) {
        genBtn.addEventListener('click', () => {
            // Deactivate Grid buttons
            document.querySelectorAll('.nav-card-btn').forEach(b => b.classList.remove('active'));

            // Hide all grid areas
            allAreas.forEach(areaId => {
                const el = document.getElementById(areaId);
                if (el) el.classList.add('hidden');
            });

            // Show Story Area
            const storyArea = document.getElementById('story-area');
            if (storyArea) storyArea.classList.remove('hidden');
        });
    }
}
