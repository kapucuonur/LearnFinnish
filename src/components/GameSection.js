
import { initFinnishMario } from './FinnishMario.js';

export function initGameSection() {
    window.initGameSection = initGameSection; // Expose for Play Again button
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    // --- Render Initial UI (Now Static) ---
    console.log("GameSection: Initializing Event Listeners...");

    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        // Remove old listeners to prevent duplicates if re-run
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        newBtn.addEventListener('click', startGame);
        console.log("GameSection: Event Listener Attached.");
    } else {
        console.error("GameSection: Start Button not found!");
    }

    async function startGame() {
        const topic = document.getElementById('game-topic').value;
        const difficulty = document.getElementById('game-difficulty').value;

        // Launch FinnishMario Engine
        await initFinnishMario(topic, difficulty);
    }
}
