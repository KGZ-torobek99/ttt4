class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.cells = document.querySelectorAll('[data-cell]');
        this.statusElement = document.getElementById('status');
        this.restartButton = document.getElementById('restartButton');
        this.newGameButton = document.getElementById('newGameButton');
        this.scoreXElement = document.getElementById('scoreX');
        this.scoreOElement = document.getElementById('scoreO');
        this.winModal = document.getElementById('winModal');
        this.winMessage = document.getElementById('winMessage');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
    }

    bindEvents() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
        this.newGameButton.addEventListener('click', () => this.newGame());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    handleCellClick(e) {
        const cell = e.target;
        const cellIndex = Array.from(this.cells).indexOf(cell);

        if (this.board[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        this.makeMove(cellIndex);
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
        }
    }

    checkWin() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                
                // Highlight winning cells
                this.cells[a].classList.add('winning');
                this.cells[b].classList.add('winning');
                this.cells[c].classList.add('winning');
                
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        
        this.winMessage.textContent = `Player ${this.currentPlayer} Wins!`;
        this.showModal();
        
        this.statusElement.textContent = `Player ${this.currentPlayer} Wins!`;
        this.statusElement.style.color = this.currentPlayer === 'X' ? '#dc3545' : '#28a745';
    }

    handleDraw() {
        this.gameActive = false;
        this.winMessage.textContent = "It's a Draw!";
        this.showModal();
        
        this.statusElement.textContent = "It's a Draw!";
        this.statusElement.style.color = '#6c757d';
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }

    updateDisplay() {
        this.statusElement.textContent = `Player ${this.currentPlayer}'s Turn`;
        this.statusElement.style.color = this.currentPlayer === 'X' ? '#dc3545' : '#28a745';
    }

    updateScores() {
        this.scoreXElement.textContent = this.scores.X;
        this.scoreOElement.textContent = this.scores.O;
    }

    showModal() {
        this.winModal.classList.add('show');
    }

    closeModal() {
        this.winModal.classList.remove('show');
    }

    playAgain() {
        this.closeModal();
        this.restartGame();
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });

        this.updateDisplay();
    }

    newGame() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
        this.restartGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Add some fun sound effects (optional)
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'win') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    } else if (type === 'move') {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        document.getElementById('restartButton').click();
    } else if (e.key === 'n' || e.key === 'N') {
        document.getElementById('newGameButton').click();
    } else if (e.key === 'Escape') {
        const modal = document.getElementById('winModal');
        if (modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    }
});

// Add touch support for mobile devices
document.addEventListener('touchstart', function() {}, {passive: true});

// Add some visual feedback for better UX
document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            if (!cell.textContent && document.querySelector('.game-active')) {
                cell.style.transform = 'scale(1.05)';
            }
        });
        
        cell.addEventListener('mouseleave', () => {
            cell.style.transform = 'scale(1)';
        });
    });
}); 