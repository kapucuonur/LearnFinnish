
import { initFinnishMario } from './FinnishMario.js';

export function initGameSection() {
    console.log("🔄 initGameSection: Initializing...");

    window.initGameSection = initGameSection; // Expose for Play Again button
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    // --- Render Initial UI (Now Static) ---
    console.log("GameSection: Initializing Event Listeners...");

    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        // Remove old listeners (if function is accessible, otherwise cloning is safer but can break references)
        // Using a fresh clone to ensure clean state
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);

        newBtn.addEventListener('click', () => {
            console.log("🚀 Start Button Clicked!");
            startGame();
        });
    } else {
        console.error("GameSection: Start Button not found!");
    }

    async function startGame() {
        const topic = document.getElementById('game-topic').value;
        const difficulty = document.getElementById('game-difficulty').value;
        console.log(`🎮 Starting Game: ${topic} (${difficulty})`);

        // Launch FinnishMario Engine
        try {
            await initFinnishMario(topic, difficulty);
        } catch (error) {
            console.error("Error starting game:", error);
            alert("Game failed to start. Please try refreshing the page.");
        }
    }
}
