/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/*
 * French instructions
 * 
 * NOTE: To work there must be a global function setExerciseInstructions
 * 
 */
InstructionsText =
{
	"suggestionLink" : "Envoyez-nous une suggestion!",
	"otherToolsLink" : "Les autres outils",
	"DecimalSeparator" : ",",
	"ExcerciseName" : "Au<br/>&nbsp;&nbsp;Magasin",
	"OptionsHeading" : "Options",
	"OptionsVisual" : "Visuel (faire glisser et deposer l'argent)",
	"OptionsDisplayRunning" : "Afficher total à reporter",
	"OptionsSayRunning" : "Dire total à reporter (audio)",
	"OptionsInContext" : "Contexte compris",
	"OptionsDisplayWords" : "Afficher les mots du caissier",
	"RangeHeader" : "Eventail de nombre",
	"RangeMinEuros" : "Minimum",
	"RangeMaxEuros" : "Maximum",
	"RangeMinCentimes" : "Minimum",
	"RangeMaxCentimes" : "Maximum",
	"newAmountButton" : "Choix du Montant",
	"repeatButton" : "Répéter Montant",
	"checkTotalButton" : "Fini...verifiez la somme",
	"clearCounterButton" : "Debarasser le comptoir",
	"PayCashierText" : "Montant payé",
	"WalletInstructionText" : "(cliquez ou faites glisser pour payer au cassier)",
	"CountertopInstructionText" : "(cliquez ou faites glisser pour retourner au portefeuille)",
	"WalletText" : "Mon portefeuille",
	"CountertopText" : "Comptoir du cassier",
	"ErrorDialogTitle" : "Erreur",
	"InvalidMinMax" : "Nombre min/max incorrect (il doit être entre 0 et 99)",
	
	"TotalNumberOfTestsLabel" : "Nombre d'épreuves commencées",
	"TestsCompletedLabel" : "Nombre d'épreuves fini avec réussies",
	"TestsSkippedLabel" : "Nombre d'épreuves sautées (ratées)",
	"YourScoreLabel" : "Resultat:",
	"scoreResetButton" : "Effacer le resultat",
	"AverageTestCompletionTimeLabel" : "Les secondes moyennes"	
};

ExcerciseLanguageText =
{
		"english": 
			{
				"LanguageName" : "(Anglais)"
			},
		"french": 
			{
				"LanguageName" : "(Français)"
			}
};

if (window.setExerciseInstructions) {
	setExerciseInstructions();
}

