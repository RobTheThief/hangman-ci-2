# HANGMAN INTERACTIVE CHALKBOARD GAME

Hangman Interactive Chalkboard game is an online version of the pen and paper game Hangman. It uses the words API to get a random word and to provide hints for the user. The game is designed to be entertaining and to broaden the players vocabulary.

![Responsive Mockup](./assets/media/responsivemockup.png)

## User Experience (UX)

- ### User stories

  - #### First Time Visitor Goals

    1. As a First Time Visitor, I want to easily understand the main purpose of the site and to easily learn about the game if unfamiliar with it.
    2. As a First Time Visitor, I want to be able to easily navigate throughout the page to find content.
    3. As a First Time Visitor, I want to be able to easily find and understand the controls of the game.

  - #### Returning Visitor Goals

    1. As a Returning Visitor, I want to be able to immediatly play the game without the need for tutorials.
    2. As a Returning Visitor, I want to find contact information.

- ### Design
  - #### Colour Scheme
    - The main colour used throughout is white to mimic the look of vhalk on a board.
  - #### Typography
    - The Amatic SC font is the main font used throughout the game with cursive as the fallback font in case the font isn't being imported into the site correctly. These are used to mimic the look of natural hand writing.
  - #### Imagery
    - Imagery used to make up the drawings of the stickman and dashes under the letters was designed to mimic chalk on board.
  - #### Wireframe
    - This wireframe was used initially to get an idea of the style and layout of the page would be:
      [Wireframe Screenshot](./assets/media/ci-p-2-hangman.png)

## FEATURES

### EXISTING FEATURES

- **Navigation bar**

  - Here the user can find the Help, Contact, and sound options. Help and contact open a modal with information and the mute button turns on or off sound.

  ![Navigation bar](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/navbar.png)

- **Instructional Message**

  - On landing on the page initially or when the page is refreshed there is an instructional message displayed with the loading wheel to make clear the purpose of the game.

  ![Instructional Message](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/loadingmessage.png)

- **Help Section**

  - This is accessed through the nav bar at the top of the screen and gives the player instructions and tips on how to play the game.

  ![Help Section](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/help.png)

- **Contact Section**

  - This is accessed through the nav bar at the top of the screen and allows the user to contact the devoloper with any suggestions, questions or report any bugs they might have encountered.

  ![Contact Section](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/contact.png)

- **Stickman and Gallows**

  - This allows the player to see how many letter guesses they have left to determine the progress of the game.

  ![Stickman and Gallows](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/gamebody.png)

- **Letters with underscores**

  - This allows the player to see what letters are revealed at the beginning of the game and what letters they have correctly guessed.
  - Some letters are randomly show at the beginning to help the player guess the word.
  - This allows the payer to track progress.

  ![Letters with underscores](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/letterdash.png)

- **Game Controls**

  - There is a check letter button that check if the letter in the text input is present in the word.
  - There is also a letter input for the user to type in the letter they tink could be in the word.
  - There is a New Word button that gives the player a new word without affecting the score.
  - Then there is a hint button that gives the player a hint describing the word. This also removes 2 turns and draws 2 pieces of the stickman.

  ![Game Controls](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/gamecontrols.png)

- **Score Tracker**

  - Above the controls is a score tracker that shows how many rounds have been won in a row and what is the players best win streak.

  ![Score Tracker](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/scoretraker.png)

## Technologies Used

### Languages Used

