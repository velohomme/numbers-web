/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */

SoundPlayer = function(soundsFolder) {
	var PLAY = 1;
	var LOAD = 0;
	var self = this;
	var subFolder = soundsFolder;
	
	// load and plays the sounds.  callback is optional
	this.loadAndPlaySounds = function(soundNames, callbackWhenLoadingComplete, callbackWhenPlayingComplete) {
		if (callbackWhenLoadingComplete) {
			callbackWhenLoadingComplete();
		}
		if (callbackWhenPlayingComplete) {
			callbackWhenPlayingComplete();
		}
	}; 
	
	// pre-load sounds.  callback is optional
	this.loadSounds = function(soundNames, callbackWhenLoadingComplete) {
		if (callbackWhenLoadingComplete) {
			callbackWhenLoadingComplete();
		}
	}; 
};