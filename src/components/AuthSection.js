// Auth Section Component - v4.1 (Secure Async)
import { signInWithGoogle, signOutUser, observeAuthState } from '../services/auth.js';

export function initAuthSection() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const premiumInfo = document.getElementById('premium-info');

    if (!loginBtn || !logoutBtn) return;

    // Login button handler
    loginBtn.onclick = async () => {
        const originalText = loginBtn.textContent;
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';

        const result = await signInWithGoogle();

        if (!result.success) {
            alert(result.error);
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
        }
    };

    // Logout button handler
    logoutBtn.onclick = async () => {
        const result = await signOutUser('en');

        if (!result.success) {
            alert(result.error);
        }
    };

    // Auth state observer (Async)
    // We treat this promise as fire-and-forget for component initialization
    observeAuthState((user) => {
        const billingBtn = document.getElementById('billing-portal-btn');
        const stripeLinks = document.querySelectorAll('a[href^="https://buy.stripe.com"]');

        if (user) {
            loginBtn.style.display = 'none';
            loginBtn.disabled = false;
            userInfo.classList.remove('hidden');
            userName.textContent = `Welcome, ${user.displayName || user.email}!`;

            // Smart Billing Button Logic
            if (billingBtn) {
                const billingLink = billingBtn.getAttribute('href');
                if (billingLink === '#' || !billingLink) {
                    billingBtn.style.display = 'none'; // Hide if not configured
                } else {
                    billingBtn.style.display = 'inline-block'; // Show if configured
                }
            }

            // SMART STRIPE LINKS: Attach User ID so we know who paid!
            stripeLinks.forEach(link => {
                const baseUrl = link.href.split('?')[0]; // Clean existing params if any
                link.href = `${baseUrl}?client_reference_id=${user.uid}&prefilled_email=${encodeURIComponent(user.email)}`;
            });

            // Keep premium section visible - user might not be premium yet
            if (premiumInfo) premiumInfo.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
            userInfo.classList.add('hidden');
            if (premiumInfo) premiumInfo.style.display = 'block';

            // Reset Stripe links on logout
            stripeLinks.forEach(link => {
                link.href = link.href.split('?')[0];
            });
        }
    }).catch(err => console.error("Auth Observer verification failed:", err));
}
