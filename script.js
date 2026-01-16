const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = canvas.width;

let snake;
let direction;
let food;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

let gameInterval = null;
let isPaused = false;
let speed = 150; // 👉 bada number = slow game

document.getElementById("highScore").innerText = highScore;

/* ========= START GAME ========= */
function init() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = score;

  food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  };

  clearInterval(gameInterval);
  isPaused = false;
  document.getElementById("pauseBtn").innerText = "⏸";

  gameInterval = setInterval(draw, speed);
}

/* ========= CONTROLS ========= */
function setDir(dir) {
  if (isPaused) return;

  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

/* ========= PAUSE / PLAY ========= */
function togglePause() {
  const btn = document.getElementById("pauseBtn");

  if (!isPaused) {
    clearInterval(gameInterval);
    btn.innerText = "▶";
    isPaused = true;
  } else {
    gameInterval = setInterval(draw, speed);
    btn.innerText = "⏸";
    isPaused = false;
  }
}

/* ========= RESTART ========= */
function restartGame() {
  init();
}

/* ========= GAME LOOP ========= */
function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake
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

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("highScore").innerText = highScore;
    }

    food = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // Game Over
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

  snake.unshift(newHead);
}

/* ========= COLLISION ========= */
function collision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}

/* ========= START ========= */
init();
