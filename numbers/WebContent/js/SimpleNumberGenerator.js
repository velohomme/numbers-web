/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/************************   TestNumber    ******************************/

TestNumber = function() {
	this.number = 0;
	this.numberSounds = [];
	this.numberInContextSounds =[];
};
/************************   SimpleNumberGenerator    ******************************/

SimpleNumberGenerator = function() {
	var self = this;
	this.NO_SOUND = '';
	this.correctPhrases = [];
	this.incorrectPhrases = [];
		
	this.limits = {
			numberMin: 0,
			numberMax: 99
		};
	
	// private vars
	var currentTestNumber = new TestNumber();
	var preloadedTestNumber = undefined;
	
	// public functions
	this.getLimits = function() {
		return self.limits;
	};
	
	this.generateNewNumber = function() {
		if (preloadedTestNumber) {
			currentTestNumber = preloadedTestNumber;
			self.clearPreloadNumber();
		} else {
			currentTestNumber = generateNew(currentTestNumber);
		}
	};
	
	this.preloadNextNumber = function() {
		preloadedTestNumber = generateNew(currentTestNumber);
	};
	
	this.clearPreloadNumber = function() {
		preloadedTestNumber = undefined;
	};
	
	this.getNumber = function() {
		return currentTestNumber.number;
	};
	
	this.getNumberSounds = function() {
		return currentTestNumber.numberSounds;
	};
	
	this.getNumberInContextSounds = function() {
		return currentTestNumber.numberInContextSounds;
	};
	
	this.getPreloadNumberSounds = function() {
		return preloadedTestNumber.numberSounds;
	};
	
	this.getPreloadNumberInContextSounds = function() {
		return preloadedTestNumber.numberInContextSounds;
	};
	
	this.isNumberGuessedCorrect = function(numberGuessed) {
		return currentTestNumber.number == numberGuessed;
	};
	
	this.getGuessResponseSounds = function(timeGuessed) {
		if (currentTestNumber.number == timeGuessed) {
			return [generateRandomElement(self.correctPhrases,'correctPhrases', 3)];
		} else {
			return [generateRandomElement(self.incorrectPhrases,'incorrectPhrases', 3)];
		}
	};
	
	/*
	 * 	private functions
	 */ 
	
	function generateNew(lastTestNumber) {
		var testNumber = new TestNumber();
		// calc number
		testNumber.number = calclateRandomTotal(lastTestNumber.number);
		// calc sounds
		testNumber.numberSounds = self.generateNumberSounds(testNumber.number);
		testNumber.numberInContextSounds = generateNumberInContextSounds(testNumber.numberSounds);
		return testNumber;
	};
	
	function calclateRandomTotal(lastNumber) {
		return calculateRandomAmount(5, self.limits.numberMin, self.limits.numberMax, lastNumber);
	}
	
	function calculateRandomAmount(maxAttemptsToMakeDifferent, min, max, lastValue) {
		var value = lastValue;
		var attempts = 0;
		while (value == lastValue && attempts < maxAttemptsToMakeDifferent) {
			attempts++;
			value = generateRandomNumber(min, max);
		} 	
		return value;
	}
	
	function generateRandomName(arrayOfNames) {
		return arrayOfNames[self.generateRandomNumber(0, arrayOfNames.length - 1)];
	}
	
	// answer an integer between min and max inclusive
	function generateRandomNumber(min, max) {
		if (min >= max) {
			return min;
		}
		var r = Math.floor(Math.random() * (max - min + 1));
		return r + min;
	};
	
	// listName used to store last index generated
	function generateRandomElement(arrayOfObjects, listName, maxAttempts) {
		if (arrayOfObjects.length == 1) {
			return arrayOfObjects[0];
		}
		var max = arrayOfObjects.length - 1;
		if (!maxAttempts) {
			var randomIndex = generateRandomNumber(0, max);
		} else {
			var attemptCount = 0;
			while (attemptCount < maxAttempts) {
				var randomIndex = generateRandomNumber(0, max);
				if (randomIndex != window['randomListLastIndex-'+listName]) {
					window['randomListLastIndex-'+listName] = randomIndex;
					break;
				}
				attemptCount++;
			}
		}
		return arrayOfObjects[randomIndex];
	}
	
	function generateNumberInContextSounds(arrayOfTimeSounds) {
		var soundWrapper = generateRandomElement(self.CONTEXT_SOUNDS,5);
		var beforeSounds = soundWrapper.before ? [soundWrapper.before] : [];
		var afterSounds = soundWrapper.after ? [soundWrapper.after] : [];
		return beforeSounds.concat(arrayOfTimeSounds, afterSounds);
	}
};


/************************   French Number Generator    ******************************/
FrenchNumberGenerator = function() {
	var self = this;
	SimpleNumberGenerator.call(self);  
	
	this.correctPhrases = ['correct'];
	this.incorrectPhrases = ['mauvais-reponse'];
	
	this.generateNumberSounds = function(number) {
		var sounds = [];
		if (number > 99) {
			var sound = (number+'');
			// 100 - 1000
			sounds.push((sound.substring(0,sound.length-2) * 100)+'');
			// 0-99
			sound = sound.substring(sound.length-2, sound.length);
			sound = parseInt(sound,10);
			if (sound != 0) {
				sounds.push(sound+'');
			}
			return sounds;
		} else {
			return [number+''];
		}
	};
	
	this.CONTEXT_SOUNDS = [
   	    {}  // this will generate no context
   	]; 
	

};

/************************   American Number Generator    ******************************/
AmericanNumberGenerator = function() {
	var self = this;
	SimpleNumberGenerator.call(self);
	
	this.correctPhrases = ['correct'];
	this.incorrectPhrases = ['nope-thats-not-it','nope', 'thats-not-it-try-again','wrong-give-it-another-shot'];
	
	this.generateNumberSounds = function(number) {
		var sounds = [];
		if (number > 99) {
			var numberString = (number+'');
			// 100s
			var hundredsSound = (numberString.substring(0,numberString.length-2) * 100)+'';
			// 10s
			numberString = numberString.substring(numberString.length-2, numberString.length);
			var tensSound = parseInt(numberString,10);
			if (tensSound != 0) {
				sounds.push(hundredsSound);
				sounds.push(tensSound+'-');
			} else {
				sounds.push(hundredsSound+'-');
			}
			return sounds;
		} else {
			return [number+'-'];
		}
	};
	
	this.CONTEXT_SOUNDS = [
	    //{before: 'be-here-tommorrow-before', after: 'be-here-tommorrow-after'},
	    //{before: 'table-reserved'},
	    {}  // this will generate no context
	]; 
};
		
