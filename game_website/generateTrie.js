// https://scrabguys.home.blog/4lw/
const fs = require("fs");
const path = require("path");

// Load words from a text file (one word per line)
const words = fs.readFileSync(path.join(__dirname, "words_lines.txt"), "utf-8")
  .split("\n")//seperated by newline each word
  .map(w => w.trim().toLowerCase())//get just the word trim empty space
  .filter(w => /^[a-z]+$/.test(w)); // Filter out empty lines or invalid words

//build trie
const trie = {};

for (let word of words) {
  let node = trie;

  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const isLast = i === word.length - 1;

    if (!(letter in node)) {
      node[letter] = isLast ? 0 : {};
    } else if (node[letter] === 0 && !isLast) {
      node[letter] = { "$": 0 };
    }

    node = node[letter];
  }
}

// Save as JSON
fs.writeFileSync(
  path.join(__dirname, "newDictionary.json"),
  JSON.stringify(trie, null, 2),
  "utf-8"
);

console.log("Trie successfully written to dictionary.json");
