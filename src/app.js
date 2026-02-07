// Main Application Entry Point - v5.0 (Renamed to app.js)
// import { initLanguageSwitcher } from './components/LanguageSwitcher.js'; // Removed
import { initAuthSection } from './components/AuthSection.js';
import { initPremiumCard } from './components/PremiumCard.js';
import { initStoryDisplay, updateUsageIndicators } from './components/StoryDisplay.js';
import { initWordNotebook, initNotebookClear } from './components/WordNotebook.js';
import { initPhrasesSection } from './components/PhrasesSection.js';
import { initVocabularySection } from './components/VocabularySection.js';
import { initPWAInstall } from './components/PWAInstall.js';
import { initUsageLimitModal } from './components/UsageLimitModal.js';
import { initThemeToggle } from './components/ThemeToggle.js';
import { initChatbot } from './components/Chatbot.js';
import { initPuzzleSection } from './components/PuzzleSection.js';
import { initGameSection } from './components/GameSection.js';
import { initializeStripe, handlePaymentCallback } from './services/payment.js';
import { updateWordCount } from './services/storage.js';
import { STRIPE_PUBLISHABLE_KEY } from './config/constants.js';
import { Router } from './router.js';
import './utils/premium-ads-ios.js';

// Initialize application when DOM is ready
// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 App.js: DOMContentLoaded");
    // alert("DEBUG: App.js Starting..."); // Uncomment if needed, but console first

    try {
        // 1. Initialize all components
        console.log("Init: ThemeToggle");
        initThemeToggle();

        console.log("Init: AuthSection");
        initAuthSection();

        console.log("Init: PremiumCard");
        initPremiumCard();

        console.log("Init: StoryDisplay");
        initStoryDisplay();

        console.log("Init: WordNotebook");
        initWordNotebook();

        console.log("Init: PhrasesSection");
        initPhrasesSection();

        console.log("Init: VocabularySection");
        initVocabularySection();

        console.log("Init: NotebookClear");
        initNotebookClear();

        console.log("Init: PWAInstall");
        initPWAInstall();

        console.log("Init: UsageLimitModal");
        initUsageLimitModal();

        console.log("Init: Chatbot");
        initChatbot();

        console.log("Init: PuzzleSection");
        initPuzzleSection();

        console.log("Init: GameSection (Run & Learn)");
        initGameSection();
        console.log("✅ GameSection Initialized Call Complete");

    } catch (error) {
        console.error("❌ CRITICAL INITIALIZATION ERROR:", error);
        alert(`CRITICAL APP ERROR: ${error.message}`);
    }

    // 2. Setup Navigation
    setupNavigation();

    // 3. Initialize router for legal pages
    const router = new Router();

    // 4. Initialize Stripe
    initializeStripe(STRIPE_PUBLISHABLE_KEY);

    // 5. Handle payment callback
    handlePaymentCallback('en');

    // 6. Update generic UI states
    updateWordCount();
    await updateUsageIndicators();

    // 7. Initialize Gamification UI
    const { getGamificationStats } = await import('./services/gamification.js');
    const { initDailyQuiz } = await import('./components/DailyQuiz.js');

    initDailyQuiz();

    function updateGamificationUI() {
        const stats = getGamificationStats();
        const display = document.getElementById('xp-display');
        const levelEl = document.getElementById('user-level');
        const barEl = document.getElementById('xp-progress-bar');

        if (display && levelEl && barEl) {
            display.classList.remove('hidden');
            levelEl.textContent = stats.level;
            barEl.style.width = `${stats.progress}%`;
            display.title = `${stats.xp} XP (Next Level: ${stats.nextLevelXP} XP)`;
        }
    }

    // Initial update
    updateGamificationUI();

    // Listen for updates
    window.addEventListener('gamification-update', () => {
        updateGamificationUI();
    });

    console.log('✅ LearnFinnish initialized successfully!');
});

// Import helper functions
import { renderWordList } from './services/storage.js';
import { loadFlashcards } from './components/WordNotebook.js';

