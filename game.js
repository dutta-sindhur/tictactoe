document.addEventListener('DOMContentLoaded', () => {
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let isAIThinking = false;

    const statusDisplay = document.getElementById('status');
    const cells = document.querySelectorAll('.grid-cell');
    const resetButton = document.getElementById('resetButton');

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    function minimax(board, depth, isMaximizing) {
        const scores = {
            'X': -1,
            'O': 1,
            'tie': 0
        };

        const result = checkWinner(board);
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'O';
                let score = minimax(gameBoard, 0, false);
                gameBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function checkWinner(board) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes('') ? null : 'tie';
    }

    async function makeAIMove() {
        if (!gameActive || currentPlayer === 'X') return;

        isAIThinking = true;
        statusDisplay.textContent = "AI is thinking...";

        // Small delay to show AI "thinking"
        await new Promise(resolve => setTimeout(resolve, 500));

        const bestMove = getBestMove();
        const cell = cells[bestMove];

        gameBoard[bestMove] = 'O';
        cell.textContent = 'O';

        isAIThinking = false;

        const winner = checkWinner(gameBoard);
        if (winner !== null) {
            gameActive = false;
            statusDisplay.textContent = winner === 'tie' ? 
                'Game ended in a draw!' : 
                `Player ${winner} wins!`;
            return;
        }

        currentPlayer = 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }

    async function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameBoard[clickedCellIndex] !== '' || !gameActive || isAIThinking || currentPlayer !== 'X') {
            return;
        }

        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        const winner = checkWinner(gameBoard);
        if (winner !== null) {
            gameActive = false;
            statusDisplay.textContent = winner === 'tie' ? 
                'Game ended in a draw!' : 
                `Player ${winner} wins!`;
            return;
        }

        currentPlayer = 'O';
        await makeAIMove();
    }

    function handleReset() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        isAIThinking = false;
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.textContent = '');
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', handleReset);
});