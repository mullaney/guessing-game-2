describe ('generateWinningNumber function', function() {
  it('should return a number', function() {
    expect(typeof generateWinningNumber()).toBe('number');
  });
  it('should return a value >= MIN_NUMBER and <= MAX_NUMBER', function() {
    for (var i = 0; i < 1000; i++) {
      expect(generateWinningNumber()).toBeGreaterThan(MIN_NUMBER - 1);
      expect(generateWinningNumber()).toBeLessThan(MAX_NUMBER + 1);
    }
  });
});

describe ('game factory function', function() {
  var game;
  beforeEach(function() {
    debugMode = false;
    game = setUpGame(4);
  });
  it('should return an object', function() {
    expect(typeof game).toBe('object');
  });
  it('should have a checkGuess function', function() {
    expect(game.checkGuess(4)).toBe(true);
    expect(game.checkGuess(5)).toBe(false);
  });
  describe('guesses array', function() {
    it('should have a list of past guesses', function() {
      expect(Array.isArray(game.guesses)).toBe(true);
      expect(game.guesses.length).toBe(0);
    });
    it('should save guesses to the guesses array', function() {
      game.checkGuess(5);
      game.checkGuess(7);
      expect(game.guesses.length).toBe(2);
      expect(game.guesses[1]).toBe(7);
    });
    it('should not save more than 5 guesses to the guesses array', function() {
      game.checkGuess(5);
      game.checkGuess(7);
      game.checkGuess(8);
      game.checkGuess(86);
      game.checkGuess(87);
      game.checkGuess(89);
      expect(game.guesses.length).toBe(5);
      expect(game.guesses[4]).toBe(87);
    });
    it('should not save strings or other non numbers to guesses array', function() {
      game.checkGuess(NaN);
      game.checkGuess("a number");
      expect(game.guesses.length).toBe(0);
    });
    it('should reject numbers that are above 100 or below 1', function() {
      game.checkGuess(0);
      game.checkGuess(101);
      expect(game.guesses.length).toBe(0);
    });
  });
  describe('hints', function() {
    it('should know if a hint has been given', function() {
      expect(game.hintGiven).toBe(false);
    });
    it('should give a hint', function() {
      var hint = game.getHint();
      expect(typeof hint).toBe('string');
      expect(game.hintGiven).toBe(true);
    });
    it('should not give a new hint', function() {
      game.getHint();
      game.checkGuess(5);
      expect(game.getHint()).toBe('You already got a hint!');
    });
    it('should a give the answer of % 7 if there are no guesses yet', function() {
      expect(game.getHint()).toBe('If you divide the winning number by 11, you get 4.');
    });
    it('should a give the answer of % 2 if there are 4 guesses already', function() {
      game.checkGuess(3);
      game.checkGuess(99);
      game.checkGuess(8);
      game.checkGuess(7);
      expect(game.getHint()).toBe('If you divide the winning number by 2, you get 0.');
    });
  });
  it('should have a function to reset game', function() {
    let newGame = setUpGame(4);
    newGame.checkGuess(9);
    newGame.resetGame(7);
    expect(newGame.checkGuess(7)).toBe(true);
    expect(newGame.checkGuess(4)).toBe(false);
  });

  describe('should know the game status,', function() {
    it('if one of the guesses is correct, status is "won"', function () {
      game.checkGuess(7);
      game.checkGuess(88);
      game.checkGuess(4);
      expect(game.getGameStatus()).toBe('won');
    });
    it('if none of the guesses is correct, but number of guesses is less than MAX_GUESSES, status is "playing"', function () {
      game.checkGuess(7);
      game.checkGuess(88);
      game.checkGuess(8);
      expect(game.getGameStatus()).toBe('playing');
    });
    it('if none of the guesses is correct, and number of guesses is MAX_GUESSES (or more), status is "lost"', function () {
      game.checkGuess(7);
      game.checkGuess(88);
      game.checkGuess(8);
      game.checkGuess(77);
      game.checkGuess(54);
      expect(game.getGameStatus()).toBe('lost');
    });
  });
});

describe('debug function', function() {
  it('should log message to the console when debugMode is true', function() {
    spyOn(console, 'log').and.callThrough();
    debugMode = true;
    debug('this message');
    expect(console.log).toHaveBeenCalled();
  });
  it('should NOT log message to the console when debugMode is false', function() {
    spyOn(console, 'log').and.callThrough();
    debugMode = false;
    debug('this message');
    expect(console.log).not.toHaveBeenCalled();
  })
});
