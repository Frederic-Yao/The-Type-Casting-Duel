// Using DOMContentLoaded for all functions since we want to ensure that HTML is fully loaded before accessing elements
window.addEventListener("DOMContentLoaded", () => {
  // --- DOM elements, declaring variables and getting access to html elements ---
  const input = document.getElementById("typing-input");
  const result = document.getElementById("result");
  const menu = document.getElementById("menu");
  const startBtn = document.getElementById("start-btn");
  const gameContainer = document.getElementById("game-container");
  const wordsRow = document.getElementById("words-row");

  const beamLeft = document.getElementById("beam-left");
  const beamRight = document.getElementById("beam-right");
  const clashPoint = document.getElementById("clash-point");

  const countdownEl = document.getElementById("countdown");
  const endButtons = document.getElementById("end-buttons");
  const mainMenuBtn = document.getElementById("main-menu-btn");
  const playAgainBtn = document.getElementById("play-again-btn");

  const explosionLeft = document.getElementById("explosion-left");
  const explosionRight = document.getElementById("explosion-right");

  const charLeft = document.getElementById("char-left");
  const charRight = document.getElementById("char-right");

  const winLeft = document.getElementById("win-left");
  const winRight = document.getElementById("win-right");

  const charLeftNoSpell = document.getElementById("char-left-no-spell");
  const charRightNoSpell = document.getElementById("char-right-no-spell");

  // --- Lines for words ---
  const currentLineEl = document.createElement("div");
  currentLineEl.id = "currentLine";
  const nextLineEl = document.createElement("div");
  nextLineEl.id = "nextLine";
  // Append lines to words row (empty for now)
  wordsRow.appendChild(currentLineEl);
  wordsRow.appendChild(nextLineEl);

  // --- Game state ---
  let ropePosition = 325; // middle start, 650px wide container
  let gameOver = false;
  let computerInterval;
  let typedWords = [];
  let lines = [];

  let currentTyped = "";

  let currentDifficulty = "easy";
  let currentWordSet = "normal";

  let startTime;
  let totalCharacters = 0;

  const PLAYER_PULL = 30; // pixels pulled per correct word
  const DIFFICULTY_SETTINGS = {
    easy:   { speed: 600, computerPull: 5 },
    medium: { speed: 450, computerPull: 10 },
    hard:   { speed: 300, computerPull: 20 }
  };


  // --- Word banks ---
  const NORMAL_WORDS = [
"apple","banana","orange","grape","strawberry","watermelon","kiwi","blueberry","pineapple","mango",
"pear","peach","plum","apricot","cherry","fig","lime","lemon","coconut","papaya",
"avocado","melon","raspberry","blackberry","pomegranate","grapefruit","tangerine","nectarine","date","guava",
"passionfruit","dragonfruit","jackfruit","lychee","cantaloupe","honeydew","cranberry","currant","kumquat","persimmon",
"quince","olive","tomato","carrot","potato","broccoli","spinach","lettuce","kale","cabbage",
"cauliflower","celery","asparagus","zucchini","pumpkin","onion","garlic","pepper","chili","radish",
"turnip","beet","parsnip","eggplant","cucumber","squash","okra","leek","mushroom","basil",
"oregano","thyme","rosemary","parsley","cilantro","dill","mint","chive","sage","tarragon",
"bread","bagel","croissant","muffin","pancake","waffle","toast","biscuit","crackers","donut",
"cake","pie","brownie","cookie","tart","cupcake","pudding","jam","jelly","cheese",
"milk","yogurt","icecream","chocolate","butter","honey","sugar","salt","oil","vinegar",
"chair","table","sofa","bed","lamp","shelf","book","pen","pencil","notebook",
"computer","laptop","keyboard","mouse","monitor","printer","phone","tablet","camera","headphones",
"microphone","backpack","wallet","watch","glasses","umbrella","coat","hat","shoes","boots",
"socks","shirt","pants","dress","skirt","jacket","scarf","gloves","ring","necklace",
"car","bicycle","motorcycle","bus","train","plane","boat","ship","truck","scooter",
"road","street","avenue","highway","bridge","tunnel","park","garden","forest","mountain",
"river","lake","ocean","beach","desert","island","valley","hill","cave","cliff",
"tree","flower","grass","bush","leaf","branch","root","seed","fruit","stem",
"sun","moon","star","planet","cloud","rain","snow","storm","wind","fog",
"animal","dog","cat","bird","fish","lion","tiger","elephant","monkey","bear",
"wolf","rabbit","fox","deer","horse","cow","sheep","goat","chicken","duck",
"pig","mouse","rat","squirrel","owl","eagle","hawk","sparrow","peacock","frog",
"run","walk","jump","sit","stand","sleep","eat","drink","read","write",
"think","listen","talk","sing","dance","play","swim","drive","cook","clean",
"build","paint","draw","teach","learn","study","watch","smile","laugh","cry",
"happy","sad","angry","excited","tired","bored","scared","brave","curious","nervous",
"fast","slow","hot","cold","warm","cool","bright","dark","loud","quiet",
"soft","hard","heavy","light","round","square","long","short","tall","small",
"big","huge","tiny","thin","thick","wide","narrow","deep","shallow","smooth",
"rough","wet","dry","clean","dirty","new","old","fresh","stale","ancient",
"strong","weak","young","old","rich","poor","famous","hidden","lost","found",
"happy","sad","angry","funny","serious","kind","mean","friendly","rude","polite",
"dangerous","safe","easy","difficult","simple","complex","clear","confusing","bright","dull",
"beautiful","ugly","pretty","handsome","smart","stupid","wise","foolish","friendly","hostile",
"curious","lazy","active","quiet","noisy","peaceful","chaotic","organized","messy","clean",
"hot","cold","warm","cool","soft","hard","smooth","rough","light","dark",
"fast","slow","quick","steady","strong","weak","brave","cowardly","lucky","unlucky",
"happy","sad","angry","excited","tired","bored","hungry","thirsty","confident","shy",
"cloud","rain","snow","storm","fog","wind","thunder","lightning","sun","moon",
"star","planet","comet","meteor","asteroid","ocean","river","lake","pond","beach",
"forest","jungle","mountain","valley","hill","cave","desert","island","volcano","waterfall",
"rock","stone","sand","soil","mud","grass","leaf","flower","tree","branch"
];

const HARRY_POTTER_WORDS = [
"accio","alohomora","animagus","azkaban","bezoar","bellatrix","bertiebotts","boggart","broomstick","buckbeak",
"butterbeer","cauldron","centaur","chocolate","cloak","cornish","cruciatus","dementor","diagon","dirigible",
"dragon","dobby","dumbledore","elder","expecto","fawkes","felix","flobberworm","fluffy","firenze",
"firebolt","flesh","floo","foe","galleon","gillyweed","goblin","grawp","hedwig","hogwarts",
"honeydukes","horcrux","hufflepuff","horntail","jarvey","kappa","knight","lacarnum","leaky","leviosa",
"lumos","mandrake","marauder","merlin","merperson","metamorphmagus","mirror","myrtle","mokeskin","moody",
"moonstone","nagini","nargle","niffler","nimbus","norbert","obliviate","occamy","occlumency","omniocular",
"ollivander","parseltongue","patronus","peeves","pensieve","percy","phoenix","piertotum","pigwidgeon","polyjuice",
"portkey","potion","prefect","professor","protego","quaffle","quidditch","ravenclaw","remembrall","remus",
"reparo","rictusempra","riddikulus","room","rune","spew","salazar","scabbers","scourgify","sectumsempra",
"severus","shack","sirius","slughorn","sneakoscope","snitch","spellbook","spectrespecs","spoon","squib",
"stupefy","thestral","tom","triwizard","troll","unforgivable","unicorn","voldemort","veritaserum","weasley",
"wand","wandlore","werewolf","wingardium","yule","yaxley","zonko","acromantula","aim","amortentia",
"antidote","aragog","bane","basilisk","beater","blastended","bludger","bombarda","bookworm","brilliant",
"bulbous","bungling","cauldroncake","chaser","chizpurfle","chudley","clabbert","clock","confringo","confundus",
"crabbe","crabapple","curseb","darkmark","death","defodio","deluminator","dirigible","disillusionment","dragonscale",
"dragonsblood","dreamless","duelling","dungbomb","dusky","enchanted","ennervate","episkey","erumpent","evasion",
"expectopatronum","extinguishing","fairy","fanged","fidelius","firecrystal","firewhisky","fizzing","flamefreezing","fleshing",
"flobberworm","flying","foeglass","forbidden","frosty","fudge","gamp","gemini","goblin","gobstone",
"golden","gryffindor","gubraithian","hairraising","hamper","hand","hat","hellebore","hemlock","horn",
"house","imperio","incendio","inflatus","ink","jellylegs","jinx","jobberknoll","jocund","juice",
"jumping","kelpie","keeper","knowledge","legilimency","levitation","licorice","lily","luck","locket",
"lumos","marauder","marvolo","matrix","meloflame","metamorphosis","mimblewimble","mindreading","ministry","mimbulus",
"mirror","mischief","mistletoe","mokeskin","mooncalf","morning","mortuary","mulciber","nametag","necromancy",
"neep","neville","niffler","nimbus","nocturne","obliviate","obscurus","oddment","omnivoy","owl",
"pacifist","parselmouth","peashooter","peppermint","piertotum","pigwidgeon","protean","puking","pumpkin","quaffle",
"quidditch","quill","quietus","reductor","regulus","reparo","remus","rune","sphinx","specter",
"spike","spitfire","squib","stupefy","sword","talisman","thestral","thorn","troll","unicorn",
"vane","voldemort","wand","werewolf","wingardium","yule","yaxley","zephyr","zombie","acromantula",
"adder","albus","amber","anemone","angel","aphid","arcane","arachnid","ardent","argent",
"aromatherapy","artifice","ash","asphodel","astronomy","atlas","auror","avatar","balefire","basil",
"beetle","bell","blaze","blinker","blizzard","bloom","blossom","boggart","bone","bottle",
"bramble","branch","brass","briar","broom","brush","bubble","buck","bulb","bull",
"burrow","cabbage","cairn","caldron","canopy","candle","canker","cape","caramel","carob",
"cauldron","cedar","celestial","chain","charm","chaser","chest","chimera","chitin","cinder",
"claw","cloak","cloud","clutch","cobra","cobweb","cocoa","cog","coil","colt",
"comet","concoction","cord","coral","cormorant","cowl","cranberry","creature","cricket","crimson",
"crown","crystal","cudgel","curio","curse","cyclone","daemon","dagger","damp","dawn",
"daydream","death","decree","demon","dew","diadem","diamond","dirk","dirt","disc",
"dragon","drake","drum","druid","dust","eagle","ebony","echo","elm","ember",
"enchant","ermine","fang","feather","fern","fire","fish","flame","fleur","fowl",
"fox","frost","fungus","gale","gargoyle","garrison","gem","ghost","ghoul","goblin",
"golem","gossamer","griffin","grimoire","grim","grove","guardian","halo","harp","hawk",
"hearth","herb","hex","hobgoblin","hog","hollow","honey","horn","hound","hue",
"imp","incense","ink","ivy","jackal","jar","jewel","juniper","kelpie","key",
"knight","knot","kraken","lagoon","lamp","lantern","lattice","leaf","leech","lemur",
"leviosa","lion","locus","lore","lumen","lynx","mage","manticore","map","marble",
"mask","maven","medallion","merlin","minotaur","mist","moth","mule","nymph","oak",
"obelisk","ocean","onyx","orb","owl","panther","parchment","pebble","pegasus","pen",
"pendulum","phoenix","pike","pixie","potion","prism","pyre","quill","quartz","rabbit",
"raven","riddle","roc","rod","rook","root","rose","ruby","saber","scepter",
"shadow","shard","shell","shield","shrine","skull","snake","snow","sparrow","spear",
"sphinx","spike","spindle","spirit","sprite","staff","stave","stone","storm","sword",
"talisman","talon","tangle","throne","tiger","torch","totem","tree","trinket","troll",
"tusk","twilight","vial","vine","viper","wand","watch","web","wing","wolf",
"wyrm","yew","zephyr","zombie"
];

  // --- Helpers ---
  // Get random word from current word bank
  function randomWord() {
    const bank = currentWordSet === "harry" ? HARRY_POTTER_WORDS : NORMAL_WORDS;
    return bank[Math.floor(Math.random() * bank.length)];
  }

  // --- Use short lines for all modes ---
  function getLineLength() {
    return 5; // always 5 words per line
  }

  // --- Initialize and update lines, generate  2 lines of words and updates words---
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

  // Update word display
  function updateWords() {
    const typed = currentTyped;

    handleLineCompletion();
    renderCurrentLine(typed);
    renderNextLine();
  }

  // -------------------------
  // Handle the end of the current line
  // -------------------------
  function handleLineCompletion() {
    // Check if the current line has been fully typed
    if (typedWords.length >= lines[0].length) {
      typedWords = [];      // Reset typed words
      lines.shift();        // Remove finished line

      // Add a new random line at the end
      lines.push(generateNewLine(getLineLength()));

      input.value = "";     // Clear input for new line
    }
  }

  // -------------------------
  // Generate a new random line of words
  // -------------------------
  function generateNewLine(length) {
    const newLine = [];
    for (let i = 0; i < length; i++) {
      newLine.push(randomWord());
    }
    return newLine;
  }

  // -------------------------
  // Display the current line with correct/incorrect/remaining words and letters with colors
  // -------------------------
  function renderCurrentLine(typed) {
    currentLineEl.innerHTML = ""; // Clear previous content
    // Chooses first line of the two lines
    lines[0].forEach((word, idx) => {
      if (idx < typedWords.length) {
        // Already typed words
        currentLineEl.appendChild(createWordSpan(word, "correct"));
      } else if (idx === typedWords.length) {
        // Word currently being typed
        currentLineEl.appendChild(createTypingWordContainer(word, typed));
      } else {
        // Words yet to be typed
        currentLineEl.appendChild(createWordSpan(word, "remaining"));
      }
    });
  }

  // -------------------------
  // Create a span for a single word; spans are inline, so we can easily add cursor and change words letters by letters
  // Also assigns it to a class, whether "correct", "incorrect", or "remaining"
  // -------------------------
  function createWordSpan(word, className) {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.className = className;
    return span;
  }

  // -------------------------
  // Create a container span for the word being typed
  // -------------------------
  function createTypingWordContainer(word, typed) {
    const container = document.createElement("span");
    // Flag to ensure we only add one cursor per word; resetting the cursor
    let cursorAdded = false;

    // Loop through each letter in the word
    for (let i = 0; i < word.length; i++) {
      // Add cursor at the current typing position
      if (!cursorAdded && i === typed.length) {
        container.appendChild(createCursor());
        cursorAdded = true;
      }

      // Create span for each letter and verifies whether the word is right
      const letter = document.createElement("span");
      letter.className = i < typed.length 
        ? (typed[i] === word[i] ? "correct" : "incorrect") 
        : "remaining";
      letter.textContent = word[i];
      container.appendChild(letter);
    }

    // If cursor wasn't added, add it at the end (edge case)
    if (!cursorAdded) {
      container.appendChild(createCursor());
    }

    // Add letter span to container
    container.appendChild(document.createTextNode(" ")); // add space after word
    return container;
  }

  // -------------------------
  // Create cursor span
  // -------------------------
  function createCursor() {
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    return cursor;
  }

  // -------------------------
  // Render the next line (all remaining)
  // -------------------------
  function renderNextLine() {
    nextLineEl.innerHTML = ""; // Clear previous next line
    lines[1].forEach(word => {
      nextLineEl.appendChild(createWordSpan(word, "remaining"));
    });
  }


  
  // Helper to Trigger Explosion
  function triggerExplosion(side) {
    const explosion =
      side === "left" ? explosionLeft : explosionRight;
    const character =
      side === "left" ? charLeft : charRight;

    // Show explosion
    explosion.classList.remove("hidden");

    // Restart GIF
    explosion.src = explosion.src;

    // Hide character shortly after explosion starts
    setTimeout(() => {
      character.classList.add("hidden");
    }, 150); // small delay feels better visually

    // Hide explosion after animation finishes
    setTimeout(() => {
      explosion.classList.add("hidden");
    }, 800); // match gif duration
  }


  // --- Rope & Beams ---
  function moveRope(amount) {
    ropePosition += amount;
    ropePosition = Math.max(0, Math.min(650, ropePosition));
    updateVisuals();

    if (ropePosition <= 130) endGame("Computer wins!", "player");
    if (ropePosition >= 600) endGame("You win!", "computer");

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
    // If space pressed → submit word
    if (input.value.endsWith(" ")) {
      const typedWord = currentTyped;
      const nextWord = lines[0][typedWords.length];

      if (typedWord === nextWord) {
        typedWords.push(nextWord);
        totalCharacters += nextWord.length + 1;
        moveRope(PLAYER_PULL); // local movement
        // socket.emit("playerMove", "right"); // multiplayer
      }

      currentTyped = "";
      input.value = "";
      updateWords();
      return;
    }

    // Otherwise keep tracking typed letters
    currentTyped = input.value;
    updateWords();
  });





  // --- Computer AI ---
  function startComputer() {
    clearInterval(computerInterval);
    const settings = DIFFICULTY_SETTINGS[currentDifficulty];
    computerInterval = setInterval(() => {
      if (!gameOver) moveRope(-settings.computerPull);
    }, settings.speed);
  }

  // --- Countdown ---
  // --- Countdown ---
  function startCountdown(callback) {
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
        
        startTime = Date.now(); 
        totalCharacters = 0; // Reset character count for the new round
        
        if (callback) callback();
      }
    }, 1000);
  }

  // Trigger Win Gif
  function triggerWin(side) {
    const winAnim = side === "left" ? winLeft : winRight;
  
    // 1. Unhide the element
    winAnim.classList.remove("hidden");
    winAnim.style.display = "block"; // Ensure it's not set to none by a parent

    // 2. Force GIF restart with a timestamp to bypass cache
    const currentSrc = winAnim.src.split('?')[0];
    winAnim.src = currentSrc + "?t=" + new Date().getTime();
  }

  // --- End game ---
  function endGame(message, loser) {
    gameOver = true;
    clearInterval(computerInterval);

    // --- 1. CALCULATE WPM ---
    const endTime = Date.now();
    // Convert the difference from milliseconds to minutes
    const elapsedMinutes = (endTime - startTime) / 60000; 
    
    // Standard WPM formula: (Total Characters / 5) / Time
    const wpm = elapsedMinutes > 0 ? Math.round((totalCharacters / 5) / elapsedMinutes) : 0;

    // --- 2. DISPLAY RESULTS ---
    // Change textContent to innerHTML so we can use <br> for a new line
    result.innerHTML = `${message}<br><span style="font-size: 40px; opacity: 0.8;">Speed: ${wpm} WPM</span>`;

    if (loser === "player") {
      triggerExplosion("left");
      charRight.classList.add("hidden"); 
      triggerWin("right");        
    } else {
      triggerExplosion("right");
      charLeft.classList.add("hidden");
      triggerWin("left");         
    }

    // --- 3. UI CLEANUP ---
    wordsRow.style.display = "none";
    input.style.display = "none";
    
    // Ensure beams and clash point disappear
    beamLeft.classList.add("hidden-during-countdown");
    beamRight.classList.add("hidden-during-countdown");
    clashPoint.classList.add("hidden-during-countdown");

    endButtons.style.display = "flex";
    endButtons.style.justifyContent = "center";
    endButtons.style.marginTop = "30px";
  }

  playAgainBtn.onclick = () => {
    // 1. Hide the result UI
    endButtons.style.display = "none";
    result.textContent = "";

    // 2. Hide Battle/Win sprites so they don't overlap
    charLeft.classList.add("hidden");
    charRight.classList.add("hidden");
    winLeft.classList.add("hidden");
    winRight.classList.add("hidden");

    // 3. Show the Intro (NoSpell) sprites
    charLeftNoSpell.classList.remove("hidden");
    charRightNoSpell.classList.remove("hidden");

    // 4. Hide game UI for the countdown
    wordsRow.style.display = "none";
    input.style.display = "none";
    beamLeft.classList.add("hidden-during-countdown");
    beamRight.classList.add("hidden-during-countdown");
    clashPoint.classList.add("hidden-during-countdown");

    // 5. Start the timer
    startCountdown(() => {
      // Switch back to battle state
      charLeftNoSpell.classList.add("hidden");
      charRightNoSpell.classList.add("hidden");
      
      wordsRow.style.display = "block";
      input.style.display = "block";
      beamLeft.classList.remove("hidden-during-countdown");
      beamRight.classList.remove("hidden-during-countdown");
      clashPoint.classList.remove("hidden-during-countdown");

      resetGame();
      input.focus();
    });
  };



  // --- Main Menu ---
  mainMenuBtn.onclick = () => {
    endButtons.style.display = "none";
    gameContainer.style.display = "none";
    menu.style.display = "block";
    result.textContent = "";

    // Hide the winner GIFs specifically
    winLeft.classList.add("hidden");
    winRight.classList.add("hidden");

    // Restore characters and battlefield elements
    charLeft.classList.remove("hidden");
    charRight.classList.remove("hidden");
    beamLeft.classList.remove("hidden-during-countdown");
    beamRight.classList.remove("hidden-during-countdown");
    clashPoint.classList.remove("hidden-during-countdown");
  };



  // --- Start button ---
  startBtn.addEventListener("click", () => {
    currentDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    currentWordSet = document.querySelector('input[name="wordset"]:checked').value;

    menu.style.display = "none";
    gameContainer.style.display = "flex";

    // --- START SWAP ---
    // Show the Intro (NoSpell) sprites
    charLeftNoSpell.classList.remove("hidden");
    charRightNoSpell.classList.remove("hidden");

    // Keep Battle sprites, Beams, and Input hidden during countdown
    charLeft.classList.add("hidden");
    charRight.classList.add("hidden");
    wordsRow.style.display = "none";
    input.style.display = "none";
    beamLeft.classList.add("hidden-during-countdown");
    beamRight.classList.add("hidden-during-countdown");
    clashPoint.classList.add("hidden-during-countdown");

    startCountdown(() => {
      // --- END SWAP (When countdown hits 0) ---
      // Hide the Intro sprites
      charLeftNoSpell.classList.add("hidden");
      charRightNoSpell.classList.add("hidden");

      // Show the Battle sprites and the game UI
      charLeft.classList.remove("hidden");
      charRight.classList.remove("hidden");
      wordsRow.style.display = "block";
      input.style.display = "block";
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
    currentTyped = "";

    // 1. Ensure Intro (NoSpell) characters are hidden now that game started
    charLeftNoSpell.classList.add("hidden");
    charRightNoSpell.classList.add("hidden");

    // 2. Show the Battle characters
    charLeft.classList.remove("hidden");
    charRight.classList.remove("hidden");

    // 3. Hide all end-game animations
    explosionLeft.classList.add("hidden");
    explosionRight.classList.add("hidden");
    winLeft.classList.add("hidden");
    winRight.classList.add("hidden");

    // 4. Reset positions and typing
    ropePosition = 325;
    updateVisuals();
    input.value = "";
    initLines();
    startComputer();
  }

  // --- Initialize ---
  initLines();

});
