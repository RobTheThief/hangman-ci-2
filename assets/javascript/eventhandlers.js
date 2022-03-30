/*  Handles enter key event and scrolls the page back to the top and blurs
    input to hide soft keyboard after 500ms */
export function handleHitEnter (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        checkLetter(WORD);
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
 * Toggles mute audio icon and toggles boolean state of audio variable
 */
 export function toggleAudio() {
    let element = document.getElementById("mute-audio");
    let content =
      element.innerHTML === '<i class="fa-solid fa-volume-high"></i>' ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';
    element.innerHTML = content;
    AUDIO_MUTE = AUDIO_MUTE ? false : true;
}
  