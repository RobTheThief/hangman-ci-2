/* MODAL BASED ON https://www.w3schools.com/howto/howto_css_modals.asp */

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
/* ******************************************************************* */

/*  Based on code institute love math project
    Adds event listeners for buttons once DOM is loaded    */
document.addEventListener('DOMContentLoaded', function(){
    let buttons = document.getElementsByClassName('button');
    console.log(buttons);
    for (let button of buttons) {
        button.addEventListener('click', function(){
            let buttonType = this.getAttribute('id');
            alert(`You clicked ${buttonType} button`);
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
 * Renders a list of letters to the chalk board
 * @param {*} word 
 * @param {*} indices 
 */
function renderWord (word, indices) {
    letterArray = word.split("");
    for (let index of indices){
        console.log(index, letterArray[index]);
        let charElementContainer = document.getElementById(`letterdash-${parseFloat(index) + 1}`);
        charElementContainer.children[0].textContent = letterArray[index].toUpperCase();
    }
}

function renderStickman () {

}

async function runGame () {
    let randomWord = await getRandomWord();
    let word = randomWord.word;
    let isParsedOk = parseWord(word);
    if (isParsedOk === false) return runGame();
    let hint = await getWordHint(word);
    if (!hint.definitions[0]) return runGame();
    let indicesToReveal = filterLettersToRender(word);
    renderWord(word, indicesToReveal);

    console.log('Parsed ok: ', isParsedOk, 'Word: ', word, 'Indexes to reveal: ', indicesToReveal);
    console.log(hint.definitions[0].definition)
}

runGame();