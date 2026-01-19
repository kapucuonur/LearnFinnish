// Story Display Component
import { generateStory } from '../services/api.js';
import { writeStory, addWordEvents } from '../utils/dom.js';
import { canGenerateStory, incrementStoryCount } from '../services/usageLimits.js';
import { showUsageLimitModal } from './UsageLimitModal.js';

export function initStoryDisplay() {
    const button = document.getElementById('generate-story');
    const topicInput = document.getElementById('topic');

    if (!button || !topicInput) return;

    button.addEventListener('click', async () => {
        // Check usage limit before generating
        const canGenerate = await canGenerateStory();
        if (!canGenerate.allowed) {
            showUsageLimitModal('story');
            return;
        }

        button.disabled = true;
        button.textContent = 'Generating story...';

        try {
            const topic = topicInput.value.trim();
            const { story, vocabulary } = await generateStory(topic);
            writeStory(story, undefined, vocabulary); // undefined targElem (uses default), vocabulary passed
            addWordEvents('en'); // Force English

            // Scroll to story area after content loads
            setTimeout(() => {
                const storyArea = document.getElementById('story-area');
                if (storyArea) {
                    storyArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            // Increment usage count on successful generation
            incrementStoryCount();
            updateUsageIndicators();

            // Award XP
            const { addXP } = await import('../services/gamification.js');
            addXP(50, 'Story Generated');
        } catch (err) {
            alert('Error: ' + err.message);
        }

        button.disabled = false;
        button.textContent = 'Generate Story';
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
            <span id="story-usage">
                Stories: <strong>0/3</strong>
            </span>
            <span id="flashcard-usage">
                Flashcards: <strong>0/10</strong>
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
// Alias initStoryControls to initStoryDisplay for backward compatibility/cache safety
export const initStoryControls = initStoryDisplay;
export { updateUsageIndicators };
