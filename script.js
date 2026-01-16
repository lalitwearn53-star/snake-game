const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const box = 20;

let snake;
let direction;
let food;
let score;
let highScore;
let game;
let paused = false;

/* ================= INIT ================= */
function init() {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  paused = false;

  document.getElementById("score").innerText = score;

  highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("highScore").innerText = highScore;

  food = {
    x: Math.floor(Math.random() * 24) * box,
    y: Math.floor(Math.random() * 24) * box
  };

  if (game) clearInterval(game);
  game = setInterval(draw, 150); // 👉 speed (bada number = slow)
}

/* ================= CONTROLS ================= */
function setDir(dir) {
  if (paused) return;

  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") setDir("UP");
  if (e.key === "ArrowDown") setDir("DOWN");
  if (e.key === "ArrowLeft") setDir("LEFT");
  if (e.key === "ArrowRight") setDir("RIGHT");
});

/* ================= PAUSE ================= */
function togglePause() {
  paused = !paused;
}

/* ================= DRAW ================= */
function draw() {
  if (paused) return;

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#4ade80";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
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
      x: Math.floor(Math.random() * 24) * box,
      y: Math.floor(Math.random() * 24) * box
    };
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // Game Over
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over!");
    return;
  }

  snake.unshift(newHead);
}

/* ================= HELPERS ================= */
function collision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) return true;
  }
  return false;
}

function restartGame() {
  init();
}

/* START */
init();
