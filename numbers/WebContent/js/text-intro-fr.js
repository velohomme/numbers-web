/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/*
 * English instructions
 * 
 * NOTE: To work there must be a global function setExerciseInstructions
 * 
 */
InstructionsText =
{
	"suggestionLink" : "Aidez-nous ameliorer cet outil!  Envoyez-nous une suggestion",
	"ExcerciseName" : "Apprenez les <br/>nombres dans les langues étrangères",
	"OptionsHeading" : "Les instructions:",
	"SimpleExcerciseLink" : "<b>General.</b>  Cet outil vous permet de pratiquer les nombres hors contexte.",
	"MoneyExcerciseLink" : "<b>Au magasin.</b> Avec cet outil vous pouvez ecouter les nombres dans la contexte le plus courant: au magasin.", 
	"ClockExcerciseLink" : "<b>Quelle heure est-il?</b> Cet outil vous donne l'opportunité d'ecouter les nombres dans un context vraiment courant: les heures.",
	"OverviewText" : "Utiliser ces outils pour practiquer les nombres en ",
	'otherLanguagesTitle' :'Autres Langues:'
};

ExcerciseLanguageText =
{
	"english": 
		{
			"ExcerciseName" : "Practiquez Les Nombres<br/>en Anglais",
			"LanguageName" : "anglais",
			'OtherLang1' : '<a class="exerciseLink text" href="index.html?locale=fr-fr">Français</a>'
		},
	"french": 
		{
			"ExcerciseName" : "Practiquez Les Nombres<br/>en Français",
			"LanguageName" : "français",
			'OtherLang1' : '<a class="exerciseLink text" href="index.html?locale=en-us">Anglais</a>'
		}
};

if (window.setExerciseInstructions) {
	setExerciseInstructions();
}

