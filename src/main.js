// Main Application Entry Point
import { initLanguageSwitcher } from './components/LanguageSwitcher.js';
import { initAuthSection } from './components/AuthSection.js';
import { initPremiumCard } from './components/PremiumCard.js';
import { initStoryControls, updateUsageIndicators } from './components/StoryDisplay.js';
import { initTabs, initNotebookClear } from './components/WordNotebook.js';
import { initPWAInstall } from './components/PWAInstall.js';
import { initUsageLimitModal } from './components/UsageLimitModal.js';
import { initializeStripe, handlePaymentCallback } from './services/payment.js';
import { defterSayisiniGuncelle } from './services/storage.js';
import { updateTranslations, getCurrentLanguage } from './utils/i18n.js';
import { STRIPE_PUBLISHABLE_KEY } from './config/constants.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize all components
    initLanguageSwitcher();
    initAuthSection();
    initPremiumCard();
    initStoryControls();
    initTabs();
    initNotebookClear();
    initPWAInstall();
    initUsageLimitModal();

    // Initialize Stripe
    initializeStripe(STRIPE_PUBLISHABLE_KEY);

    // Handle payment callback from Stripe redirect
    handlePaymentCallback(getCurrentLanguage());

    // Update UI with current language
    updateTranslations();

    // Update word notebook counter
    defterSayisiniGuncelle();

    // Update usage indicators
    await updateUsageIndicators();

    console.log('✅ LearnFinnish initialized successfully!');
});
