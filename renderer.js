let timer;
let timeLeft;
let isWorkMode = true;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const buddy = document.getElementById('buddy');

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
    
    // Alert or sound could go here
    new Notification('Pomodoro Buddy', {
        body: isWorkMode ? 'Time to work!' : 'Break time!',
    });
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Pause';
    buddy.className = 'active';
    
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
    buddy.className = 'idle';
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

// Initialize
timeLeft = workTimeInput.value * 60;
document.body.className = 'mode-focus';
updateDisplay();
