import { token } from './apitoken.js';

let WORD = '';

/**
 * Get request to WordsApi for a random word
 * @returns {Promise} - word object
 */
 export function getRandomWord() {
    return new Promise(async (resolve) => {
      try {
        const response = await fetch(
          "https://wordsapiv1.p.rapidapi.com/words/?random=true",
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
              "x-rapidapi-key": token,
            },
          }
        );
        
        const responseJson = await response.json(); //extract JSON from the http response
        WORD = responseJson.word;
  
        resolve(responseJson);
      } catch (error) {
        alert(error);
        resolve();
      }
    });
  }

/**
 * Looks for a definition of the random word in the WordsApi to be used as a hint
 * @param {string} word - any word
 * @returns {Promise} - word definition object
*/
export function getWordHint() {
    return new Promise(async (resolve) => {
      try {
        const response = await fetch(
          `https://wordsapiv1.p.rapidapi.com/words/${WORD}/definitions`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
              "x-rapidapi-key": token,
            },
          }
        );
  
        const responseJson = await response.json(); //extract JSON from the http response
  
        resolve(responseJson);
      } catch (error) {
        alert(error);
        resolve();
      }
    });
  }

  export function getCurrentWord() {
      return WORD;
  }