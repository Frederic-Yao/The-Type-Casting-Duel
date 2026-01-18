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

  const countdownEl = document.getElementById("countdown");
  const endButtons = document.getElementById("endButtons");
  const mainMenuBtn = document.getElementById("mainMenuBtn");

  const explosionLeft = document.getElementById("explosionLeft");
  const explosionRight = document.getElementById("explosionRight");

  const charLeft = document.getElementById("charLeft");
  const charRight = document.getElementById("charRight");

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

  let currentTyped = "";

  let currentDifficulty = "easy";
  let currentWordSet = "normal";

  const PLAYER_PULL = 30; // pixels per correct word
  const DIFFICULTY_SETTINGS = {
    easy: { speed: 600, computerPull: 10 },
    hard: { speed: 300, computerPull: 20 }
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
  function randomWord() {
    const bank = currentWordSet === "harry" ? HARRY_POTTER_WORDS : NORMAL_WORDS;
    return bank[Math.floor(Math.random() * bank.length)];
  }

  // --- Use short lines for all modes ---
  function getLineLength() {
    return 5; // always 5 words per line
  }

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

  function updateWords() {
    const typed = currentTyped;

    if (typedWords.length >= lines[0].length) {
      typedWords = [];
      lines.shift();
      const newLine = [];
      for (let i = 0; i < getLineLength(); i++) newLine.push(randomWord());
      lines.push(newLine);
      input.value = "";
    }

    // Render current line
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

    // Render next line
    nextLineEl.innerHTML = "";
    lines[1].forEach(word => {
      const span = document.createElement("span");
      span.textContent = word + " ";
      span.className = "remaining";
      nextLineEl.appendChild(span);
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
        if (callback) callback();
      }
    }, 1000);
  }

  // --- End game ---
  function endGame(message, loser) {
    gameOver = true;
    result.textContent = message;

    clearInterval(computerInterval);

    if (loser === "player") {
      triggerExplosion("left");
    } else if (loser === "computer") {
      triggerExplosion("right");
    }

    wordsRow.style.display = "none";
    input.style.display = "none";
    beamLeft.classList.add("hidden-during-countdown");
    beamRight.classList.add("hidden-during-countdown");
    clashPoint.classList.add("hidden-during-countdown");

    endButtons.style.display = "flex";
    endButtons.style.justifyContent = "center";
    endButtons.style.marginTop = "30px";
  }


  // --- Main Menu ---
  mainMenuBtn.onclick = () => {
    endButtons.style.display = "none";
    gameContainer.style.display = "none";
    menu.style.display = "block";
    result.textContent = "";

    // restore characters
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

    // Hide typing & battlefield for countdown
    wordsRow.style.display = "none";
    input.style.display = "none";
    beamLeft.classList.add("hidden-during-countdown");
    beamRight.classList.add("hidden-during-countdown");
    clashPoint.classList.add("hidden-during-countdown");

    startCountdown(() => {
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

    // RESTORE CHARACTERS FIRST
    charLeft.classList.remove("hidden");
    charRight.classList.remove("hidden");

    // Hide explosions
    explosionLeft.classList.add("hidden");
    explosionRight.classList.add("hidden");

    ropePosition = 325;
    updateVisuals();

    input.value = "";
    initLines();
    startComputer();
  }


  // --- Initialize ---
  initLines();
  const socket = io();


  socket.on("init", (data) => {
    ropePosition = data.ropePosition;
    updateVisuals();
    const players = Object.keys(data.players);
    const myPlayer = players[0] === socket.id ? "left" : "right";
  });

  socket.on("updateRope", (data) => {
    ropePosition = data.ropePosition;
    updateVisuals();
  });

  socket.on("gameOver", (data) => {
    alert(data.winner + " wins!");
  });

  


});
