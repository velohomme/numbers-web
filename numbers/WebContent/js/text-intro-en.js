/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/*
 * English instructions
 * 
 * NOTE: To work there must be a global function setExerciseInstructions
 * 
 */
InstructionsText =
{
	'suggestionLink' : 'Please help us improve!  Click to send us a suggestion',
	'ExcerciseName' : 'Learn Foreign<br/>Language Numbers',
	'OptionsHeading' : 'Instructions:',
	'SimpleExcerciseLink' : '<b>General.</b>  This tool allows the listener to practice with simple numbers.  No scenario is provided.',
	'MoneyExcerciseLink' : '<b>At the store.</b>  This tool provides the listener with the most common scenario in which they will hear numbers:  buying things.',
	'ClockExcerciseLink' : '<b>Time.</b>  This tool provides the second most common scenario for hearing numbers: the time of day.',
	'OverviewText' : 'Use these tools to practice understanding numbers in ',
	'otherLanguagesTitle' :'Other Languages:'
};

ExcerciseLanguageText =
{
		'english': 
			{
				'ExcerciseName' : 'Practice Numbers<br/>in English',
				'LanguageName' : 'english',
				'OtherLang1' : '<a class="exerciseLink text" href="index.html?locale=fr-fr">French</a>'
			},
		'french': 
			{
				'ExcerciseName' : 'Practice Numbers<br/>in French',
				'LanguageName' : 'french',
				'OtherLang1' : '<a class="exerciseLink text" href="index.html?locale=en-us">English</a>'			
			}
};

if (window.setExerciseInstructions) {
	setExerciseInstructions();
}

