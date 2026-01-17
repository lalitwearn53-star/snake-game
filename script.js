document.addEventListener("DOMContentLoaded", () => {

  // ===== CANVAS =====
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const box = 20;

  // ===== GAME STATE =====
  let snake = [];
  let food = {};
  let dir = "RIGHT";
  let score = 0;
  let highScore = Number(localStorage.getItem("highScore")) || 0;
  let game = null;
  let paused = false;

  // ===== UI =====
  const scoreEl = document.getElementById("score");
  const highScoreEl = document.getElementById("highScore");
  const pauseBtn = document.getElementById("pauseBtn");

  highScoreEl.innerText = highScore;

  // ===== RANDOM FOOD =====
  function randomFood() {
    return {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  }

  // ===== START / RESTART =====
  function startGame() {
    snake = [{ x: box * 5, y: box * 5 }]; // safe start
    food = randomFood();
    dir = "RIGHT";
    score = 0;
    paused = false;

    scoreEl.innerText = score;
    pauseBtn.innerText = "⏸";

    if (game) clearInterval(game);
    game = setInterval(draw, 160);
  }

  // ===== DRAW LOOP =====
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

    // Head movement
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

    // ===== COLLISION (FINAL FIX) =====
    if (
      headX < 0 ||
      headY < 0 ||
      headX + box > canvas.width ||
      headY + box > canvas.height ||
      snake.some(s => s.x === newHead.x && s.y === newHead.y)
    ) {
      clearInterval(game);

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreEl.innerText = highScore;
      }

      alert("Game Over! Score: " + score);
      return;
    }

    snake.unshift(newHead);
  }

  // ===== CONTROLS =====
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

  // ===== AUTO START =====
  startGame();
});
