/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */

// set the global SpellerFunction to a function which takes an 
// array of sound names and returns the corresponding written phrase.
speller.getWrittenPhrase = function(arrayOfSounds) {
	var lastNumberPlural = false;
	var lastNumberPluralHundreds = false;
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
		if (soundName.match(/\d+H/)) {  // hour number
			if (number) {
				writtenPhrase += (number == 1 ? 'une' : speller.getNumberWord(number, soundName));
				writtenPhrase += (number == 1 ? ' heure' : ' heures');
			}
		} else if (number + '' == soundName) { // is it a number?
			// rule for "cent" spelling: only plural if on a hundred value (e.g., 200, 300)
			if (lastNumberPluralHundreds) {
				writtenPhrase = writtenPhrase.replace(/cents $/, 'cent ');
			}
			if (number >= 200 && number <= 900) {
				lastNumberPluralHundreds = true;
			}
			lastNumberPlural = (number == 1 ? false : true);
			var word = speller.getNumberWord(number, soundName);
			writtenPhrase += word;
		} else if (soundName.indexOf('euro') > -1) { // euro(s)
			writtenPhrase = writtenPhrase + (lastNumberPlural ? 'euros' : 'euro');
		} else { // some other word
			var word = SpellerTableNonNumbers[soundName];
			writtenPhrase = writtenPhrase + (word ? word : soundName);
		}
	});
	return writtenPhrase;
};

speller.getNumberWord = function(number, numberSoundName) {
	var word = SpellerTableBaseValues[number];
	if (!word) { // > 19 ?
		var firstChar = numberSoundName.charAt(0);
		var secondChar = numberSoundName.charAt(1);
		word = SpellerTablePrefixes[firstChar];
		if (secondChar == '1' && number < 62) {
			word += " et un";
		} else if (number > 61 && number < 80) {
			word = word + '-' + SpellerTableBaseValues[(number - 60) + ''];
		} else if (number > 80 && number < 100) {
			word = word + '-' + SpellerTableBaseValues[(number - 80) + ''];
		} else if (secondChar != '0') {
			word = word + '-' + SpellerTableBaseValues[parseInt(secondChar)];
		}
	}
	return word;
};


SpellerTablePrefixes = {
		2 : 'vingt',
		3 : 'trente',
		4 : 'quarante',
		5 : 'cinquante',
		6 : 'soixante',
		7 : 'soixante',
		8 : 'quatre-vingts',
		9 : 'quatre-vingts'
};
			
SpellerTableBaseValues = {
		0 : 'zero',
		1 : 'un',
		2 : 'deux',
		3 : 'trois',
		4 : 'quatre',
		5 : 'cinq',
		6 : 'six',
		7 : 'sept',
		8 : 'huit',
		9 : 'neuf',
		10: 'dix',
		11 : 'onze',
		12 : 'douze',
		13 : 'treize',
		14 : 'quatorze',
		15 : 'quinze',
		16 : 'seize',
		17 : 'dix-sept',
		18 : 'dix-huit',
		19 : 'dix-neuf',
		100 : 'cent',
		200 : 'deux cents',
		300 : 'trois cents',
		400 : 'quatre cents',
		500 : 'cinq cents',
		600 : 'six cents',
		700 : 'sept cents',
		800 : 'huit cents',
		900 : 'neuf cents',
		1000: 'mille'
};

SpellerTableNonNumbers = {
		'ca-ferra' : 'ça fera',
		'ca-vous-fait' : 'ça vous fait',
		'ca-vous-ferra' : 'ça vous fera',
		'centimes' : 'centimes',
		'il-manque' : 'Il manque',
		'vous-m-avez-donne-trop' : "Vous m'avez donné trop",
		'sil-vous-plait' : "s'il vous plaît",
		'merci' : 'Merci!',
		'merci-au-revoir' : 'Merci, Au revoir!',
   	    'nous-commencons-a-servir-a' : 'Nous commençons à servir à',
   	    'le-train-part-a' : 'Le train part à',
   	    'le-magasin-ouvre-a' : 'Le magasin ouvre à',
   	    'le-magasin-ferme-a' : 'Le magasin ferme à',
   	    'il-est' : 'Il est',
   	    'elle-vient-me-chercher-a' : 'Elle vient me chercher à',
   	    'mardi-prochaine' : 'mardi prochaine',
   	    'la-table-est-donc-reserve-pour' : 'La table est donc reservé pour',
   	    'pouvez-vous-venir-me-cherchez-a' : 'Pouvez-vous me chercher à',
    	'chercher-sil-vous-plait' : 's\'il vous plait',
   	    'je-serai-la-a' : 'Je serai là à',
   	    'hier-il-est-venu-a' : 'Hier il est venu à',
   	    'le-film-commence-a' : 'Le film commence à',
   	    'je-serai-de-retour-a' : 'Je serai de retour à',
   	    'je-dois-partir-a' : 'Je dois partir à',
   	    'mauvais-reponse' : "Mauvaise réponse",
   	    'correct' : 'Réponse correcte',
	   	'5-before' : "moins cinq",
	   	'10-before' : "moins dix",
	   	'15-before' : "moins quart",
	   	'20-before' : "moins vingt",
	   	'25-before' : "moins vingt-cinq",
	   	'15-after' : "et quart",
	   	'30-after' : "et demi",
	   	'minuit' : "minuit"
};

