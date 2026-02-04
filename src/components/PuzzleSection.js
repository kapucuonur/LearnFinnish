import puzzleData from '../data/crossword.json';

export function initPuzzleSection() {
    const puzzleArea = document.getElementById('puzzle-area');
    if (!puzzleArea) return;

    // --- State ---
    // Ensure puzzleData is valid
    if (!puzzleData) {
        console.error("Puzzle data not loaded");
        return;
    }

    let currentTopic = Object.keys(puzzleData)[0]; // Default to first topic
    let currentWords = puzzleData[currentTopic];
    let inputsGrid = []; // [y][x] -> input element
    let gridState = [];  // [y][x] -> { correctChar, words, x, y }
    let lastFocused = null; // {x, y}

    // --- initialization ---
    setupTopicSelector();
    renderPuzzle(currentWords);

    // Setup Back Button
    const backBtn = document.getElementById('puzzle-back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            puzzleArea.classList.add('hidden');
        });
    }

    // Setup Hint Button
    const hintBtn = document.getElementById('puzzle-hint-btn');
    if (hintBtn) {
        hintBtn.onclick = () => useHint();
    }

    // Setup Check Button
    const checkBtn = document.getElementById('puzzle-check-btn');
    if (checkBtn) {
        checkBtn.onclick = () => checkAnswers(true);
    }

    function setupTopicSelector() {
        const headerContainer = document.querySelector('.puzzle-header');
        // Remove existing selector if any
        const oldSel = document.getElementById('puzzle-topic-select');
        if (oldSel) oldSel.remove();

        const select = document.createElement('select');
        select.id = 'puzzle-topic-select';
        select.className = 'puzzle-topic-select';

        Object.keys(puzzleData).forEach(topic => {
            const opt = document.createElement('option');
            opt.value = topic;
            opt.textContent = topic;
            if (topic === currentTopic) opt.selected = true;
            select.appendChild(opt);
        });

        select.addEventListener('change', (e) => {
            currentTopic = e.target.value;
            currentWords = puzzleData[currentTopic];
            renderPuzzle(currentWords);
        });

        // Insert after title
        headerContainer.appendChild(select);
    }

    function renderPuzzle(words) {
        const gridContainer = document.getElementById('puzzle-grid');
        const clueList = document.getElementById('puzzle-clues');
        if (!gridContainer || !clueList) return;

        gridContainer.innerHTML = '';
        clueList.innerHTML = '';

        // 1. Create Grid (12x12)
        const gridSize = 12;
        gridState = Array(gridSize).fill().map(() => Array(gridSize).fill(null));

        // Initialize grid cells in DOM
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        // First pass: Fill logical grid with answers
        words.forEach((wordObj, index) => {
            const { answer, startX, startY, direction } = wordObj;
            for (let i = 0; i < answer.length; i++) {
                let x = startX + (direction === 'horizontal' ? i : 0);
                let y = startY + (direction === 'vertical' ? i : 0);

                if (!gridState[y][x]) {
                    gridState[y][x] = {
                        correctChar: answer[i],
                        words: [],
                        x, y
                    };
                }
                gridState[y][x].words.push(index);
            }

            // Add clue
            const li = document.createElement('li');
            li.innerHTML = `<strong>${index + 1}.</strong> ${wordObj.clue} <span class="direction-badge">${direction === 'horizontal' ? 'Across' : 'Down'}</span>`;
            li.dataset.wordIndex = index;
            li.className = 'clue-item';

            li.addEventListener('click', () => highlightWord(index, words));
            clueList.appendChild(li);
        });

        // Render DOM cells
        inputsGrid = [];

        for (let y = 0; y < gridSize; y++) {
            const rowInputs = [];
            for (let x = 0; x < gridSize; x++) {
                const cellData = gridState[y][x];
                const cellDiv = document.createElement('div');
                cellDiv.className = 'puzzle-cell';

                if (cellData) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.className = 'puzzle-input';
                    input.dataset.x = x;
                    input.dataset.y = y;

                    // Input handling
                    input.addEventListener('keydown', (e) => handleKey(e, x, y));
                    input.addEventListener('focus', () => {
                        lastFocused = { x, y };
                        handleFocus(x, y, cellData.words, words);
                    });

                    cellDiv.appendChild(input);
                    cellDiv.dataset.hasLetter = 'true';
                    rowInputs.push(input);

                    // Add small number for start of words
                    words.forEach((w, idx) => {
                        if (w.startX === x && w.startY === y) {
                            const num = document.createElement('span');
                            num.className = 'cell-number';
                            num.textContent = idx + 1;
                            cellDiv.appendChild(num);
                        }
                    });

                } else {
                    cellDiv.classList.add('empty');
                    rowInputs.push(null);
                }
                gridContainer.appendChild(cellDiv);
            }
            inputsGrid.push(rowInputs);
        }
    }

    // --- Actions ---

    function useHint() {
        // Prefer last focused cell
        if (!lastFocused) {
            alert("Click on a box first to get a hint!");
            return;
        }

        const { x, y } = lastFocused;
        const cell = gridState[y][x];
        const input = inputsGrid[y][x];

        if (!cell || !input) return;

        if (input.value.toUpperCase() !== cell.correctChar.toUpperCase()) {
            // Reveal letter
            input.value = cell.correctChar;
            input.classList.add('hint-revealed');
            setTimeout(() => input.classList.remove('hint-revealed'), 1000);

            // Check if this completes anything
            checkAnswers(false); // Silent check
        } else {
            // If already correct, maybe find another empty one in the same word?
            // For now, simplest is just current cell.
            alert("You already have this letter!");
        }
    }

    function highlightWord(index, allWords) {
        document.querySelectorAll('.puzzle-input').forEach(el => el.classList.remove('highlight'));
        const w = allWords[index];
        for (let i = 0; i < w.answer.length; i++) {
            let x = w.startX + (w.direction === 'horizontal' ? i : 0);
            let y = w.startY + (w.direction === 'vertical' ? i : 0);
            if (inputsGrid[y][x]) inputsGrid[y][x].classList.add('highlight');
        }
    }

    function handleFocus(x, y, wordIndices, allWords) {
        if (wordIndices.length > 0) {
            highlightWord(wordIndices[0], allWords);
        }
    }

    function handleKey(e, x, y) {
        const gridSize = 12;

        if (e.key === 'ArrowRight') {
            if (x < gridSize - 1) focusNext(x + 1, y);
        } else if (e.key === 'ArrowLeft') {
            if (x > 0) focusNext(x - 1, y);
        } else if (e.key === 'ArrowDown') {
            if (y < gridSize - 1) focusNext(x, y + 1);
        } else if (e.key === 'ArrowUp') {
            if (y > 0) focusNext(x, y - 1);
        } else if (e.key === 'Backspace') {
            // If empty, move back
            if (e.target.value === '') {
                // Try moving back in "primary" direction? simple is just keep focus
            }
        }

        if (e.key.length === 1 && e.key.match(/[a-zA-Z\u00C0-\u00FF]/)) {
            setTimeout(() => {
                if (x < gridSize - 1 && inputsGrid[y][x + 1]) focusNext(x + 1, y);
                else if (y < gridSize - 1 && inputsGrid[y + 1][x]) focusNext(x, y + 1);
            }, 10);
        }
    }

    function focusNext(x, y) {
        if (inputsGrid[y][x]) inputsGrid[y][x].focus();
    }

    function checkAnswers(noisy = true) {
        let correctCount = 0;
        let totalCount = 0;
        const gridSize = 12;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (gridState[y][x]) {
                    totalCount++;
                    const val = inputsGrid[y][x].value.toUpperCase();
                    const correct = gridState[y][x].correctChar.toUpperCase();

                    if (val === correct) {
                        inputsGrid[y][x].classList.add('correct');
                        inputsGrid[y][x].classList.remove('incorrect');
                        correctCount++;
                    } else {
                        if (val !== '') {
                            inputsGrid[y][x].classList.add('incorrect');
                            inputsGrid[y][x].classList.remove('correct');
                        }
                    }
                }
            }
        }

        if (correctCount === totalCount) {
            showSuccess();
        } else if (noisy) {
            alert("Almost there! Keep trying.");
        }
    }

    function showSuccess() {
        // Simple confetti effect or toast
        const btn = document.getElementById('puzzle-check-btn');
        const originalText = btn.textContent;
        btn.textContent = "🎉 PERFECT! 🎉";
        btn.classList.add('success-pulse');

        // Confetti logic could go here if we had a library

        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('success-pulse');
        }, 3000);

        alert("🎉 Mahtavaa! (Awesome!) You completed the puzzle!");
    }
}
