const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 420;

let snake;
let direction;
let food;
let score;
let game;

function init() {
  snake = [{
  x: Math.floor(canvasSize / 2 / box) * box,
  y: Math.floor(canvasSize / 2 / box) * box
}];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = score;

 food = {
  x: Math.floor(Math.random() * (canvasSize / box)) * box,
  y: Math.floor(Math.random() * (canvasSize / box)) * box
}; 

  if (game) clearInterval(game);
  game = setInterval(draw, 200);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function changeDirection(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#22c55e" : "#16a34a";
    ctx.fillRect(part.x, part.y, box, box);
  });

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvasSize ||
    headY >= canvasSize ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(newHead);
}

function collision(head, body) {
  return body.some(
    (part) => part.x === head.x && part.y === head.y
  );
}

function restartGame() {
  init();
}

init();
