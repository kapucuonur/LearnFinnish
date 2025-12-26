// Internationalization (i18n) Utilities

import { LANGUAGES } from '../config/constants.js';

let currentLanguage = LANGUAGES.TR;

// Update all translatable elements on the page
export function updateTranslations(lang = currentLanguage) {
    currentLanguage = lang;

    // Update title
    const titleEl = document.querySelector('title');
    if (titleEl) {
        titleEl.textContent = titleEl.dataset[lang] || titleEl.textContent;
    }

    // Update all elements with data-tr and data-en attributes
    document.querySelectorAll('[data-tr]').forEach(el => {
        const key = lang === LANGUAGES.TR ? 'tr' : 'en';
        if (el.dataset[key]) {
            el.textContent = el.dataset[key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-tr]').forEach(el => {
        const key = lang === LANGUAGES.TR ? 'placeholderTr' : 'placeholderEn';
        if (el.dataset[key]) {
            el.placeholder = el.dataset[key];
        }
    });

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update blog link with language parameter - use more flexible selector
    const blogLink = document.querySelector('a[href^="/blog"]');
    console.log('Updating blog link:', blogLink, 'to language:', lang);
    if (blogLink) {
        // Remove any existing query parameters and add new lang parameter
        const baseUrl = blogLink.href.split('?')[0];
        blogLink.href = `${baseUrl}?lang=${lang}`;
        console.log('Blog link updated to:', blogLink.href);
    } else {
        console.warn('Blog link not found!');
    }

    // Save language preference to localStorage for blog page
    localStorage.setItem('selectedLanguage', lang);
}

// Get current language
export function getCurrentLanguage() {
    return currentLanguage;
}

// Set current language
export function setCurrentLanguage(lang) {
    if (lang === LANGUAGES.TR || lang === LANGUAGES.EN) {
        currentLanguage = lang;
        document.documentElement.lang = lang; // Update HTML lang attribute for chatbot
        updateTranslations(lang);
    }
}

// Get translated text
export function t(trText, enText) {
    return currentLanguage === LANGUAGES.TR ? trText : enText;
}