function setupNavigation() {
    console.log('Setup Navigation');
    // Navigation Logic
    const navButtons = [
        { id: 'btn-vocab', area: 'vocabulary-area' },
        { id: 'btn-phrases', area: 'phrases-area' },
        { id: 'btn-video', area: 'premium-area' },
        { id: 'btn-samples', area: 'sample-stories-area' },
        { id: 'btn-notebook', area: 'notebook-area' },
        { id: 'btn-notebook', area: 'notebook-area' },
        { id: 'btn-flashcards', area: 'flashcard-alani' },
        { id: 'btn-puzzle', area: 'puzzle-area' },
        { id: 'btn-game', area: 'game-area' } // New Game Button
    ];

    // All area IDs that should be exclusive
    const allAreas = [...navButtons.map(n => n.area), 'story-area', 'notebook-area'];

    navButtons.forEach(btnInfo => {
        const btn = document.getElementById(btnInfo.id);
        if (!btn) return;

        btn.addEventListener('click', () => {
            // 1. Reset all buttons
            document.querySelectorAll('.nav-card-btn').forEach(b => b.classList.remove('active'));
            // 2. Activate clicked
            btn.classList.add('active');

            // 3. Hide all areas first
            allAreas.forEach(areaId => {
                const el = document.getElementById(areaId);
                if (el) el.classList.add('hidden');
            });

            // 4. Show target area
            const target = document.getElementById(btnInfo.area);
            if (target) target.classList.remove('hidden');

            // 5. Reset specific views if needed
            if (btnInfo.id === 'btn-vocab' && window.resetVocabularyView) {
                window.resetVocabularyView();
            }
            if (btnInfo.id === 'btn-phrases' && window.resetPhrasesView) {
                // If Phrases component exposes a reset, call it. 
                // Currently it doesn't, but Categories is default view. 
                // We might need to manually reset the phrases view in PhrasesSection.js if user navigates away.
                // For now, hiding/showing usually preserves state, which is fine.
            }
            if (btnInfo.id === 'btn-notebook') {
                // Refresh notebook list
                renderWordList();
            }
            if (btnInfo.id === 'btn-flashcards') {
                // Initialize flashcards with fresh shuffle
                loadFlashcards();
            }
        });
    });

    // Handle "Generate Story" click -> Show Story Area
    const genBtn = document.getElementById('generate-story');
    if (genBtn) {
        genBtn.addEventListener('click', () => {
            // Deactivate Grid buttons
            document.querySelectorAll('.nav-card-btn').forEach(b => b.classList.remove('active'));

            // Hide all grid areas
            allAreas.forEach(areaId => {
                const el = document.getElementById(areaId);
                if (el) el.classList.add('hidden');
            });

            // Show Story Area
            const storyArea = document.getElementById('story-area');
            if (storyArea) {
                storyArea.classList.remove('hidden');
                // Scroll to story area for desktop
                storyArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // --- MOBILE UI LOGIC ---

    // 1. FAB Open Modal
    const fabBtn = document.getElementById('mobile-generate-fab');
    const mobileModal = document.getElementById('mobile-story-modal');
    if (fabBtn && mobileModal) {
        fabBtn.addEventListener('click', () => {
            mobileModal.classList.remove('hidden');
        });
    }

    // 2. Close Modal Button
    const closeModalBtn = document.getElementById('close-mobile-modal');
    if (closeModalBtn && mobileModal) {
        closeModalBtn.addEventListener('click', () => {
            mobileModal.classList.add('hidden');
        });
    }

    // 3. Logo Reset Logic
    const appLogo = document.querySelector('.app-logo');
    if (appLogo) {
        appLogo.style.cursor = 'pointer';
        appLogo.addEventListener('click', () => {
            // Reset active states
            document.querySelectorAll('.nav-card-btn').forEach(b => b.classList.remove('active'));

            // Hide all content areas
            allAreas.forEach(areaId => {
                const el = document.getElementById(areaId);
                if (el) el.classList.add('hidden');
            });

            // Hide Story Area too
            const storyArea = document.getElementById('story-area');
            if (storyArea) storyArea.classList.add('hidden');

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Mobile Menu Toggle Logic
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const headerMenu = document.getElementById('header-menu');

    if (mobileMenuToggle && headerMenu) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately
            headerMenu.classList.toggle('menu-open');

            // Toggle hamburger animation
            const isExpanded = headerMenu.classList.contains('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (headerMenu.classList.contains('menu-open') &&
                !headerMenu.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                headerMenu.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking a link inside
        headerMenu.querySelectorAll('a, button').forEach(link => {
            link.addEventListener('click', () => {
                headerMenu.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}
