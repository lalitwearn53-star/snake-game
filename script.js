  /* ===== CANVAS SETUP ===== */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* BIG SIZE (SAFE & STABLE) */
canvas.width = 360;
canvas.height = 360;

const box = 20;

/* ===== GAME VARIABLES ===== */
let snake;
let direction;
let food;
let score;
let game;
let isPaused = false;

/* ===== START / RESTART GAME ===== */
function init() {
  snake = [{ x: 160, y: 160 }];
  direction = "RIGHT";
  score = 0;
  isPaused = false;

  document.getElementById("score").innerText = score;

  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };

  if (game) clearInterval(game);
  game = setInterval(draw, 150); // speed (150 = medium)
}

/* ===== DRAW GAME ===== */
function draw() {
  if (isPaused) return;

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* FOOD */
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  /* SNAKE */
  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, box, box);
  });

  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  /* WALL HIT → RESTART */
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height
  ) {
    init();
    return;
  }

  /* EAT FOOD */
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

/* ===== DIRECTION (BUTTONS + KEYS) ===== */
function setDir(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

/* KEYBOARD SUPPORT */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") setDir("UP");
  if (e.key === "ArrowDown") setDir("DOWN");
  if (e.key === "ArrowLeft") setDir("LEFT");
  if (e.key === "ArrowRight") setDir("RIGHT");
});

/* ===== PAUSE / RESUME ===== */
function togglePause() {
  if (!isPaused) {
    clearInterval(game);
    isPaused = true;
  } else {
    game = setInterval(draw, 150);
    isPaused = false;
  }
}

/* ===== RESTART BUTTON ===== */
function restartGame() {
  init();
}

/* ===== START GAME FIRST TIME ===== */
init();
