// --- Word banks ---
const NORMAL_WORDS = [
  "apple", "banana", "chair", "window", "table",
  "school", "house", "car", "book", "forest",
  "river", "sun", "moon", "flower", "dog"
];

const HARRY_POTTER_WORDS = [
  "quidditch", "horcrux", "muggle", "wand", "gryffindor",
  "slytherin", "hufflepuff", "ravenclaw", "diagon", "privet",
  "butterbeer", "patronus", "basilisk", "invisibility", "horntail"
];

// --- DOM ---
const rope = document.getElementById("rope");
const currentWordEl = document.getElementById("currentWord");
const upcomingWordsEl = document.getElementById("upcomingWords");
const input = document.getElementById("typingInput");
const result = document.getElementById("result");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("gameContainer");

// --- Game State ---
let ropePosition = 325;
let gameOver = false;
let computerInterval;

let currentDifficulty = "easy";
let currentWordSet = "normal";

const NUM_UPCOMING = 5;
const PLAYER_PULL = 20;

// Difficulty affects ONLY computer
const DIFFICULTY_SETTINGS = {
  easy: {
    speed: 600,
    computerPull: 8
  },
  hard: {
    speed: 300,
    computerPull: 18
  }
};

let wordsQueue = [];

/* --- Helpers --- */
function randomWord() {
  const bank =
    currentWordSet === "normal" ? NORMAL_WORDS : HARRY_POTTER_WORDS;
  return bank[Math.floor(Math.random() * bank.length)];
}

function initWords() {
  wordsQueue = [];
  for (let i = 0; i < NUM_UPCOMING + 1; i++) {
    wordsQueue.push(randomWord());
  }
  updateWords();
}

function updateWords() {
  currentWordEl.textContent = wordsQueue[0];
  upcomingWordsEl.textContent = wordsQueue.slice(1).join(" ");

  const currentWordWidth = currentWordEl.offsetWidth;
  upcomingWordsEl.style.left = `calc(50% + ${currentWordWidth / 2 + 20}px)`;
}

function moveRope(amount) {
  ropePosition += amount;
  ropePosition = Math.max(0, Math.min(650, ropePosition));
  rope.style.left = ropePosition + "px";

  if (ropePosition === 0) endGame("Computer wins!");
  if (ropePosition === 650) endGame("You win!");
}

/* --- Player Input --- */
input.addEventListener("input", () => {
  if (gameOver) return;

  if (input.value.trim() === wordsQueue[0]) {
    moveRope(PLAYER_PULL);

    wordsQueue.shift();
    wordsQueue.push(randomWord());
    updateWords();
    input.value = "";
  }
});

/* --- Computer --- */
function startComputer() {
  clearInterval(computerInterval);

  const settings = DIFFICULTY_SETTINGS[currentDifficulty];

  computerInterval = setInterval(() => {
    if (!gameOver) moveRope(-settings.computerPull);
  }, settings.speed);
}

/* --- Game Flow --- */
function endGame(text) {
  gameOver = true;
  result.textContent = text;
  clearInterval(computerInterval);

  setTimeout(() => {
    menu.style.display = "block";
    gameContainer.style.display = "none";
    result.textContent = "";
  }, 1000);
}

startBtn.addEventListener("click", () => {
  currentDifficulty =
    document.querySelector('input[name="difficulty"]:checked').value;

  currentWordSet =
    document.querySelector('input[name="wordset"]:checked').value;

  menu.style.display = "none";
  gameContainer.style.display = "flex";

  resetGame();
  input.focus();
});

function resetGame() {
  gameOver = false;
  ropePosition = 325;
  rope.style.left = ropePosition + "px";
  input.value = "";
  initWords();
  startComputer();
}
