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
      expect(game.getHint()).toBe('If you divide the winning number by 11, you get 4 as the remainder.');
    });
    it('should a give the answer of % 2 if there are 4 guesses already', function() {
      game.checkGuess(3);
      game.checkGuess(99);
      game.checkGuess(8);
      game.checkGuess(7);
      expect(game.getHint()).toBe('If you divide the winning number by 2, you get 0 as the remainder.');
    });
    it('should not give a hint if the game is lost', function() {
      game.checkGuess(3);
      game.checkGuess(99);
      game.checkGuess(8);
      game.checkGuess(7);
      game.checkGuess(44);
      expect(game.getHint()).toBe('Game over, no more hints!');
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
  describe('higher or lower', function() {
    it('should say whether the guess was too high or too low', function() {
      game.checkGuess(9);
      expect(game.highOrLow()).toBe('Too high! ');
      game.checkGuess(99);
      expect(game.highOrLow()).toBe('Too high! ');
      game.checkGuess(3);
      expect(game.highOrLow()).toBe('Too low! ');
      game.checkGuess(1);
      expect(game.highOrLow()).toBe('Too low! ');
    });
    it('should say return an error if no guesses have been made', function() {
      expect(game.highOrLow()).toBe('No guesses yet! ');
    });
    it('should say if the number is the winning number', function() {
      game.checkGuess(4);
      expect(game.highOrLow()).toBe('Just right! ');
    });
  });
  describe('hot or cold', function() {
    it('should return an error if no guesses have been made', function() {
      expect(game.hotOrCold()).not.toBe("But you're on fire!");
      expect(game.hotOrCold()).not.toBe("But you're getting warm!");
      expect(game.hotOrCold()).not.toBe("And you are kinda chilly.");
      expect(game.hotOrCold()).not.toBe("And you are ice cold");
      expect(game.hotOrCold()).toBe("Really, no guesses yet!");
    });
    it('should return "on fire" if the guess is within 7', function() {
      game.checkGuess(5);
      expect(game.hotOrCold()).toBe("But you're on fire!");
      game.checkGuess(1);
      expect(game.hotOrCold()).toBe("But you're on fire!");
      game.checkGuess(11);
      expect(game.hotOrCold()).toBe("But you're on fire!");
      game.checkGuess(12);
      expect(game.hotOrCold()).not.toBe("But you're on fire!");
    });
    it('should return "getting warm" if the guess is within 15', function() {
      game.checkGuess(12);
      expect(game.hotOrCold()).toBe("But you're getting warm!");
      game.checkGuess(16);
      expect(game.hotOrCold()).toBe("But you're getting warm!");
      game.checkGuess(19);
      expect(game.hotOrCold()).toBe("But you're getting warm!");
      game.checkGuess(20);
      expect(game.hotOrCold()).not.toBe("But you're getting warm!");
    });
    it('should return "kinda chilly" if the guess is within 30', function() {
      game.checkGuess(20);
      expect(game.hotOrCold()).toBe("And you are kinda chilly.");
      game.checkGuess(23);
      expect(game.hotOrCold()).toBe("And you are kinda chilly.");
      game.checkGuess(34);
      expect(game.hotOrCold()).toBe("And you are kinda chilly.");
      game.checkGuess(35);
      expect(game.hotOrCold()).not.toBe("And you are kinda chilly.");
    });
    it('should return "ice cold" if the guess is more than 30 away', function() {
      game.checkGuess(100);
      expect(game.hotOrCold()).toBe("And you are ice cold.");
      game.checkGuess(77);
      expect(game.hotOrCold()).toBe("And you are ice cold.");
      game.checkGuess(45);
      expect(game.hotOrCold()).toBe("And you are ice cold.");
      game.checkGuess(34);
      expect(game.hotOrCold()).not.toBe("And you are ice cold.");
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
