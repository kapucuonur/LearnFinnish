
import { generateLevelContent } from '../services/geminiGame.js';

export function initGameSection() {
    window.initGameSection = initGameSection; // Expose for Play Again button
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    // --- State ---
    let gameState = 'SETUP'; // SETUP, LOADING, PLAYING, GAMEOVER
    let gameLoopId = null;
    let canvas, ctx;
    let words = [];
    let player = { x: 50, y: 300, width: 30, height: 30, dy: 0, dx: 0, grounded: false };
    let platforms = [];
    let coins = []; // The words to collect
    let score = 0;

    // --- Render Initial UI ---
    renderSetupUI();

    // Setup Back Button
    const backBtn = document.getElementById('game-back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            stopGame();
            gameArea.classList.add('hidden');
        });
    }

    function renderSetupUI() {
        gameArea.innerHTML = `
            <div class="game-ui-container">
                <div class="game-header">
                    <h2 class="section-title">🇫🇮 Finnish Run & Learn</h2>
                    <p>Collect coins to learn new words!</p>
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
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <button id="start-game-btn" class="btn btn-primary btn-large">Start Adventure</button>
                </div>
            </div>
        `;

        document.getElementById('start-game-btn').addEventListener('click', startGame);
    }

    async function startGame() {
        const topic = document.getElementById('game-topic').value;
        const difficulty = document.getElementById('game-difficulty').value;

        // Show Loading
        gameArea.innerHTML = '<div class="loading-spinner">Creating Level with Gemini AI...</div>';

        // Fetch AI Data
        gameState = 'LOADING';
        words = await generateLevelContent(topic, difficulty);

        // Setup Canvas
        setupGameCanvas(topic);
        gameState = 'PLAYING';
        gameLoop();
    }

    function setupGameCanvas(topic) {
        gameArea.innerHTML = `
            <div class="game-hud">
                <span>Topic: ${topic}</span>
                <span>Score: <span id="game-score">0</span></span>
            </div>
            <canvas id="game-canvas"></canvas>
            <div id="game-overlay" class="hidden"></div>
        `;

        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');

        // Resize canvas
        canvas.width = 800;
        canvas.height = 400;

        // Init Level
        player = { x: 50, y: 300, width: 30, height: 30, dy: 0, dx: 0, grounded: false, speed: 5, jumpPower: -12 };
        score = 0;

        // Generate Platforms & Coins based on words
        generateLevelEntities();

        // Input Handling
        window.addEventListener('keydown', handleInput);
        window.addEventListener('keyup', stopInput);
    }

    function generateLevelEntities() {
        // Floor
        platforms = [{ x: 0, y: 380, width: 20000, height: 20 }];

        // Random platforms for words
        coins = [];
        let currentX = 300;

        words.forEach((w) => {
            const platY = 250 + Math.random() * 50;
            const platW = 150;

            platforms.push({ x: currentX, y: platY, width: platW, height: 20 });

            // Place Coin above platform
            coins.push({
                x: currentX + 50,
                y: platY - 40,
                width: 30,
                height: 30,
                word: w.word,
                translation: w.translation,
                collected: false
            });

            // Gap between platforms
            currentX += 250 + Math.random() * 100;
        });

        // Add Finish Line
        platforms.push({ x: currentX, y: 200, width: 200, height: 20, isFinish: true });
    }

    // --- Game Logic ---
    let keys = {};

    function handleInput(e) { keys[e.code] = true; }
    function stopInput(e) { keys[e.code] = false; }

    function update() {
        if (gameState !== 'PLAYING') return;

        // Physics
        player.dy += 0.8; // Gravity
        player.y += player.dy;

        // Movement
        if (keys['ArrowRight']) player.x += player.speed;
        if (keys['ArrowLeft']) player.x -= player.speed;
        if (keys['Space'] || keys['ArrowUp']) {
            if (player.grounded) {
                player.dy = player.jumpPower;
                player.grounded = false;
            }
        }

        // Camera Follow (simple scroll)
        // If player moves past center, shift everything left? 
        // Or simpler: Let player move right, camera "scroll" is just offset
        // Implementation: We keep player centered-ish
        let cameraOffset = player.x - 200;
        if (cameraOffset < 0) cameraOffset = 0;

        // Collisions
        player.grounded = false;

        platforms.forEach(p => {
            // Simple AABB
            if (player.x < p.x + p.width &&
                player.x + player.width > p.x &&
                player.y < p.y + p.height &&
                player.y + player.height > p.y) {

                // Hit from top
                if (player.dy > 0 && player.y + player.height - player.dy <= p.y) {
                    player.grounded = true;
                    player.dy = 0;
                    player.y = p.y - player.height;
                }

                if (p.isFinish) {
                    endGame(true);
                }
            }
        });

        if (player.y > canvas.height + 100) {
            // Fell off
            player.x = 50;
            player.y = 300;
            player.dy = 0;
        }

        // Coins
        coins.forEach(c => {
            if (!c.collected &&
                player.x < c.x + c.width &&
                player.x + player.width > c.x &&
                player.y < c.y + c.height &&
                player.y + player.height > c.y) {

                c.collected = true;
                score += 10;
                document.getElementById('game-score').textContent = score;
                showTranslation(c);
            }
        });

        return cameraOffset;
    }

    function showTranslation(coin) {
        const overlay = document.getElementById('game-overlay');
        overlay.innerHTML = `
            <div class="word-toast">
                <div class="finnish">${coin.word}</div>
                <div class="english">${coin.translation}</div>
            </div>
        `;
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('hidden'), 2000);
    }

    function draw(cameraOffset) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(-cameraOffset, 0);

        // Draw Player
        ctx.fillStyle = '#ff4444'; // Red Box
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw Platforms
        ctx.fillStyle = '#4488ff';
        platforms.forEach(p => {
            if (p.isFinish) ctx.fillStyle = '#22cc22';
            else ctx.fillStyle = '#4488ff';
            ctx.fillRect(p.x, p.y, p.width, p.height);
        });

        // Draw Coins
        ctx.fillStyle = '#ffd700';
        coins.forEach(c => {
            if (!c.collected) {
                ctx.beginPath();
                ctx.arc(c.x + 15, c.y + 15, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.font = '10px Arial';
                ctx.fillText('?', c.x + 12, c.y + 19);
                ctx.fillStyle = '#ffd700'; // reset for next
            }
        });

        ctx.restore();
    }

    function gameLoop() {
        if (gameState !== 'PLAYING') return;
        const offset = update();
        draw(offset);
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function endGame(victory) {
        gameState = 'GAMEOVER';
        gameArea.innerHTML = `
            <div class="game-result">
                <h2>${victory ? 'Level Complete!' : 'Game Over'}</h2>
                <p>Final Score: ${score}</p>
                <button class="btn btn-primary" onclick="initGameSection()">Play Again</button>
            </div>
        `;
    }

    function stopGame() {
        gameState = 'STOPPED';
        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        window.removeEventListener('keydown', handleInput);
        window.removeEventListener('keyup', stopInput);
    }
}
