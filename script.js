  const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ===== SIZE (BIG BOX) ===== */
canvas.width = 360;
canvas.height = 360;

const box = 20;

let snake;
let direction;
let food;
let score;
let game;

/* ===== START GAME ===== */
function init() {
  snake = [{ x: 160, y: 160 }];
  direction = "RIGHT";
  score = 0;

  document.getElementById("score").innerText = score;

  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };

  if (game) clearInterval(game);
  game = setInterval(draw, 150);
}

/* ===== CONTROLS ===== */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

/* ===== DRAW ===== */
function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // snake
  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, box, box);
  });

  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // wall hit
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

/* ===== BUTTON FUNCTIONS ===== */
function setDir(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

function restartGame() {
  init();
}

/* ===== START ===== */
init();
