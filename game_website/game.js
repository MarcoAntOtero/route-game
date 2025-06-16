let dictionaryTrie = null;
fetch("dictionary.json")
  .then(res => res.json())
  .then(data => {
    dictionaryTrie = data;
    console.log("Dictionary,loaded");
  })
const datePlace = document.getElementById("current-date");

const currentDate = new Date();

const formatedDate = currentDate.toLocaleDateString('en-US', {
  year: "numeric", month: "long", day: "numeric"});

datePlace.textContent = formatedDate;





const start_word = "";
const end_word = "";

const current_word = start_word;
let guess_count = 0;
const input_bar = document.getElementById("input-bar");
const guessContainer = document.getElementById("guess-container");
const givenWordEl = document.getElementById("given-word").nextElementSibling;
const endWordEl = document.getElementById("end-word").nextElementSibling;
givenWordEl.textContent = start_word;
endWordEl.textContent = end_word;

//Functions as game loop
//Check once they hit enter
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addGuess(input_bar.value.trim().toLowerCase());
  }
});



function addGuess(user_input){
  //Check if it is a valid guess
  if (!isValidGuess(user_input)){
    alert("Please Enter A Valid Guess");
    return
  }
  
  //Update count and what current word
  guess_count++;
  current_word = user_input;

  //Add element to guess container
  const guess = document.createElement("div");
  guess.className = "guess-word";
  guess.textContent = user_input;
  guessContainer.appendChild(guess);

  //Clear input bar
  input_bar.value ="";

  //Win condition
  if(user_input === endWordEl.value)
  {
    const msg = document.createElement("div")
    msg.className = "win-message";
    msg.textContent = `🎉 You solved it in ${guessCount} move${guessCount === 1 ? "" : "s"}!`;
    guessContainer.appendChild(msg);
    input_bar.disabled = true;
  }
}

function isWord(user_input)
{
  if(!dictionaryTrie){return false;}
  let node = dictionaryTrie;
  for(const letter of user_input){
      if(!node[letter]){return false;}
      node = node[letter];
    }
  return node === 0 || (node["$"] === 0);
}
function isOneLetterDiff(user_input)
{
  let isDiff = false;
  for(let i = 0; i < user_input.length;i++)
  {
    if (user_input[i] !== current_word)
    {
      isDiff = true;
    }
  }
  return isDiff;
}

function isValidGuess(user_input)
{
  let validGuess = true;
  if(current_word.length !== user_input.length){validGuess = false;}
  if(!isOneLetterDiff(user_input)){validGuess = false;}
  if(!isWord(user_input)){validGuess = false;}

  return validGuess;
}