let cl = console.log;

// DOM Elements
const container = document.getElementById("container");
const btn = document.getElementById("btn");
const scoreWrapper = document.getElementById("score");
const timerWrapper = document.getElementById("timer");

// variables
let score = 0;
let time = 10;

// timer
const timer = setInterval(() => {
  time--;
  timerWrapper.innerHTML = time;
  if (time <= 0) {
    gameOver();
  }
}, 1000);

// add event listener
btn.addEventListener("click", onButtonClick);

// functions
function onButtonClick() {
  btn.classList.add("clicked");
  setTimeout(() => {
    btn.classList.remove("clicked");
  }, 300);
  moveBtn();
  updateScore();
}

function moveBtn() {
  const btnWidth = btn.clientWidth;
  const btnHeight = btn.clientHeight;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  let x = Math.max(0, Math.floor(Math.random() * (containerWidth - btnWidth)));
  let y = Math.max(
    0,
    Math.floor(Math.random() * (containerHeight - btnHeight))
  );

  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
}

function updateScore() {
  score++;
  scoreWrapper.textContent = score;
}

// game over
function gameOver() {
  clearInterval(timer);
  alert("Game Over");
  btn.removeEventListener("click", onButtonClick);
}
