let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const leaderboardEl = document.getElementById("leaderboardScore");

highScoreEl.innerText = highScore;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

const upBtn = document.getElementById("up");
const downBtn = document.getElementById("down");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const pauseBtn = document.getElementById("pause");

const box = 15;
let snake, food, dir, score, game, paused = false;

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

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function draw() {
  if (paused) return;

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#16a34a";
    ctx.fillRect(s.x, s.y, box, box);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { ...snake[0] };

  if (dir === "LEFT") head.x -= box;
  if (dir === "RIGHT") head.x += box;
  if (dir === "UP") head.y -= box;
  if (dir === "DOWN") head.y += box;

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(p => p.x === head.x && p.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over");
    startGame();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.innerText = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

upBtn.onclick = () => dir !== "DOWN" && (dir = "UP");
downBtn.onclick = () => dir !== "UP" && (dir = "DOWN");
leftBtn.onclick = () => dir !== "RIGHT" && (dir = "LEFT");
rightBtn.onclick = () => dir !== "LEFT" && (dir = "RIGHT");

pauseBtn.onclick = () => {
  paused = !paused;
  pauseBtn.innerText = paused ? "▶️" : "⏸️";
};
