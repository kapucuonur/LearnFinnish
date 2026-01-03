// ============================================
// PREMIUM & ADSENSE MANAGEMENT
// ============================================

// Premium kullanıcı kontrolü
async function checkPremiumStatus() {
    const user = getCurrentUser();
    if (!user) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/api/check-premium`, {
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return false;

        const data = await response.json();
        return data.isPremium || false;
    } catch (error) {
        console.error('Premium check failed:', error);
        return false;
    }
}

// AdSense başlatma
async function initializeAds() {
    // Premium kontrolü
    const isPremium = await checkPremiumStatus();

    if (isPremium) {
        // Premium kullanıcılar için reklamları gizle
        document.body.classList.add('premium');
        document.querySelectorAll('.ad-container, .adsbygoogle').forEach(ad => {
            ad.style.display = 'none';
        });
        console.log('✨ Premium user - ads hidden');
        return;
    }

    // Free kullanıcılar için reklamları göster
    try {
        // AdSense script yüklendiyse
        if (typeof adsbygoogle !== 'undefined') {
            // Her ad container için push
            document.querySelectorAll('.adsbygoogle').forEach(ad => {
                if (!ad.hasAttribute('data-ad-pushed')) {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    ad.setAttribute('data-ad-pushed', 'true');
                }
            });
            console.log('📢 Ads initialized');
        } else {
            console.log('⏳ Waiting for AdSense script...');
            // Script yüklenene kadar bekle
            setTimeout(initializeAds, 1000);
        }
    } catch (error) {
        console.error('AdSense error:', error);
    }
}

// iOS Safari düzeltmeleri
function applyIOSFixes() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (!isIOS) return;

    console.log('📱 Applying iOS fixes...');

    // Viewport height fix
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    // iOS Safari'de input zoom'u engelle
    document.querySelectorAll('input, textarea, select').forEach(input => {
        if (parseInt(window.getComputedStyle(input).fontSize) < 16) {
            input.style.fontSize = '16px';
        }
    });

    // iOS'ta scroll performance
    document.querySelectorAll('.content-area, .card, #chat-messages').forEach(el => {
        el.style.webkitOverflowScrolling = 'touch';
        el.style.transform = 'translateZ(0)';
    });

    console.log('✅ iOS fixes applied');
}

// Fetch with timeout (iOS için önemli)
function fetchWithTimeout(url, options = {}, timeout = 15000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

// Global error handler
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Global Error:', e.error);

        // iOS'ta kritik hata olursa
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && e.error) {
            // SecurityError veya QuotaExceededError gibi iOS-specific hatalar
            if (e.error.name === 'SecurityError' || e.error.name === 'QuotaExceededError') {
                console.warn('iOS storage error detected, clearing cache...');
                try {
                    localStorage.clear();
                    sessionStorage.clear();
                } catch (clearError) {
                    console.error('Failed to clear storage:', clearError);
                }
            }
        }
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
    });
}

// User helper fonksiyonu (örnek)
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
}

// API base URL (environment'a göre ayarlayın)
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://api.learn-finnish.fi';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing LearnFinnish...');

    // iOS fixes
    applyIOSFixes();

    // Error handling
    setupErrorHandling();

    // Premium & Ads (sayfa yüklendikten sonra)
    window.addEventListener('load', () => {
        setTimeout(initializeAds, 1000);
    });

    // Billing portal link'i dinamik yap
    const billingBtn = document.getElementById('billing-portal-btn');
    if (billingBtn) {
        billingBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const user = getCurrentUser();
            if (!user) {
                alert('Please sign in first');
                return;
            }

            try {
                // Stripe Customer Portal link'i al
                const response = await fetchWithTimeout(`${API_BASE_URL}/api/create-portal-session`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.url) {
                    window.location.href = data.url;
                } else {
                    alert('Could not open billing portal. Please contact support.');
                }
            } catch (error) {
                console.error('Billing portal error:', error);
                alert('Error opening billing portal. Please try again.');
            }
        });
    }

    console.log('✅ LearnFinnish initialized');
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Page load performance
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('📊 Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }
    }
});

// ============================================
// SERVICE WORKER UNREGISTER (iOS için)
// ============================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
            registration.unregister();
            console.log('🚨 Service Worker unregistered');
        });
    });
}

// ============================================
// EXPORT (Diğer modüller için)
// ============================================

export {
    checkPremiumStatus,
    initializeAds,
    fetchWithTimeout,
    getCurrentUser,
    API_BASE_URL
};
