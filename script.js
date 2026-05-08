// Game state
   let board = ['', '', '', '', '', '', '', '', ''];
   let currentPlayer = 'X';
   let gameActive = true;
   let gameMode = 'pvp'; // 'pvp' or 'pva' (player vs AI)
   let scores = {
       X: 0,
       O: 0,
       draws: 0
   };

   // Winning combinations
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

   // DOM elements
   const cells = document.querySelectorAll('.cell');
   const statusDisplay = document.getElementById('status');
   const resetBtn = document.getElementById('reset-btn');
   const pvpBtn = document.getElementById('pvp-btn');
   const pvaBtn = document.getElementById('pva-btn');
   const xScoreDisplay = document.getElementById('x-score');
   const oScoreDisplay = document.getElementById('o-score');
   const drawScoreDisplay = document.getElementById('draw-score');

   // Initialize game
   function init() {
       cells.forEach(cell => cell.addEventListener('click', handleCellClick));
       resetBtn.addEventListener('click', resetGame);
       pvpBtn.addEventListener('click', () => setGameMode('pvp'));
       pvaBtn.addEventListener('click', () => setGameMode('pva'));
       updateStatus();
   }

   // Set game mode
   function setGameMode(mode) {
       gameMode = mode;
       pvpBtn.classList.toggle('active', mode === 'pvp');
       pvaBtn.classList.toggle('active', mode === 'pva');
       resetGame();
   }

   // Handle cell click
   function handleCellClick(e) {
       const clickedCell = e.target;
       const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

       if (board[clickedCellIndex] !== '' || !gameActive) {
           return;
       }

       updateCell(clickedCell, clickedCellIndex);
       checkResult();

       // AI move in PvA mode
       if (gameActive && gameMode === 'pva' && currentPlayer === 'O') {
           setTimeout(makeAIMove, 500);
       }
   }

   // Update cell
   function updateCell(cell, index) {
       board[index] = currentPlayer;
       cell.textContent = currentPlayer;
       cell.classList.add(currentPlayer.toLowerCase());
   }

   // Check game result
   function checkResult() {
       let roundWon = false;
       let winningCombination = [];

       for (let i = 0; i < winningConditions.length; i++) {
           const [a, b, c] = winningConditions[i];
           if (board[a] && board[a] === board[b] && board[a] === board[c]) {
               roundWon = true;
               winningCombination = [a, b, c];
               break;
           }
       }

       if (roundWon) {
           statusDisplay.textContent = `Player ${currentPlayer} Wins! 🎉`;
           gameActive = false;
           highlightWinningCells(winningCombination);
           scores[currentPlayer]++;
           updateScoreDisplay();
           return;
       }

       const roundDraw = !board.includes('');
       if (roundDraw) {
           statusDisplay.textContent = "It's a Draw! 🤝";
           gameActive = false;
           scores.draws++;
           updateScoreDisplay();
           return;
       }

       currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
       updateStatus();
   }

   // Highlight winning cells
   function highlightWinningCells(combination) {
       combination.forEach(index => {
           cells[index].classList.add('winning');
       });
   }

   // Update status
   function updateStatus() {
       if (gameActive) {
           if (gameMode === 'pva' && currentPlayer === 'O') {
               statusDisplay.textContent = "AI is thinking...";
           } else {
               statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
           }
       }
   }

   // Update score display
   function updateScoreDisplay() {
       xScoreDisplay.textContent = scores.X;
       oScoreDisplay.textContent = scores.O;
       drawScoreDisplay.textContent = scores.draws;
   }

   // Reset game
   function resetGame() {
       board = ['', '', '', '', '', '', '', '', ''];
       currentPlayer = 'X';
       gameActive = true;
       statusDisplay.textContent = "Player X's Turn";
       
       cells.forEach(cell => {
           cell.textContent = '';
           cell.classList.remove('x', 'o', 'winning');
       });
   }

   // AI Logic - Minimax Algorithm
   function makeAIMove() {
       if (!gameActive) return;

       const bestMove = findBestMove();
       if (bestMove !== -1) {
           updateCell(cells[bestMove], bestMove);
           checkResult();
       }
   }

   // Find best move using Minimax
   function findBestMove() {
       let bestScore = -Infinity;
       let bestMove = -1;

       for (let i = 0; i < board.length; i++) {
           if (board[i] === '') {
               board[i] = 'O';
               let score = minimax(board, 0, false);
               board[i] = '';
               
               if (score > bestScore) {
                   bestScore = score;
                   bestMove = i;
               }
           }
       }

       return bestMove;
   }

   // Minimax algorithm
   function minimax(board, depth, isMaximizing) {
       const result = checkWinner();
       
       if (result !== null) {
           if (result === 'O') return 10 - depth;
           if (result === 'X') return depth - 10;
           return 0;
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

   // Check winner for AI
   function checkWinner() {
       for (let condition of winningConditions) {
           const [a, b, c] = condition;
           if (board[a] && board[a] === board[b] && board[a] === board[c]) {
               return board[a];
           }
       }
       
       if (!board.includes('')) {
           return 'draw';
       }
       
       return null;
   }

   // Start the game
   init();