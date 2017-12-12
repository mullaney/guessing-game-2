const MAX_GUESSES = 5;
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;
let debugMode = false;

function debug(message) {
  if (debugMode) { console.log(message); }
}

function generateWinningNumber(number) {
  debug('generateWinningNumber > number: ' + number);
  number = Number(number);
  if (!Number.isNaN(number) && number >= MIN_NUMBER && number <= MAX_NUMBER) {
    return number;
  } else {
    debug('use random');
    return Math.floor(Math.random() * (MAX_NUMBER + 1 - MIN_NUMBER)) + MIN_NUMBER;
  }
}

function setUpGame(number) {

  var winningNumber = generateWinningNumber(number);
  return {
    guesses: [],
    hintGiven: false,
    checkGuess: function(guess) {
      guess = Number(guess);
      if (!Number.isNaN(guess) && guess >= MIN_NUMBER && guess <= MAX_NUMBER && guess % 1 === 0 && this.guesses.length < MAX_GUESSES) {
        this.guesses.push(guess);
      }
      return (guess === winningNumber) ? true : false;
    },
    getGameStatus: function() {
      if (this.guesses.indexOf(winningNumber) >= 0) {
        return 'won';
      } else if (this.guesses.length < 5) {
        return 'playing';
      } else {
        return 'lost';
      }
    },
    resetGame: function(number) {
      debug('resetGame > number: ' + number)
      winningNumber = generateWinningNumber(number);
      this.guesses = [];
      this.hintGiven = false;
    },
    getHint: function() {
      if (this.hintGiven) {
        return "You already got a hint!";
      } else if (this.getGameStatus() === 'lost') {
        return "Game over, no more hints!"
      } else {
        this.hintGiven = true;
        let divisors = [11, 7, 5, 3, 2];
        let index = this.guesses.length;
        return `If you divide the winning number by ${divisors[index]}, you get ${winningNumber % divisors[index]} as the remainder.`;
      }
    },
    highOrLow: function() {
      if (this.guesses.length === 0) {
        return 'No guesses yet! ';
      }
      var lastGuess = this.guesses[this.guesses.length - 1];
      if (lastGuess < winningNumber) {
        return 'Too low! ';
      } else if (lastGuess > winningNumber) {
        return 'Too high! ';
      } else if (lastGuess === winningNumber) {
        return 'Just right! ';
      }
    },
    hotOrCold: function() {
      if (this.guesses.length === 0) {
        return 'Really, no guesses yet!';
      }
      var lastGuess = this.guesses[this.guesses.length - 1];
      if (Math.abs(lastGuess - winningNumber) <= 7) {
        return 'But you\'re on fire!';
      } else if (Math.abs(lastGuess - winningNumber) <= 15) {
        return 'But you\'re getting warm!';
      } else if (Math.abs(lastGuess - winningNumber) <= 30) {
        return 'And you are kinda chilly.';
      } else if (Math.abs(lastGuess - winningNumber) > 30) {
        return 'And you are ice cold.';
      }
    }
  };
}

var submitButton = document.querySelector('button#submit');
var playerInput  = document.querySelector('input#player-input');
var guessList    = document.querySelector('ul#guesses');
var alertMessage = document.querySelector('h2#alert-message');
var resetButton  = document.querySelector('button#reset');
var hintButton   = document.querySelector('button#hint');

var showAlert = function (message, color) {
  if (color) {
    alertMessage.style.color = color;
  } else {
    alertMessage.style.color = 'black';
  }
  alertMessage.innerHTML = message;
}

var showGuesses = function() {
  for (var i = 0; i < 5; i++) {
    if (game.guesses[i]) {
      guessList.children[i].innerHTML = game.guesses[i];
    } else {
      guessList.children[i].innerHTML = "-";
    }
  }
}

var game = {};

var gameInit = function() {
  showAlert(`Pick a number between ${MIN_NUMBER} and ${MAX_NUMBER}`, 'black');
  game = setUpGame();
  playerInput.value = "";
  playerInput.focus();
  showGuesses();
  submitButton.classList.remove('hidden');
}

gameInit();


submitButton.addEventListener('click', function() {
  if (game.getGameStatus() === 'playing') {
    if (game.checkGuess(playerInput.value)) {
      showAlert('Congratulations! You won. The answer was: ' + playerInput.value);
      playerInput.readonly = true;
      playerInput.value = '🤪';
      submitButton.classList.add('hidden');
    } else if (game.guesses.length === 5) {
      playerInput.readonly = true;
      playerInput.value = '😢';
      submitButton.classList.add('hidden');
      showAlert('I\'m sorry. You lost. Hit reset to play again!');
    } else {
      showAlert(game.highOrLow() + game.hotOrCold());
      playerInput.value = "";
      playerInput.focus();
    }
    showGuesses();
  }
});

hintButton.addEventListener('click', function() {
  showAlert(game.getHint(), 'green');
});

resetButton.addEventListener('click', function() {
  gameInit();
});
