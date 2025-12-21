// Auth Section Component - v2.0 (Premium visibility fix)
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged } from '../services/auth.js';
import { getCurrentLang } from './LanguageSwitcher.js';
import { updateTranslations } from '../utils/i18n.js';

export function initAuthSection() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const premiumInfo = document.getElementById('premium-info');

    if (!loginBtn || !logoutBtn) return;

    // Login button handler
    loginBtn.onclick = async () => {
        const currentLang = getCurrentLang();
        const originalText = loginBtn.textContent;
        loginBtn.disabled = true;
        loginBtn.textContent = currentLang === 'tr' ? 'Giriş yapılıyor...' : 'Signing in...';

        const result = await signInWithGoogle(currentLang);

        if (!result.success) {
            alert(result.error);
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
        }
    };

    // Logout button handler
    logoutBtn.onclick = async () => {
        const currentLang = getCurrentLang();
        const result = await signOutUser(currentLang);

        if (!result.success) {
            alert(result.error);
        }
    };

    // Auth state observer
    onAuthStateChanged(auth, (user) => {
        const currentLang = getCurrentLang();

        if (user) {
            loginBtn.style.display = 'none';
            loginBtn.disabled = false;
            loginBtn.textContent = loginBtn.dataset[currentLang === 'tr' ? 'tr' : 'en'] || 'Google ile Giriş Yap';
            userInfo.classList.remove('hidden');
            userName.textContent = `${currentLang === 'tr' ? 'Hoş geldin' : 'Welcome'}, ${user.displayName || user.email}!`;
            // Keep premium section visible - user might not be premium yet
            if (premiumInfo) premiumInfo.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = loginBtn.dataset[currentLang === 'tr' ? 'tr' : 'en'] || 'Google ile Giriş Yap';
            userInfo.classList.add('hidden');
            if (premiumInfo) premiumInfo.style.display = 'block';
        }
    });
}
