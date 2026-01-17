const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 15;

// ---------- GAME VARIABLES ----------
let snake, food, dir, score, game, paused = false;

// ---------- SCORE SYSTEM ----------
let highScore = localStorage.getItem("highScore") || 0;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const leaderboardEl = document.getElementById("leaderboardScore");

highScoreEl.innerText = highScore;
if (highScore > 0) leaderboardEl.innerText = highScore;

// ---------- START GAME ----------
function startGame() {
  snake = [{ x: 150, y: 150 }];
  food = randomFood();
  dir = "RIGHT";
  score = 0;
  paused = false;
  scoreEl.innerText = score;
  clearInterval(game);
  game = setInterval(draw, 120);
}

startGame();

// ---------- RANDOM FOOD ----------
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// ---------- DRAW ----------
function draw() {
  if (paused) return;

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

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (dir === "LEFT") headX -= box;
  if (dir === "UP") headY -= box;
  if (dir === "RIGHT") headX += box;
  if (dir === "DOWN") headY += box;

  // ---------- FOOD EAT ----------
  if (headX === food.x && headY === food.y) {
    score++;
    scoreEl.innerText = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // ---------- COLLISION ----------
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    gameOver();
    return;
  }

  snake.unshift(newHead);
}

// ---------- SELF COLLISION ----------
function collision(head, array) {
  return array.some(s => s.x === head.x && s.y === head.y);
}

// ---------- GAME OVER ----------
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

// ---------- CONTROLS ----------
function changeDir(d) {
  if (d === "LEFT" && dir !== "RIGHT") dir = "LEFT";
  if (d === "UP" && dir !== "DOWN") dir = "UP";
  if (d === "RIGHT" && dir !== "LEFT") dir = "RIGHT";
  if (d === "DOWN" && dir !== "UP") dir = "DOWN";
}

function togglePause() {
  paused = !paused;
}

function restartGame() {
  startGame();
}
