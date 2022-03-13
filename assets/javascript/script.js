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

/* Based on code institute love math project */
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

function filterLettersToRender (word) {

}

function renderWord (word) {

}

function renderStickman () {

}

async function runGame () {
    let randomWord = await getRandomWord();
    let isParsedOk = parseWord(randomWord.word);
    if (isParsedOk === false) return runGame();
    let hint = await getWordHint(randomWord.word);
    if (!hint.definitions[0]) return runGame();

    console.log('Parsed ok: ', isParsedOk, 'Word: ', randomWord.word);
    console.log(hint.definitions[0].definition)
}

runGame();