// Gamification Service
const STORAGE_KEY = 'LearnFinnish_gamification';

// Default state
const defaultState = {
    xp: 0,
    level: 1,
    lastActionDate: null,
    streak: 0,
    history: [] // Log of recent XP gains
};

// Get current state
function getState() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultState;
}

// Save state
function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Trigger event for UI updates
    window.dispatchEvent(new CustomEvent('gamification-update', { detail: state }));
}

// Calculate level based on XP
// Level 1: 0-99 XP
// Level 2: 100-399 XP
// Level 3: 400-899 XP
// Formula: Level = Math.floor(Math.sqrt(XP / 100)) + 1
export function calculateLevel(xp) {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Calculate progress to next level (0-100%)
export function getLevelProgress(xp) {
    const currentLevel = calculateLevel(xp);
    const nextLevel = currentLevel + 1;

    // XP needed for current level start
    const currentLevelBaseXP = Math.pow(currentLevel - 1, 2) * 100;

    // XP needed for next level
    const nextLevelBaseXP = Math.pow(nextLevel - 1, 2) * 100;

    const neededForLevel = nextLevelBaseXP - currentLevelBaseXP;
    const currentProgress = xp - currentLevelBaseXP;

    return Math.min(100, Math.floor((currentProgress / neededForLevel) * 100));
}

// Add XP
export function addXP(amount, reason) {
    const state = getState();
    const oldLevel = calculateLevel(state.xp);

    state.xp += amount;
    const newLevel = calculateLevel(state.xp);

    // Update streak if first action of the day
    const today = new Date().toISOString().split('T')[0];
    if (state.lastActionDate !== today) {
        // If yesterday was the last action, increment streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (state.lastActionDate === yesterdayStr) {
            state.streak += 1;
        } else if (state.lastActionDate !== today) {
            // Streak broken (unless it's the very first time)
            state.streak = 1;
        }
        state.lastActionDate = today;
    }

    // Add to history (keep last 10)
    state.history.unshift({
        amount,
        reason,
        timestamp: new Date().toISOString()
    });
    if (state.history.length > 10) state.history.pop();

    saveState(state);

    // Show notification
    showXPNotification(amount, reason);

    // Level up check
    if (newLevel > oldLevel) {
        showLevelUpNotification(newLevel);
    }

    return state;
}

// Get user stats
export function getGamificationStats() {
    const state = getState();
    return {
        xp: state.xp,
        level: calculateLevel(state.xp),
        progress: getLevelProgress(state.xp),
        streak: state.streak,
        nextLevelXP: Math.pow(calculateLevel(state.xp), 2) * 100
    };
}

// UI Notification Helpers
function showXPNotification(amount, reason) {
    const notif = document.createElement('div');
    notif.className = 'xp-toast';
    notif.innerHTML = `
        <span class="xp-amount">+${amount} XP</span>
        <span class="xp-reason">${reason}</span>
    `;
    document.body.appendChild(notif);

    // Remove after animation
    setTimeout(() => notif.remove(), 2000);
}

function showLevelUpNotification(level) {
    // Simple alert for now, can be a nice modal later
    const modal = document.createElement('div');
    modal.className = 'level-up-modal';
    modal.innerHTML = `
        <div class="level-up-content">
            <div class="level-up-icon">🎉</div>
            <h2>Level Up!</h2>
            <p>You reached Level ${level}</p>
            <button onclick="this.parentElement.parentElement.remove()">Continue</button>
        </div>
    `;
    document.body.appendChild(modal);
}
