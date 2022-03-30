"use strict";

import { getCurrentWord, getRandomWord, getWordHint } from './apirequests.js';
import { checkProgress, filterLettersToRender, parseWord } from './helpers.js';
import { renderWord } from './eventhandlers.js';

const gameMessageWindow = document.getElementById("myModal");

/* MODAL BASED ON https://www.w3schools.com/howto/howto_css_modals.asp *

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
 * Renders current and best score streak
 */
export function renderScore () {
  let score = checkProgress();
  let scoreElement = document.getElementById('best-streak');
  scoreElement.textContent = `Current Streak: ${score.currentScore ? score.currentScore : 0} Best: ${score.bestScore ? score.bestScore : 0}`;
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

/* toggleIsFetching(); */
/* localStorage.setItem('myScore', 0 );
localStorage.setItem('bestScore', 0 ); */