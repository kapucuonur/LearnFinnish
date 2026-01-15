// Premium Card Component
import { createCheckoutSession } from '../services/payment.js';


export function initPremiumCard() {
    const premiumBtn = document.getElementById('premium-btn');
    const premiumToggle = document.getElementById('premium-toggle');
    const premiumBanner = document.getElementById('premium-banner');

    if (!premiumBtn) return;

    // Navigate to internal Premium Content page
    premiumBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'premium-content';
    });

    // Premium banner toggle
    if (premiumToggle && premiumBanner) {
        premiumToggle.addEventListener('click', () => {
            premiumBanner.classList.toggle('collapsed');
        });
    }
}
