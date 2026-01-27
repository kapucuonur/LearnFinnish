// Premium Card Component
import { createCheckoutSession } from '../services/payment.js';


export function initPremiumCard() {
    const premiumBtn = document.getElementById('premium-btn');
    const premiumToggle = document.getElementById('premium-toggle');
    const premiumBanner = document.getElementById('premium-banner');

    // 1. Navigate to internal Premium Content page (if button exists)
    if (premiumBtn) {
        premiumBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'premium-content';
        });
    }

    // 2. Premium banner toggle (Independent of premiumBtn)
    if (premiumToggle && premiumBanner) {
        premiumToggle.addEventListener('click', () => {
            premiumBanner.classList.toggle('collapsed');
        });
    }
}
