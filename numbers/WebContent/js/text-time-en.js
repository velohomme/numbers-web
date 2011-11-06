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
	"ExcerciseName" : "What time<br/>is it?",
	"OptionsHeading" : "Options",
	"OptionsVisual" : "Visual (use clock to answer)",
	"OptionsDisplayWords" : "Display clock's words",
	"OptionsInContext" : "Include Context",
	"RangeHeader" : "Number Ranges",
	"Hours" : "Hours",
	"Minutes" : "Minutes",
	"RangeMinHour" : "Min",
	"RangeMaxHour" : "Max",
	"RangeMinMinute" : "Min",
	"RangeMaxMinute" : "Max",
	"newValueButton" : "New Time",
	"repeatButton" : "Repeat Time",
	"checkAnswerButton" : "Done...check my time",
	"ErrorDialogTitle" : "Error",
	"InvalidHourMinMax" : "Minimum or maximum hours are invalid (must be between 0 and max hour in a day)",
	"InvalidMinuteMinMax" : "Minimum or maximum minutes are invalid  (must be between 0 and 59)",
	"HourMinMaxReversed" : "Maximum hours cannot be less than minimum hours",
	"MinuteMinMaxReversed" :"Maximum minutes cannot be less than minimum minutes",
	"OptionsFiveMinIncrements" : "Five minute increments only",
	
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

