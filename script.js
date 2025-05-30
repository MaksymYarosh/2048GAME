const container = document.getElementById('game-container');
const scoreEl = document.getElementById('score');
let board = [];
let score = 0;

function initBoard() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    addNewTile();
    addNewTile();
    drawBoard();
}

function drawBoard() {
    container.innerHTML = '';
    board.forEach(row => {
        row.forEach(cell => {
            const cellEl = document.createElement('div');
            cellEl.className = 'cell';
            cellEl.textContent = cell === 0 ? '' : cell;
            container.appendChild(cellEl);
        });
    });
    scoreEl.textContent = score;
}

function addNewTile() {
    const emptyCells = [];
    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 0) emptyCells.push({ i, j });
        });
    });

    if (emptyCells.length === 0) return;

    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
    let arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }
    arr = arr.filter(val => val);
    while (arr.length < 4) arr.push(0);
    return arr;
}

function rotateBoard() {
    let newBoard = Array(4).fill().map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            newBoard[i][j] = board[j][i];
    board = newBoard;
}

function handleInput(direction) {
    let flipped = false;
    let rotated = false;

    if (direction === 'ArrowUp') {
        rotated = true;
        rotateBoard();
    } else if (direction === 'ArrowRight') {
        board = board.map(row => row.reverse());
        flipped = true;
    } else if (direction === 'ArrowDown') {
        rotated = true;
        rotateBoard();
        board = board.map(row => row.reverse());
        flipped = true;
    }

    let oldBoard = JSON.stringify(board);

    board = board.map(row => slide(row));

    if (flipped) board = board.map(row => row.reverse());
    if (rotated) {
        rotateBoard();
        rotateBoard();
        rotateBoard();
    }

    if (JSON.stringify(board) !== oldBoard) {
        addNewTile();
    }

    drawBoard();
}

window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        handleInput(e.key);
    }
});

initBoard();
