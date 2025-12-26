// Sample Stories Loader
// Loads and displays sample stories on the main page

import sampleStories from './data/sampleStories.js';
import { kelimeyiCevir } from './services/api.js';

// Initialize sample stories display
function initSampleStories() {
    const grid = document.getElementById('sample-stories-grid');
    if (!grid) return;

    // Get current language
    const currentLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'tr';

    // Create story cards
    sampleStories.forEach(story => {
        const card = createStoryCard(story, currentLang);
        grid.appendChild(card);
    });
}

// Create a story card element
function createStoryCard(story, lang) {
    const card = document.createElement('div');
    card.className = 'sample-story-card';
    card.dataset.storyId = story.id;

    // Get word count
    const wordCount = story.story.split(/\s+/).length;

    // Get preview text (first 100 characters)
    const preview = story.story.substring(0, 100) + '...';

    card.innerHTML = `
    <div class="story-card-header">
      <h3 class="story-card-title">${story.title}</h3>
      <span class="story-level-badge">${story.level}</span>
    </div>
    <div class="story-card-body">
    <p class="story-card-category">${lang === 'tr' ? story.category : story.categoryEn}</p>
      <p class="story-card-preview">${preview}</p>
      <div class="story-card-meta">
        <span class="story-word-count">📖 ~${wordCount} ${lang === 'tr' ? 'kelime' : 'words'}</span>
      </div>
    </div>
    <button class="story-card-button" data-tr="Hikayeyi Oku" data-en="Read Story">
      ${lang === 'tr' ? 'Hikayeyi Oku' : 'Read Story'} →
    </button>
  `;

    // Add click handler
    card.querySelector('.story-card-button').addEventListener('click', () => {
        loadSampleStory(story);
    });

    return card;
}

// Load a sample story into the story viewer
function loadSampleStory(story) {
    // Get current language
    const lang = document.querySelector('.lang-btn.active')?.dataset.lang || 'tr';

    // Switch to story tab
    const storyTab = document.getElementById('tab-hikaye');
    if (storyTab) {
        storyTab.click();
    }

    // Get the story area
    const storyArea = document.getElementById('hikaye-alani');
    if (!storyArea) return;

    // Clear existing content
    storyArea.innerHTML = '';

    // Create story header
    const header = document.createElement('div');
    header.className = 'story-header';
    header.innerHTML = `
    <h2>${story.title}</h2>
    <div class="story-meta">
      <span class="story-level">${story.level}</span>
      <span class="story-category">${lang === 'tr' ? story.category : story.categoryEn}</span>
    </div>
  `;
    storyArea.appendChild(header);

    // Split story into sentences
    const sentences = story.story.split(/(?<=[.!?])\s+/);

    // Create story content
    const content = document.createElement('div');
    content.className = 'story-content';

    sentences.forEach((sentence, index) => {
        const p = document.createElement('p');
        p.className = 'story-sentence';

        // Split sentence into words
        const words = sentence.split(/\s+/);

        words.forEach((word, wordIndex) => {
            const span = document.createElement('span');
            span.className = 'story-word';
            span.textContent = word;
            span.dataset.word = word.replace(/[.,!?;:"']/g, '').toLowerCase();

            // Add click handler for translation
            span.addEventListener('click', async function () {
                if (this.classList.contains('translated')) {
                    this.classList.remove('translated');
                    this.removeAttribute('data-translation');
                    return;
                }

                // Call translation API
                const cleanWord = this.dataset.word;
                const currentLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'tr';

                try {
                    // Use existing Google Translate API
                    const translation = await kelimeyiCevir(cleanWord, currentLang, sentence);
                    this.dataset.translation = translation;
                    this.classList.add('translated');
                } catch (error) {
                    console.error('Translation error:', error);
                }
            });

            p.appendChild(span);
            if (wordIndex < words.length - 1) {
                p.appendChild(document.createTextNode(' '));
            }
        });

        content.appendChild(p);
    });

    storyArea.appendChild(content);

    // Scroll to story area smoothly after content loads
    setTimeout(() => {
        storyArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSampleStories);
} else {
    initSampleStories();
}

// Re-initialize when language changes
document.addEventListener('languageChanged', () => {
    const grid = document.getElementById('sample-stories-grid');
    if (grid) {
        grid.innerHTML = '';
        initSampleStories();
    }
});

export { loadSampleStory };
