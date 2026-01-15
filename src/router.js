import { AboutPage } from './pages/About.js';
import { ContactPage } from './pages/Contact.js';

import { TermsPage } from './pages/Terms.js';
import { PremiumContentPage } from './pages/PremiumContent.js';

export class Router {
    constructor() {
        this.routes = {
            '': 'home',
            'about': 'about',
            'contact': 'contact',
            'terms': 'terms',
            'premium-content': 'premium-content'
        };

        this.pages = {
            about: new AboutPage(),
            contact: new ContactPage(),
            terms: new TermsPage(),
            'premium-content': new PremiumContentPage()
        };

        this.currentPage = null;
        this.init();
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => this.handleRoute());

        // Handle initial load
        this.handleRoute();


    }

    handleRoute() {
        const hash = window.location.hash.slice(1); // Remove #
        const route = this.routes[hash] || 'home';

        if (route === 'home') {
            this.showHomePage();
        } else {
            this.showPage(route);
        }
    }

    showHomePage() {
        const modal = document.getElementById('legal-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scroll
        }

        this.currentPage = 'home';
    }

    async showPage(pageName) {
        const lang = 'en'; // Force English
        const page = this.pages[pageName];

        if (!page) return;

        // Create or get modal
        let modal = document.getElementById('legal-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'legal-modal';
            modal.className = 'legal-modal';
            modal.innerHTML = `
                <div class="legal-modal-overlay"></div>
                <div class="legal-modal-content">
                    <button class="legal-modal-close" aria-label="Close">&times;</button>
                    <div class="legal-modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close button handler
            modal.querySelector('.legal-modal-close').addEventListener('click', () => {
                window.location.hash = '';
            });

            // Overlay click to close
            modal.querySelector('.legal-modal-overlay').addEventListener('click', () => {
                window.location.hash = '';
            });

            // ESC key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    window.location.hash = '';
                }
            });
        }

        // Update modal content
        const modalBody = modal.querySelector('.legal-modal-body');

        // Show loading state if needed (optional, could be added later)
        modalBody.innerHTML = '<div style="padding: 20px; text-align: center;">Loading...</div>';

        // Show modal immediately so user sees something happening
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        try {
            // Await render in case it's async
            const content = await page.render(lang);
            modalBody.innerHTML = content;
        } catch (error) {
            console.error('Error rendering page:', error);
            modalBody.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Error loading content. Please try again.</div>';
        }

        // Attach event listeners for contact page
        if (pageName === 'contact' && page.attachEventListeners) {
            page.attachEventListeners(lang);
        }

        this.currentPage = pageName;
    }

    navigate(path) {
        window.location.hash = path;
    }



    updateLanguage(lang) {
        // No-op for English only
    }
}
