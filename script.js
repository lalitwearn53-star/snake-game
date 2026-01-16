const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 360;
const speed = 150;

let snake;
let direction;
let food;
let score;
let highScore = localStorage.getItem("highScore") || 0;

let gameInterval = null;
let isPaused = false;

document.getElementById("highScore").innerText = highScore;

function init() {
  snake = [{ x: 160, y: 160 }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = score;

  food = randomFood();

  stopGameLoop();
  startGameLoop();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

function startGameLoop() {
  gameInterval = setInterval(draw, speed);
}

function stopGameLoop() {
  clearInterval(gameInterval);
  gameInterval = null;
}

function togglePause() {
  const btn = document.getElementById("pauseBtn");

  if (isPaused) {
    startGameLoop();
    btn.innerHTML = "⏸";
    isPaused = false;
  } else {
    stopGameLoop();
    btn.innerHTML = "▶";
    isPaused = true;
  }
}

function restartGame() {
  isPaused = false;
  document.getElementById("pauseBtn").innerHTML = "⏸";
  init();
}

function setDir(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

function collision(head, arr) {
  return arr.some(seg => seg.x === head.x && seg.y === head.y);
}

function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // FOOD
  ctx.fillStyle = "lime";
  ctx.fillRect(food.x, food.y, box, box);

  // SNAKE
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "red" : "#22c55e";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // GAME OVER
  if (
    headX < 0 || headY < 0 ||
    headX >= canvasSize || headY >= canvasSize ||
    collision({ x: headX, y: headY }, snake)
  ) {
    stopGameLoop();
    alert("Game Over");
    return;
  }

  let newHead = { x: headX, y: headY };

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

// START GAME
init();
