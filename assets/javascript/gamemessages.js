/**
 * Opens modal and adds elements with information about the game
 */
export function openHelp (gameMessageWindow) {
  gameMessageWindow.style.display = "flex";
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
        stickman has their eyes and mouth the game is over. You can also use the "Hint"
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
export function openContact (gameMessageWindow) {
  gameMessageWindow.style.display = "flex";
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
export function newBestScoreMessage (score, capitalised, wordHint, gameMessageWindow) {
    gameMessageWindow.style.display = "flex";
    let element = document.getElementById("modal-text-wrapper");
    element.innerHTML = `
      <h3>NEW BEST SCORE!!!</h3>
      <p>🎈🎊 Well Done. You have achieved a new best win streak of ${score} 🎊🎈
      </p>
      <p>The answer was ${capitalised}: ${wordHint}
      </p>`;  // Emojis from https://emojipedia.org/
    window.scrollTo(0, 0);
}