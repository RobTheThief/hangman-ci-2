"use strict";

var WORD = "";
var DRAWING_COUNT = 0;
var HINT_CHECKED = false;
var AUDIO_MUTE = true;

/* MODAL BASED ON https://www.w3schools.com/howto/howto_css_modals.asp */

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal and clear text
span.onclick = function () {
    document.getElementById("modal-text-wrapper").innerHTML = `<p id="modal-text"></p>`;
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it and clear text
window.onclick = function (event) {
    if (event.target === modal) {
        document.getElementById("modal-text-wrapper").innerHTML = `<p id="modal-text"></p>`;
        modal.style.display = "none";
    }
};
/* ******************************************************************* */

/*  Based on code institute love math project
    Adds event listeners for buttons once DOM is loaded    */
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.getElementsByClassName("button");
    for (let button of buttons) {
        button.addEventListener("click", function () {
        let buttonType = this.getAttribute("id");
        if (buttonType === "check-letter") {
            checkLetter(WORD);
        }
        if (buttonType === "new-word") {
            newWord();
        }
        if (buttonType === "hint") {
            giveHint();
        }
        if (buttonType === "mute-audio") {
            toggleAudio();
        }
        if (buttonType === "help") {
            openHelp();
        }
        if (buttonType === "contact") {
            openContact();
        }
      });
    }
});

/*  Handles enter key event and scrolls the page back to the top and blurs
    input to hide soft keyboard after 500ms */
document
  .getElementById("letter-input")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkLetter(WORD);
      setTimeout(() => {
        document.getElementById("letter-input").blur();
        window.scrollTo(0, 0);
      }, 500);
    }
  });

/**
 * Get request to WordsApi for a random word
 * @returns {Promise} - word object
 */
function getRandomWord() {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(
        "https://wordsapiv1.p.rapidapi.com/words/?random=true",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": token,
          },
        }
      );

      const responseJson = await response.json(); //extract JSON from the http response
      WORD = responseJson.word;

      resolve(responseJson);
    } catch (error) {
      alert(error);
      resolve();
    }
  });
}

/**
 * Checks if the random word is greater than 11 characters and if there are any hyphens, dots or spaces.
 * @param {string} word - any word
 * @returns {boolean} - true if passed all test or false if failed any
 */
function parseWord(word) {
  const re = new RegExp("([. -])"); //https://regexr.com/ was used to help make expression
  if (re.test(word)) return false;
  if (word.length > 11) return false;
  return true;
}

/**
 * Takes any string and checks if it is only one character long
 * and is an upper or lower case letter
 * @param {string} char - any string
 * @returns {boolean}
 */
function parseLetter (char) {
  const re = new RegExp("([A-Za-z]{1})"); //https://regexr.com/ was used to help make expression
  return re.test(char);
}

/**
 * Looks for a definition of the random word in the WordsApi to be used as a hint
 * @param {string} word - any word
 * @returns {Promise} - word definition object
 */
