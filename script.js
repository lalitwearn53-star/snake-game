// ====== CANVAS SETUP ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
canvas.width = 300;
canvas.height = 300;

// ====== UI ELEMENTS ======
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const leaderboardEl = document.getElementById("leaderboardScore");
const pauseBtn = document.getElementById("pauseBtn");

// ====== GAME VARIABLES ======
let snake;
let food;
let dir;
let score;
let paused = false;
let game;

// ====== HIGH SCORE ======
let highScore = localStorage.getItem("highScore")
  ? parseInt(localStorage.getItem("highScore"))
  : 0;

highScoreEl.innerText = highScore;
leaderboardEl.innerText = highScore === 0 ? "No score yet" : highScore;

// ====== RANDOM FOOD ======
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// ====== START / RESTART GAME ======
function startGame() {
  snake = [{ x: box * 5, y: box * 5 }];
  food = randomFood();
  dir = "RIGHT";
  score = 0;
  paused = false;

  scoreEl.innerText = score;
  pauseBtn.innerText = "⏸";

  clearInterval(game);
  game = setInterval(draw, 120);
}

startGame();

// ====== DRAW LOOP ======
function draw() {
  if (paused) return;

  // Background
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#16a34a";
    ctx.fillRect(s.x, s.y, box, box);
  });

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Head position
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (dir === "LEFT") headX -= box;
  if (dir === "UP") headY -= box;
  if (dir === "RIGHT") headX += box;
  if (dir === "DOWN") headY += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    scoreEl.innerText = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // ====== COLLISION (PERFECT FIX) ======
  if (
    headX < 0 ||
    headY < 0 ||
    headX > canvas.width - box ||
    headY > canvas.height - box ||
    snake.some(s => s.x === newHead.x && s.y === newHead.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(newHead);
}

// ====== GAME OVER ======
function gameOver() {
  clearInterval(game);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  highScoreEl.innerText = highScore;
  leaderboardEl.innerText = highScore;

  alert("Game Over! Score: " + score);
}

// ====== CONTROLS ======
function changeDir(d) {
  if (d === "LEFT" && dir !== "RIGHT") dir = "LEFT";
  if (d === "UP" && dir !== "DOWN") dir = "UP";
  if (d === "RIGHT" && dir !== "LEFT") dir = "RIGHT";
  if (d === "DOWN" && dir !== "UP") dir = "DOWN";
}

// ====== PAUSE ======
function togglePause() {
  paused = !paused;
  pauseBtn.innerText = paused ? "▶" : "⏸";
}

// ====== RESTART ======
function restartGame() {
  startGame();
}
