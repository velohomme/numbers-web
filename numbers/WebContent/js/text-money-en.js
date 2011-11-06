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
	"ExcerciseName" : "At<br/>&nbsp;&nbsp;the Store",
	"OptionsHeading" : "Options",
	"OptionsVisual" : "Visual (drag and drop money)",
	"OptionsDisplayRunning" : "Display Running Total",
	"OptionsSayRunning" : "Say (audio) Running Total",
	"OptionsInContext" : "Include Context",
	"OptionsDisplayWords" : "Display cashier's words",
	"RangeHeader" : "Number Ranges",
	"RangeMinEuros" : "Minimum",
	"RangeMaxEuros" : "Maximum",
	"RangeMinCentimes" : "Minimum",
	"RangeMaxCentimes" : "Maximum",
	"newAmountButton" : "New Amount",
	"repeatButton" : "Repeat Amount",
	"checkTotalButton" : "Done...check my total",
	"clearCounterButton" : "Clear Counter",
	"PayCashierText" : "Pay Cashier",
	"WalletInstructionText" : "(click or drag to counter to pay cashier)",
	"CountertopInstructionText" : "(click or drag to return to wallet)",
	"WalletText" : "My Wallet",
	"CountertopText" : "Cashier Counter",
	"ErrorDialogTitle" : "Error",
	"InvalidMinMax" : "Invalid min/max (must be between 0 and 99)",
	
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

