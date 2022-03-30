import {
  handleHitEnter,
  checkLetter,
  newWord,
  giveHint,
  toggleAudio,
  handleLandscapeWithFocus,
  handleOnblurInput,
} from "./eventhandlers.js";
import { openHelp, openContact } from "./gamemessages.js";
import { getCurrentWord } from "./apirequests.js";
import { runGame } from "./script.js";

const gameMessageWindow = document.getElementById("myModal");

/* Runs onDOMload() when the DOM loads */
document.addEventListener("DOMContentLoaded", function () {
  OnDOMload();
});

/**
 * When the user clicks anywhere outside of the modal, or
 * the user clicks on 'X', close the game message and clear text
 */
function bindExitMessagelListeners() {
  let span = document.getElementsByClassName("close")[0];
  window.onclick = function (event) {
    if (event.target === gameMessageWindow) {
      document.getElementById(
        "modal-text-wrapper"
      ).innerHTML = `<p id="modal-text"></p>`;
      gameMessageWindow.style.display = "none";
    }
  };
  span.onclick = function () {
    document.getElementById(
      "modal-text-wrapper"
    ).innerHTML = `<p id="modal-text"></p>`;
    gameMessageWindow.style.display = "none";
  };
}

/**
 * Template function for adding event listeners
 * @param {object} element
 * @param {string} type
 * @param {function} listener
 */
function universalAddListener(element, type, listener) {
  element.addEventListener(type, listener);
}

/**
 * Binds an event listener for all buttons
 */
function bindButtons() {
  let buttons = document.getElementsByClassName("button");
  for (let button of buttons) {
    button.addEventListener("click", function () {
      let buttonType = this.getAttribute("id");
      if (buttonType === "check-letter") {
        let currentWord = getCurrentWord();
        checkLetter(currentWord);
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
        openHelp(gameMessageWindow);
      }
      if (buttonType === "contact") {
        openContact(gameMessageWindow);
      }
    });
  }
}

/**
 * Scrolls up to top when screen is resized
 */
function scrollTopOnResize() {
  window.onresize = () => {
    window.scrollTo(0, 0);
  };
}

/**
 * Runs eventListener functions and runs the game when the DOM loads
 */
export function OnDOMload() {
  scrollTopOnResize();
  bindExitMessagelListeners();
  bindButtons();
  let letterInput = document.getElementById("letter-input");
  universalAddListener(letterInput, "keyup", handleHitEnter);
  universalAddListener(letterInput, "focus", handleLandscapeWithFocus);
  universalAddListener(letterInput, "blur", handleOnblurInput);
  runGame();
}
