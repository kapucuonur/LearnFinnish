import { auth } from '../services/auth.js';
import { checkPremiumStatus } from '../services/payment.js';

export class PremiumContentPage {
    constructor() {
        this.containerId = 'premium-content-page';
    }

    async render(lang = 'en') {
        const currentUser = auth.currentUser;

        // Container with loading initially (though router handles async wait, we might want internal states if we move away from router-wait)
        // Since router waits, we have the data ready.

        let content = '';

        if (!currentUser) {
            content = this.renderLoginPrompt();
        } else {
            // Show loading state while checking premium status
            try {
                const isPremium = await checkPremiumStatus(currentUser.uid);
                if (isPremium) {
                    content = this.renderPremiumContent();
                } else {
                    content = this.renderUpgradePrompt();
                }
            } catch (error) {
                console.error('Error checking premium status:', error);
                content = `<div class="error-state">
                    <p>Unable to verify subscription status. Please try again later.</p>
                </div>`;
            }
        }

        return `
            <div id="${this.containerId}" class="premium-page-wrapper">
                <style>
                    .premium-page-wrapper {
                        font-family: 'Inter', system-ui, -apple-system, sans-serif;
                        color: #1f2937;
                        animation: fadeIn 0.4s ease-out;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .premium-hero {
                        text-align: center;
                        padding: 3rem 1.5rem;
                        background: radial-gradient(circle at top right, #e0f2f1 0%, #ffffff 60%);
                        border-radius: 24px;
                        margin-bottom: 2.5rem;
                    }

                    .premium-title {
                        font-size: 2.25rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #006064 0%, #00acc1 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 1rem;
                        letter-spacing: -0.02em;
                    }

                    .premium-subtitle {
                        font-size: 1.1rem;
                        color: #546e7a;
                        max-width: 600px;
                        margin: 0 auto;
                        line-height: 1.6;
                    }

                    .content-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                        gap: 2rem;
                        margin-bottom: 3rem;
                    }

                    .media-card {
                        background: white;
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.01);
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        border: 1px solid rgba(0,0,0,0.03);
                    }

                    .media-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.1);
                    }

                    .media-header {
                        padding: 1.25rem 1.5rem;
                        background: #fff;
                        border-bottom: 1px solid #f3f4f6;
                    }

                    .media-tag {
                        display: inline-block;
                        padding: 0.25rem 0.75rem;
                        border-radius: 999px;
                        font-size: 0.75rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 0.5rem;
                    }

                    .tag-video { background: #e0f7fa; color: #006064; }
                    .tag-audio { background: #f3e5f5; color: #7b1fa2; }

                    .media-title {
                        font-size: 1.1rem;
                        font-weight: 600;
                        color: #111827;
                        margin: 0;
                    }

                    .media-embed {
                        position: relative;
                        padding-bottom: 56.25%; /* 16:9 */
                        height: 0;
                        background: #000;
                    }
                    
                    .media-embed iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border: 0;
                    }

                    .lock-screen {
                        text-align: center;
                        padding: 4rem 2rem;
                        background: white;
                        border-radius: 24px;
                        box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.08);
                        max-width: 500px;
                        margin: 2rem auto;
                        border: 1px solid #f0f0f0;
                    }

                    .lock-icon {
                        font-size: 4rem;
                        margin-bottom: 1.5rem;
                        display: inline-block;
                        animation: bounce 2s infinite;
                    }

                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                        40% {transform: translateY(-10px);}
                        60% {transform: translateY(-5px);}
                    }

                    .lock-title {
                        font-size: 1.75rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin-bottom: 1rem;
                    }

                    .lock-text {
                        color: #6b7280;
                        margin-bottom: 2rem;
                        line-height: 1.6;
                    }

                    .btn-upgrade {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #006064 0%, #00838f 100%);
                        color: white;
                        font-weight: 600;
                        padding: 1rem 2rem;
                        border-radius: 12px;
                        text-decoration: none;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 12px rgba(0, 96, 100, 0.2);
                    }

                    .btn-upgrade:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 16px rgba(0, 96, 100, 0.3);
                        background: linear-gradient(135deg, #004d40 0%, #006064 100%);
                    }

                    .legal-footer {
                        font-size: 0.85rem;
                        color: #9ca3af;
                        text-align: center;
                        margin-top: 4rem;
                        padding-top: 2rem;
                        border-top: 1px solid #f3f4f6;
                    }
                    .resource-card {
                        background: white;
                        border-radius: 20px;
                        padding: 1.5rem;
                        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.01);
                        border: 1px solid rgba(0,0,0,0.03);
                        transition: transform 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }

                    .resource-card:hover {
                        transform: translateY(-5px);
                    }

                    .resource-card h4 {
                        font-size: 1.1rem;
                        font-weight: 700;
                        color: #1f2937;
                        margin-bottom: 0.5rem;
                        margin-top: 0;
                    }

                    .resource-card p {
                        color: #666;
                        font-size: 0.95rem;
                        margin-bottom: 1.5rem;
                        line-height: 1.5;
                    }

                    .go-btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background: #006064;
                        color: white;
                        font-weight: 600;
                        padding: 0.75rem 1.5rem;
                        border-radius: 12px;
                        text-decoration: none;
                        transition: all 0.2s ease;
                        text-align: center;
                    }

                    .go-btn:hover {
                        background: #00838f;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 96, 100, 0.2);
                    }
                </style>
                ${content}
            </div>
        `;
    }

