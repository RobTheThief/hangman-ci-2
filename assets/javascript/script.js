let WORD = "";
let DRAWING_COUNT = 0;
let HINT_CHECKED = false;
let AUDIO_MUTE = true;

/* MODAL BASED ON https://www.w3schools.com/howto/howto_css_modals.asp */

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    document.getElementById('modal-text').textContent = '';
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    document.getElementById('modal-text').textContent = '';
    modal.style.display = "none";
  }
}
/* ******************************************************************* */

/*  Based on code institute love math project
    Adds event listeners for buttons once DOM is loaded    */
document.addEventListener('DOMContentLoaded', function(){
    let buttons = document.getElementsByClassName('button');
    for (let button of buttons) {
        button.addEventListener('click', function(){
            let buttonType = this.getAttribute('id');
            if (buttonType === 'check-letter') {
                checkLetter(WORD)
            }
            if (buttonType === 'new-word') {
                newWord();
            }
            if (buttonType === 'hint') {
                giveHint();
            }
            if (buttonType === 'mute-audio') {
                toggleAudio();
            }
        })
    }
});

/**
 * Get request to WordsApi for a random word
 * @returns promise with word object
 */
function getRandomWord () {
    return new Promise ( async resolve => {
        try {
            const response = await fetch("https://wordsapiv1.p.rapidapi.com/words/?random=true", {
                method: "GET",
                headers: {
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key": token,
                }
            });   
    
            const responseJson = await response.json(); //extract JSON from the http response
            WORD = responseJson.word;

            resolve(responseJson); 
            } catch (error) {
                alert(error);
                resolve();   
            }
    })
}

/**
 * Checks if the random word is greater than 11 characters and if there are any hyphens, dots or spaces.
 * @param {*} word 
 * @returns boolean
 */
function parseWord (word) {
    var re = new RegExp("([\.\ \-])");
    if (re.test(word)) return false
    if (word.length > 11) return false
    return true
}

/**
 * Looks for a definition of the random word in the WordsApi to be used as a hint
 * @param {*} word 
 * @returns Promise with a word definition object
 */
