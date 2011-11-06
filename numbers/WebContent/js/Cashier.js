/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/************************   Money    ******************************/

Money = function(wholePart, fractionalPart) {
	var self = this;
	
	var FRACTIONAL_LENGTH = 2;
	var MAX_FRACTIONAL = Math.pow(10,FRACTIONAL_LENGTH) - 1;
	var whole = wholePart == null ? 0 : wholePart;
	var fractional = fractionalPart == null ? 0 : fractionalPart;
	this.value = whole + '.' + fractional; // for debug only...not used
	
	this.getWhole = function() {
		return whole;
	};
	
	this.getFractional = function() {
		return fractional;
	};
	
	this.add = function(anotherMoney) {
		// answer a new Money equivalent to this + anotherMoney
		var totalWhole = self.getWhole() + anotherMoney.getWhole();
		var totalFractional = self.getFractional() + anotherMoney.getFractional();
		if (totalFractional > MAX_FRACTIONAL) {
			totalWhole++;
			totalFractional = (totalFractional - (MAX_FRACTIONAL + 1));
		}
		return new Money(totalWhole, totalFractional);
	};
	
	this.equals = function(anotherMoney) {
		return self.getWhole() == anotherMoney.getWhole() &&
			self.getFractional() == anotherMoney.getFractional();
	};
	
	this.lessThan = function(anotherMoney) {
		if (self.getWhole() < anotherMoney.getWhole()) {
			return true;
		}
		return self.getWhole() == anotherMoney.getWhole() &&
			self.getFractional() < anotherMoney.getFractional();
	};	
	
	this.greaterThan = function(anotherMoney) {
		return (anotherMoney.lessThan(self));
	};	
	
	this.equalsZero = function() {
		return self.getWhole() == 00 && self.getFractional() == 0;
	};
	
	this.copy = function() {
		return new Money(self.getWhole(),self.getFractional());
	};
	
	this.format = function(separator) {
		var formattedFractional = fractional + '';
		while (formattedFractional.length < FRACTIONAL_LENGTH) {
			formattedFractional = '0' + formattedFractional;
		}
		return (whole == 0 ? '' : whole) + separator + formattedFractional;
	};
};

AmountDue = function() {
	this.totalDue = new Money(0,0);
	this.totalDueSounds = [];
	this.totalDueInContextSounds =[];
};
/************************   Cashier    ******************************/

