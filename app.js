const grid = document.getElementById("grid");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const startBtn = document.getElementById("start");
const messageEl = document.getElementById("message");

const holes = [];
const HOLE_COUNT = 9;
const GAME_DURATION = 30;
const BASE_INTERVAL = 900;
const MIN_INTERVAL = 280;
let activeIndex = null;
let score = 0;
let timeLeft = GAME_DURATION;
let running = false;
let spawnTimeout = null;
let timerInterval = null;

const emojis = {
  mole: "🐹",
  dirt: "🕳️",
  hit: "💥",
  miss: "🌱",
};

function createGrid() {
  grid.innerHTML = "";
  holes.length = 0;
  for (let i = 0; i < HOLE_COUNT; i += 1) {
    const hole = document.createElement("button");
    hole.className = "hole";
    hole.type = "button";
    hole.dataset.index = String(i);
    hole.textContent = emojis.dirt;
    hole.addEventListener("click", () => handleWhack(i));
    holes.push(hole);
    grid.appendChild(hole);
  }
}

function setActive(index) {
  if (activeIndex !== null) {
    holes[activeIndex].classList.remove("active");
    holes[activeIndex].textContent = emojis.dirt;
  }
  activeIndex = index;
  if (activeIndex !== null) {
    holes[activeIndex].classList.add("active");
    holes[activeIndex].textContent = emojis.mole;
  }
}

function handleWhack(index) {
  if (!running) {
    return;
  }
  if (index === activeIndex) {
    score += 1;
    scoreEl.textContent = score;
    holes[index].textContent = emojis.hit;
    holes[index].classList.add("flash");
    messageEl.textContent = "Nice hit!";
    setTimeout(() => {
      holes[index].classList.remove("flash");
    }, 240);
    setActive(null);
  } else {
    holes[index].textContent = emojis.miss;
    holes[index].classList.add("flash");
    messageEl.textContent = "Miss!";
    setTimeout(() => {
      holes[index].classList.remove("flash");
      if (index !== activeIndex) {
        holes[index].textContent = emojis.dirt;
      }
    }, 240);
  }
}

function getInterval() {
  const progress = (GAME_DURATION - timeLeft) / GAME_DURATION;
  const interval = BASE_INTERVAL - progress * (BASE_INTERVAL - MIN_INTERVAL);
  const speed = (BASE_INTERVAL / interval).toFixed(1);
  speedEl.textContent = speed;
  return interval;
}

function scheduleSpawn() {
  if (!running) {
    return;
  }
  const interval = getInterval();
  spawnTimeout = setTimeout(() => {
    const next = Math.floor(Math.random() * HOLE_COUNT);
    setActive(next);
    scheduleSpawn();
  }, interval);
}

function startGame() {
  if (running) {
    return;
  }
  score = 0;
  timeLeft = GAME_DURATION;
  running = true;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  speedEl.textContent = "1.0";
  messageEl.textContent = "Go!";
  startBtn.disabled = true;
  setActive(null);
  scheduleSpawn();
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  running = false;
  clearTimeout(spawnTimeout);
  clearInterval(timerInterval);
  setActive(null);
  startBtn.disabled = false;
  messageEl.textContent = `Time! Final score: ${score}`;
}

startBtn.addEventListener("click", startGame);
createGrid();
