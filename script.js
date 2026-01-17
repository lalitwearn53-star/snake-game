import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const leaderboardList = document.getElementById("leaderboardList");

const upBtn = document.getElementById("up");
const downBtn = document.getElementById("down");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const pauseBtn = document.getElementById("pause");
const restartBtn = document.getElementById("restart");

const box = 15;
let snake, food, dir, score, game, paused = false;

// ================= INIT =================
function initGame() {
  snake = [{ x: 150, y: 150 }];
  food = randomFood();
  dir = null;
  score = 0;
  paused = false;
  scoreEl.innerText = 0;
  clearInterval(game);
  game = setInterval(draw, 120);
}

initGame();
loadTopScore();

// ================= FOOD =================
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// ================= DRAW =================
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
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { ...snake[0] };

  if (dir === "LEFT") head.x -= box;
  if (dir === "RIGHT") head.x += box;
  if (dir === "UP") head.y -= box;
  if (dir === "DOWN") head.y += box;

  // GAME OVER
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(game);
    saveScore(score);
    alert("Game Over!");
    return;
  }

  // EAT FOOD
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.innerText = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

// ================= HELPERS =================
function collision(head, arr) {
  return arr.some(p => p.x === head.x && p.y === head.y);
}

// ================= CONTROLS =================
upBtn.onclick = () => dir !== "DOWN" && (dir = "UP");
downBtn.onclick = () => dir !== "UP" && (dir = "DOWN");
leftBtn.onclick = () => dir !== "RIGHT" && (dir = "LEFT");
rightBtn.onclick = () => dir !== "LEFT" && (dir = "RIGHT");

pauseBtn.onclick = () => {
  paused = !paused;
  pauseBtn.innerText = paused ? "▶️" : "⏸️";
};

restartBtn.onclick = () => initGame();

// ================= FIREBASE =================
function saveScore(score) {
  const dbRef = ref(window.db, "topScore");
  get(dbRef).then(snapshot => {
    const old = snapshot.exists() ? snapshot.val().score : 0;
    if (score > old) {
      set(dbRef, {
        name: "Player",
        score: score
      });
      highScoreEl.innerText = score;
      loadTopScore();
    }
  });
}

function loadTopScore() {
  leaderboardList.innerHTML = "<li>Loading...</li>";
  const dbRef = ref(window.db);
  get(child(dbRef, "topScore")).then(snapshot => {
    leaderboardList.innerHTML = "";
    if (snapshot.exists()) {
      const data = snapshot.val();
      leaderboardList.innerHTML = `<li>🥇 ${data.name} - ${data.score}</li>`;
      highScoreEl.innerText = data.score;
    } else {
      leaderboardList.innerHTML = "<li>No score yet</li>";
    }
  });
}
