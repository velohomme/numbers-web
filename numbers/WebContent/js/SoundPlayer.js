/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
soundManager.onready(function() {
	  // Ready to use; soundManager.createSound() etc. can now be called.
});
soundManager.url = 'soundmanager2/swf/';
// soundManager.flashVersion = 9; // optional: shiny features (default = 8)
// if there is a 'debug' query parameter then turn on debugging
soundManager.debugMode = window.location.href.indexOf('debug') > 0;

SoundPlayer = function(soundsFolder) {
		var PLAY = 1;
		var LOAD = 0;
		var self = this;
		var subFolder = soundsFolder;
		
		// load and plays the sounds.  callback is optional
		this.loadAndPlaySounds = function(soundNames, callbackWhenLoadingComplete, callbackWhenPlayingComplete) {
			var scrubbedSoundNames = filterInvalidSoundNames(soundNames);
			processSounds(scrubbedSoundNames, LOAD, function() {
				if (callbackWhenLoadingComplete) {
					callbackWhenLoadingComplete();
				}
				processSounds(scrubbedSoundNames, PLAY, callbackWhenPlayingComplete);
			});
		}; 
		
		// pre-load sounds.  callback is optional
		this.loadSounds = function(soundNames, callbackWhenLoadingComplete) {
			var scrubbedSoundNames = filterInvalidSoundNames(soundNames);
			processSounds(scrubbedSoundNames, LOAD, callbackWhenLoadingComplete);
		}; 
		
		/****  PRIVATE FUNCTIONS ****/

		// Serially process (either LOAD or PLAY) the sound names.  Optional callback 
		// will be called after ALL of the names have been processed.
		function processSounds(soundNamesArray, loadOrPlay, callbackFunction) {
			if (soundNamesArray.length == 0) {
				if (callbackFunction) {
					callbackFunction();
				}
			} else {
				var sound = soundNamesArray[0];
				var soundsRemaining = soundNamesArray.slice();
				soundsRemaining.splice(0, 1);
				var continuation = function() {
					processSounds(soundsRemaining, loadOrPlay, callbackFunction); 
				};
				if (LOAD == loadOrPlay) {
					loadSound(sound, continuation);
				} else {
					playSound(sound, continuation);
				}
			}
		} 

		function loadSound(soundName, callbackFunction) {
			var soundUrl = createSoundUrl(soundName); 
			var sm = soundManager.createSound({
				id: soundName,
				url: soundUrl
			});
			if (sm.readyState == 3) {  // already loaded?
				log("sound " + soundName + " was already loaded so did NOT load");
				callbackFunction();
			} else {
				log("loading sound " + soundName + " (" + soundUrl + ")");
				sm.load({
					onload: callbackFunction
				});
			}	
		} 

		function playSound(soundName, callbackFunction) {
			log("playing sound " + soundName);
			soundManager.play(soundName, {onfinish: callbackFunction});
		} 

		function createSoundUrl(fileName) {
			return 'sounds/' + subFolder + '/' + fileName + '.mp3';
		}
		
		function filterInvalidSoundNames(arrayOfNames) {
			var scrubbedList = [];
			for ( var i = 0; i < arrayOfNames.length; i++) {
				var name = arrayOfNames[i];
				if (name != null && jQuery.trim(name) != '') {
					scrubbedList.push(name);
				}
			}
			return scrubbedList;
		}
};