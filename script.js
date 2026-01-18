window.addEventListener("DOMContentLoaded", () => {
  // --- DOM elements ---
  const input = document.getElementById("typingInput");
  const result = document.getElementById("result");
  const menu = document.getElementById("menu");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");
  const wordsRow = document.getElementById("wordsRow");

  const beamLeft = document.getElementById("beamLeft");
  const beamRight = document.getElementById("beamRight");
  const clashPoint = document.getElementById("clashPoint");

  // --- Lines for words ---
  const currentLineEl = document.createElement("div");
  currentLineEl.id = "currentLine";
  const nextLineEl = document.createElement("div");
  nextLineEl.id = "nextLine";
  wordsRow.appendChild(currentLineEl);
  wordsRow.appendChild(nextLineEl);

  // --- Game state ---
  let ropePosition = 325; // middle start
  let gameOver = false;
  let computerInterval;
  let typedWords = [];
  let lines = [];

  let currentDifficulty = "easy";
  let currentWordSet = "normal";

  const PLAYER_PULL = 30; // pixels per correct word
  const DIFFICULTY_SETTINGS = {
    easy: { speed: 600, computerPull: 10 },
    hard: { speed: 300, computerPull: 20 }
  };

  // --- Word banks ---
  const NORMAL_WORDS = ["apple","banana","chair","window","table"];
  const HARRY_POTTER_WORDS = ["chamber of secrets","expecto patronum","quidditch","horcrux","butterbeer"];

  // --- Helpers ---
  function randomWord() {
    const bank = currentWordSet === "normal" ? NORMAL_WORDS : HARRY_POTTER_WORDS;
    return bank[Math.floor(Math.random() * bank.length)];
  }

  function getLineLength() {
    return currentWordSet === "harry" ? 5 : 10;
  }

  // --- Initialize first 2 lines ---
  function initLines() {
    lines = [];
    typedWords = [];
    for (let i = 0; i < 2; i++) {
      const line = [];
      for (let j = 0; j < getLineLength(); j++) {
        line.push(randomWord());
      }
      lines.push(line);
    }
    updateWords();
  }

  // --- Update word display ---
  function updateWords() {
    const typed = input.value;

    // --- Shift lines if first line fully typed ---
    if (typedWords.length >= lines[0].length) {
      typedWords = [];
      lines.shift();
      const newLine = [];
      for (let i = 0; i < getLineLength(); i++) newLine.push(randomWord());
      lines.push(newLine);
      input.value = "";
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
  }

  // --- Rope & Beams ---
  function moveRope(amount) {
    ropePosition += amount;
    ropePosition = Math.max(0, Math.min(650, ropePosition));
    updateVisuals();

    if (ropePosition === 0) endGame("Computer wins!");
    if (ropePosition === 650) endGame("You win!");
  }

  function updateVisuals() {
    clashPoint.style.left = ropePosition + "px";

    const leftWandOffset = 110;
    const rightWandOffset = 110;
    const containerWidth = 700;

    let leftWidth = ropePosition - leftWandOffset;
    beamLeft.style.width = Math.max(0, leftWidth) + "px";

    let rightWidth = (containerWidth - ropePosition) - rightWandOffset;
    beamRight.style.width = Math.max(0, rightWidth) + "px";
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

  // --- Computer AI ---
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

  function startCountdown(callback) {
    const countdownEl = document.getElementById("countdown");
    countdownEl.style.display = "block";
    let count = 3;

    countdownEl.textContent = count;

   const interval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
      } else {
        clearInterval(interval);
        countdownEl.style.display = "none";
        if (callback) callback();
      }
    }, 1000);
  }
  // --- Start button ---
  startBtn.addEventListener("click", () => {
    currentDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    currentWordSet = document.querySelector('input[name="wordset"]:checked').value;

    menu.style.display = "none";
    gameContainer.style.display = "flex";
    // Hide typing game elements initially
    wordsRow.style.display = "none";
    input.style.display = "none";

    // Hide beams and clash point
    beamLeft.classList.add("hidden-during-countdown");
    beamRight.classList.add("hidden-during-countdown");
    clashPoint.classList.add("hidden-during-countdown");

    // Start countdown
    startCountdown(() => {
      // After countdown ends, show typing game
      wordsRow.style.display = "block";
      input.style.display = "block";

      // Show battlefield elements
      beamLeft.classList.remove("hidden-during-countdown");
      beamRight.classList.remove("hidden-during-countdown");
      clashPoint.classList.remove("hidden-during-countdown");

      resetGame();
      input.focus();
    });
  });




  // --- Reset game ---
  function resetGame() {
    gameOver = false;
    ropePosition = 325;
    updateVisuals();
    input.value = "";
    initLines();
    startComputer();
  }
});
