// Internationalization (i18n) Utilities

import { LANGUAGES } from '../config/constants.js';

// Always default to English
const currentLanguage = LANGUAGES.EN;

// Update all translatable elements on the page (No-op for English-only site)
export function updateTranslations(lang = currentLanguage) {
    // Logic removed as the site is now English-only
    // We can keep this empty function to avoid breaking other imports that might call it
    // console.log('Site is English-only. Translations update skipped.');
}

// Get current language
export function getCurrentLanguage() {
    return currentLanguage;
}

// Set current language (No-op)
export function setCurrentLanguage(lang) {
    // console.log('Language switching is disabled. Current language:', currentLanguage);
}

// Get translated text - Always return English
export function t(trText, enText) {
    return enText;
}
