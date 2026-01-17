// ========== CANVAS ==========
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

// ========== GAME VARIABLES ==========
let snake;
let direction;
let food;
let score;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let speed = 120;
let paused = false;

// ========== INIT GAME ==========
function initGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  paused = false;

  document.getElementById("score").innerText = score;
  document.getElementById("highScore").innerText = highScore;

  food = randomFood();

  clearInterval(gameInterval);
  gameInterval = setInterval(draw, speed);
}

// ========== RANDOM FOOD ==========
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  };
}

// ========== KEYBOARD CONTROLS ==========
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// ========== BUTTON CONTROLS ==========
document.getElementById("upBtn").onclick = () => {
  if (direction !== "DOWN") direction = "UP";
};

document.getElementById("downBtn").onclick = () => {
  if (direction !== "UP") direction = "DOWN";
};

document.getElementById("leftBtn").onclick = () => {
  if (direction !== "RIGHT") direction = "LEFT";
};

document.getElementById("rightBtn").onclick = () => {
  if (direction !== "LEFT") direction = "RIGHT";
};

// Pause / Resume
document.getElementById("pauseBtn").onclick = () => {
  if (paused) {
    gameInterval = setInterval(draw, speed);
    paused = false;
  } else {
    clearInterval(gameInterval);
    paused = true;
  }
};

// Restart
document.getElementById("restartBtn").onclick = initGame;

// ========== GAME LOOP ==========
function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#16a34a";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  const newHead = { x: headX, y: headY };

  // GAME OVER
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvasSize ||
    headY >= canvasSize ||
    collision(newHead, snake)
  ) {
    clearInterval(gameInterval);
    alert("Game Over!");
    return;
  }

  // EAT FOOD
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("highScore").innerText = highScore;
    }

    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

// ========== COLLISION ==========
function collision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}

// ========== START GAME ==========
initGame();
