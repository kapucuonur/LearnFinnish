// Daily Quiz Component
import { getWords } from '../services/storage.js';
import { addXP } from '../services/gamification.js';

export function initDailyQuiz() {
    // We'll expose a global function to start the quiz for now, or attach to a button
    window.startDailyQuiz = startDailyQuiz;

    // Check if there's a quiz button (we'll add one to index.html later)
    const quizBtn = document.getElementById('start-quiz-btn');
    if (quizBtn) {
        quizBtn.addEventListener('click', startDailyQuiz);
    }
}

function startDailyQuiz() {
    const words = getWords();

    if (words.length < 5) {
        alert('You need at least 5 words in your notebook to start a quiz!');
        return;
    }

    // Select 5 random words
    const quizWords = [...words]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

    let currentQuestion = 0;
    let score = 0;

    // Create Modal
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.innerHTML = `
        <div class="quiz-content">
            <div class="quiz-header">
                <h2>Daily Quiz</h2>
                <button class="close-quiz">×</button>
            </div>
            <div id="quiz-body"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-quiz');
    closeBtn.onclick = () => modal.remove();

    function showQuestion() {
        if (currentQuestion >= quizWords.length) {
            showResults();
            return;
        }

        const word = quizWords[currentQuestion];
        const correctAnswer = word.translation;

        // Generate options (1 correct + 3 wrong)
        const wrongOptions = words
            .filter(w => w.translation !== correctAnswer)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => w.translation);

        const options = [...wrongOptions, correctAnswer].sort(() => 0.5 - Math.random());

        const body = document.getElementById('quiz-body');
        body.innerHTML = `
            <div class="progress-indicator">Question ${currentQuestion + 1}/${quizWords.length}</div>
            <div class="question-word">${word.word}</div>
            <div class="options-grid">
                ${options.map(opt => `<button class="option-btn">${opt}</button>`).join('')}
            </div>
        `;

        // Handle clicks
        body.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                    score++;
                } else {
                    btn.classList.add('wrong');
                    // Highlight correct
                    body.querySelectorAll('.option-btn').forEach(b => {
                        if (b.textContent === correctAnswer) b.classList.add('correct');
                    });
                }

                // Block clicks
                body.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

                // Next question
                setTimeout(() => {
                    currentQuestion++;
                    showQuestion();
                }, 1500);
            };
        });
    }

    function showResults() {
        const body = document.getElementById('quiz-body');
        const percentage = (score / quizWords.length) * 100;
        let xpReward = 0;

        if (percentage >= 80) xpReward = 100;
        else if (percentage >= 60) xpReward = 50;
        else if (percentage >= 40) xpReward = 20;

        if (xpReward > 0) {
            addXP(xpReward, 'Daily Quiz Complete');
        }

        body.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <div class="score-circle">${score}/${quizWords.length}</div>
                <p>You earned <strong>${xpReward} XP</strong>!</p>
                <button id="close-quiz-final">Close</button>
            </div>
        `;

        document.getElementById('close-quiz-final').onclick = () => modal.remove();
    }

    showQuestion();
}
