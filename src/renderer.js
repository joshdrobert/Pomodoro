let timer;
let timeLeft;
let isWorkMode = true;
let isRunning = false;
let currentChar = localStorage.getItem('pomodoro-char') || 'fruit';

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const charBtn = document.getElementById('char-btn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const buddy = document.getElementById('buddy');

// ---- Character Toggle ----
function applyCharacter(char) {
    currentChar = char;
    localStorage.setItem('pomodoro-char', char);

    buddy.classList.remove('buddy-fruit', 'buddy-cat');
    buddy.classList.add(char === 'cat' ? 'buddy-cat' : 'buddy-fruit');

    charBtn.textContent = char === 'cat' ? '🐱' : '🍅';
}

charBtn.addEventListener('click', () => {
    applyCharacter(currentChar === 'fruit' ? 'cat' : 'fruit');
});

// Initialize character on load
applyCharacter(currentChar);

// ---- Timer Logic ----
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function switchMode() {
    isWorkMode = !isWorkMode;
    document.body.className = isWorkMode ? 'mode-focus' : 'mode-break';
    timeLeft = (isWorkMode ? workTimeInput.value : breakTimeInput.value) * 60;
    updateDisplay();

    new Notification('Pomodoro Buddy', {
        body: isWorkMode ? 'Time to work!' : 'Break time!',
    });
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Pause';

    // Keep character class, just swap idle/active
    buddy.classList.remove('idle');
    buddy.classList.add('active');

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            switchMode();
            startTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Start';

    buddy.classList.remove('active');
    buddy.classList.add('idle');
}

startBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', () => {
    pauseTimer();
    isWorkMode = true;
    document.body.className = 'mode-focus';
    timeLeft = workTimeInput.value * 60;
    updateDisplay();
});

// ---- Initialize ----
timeLeft = workTimeInput.value * 60;
document.body.className = 'mode-focus';
updateDisplay();

// ---- Quit Button ----
document.getElementById('quit-btn').addEventListener('click', () => {
    window.close();
});
