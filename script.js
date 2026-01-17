// ===============================
// 🔥 FIREBASE LEADERBOARD SETUP
// ===============================
import {
  ref,
  push,
  onValue,
  query,
  orderByChild,
  limitToLast
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const scoresRef = ref(window.db, "scores");

// ===============================
// 🎮 GAME VARIABLES
// ===============================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

const box = 15;
let score = 0;
let direction = "RIGHT";
let gameRunning = true;

let snake = [{ x: 5 * box, y: 5 * box }];
let food = randomFood();

// ===============================
// 🎯 CONTROLS
// ===============================
document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// ===============================
// 🍎 FOOD
// ===============================
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// ===============================
// 🐍 DRAW GAME
// ===============================
function draw() {
  if (!gameRunning) return;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(s.x, s.y, box, box);
  });

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // Collision
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

  document.getElementById("score").innerText = score;
}

// ===============================
// ❌ COLLISION
// ===============================
function collision(head, body) {
  return body.some(p => p.x === head.x && p.y === head.y);
}

// ===============================
// 💀 GAME OVER
// ===============================
function gameOver() {
  gameRunning = false;
  alert("Game Over! Score: " + score);
  saveScoreOnline(score);
  resetGame();
}

// ===============================
// 🔄 RESET
// ===============================
function resetGame() {
  score = 0;
  direction = "RIGHT";
  snake = [{ x: 5 * box, y: 5 * box }];
  food = randomFood();
  gameRunning = true;
}

// ===============================
// ☁️ SAVE SCORE TO FIREBASE
// ===============================
function saveScoreOnline(score) {
  const name = prompt("Enter your name") || "Player";
  push(scoresRef, {
    name: name,
    score: score,
    time: Date.now()
  });
}

// ===============================
// 🏆 LOAD GLOBAL LEADERBOARD
// ===============================
function loadLeaderboard() {
  const q = query(scoresRef, orderByChild("score"), limitToLast(10));

  onValue(q, snapshot => {
    const list = document.getElementById("leaderboardList");
    list.innerHTML = "";

    const data = [];
    snapshot.forEach(child => data.push(child.val()));

    data.reverse().forEach((p, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${p.name} - ${p.score}`;
      list.appendChild(li);
    });
  });
}

// ===============================
// 🚀 START
// ===============================
window.onload = () => {
  loadLeaderboard();
  setInterval(draw, 120);
};
