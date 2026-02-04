
import { aiService } from '../services/ai.js';
// Assuming a storage service exists, or we mock it
import { db } from '../services/firebase.js'; // Placeholder import if using raw firebase
// Note: In this vanilla app structure, we might need a specific storage helper.
// For now, I will implement saveScore directly or via a mock helper if db isn't exposed globally.

export async function initFinnishMario() {
    const container = document.getElementById('game-area');
    if (!container) return;

    // Loading State
    container.innerHTML = `<div class="loading-spinner">Mushroom Power-Up! Loading Level... 🍄</div>`;

    // Fetch Data
    const words = await aiService.generateGameContent("Finnish Vocabulary", "B1");

    // Start Game
    new FinnishMarioGame(container, words);
}

class FinnishMarioGame {
    constructor(container, words) {
        this.container = container;
        this.words = words;
        this.score = 0;
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;

        // Entities
        this.player = { x: 50, y: 300, w: 40, h: 40, dx: 0, dy: 0, grounded: false, speed: 5 };
        this.coins = [];

        this.setup();
    }

    setup() {
        this.container.innerHTML = `
            <div class="game-hud" style="background:#d32f2f;">
                <span>🍄 Finnish Mario</span>
                <span>Score: <span id="mario-score">0</span></span>
            </div>
            <canvas id="mario-canvas"></canvas>
            <div id="mario-overlay" class="hidden"></div>
        `;

        this.canvas = document.getElementById('mario-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;

        // Create platforms/coins
        this.generateLevel();

        // Inputs
        this.keys = {};
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);

        // Start
        this.gameLoop = requestAnimationFrame(this.loop.bind(this));
    }

    generateLevel() {
        // Floor
        this.platforms = [{ x: 0, y: 350, w: 2000, h: 50 }];

        // Distribute words as "Gold Circles"
        let currentX = 200;
        this.words.forEach(wordData => {
            const y = 200 + Math.random() * 100;
            this.coins.push({
                x: currentX, y: y, r: 20,
                word: wordData.word,
                translation: wordData.translation,
                collected: false
            });

            // Add a platform near it
            this.platforms.push({ x: currentX - 50, y: y + 80, w: 100, h: 20 });

            currentX += 300;
        });

        // Flag
        this.flag = { x: currentX, y: 300, w: 20, h: 50 };
    }

    loop() {
        this.update();
        this.draw();
        this.gameLoop = requestAnimationFrame(this.loop.bind(this));
    }

    update() {
        // Simple Physics
        this.player.dy += 0.8;
        this.player.y += this.player.dy;

        if (this.keys['ArrowRight']) this.player.x += this.player.speed;
        if (this.keys['ArrowLeft']) this.player.x -= this.player.speed;
        if ((this.keys['Space'] || this.keys['ArrowUp']) && this.player.grounded) {
            this.player.dy = -15;
            this.player.grounded = false;
        }

        // Camera
        let offset = this.player.x - 200;
        if (offset < 0) offset = 0;
        this.offset = offset;

        // Collision: Platforms
        this.player.grounded = false;
        this.platforms.forEach(p => {
            if (this.rectIntersect(this.player.x, this.player.y, this.player.w, this.player.h, p.x, p.y, p.w, p.h)) {
                if (this.player.dy > 0 && this.player.y + this.player.h - this.player.dy <= p.y) {
                    this.player.grounded = true;
                    this.player.dy = 0;
                    this.player.y = p.y - this.player.h;
                }
            }
        });

        // Floor limit
        if (this.player.y > 400) { this.player.x = 50; this.player.y = 300; this.player.dy = 0; }

        // Coins
        this.coins.forEach(c => {
            if (!c.collected) {
                // Circle collision approximation
                const dist = Math.hypot((this.player.x + 20) - c.x, (this.player.y + 20) - c.y);
                if (dist < 20 + 20) {
                    c.collected = true;
                    this.collectCoin(c);
                }
            }
        });
    }

    collectCoin(c) {
        this.score += 100;
        document.getElementById('mario-score').textContent = this.score;
        alert(`Translation: ${c.translation}`); // As requested in "Collision -> Show alert"
        this.saveProgress(c.word);
    }

    saveProgress(word) {
        // Saving learned word to Firestore (mock or real if firebase is exposed)
        console.log(`Saving learned word: ${word}`);
        // Implementation note: In this setup, we'd typically call a service/api
        // e.g. await db.collection('users').doc(userId).collection('learned').add({ word, date: new Date() });
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(-this.offset, 0);

        // Player (Red Box)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);

        // Platforms
        ctx.fillStyle = '#8B4513'; // Bricks
        this.platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

        // Coins (Gold Circles)
        ctx.fillStyle = 'gold';
        this.coins.forEach(c => {
            if (!c.collected) {
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.fillText(c.word, c.x - 20, c.y + 30); // Show word
            }
        });

        // Flag
        ctx.fillStyle = 'green';
        ctx.fillRect(this.flag.x, this.flag.y, this.flag.w, this.flag.h);

        ctx.restore();
    }

    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
    }
}
