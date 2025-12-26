// Story Display Component
import { hikayeUret } from '../services/api.js';
import { hikayeYaz, kelimeEventiEkle } from '../utils/dom.js';
import { getCurrentLang } from './LanguageSwitcher.js';
import { canGenerateStory, incrementStoryCount } from '../services/usageLimits.js';
import { showUsageLimitModal } from './UsageLimitModal.js';

export function initStoryControls() {
    const button = document.getElementById('uret-hikaye');
    const topicInput = document.getElementById('konu');

    if (!button || !topicInput) return;

    button.addEventListener('click', async () => {
        // Check usage limit before generating
        const canGenerate = await canGenerateStory();
        if (!canGenerate.allowed) {
            showUsageLimitModal('story');
            return;
        }

        const currentLang = getCurrentLang();
        button.disabled = true;
        button.textContent = currentLang === 'tr' ? 'Hikâye üretiliyor...' : 'Generating story...';

        try {
            const topic = topicInput.value.trim();
            const story = await hikayeUret(topic);
            hikayeYaz(story);
            kelimeEventiEkle(currentLang);

            // Scroll to story area after content loads
            setTimeout(() => {
                const storyArea = document.getElementById('hikaye-alani');
                if (storyArea) {
                    storyArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            // Increment usage count on successful generation
            incrementStoryCount();
            updateUsageIndicators();
        } catch (err) {
            alert(currentLang === 'tr' ? 'Hata: ' + err.message : 'Error: ' + err.message);
        }

        button.disabled = false;
        button.textContent = button.dataset[currentLang === 'tr' ? 'tr' : 'en'];
    });
}

// Update usage indicators in the UI
async function updateUsageIndicators() {
    const { getUsageStats } = await import('../services/usageLimits.js');
    const stats = await getUsageStats();

    // Don't show anything for premium users
    if (stats.isPremium) {
        const existingIndicators = document.getElementById('usage-indicators');
        if (existingIndicators) {
            existingIndicators.remove();
        }
        return;
    }

    // Create or get indicators container
    let indicatorsEl = document.getElementById('usage-indicators');

    if (!indicatorsEl) {
        // Create the indicators dynamically for free users
        const controlsDiv = document.querySelector('.controls');
        if (!controlsDiv) return;

        indicatorsEl = document.createElement('div');
        indicatorsEl.id = 'usage-indicators';
        indicatorsEl.className = 'usage-indicators';
        indicatorsEl.innerHTML = `
            <span id="story-usage" data-tr="Hikayeler: " data-en="Stories: ">
                Hikayeler: <strong>0/3</strong>
            </span>
            <span id="flashcard-usage" data-tr="Flashcardlar: " data-en="Flashcards: ">
                Flashcardlar: <strong>0/10</strong>
            </span>
        `;
        controlsDiv.appendChild(indicatorsEl);
    }

    // Update the counts
    const storyUsageEl = document.getElementById('story-usage');
    const flashcardUsageEl = document.getElementById('flashcard-usage');

    if (storyUsageEl) {
        const storyStrong = storyUsageEl.querySelector('strong');
        if (storyStrong) {
            storyStrong.textContent = `${stats.stories.used}/${stats.stories.limit}`;
        }
    }

    if (flashcardUsageEl) {
        const flashcardStrong = flashcardUsageEl.querySelector('strong');
        if (flashcardStrong) {
            flashcardStrong.textContent = `${stats.flashcards.used}/${stats.flashcards.limit}`;
        }
    }
}

// Export for use in main.js
export { updateUsageIndicators };
