// 獲取遊戲版面與進度條
const gameBoard = document.getElementById('gameBoard');
const progressBarContainer = document.querySelector('.progress-bar-container');
const progressBar = document.getElementById('progressBar');
const levelSelection = document.getElementById('levelSelection');
const timerDisplay = document.createElement('div');
timerDisplay.style.fontSize = '1.5rem';
timerDisplay.style.marginBottom = '20px';
document.body.insertBefore(timerDisplay, gameBoard); // 在遊戲版面上方顯示倒計時

// 重新開始按鈕
const restartButton = document.createElement('button');
restartButton.textContent = '重新開始';
restartButton.style.display = 'none'; // 初始隱藏
restartButton.style.padding = '10px 20px';
restartButton.style.fontSize = '1.2rem';
restartButton.style.cursor = 'pointer';
restartButton.addEventListener('click', restartGame);
document.body.appendChild(restartButton);



const levels = [
    { columns: 2, rows: 2, pairs: 2 }, // 2x2（4 張卡片）
    { columns: 3, rows: 2, pairs: 3 }, // 2x3（6 張卡片）
    { columns: 4, rows: 2, pairs: 4 }  // 2x4（8 張卡片）
];

// 定義圖案的路徑
const iconsPool = [
    'images/lantern.jpg',
    'images/dragon.jpg',
    'images/phoenix.jpg',
    'images/incense.jpg',
    'images/bell.jpg',
    'images/fireworks.jpg',
    'images/temple.jpg',
    'images/key.jpg'
];
let level = 1;
let icons = [];
let flippedCards = [];
let matchedPairs = 0;

// 設定時間（以秒為單位）
let timeLeft = 120; // 兩分鐘
let timerInterval;
let gameOver = false;  // 用來控制遊戲結束後的行為
let gameStarted = false; // 控制遊戲是否開始

// 初始化倒計時
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0 && !gameOver) {
            timeLeft--;
            updateTimerDisplay();
        } else if (timeLeft === 0) {
            clearInterval(timerInterval);
            alert('時間到！遊戲結束！');
            endGame();
        }
    }, 1000);
}

// 更新倒計時顯示
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `剩餘時間: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 創建遊戲版面
function createBoard() {
    gameBoard.innerHTML = '';
    initIcons();

    icons.forEach((icon) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = icon;
        card.classList.add('disabled');  // 初始時卡牌為禁用狀態

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '★'; // 表符占位

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.innerHTML = `<img src="${icon}" alt="icon" class="card-image">`;

        card.appendChild(cardBack);
        card.appendChild(cardFront);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    adjustGrid(); // 動態調整網格
    updateProgressBar(); // 更新進度條
}

// 初始化卡牌
function initIcons() {
    icons = [];
    let { pairs } = levels[level - 1]; // 根據關卡設定數值
    let selectedIcons = iconsPool.sort(() => 0.5 - Math.random()).slice(0, pairs);
    icons = [...selectedIcons, ...selectedIcons];
    icons.sort(() => Math.random() - 0.5);
}

// 計算並更新進度條
function updateProgressBar() {
    const totalPairs = icons.length / 2;
    const progress = (matchedPairs / totalPairs) * 100;
    progressBar.style.width = `${progress}%`;
}

// 配對檢查
function checkMatch() {
    if (gameOver) return; // 如果遊戲結束，不能再進行配對檢查
    const [card1, card2] = flippedCards;
    if (card1.dataset.icon === card2.dataset.icon) {
        matchedPairs++;
        flippedCards = [];

        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
        }, 500);

        if (matchedPairs === icons.length / 2) {
            setTimeout(() => {
                alert('恭喜過關！');
                nextLevel();
            }, 1000);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }

    updateProgressBar();
}

function adjustGrid() {
    const { columns, rows } = levels[level - 1]; // 根據關卡決定行與列
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}
// 點擊卡片特效
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.children[0].style.display = 'block';
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}
// 進入下一關
function nextLevel() {
    if (level < levels.length) {
        level++;
        matchedPairs = 0;
        createBoard();
    } else {
        // 如果完成最後一關，跳轉到獎狀頁面
        setTimeout(() => {
            window.location.href = "certificate.html";
        }, 1000);
    }
}

// 結束遊戲
function endGame() {
    gameOver = true;  // 設置遊戲結束狀態
    restartButton.style.display = 'block';  // 顯示重新開始按鈕
    startButton.style.display = 'none';  // 隱藏開始遊戲按鈕
}

// 重新開始遊戲
function restartGame() {
    // 重置遊戲狀態
    location.reload();  // 刷新頁面，重新開始遊戲
}

// 選擇關卡並開始遊戲
function startGame(selectedLevel) {
    level = selectedLevel;
    matchedPairs = 0;
    gameStarted = true;
    levelSelection.style.display = 'none'; // 隱藏選關按鈕
    progressBarContainer.style.display = 'block'; // 顯示進度條
    startTimer();
    createBoard();
}
let viewCount = localStorage.getItem("pageViews") ? parseInt(localStorage.getItem("pageViews")) : 3475;

if (viewCount < 3475) {
    viewCount = 3475;
}

// 增加點閱數
viewCount++;
localStorage.setItem("pageViews", viewCount);

// 顯示點閱數
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("viewCount").textContent = viewCount;
});
