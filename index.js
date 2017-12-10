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
let secret = 0;
const DEBUGGING = true;

// log to console if in debug mode;
const debug = (message) => {
  if (DEBUGGING) {
    console.log(message);
  }
}

// setup new game
const setupNewGame = () => {
  guesses = [];
  secret = Math.floor(Math.random() * 100) + 1;
  showAlert("New game! Pick a number between 1 & 100!");
  debug(`Secret number: ${secret}`);
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
const guess = () => {
  let playerGuess = Number(playerInput.value);
  if (playerGuess) {

  } else {
    alert('That guess was not a number!', playerGuess);
  }
  playerInput.value = "";
  playerInput.focus();
}

submit.addEventListener('click', () => {
  guess();
});
