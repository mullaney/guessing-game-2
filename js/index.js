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
      if (typeof guess === 'string' && guess.trim() === '') {
        throw new Error('To guess, type a number in the circle below');
      }
      guess = Number(guess);
      if (guess < MIN_NUMBER) {
        throw new Error('Your guess is lower than the minimum guess');
      } else if (guess > MAX_NUMBER) {
        throw new Error('Your guess is higher than the maximum guess');
      } else if (Number.isNaN(guess)) {
        throw new Error('That guess is not a number');
      } else if (guess % 1 !== 0) {
        throw new Error('Your guess must be a whole number');
      }
      if (this.guesses.length < MAX_GUESSES) {
        this.guesses.push(guess);
      }
      return (guess === winningNumber);
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
    resetGame: function(num) {
      debug('resetGame > number: ' + num)
      winningNumber = generateWinningNumber(num);
      this.guesses = [];
      this.hintGiven = false;
    },
    getHint: function() {
      if (this.hintGiven) {
        return 'You already got a hint!';
      } else if (this.getGameStatus() === 'won') {
        return "I'll give you a hint. Maybe you should press the reset button!";
      } else if (this.getGameStatus() === 'lost') {
        return 'The answer was ' + winningNumber;
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
var guessDivs   = [
  document.querySelector('div#guess0'),
  document.querySelector('div#guess1'),
  document.querySelector('div#guess2'),
  document.querySelector('div#guess3'),
  document.querySelector('div#guess4')
]
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

var game = {};

var showGuesses = function() {
  for (var i = 0; i < 5; i++) {
    if (game.guesses[i]) {
      guessDivs[i].innerHTML = game.guesses[i];
    } else {
      guessDivs[i].innerHTML = '?';
    }
  }
}

var disableInput = function() {
  playerInput.readonly = true;
  submitButton.classList.add('hidden');
}

var enableInput = function() {
  submitButton.classList.remove('hidden');
  playerInput.value = '';
  playerInput.focus();
}

var clearHints = function() {
  for (var i = 0; i < guessDivs.length; i++) {
    guessDivs[i].setAttribute('data-info', 'Use circle above to enter guesses');
  }
}

var gameInit = function() {
  showAlert(`Pick a number between ${MIN_NUMBER} and ${MAX_NUMBER}`, 'black');
  game = setUpGame();
  enableInput();
  showGuesses();
  clearHints();
}

gameInit();

submitButton.addEventListener('click', function() {
  if (game.getGameStatus() === 'playing') {
    try {
      debug('trying guess');
      var isValid = game.checkGuess(playerInput.value);
      if (isValid) {
        disableInput();
        showAlert('Congratulations! You won. The answer was: ' + playerInput.value);
        playerInput.value = '🤪';
        guessDivs[game.guesses.length - 1].setAttribute('data-info', 'You got it!');
      } else if (game.guesses.length === 5) {
        disableInput();
        playerInput.value = '😢';
        showAlert('I\'m sorry. You lost. Hit reset to play again!');
        guessDivs[game.guesses.length - 1].setAttribute('data-info', 'That was your last guess.');
      } else {
        var hint = game.highOrLow() + game.hotOrCold();
        showAlert(hint);
        guessDivs[game.guesses.length - 1].setAttribute('data-info', hint);
        enableInput();
      }
      showGuesses();
    } catch (err) {
      debug(err);
      showAlert(err.toString().slice(7), 'red');
      enableInput();
    }
  }
});

hintButton.addEventListener('click', function() {
  showAlert(game.getHint(), 'green');
});

resetButton.addEventListener('click', function() {
  gameInit();
});
