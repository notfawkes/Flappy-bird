const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 480;
canvas.height = 480;

// Game variables
let birdX = 50;
let birdY = 150;
let birdRadius = 12;
let gravity = 1.5;
let score = 0;
let gameOver = false;

// Pipes
let pipes = [];
pipes[0] = {
    x: canvas.width,
    y: 0
};

const gap = 100;
const pipeWidth = 40;
const pipeHeight = 300; // Maximum height of the pipe

// Event listener for key press
document.addEventListener('keydown', function(event) {
    if (event.key === " " && !gameOver) {
        moveUp();
    } else if (event.key === " " && gameOver) {
        restartGame();
    }
});

function moveUp() {
    birdY -= 30;
}

// Restart game
function restartGame() {
    birdX = 50;
    birdY = 150;
    score = 0;
    gameOver = false;
    pipes = [];
    pipes[0] = {
        x: canvas.width,
        y: 0
    };
    draw();
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird (circle)
    ctx.beginPath();
    ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    // Draw pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipeTopHeight = pipes[i].y + pipeHeight;
        let pipeBottomY = pipes[i].y + pipeHeight + gap;

        // Draw top pipe (rectangle)
        ctx.fillStyle = 'green';
        ctx.fillRect(pipes[i].x, pipes[i].y, pipeWidth, pipeHeight);

        // Draw bottom pipe (rectangle)
        ctx.fillRect(pipes[i].x, pipeBottomY, pipeWidth, canvas.height - pipeBottomY);

        if (!gameOver) {
            pipes[i].x--;
        }

        // Create new pipes
        if (pipes[i].x === 100 && !gameOver) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeHeight) - pipeHeight
            });
        }

        // Collision detection
        if (
            birdX + birdRadius > pipes[i].x &&
            birdX - birdRadius < pipes[i].x + pipeWidth &&
            (birdY - birdRadius < pipeTopHeight ||
                birdY + birdRadius > pipeBottomY)
        ) {
            gameOver = true;
        }

        // Score
        if (pipes[i].x === birdX - pipeWidth && !gameOver) {
            score++;
        }
    }

    if (!gameOver) {
        birdY += gravity;
    }

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, canvas.height - 20);

    // Draw Game Over message
    if (gameOver) {
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '16px Arial';
        ctx.fillText('Press Space to Restart', canvas.width / 2 - 80, canvas.height / 2 + 30);
    }

    // Check if the bird hits the ground
    if (birdY + birdRadius >= canvas.height) {
        gameOver = true;
    }

    if (!gameOver) {
        requestAnimationFrame(draw);
    }
}

draw();
