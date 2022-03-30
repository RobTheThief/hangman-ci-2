import { gameMessageWindow } from './script.js';
import { handleHitEnter, checkLetter, newWord, giveHint, toggleAudio, openHelp, openContact} from './eventhandlers.js';
import { openHelp, openContact } from './gamemessages.js';

// When the user clicks anywhere outside of the modal, close it and clear text
// When the user clicks on <span> (x), close the modal and clear text
function bindExitModalListeners () {
    let span = document.getElementsByClassName("close")[0];
    window.onclick = function (event) {
        if (event.target === gameMessageWindow) {
            document.getElementById("modal-text-wrapper").innerHTML = `<p id="modal-text"></p>`;
            gameMessageWindow.style.display = "none";
        }
    };
    span.onclick = function () {
        document.getElementById("modal-text-wrapper").innerHTML = `<p id="modal-text"></p>`;
        gameMessageWindow.style.display = "none";
    };
}

function universalAddListener(element, type, listener) {
    element.addEventListener(type, listener);
}

function bindButtons(WORD) {
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
            openHelp(gameMessageWindow);
        }
        if (buttonType === "contact") {
            openContact();
        }
        });
    }
};

export function OnDOMload(WORD) {
    bindExitModalListeners();
    bindButtons(WORD);
    let letterInput = document.getElementById("letter-input");
    universalAddListener(letterInput, "keyup", handleHitEnter);
}