    renderLoginPrompt() {
        return `
            <div class="lock-screen">
                <span class="lock-icon">🔒</span>
                <h2 class="lock-title">Premium Lounge Locked</h2>
                <p class="lock-text">Please sign in to access exclusive Finnish learning content, including advanced video guides and podcasts.</p>
                <button onclick="document.querySelector('.legal-modal-close').click(); setTimeout(() => document.querySelector('#login-btn')?.click(), 300);" class="btn-upgrade" style="cursor: pointer; border: none; width: 100%;">
                    Sign In to Continue
                </button>
            </div>
        `;
    }

    renderUpgradePrompt() {
        return `
            <div class="lock-screen">
                <span class="lock-icon">💎</span>
                <h2 class="lock-title">Unlock Premium Access</h2>
                <p class="lock-text">Join our premium community to access exclusive content that accelerates your learning journey. Support the app and get more!</p>
                
                <div style="text-align: left; margin-bottom: 2rem; background: #f9fafb; padding: 1.5rem; border-radius: 12px;">
                    <ul style="list-style: none; padding: 0; margin: 0; color: #4b5563;">
                        <li style="margin-bottom: 0.5rem;">✅ Exclusive Video Guides</li>
                        <li style="margin-bottom: 0.5rem;">✅ Premium Podcasts</li>
                        <li style="margin-bottom: 0.5rem;">✅ Ad-free Experience</li>
                        <li>✅ Support Future Development</li>
                    </ul>
                </div>

                <a href="https://buy.stripe.com/00waEX4D95ai0In6qv9oc00" target="_blank" class="btn-upgrade" style="width: 100%; box-sizing: border-box;">
                    Upgrade Now - One Time
                </a>
            </div>
        `;
    }

    renderPremiumContent() {
        return `
            <div class="premium-hero">
                <h2 class="premium-title">Premium Lounge</h2>
                <p class="premium-subtitle">Welcome to your exclusive content library. We've curated these resources to help you master Finnish faster.</p>
            </div>

            <div class="content-grid">
                <!-- Video Section -->
                <div class="media-card">
                    <div class="media-header">
                        <span class="media-tag tag-video">Video Guide</span>
                        <h3 class="media-title">Mastering Finnish Cases</h3>
                    </div>
                    <div class="media-embed">
                        <iframe src="https://www.youtube-nocookie.com/embed/VlhyUfvD8VE?si=sGiW8jZmbYflYJMm" title="Finnish Cases Guide" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                </div>

                <!-- Spotify Section -->
                <div class="media-card">
                    <div class="media-header">
                        <span class="media-tag tag-audio">Podcast</span>
                        <h3 class="media-title">Daily Finnish Listening</h3>
                    </div>
                    <div class="media-embed" style="padding-bottom: 0; height: 352px;">
                        <iframe style="border-radius:12px" src="https://open.spotify.com/embed/show/4xApnaeGa0cOjKxaiUKrGr?utm_source=generator&t=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    </div>
                </div>

                <!-- Second Spotify Section -->
                <div class="media-card">
                    <div class="media-header">
                        <span class="media-tag tag-audio">Podcast</span>
                        <h3 class="media-title">Advanced Finnish Listening</h3>
                    </div>
                    <div class="media-embed" style="padding-bottom: 0; height: 352px;">
                        <iframe style="border-radius:12px" src="https://open.spotify.com/embed/show/4sGoFvQUHdo4ND6hwjKxzj?utm_source=generator&t=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    </div>
                </div>
                
                 <!-- Another Video Section -->
                <div class="media-card">
                    <div class="media-header">
                        <span class="media-tag tag-video">Pro Tip</span>
                        <h3 class="media-title">Pronunciation Secrets</h3>
                    </div>
                    <div class="media-embed">
                        <iframe src="https://www.youtube.com/embed/M7lc1UVf-VE?si=Placeholder" title="Pronunciation Secrets" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                </div>

                <!-- Yle Areena Section -->
                <div class="resource-card">
                    <h4>Yle Areena: News / Program</h4>
                    <p>You can watch this program on Yle Areena.</p>
                    
                    <a href="https://areena.yle.fi/1-65257531" target="_blank" class="go-btn">
                       Watch on Yle Areena
                    </a>
                </div>
            </div>

            <div class="legal-footer">
                <p><strong>Disclaimer:</strong> The content provided in this section includes embedded media hosted by third-party platforms. LearnFinnish does not host this content directly and assumes no responsibility for its availability or accuracy. Access is provided as a convenience to our supporters.</p>
            </div>
        `;
    }
}
