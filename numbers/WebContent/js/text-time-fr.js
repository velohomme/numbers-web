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
	"ExcerciseName" : "Quelle heure <br/>est-il?",
	"OptionsHeading" : "Options",
	"OptionsVisual" : "Visuel (utilizez l'horloge pour repondre)",
	"OptionsInContext" : "Contexte compris",
	"OptionsDisplayWords" : "Affichez les mots de l'horloge",
	"RangeHeader" : "Eventail de nombre",
	"Hours" : "Heures",
	"Minutes" : "Minutes",
	"RangeMinHour" : "Min",
	"RangeMaxHour" : "Max",
	"RangeMinMinute" : "Min",
	"RangeMaxMinute" : "Max",
	"newValueButton" : "Choix de l'heure",
	"repeatButton" : "Répéter l'heure",
	"checkAnswerButton" : "Fini...verifiez ma réponse",
	"ErrorDialogTitle" : "Erreur",
	
	"InvalidHourMinMax" : "Heure min/max incorrecte (il doit être entre 0 et maximum par jour)",
	"InvalidMinuteMinMax" : "Minute min/max incorrect (il doit être entre 0 et 59)",
	"HourMinMaxReversed" : "Huere min/max incorrecte (minimum doit etre inférieur au maximum)",
	"MinuteMinMaxReversed" :"Minute min/max incorrect (minimum doit etre inférieur au maximum)",
	"OptionsFiveMinIncrements" : "Seulement les augmentations de cinq minutes",
	
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

