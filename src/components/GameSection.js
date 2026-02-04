
import { initFinnishMario } from './FinnishMario.js';

export function initGameSection() {
    window.initGameSection = initGameSection; // Expose for Play Again button
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    // --- Render Initial UI ---
    renderSetupUI();

    function renderSetupUI() {
        gameArea.innerHTML = `
            <div class="game-ui-container">
                <div class="game-header">
                    <h2 class="section-title">🇫🇮 Finnish Mario (Run & Learn)</h2>
                    <p>Collect Gold Words! 🍄</p>
                </div>
                <div class="game-setup-form">
                    <div class="form-group">
                        <label>Topic</label>
                        <select id="game-topic">
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Animals">Animals</option>
                            <option value="Work">Work</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Difficulty</label>
                        <select id="game-difficulty">
                            <option value="A1">Beginner (A1)</option>
                            <option value="A2">Elementary (A2)</option>
                            <option value="B1">Intermediate (B1)</option>
                        </select>
                    </div>
                    <button id="start-game-btn" class="btn btn-primary btn-large">Start Adventure 🚀</button>
                    <p style="margin-top:10px; font-size:0.9em; opacity:0.7;">Powered by Google Gemini AI</p>
                </div>
            </div>
        `;

        document.getElementById('start-game-btn').addEventListener('click', startGame);
    }

    async function startGame() {
        const topic = document.getElementById('game-topic').value;
        const difficulty = document.getElementById('game-difficulty').value;

        // Launch FinnishMario Engine
        await initFinnishMario(topic, difficulty);
    }
}
