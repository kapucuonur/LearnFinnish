// Usage Limits Service for Free Users
import { getFirebase } from '../firebase.js';
import { checkPremiumStatus } from './payment.js';

const USAGE_KEY = 'LearnFinnish_usage';

// Default limits for free users
const FREE_LIMITS = {
    storiesPerDay: 3,
    flashcardsPerDay: 10
};

// Get today's date string (YYYY-MM-DD)
function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Get usage data from localStorage
function getUsageData() {
    const data = localStorage.getItem(USAGE_KEY);
    if (!data) {
        return {
            date: getTodayString(),
            stories: 0,
            flashcards: 0
        };
    }

    const usage = JSON.parse(data);

    // Reset if it's a new day
    if (usage.date !== getTodayString()) {
        return {
            date: getTodayString(),
            stories: 0,
            flashcards: 0
        };
    }

    return usage;
}

// Save usage data to localStorage
function saveUsageData(usage) {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

// Check if user is premium (bypass all limits)
export async function isPremiumUser() {
    try {
        const { auth } = await getFirebase(); // Secure Init
        const user = auth.currentUser;
        if (!user) return false;

        return await checkPremiumStatus(user.uid);
    } catch (error) {
        console.error('Error checking premium status:', error);
        return false;
    }
}

// Check if user can generate a story
export async function canGenerateStory() {
    // Premium users have unlimited access
    if (await isPremiumUser()) {
        return { allowed: true, remaining: Infinity };
    }

    const usage = getUsageData();
    const remaining = FREE_LIMITS.storiesPerDay - usage.stories;

    return {
        allowed: remaining > 0,
        remaining: Math.max(0, remaining),
        limit: FREE_LIMITS.storiesPerDay
    };
}

// Check if user can view flashcards
export async function canViewFlashcards() {
    // Premium users have unlimited access
    if (await isPremiumUser()) {
        return { allowed: true, remaining: Infinity };
    }

    const usage = getUsageData();
    const remaining = FREE_LIMITS.flashcardsPerDay - usage.flashcards;

    return {
        allowed: remaining > 0,
        remaining: Math.max(0, remaining),
        limit: FREE_LIMITS.flashcardsPerDay
    };
}

// Increment story generation count
export function incrementStoryCount() {
    const usage = getUsageData();
    usage.stories += 1;
    saveUsageData(usage);
}

// Increment flashcard view count
export function incrementFlashcardCount() {
    const usage = getUsageData();
    usage.flashcards += 1;
    saveUsageData(usage);
}

// Get current usage stats
export async function getUsageStats() {
    const isPremium = await isPremiumUser();

    if (isPremium) {
        return {
            isPremium: true,
            stories: { used: 0, limit: Infinity, remaining: Infinity },
            flashcards: { used: 0, limit: Infinity, remaining: Infinity }
        };
    }

    const usage = getUsageData();

    return {
        isPremium: false,
        stories: {
            used: usage.stories,
            limit: FREE_LIMITS.storiesPerDay,
            remaining: Math.max(0, FREE_LIMITS.storiesPerDay - usage.stories)
        },
        flashcards: {
            used: usage.flashcards,
            limit: FREE_LIMITS.flashcardsPerDay,
            remaining: Math.max(0, FREE_LIMITS.flashcardsPerDay - usage.flashcards)
        }
    };
}

// Reset usage (for testing purposes)
export function resetUsage() {
    localStorage.removeItem(USAGE_KEY);
}