Cashier = function() {
	var self = this;
	this.NO_SOUND = '';
	this.totalDueIntroPhrases = [];  // e.g., 'that-comes-to'
	this.pleasePhrases = [];  // e.g. 'please'
	this.notEnoughMoneyPhrases = [];  
	this.tooMuchMoneyPhrases = [];  
	this.thankYouPhrases = [];
	this.maxAmount = new Money(99,99);
	this.minPaymentTotal = new Money(0,1);
	this.maxPaymentTotal = self.maxAmount.copy();
		
	this.limits = {
			wholeMin: 0,
			wholeMax: 99,
			fractionalMin: 1,
			fractionalMax: 99
		};
	
	// private vars
	var FRACTIONAL_LENGTH = 2;
	var currentAmountDue = new AmountDue();
	var preloadedAmountDue = undefined;
	
	// public functions
	this.getLimits = function() {
		return self.limits;
	};
	
	this.generateNewTotalDue = function() {
		if (preloadedAmountDue) {
			currentAmountDue = preloadedAmountDue;
			self.clearPreloadTotalDue();
		} else {
			currentAmountDue = generateNewAmountDue(currentAmountDue);
		}
	};
	
	this.preloadTotalDue = function() {
		preloadedAmountDue = generateNewAmountDue(currentAmountDue);
	};
	
	this.clearPreloadTotalDue = function() {
		preloadedAmountDue = undefined;
	};
	
	this.getTotalDue = function() {
		return currentAmountDue.totalDue;
	};
	
	this.getTotalDueSounds = function() {
		return currentAmountDue.totalDueSounds;
	};
	
	this.getTotalDueInContextSounds = function() {
		return currentAmountDue.totalDueInContextSounds;
	};
	
	this.getPreloadedTotalDueSounds = function() {
		return preloadedAmountDue.totalDueSounds;
	};
	
	this.getPreloadedTotalDueInContextSounds = function() {
		return preloadedAmountDue.totalDueInContextSounds;
	};
	
	this.sum = function(arrayOfMoney) {
		// given an array of Money, return a Money of their sum
		var total = new Money(0,0);
		jQuery.each(arrayOfMoney, function() {
			total = total.add(this);
		});
		return total;
	};
	
	this.parseMoneyString = function(moneyAsString, separator) {
		var parts = moneyAsString.split(separator);
		if (parts.length == 1) {
			return new Money(parseToInt(parts[0],9999999), 0);
		} else if (parts.length == 2) {
			if (jQuery.trim(parts[0]).length == 0) {
				return new Money(0, parseToInt(parts[1],FRACTIONAL_LENGTH));
			}
			return new Money(parseToInt(parts[0],9999999), parseToInt(parts[1],FRACTIONAL_LENGTH));
		} else {
			return new Money(0,0);
		}
	};
	
	this.isTotalPaidCorrect = function(totalUserPaid) {
		return totalUserPaid.equals(self.getTotalDue());
	};
	
	this.getTotalPaidResponseSounds = function(totalUserPaid) {
		if (self.isTotalPaidCorrect(totalUserPaid)) {
			return [generateRandomName(self.thankYouPhrases)];
		} else {
			return [generateRandomName(totalUserPaid.lessThan(self.getTotalDue()) ?	
					self.notEnoughMoneyPhrases : self.tooMuchMoneyPhrases)];
		}
	};
	
	this.getPaidAmountSounds = function(amount) {
		if (amount.greaterThan(self.maxAmount)) {
			return [self.tooMuchMoneyPhrases[0]];
		} else {
			return self.getAmountSounds(amount);
		}
	};
	
	/*
	 * 	private functions
	 */ 
	
	function generateNewAmountDue(lastAmountDue) {
		var amountDue = new AmountDue();
		// calc amount
		amountDue.totalDue = calclateRandomTotal(lastAmountDue.totalDue);
		// total due sounds
		amountDue.totalDueSounds = generateTotalDueSounds(amountDue.totalDue);
		amountDue.totalDueInContextSounds = generateTotalDueInContextSounds(amountDue.totalDueSounds);
		return amountDue;
	};
	
	this.getAmountSounds = function(amount) {
		alert("subclasses must re-implement");
	};
	
	function calclateRandomTotal(lastTotalDue) {
		var whole = 
			calculateRandomAmount(5, self.limits.wholeMin, self.limits.wholeMax, lastTotalDue.getWhole());
		var fractional = 
			calculateRandomAmount(5, self.limits.fractionalMin, self.limits.fractionalMax, lastTotalDue.getFractional());
		return new Money(whole, (whole == 0 && fractional == 0) ? 1 : fractional);
	}
	
	function calculateRandomAmount(maxAttemptsToMakeDifferent, min, max, lastValue) {
		var value = lastValue;
		var attempts = 0;
		while (value == lastValue && attempts < maxAttemptsToMakeDifferent) {
			attempts++;
			value = self.generateRandomNumber(min, max);
		} 	
		return value;
	}
	
	function generateRandomName(arrayOfNames) {
		return arrayOfNames[self.generateRandomNumber(0, arrayOfNames.length - 1)];
	}
	
	// answer an integer between min and max inclusive
	this.generateRandomNumber = function(min, max) {
		if (min >= max) {
			return min;
		}
		var r = Math.floor(Math.random() * (max - min + 1));
		return r + min;
	};
	
	function generateTotalDueSounds(totalDue) {
		return self.getAmountSounds(totalDue);
	}
	
	function generateTotalDueInContextSounds(totalDueSounds) {
		var sounds = [];
		sounds.push(generateRandomName(self.totalDueIntroPhrases));
		sounds = sounds.concat(totalDueSounds);
		sounds.push(generateRandomName(self.pleasePhrases));
		return sounds;
	}
	
	function parseToInt(valueAsString, maxDigits) {
		var value = valueAsString;
		value = jQuery.trim(value);
		if (value.length > maxDigits) {
			value = value.substring(0, maxDigits);
		}
		return parseInt(value,10);
	}

};

/************************   France Cashier    ******************************/

