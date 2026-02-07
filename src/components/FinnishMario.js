import { aiService } from '../services/ai.js';
import { getFirebase } from '../firebase.js'; // Use Secure Async Getter
import { doc, updateDoc, arrayUnion, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function initFinnishMario(topic = "Finnish Vocabulary", difficulty = "B1") {
    console.log(`🍄 initFinnishMario called with topic: ${topic}, difficulty: ${difficulty}`);
    // ... logic remains same ...
    const container = document.getElementById('game-area');
    if (!container) {
        console.error("❌ Game Area container not found!");
        return;
    }

    // Loading State
    container.innerHTML = `<div class="loading-spinner">Mushroom Power-Up! Loading Level... 🍄</div>`;
    console.log("🍄 Loading spinner set.");

    try {
        // Ensure Firebase is ready before starting game flow
        console.log("🍄 Awaiting getFirebase()...");
        await getFirebase();
        console.log("✅ Firebase initialized.");

        // Fetch Data
        console.log("🍄 Fetching game content via aiService...");
        const words = await aiService.generateGameContent(topic, difficulty);
        console.log("✅ Game content received:", words);

        if (!words || words.length === 0) {
            throw new Error("No words generated.");
        }

        // Start Game
        console.log("🍄 Starting FinnishMarioGame instance...");
        new FinnishMarioGame(container, words);
    } catch (e) {
        console.error("❌ initFinnishMario Crash:", e);
        container.innerHTML = `<p style="color:red; text-align:center;">Game Error: ${e.message}</p>`;
    }
}

class FinnishMarioGame {
    constructor(container, words) {
        // ... constructor remains same ...
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

    // ... setup, generateLevel, loop, update, draw, rectIntersect remain same...

    setup() {
        this.container.innerHTML = `
            <div class="game-hud" style="background:#d32f2f;">
                <span>🍄 Finnish Mario</span>
                <span>Score: <span id="mario-score">0</span></span>
            </div>
            <canvas id="game-canvas"></canvas>
            <div id="mario-overlay" class="hidden"></div>
        `;

        this.canvas = document.getElementById('game-canvas');
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

        // Show Translation Overlay instead of Alert
        const overlay = document.getElementById('mario-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div style="background: rgba(0,0,0,0.8); color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
                    <h2 style="margin:0; color: #ffeb3b;">${c.word}</h2>
                    <p style="margin:5px 0 0; font-size: 1.2em;">${c.translation}</p>
                </div>
            `;
            overlay.classList.remove('hidden');
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';

            // Hide after 2 seconds
            setTimeout(() => {
                overlay.classList.add('hidden');
                overlay.style.display = 'none';
            }, 2000);
        }

        this.saveProgress(c.word);
    }

    async saveProgress(word) {
        const { auth, db } = await getFirebase(); // Get Secure Instance
        const user = auth.currentUser;
        if (user && user.uid) {
            try {
                const userRef = doc(db, "users", user.uid);
                // Ensure document exists
                try {
                    await updateDoc(userRef, {
                        totalScore: increment(10),
                        learnedWords: arrayUnion(word)
                    });
                } catch (e) {
                    // Try setting it if update fails
                    await setDoc(userRef, {
                        totalScore: increment(10),
                        learnedWords: arrayUnion(word)
                    }, { merge: true });
                }

                console.log(`Saved word: ${word} to Firebase!`);
            } catch (error) {
                console.error("Firebase Save Error:", error);
            }
        } else {
            console.log("User not logged in, progress not saved.");
        }
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
