const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* SIZE */
canvas.width = 360;
canvas.height = 360;
const box = 20;

/* GAME STATE */
let snake = [];
let direction = "RIGHT";
let food = {};
let score = 0;
let gameInterval = null;
let isPaused = false;

/* START GAME */
function startLoop() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(draw, 150);
}

/* INIT / RESTART */
function init() {
  snake = [{ x: 160, y: 160 }];
  direction = "RIGHT";
  score = 0;
  isPaused = false;

  document.getElementById("score").innerText = score;
  document.getElementById("pauseBtn").innerText = "⏸";

  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };

  startLoop();
}

/* DRAW */
function draw() {
  if (isPaused) return;

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // snake
  ctx.fillStyle = "lime";
  snake.forEach(p => ctx.fillRect(p.x, p.y, box, box));

  let head = { ...snake[0] };

  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // wall hit → restart
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height
  ) {
    init();
    return;
  }

  // eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;

    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

/* DIRECTION (BUTTONS + KEYS) */
function setDir(dir) {
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

/* ✅ REAL PAUSE / RESUME */
function togglePause() {
  if (!isPaused) {
    isPaused = true;
    clearInterval(gameInterval);
    document.getElementById("pauseBtn").innerText = "▶";
  } else {
    isPaused = false;
    startLoop();
    document.getElementById("pauseBtn").innerText = "⏸";
  }
}

/* RESTART */
function restartGame() {
  init();
}

/* START FIRST TIME */
init();
