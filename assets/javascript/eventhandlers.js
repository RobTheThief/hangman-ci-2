import { renderScore, runGame, toggleIsFetching } from "./script.js";
import { getCurrentHint, getCurrentWord } from "./apirequests.js";
import {
  checkProgress,
  isGameOver,
  isValidLetter,
  wordVisibility,
} from "./helpers.js";
import { newBestScoreMessage } from "./gamemessages.js";

var HINT_CHECKED = false;
var DRAWING_COUNT = 0;
var AUDIO_MUTE = true;
const gameMessageWindow = document.getElementById("myModal");

/*  Handles enter key event and scrolls the page back to the top and blurs
    input to hide soft keyboard after 500ms */
export function handleHitEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let currentWord = getCurrentWord();
    checkLetter(currentWord);
    setTimeout(() => {
      document.getElementById("letter-input").blur();
      window.scrollTo(0, 0);
    }, 500);
  }
}

/**
 * Checks the letter entered into the text input and renders any match,
 * then checks if game is won. If there is no match it runs the
 * renderStickman function
 * @param {string} word - any word
 */
export function checkLetter(word) {
  let indices = [];
  let testChar = document.getElementById("letter-input").value;
  const isValid = isValidLetter(testChar);
  const isCharInWord = word.includes(testChar.toLowerCase());
  if (isCharInWord && isValid) {
    for (let char in word) {
      if (word[char] === testChar.toLowerCase()) indices.push(char);
    }
    renderWord(word, indices);
  } else if (isValid) {
    renderStickman();
  }
  if (isGameOver()) {
    gameWon();
  }
  document.getElementById("letter-input").value = "";
}

/**
 * Resets game with new word and hint
 * @returns {Promise}
 */
export async function newWord() {
  wordVisibility(false);
  playSound("eraser");
  DRAWING_COUNT = 0;
  HINT_CHECKED = false;
  toggleIsFetching();
  runGame();
}

/**
 * Displays hint and removes 2 tries from the player
 *  @returns {Promise}
 */
export async function giveHint() {
  gameMessageWindow.style.display = "flex";
  let hint = getCurrentHint();
  document.getElementById("modal-text").textContent = hint;
  if (HINT_CHECKED === false) {
    renderStickman();
    renderStickman();
    HINT_CHECKED = true;
  }
}

/**
 * Toggles mute audio icon and toggles boolean state of audio variable
 */
export function toggleAudio() {
  let element = document.getElementById("mute-audio");
  let content =
    element.innerHTML === '<i class="fa-solid fa-volume-high"></i>'
      ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
  element.innerHTML = content;
  AUDIO_MUTE = AUDIO_MUTE ? false : true;
}

/*
Adds invisible class to gallows and stickman container on focus,
on mobile devices in landscape mode, to prevent it from blocking content when the
soft keyboard pops up
*/
export function handleLandscapeWithFocus() {
  if (window.innerHeight < window.innerWidth) {
    document
      .getElementsByClassName("hangman-gallows-wrapper")[0]
      .classList.add("invisible");
  }
}

/*
  Removes invisible class from gallows and stickman container and scrolls
  up to the top of the page on blur
*/
export function handleOnblurInput(event) {
  document
    .getElementsByClassName("hangman-gallows-wrapper")[0]
    .classList.remove("invisible");
  window.scrollTo(0, 0);
}

/**
 * Displays a message congratulating the player, and giving the answer
 * and hint. The game is then reset after 3 seconds.
 * @returns {Promise}
 */
function gameWon() {
  let currentWord = getCurrentWord();
  gameMessageWindow.style.display = "flex";
  const wordHint = getCurrentHint();
  const capitalised = `${currentWord
    .charAt(0)
    .toUpperCase()}${currentWord.slice(1)}`;
  if (DRAWING_COUNT !== 8) {
    let score = checkProgress();
    let newScore = checkProgress(true);
    renderScore();
    if (score.bestScore < newScore.bestScore) {
      newBestScoreMessage(
        newScore.currentScore,
        capitalised,
        wordHint,
        gameMessageWindow
      );
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
 * Removes invisible class of word container and renders a list of letters to the chalk board
 * @param {string} word - any word 11 or less chars
 * @param {Array} indices - array containing integers
 */
export function renderWord(word, indices) {
  playSound("draw-letter");
  wordVisibility(true);
  let letterArray = word.split("");
  for (let index of indices) {
    let charElementContainer = document.getElementById(
      `letterdash-${parseFloat(index) + 1}`
    );
    charElementContainer.children[0].textContent =
      letterArray[index].toUpperCase();
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
 * Displays message 'GAME OVER' with word and hint, and resets the game after 3 seconds
 * @returns {Promise}
 */
function looseGame() {
  let currentWord = getCurrentWord();
  gameMessageWindow.style.display = "flex";
  const wordHint = getCurrentHint();
  const capitalised = `${currentWord
    .charAt(0)
    .toUpperCase()}${currentWord.slice(1)}`;
  document.getElementById(
    "modal-text"
  ).textContent = `GAME OVER! The answer was ${capitalised}: ${wordHint}`;
  checkProgress(false);
  renderScore();
}
