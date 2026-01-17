// --- Word banks ---
const NORMAL_WORDS = [
  "apple","banana","chair","window","table",
  "school","house","car","book","forest",
  "river","sun","moon","flower","dog"
];

const HARRY_POTTER_WORDS = [
  "quidditch","horcrux","muggle","wand","gryffindor",
  "slytherin","hufflepuff","ravenclaw","diagon","privet",
  "butterbeer","patronus","basilisk","invisibility","horntail"
];

// --- DOM elements ---
const rope = document.getElementById("rope");
const input = document.getElementById("typingInput");
const result = document.getElementById("result");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("gameContainer");
const wordsRow = document.getElementById("wordsRow");

// --- Lines for words ---
const currentLineEl = document.createElement("div");
currentLineEl.id = "currentLine";
const nextLineEl = document.createElement("div");
nextLineEl.id = "nextLine";
wordsRow.appendChild(currentLineEl);
wordsRow.appendChild(nextLineEl);

// --- Game state ---
let ropePercent = 50; 
let gameOver = false;
let computerInterval;
let typedWords = []; // words typed on current line
let lines = [];      // array of lines (each line is array of words)
const LINE_LENGTH = 10; // words per line

let currentDifficulty = "easy";
let currentWordSet = "normal";

const PLAYER_PULL = 3; // % per correct word
const DIFFICULTY_SETTINGS = {
  easy: { speed: 600, computerPull: 1.5 },
  hard: { speed: 300, computerPull: 3 }
};

// --- Helpers ---
function randomWord() {
  const bank = currentWordSet === "normal" ? NORMAL_WORDS : HARRY_POTTER_WORDS;
  return bank[Math.floor(Math.random() * bank.length)];
}

// --- Initialize first 2 lines ---
function initLines() {
  lines = [];
  typedWords = [];
  for (let i = 0; i < 2; i++) {
    const line = [];
    for (let j = 0; j < LINE_LENGTH; j++) line.push(randomWord());
    lines.push(line);
  }
  updateWords();
}

// --- Update word display with static lines ---
function updateWords() {
  const typed = input.value;

  // --- Shift lines if current line fully typed ---
  if (typedWords.length >= lines[0].length) {
    typedWords = []; // reset typedWords for new line
    lines.shift();   // remove first line
    // generate new line at bottom
    const newLine = [];
    for (let i = 0; i < LINE_LENGTH; i++) newLine.push(randomWord());
    lines.push(newLine);
    input.value = ""; // clear input
  }

  // --- Render current line ---
  currentLineEl.innerHTML = "";
  lines[0].forEach((word, idx) => {
    if (idx < typedWords.length) {
      const span = document.createElement("span");
      span.textContent = word + " ";
      span.className = "correct";
      currentLineEl.appendChild(span);
    } else if (idx === typedWords.length) {
      const container = document.createElement("span");
      let cursorAdded = false;
      for (let i = 0; i < word.length; i++) {
        if (!cursorAdded && i === typed.length) {
          const cursor = document.createElement("span");
          cursor.className = "cursor";
          container.appendChild(cursor);
          cursorAdded = true;
        }
        const letter = document.createElement("span");
        letter.className = i < typed.length ? (typed[i] === word[i] ? "correct" : "incorrect") : "remaining";
        letter.textContent = word[i];
        container.appendChild(letter);
      }
      if (!cursorAdded) {
        const cursor = document.createElement("span");
        cursor.className = "cursor";
        container.appendChild(cursor);
      }
      container.appendChild(document.createTextNode(" "));
      currentLineEl.appendChild(container);
    } else {
      const span = document.createElement("span");
      span.textContent = word + " ";
      span.className = "remaining";
      currentLineEl.appendChild(span);
    }
  });

  // --- Render next line ---
  nextLineEl.innerHTML = "";
  lines[1].forEach(word => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.className = "remaining";
    nextLineEl.appendChild(span);
  });

  // Scroll cursor into view
  const cursor = currentLineEl.querySelector(".cursor");
  if (cursor) cursor.scrollIntoView({ behavior: "smooth", inline: "nearest" });
}

// --- Rope ---
function updateRopePosition() {
  const container = document.getElementById("ropeContainer");
  const containerWidth = container.offsetWidth;
  const ropeWidth = rope.offsetWidth;
  const leftPx = (ropePercent / 100) * (containerWidth - ropeWidth);
  rope.style.left = leftPx + "px";
  if (ropePercent <= 0) endGame("Computer wins!");
  if (ropePercent >= 100) endGame("You win!");
}
function moveRope(amountPercent) {
  ropePercent += amountPercent;
  if (ropePercent < 0) ropePercent = 0;
  if (ropePercent > 100) ropePercent = 100;
  updateRopePosition();
}

// --- Player typing ---
input.addEventListener("input", () => {
  if (gameOver) return;
  updateWords();
  if (input.value.endsWith(" ")) {
    const typedWord = input.value.trim();
    const nextWord = lines[0][typedWords.length];
    if (typedWord === nextWord) {
      typedWords.push(nextWord);
      moveRope(PLAYER_PULL);
    }
    input.value = "";
    updateWords();
  }
});

// --- Computer ---
function startComputer() {
  clearInterval(computerInterval);
  const settings = DIFFICULTY_SETTINGS[currentDifficulty];
  computerInterval = setInterval(() => {
    if (!gameOver) moveRope(-settings.computerPull);
  }, settings.speed);
}

// --- Game flow ---
function endGame(message) {
  gameOver = true;
  result.textContent = message;
  clearInterval(computerInterval);
  setTimeout(() => {
    menu.style.display = "block";
    gameContainer.style.display = "none";
    result.textContent = "";
  }, 1500);
}

// --- Start button ---
startBtn.addEventListener("click", () => {
  currentDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
  currentWordSet = document.querySelector('input[name="wordset"]:checked').value;
  menu.style.display = "none";
  gameContainer.style.display = "flex";
  resetGame();
  input.focus();
});

// --- Reset game ---
function resetGame() {
  gameOver = false;
  ropePercent = 50;
  updateRopePosition();
  input.value = "";
  initLines();
  startComputer();
}
