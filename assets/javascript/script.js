"use strict";

import { OnDOMload } from './eventlisteners.js';
import { getCurrentWord, getRandomWord, getWordHint } from './apirequests.js';

var DRAWING_COUNT = 0;
var AUDIO_MUTE = true;

export const gameMessageWindow = document.getElementById("myModal");

/* MODAL BASED ON https://www.w3schools.com/howto/howto_css_modals.asp */

document.addEventListener("DOMContentLoaded", function () {
  OnDOMload()
});

/**
 * Checks if the random word is greater than 11 characters and if there are any hyphens, dots or spaces.
 * @param {string} word - any word
 * @returns {boolean} - true if passed all test or false if failed any
 */
function parseWord(word) {
  const re = new RegExp("([. -]|[0-9])"); //https://regexr.com/ was used to help make expression
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
 * Toggles the opacity between 1 and 0 at the beginning
 * of game
 * 
 */
function toggleGameBeginMsg () {
  let currentWord = getCurrentWord();
  if (!currentWord)  {
    let elements = document.getElementsByClassName('game-msg');
    elements = Object.values(elements);
    function toggleClasses (e) {
      e.classList.toggle('opacity-one');
    }
    elements.forEach(toggleClasses);
    setTimeout(() => {
      elements.forEach(toggleClasses);
    }, 2000);
  }
}



/**
 * Checks and updates game score and best score.  Sets new score depending on game outcome.
 * @param {boolean} result - true if game won, false if lost, empty just returns current and best score 
 * @returns {object} - returns object with returns current and best score
 */
function checkProgress (result) {
  let currentScore = localStorage.getItem('myScore');
  currentScore = currentScore === null ? 0 : currentScore;
  localStorage.setItem('myScore', currentScore);

  let bestScore = localStorage.getItem('bestScore');
  bestScore = bestScore === null ? 0 : bestScore;
  localStorage.setItem('bestScore', bestScore);
  if (result === undefined) return {currentScore: currentScore, bestScore: bestScore};

  let newScore = (result && currentScore) ? ++currentScore : currentScore !== 0 ? 0 : 1;
  let newBest = newScore > bestScore ? newScore : bestScore;
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
    //charElementContainer.classList.add("margin-bottom-increase");
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
      gameMessageWindow.style.display = "flex";
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
  let currentWord = getCurrentWord();
  return (currentWord.length === letterArray.length) ? true : false;
}

/**
 * Displays a message congratulating the player, and giving the answer
 * and hint. The game is then reset after 3 seconds.
 * @returns {Promise}
 */
async function gameWon() {
  let currentWord = getCurrentWord();
  gameMessageWindow.style.display = "flex";
  const wordHintObject = await getWordHint();
  const wordHint = wordHintObject.definitions[0].definition;
  const capitalised = `${currentWord.charAt(0).toUpperCase()}${currentWord.slice(1)}`;
  if (DRAWING_COUNT !== 8) {
    let score = checkProgress();
    let newScore = checkProgress(true);
    renderScore();
    if (score.bestScore < newScore.bestScore) {
      renderNewBest (newScore.currentScore, capitalised, wordHint);
    } else {
      document.getElementById(
        "modal-text"
      ).textContent = `CONGRATULATIONS!! The answer was ${capitalised}: ${wordHint}`;
    }
  } else {
    document.getElementById(
      "modal-text"
    ).textContent = `Sorry but the game was already is over. The answer was ${capitalised}: ${wordHint}`;
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
  let currentWord = getCurrentWord();
  gameMessageWindow.style.display = "flex";
  const wordHintObject = await getWordHint();
  const wordHint = wordHintObject.definitions[0].definition;
  const capitalised = `${currentWord.charAt(0).toUpperCase()}${currentWord.slice(1)}`;
  document.getElementById(
    "modal-text"
  ).textContent = `GAME OVER! The answer was ${capitalised}: ${wordHint}`;
  checkProgress(false);
  renderScore();
}

/**
 * Toggles "display-none" class for wheel bar container
 */
function toggleIsFetching() {
  document
    .getElementsByClassName("loading-wheel-container")[0]
    .classList.toggle("display-none");
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
 * Main game function, with gated clauses and recursion handling random word discovery
 * @returns {Promise}
 */
async function runGame() {
  hideAllDrawings();
  toggleGameBeginMsg();
  let randomWord = await getRandomWord();
  let word = randomWord.word;
  let isParsedOk = parseWord(word);
  if (isParsedOk === false) return runGame();
  let hint = await getWordHint();
  if (!hint.definitions[0]) return runGame();
  clearChars();
  let indicesToReveal = filterLettersToRender(word);
  restoreAllCharContainers();
  renderWord(word, indicesToReveal);
  removeEmptyCharContainers(word);
  toggleIsFetching();
  renderScore();
}

runGame();
/* toggleIsFetching(); */
/* localStorage.setItem('myScore', 0 );
localStorage.setItem('bestScore', 0 ); */