// Premium Card Component
import { createCheckoutSession } from '../services/payment.js';
import { getCurrentLang } from './LanguageSwitcher.js';

export function initPremiumCard() {
    const premiumBtn = document.getElementById('premium-btn');
    const premiumToggle = document.getElementById('premium-toggle');
    const premiumBanner = document.getElementById('premium-banner');

    // Premium button click handler
    if (premiumBtn) {
        premiumBtn.addEventListener('click', async () => {
            const currentLang = getCurrentLang();
            const result = await createCheckoutSession(currentLang);

            if (!result.success && result.error) {
                alert(result.error);
            }
        });
    }

    // Premium banner toggle
    if (premiumToggle && premiumBanner) {
        premiumToggle.addEventListener('click', () => {
            premiumBanner.classList.toggle('collapsed');
        });

        // Start collapsed on mobile
        if (window.innerWidth < 768) {
            premiumBanner.classList.add('collapsed');
        }
    }
}
