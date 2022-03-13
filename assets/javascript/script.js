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

function parseWord (word) {
    console.log(word.length);
    var term = "sample1-";
    var re = new RegExp("([\.\ \-])");  /* ("^([a-z0-9]{5,})$"); */
    if (re.test(term)) {
        console.log("Valid");
    } else {
        console.log("Invalid");
    }
}

function getWordHint (word) {

}

function filterLettersToRender (word) {

}

function renderWord (word) {

}

function renderStickman () {

}

async function runGame () {
    let randomWord = await getRandomWord();
    parseWord(randomWord.word);
}

runGame();