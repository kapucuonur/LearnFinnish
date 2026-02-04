
import puzzleData from '../data/crossword.json' with { type: 'json' };

export function initPuzzleSection() {
    const puzzleArea = document.getElementById('puzzle-area');
    if (!puzzleArea) return;

    // Load Puzzle Data (already imported) or could fetch if it was an API
    renderPuzzle(puzzleData);

    // Setup Back Button
    const backBtn = document.getElementById('puzzle-back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            puzzleArea.classList.add('hidden');
            // Show menu or whatever was previous? 
            // Usually clicking logo resets, but here we just hide.
            // Maybe show nav grid again if we want to be fancy, but standard behavior in this app seems to be just hiding overlays or navigating
            // Actually, typically in this app, we might want to un-hide the nav grid if it was hidden.
            // For now, let's just follow the pattern of other sections.
        });
    }
}

function renderPuzzle(words) {
    const gridContainer = document.getElementById('puzzle-grid');
    const clueList = document.getElementById('puzzle-clues');
    if (!gridContainer || !clueList) return;

    gridContainer.innerHTML = '';
    clueList.innerHTML = '';

    // 1. Create Grid (12x12)
    const gridSize = 12;
    const gridState = Array(gridSize).fill().map(() => Array(gridSize).fill(null));

    // Map cells to words
    // cell: { char: 'A', input: '', words: [index, index...] }

    // Initialize grid cells in DOM
    // CSS Grid usage: repeat(12, 1fr)
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
                    words: [], // indices of words passing through
                    x, y
                };
            }
            gridState[y][x].words.push(index);
        }

        // Add clue
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${wordObj.clue} (${direction === 'horizontal' ? 'Across' : 'Down'})`;
        li.dataset.wordIndex = index;
        li.className = 'clue-item';

        // Highlight word on hover/click clue
        li.addEventListener('click', () => highlightWord(index, words));
        clueList.appendChild(li);
    });

    // Render DOM cells
    const inputs = []; // 2D array of input elements [y][x]

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
                input.addEventListener('keydown', (e) => handleKey(e, x, y, inputs, gridState));
                input.addEventListener('focus', () => handleFocus(x, y, cellData.words, words));

                cellDiv.appendChild(input);
                cellDiv.dataset.hasLetter = 'true';
                rowInputs.push(input);
            } else {
                cellDiv.classList.add('empty');
                rowInputs.push(null);
            }
            gridContainer.appendChild(cellDiv);
        }
        inputs.push(rowInputs);
    }

    // Add Check Button Logic
    const checkBtn = document.getElementById('puzzle-check-btn');
    if (checkBtn) {
        checkBtn.onclick = () => checkAnswers(inputs, gridState);
    }

    // --- Helpers ---

    function highlightWord(index, allWords) {
        // Clear highlights
        document.querySelectorAll('.puzzle-input').forEach(el => el.classList.remove('highlight'));

        const w = allWords[index];
        for (let i = 0; i < w.answer.length; i++) {
            let x = w.startX + (w.direction === 'horizontal' ? i : 0);
            let y = w.startY + (w.direction === 'vertical' ? i : 0);
            if (inputs[y][x]) inputs[y][x].classList.add('highlight');
        }
    }

    function handleFocus(x, y, wordIndices, allWords) {
        // Highlight the first word associated with this cell (or current active direction if tracked)
        if (wordIndices.length > 0) {
            highlightWord(wordIndices[0], allWords);
        }
    }

    function handleKey(e, x, y, inputGrid, gridState) {
        // Arrow keys navigation
        if (e.key === 'ArrowRight') {
            if (x < gridSize - 1) focusNext(x + 1, y, inputGrid);
        } else if (e.key === 'ArrowLeft') {
            if (x > 0) focusNext(x - 1, y, inputGrid);
        } else if (e.key === 'ArrowDown') {
            if (y < gridSize - 1) focusNext(x, y + 1, inputGrid);
        } else if (e.key === 'ArrowUp') {
            if (y > 0) focusNext(x, y - 1, inputGrid);
        } else if (e.key === 'Backspace') {
            if (e.target.value === '') {
                // Move back
                // Simplification: just move left or up? proper logic is complex without direction state
                // Let's just stay or simplistic move back
            }
        }

        // Auto-advance on typing logic (simplified)
        if (e.key.length === 1 && e.key.match(/[a-zA-Z\u00C0-\u00FF]/)) {
            // Wait for value to update then move
            setTimeout(() => {
                // Determine direction to move based on highlight? or just try horizontal then vertical
                // Simple: Try right, if empty/null, try down
                if (x < gridSize - 1 && inputGrid[y][x + 1]) focusNext(x + 1, y, inputGrid);
                else if (y < gridSize - 1 && inputGrid[y + 1][x]) focusNext(x, y + 1, inputGrid);
            }, 10);
        }
    }

    function focusNext(x, y, inputGrid) {
        if (inputGrid[y][x]) inputGrid[y][x].focus();
        else {
            // Skip empty cells?
            // Simple version: no skip, just fail to focus
        }
    }

    function checkAnswers(inputGrid, gridState) {
        let correctCount = 0;
        let totalCount = 0;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (gridState[y][x]) {
                    totalCount++;
                    const val = inputGrid[y][x].value.toUpperCase();
                    const correct = gridState[y][x].correctChar.toUpperCase();

                    if (val === correct) {
                        inputGrid[y][x].classList.add('correct');
                        inputGrid[y][x].classList.remove('incorrect');
                        correctCount++;
                    } else {
                        inputGrid[y][x].classList.add('incorrect');
                        inputGrid[y][x].classList.remove('correct');
                    }
                }
            }
        }

        if (correctCount === totalCount) {
            alert("Onneksi olkoon! (Congratulations!) Puzzle Complete!");
        }
    }
}
