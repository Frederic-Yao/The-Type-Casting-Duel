# 🪄 Type Casting Duel

**Type Casting Duel** is a browser-based typing game that transforms 
a standard typing challenge into a magical duel between a player and 
a computer. Instead of passively measuring words per minute, the 
game visualizes typing performance as a live struggle, where every 
correct word strengthens your spell and every mistake gives your opponent an opening.

The project is built entirely with **HTML, CSS, and vanilla JavaScript**, 
with no external frameworks. It was designed to feel responsive, animated, 
and game-like while remaining readable and easy to extend.

---

## 📚 1. Overview

At its core, Type Casting Duel is about turning typing into an 
active experience. The player and the computer both apply constant pressure 
to a shared clash point in the center of the screen. As the player 
types accurately and consistently, the balance of power visibly shifts in their favor.

This direct connection between typing input and visual 
feedback is the foundation of the game. The player is never 
guessing how well they are doing — the battlefield itself shows it.

---

## 🎮 2. Core Gameplay Loop

1. The player selects a **difficulty level** and **word set**
2. A short countdown prepares both sides for battle
3. Both characters begin casting spells
4. The player types words and submits them using the **space bar**
5. Correct words push the clash point toward the AI
6. The AI applies constant opposing pressure
7. The duel ends when one side is overpowered

Each step feeds cleanly into the next, creating a loop that feels continuous rather than segmented.

---

## ⌨️ 3. Typing & Input Feedback

Typing input is processed character by character. As the player 
types, letters are visually marked as correct or incorrect, and a 
cursor indicates the current typing position. This immediate feedback 
helps players adjust quickly instead of waiting until the end of a word.

Only completed and correctly typed words provide an advantage. Mistakes do 
not push the spell forward, while the computer continues to apply pressure in real time.

---

## 🧠 4. Difficulty Design

Difficulty in Type Casting Duel affects more than just speed. Each
difficulty level modifies multiple aspects of the computer’s 
behavior, which helps keep the challenge feeling fair and intentional.

| Difficulty | Computer Pressure | Speed | 
|------------|-------------------|-------|
| Easy       | Low               | Slow  | 
| Medium     | Balanced          | Medium| 
| Hard       | High              | Fast  | 

Hard mode requires both fast typing and sustained accuracy, 
while easy mode gives players room to learn the mechanics.

---

## 📖 5. Word Sets

Different word sets change the rhythm and difficulty of the game.

- **Muggle Tongue**
  - Common, everyday vocabulary
  - Shorter words
  - Beginner-friendly

- **Spellbook of Words**
  - Fantasy and magic-themed terms
  - Longer and more complex words
  - Naturally increases difficulty without changing AI behavior

All word sets are stored as JavaScript arrays, making them easy to edit or expand.

---

## 🎨 6. Visual & Interface Design

The visual style draws inspiration from fantasy games and pixel-art 
aesthetics. Characters have distinct idle, casting, and victory states, 
and the spell beams dynamically respond to the current balance of power.

Transitions between menus, countdowns, gameplay, and the end screen 
are intentionally paced. The interface avoids clutter and 
keeps the player’s attention focused on the typing task.

---

## 🏗️ 7. Technical Structure

The project follows a clear separation of responsibilities:

- **HTML** defines the structure and layout
- **CSS** handles animations, positioning, and visual effects
- **JavaScript** controls game state, input handling, and AI logic

The game uses a state-based approach, with clearly defined 
phases such as menu, countdown, active play, and game over. 
This makes the logic easier to reason about and modify.

---

## 📁 8. File Structure

.
├── index.html # Main HTML entry point
├── style.css # All styles and animations
├── script.js # Game logic and AI behavior
├── images/
│ ├── background3.mp4
│ ├── battlefield.png
│ ├── computer_no_spell.gif
│ ├── computer.gif
│ ├── explosion.gif
│ ├── green_beam.png
│ ├── player_no_spell.gif
│ ├── player.gif
│ ├── red_beam.gif
│ ├── win_comoputer.gif
│ └── win_player.gif
├── HARRYP__.TTF
└── README.md


---

## ▶️ 9. Running the Game

No setup or build process is required. Simply open `index.html` in a modern desktop browser. Chrome is recommended to ensure smooth video playback and consistent animation timing.

Because the game relies on keyboard input, it is best experienced on a desktop or laptop rather than on a mobile device.

---

## 🚧 10. Limitations & Future Improvements

Current limitations include:
- Single-player only
- Deterministic AI behavior
- Limited mobile support
- No persistent stats or leaderboards

Potential future improvements:
- Multiplayer modes
- Adaptive AI that responds to player WPM
- Additional game modes
- Sound effects and music controls
- Mobile-friendly input handling

---

## 👤 11. Credits

Design and development by **William Li**.  
Inspired by classic typing games and magical duel mechanics.

---

## 📜 12. License

This project is intended for educational and personal use. You are free to study, modify, and build upon the code.
