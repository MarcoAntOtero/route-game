// ==== STATE ====
// Assign Beginning Variables
const GameState = {
  currentWord: "",         // Tracks the player's current word
  endWord: "",             // The target word to guess
  guessCount: 0,           // Number of guesses made
  dictionaryTrie: null,    // Holds the loaded dictionary in trie form
  hint: "",
  targetGuess: 0,
  maxGuess: 0,
};

// ==== DOM ELEMENTS ====
// Cache necessary DOM elements for faster lookup
const inputBar = document.getElementById("input-bar");
const guessContainer = document.getElementById("guess-container");
const startWordEl = document.getElementById("start-word-beginning").nextElementSibling;
const endWordEl = document.getElementById("end-word-ending").nextElementSibling;
const messageContainer = document.getElementById("message-container");
const message = document.getElementById("message");
const messageLink = document.getElementById("message-link");
const datePlace = document.getElementById("current-date");
const targetGuess = document.getElementById("target-guess-count");
const fakePlaceholder = document.getElementById('fake-placeholder');

// Modal elements
const overlay = document.getElementById("modal-overlay");
const contentEl = document.getElementById("modal-content");
const closeBtn = document.getElementById("modal-close");
const howToBut = document.getElementById("how-to-but");
const hintBut = document.getElementById("hint-but");

// Keyboard UI
const enterKey = document.getElementById("enter-key");
const deleteKey = document.getElementById("delete-key");
const keys = document.querySelectorAll(".key");

// ==== INIT ====
// Date Loading, puzzle file needs Date to search by
const today = new Date();
const currentDate = today.toISOString().slice(0, 10); // Change date to string like XXXX-XX-XX

// Format and display the date
datePlace.textContent = today.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

//For shake animation
let continueShake = true;
// Main initializer
init();

async function init() {
  try {
    // Load dictionary and puzzle
    GameState.dictionaryTrie = await loadDictionary();
    const puzzle = await loadPuzzle(currentDate);

    // Assign puzzle data to game state and UI
    setupPuzzle(puzzle);
    setupEventListeners();
    console.log("Game initialized.");
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

// ==== LOADERS ====
// Load dictionary.json (External Files)
async function loadDictionary() {
  const response = await fetch("assets/newDictionary.json");
  if (!response.ok) throw new Error("Failed to load dictionary.");
  return await response.json();
}

// Load puzzle.json and find today's puzzle
async function loadPuzzle(date) {
  const response = await fetch("assets/puzzle.json");
  if (!response.ok) throw new Error("Failed to load puzzle file.");
  const data = await response.json();
  const puzzle = data[date];
  if (!puzzle) throw new Error("Puzzle not found for the current date.");
  return puzzle;
}

// ==== SETUP ====
// Load puzzle content for the day
function setupPuzzle(puzzle) {
  const { start_word, end_word, clue: hint, message: msg, link, target_guess} = puzzle;

  // Assign Content Elements used in page
  message.textContent = msg;
  messageLink.href = link;
  startWordEl.textContent = start_word;
  endWordEl.textContent = end_word;
  targetGuess.textContent = target_guess;

  // Set game variables
  GameState.currentWord = start_word;
  GameState.endWord = end_word;
  GameState.guessCount = 0;
  GameState.hint = hint;
  GameState.targetGuess = target_guess;
  GameState.maxGuess = (GameState.targetGuess * 2);
}

// ==== EVENT LISTENERS ====
// To ensure user always in input bar
function setupEventListeners() {
  inputBar.addEventListener("blur", (e) => {
    e.preventDefault();
    inputBar.focus();
    if (!inputBar.value) fakePlaceholder.style.display = 'block';
  });

  inputBar.addEventListener('focus', () => {
  fakePlaceholder.style.display = inputBar.value ? 'none' : 'block';
  });

  inputBar.addEventListener("input", () => {
    inputBar.style.textAlign = "center";
    fakePlaceholder.textContent = "";
    fakePlaceholder.style.display = inputBar.value ? 'none' : 'block';
  });

  // Keyboard events
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleGuess();        // Only activates on Enter
    if (e.key === "Escape") hideModal();         // Closes modal on Escape
  });

  // Web page keyboard input
  enterKey.addEventListener("click", handleGuess);

  deleteKey.addEventListener("click", () => {
    // Delete from input bar
    if (inputBar.disabled) return; // Don't add letters if input is disabled
    inputBar.value = inputBar.value.slice(0, -1);
  });

  keys.forEach((key) => {
    key.addEventListener("click", () => {
      if (inputBar.disabled) return; // Don't add letters if input is disabled
      inputBar.value += key.textContent.toLowerCase();
      inputBar.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  // Modal events
  closeBtn.addEventListener("click", hideModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hideModal();
  });


  // Show "How to Play"
  howToBut.addEventListener("click", () => {
    showModal(`
      <h2>How to Play</h2>
      <ol>
        <li>Guess a <strong>4-letter word</strong> by typing or clicking letters.</li>
        <li>Change exactly <strong>one</strong> letter at each guess.
        Each transformation must result in a <strong>valid</strong> word.</li>
        <li>Press <strong>Enter</strong> to submit your guess.</li>
        <li><span class="green">Green</span> means the letter is in the correct spot</li>
        <li>Your target guess is <strong>${GameState.targetGuess}</strong> to get to the end word correctly.</li>
      </ol>
    `);
  });

  hintBut.addEventListener("click", () => {
    showModal(`
      <h2>Hint</h2>
<p>From <strong>${GameState.currentWord}</strong>, try to get to <strong>${GameState.hint}</strong>.</p>
    `);
  });
}

// ==== GAME LOGIC ====
// Add a guess to the game board
function handleGuess() {
  if (inputBar.disabled) return; // Don't add letters if input is disabled
  const userInput = inputBar.value.trim().toLowerCase();
  const [isValid, errorMsg] = isValidGuess(userInput);

  if (!isValid) {
    alertMessage(errorMsg);
    return;
  }
  if(GameState.guessCount >= GameState.maxGuess)
  {
    alertMessage("Maximum Number of Guesses Reached, You Lose");
    inputBar.disabled = true;
    return;
  }
  // Update count and what current word
  GameState.guessCount++;
  document.getElementById("guess-count").textContent = GameState.guessCount;
  GameState.currentWord = userInput;

  // Add element to guess container
  const guessEl = document.createElement("div");
  guessEl.className = "guess-word";

  //Add span to each letter
  for (let char of userInput) {
    const span = document.createElement("span");
    span.textContent = char;
    guessEl.appendChild(span);
  }

  //Add it to container
  guessContainer.appendChild(guessEl);
  inputBar.value = "";//resest input bar

  // Change background color of correct letters
  applyFeedback(userInput, guessEl);

  // Add shake animation to hint button
  if (continueShake && GameState.guessCount > GameState.targetGuess) {
    shouldShakeHint = true;
    loopHintBut();
    continueShake = false;
  }

  // Win condition
  if (userInput === GameState.endWord) {
    displayWinMessage(GameState.guessCount,GameState.targetGuess);
    shouldShakeHint = false;
    inputBar.disabled = true;
    messageAppears();
    animateGuessReveal();
  }
}

// ==== VALIDATION ====
// Check if it is a valid guess
function isValidGuess(word) {
  if (word.length !== GameState.currentWord.length) {
    return [false, "Invalid number of letters"];
  }
  if (!isOneLetterDiff(word, GameState.currentWord)) {
    return [false, "Change by one letter only"];
  }
  if (!isWord(word)) {
    return [false, "Not a valid word"];
  }
  return [true, ""];
}

// Check if word exists in dictionary trie
function isWord(word) {
  if (!GameState.dictionaryTrie) return false;

  let node = GameState.dictionaryTrie;
  for (const char of word) {
    if (!(char in node)) return false;
    node = node[char];
  }

  return node === 0 || (typeof node === "object" && node["$"] === 0);
}

// Must differ from current word by exactly one letter
function isOneLetterDiff(word1, word2) {
  let diff = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) diff++;
  }
  return diff === 1;
}

// ==== UI & FEEDBACK ====
// Change background color of correct letters
function applyFeedback(guess, guessEl) {
  const feedback = Array(guess.length).fill("white");

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === GameState.endWord[i]) {
      feedback[i] = "#25969c"; // greenish color for correct letter
    }
  }

  guessEl.childNodes.forEach((el, i) => {
    el.style.backgroundColor = feedback[i];
  });
}

