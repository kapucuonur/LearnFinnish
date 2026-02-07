
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
        console.log("✅ GameSection: Start button found.");
        // Remove old listeners (if function is accessible, otherwise cloning is safer but can break references)
        // Using a fresh clone to ensure clean state
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);

        newBtn.addEventListener('click', () => {
            console.log("🚀 Start Button Clicked!");
            alert("🚀 Button CLICKED! Attempting to start game..."); // Visible feedback
            startGame();
        });
        console.log("GameSection: Event Listener Attached.");
    } else {
        console.error("❌ GameSection: Start Button NOT found!");
        alert("CRITICAL ERROR: 'Start Adventure' button missing from page!"); // Visible feedback
    }

    async function startGame() {
        console.log("👉 startGame() function called");
        const topic = document.getElementById('game-topic').value;
        const difficulty = document.getElementById('game-difficulty').value;
        console.log(`🎮 Starting Game with Topic: ${topic}, Difficulty: ${difficulty}`);

        // Launch FinnishMario Engine
        try {
            console.log("Calling initFinnishMario...");
            await initFinnishMario(topic, difficulty);
            console.log("✅ initFinnishMario returned.");
        } catch (error) {
            console.error("❌ Error during initFinnishMario:", error);
            alert("Game failed to start. See console for details.");
        }
    }
}