function getWordHint (word) {
    return new Promise ( async resolve => {
        try {
            const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`, {
                method: "GET",
                headers: {
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key": token,
                }
            });   
    
            const responseJson = await response.json(); //extract JSON from the http response

            resolve(responseJson); 
            } catch (error) {
                alert(error);
                resolve();   
            }
    })
}

/**
 * Checks how many letters in the word to determine the maximum number
 * of letters will be revealed at the beginning of the game
 * @param {*} word 
 * @returns intergers 1, 2 or 3
 */
function maxNumOfLetters (word) {
    let wordLength = word.length;
    if (wordLength <= 3 ) return 1;
    if (wordLength <= 6) return 2;
    if (wordLength <= 11) return 3;
}

/**
 * Randomly determines which letters of the word will be revealed at the
 * beginning of the game
 * @param {*} word 
 * @returns Array of indices of letters that will be revealed
 */
function filterLettersToRender (word) {
    let lettersToRevealeCount = maxNumOfLetters (word);
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
 * @param {*} word 
 * @param {*} indices 
 */
function renderWord (word, indices) {
    playSound('draw-letter');
    wordVisibility(true);
    letterArray = word.split("");
    for (let index of indices){
        let charElementContainer = document.getElementById(`letterdash-${parseFloat(index) + 1}`);
        charElementContainer.children[0].textContent = letterArray[index].toUpperCase();
        charElementContainer.classList.add('margin-bottom-increase');
    }
}

async function playSound(sound) {
    let soundType = document.getElementById(`${sound}-sound`);
    try {
        if (AUDIO_MUTE === false){
            await soundType.play();
        }
    } catch (error) {
        if (error.name === 'NotAllowedError'){
            AUDIO_MUTE = true;
            modal.style.display = 'block';
            document.getElementById('modal-text').textContent = `AUDIO ERROR: ${error.message}`;
        };
    }
}

/**
 * Checks if all the characters have been found
 */
function isGameWon () {
    letterArray = [];
    let elements = document.getElementsByClassName('letterdash-container');
    for (let element of elements) {
        let char = element.children[0].textContent;
        if (char !== ''){
            letterArray.push(char);
        }
    }
    console.log(WORD.length, letterArray.length);
    if (WORD.length === letterArray.length){
        gameWon();
    }
}

/**
 * Displays a message congratulating the player, and giving the answer
 * and hint. The game is then reset after 3 seconds.
 */
 async function gameWon () {
    modal.style.display = 'block';
    const wordHintObject = await getWordHint(WORD);
    const wordHint = wordHintObject.definitions[0].definition;
    const capitalised = `${(WORD.charAt(0)).toUpperCase()}${WORD.slice(1)}`;
    document.getElementById('modal-text').textContent = `CONGRATULATIONS!! The answer was ${capitalised}: ${wordHint}`;
    setTimeout(() => {
        newWord();
    }, 3000);
}

/**
 * Removes unused character containers from chalk board
 * @param {*} word 
 */
function removeEmptyCharContainers (word) {
    for (let id = word.length + 1; id <= 11; id++) {
       document.getElementById(`letterdash-${id}`).classList.add('display-none');
    }
}

/**
 * Restores all character containers on chalk board
 */
function restoreAllCharContainers () {
    for (let id = 1; id <= 11; id++) {
       document.getElementById(`letterdash-${id}`).classList.remove('display-none');
    }
}

/**
 * Checkes the letter entered into the text input and renders any match,
 * then checks if game is won. If there is not match it runs the
 * renderStickman function
 * @param {*} word 
 */
function checkLetter (word) {
    let testChar = document.getElementById('letter-input').value;
    let indices = [];
    if (word.includes(testChar.toLowerCase())) {
        for (let char in word) {
            console.log(word[char]);
            if (word[char] === testChar.toLowerCase())
            indices.push(char);
        }
        renderWord(word, indices);
    } else {
        renderStickman();
    }
    document.getElementById('letter-input').value = '';
    isGameWon();
}

/**
 * Hides all stickman and gallows drawings for the start of the game
 * and on reset
 */
function hideAllDrawings () {
    let elements = document.getElementsByClassName('game-drawings');
    for (let element of elements) {
        element.classList.add('invisible');
    }
}

/**
 * Removes "invivible" class from each piece of the drawing until
 * complete, ending the game.
 */
async function renderStickman () {
    let elements = document.getElementsByClassName('game-drawings');
    if (DRAWING_COUNT < 8){
        playSound('draw-line');
        elements[DRAWING_COUNT].classList.remove('invisible');
        ++DRAWING_COUNT
    }
    DRAWING_COUNT === 8 && looseGame();
} 

/**
 * Replaces textContent and removes "margin-bottom-increase" class of game characters
 * and containers respectivly
 */
function clearChars () {
    let elements = document.getElementsByClassName('letterdash-container');
    for (let element of elements) {
        element.classList.remove('margin-bottom-increase');
        element.children[0].textContent = '';
    }
}



/**
 * Displays message 'GAME OVER' with word and hint, and resets the game after 3 seconds
 */
async function looseGame () {
    modal.style.display = 'block';
    const wordHintObject = await getWordHint(WORD);
    const wordHint = wordHintObject.definitions[0].definition;
    const capitalised = `${(WORD.charAt(0)).toUpperCase()}${WORD.slice(1)}`;
    document.getElementById('modal-text').textContent = `GAME OVER! The answer was ${capitalised}: ${wordHint}`;
    setTimeout(() => {
        newWord();
    }, 3000);
}

/**
 * Toggles "invisible" class for loading wheel
 */
function toggleIsFetching() {
    document.getElementsByClassName('loading-wheel')[0].classList.toggle('invisible');
}

/**
 * Rests game with new word and hint
 */
async function newWord () {
    wordVisibility(false);
    playSound('eraser');
    DRAWING_COUNT = 0;
    HINT_CHECKED = false;
    toggleIsFetching();
    runGame();
}

/**
 * Toggles vivibility of word container on chalk board
 */
function wordVisibility (option) {
    let wordContainer = document.getElementsByClassName('word-container')[0];
    option ? wordContainer.classList.remove('invisible') : wordContainer.classList.add('invisible');
}

/**
 * Toggles mute audio icon and toggles boolean state of audio variable
 */
function toggleAudio() {
    let element = document.getElementById('mute-audio');
    let content = element.innerHTML === '<i class="fa-solid fa-volume-high"></i>' ?
        '<i class="fa-solid fa-volume-xmark"></i>' :
        '<i class="fa-solid fa-volume-high"></i>'
    element.innerHTML = content;
    AUDIO_MUTE = AUDIO_MUTE ? false : true;
}

/**
 * Displays hint and removes 2 tries from the player
 */
async function giveHint () {
    modal.style.display = 'block';
    let hint = await getWordHint(WORD);
    document.getElementById('modal-text').textContent = hint.definitions[0].definition;
    if (HINT_CHECKED === false) {
        renderStickman();
        renderStickman();
        HINT_CHECKED = true;
    }
}

async function runGame () {
    hideAllDrawings();
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
    toggleIsFetching();

    console.log('Parsed ok: ', isParsedOk, 'Word: ', word, 'Indexes to reveal: ', indicesToReveal);
}

runGame();