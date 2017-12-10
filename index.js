console.log("pick a number");

// add buttons
const submit = document.querySelector('#submit');
const newGame = document.querySelector('#new-game');
const hint = document.querySelector('#hint');
const playerInput = document.querySelector('#player-input');
const guessList = document.querySelector('#guesses');
const alertMessage = document.querySelector('#alert-message');

const showAlert = (message, color) => {
  if (color) {
    alertMessage.style.color = color;
  } else {
    alertMessage.style.color = 'black';
  }
  alertMessage.innerHTML = message;
}

// globals
let guesses = [];
let boxOfSecrets = {};
let gameOver = false;
let gameWon = false;
const DEBUGGING = true;

// log to console if in debug mode;
const debug = (message) => {
  if (DEBUGGING) {
    console.log(message);
  }
}

// setup new game
const guessingGame = () => {
  let secret = Math.floor(Math.random() * 100) + 1;
  debug(`Secret number: ${secret}`);
  return {
    checkGuess: function(guess) {
      if (guess === secret) {
        return 'correct';
      } else if (Math.abs(guess - secret) < 5) {
        return 'hot';
      } else if (Math.abs(guess - secret) < 15) {
        return 'warm';
      } else {
        return 'cold';
      }
    }
  }
}

const setupNewGame = () => {
  let guesses = [];
  let boxOfSecrets = guessingGame();
  let gameOver = false;
  let gameWon = false;
  showAlert("New game! Pick a number between 1 & 100!");
}

setupNewGame();

newGame.addEventListener('click', () => {
  debug(`New Game!`);
  setupNewGame();
});


// define hint
const showHint = () => {
  debug('hint');
  alert(`Secret number: ${secret}`);
}

hint.addEventListener('click', () => {
  showHint();
});

// guess
const guess = (playerGuess) => {
  debug(`Player guessed: ${playerGuess}`);
  if (playerGuess.toString() === 'NaN') {
    showAlert('That guess was not a number!', playerGuess);
  } else if (playerGuess < 1 || playerGuess > 100) {
    showAlert('Your guess must be between 1 and 100!');
  } else {
    let check = boxOfSecrets.checkGuess() {
      if (check === 'correct') {
        showAlert(`${playerGuess} is the right number! right!`);
        gameOver = true;
        gameWon = true;
      } else if (check === 'hot') {
        ;
      }
    }
  }
  playerInput.value = "";
  playerInput.focus();
}

submit.addEventListener('click', () => {
  guess(playerInput.value);
});
