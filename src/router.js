import { AboutPage } from './pages/About.js';
import { ContactPage } from './pages/Contact.js';
import { PrivacyPage } from './pages/Privacy.js';
import { TermsPage } from './pages/Terms.js';

export class Router {
    constructor() {
        this.routes = {
            '': 'home',
            'about': 'about',
            'contact': 'contact',
            'privacy': 'privacy',
            'terms': 'terms'
        };

        this.pages = {
            about: new AboutPage(),
            contact: new ContactPage(),
            privacy: new PrivacyPage(),
            terms: new TermsPage()
        };

        this.currentPage = null;
        this.init();
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => this.handleRoute());

        // Handle initial load
        this.handleRoute();

        // Add navigation links to footer
        this.addFooterLinks();
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

    showPage(pageName) {
        const lang = document.querySelector('.lang-btn.active')?.dataset.lang || 'tr';
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
        modalBody.innerHTML = page.render(lang);

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // Attach event listeners for contact page
        if (pageName === 'contact' && page.attachEventListeners) {
            page.attachEventListeners(lang);
        }

        this.currentPage = pageName;
    }

    navigate(path) {
        window.location.hash = path;
    }

    addFooterLinks() {
        // Create footer if it doesn't exist
        let footer = document.querySelector('.app-footer');
        if (!footer) {
            footer = document.createElement('footer');
            footer.className = 'app-footer';
            document.body.appendChild(footer);
        }

        footer.innerHTML = `
      <div class="footer-container">
        <div class="footer-links">
          <a href="#about" data-tr="Hakkımızda" data-en="About">Hakkımızda</a>
          <a href="#contact" data-tr="İletişim" data-en="Contact">İletişim</a>
          <a href="#privacy" data-tr="Gizlilik Politikası" data-en="Privacy Policy">Gizlilik Politikası</a>
          <a href="#terms" data-tr="Kullanım Koşulları" data-en="Terms of Service">Kullanım Koşulları</a>
        </div>
        <div class="footer-copy">
          <p>&copy; 2024 LearnFinnish. <span data-tr="Tüm hakları saklıdır." data-en="All rights reserved.">Tüm hakları saklıdır.</span></p>
        </div>
      </div>
    `;
    }

    updateLanguage(lang) {
        if (this.currentPage && this.currentPage !== 'home') {
            this.showPage(this.currentPage);
        }
    }
}
