/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/*
 * English instructions
 * 
 * NOTE: To work there must be a global function setExerciseInstructions
 * 
 */
InstructionsText =
{
	"suggestionLink" : "Envoyez-nous une suggestion!",
	"otherToolsLink" : "Les autres outils",
	"DecimalSeparator" : ",",
	"ExcerciseName" : "Quel est<br/>le nombre?",
	"OptionsHeading" : "Options",
	"OptionsDisplayWords" : "Afficher les mots",
	"OptionsInContext" : "Contexte compris",
	"RangeHeader" : "Eventail de nombre",
	"RangeMin" : "Min",
	"RangeMax" : "Max",
	"newValueButton" : "Choix du nombre",
	"repeatButton" : "Répéter le nombre",
	"checkAnswerButton" : "Fini...verifiez ma réponse",
	"ErrorDialogTitle" : "Erreur",
	"InvalidMinMax" : "Min/max incorrect (il doit être entre 1 et 1000)",
	
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