document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const box = 20;
  let snake = [];
  let food = {};
  let dir = "RIGHT";
  let score = 0;
  let game = null;
  let paused = false;

  const scoreEl = document.getElementById("score");
  const pauseBtn = document.getElementById("pauseBtn");

  function randomFood() {
    return {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  }

  function startGame() {
    snake = [{ x: box * 5, y: box * 5 }];
    food = randomFood();
    dir = "RIGHT";
    score = 0;
    paused = false;

    scoreEl.innerText = score;
    pauseBtn.innerText = "⏸";

    if (game) clearInterval(game);
    game = setInterval(draw, 150);
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

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (dir === "LEFT") headX -= box;
    if (dir === "UP") headY -= box;
    if (dir === "RIGHT") headX += box;
    if (dir === "DOWN") headY += box;

    if (headX === food.x && headY === food.y) {
      score++;
      scoreEl.innerText = score;
      food = randomFood();
    } else {
      snake.pop();
    }

    const newHead = { x: headX, y: headY };

    // COLLISION
    if (
      headX < 0 ||
      headY < 0 ||
      headX > canvas.width - box ||
      headY > canvas.height - box ||
      snake.some(s => s.x === newHead.x && s.y === newHead.y)
    ) {
      clearInterval(game);
      alert("Game Over! Score: " + score);
      return;
    }

    snake.unshift(newHead);
  }

  // CONTROLS
  window.changeDir = function(d) {
    if (d === "LEFT" && dir !== "RIGHT") dir = "LEFT";
    if (d === "UP" && dir !== "DOWN") dir = "UP";
    if (d === "RIGHT" && dir !== "LEFT") dir = "RIGHT";
    if (d === "DOWN" && dir !== "UP") dir = "DOWN";
  };

  window.togglePause = function() {
    paused = !paused;
    pauseBtn.innerText = paused ? "▶" : "⏸";
  };

  window.restartGame = function() {
    startGame();
  };

  // AUTO START
  startGame();
});
