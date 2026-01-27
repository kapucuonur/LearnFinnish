// Main Application Entry Point - v5.0 (Renamed to app.js)
// import { initLanguageSwitcher } from './components/LanguageSwitcher.js'; // Removed
import { initAuthSection } from './components/AuthSection.js';
import { initPremiumCard } from './components/PremiumCard.js';
import { initStoryDisplay, updateUsageIndicators } from './components/StoryDisplay.js';
import { initWordNotebook, initNotebookClear } from './components/WordNotebook.js';
import { initPhrasesSection } from './components/PhrasesSection.js';
import { initPWAInstall } from './components/PWAInstall.js';
import { initUsageLimitModal } from './components/UsageLimitModal.js';
import { initThemeToggle } from './components/ThemeToggle.js';
import { initChatbot } from './components/Chatbot.js';
import { initializeStripe, handlePaymentCallback } from './services/payment.js';
import { updateWordCount } from './services/storage.js';
import { STRIPE_PUBLISHABLE_KEY } from './config/constants.js';
import { Router } from './router.js';
import './utils/premium-ads-ios.js'; // Auto-runs initialization logic

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize all components
    // initLanguageSwitcher(); // Removed
    initThemeToggle();
    initAuthSection();
    initPremiumCard();
    initStoryDisplay();
    initWordNotebook();
    initPhrasesSection();
    initNotebookClear();
    initPWAInstall();
    initUsageLimitModal();
    initChatbot();

    // Initialize router for legal pages
    const router = new Router();

    // Initialize Stripe
    initializeStripe(STRIPE_PUBLISHABLE_KEY);

    // Handle payment callback from Stripe redirect
    handlePaymentCallback('en');

    // Update word notebook counter
    updateWordCount();

    // Update usage indicators
    await updateUsageIndicators();

    // Initialize Gamification UI
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
