// --- Word banks ---
const NORMAL_WORDS = [
  "apple", "banana", "chair", "window", "table",
  "school", "house", "car", "book", "forest",
  "river", "sun", "moon", "flower", "dog"
];

const HARRY_POTTER_WORDS = [
  "quidditch", "horcrux", "muggle", "wand", "gryffindor",
  "slytherin", "hufflepuff", "ravenclaw", "diagon", "privet",
  "butterbeer", "patronus", "basilisk", "invisibility", "horntail", "ollivanders"
];

const rope = document.getElementById("rope");
const currentWordEl = document.getElementById("currentWord");
const upcomingWordsEl = document.getElementById("upcomingWords");
const input = document.getElementById("typingInput");
const result = document.getElementById("result");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("gameContainer");

let ropePosition = 325;
let gameOver = false;
let computerInterval;

let currentDifficulty = "easy";
const NUM_UPCOMING = 5;

// SAME speed/pull for both difficulties
const GAME_SETTINGS = { speed: 400, computerPull: 15, playerPull: 20 };

let wordsQueue = [];

/* --- Helper Functions --- */

// Pick a word based on current difficulty
function randomWord() {
  if (currentDifficulty === "easy") {
    return NORMAL_WORDS[Math.floor(Math.random() * NORMAL_WORDS.length)];
  } else {
    return HARRY_POTTER_WORDS[Math.floor(Math.random() * HARRY_POTTER_WORDS.length)];
  }
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

  // Dynamically position upcoming words to avoid overlap
  const currentWordWidth = currentWordEl.offsetWidth;
  upcomingWordsEl.style.left = `calc(50% + ${currentWordWidth / 2 + 20}px)`;
}

function moveRope(amount) {
  ropePosition += amount;
  ropePosition = Math.max(0, Math.min(650, ropePosition));
  rope.style.left = ropePosition + "px";

  if (ropePosition === 0) {
    endGame("Computer wins!");
  } else if (ropePosition === 650) {
    endGame("You win!");
  }
}

/* --- Game Events --- */

// Player typing
input.addEventListener("input", () => {
  if (gameOver) return;

  if (input.value.trim() === wordsQueue[0]) {
    moveRope(GAME_SETTINGS.playerPull);

    wordsQueue.shift();
    wordsQueue.push(randomWord());
    updateWords();

    input.value = "";
  }
});

// Computer pull
function startComputer() {
  clearInterval(computerInterval);
  computerInterval = setInterval(() => {
    if (!gameOver) moveRope(-GAME_SETTINGS.computerPull);
  }, GAME_SETTINGS.speed);
}

// End game
function endGame(text) {
  gameOver = true;
  result.textContent = text;
  clearInterval(computerInterval);

  // Show menu again after short delay
  setTimeout(() => {
    menu.style.display = "block";
    gameContainer.style.display = "none";
    result.textContent = "";
  }, 1000);
}

// Start Game button
startBtn.addEventListener("click", () => {
  const selected = document.querySelector('input[name="difficulty"]:checked');
  currentDifficulty = selected.value;

  menu.style.display = "none";
  gameContainer.style.display = "flex";

  resetGame();

  // Focus the input box automatically
  input.focus();
});

/* --- Reset Game --- */
function resetGame() {
  gameOver = false;
  ropePosition = 325;
  rope.style.left = ropePosition + "px";
  input.value = "";
  initWords();
  startComputer();
}
