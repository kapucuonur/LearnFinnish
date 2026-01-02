// Sample Stories Loader
// Loads and displays sample stories on the main page

import { sampleStories } from './data/sampleStories.js';
import { writeStory, addWordEvents } from './utils/dom.js';

// Initialize sample stories display
function initSampleStories() {
  const grid = document.getElementById('sample-stories-grid');
  if (!grid) return;

  // Create story cards
  sampleStories.forEach(story => {
    const card = createStoryCard(story);
    grid.appendChild(card);
  });
}

// Create a story card element
function createStoryCard(story) {
  const card = document.createElement('div');
  card.className = 'sample-story-card';
  card.dataset.storyId = story.id;

  // Get word count
  const wordCount = story.story.split(/\s+/).length;

  // Get preview text (first 100 characters)
  const preview = story.story.substring(0, 100) + '...';

  // Use English category or fallback
  const category = story.categoryEn || story.category;

  card.innerHTML = `
    <div class="story-card-header">
      <h3 class="story-card-title">${story.title}</h3>
      <span class="story-level-badge">${story.level}</span>
    </div>
    <div class="story-card-body">
    <p class="story-card-category">${category}</p>
      <p class="story-card-preview">${preview}</p>
      <div class="story-card-meta">
        <span class="story-word-count">📖 ~${wordCount} words</span>
      </div>
    </div>
    <button class="story-card-button">
      Read Story →
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
  // Switch to story tab
  const storyTab = document.getElementById('tab-story');
  if (!storyTab) {
    console.error('Story tab not found');
    return;
  }
  storyTab.click();

  // Get the story area
  const storyArea = document.getElementById('story-area');
  if (!storyArea) return;

  // Clear existing content
  storyArea.innerHTML = '';

  const category = story.categoryEn || story.category;

  // Create story header
  const header = document.createElement('div');
  header.className = 'story-header';
  header.innerHTML = `
    <h2>${story.title}</h2>
    <div class="story-meta">
      <span class="story-level">${story.level}</span>
      <span class="story-category">${category}</span>
    </div>
  `;
  storyArea.appendChild(header);

  // Create container for text
  const contentDiv = document.createElement('div');
  contentDiv.className = 'story-content';
  storyArea.appendChild(contentDiv);

  // Use shared DOM logic to render text with context-aware click events
  writeStory(story.story, contentDiv);
  addWordEvents('en');

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

// Re-initialize (kept for compatibility, though not needed for language switch anymore)
document.addEventListener('languageChanged', () => {
  const grid = document.getElementById('sample-stories-grid');
  if (grid) {
    grid.innerHTML = '';
    initSampleStories();
  }
});

export { loadSampleStory };
