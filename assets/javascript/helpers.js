import { getCurrentWord } from "./apirequests.js";

/**
 * Randomly determines which letters of the word will be revealed at the
 * beginning of the game
 * @param {string} word - any word 11 or less chars
 * @returns {Array} - indices of letters that will be revealed
 */
export function filterLettersToRender(word) {
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
 * Checks how many letters in the word to determine the maximum number
 * of letters will be revealed at the beginning of the game
 * @param {string} word - any word 11 or less chars
 * @returns {integer} - 1, 2 or 3
 */
export function maxNumOfLetters(word) {
    let wordLength = word.length;
    if (wordLength <= 3) return 1;
    if (wordLength <= 6) return 2;
    if (wordLength <= 11) return 3;
  }

  /**
 * Checks and updates game score and best score.  Sets new score depending on game outcome.
 * @param {boolean} result - true if game won, false if lost, empty just returns current and best score 
 * @returns {object} - returns object with returns current and best score
 */
export function checkProgress (result) {
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
 * Checks if the random word is greater than 11 characters and if there are any hyphens, dots or spaces.
 * @param {string} word - any word
 * @returns {boolean} - true if passed all test or false if failed any
 */
export function parseWord(word) {
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
export function parseLetter (char) {
    const re = new RegExp("([A-Za-z]{1})"); //https://regexr.com/ was used to help make expression
    return re.test(char);
}

/**
 * Checks if all the characters have been found
 * @returns {boolean}
 */
 export function isGameWon() {
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
 * Turns on or off vivibility of word container on chalk board
 * @param {boolean} option
 */
export function wordVisibility(option) {
    let wordContainer = document.getElementsByClassName("word-container")[0];
    option ? wordContainer.classList.remove("invisible")
      : wordContainer.classList.add("invisible");
}
  