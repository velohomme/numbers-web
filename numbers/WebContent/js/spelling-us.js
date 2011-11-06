/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */

// set the global SpellerFunction to a function which takes an 
// array of sound names and returns the corresponding written phrase.
speller.getWrittenPhrase = function(arrayOfSounds) {
	var writtenPhrase = '';
	jQuery.each(arrayOfSounds, function(index, soundFileName){
		var soundName = soundFileName;
		// drop the '-' suffix
		if (soundName.length > 0 && soundName.charAt(soundName.length-1) == '-') {
			soundName = soundName.substring(0,soundName.length-1);
		}
		// blank if needed between words
		if (writtenPhrase != '') {
			writtenPhrase += ' ';
		}
		var number = parseInt(soundName);
		var firstChar = soundName.charAt(0);
		var isOh = firstChar == '0' && soundName.length > 1;
		if (number + '' == soundName || isOh) { // is it a number?
			if (isOh) {
				writtenPhrase += 'o-';
				writtenPhrase += SpellerTableBaseValues[parseInt(soundName.charAt(1))];
			} else {
				var word = SpellerTableBaseValues[number];
				if (!word) { // > 19 ?
					var secondChar = soundName.charAt(1);
					word = SpellerTablePrefixes[firstChar];
					if (secondChar != '0') {
						word = word + ' ' + SpellerTableBaseValues[parseInt(secondChar)];
					}
				}
				writtenPhrase += word;
			}
		} else { // some other word
			var word = SpellerTableNonNumbers[soundName];
			writtenPhrase = writtenPhrase + (word ? word : soundName);
		}
	});
	return writtenPhrase;
};

SpellerTablePrefixes = {
		2 : 'twenty',
		3 : 'thirty',
		4 : 'forty',
		5 : 'fifty',
		6 : 'sixty',
		7 : 'seventy',
		8 : 'eighty',
		9 : 'ninety'
};
			
SpellerTableBaseValues = {
		0 : 'zero',
		1 : 'one',
		2 : 'two',
		3 : 'three',
		4 : 'four',
		5 : 'five',
		6 : 'six',
		7 : 'seven',
		8 : 'eight',
		9 : 'nine',
		10: 'ten',
		11 : 'eleven',
		12 : 'twelve',
		13 : 'thirteen',
		14 : 'fourteen',
		15 : 'fifteen',
		16 : 'sixteen',
		17 : 'seventeen',
		18 : 'eighteen',
		19 : 'nineteen',
		100 : 'one hundred',
		200 : 'two hundred',
		300 : 'three hundred',
		400 : 'four hundred',
		500 : 'five hundred',
		600 : 'six hundred',
		700 : 'seven hundred',
		800 : 'eight hundred',
		900 : 'nine hundred',
		1000: 'one thousand'
};

SpellerTableNonNumbers = {
		'5-before' : 'five to',
		'10-before' : 'ten to',
		'15-before' : 'quarter to',
		'20-before' : 'twenty to',
		'25-before' : 'twenty five to',
		'5-after' : 'five after',
		'10-after' : 'ten after',
		'15-after' : 'quarter after',
		'20-after' : 'twenty after',
		'25-after' : 'twenty five after',
		'30-after' : 'half past',
		'dollars' : 'dollars',
		'cents' : 'cents',
		'dollars-and' : 'dollars and',
		'dollar' : 'dollar',
		'cent' : 'cent',
		'dollar-and' : 'dollar and',
		'thanks' : 'thank you!',
		'not-enough' : 'I\'m sorry, this isn\'t enough',
		'not-enough2' : 'sorry, you\'re a little short',
		'too-much' : "ah...you gave me too much",
		'that-will-be' : "ok...that will be",
		'please' : 'please',
		'o' : 'o',
		'oclock' : 'o\'clock',
		'wrong-time' : 'sorry...that\'s the wrong time',
		'nope-thats-not-it' :'Nope, that\'s not it.',
		'nope' : 'Nope.',
		'thats-not-it-try-again' : 'That\'s not it.  Try again.',
		'wrong-give-it-another-shot': 'Wrong.  Give it another shot.',
		'correct' :'Correct!',
	    'she-is-picking-me-up-at' : 'She\'s picking me up at',
	    'on-tuesday' : 'on Tuesday',
	    'ok-i-have-your-table-reserved-for' : 'Ok, I have your table reserved for',
	    'she-told-me-that-she-would-be-here-at' : 'She told me that she would be here at',
	    'tomorrow' : 'tomorrow',
	    'can-you-pick-me-up-at' : 'Can you pick me up at',
	    'time-please' : 'please?',		
		'yes-the-plane-leaves-at': 'Yes, the plane leaves at',
		'at-time': 'At',
		'the-train-leaves': 'the train leaves',
		'i-will-be-there-at': 'I\'ll be there at',
		'he-came-at': 'He came at',
		'yesterday': 'yesterday',
		'the-movie-starts-at': 'The movie starts at',
		'the-tv-show-ends-at': 'The TV show ends at',
		'i-will-be-back-at': 'I will be back at',		
		'i-have-to-go-at': 'I have to go at',
		'the-performance-starts-at': 'The performance starts at',
		'and-goes-for-thirty-minutes': 'and goes for thirty minutes',
		'is-when-he-thinks-he-can-be-here': 'is when he thinks he can be here'
};

		
		
