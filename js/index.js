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
    },
    getHint: function() {
      if (this.hintGiven) {
        return "You already got a hint!";
      } else {
        this.hintGiven = true;
        let divisors = [11, 7, 5, 3, 2];
        let index = this.guesses.length;
        return `If you divide the winning number by ${divisors[index]}, you get ${winningNumber % divisors[index]}.`;
      }

    }
  };
}

var game = setUpGame();

game.resetGame(7);
