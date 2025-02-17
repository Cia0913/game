const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confettiParticles = [];

// 初始化禮花粒子
function createConfettiParticles(x, y) {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
    for (let i = 0; i < 100; i++) {
        confettiParticles.push({
            x: x,
            y: y,
            size: Math.random() * 8 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 6 - 3,
            gravity: 0.05,
            life: Math.random() * 100 + 50
        });
    }
}

// 渲染禮花粒子
function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((particle, index) => {
        // 更新粒子位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.speedY += particle.gravity;
        particle.life--;

        // 繪製粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // 移除生命結束的粒子
        if (particle.life <= 0) {
            confettiParticles.splice(index, 1);
        }
    });

    requestAnimationFrame(renderConfetti);
}

// 模擬禮花爆炸
function explodeConfetti() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createConfettiParticles(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
        }, i * 500); // 每隔 500 毫秒觸發一次爆炸
    }
}

// 初始化特效
window.onload = () => {
    renderConfetti();
    explodeConfetti();
};
