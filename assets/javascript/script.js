"use strict";

import { getCurrentWord, getRandomWord, getWordHint } from "./apirequests.js";
import {
  checkProgress,
  selectLettersToReveal,
  isValidWord,
} from "./helpers.js";
import { renderWord } from "./eventhandlers.js";

const gameMessageWindow = document.getElementById("myModal");

/* MODAL BASED ON https://www.w3schools.com/howto/howto_css_modals.asp */

const gallowsAttributeValues = [
  {
    image: "gallows",
    alt: "hangman gallows",
    class: "gallows",
  },
  {
    image: "gamenoose",
    alt: "stickman head",
    class: "game-drawings noose",
  },
  {
    image: "head",
    alt: "stickman head",
    class: "game-drawings stickman-head",
  },
  {
    image: "body",
    alt: "stickman body",
    class: "game-drawings stickman-body",
  },
  {
    image: "rightarm",
    alt: "stickman right arm",
    class: "game-drawings stickman-rarm",
  },
  {
    image: "leftarm",
    alt: "stickman left arm",
    class: "game-drawings stickman-larm",
  },
  {
    image: "leftleg",
    alt: "stickman left leg",
    class: "game-drawings stickman-lleg",
  },
  {
    image: "rightleg",
    alt: "stickman right leg",
    class: "game-drawings stickman-rleg",
  },
  {
    image: "face",
    alt: "stickman face",
    class: "game-drawings stickman-face",
  },
];

/**
 * Interates through an array of objects with data on attributes to insert
 * image elements into a divs innerHTML using template literals
 */
function renderHangmanGallows() {
  let element = document.getElementById("hangman-gallows-container");
  element.innerHTML = "";
  for (let i in gallowsAttributeValues) {
    element.innerHTML += ` <img
                            src="./assets/images/${gallowsAttributeValues[i].image}.png"
                            alt="${gallowsAttributeValues[i].alt}"
                            class="${gallowsAttributeValues[i].class}"
                            />`;
  }
}

/**
 * Interates through 0 to 11 to insert
 * image elements into a divs innerHTML using template literals
 */
function renderLetterDashes() {
  let element = document.getElementById("word-container");
  element.innerHTML = "";
  for (let i = 0; i < 11; i++) {
    element.innerHTML += `<div class="letterdash-container" id="letterdash-${
      i + 1
    }">
                            <span class="letter-span"></span>
                            <img
                              src="./assets/images/letterdash.png"
                              alt="letter underscore or dash"
                              class="letterdash"
                            />
                          </div>`;
  }
}

/**
 * Toggles the opacity between 1 and 0 at the beginning
 * of game
 *
 */
function toggleGameBeginMsg() {
  let currentWord = getCurrentWord();
  if (!currentWord) {
    let elements = document.getElementsByClassName("game-msg");
    elements = Object.values(elements);
    function toggleClasses(e) {
      e.classList.toggle("opacity-one");
    }
    elements.forEach(toggleClasses);
    setTimeout(() => {
      elements.forEach(toggleClasses);
    }, 2000);
  }
}

/**
 * Renders current and best score streak
 */
export function renderScore() {
  let score = checkProgress();
  let scoreElement = document.getElementById("best-streak");
  scoreElement.textContent = `Current Streak: ${
    score.currentScore ? score.currentScore : 0
  } Best: ${score.bestScore ? score.bestScore : 0}`;
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
 * Toggles "display-none" class for wheel bar container
 */
export function toggleIsFetching() {
  document
    .getElementsByClassName("loading-wheel-container")[0]
    .classList.toggle("display-none");
}

/**
 * Main game function, with gated clauses and recursion handling random word discovery
 * @returns {Promise}
 */
export async function runGame() {
  renderHangmanGallows();
  renderLetterDashes();
  hideAllDrawings();
  toggleGameBeginMsg();
  let randomWord = await getRandomWord();
  let word = randomWord.word;
  let isValid = isValidWord(word);
  if (isValid === false) return runGame();
  let hint = await getWordHint();
  if (!hint.definitions[0]) return runGame();
  clearChars();
  let indicesToReveal = selectLettersToReveal(word);
  restoreAllCharContainers();
  renderWord(word, indicesToReveal);
  removeEmptyCharContainers(word);
  toggleIsFetching();
  renderScore();
}
