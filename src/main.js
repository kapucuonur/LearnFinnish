// Main Application Entry Point - v4.0
// import { initLanguageSwitcher } from './components/LanguageSwitcher.js'; // Removed
import { initAuthSection } from './components/AuthSection.js';
import { initPremiumCard } from './components/PremiumCard.js';
import { initStoryControls, updateUsageIndicators } from './components/StoryDisplay.js';
import { initTabs, initNotebookClear } from './components/WordNotebook.js';
import { initPWAInstall } from './components/PWAInstall.js';
import { initUsageLimitModal } from './components/UsageLimitModal.js';
import { initThemeToggle } from './components/ThemeToggle.js';
import { initChatbot } from './components/Chatbot.js';
import { initializeStripe, handlePaymentCallback } from './services/payment.js';
import { updateWordCount } from './services/storage.js';
import { updateTranslations, getCurrentLanguage } from './utils/i18n.js';
import { STRIPE_PUBLISHABLE_KEY } from './config/constants.js';
import { Router } from './router.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize all components
    // initLanguageSwitcher(); // Removed
    initThemeToggle();
    initAuthSection();
    initPremiumCard();
    initStoryControls();
    initTabs();
    initNotebookClear();
    initPWAInstall();
    initUsageLimitModal();
    initChatbot();

    // Initialize router for legal pages
    const router = new Router();

    // Initialize Stripe
    initializeStripe(STRIPE_PUBLISHABLE_KEY);

    // Handle payment callback from Stripe redirect
    handlePaymentCallback(getCurrentLanguage());

    // Update UI with current language
    updateTranslations();

    // Update word notebook counter
    updateWordCount();

    // Update usage indicators
    await updateUsageIndicators();

    console.log('✅ LearnFinnish initialized successfully!');
});
