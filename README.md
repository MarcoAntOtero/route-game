## Route – Daily Word Transformation Puzzle
Route is an interactive browser-based word puzzle where players transform a starting word into an ending word—one letter at a time—forming valid words at every step. It’s inspired by classic “Word Ladder” puzzles but offers a polished, responsive web experience.

## Live Deployment
Play it now: nmdot.gov/route
This game is hosted via GitHub Pages and embedded in the official New Mexico Department of Transportation website using an <iframe>. The standalone version can also be opened directly from the GitHub Pages URL.

## Project Structure
.
├── index.html               # Main HTML page and layout
├── index.css                # Styling, layout, animations, dark mode
├── game.js                  # Game logic and user interaction
├── game-website/
│   ├── generateTrie.js      # Node.js script to build the dictionary trie
│   └── assets/
│       ├── old_list_of_words.txt
│       ├── oldDictionary.json
│       └── words_lines.txt  # List of words used to generate the dictionary
└── resources/
    ├── newDictionary.json   # Dictionary stored as a trie
    └── puzzle.json          # Daily puzzles keyed by date

## Gameplay Overview
Goal: Get from the start word to the end word.
Rule: Change exactly one letter per guess; all guesses must be valid words.

## Feedback:
🟩 Letter is correct and in the correct position
🟨 Letter is correct but in the wrong position
❌ Invalid guess or incorrect transformation shows an alert

## UI Features:
On-screen clickable keyboard
Input bar with animated feedback
"Hint" and "How to Play" modals
Dark mode toggle
Auto-loads a new puzzle each day

## Acknowledgments:
The word list was sourced from ScrabGuys (Scrabble CSW24 4‑letter words).
The trie structure idea is adapted from John Resig’s blog post “Dictionary Lookups in JavaScript” .
I used Node.js to run generateTrie.js, converting the plain-text list into newDictionary.json via the trie method inspired by Resig.


## 📄 License
This project is licensed under the [MIT License](LICENSE).
