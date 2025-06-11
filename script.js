class NumberGuessingGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.maxAttempts = 7;
        this.gameOver = false;
        this.won = false;
        this.guessHistory = [];
        
        this.initializeElements();
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.attemptsEl = document.getElementById('attempts-badge');
        this.statusEl = document.getElementById('status-badge');
        this.feedbackEl = document.getElementById('feedback');
        this.inputSectionEl = document.getElementById('input-section');
        this.guessInputEl = document.getElementById('guess-input');
        this.guessBtnEl = document.getElementById('guess-btn');
        this.newGameBtnEl = document.getElementById('new-game-btn');
        this.historySectionEl = document.getElementById('history-section');
        this.historyBadgesEl = document.getElementById('history-badges');
    }
    
    setupEventListeners() {
        this.guessBtnEl.addEventListener('click', () => this.handleGuess());
        this.newGameBtnEl.addEventListener('click', () => this.initializeGame());
        this.guessInputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.gameOver) {
                this.handleGuess();
            }
        });
    }
    
    generateRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }
    
    initializeGame() {
        this.targetNumber = this.generateRandomNumber();
        console.log('New target number:', this.targetNumber); // For debugging
        
        this.attempts = 0;
        this.gameOver = false;
        this.won = false;
        this.guessHistory = [];
        
        this.guessInputEl.value = '';
        this.guessInputEl.disabled = false;
        this.guessBtnEl.disabled = false;
        
        this.updateUI();
        this.setFeedback("I'm thinking of a number between 1 and 100. Can you guess it?");
        this.updateHistory();
    }
    
    handleGuess() {
        const guess = parseInt(this.guessInputEl.value);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.showToast("Invalid Input", "Please enter a number between 1 and 100.", "error");
            return;
        }
        
        this.attempts++;
        this.guessHistory.push(guess);
        
        if (guess === this.targetNumber) {
            this.won = true;
            this.gameOver = true;
            this.setFeedback(🎉 Congratulations! You guessed it in ${this.attempts} attempt${this.attempts === 1 ? '' : 's'}!);
            this.showToast("You Won! 🎉", Amazing! You found the number ${this.targetNumber} in ${this.attempts} attempts!, "success");
        } else if (this.attempts >= this.maxAttempts) {
            this.gameOver = true;
            this.setFeedback(😔 Game Over! The number was ${this.targetNumber}. Better luck next time!);
            this.showToast("Game Over", The number was ${this.targetNumber}. Try again!, "error");
        } else {
            const remaining = this.maxAttempts - this.attempts;
            if (guess < this.targetNumber) {
                this.setFeedback(📈 Too low! Try a higher number. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.);
            } else {
                this.setFeedback(📉 Too high! Try a lower number. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.);
            }
        }
        
        this.guessInputEl.value = '';
        this.updateUI();
        this.updateHistory();
    }
    
    updateUI() {
        this.attemptsEl.textContent = Attempts: ${this.attempts}/${this.maxAttempts};
        
        if (this.won) {
            this.statusEl.textContent = 'Winner!';
            this.statusEl.className = 'badge status-badge status-winner';
        } else if (this.gameOver) {
            this.statusEl.textContent = 'Game Over';
            this.statusEl.className = 'badge status-badge status-game-over';
        } else {
            this.statusEl.textContent = 'Playing';
            this.statusEl.className = 'badge status-badge status-playing';
        }
        
        if (this.gameOver) {
            this.guessInputEl.disabled = true;
            this.guessBtnEl.disabled = true;
            this.inputSectionEl.style.display = 'none';
        } else {
            this.inputSectionEl.style.display = 'flex';
        }
    }
    
    updateHistory() {
        if (this.guessHistory.length > 0) {
            this.historySectionEl.classList.remove('hidden');
            this.historyBadgesEl.innerHTML = '';
            
            this.guessHistory.forEach(guess => {
                const badge = document.createElement('span');
                badge.className = 'badge history-badge';
                badge.textContent = guess;
                this.historyBadgesEl.appendChild(badge);
            });
        } else {
            this.historySectionEl.classList.add('hidden');
        }
    }
    
    setFeedback(message) {
        this.feedbackEl.textContent = message;
    }
    
    showToast(title, message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        toast.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
            <div style="font-size: 0.875rem;">${message}</div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
});