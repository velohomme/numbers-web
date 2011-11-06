/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/*
 * English instructions
 * 
 * NOTE: To work there must be a global function setExerciseInstructions
 * 
 */
InstructionsText =
{
	"suggestionLink" : "Click to send us a suggestion!",
	"otherToolsLink" : "Other tools",
	"DecimalSeparator" : ".",
	"ExcerciseName" : "What is<br/>the number?",
	"OptionsHeading" : "Options",
	"OptionsDisplayWords" : "Display words",
	"OptionsInContext" : "Include Context",
	"RangeHeader" : "Number Range",
	"RangeMin" : "Min",
	"RangeMax" : "Max",
	"newValueButton" : "New Number",
	"repeatButton" : "Repeat Number",
	"checkAnswerButton" : "Done...check my guess",
	"ErrorDialogTitle" : "Error",
	"InvalidMinMax" : "Minimum or maximum are invalid (must be between 1 and 1000)",
	
	"TotalNumberOfTestsLabel" : "Total tests started",
	"TestsCompletedLabel" : "Tests completed (successful)",
	"TestsSkippedLabel" : "Tests skipped (failed)",
	"YourScoreLabel" : "Your Score:",
	"scoreResetButton" : "Clear Score",
	"AverageTestCompletionTimeLabel" : "Average time for successful test"	
};

ExcerciseLanguageText =
{
		"english": 
			{
				"LanguageName" : "(English)"
			},
		"french": 
			{
				"LanguageName" : "(French)"
			}
};

if (window.setExerciseInstructions) {
	setExerciseInstructions();
}

