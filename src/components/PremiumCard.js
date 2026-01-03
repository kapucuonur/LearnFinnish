// Premium Card Component
import { createCheckoutSession } from '../services/payment.js';


export function initPremiumCard() {
    const premiumBtn = document.getElementById('premium-btn');
    const premiumToggle = document.getElementById('premium-toggle');
    const premiumBanner = document.getElementById('premium-banner');

    if (!premiumBtn) return;

    // Use direct Stripe Payment Link
    premiumBtn.addEventListener('click', () => {
        window.open('https://buy.stripe.com/00waEX4D95ai0In6qv9oc00', '_blank');
    });

    // Premium banner toggle
    if (premiumToggle && premiumBanner) {
        premiumToggle.addEventListener('click', () => {
            premiumBanner.classList.toggle('collapsed');
        });
    }
}