// Display win message under guesses
function displayWinMessage(guessCount,targetGuess) {
  const winMessageEl = document.createElement("div");
  let winMessage = '';
  winMessageEl.className = "win-message";
  if(guessCount <= targetGuess){
    winMessage = winMessage = `🎉 Amazing! You solved it in ${guessCount} move${guessCount !== 1 ? 's' : ''}, which meets the target of ${targetGuess} moves!`;
  }
  else{winMessage = `Nice try! You solved it in ${guessCount} moves, but missed the target of ${targetGuess}. Try again tomorrow!`;}
  winMessageEl.textContent = winMessage;
  guessContainer.appendChild(winMessageEl);
}

// Reveal message box and animation after win
function messageAppears() {
  messageContainer.style.display = "flex";
}

// Trigger animation on each guessed letter
function animateGuessReveal() {
  const lastGuess = guessContainer.children[guessContainer.children.length - 2];
  lastGuess.childNodes.forEach((el, i) => {
    setTimeout(() => el.classList.add("animate"), i * 100);
  });
}

function animateHintBut() {
  hintBut.classList.remove("shake-animation");
  void hintBut.offsetWidth;
  hintBut.classList.add("shake-animation");
}

function loopHintBut() {
  animateHintBut();

  hintBut.addEventListener("animationend", () => {
    hintBut.classList.remove("shake-animation");
    if (shouldShakeHint) setTimeout(loopHintBut, 5000);
  }, { once: true });
}

// ==== MODAL ====
// Show modal with custom HTML
function showModal(html) {
  contentEl.innerHTML = html;
  overlay.style.display = "flex";
}

// Close modal
function hideModal() {
  overlay.style.display = "none";
}

// Alert modal with simple message
function alertMessage(msg) {
  showModal(`<p>${msg}</p>`);
}
// rail buss safe sign gate crew snow wild mile