function getWordHint(word) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(
        `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": token,
          },
        }
      );

      const responseJson = await response.json(); //extract JSON from the http response

      resolve(responseJson);
    } catch (error) {
      alert(error);
      resolve();
    }
  });
}

/**
 * Opens modal and adds elements with information about the game
 */
function openHelp () {
  modal.style.display = "block";
  let element = document.getElementById("modal-text-wrapper");
  element.innerHTML = `
    <h3>Help</h3>
    <p>The game is played by guessing what word the game has chosen. Once the word has
       been chosen, begin guessing which letters are in the word by entering a letter
       in the text input and hitting enter or clicking "Check Letter".
    </p>
    <p>For example, you might begin by checking, is there an "e" in the word.
       Generally, start by guessing common letters like vowels, or "s," "t," and "n."
    </p>
    <p>Each wrong guess means a piece of the gallows or stickman is drawn. Once the the
       stickman has all his arms and legs the game is over. You can also use the "Hint"
       button to get a hint, but you will loose 2 turns if you do!
    </p>
    <p>Tip: If you enter letters already revealed at the start you might get more of
       the same letters and if you don't, you won't loose a turn 🤫
    </p>`; // Emoji from https://emojipedia.org/shushing-face/ 
  window.scrollTo(0, 0);
}

/**
 * Opens modal and adds elements with contact information
 */
function openContact () {
  modal.style.display = "block";
  let element = document.getElementById("modal-text-wrapper");
  element.innerHTML = `
    <h3>Contact</h3>
    <p>For more information about this game, if there are any issues, or if 
        you would like to know more about my other projects please visit
        <a href="http://www.robgannon.com/" about="_blank" aria-label="Link to
        devolopers portfolio website (opens in new tab)">robgannon.com</a> and
        go to the contact section.
    </p>`;
  window.scrollTo(0, 0);
}

/**
 * Opens modal and adds elements to congratulate you on a new best win streak
 */
function renderNewBest (score, capitalised, wordHint) {
  modal.style.display = "block";
  let element = document.getElementById("modal-text-wrapper");
  element.innerHTML = `
    <h3>NEW BEST SCORE!!!</h3>
    <p>🎈🎊 Well Done. You have achieved a new best win streak of ${score} 🎊🎈
    </p>
    <p>The answer was ${capitalised}: ${wordHint}
    </p>`;  // Emojis from https://emojipedia.org/
  window.scrollTo(0, 0);
}

/**
 * Checks and updates game score and best score.  Sets new score depending on game outcome.
 * @param {boolean} result - true if game won, false if lost, empty just returns current and best score 
 * @returns {object} - returns object with returns current and best score
 */
function checkProgress (result) {
  let currentScore = localStorage.getItem('myScore');
  let bestScore = localStorage.getItem('bestScore');
  if (result === undefined) return {currentScore: currentScore, bestScore: bestScore};

  let newScore = (result && currentScore) ? ++currentScore : currentScore !== 0 ? 0 : 1;
  let newBest = !bestScore ? newScore : (newScore > bestScore) ? newScore : bestScore;
  localStorage.setItem('myScore', newScore );
  localStorage.setItem('bestScore', newBest );
  return {currentScore: newScore, bestScore: newBest};
}

/**
 * Renders current and best score streak
 */
function renderScore () {
  let score = checkProgress();
  let scoreElement = document.getElementById('best-streak');
  scoreElement.textContent = `Current Streak: ${score.currentScore ? score.currentScore : 0} Best: ${score.bestScore ? score.bestScore : 0}`;
}

/**
 * Checks how many letters in the word to determine the maximum number
 * of letters will be revealed at the beginning of the game
 * @param {string} word - any word 11 or less chars
 * @returns {integer} - 1, 2 or 3
 */
function maxNumOfLetters(word) {
  let wordLength = word.length;
  if (wordLength <= 3) return 1;
  if (wordLength <= 6) return 2;
  if (wordLength <= 11) return 3;
}

/**
 * Randomly determines which letters of the word will be revealed at the
 * beginning of the game
 * @param {string} word - any word 11 or less chars
 * @returns {Array} - indices of letters that will be revealed
 */
function filterLettersToRender(word) {
  let lettersToRevealeCount = maxNumOfLetters(word);
  let letters = word.split("");
  let indicesToReveal = [];
  for (let letter in letters) {
    let magicNumber = Math.floor(Math.random() * 3);
    if (magicNumber === 1 && indicesToReveal.length < lettersToRevealeCount) {
      indicesToReveal.push(letter);
    }
  }
  if (indicesToReveal.length === 0) indicesToReveal.push(1);
  return indicesToReveal;
}

/**
 * Removes invisible class of word container and renders a list of letters to the chalk board
 * @param {string} word - any word 11 or less chars
 * @param {Array} indices - array containing integers
 */
function renderWord(word, indices) {
  playSound("draw-letter");
  wordVisibility(true);
  let letterArray = word.split("");
  for (let index of indices) {
    let charElementContainer = document.getElementById(
      `letterdash-${parseFloat(index) + 1}`
    );
    charElementContainer.children[0].textContent =
      letterArray[index].toUpperCase();
    charElementContainer.classList.add("margin-bottom-increase");
  }
}

/**
 * Async function that takes a string for sound type as a parameter and plays the
 * sound
 * @param {string} sound - accepts 'draw-letter', 'draw-line', or 'eraser'
 * @returns {Promise}
 */
async function playSound(sound) {
  let soundType = document.getElementById(`${sound}-sound`);
  try {
    if (AUDIO_MUTE === false) {
      await soundType.play();
    }
  } catch (error) {
    if (error.name === "NotAllowedError") {
      AUDIO_MUTE = true;
      modal.style.display = "block";
      document.getElementById(
        "modal-text"
      ).textContent = `AUDIO ERROR: ${error.message}`;
    }
  }
}

/**
 * Checks if all the characters have been found
 * @returns {boolean}
 */
function isGameWon() {
  let letterArray = [];
  let elements = document.getElementsByClassName("letterdash-container");
  for (let element of elements) {
    let char = element.children[0].textContent;
    if (char !== "") {
      letterArray.push(char);
    }
  }
  return (WORD.length === letterArray.length) ? true : false;
}

/**
 * Displays a message congratulating the player, and giving the answer
 * and hint. The game is then reset after 3 seconds.
 * @returns {Promise}
 */
async function gameWon() {
  let score = checkProgress();
  let oldScore = score.currentScore;
  let newScore = checkProgress(true);
  renderScore();
  modal.style.display = "block";
  const wordHintObject = await getWordHint(WORD);
  const wordHint = wordHintObject.definitions[0].definition;
  const capitalised = `${WORD.charAt(0).toUpperCase()}${WORD.slice(1)}`;
  if (score.bestScore < newScore.bestScore) {
    renderNewBest (oldScore.currentScore, capitalised, wordHint);
  } else {
    document.getElementById(
      "modal-text"
    ).textContent = `CONGRATULATIONS!! The answer was ${capitalised}: ${wordHint}`;
  }
}

/**
 * Removes unused character containers from chalk board
 * @param {string} word - any word 11 or less chars
 */
function removeEmptyCharContainers(word) {
  for (let id = word.length + 1; id <= 11; id++) {
    document.getElementById(`letterdash-${id}`).classList.add("display-none");
  }
}

/**
 * Restores all character containers on chalk board
 */
function restoreAllCharContainers() {
  for (let id = 1; id <= 11; id++) {
    document
      .getElementById(`letterdash-${id}`)
      .classList.remove("display-none");
  }
}

/**
 * Checks the letter entered into the text input and renders any match,
 * then checks if game is won. If there is no match it runs the
 * renderStickman function
 * @param {string} word - any word
 */
function checkLetter(word) {
  if (!isGameWon()) {
    let indices = [];
    let testChar = document.getElementById("letter-input").value;
    const isParsedOk = parseLetter(testChar);
    const isCharInWord = word.includes(testChar.toLowerCase());
    if ( isCharInWord && isParsedOk ) {
      for (let char in word) {
        if (word[char] === testChar.toLowerCase()) indices.push(char);
      }
      renderWord(word, indices);
    } else if (isParsedOk) {
      renderStickman();
    } 
    isGameWon() && gameWon();
  }
  document.getElementById("letter-input").value = "";
}

/**
 * Hides all stickman and gallows drawings for the start of the game
 * and on reset
 */
function hideAllDrawings() {
  let elements = document.getElementsByClassName("game-drawings");
  for (let element of elements) {
    element.classList.add("invisible");
  }
}

/**
 * Removes "invivible" class from each piece of the drawing until
 * complete, ending the game.
 * @returns {Promise}
 */
async function renderStickman() {
  let elements = document.getElementsByClassName("game-drawings");
  if (DRAWING_COUNT < 8) {
    playSound("draw-line");
    elements[DRAWING_COUNT].classList.remove("invisible");
    ++DRAWING_COUNT;
  }
  DRAWING_COUNT === 8 && looseGame();
}

/**
 * Replaces textContent and removes "margin-bottom-increase" class of game characters
 * and containers respectivly
 */
function clearChars() {
  let elements = document.getElementsByClassName("letterdash-container");
  for (let element of elements) {
    element.classList.remove("margin-bottom-increase");
    element.children[0].textContent = "";
  }
}

/**
 * Displays message 'GAME OVER' with word and hint, and resets the game after 3 seconds
 * @returns {Promise}
 */
async function looseGame() {
  modal.style.display = "block";
  const wordHintObject = await getWordHint(WORD);
  const wordHint = wordHintObject.definitions[0].definition;
  const capitalised = `${WORD.charAt(0).toUpperCase()}${WORD.slice(1)}`;
  document.getElementById(
    "modal-text"
  ).textContent = `GAME OVER! The answer was ${capitalised}: ${wordHint}`;
  checkProgress(false);
  renderScore();
}

/**
 * Toggles "display-none" class for loading wheel container
 */
function toggleIsFetching() {
  document
    .getElementsByClassName("loading-wheel-container")[0]
    .classList.toggle("display-none");
}

/**
 * Rests game with new word and hint
 * @returns {Promise}
 */
async function newWord() {
  wordVisibility(false);
  playSound("eraser");
  DRAWING_COUNT = 0;
  HINT_CHECKED = false;
  toggleIsFetching();
  runGame();
}

/**
 * Turns on or ff vivibility of word container on chalk board
 * @param {boolean} option
 */
function wordVisibility(option) {
  let wordContainer = document.getElementsByClassName("word-container")[0];
  option ? wordContainer.classList.remove("invisible")
    : wordContainer.classList.add("invisible");
}

/**
 * Toggles mute audio icon and toggles boolean state of audio variable
 */
function toggleAudio() {
  let element = document.getElementById("mute-audio");
  let content =
    element.innerHTML === '<i class="fa-solid fa-volume-high"></i>' ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
  element.innerHTML = content;
  AUDIO_MUTE = AUDIO_MUTE ? false : true;
}

/**
 * Displays hint and removes 2 tries from the player
 *  @returns {Promise}
 */
async function giveHint() {
  modal.style.display = "block";
  let hint = await getWordHint(WORD);
  document.getElementById("modal-text").textContent =
    hint.definitions[0].definition;
  if (HINT_CHECKED === false) {
    renderStickman();
    renderStickman();
    HINT_CHECKED = true;
  }
}

/**
 * Main game function, with gated clauses and recursion handling random word discovery
 * @returns {Promise}
 */
async function runGame() {
  let randomWord = await getRandomWord();
  let word = randomWord.word;
  let isParsedOk = parseWord(word);
  if (isParsedOk === false) return runGame();
  let hint = await getWordHint(word);
  if (!hint.definitions[0]) return runGame();
  clearChars();
  let indicesToReveal = filterLettersToRender(word);
  restoreAllCharContainers();
  renderWord(word, indicesToReveal);
  removeEmptyCharContainers(word);
  hideAllDrawings();
  toggleIsFetching();
  renderScore();
}

runGame();
/* toggleIsFetching(); */
/* localStorage.setItem('myScore', 0 );
localStorage.setItem('bestScore', 0 ); */