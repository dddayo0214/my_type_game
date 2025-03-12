const targetTextElement = document.getElementById('target-text');
const inputTextElement = document.getElementById('input-text');
const highlightElement = document.getElementById('highlight');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');
const wpmElement = document.getElementById('wpm');
const resultElement = document.getElementById('result');
const startHintElement = document.getElementById('start-hint');
const errorLogElement = document.getElementById('error-log');
const typingHistoryElement = document.getElementById('typing-history'); // Typing history element

const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "I love programming and learning new things every day.",
    "Practice makes perfect in typing skills.",
    "Success is not final, failure is not fatal.",
    "Coding is an art of solving problems creatively."
];

let currentSentence = '';
let timeLeft = 60;
let timer;
let gameStarted = false;
let totalErrors = 0;
let errorPositions = new Set();

function initGame() {
    // 隨機選擇句子
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    targetTextElement.textContent = currentSentence;

    // 重置遊戲狀態
    inputTextElement.value = '';
    inputTextElement.disabled = false;
    inputTextElement.focus();

    timeLeft = 60;
    timerElement.textContent = timeLeft;
    accuracyElement.textContent = '100';
    wpmElement.textContent = '0';
    resultElement.textContent = '';
    highlightElement.innerHTML = '';
    errorLogElement.innerHTML = '';
    typingHistoryElement.innerHTML = ''; // Clear typing history
    startHintElement.style.display = 'block';

    gameStarted = false;
    totalErrors = 0;
    errorPositions.clear();

    clearInterval(timer);
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        startHintElement.style.display = 'none';
        timer = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

function updateHighlight() {
    const inputText = inputTextElement.value;
    let highlightedText = '';
    let errorDescription = '';

    for (let i = 0; i < inputText.length; i++) {
        if (i < currentSentence.length) {
            if (inputText[i] === currentSentence[i]) {
                highlightedText += `<span class="correct">${inputText[i]}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${inputText[i]}</span>`;

                // 記錄錯誤位置
                if (!errorPositions.has(i)) {
                    errorPositions.add(i);
                    totalErrors++;
                    errorDescription += `第 ${i + 1} 個字錯誤：應為 "${currentSentence[i]}"，你輸入了 "${inputText[i]}"<br>`;
                }
            }
        }
    }

    highlightElement.innerHTML = highlightedText;

    if (errorDescription) {
        errorLogElement.innerHTML = errorDescription;
    }
}

function logTypingHistory(inputText) {
    typingHistoryElement.innerHTML += `<div>${inputText}</div>`; // Log the input text
}

function calculateAccuracy() {
    // 計算永久降低的正確率
    const inputText = inputTextElement.value;
    const totalChars = Math.max(inputText.length, currentSentence.length);

    // 正確率 = (總字符 - 錯誤數) / 總字符 * 100
    const accuracy = Math.max(0, Math.round(((totalChars - totalErrors) / totalChars) * 100));
    return accuracy;
}

function calculateWPM() {
    const inputText = inputTextElement.value;
    const words = inputText.trim().split(/\s+/);
    const timeTaken = (60 - timeLeft) / 60;  // 時間以小時計算
    return Math.round(words.length / timeTaken);
}

function updateStats() {
    const accuracy = calculateAccuracy();
    const wpm = calculateWPM();
    // Log the game stats when the player completes a sentence
    typingHistoryElement.innerHTML += `<div>完成時間: ${60 - timeLeft}秒, 正確率: ${accuracy}%, 速度: ${wpm} WPM</div>`; // Log the game stats

    accuracyElement.textContent = accuracy;
    wpmElement.textContent = wpm;
}

function endGame() {
    clearInterval(timer);
    inputTextElement.disabled = true;

    const accuracy = calculateAccuracy();
    const wpm = calculateWPM();

    accuracyElement.textContent = accuracy;
    wpmElement.textContent = wpm;

    if (accuracy > 80) {
        addGameEndEffect(true); // Add victory effect
        resultElement.textContent = `太棒了！你打得很好！`;
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = `繼續加油！還有進步空間。`;
        resultElement.style.color = 'red';
    }
}

inputTextElement.addEventListener('input', function (e) {
    // 第一次輸入時開始計時
    if (!gameStarted) {
        startTimer();
    }

    // 即時更新高亮和統計
    updateHighlight();
    updateStats();

    logTypingHistory(inputText); // Log the input text


    // 檢查是否完成整個句子
    if (e.target.value === currentSentence) {
        endGame();
    }
});

// 遊戲初始化
initGame();

// 重新開始按鈕
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        initGame();
    }
});

function createParticles() {
    const container = document.body;

    // 創建20個漂浮粒子
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('game-particles');
        particle.style.position = 'fixed';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = '100%';
        particle.style.opacity = Math.random();
        particle.style.animation = `particle-float ${Math.random() * 10 + 5}s linear infinite`;
        container.appendChild(particle);
    }
}

// 在遊戲初始化時創建粒子
createParticles();

// 在遊戲結束時添加勝利或失敗的特效
function addGameEndEffect(isVictory) {
    const container = document.querySelector('.game-container');
    const effectColor = isVictory ? '#50c878' : '#ff6b6b';

    container.style.boxShadow = `0 0 50px ${effectColor}`;
    container.style.transform = 'scale(1.05)';

    setTimeout(() => {
        container.style.boxShadow = '';
        container.style.transform = '';
    }, 1000);
}