FranceCashier = function() {
	var self = this;
	Cashier.call(self);  
	
	this.decimalSound = 'euros';  // e.g. 'dollars' OR 'euros'
	this.decimalSoundForOne = 'euros';  // e.g. 'dollar' OR 'euro'
	this.fractionalOnlyPhrase = 'centimes';  // e.g. 'cents' or 'centimes'
	this.totalDueIntroPhrases = ['ca-ferra', 'ca-vous-ferra', this.NO_SOUND];  // e.g., 'that-comes-to'
	this.pleasePhrases = ['sil-vous-plait', this.NO_SOUND];  // e.g. 'please'
	this.notEnoughMoneyPhrases = ['il-manque'];  
	this.tooMuchMoneyPhrases = ['vous-m-avez-donne-trop'];  
	this.thankYouPhrases = ['merci'];

	var frenchLiaisonLookupTable = {
			'1': {euroSound: 'neuros', fileSuffix: ''},
			'2': {euroSound: 'seuros', fileSuffix: ''},
			'3': {euroSound: 'seuros', fileSuffix: ''},
			'5': {euroSound: 'keuros', fileSuffix: '-'},
			'6': {euroSound: 'seuros', fileSuffix: '-'},
			'7': {euroSound: 'teuros', fileSuffix: '-'},
			'8': {euroSound: 'teuros', fileSuffix: '-'},		
			'9': {euroSound: 'feuros', fileSuffix: '-'},
			'10': {euroSound: 'seuros', fileSuffix: '-'},
			'12': {euroSound: 'seuros', fileSuffix: '-'},
			'15': {euroSound: 'seuros', fileSuffix: '-'},
			'16': {euroSound: 'seuros', fileSuffix: '-'},
			'17': {euroSound: 'teuros', fileSuffix: '-'},
			'18': {euroSound: 'teuros', fileSuffix: '-'},		
			'19': {euroSound: 'feuros', fileSuffix: '-'},			
			'30': {euroSound: 'teuros', fileSuffix: '-'},
			'40': {euroSound: 'teuros', fileSuffix: '-'},
			'50': {euroSound: 'teuros', fileSuffix: '-'},
			'60': {euroSound: 'teuros', fileSuffix: '-'},
			'70': {euroSound: 'seuros', fileSuffix: '-'},
			'90': {euroSound: 'seuros', fileSuffix: '-'}
		};	
	
	this.getAmountSounds = function(amount) {
		var sounds = [];
		if (amount.getWhole() != 0) {
			addWholeNumberSounds(amount.getWhole() + '', sounds);
		} 
		if (amount.getFractional() != 0) {
			sounds.push(amount.getFractional() + '');
			if (amount.getWhole() == 0) {
				sounds.push(self.fractionalOnlyPhrase);
			}
		}
		return sounds;
	};
	
	function addWholeNumberSounds(numberAsString, soundsArray) {
		// answer an array of number sounds for the whole number.
		// FRENCH VERSION (needs to consider the possible liaison)
		var lookup = numberAsString;
		var liaisonInfo = frenchLiaisonLookupTable[lookup];  // lookup the entire number
		if (!liaisonInfo) {
			// lookup just the last char
			lookup = numberAsString.charAt(numberAsString.length -1); 
			// if it is in the 70s or 90s we need to use the teens
			if (numberAsString.length == 2 && (numberAsString.charAt(0) == '7' || numberAsString.charAt(0) == '9')) {
				lookup = '1' + lookup;
			}
			liaisonInfo = frenchLiaisonLookupTable[lookup];  
		}
		if (liaisonInfo) {  // liaison required
			soundsArray.push(numberAsString + liaisonInfo.fileSuffix);
			soundsArray.push(liaisonInfo.euroSound);
		} else {  // no liaison
			soundsArray.push(numberAsString);
			soundsArray.push(self.decimalSound);
		}
	}
};

/************************   American Cashier    ******************************/

AmericanCashier = function() {
	var self = this;
	Cashier.call(self);  
	
	this.decimalSound = 'dollars';  
	this.decimalSoundForOne = 'dollar';
	this.decimalSoundAnd = 'dollars-and';  
  	this.decimalSoundAndForOne = 'dollar-and'; 
	this.fractionalPhrase = 'cents';  
	this.fractionalPhraseOne = 'cent'; 
	this.totalDueIntroPhrases = ['that-will-be', this.NO_SOUND];  // e.g., 'that-comes-to'
	this.pleasePhrases = ['please', this.NO_SOUND];  // e.g. 'please'
	this.notEnoughMoneyPhrases = ['not-enough','not-enough2'];  
	this.tooMuchMoneyPhrases = ['too-much'];  
	this.thankYouPhrases = ['thanks'];
	
	var isShortStyle = true;
	var oneCent = new Money(0,1);
	
	this.getAmountSounds = function(amount) {
		/* patterns: 
		 * long style: 2 dollars and 45 cents, 2 dollars, 1 dollar, 1 dollar and 45 cents, 45 cents
		 * short style: 2 45
		 */
		var sounds = [];
		if (amount.equals(oneCent)) {
			sounds.push(amount.getFractional()+'');
			sounds.push(self.fractionalPhraseOne);
			return sounds;
		}
		
		isShortStyle = !isShortStyle;
		// short style
		if (isShortStyle && amount.getWhole() != 0 && amount.getFractional() != 0) {
			sounds.push(amount.getWhole() + '');
			if (amount.getFractional() < 10) {
				sounds.push('0'+amount.getFractional());  //0-9 get "oh" sound
			} else {
				sounds.push(amount.getFractional() + '-');
			}
		// long style	
		} else {
			if (amount.getWhole() != 0) {
				sounds.push(amount.getWhole() + '');
				if (amount.getFractional() == 0) {
					sounds.push(amount.getWhole() == 1 ? self.decimalSoundForOne : self.decimalSound);
				} else {
					sounds.push(amount.getWhole() == 1 ? self.decimalSoundAndForOne : self.decimalSoundAnd);
				}
			} 
			if (amount.getFractional() != 0) {
				sounds.push(amount.getFractional()+'');
				if (!isShortStyle || amount.getWhole() == 0) {
					sounds.push(amount.getFractional() == 1 ? self.fractionalPhraseOne : self.fractionalPhrase);
				}
			} 			
		}
		return sounds;
	};

};