- [HTML5](https://en.wikipedia.org/wiki/HTML5)
- [CSS3](https://en.wikipedia.org/wiki/Cascading_Style_Sheets)
- [JavaScript](https://en.wikipedia.org/wiki/JavaScript)

### Frameworks, Libraries & Programs Used

1. [Google Fonts:](https://fonts.google.com/)
   - Google fonts were used to import the 'Amatic SC' font into the style.css file which is used in all text on the page.
1. [Font Awesome:](https://fontawesome.com/)
   - Font Awesome was used to add audio on and off icons.
1. [Git](https://git-scm.com/)
   - Git was used for version control by utilizing the Gitpod terminal to commit to Git and Push to GitHub.
1. [GitHub:](https://github.com/)
   - GitHub is used to store the projects code after being pushed from Git.
1. [GIMP:](https://www.gimp.org/)
   - GIMP was used for resizing images and for creating the games drawings of the letter underscores, stickman, gallows, and border.
1. [Audacity:](https://www.audacityteam.org/)
   - Audacity was used to compress the sound files.
1. [WordsAPI:](https://www.wordsapi.com/?ref=public-apis)
   - WordsAPI was used to fetch new random words and their definitions to give fresh words to draw on, and to keep the game interesting.

## TESTING

### Testing User Stories from User Experience (UX) Section

- #### First Time Visitor Goals

  1. As a First Time Visitor, I want to easily understand the main purpose of the site and to easily learn about the game if unfamiliar with it.
     1. On accessing the site the user is gives a brief instructional message on the basic premis of the game.
     2. A new word is fetched and the game is ready to play.
     3. In the nav bar is a help button with detailed instructions on how to play the game, with some tips.
  2. As a First Time Visitor, I want to be able to easily navigate throughout the site to find content.
     1. The navigation bar at the top of the screen has a help and a contact sections for instructions, tip, and contact information.
  3. As a First Time Visitor, I want to be able to easily find and understand the controls of the game.
     1. The main game controls are clearly displayed below the gallows section.
     2. Check letter is grouped beside the letter input.
     3. The user can use the check letter button or they can simply hit enter, wich is useful with a soft keyboard.
     4. New word and hint are clearly displayed seperate from the check letter and letter input.

- #### Returning Visitor Goals

  1. As a Returning Visitor, I want to find contact information fo the developers of the game.
     1. in the van bar there is a contact button which open a modal with a link to the devolopers website which has information on how to contact the devoloper using the website.
  2. As a Returning Visitor, I want to keep track of my score.
     1. The game store the current and best win streaks of the player locally so that it is available even when refreshing the page.
  3. As a Returning Visitor, I want to always have new content to keep me interested.
     1. The game uses the WordsAPI to get random words and definitions so that there is always a huge database of words to draw from.

### Known Bugs

- In screens with a height smaller than 625px the gallows begins to overlap and obstruct other parts of the game.
  - This is only an issue on smaller phones and it was determined that:
  1. Phone of the sie are less common.
  2. The game would be very difficult to play on a very small screen as reducing down the sizes of the elements to accomodate the screen would impare visibility and ability to interact with the controls.

### Further Testing

- The Website was tested on Google Chrome, Firefox, Microsoft Edge, Brave Browser, Ecosia and Safari.
- The website was viewed on a variety of devices such as Desktop, Laptop, Samsung S9, S10, iPhone X.
- Friends and family members were asked to review the site and documentation to point out any bugs and/or user experience issues.

### Validator Testing

- HTML
  - No errors were returned when passing through the official W3C validator.
    ![HTML VALIDATOR](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/htmlvalidator.png)
- CSS
  - No errors were found when passing through the official(Jigsaw) validator.
    ![CSS VALIDATOR](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/cssvalidated.png)
- Accessibility

  - I confirm that the colours and fonts are easy to read and accessible by running it through the lighthouse in devtools.

  ![LIGHTHOUSE METRICS](https://github.com/RobTheThief/hangman-ci-2/blob/master/assets/media/lighthousemetrics.png)

## Deployment

- The site was deployed to GitHub pages. The steps to deploy are as follows:
  - In the GitHub repository, navigate to the Settings tab
  - From the source section drop-down menu, select the main branch.
  - Once the main branch has been selected, the page will be automatically refreshed with a detailed ribbon display to indicate the successful deployment.

The live link can be found here - https://robthethief.github.io/hangman-ci-2/

## Credits

### Content

- The icons for the audio on and off were taken from [Font Awesome](https://fontawesome.com/)
- Modal was based on [W3Schools](https://www.w3schools.com/howto/howto_css_modals.asp)

### Media

- The photos used for the noose, and noose logo are from [Shutterstock](https://www.shutterstock.com/)
- Blackboard background is taken from [Pixabay](https://pixabay.com)
- Sound files were taken from [Freesound](https://freesound.org/)
