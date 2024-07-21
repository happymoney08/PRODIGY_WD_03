const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const messageElement = document.getElementById('message');
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsAiButton = document.getElementById('player-vs-ai');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let playMode = '';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

playerVsPlayerButton.addEventListener('click', () => startGame('pvp'));
playerVsAiButton.addEventListener('click', () => startGame('pva'));

function startGame(mode) {
    playMode = mode;
    menu.style.display = 'none';
    game.style.display = 'block';
    resetGame();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive || (playMode === 'pva' && currentPlayer === 'O')) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
    if (gameActive) {
        if (playMode === 'pva' && currentPlayer === 'X') {
            currentPlayer = 'O';
            messageElement.textContent = `It's ${currentPlayer}'s turn`;
            setTimeout(aiMove, 500); // Add a delay for AI move
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            messageElement.textContent = `It's ${currentPlayer}'s turn`;
        }
    }
}

function aiMove() {
    const bestMove = getBestMove();
    gameState[bestMove] = currentPlayer;
    document.querySelector(`.cell[data-index="${bestMove}"]`).textContent = currentPlayer;

    checkResult();
    if (gameActive) {
        currentPlayer = 'X';
        messageElement.textContent = `It's ${currentPlayer}'s turn`;
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(state, depth, isMaximizing) {
    let scores = {
        'X': -10,
        'O': 10,
        'tie': 0
    };
    
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === '') {
                state[i] = 'O';
                let score = minimax(state, depth + 1, false);
                state[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === '') {
                state[i] = 'X';
                let score = minimax(state, depth + 1, true);
                state[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        messageElement.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        messageElement.textContent = 'Draw!';
        gameActive = false;
        return;
    }
}

function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }

    if (!gameState.includes('')) {
        return 'tie';
    }
    return null;
}

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    messageElement.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

resetGame();
