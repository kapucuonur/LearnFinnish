// Auth Section Component - v4.0 (English Only)
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged } from '../services/auth.js';

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

    // Auth state observer
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginBtn.style.display = 'none';
            loginBtn.disabled = false;
            userInfo.classList.remove('hidden');
            userName.textContent = `Welcome, ${user.displayName || user.email}!`;
            // Keep premium section visible - user might not be premium yet
            if (premiumInfo) premiumInfo.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
            userInfo.classList.add('hidden');
            if (premiumInfo) premiumInfo.style.display = 'block';
        }
    });
}
