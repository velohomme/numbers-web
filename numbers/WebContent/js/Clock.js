/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/************************   Time    ******************************/

Time = function(hours, minutes) {
	var self = this;
	
	var hour = hours == null ? 0 : hours;
	var minute = minutes == null ? 0 : minutes;
	this.value = hour + ':' + minute; // for debug only...not used
	
	this.getHour = function() {
		return hour;
	};
	
	this.getMinute = function() {
		return minute;
	};
	
	this.equals = function(anotherTime) {
		return self.getHour() == anotherTime.getHour() &&
			self.getMinute() == anotherTime.getMinute();
	};
	
	this.equalsZero = function() {
		return self.getHour() == 00 && self.getMinute() == 0;
	};
	
	this.copy = function() {
		return new Time(self.getHour(),self.getMinute());
	};
	
	this.format = function(displayWithAmPm) {
		var adjustedHour = displayWithAmPm ? hour - 12 : hour;
		var formattedMin = minute < 10 ? '0'+minute : ''+minute;
		var suffix = displayWithAmPm ? (hour < 12 ? 'a.m.' : 'p.m.') : '';
		return adjustedHour + ':' + formattedMin + ' ' + suffix;
	};
	
	function format(num) {
		var formattedNum = num + '';
		while (formattedNum.length < 2) {
			formattedNum = '0' + formattedNum;
		}
		return formattedNum;
	};
};

TimeTest = function(newTime) {
	this.time = new Time(0,0);
	this.timeSounds = [];
	this.timeInContextSounds =[];
	if (newTime) {
		this.time = newTime;
	}
};
/************************   Clock    ******************************/

Clock = function() {
	var self = this;
	this.NO_SOUND = '';
	this.correctPhrases = ['correct'];
	this.incorrectPhrases = ['wrong-time'];
	this.oclockSound = 'oclock';
	this.zeroHourSound = 'o';
		
	// private vars
	var HOUR_HAND_WIDTH = 14;
	var HOUR_HAND_HIGHLIGHT_WIDTH = 10;
	var MINUTE_HAND_WIDTH = 8;
	var MINUTE_HAND_HIGHLIGHT_WIDTH = 5;
	var HOUR_HAND = 1;
	var MINUTE_HAND = 2;
	var is24HourClock = true;
	var currentTimeTest = new TimeTest();
	var preloadedTimeTest = undefined;
	var canvas;
	var clockFaceRadius = 150;
	var clockCenterPoint = {x: 220, y: 190};
	var hourGuessed;
	var minuteGuessed;
	var hourHandDrawing;
	var minuteHandDrawing;
	var clockDot;
	var timesetCallback;
	var minutesHider;
	var draggingHand = undefined;
	var limits = {
			hourMin: 0,
			hourMax: 23,
			minuteMin: 0,
			minuteMax: 59
		};
	
	// public functions
	this.getLimits = function() {
		return limits;
	};
	
	this.getHourMax = function() {
		return is24HourClock ? 23 : 12;
	};
	
	this.reset = function() {
		self.resetGuessed();
	};
	
	this.resetGuessed = function() {
		hourGuessed = 6;
		minuteGuessed = 0;
		if (canvas) {
			updateRenderedClock();
		}
	};
	
	this.generateNewTime = function(isFiveMinIncrementsOnly) {
		if (preloadedTimeTest && preloadedTimeTest.isFiveMinIncrementsOnly == isFiveMinIncrementsOnly) {
			currentTimeTest = preloadedTimeTest;
			self.clearPreloadTime();
		} else {
			currentTimeTest = generateNewTimeTest(isFiveMinIncrementsOnly, currentTimeTest);
		}
	};
	
	this.preloadNextTime = function(isFiveMinIncrementsOnly) {
		preloadedTimeTest = generateNewTimeTest(isFiveMinIncrementsOnly, currentTimeTest);
	};
	
	this.clearPreloadTime = function() {
		preloadedTimeTest = undefined;
	};
	
	this.getTime = function() {
		return currentTimeTest.time;
	};
	
	this.getTimeSounds = function() {
		return currentTimeTest.timeSounds;
	};
	
	this.getTimeInContextSounds = function() {
		return currentTimeTest.timeInContextSounds;
	};
	
	this.getNextTimeSounds = function() {
		return preloadedTimeTest.timeSounds;
	};
	
	this.getNextTimeInContextSounds = function() {
		return preloadedTimeTest.timeInContextSounds;
	};
	
	this.draw = function($container, callbackWhenSet, is24Hour) {
		is24HourClock = is24Hour;
		if (!is24Hour) {
			limits.hourMax = 12;
		}
		drawClock($container[0]);
		timesetCallback = callbackWhenSet;
	};
	
	// returns null if hour and minute not set yet
	// returns 0 hour if actual time was 0 hour AND user clicked 12
	this.getTimeGuessed = function() {
		if (hourGuessed == null || minuteGuessed == null) {
			return null;
		} else if (currentTimeTest.time.getHour() == 0 && hourGuessed == 12) {
			return new Time(0, minuteGuessed);
		} else {
			return new Time(hourGuessed, minuteGuessed);
		}
	};
	
	this.getGuessResponseSounds = function(timeGuessed) {
		if (self.isTimeCorrect(timeGuessed)) {
			return [self.generateRandomElement(self.correctPhrases,'correctPhrases')];
		} else {
			return [self.generateRandomElement(self.incorrectPhrases,'incorrectPhrases')];
		}
	};
	
	this.parseTimeString = function(timeAsString) {
		var isFormattedWithAmPm = timeAsString.indexOf('m') > -1; 
		var hhsmm = isFormattedWithAmPm ? 
				timeAsString.substring(0, timeAsString.indexof(' ')) :
				timeAsString;	
		var parts = hhsmm.split(':');
		var hour = parseToInt(parts[0],2);
		if (isFormattedWithAmPm && hour > timeAsString.indexOf('p') > -1) {
			hour = hour + 12;
		}
		var minute = parseToInt(parts[1],2);
		return new Time(hour ==  null ? 0 : hour, minute = null ? 0 : minute);
	};
	
	this.isTimeCorrect = function(timeGuessed) {
		if (self.getTime().getHour() == 0) {
	        // if we are dealing with 0 hour...give them some slack on the number they guess
	        if ((timeGuessed.getHour() == 24 && is24HourClock) || (timeGuessed.getHour() == 12 && !is24HourClock)) {
	            return timeGuessed.getMinute() == self.getTime().getMinute();
	        }
		}
		return timeGuessed.equals(self.getTime());
	};
	
	/*
	 * 	private functions
	 */ 
	
	function generateNewTimeTest(isFiveMinIncrementsOnly, lastTimeTest) {
		var timeTest = new TimeTest();
		// calc time
		timeTest.time = calclateRandomTime(isFiveMinIncrementsOnly, lastTimeTest);
		// calc time sounds
		timeTest.timeSounds = generateTimeSounds(timeTest.time);
		timeTest.timeInContextSounds = generateTimeInContextSounds(timeTest.timeSounds);
		timeTest.isFiveMinIncrementsOnly = isFiveMinIncrementsOnly;
		return timeTest;
	}
	
	function generateTimeSounds(time) {
		return self.generateLocaleTimeSounds(time);
	}
	
	function generateTimeInContextSounds(arrayOfTimeSounds) {
		var soundWrapper = self.generateRandomElement(self.CONTEXT_SOUNDS,'context',5);
		var beforeSounds = soundWrapper.before ? [soundWrapper.before] : [];
		var afterSounds = soundWrapper.after ? [soundWrapper.after] : [];
		return beforeSounds.concat(arrayOfTimeSounds, afterSounds);
	}
	
	// answer an integer between min and max inclusive
	this.generateRandomNumber = function(min, max) {
		if (min >= max) {
			return min;
		}
		var r = Math.floor(Math.random(new Date().getSeconds()) * (max - min + 1));
		return r + min;
	};
	
	// listName used to store last index generated
	this.generateRandomElement = function(arrayOfObjects, listName, maxAttempts) {
		if (arrayOfObjects.length == 1) {
			return arrayOfObjects[0];
		}
		var max = arrayOfObjects.length - 1;
		if (!maxAttempts) {
			var randomIndex = self.generateRandomNumber(0, max);
		} else {
			var attemptCount = 0;
			while (attemptCount < maxAttempts) {
				var randomIndex = self.generateRandomNumber(0, max);
				if (randomIndex != window['randomListLastIndex-'+listName]) {
					window['randomListLastIndex-'+listName] = randomIndex;
					break;
				}
				attemptCount++;
			}
		}
		return arrayOfObjects[randomIndex];
	};
	
	function parseToInt(valueAsString, maxDigits) {
		var value = valueAsString;
		value = jQuery.trim(value);
		if (value == null || value == '') {
			return null;
		}
		if (value.length > maxDigits) {
			value = value.substring(0, maxDigits);
		}
		return parseInt(value,10);
	}
	
	function calclateRandomTime(isFiveMinIncrementsOnly, lastTimeTest) {
		var hour = 
			calculateRandomHrOrMin(5, limits.hourMin, limits.hourMax, lastTimeTest.time.getHour());
		var increment = isFiveMinIncrementsOnly ? 5 : undefined;
		var minute = 
			calculateRandomHrOrMin(5, limits.minuteMin, limits.minuteMax, lastTimeTest.time.getMinute(), increment);
		return new Time(hour, (hour == 0 && minute == 0) ? 1 : minute);
	}
	
	function calculateRandomHrOrMin(maxAttemptsToMakeDifferent, min, max, lastValue, increment) {
		var value = lastValue;
		var attempts = 0;
		while (value == lastValue && attempts < maxAttemptsToMakeDifferent) {
			attempts++;
			value = self.generateRandomNumber(min, max);
			if (increment) {
				value = Math.floor(value / increment) * increment;
			}
		} 	
		return value;
	}
	
	function drawClock(containerDomElement) {
		canvas = new Raphael(containerDomElement, 400, 400);
		var clockFace = canvas.circle(clockCenterPoint.x, clockCenterPoint.y, clockFaceRadius).attr({fill: 'r#fff-#1574b3', 'stroke-width': 5, 'stroke' : '#000'});
		var $clockFace = $(clockFace.node);
		$clockFace.mousemove(handleHandDragMouseMove);
		$clockFace.mouseup(handleHandDragMouseUp);
		drawTicks();
		drawHours();
		drawMinutes();
		drawHands();
		drawMinutesHider();
	}

	function drawMinutesHider() {
		// hide the minutes if the user hasn't selected an hour yet
		if (hourGuessed == null) {
			if (minutesHider == null) {
				minutesHider = canvas.circle(clockCenterPoint.x, clockCenterPoint.y, clockFaceRadius + 17).attr({fill: 'none', 'stroke-width': 26, 'stroke' : '#fff'});
			}
			minutesHider.toFront();
		// otherwise, push the "hider" to the back
		} else if (minutesHider != null) {	
			minutesHider.toBack();
		}
	}
	
	function drawHours() {
		var maxHour = is24HourClock ? 24 : 12;
		var hourTickRadius = clockFaceRadius - 18;
		for (var hour = 1; hour <= maxHour; hour++) {
			if (hour == 13) {
				hourTickRadius -= 30;
			}
			drawHour(getPoint(hourTickRadius, getDegreeFromHour(hour)), hour);
		}
	}
	
	function drawMinutes() {
		var minuteTickRadius = clockFaceRadius + 18;
		for (var minute = 0; minute < 60; minute++) {
			drawMinute(getPoint(minuteTickRadius, getDegreeFromMinute(minute)), minute);
		}
	}
	
	function drawTicks() {
		for (var minute = 0; minute < 60; minute++) {
			drawTick(minute);
		}
	}
	
	function drawHour(point, hour) {
		var isPostNoonHour = hour > 12;
		var circleRadius = isPostNoonHour ? 12 : 15;
		var fontSize = isPostNoonHour ? 16 : 18;
		var hourDrawing = canvas.circle(point.x, point.y, circleRadius).attr({fill: '#fff', 'stroke-width': 3, 'stroke' : '#000'});
		var textDrawing = canvas.text(point.x, point.y, hour+'').attr({fill: '#000', 'font-size': fontSize});
		addClickHandler([hourDrawing, textDrawing], function() {
			hourClicked(hour);
		});
		addHoverHandler([hourDrawing, textDrawing], function() {
			hourDrawing.attr({fill: '#A9A9A9'}); // inverse color
			if (hourHandDrawing) {
				hourHandDrawing.attr({'stroke-width': HOUR_HAND_HIGHLIGHT_WIDTH});
			}
		}, function() {
			hourDrawing.attr({fill: '#fff'}); // normal color
			if (hourHandDrawing) {
				hourHandDrawing.attr({'stroke-width': HOUR_HAND_WIDTH});
			}
		});
		// handle hand dragging
		$(hourDrawing.node).mousemove(handleHandDragMouseMove);
		$(textDrawing.node).mousemove(handleHandDragMouseMove);
	}
	
	function drawMinute(point, minute) {
		var is5inc = (minute % 5) == 0;
		var fontSize = 10;
		var fontColor = '#FF0000';
		var minuteDrawing;
		if (is5inc) {
			minuteDrawing = canvas.circle(point.x, point.y, 10).attr({fill: '#FF0000', 'stroke-width': 3, 'stroke' : '#FF0000'});
			fontSize = 12;
			fontColor = '#fff';
		}
		var textDrawing = canvas.text(point.x, point.y, minute+'').attr({fill: fontColor, 'font-size': fontSize});
		addClickHandler([minuteDrawing, textDrawing], function() {
			minuteClicked(minute);
		});
		addHoverHandler([minuteDrawing, textDrawing], function() {
			textDrawing.attr({fill: '#000'}); // inverse 
			if (minuteHandDrawing) {
				minuteHandDrawing.attr({'stroke-width': MINUTE_HAND_HIGHLIGHT_WIDTH});
			}
		}, function() {
			textDrawing.attr({fill: fontColor}); // normal
			if (minuteHandDrawing) {
				minuteHandDrawing.attr({'stroke-width': MINUTE_HAND_WIDTH});
			}
		});
	}
	
	function drawTick(minute) {
		var tickBeginPoint = getPoint(clockFaceRadius, getDegreeFromMinute(minute)); // edge of clock
		var tickEndPoint = getPoint(clockFaceRadius - 8, getDegreeFromMinute(minute));
		var pathCommand = 'M ' + tickBeginPoint.x + ' ' + tickBeginPoint.y + ' L ' + tickEndPoint.x + ' ' + tickEndPoint.y;
		return canvas.path(pathCommand).attr({'stroke-width': '2', 'stroke' : '#000'});
	}
	
	function drawHourHand(forcedDegree) {
		if (hourHandDrawing) {
			hourHandDrawing.remove();
		};
		if (hourGuessed != null || forcedDegree != null) {
			var degree = forcedDegree ? forcedDegree : getDegreeFromHour(hourGuessed, minuteGuessed);
			hourHandDrawing = drawClockHand(degree, clockFaceRadius - 80, '#000', HOUR_HAND_WIDTH);
			$hourHandElement = $(hourHandDrawing.node);
			$hourHandElement.bind('mousedown', {hand : HOUR_HAND}, handleHandDragMouseDown);
			$hourHandElement.mousemove(handleHandDragMouseMove);
			$hourHandElement.mouseup(handleHandDragMouseUp);
		}
	}
	
	function drawMinuteHand(forcedDegree) {
		if (minuteHandDrawing) {
			minuteHandDrawing.remove();
		};
		if (minuteGuessed != null || forcedDegree != null) {
			var degree = forcedDegree ? forcedDegree : getDegreeFromMinute(minuteGuessed);
			minuteHandDrawing = drawClockHand(degree, clockFaceRadius - 60, '#FF0000', MINUTE_HAND_WIDTH);
			$minuteHandElement = $(minuteHandDrawing.node);
			$minuteHandElement.bind('mousedown', {hand : MINUTE_HAND}, handleHandDragMouseDown);
			$minuteHandElement.mousemove(handleHandDragMouseMove);
			$minuteHandElement.mouseup(handleHandDragMouseUp);
			if (!forcedDegree) {
				hourHandDrawing.toFront();
				clockDot.toFront();
			}
		}
	}
	
	function snapMinuteHand() {
		if (minuteHandDrawing && minuteGuessed && currentTimeTest.isFiveMinIncrementsOnly) {
			var fiveMinuteIncrement = Math.round(minuteGuessed/5) * 5;
			if (fiveMinuteIncrement == 60) {
				fiveMinuteIncrement = 0;  
			}
			if (fiveMinuteIncrement != minuteGuessed) {
				minuteGuessed = fiveMinuteIncrement;
				drawMinuteHand();				
				timesetCallback();
			}
		}
	}
	
	function drawClockHand(degrees, radius, color, width) {
		var endPoint = getPoint(radius, degrees);
		var pathCommand = 'M ' + clockCenterPoint.x + ' ' + clockCenterPoint.y + ' L ' + endPoint.x + ' ' + endPoint.y;
		var drawing = canvas.path(pathCommand).attr({'stroke-width': width, 'stroke' : color});
		return drawing;
	}
	
	function handleHandDragMouseDown(event) {
		$('body').bind('mouseup', handleHandDragMouseUp);
		draggingHand = event.data.hand;
	}
	
	function handleHandDragMouseUp(event) {
		draggingHand = null;
		$('body').unbind('mouseup', handleHandDragMouseUp);
		snapMinuteHand();
		if (hourHandDrawing) {
			hourHandDrawing.toFront();
			clockDot.toFront();
		};
	}
	
	function handleHandDragMouseMove(event) {
		if (draggingHand) {
	        var point = event.layerX ? 
	        		{x:event.layerX, y:event.layerY} : // most browsers
	        		{x:event.originalEvent.x, y:event.originalEvent.y}; // i.e.
	        var degree = getDegree(point);
	        if (draggingHand == HOUR_HAND) {
	        	drawHourHand(degree);
		        setHourGuessedFromDegree(degree);
	        } else {
	        	drawMinuteHand(degree);
	        	setMinuteGuessedFromDegree(degree);
	        }
	        timesetCallback();
		}
	}
	
	function setHourGuessedFromDegree(degree) {
		var hour = Math.floor(degree/30);
		var timeTestHour = currentTimeTest.time.getHour();
		if (hour == 0) {
			hour = timeTestHour == 0 ? 0 : 12; 
		} else if (timeTestHour > 12) {
			hour = hour + 12;
		}
		hourGuessed = hour;
	}
	
	function setMinuteGuessedFromDegree(degree) {
		minuteGuessed = Math.floor(degree/6);
	}
	
	function getPoint(radius, degrees) {
		// 0 is normally 3 o'clock so adjust it to 12 o'clock
		var radians = (degrees + 270) * Math.PI/180;
		return {
			x : clockCenterPoint.x + Math.round(radius * Math.cos(radians)), 
			y : clockCenterPoint.y + Math.round(radius * Math.sin(radians))
		};
	}
	
	function getDegreeFromHour(hour, minutes) {
		var degree = hour * 30;
		return (minutes == null || minutes == 0) ?
			degree :
			degree + Math.floor(minutes/60 * 30);
	}
	
	function getDegreeFromMinute(minute) {
		return minute * 6;
	}

	function getDegree(point) {
		// radius: calculate distance between 2 points (http://www.teacherschoice.com.au/maths_library/analytical%20geometry/alg_15.htm)
		var radius = Math.sqrt(Math.pow((clockCenterPoint.x - point.x), 2) + Math.pow((clockCenterPoint.y - point.y), 2));
		// calulate the angle (http://beradrian.wordpress.com/2009/03/23/calculating-the-angle-between-two-points-on-a-circle/)
		var point0 = {x : clockCenterPoint.x, y : clockCenterPoint.y - radius};
		var radians = 2 * Math.atan2(point.y - point0.y, point.x - point0.x);
		// convert to degrees
		return radians * (180 / Math.PI);
	}
	
	function hourClicked(hour) {
		hourGuessed = hour;
		updateRenderedClock();
	}
	
	function minuteClicked(minute) {
		minuteGuessed = minute;
		updateRenderedClock();
		snapMinuteHand();
	}
	
	function updateRenderedClock() {
		drawMinutesHider();
		drawHands();
		if(timesetCallback && minuteGuessed != null && hourGuessed != null) {
			timesetCallback();
		}
	}
	
	function drawHands() {
		drawHourHand();
		drawMinuteHand();
		if (clockDot) {
			clockDot.toFront();
		} else {
			clockDot = canvas.circle(clockCenterPoint.x, clockCenterPoint.y, 10).attr({fill: '#000'});
		}
	}
	
	function addHoverHandler(drawingsToMonitorArray, overFunction,outFunction) {
		for ( var i = 0; i < drawingsToMonitorArray.length; i++) {
			if (drawingsToMonitorArray[i]) {
				$(drawingsToMonitorArray[i].node).bind('mouseover', overFunction);
				$(drawingsToMonitorArray[i].node).bind('mouseout', outFunction);
			}
		}
	}
	
	function addClickHandler(drawingsArray, handlerFunction) {
		for ( var i = 0; i < drawingsArray.length; i++) {
			if (drawingsArray[i]) {
				$(drawingsArray[i].node).bind('click', handlerFunction);
			}
		}
	}
};

/************************   French Clock    ******************************/
FrenchClock = function() {
	var self = this;
	Clock.call(self);  
	var zeroHourSound = 'minuit';
	var CASUAL_STYLE = 'casual'; // e.g, dix heure quart, cinq heure moins vingt
	var FORMAL_STYLE = 'formal'; // e.g, dix heure quinze, quatre heure quarante
	var STYLES =[FORMAL_STYLE, CASUAL_STYLE, FORMAL_STYLE]; // the frequency of a style in the array effects how often it will play
	var CASUAL_AFTER_SUFFIX = '-after'; 
	var CASUAL_BEFORE_SUFFIX = '-before'; 
	
	this.correctPhrases = ['correct'];
	this.incorrectPhrases = ['mauvais-reponse'];
	
	this.CONTEXT_SOUNDS = [
   	    {before: 'nous-commencons-a-servir-a'},
   	    {before: 'le-train-part-a'},
   	    {before: 'le-magasin-ouvre-a'},
   	    {before: 'le-magasin-ferme-a'},
   	    {before: 'il-est'},
   	    {before: 'elle-vient-me-chercher-a', after: 'mardi-prochaine'},
   	    {before: 'la-table-est-donc-reserve-pour'},
   	    {before: 'je-serai-la-a'},
   	    {before: 'hier-il-est-venu-a'},
   	    {before: 'le-film-commence-a'},
   	    {before: 'je-serai-de-retour-a'},
   	    {before: 'je-dois-partir-a'},
   	    {before: 'pouvez-vous-venir-me-cherchez-a', after: 'chercher-sil-vous-plait'},
  	    {},  // this will generate no context
  	    {},  // this will generate no context
  	    {},  // this will generate no context
  	    {}  // this will generate no context
   	]; 
   		
   	this.generateLocaleTimeSounds = function(time) {
   		var style = self.generateRandomElement(STYLES,'style',5);
   		var is5MinInc = time.getMinute() % 5 == 0;
   		//style = FORMAL_STYLE; // uncomment to force a style
   		var timeSounds = (is5MinInc && style == CASUAL_STYLE) ? 
   				generateCasualTimeSounds(time) : generateFormalTimeSounds(time);
   		return timeSounds;
   	};
   	
   	function generateFormalTimeSounds(time) {
   		var timeSounds = [];
   		timeSounds.push(time.getHour() == 0 ? zeroHourSound : time.getHour()+'H');
   		if (time.getMinute() != 0) {
   			timeSounds.push(time.getMinute()+'');
   		}
   		return timeSounds;
   	};
   	
	function generateCasualTimeSounds(time) {
		var isBeforeSound = time.getMinute() > 30;
		var hour = isBeforeSound ? time.getHour() + 1 : time.getHour();
		if (hour > self.getHourMax()) {
			hour = 1;
		}
		var minute = time.getMinute();
		if (minute == 0 || hour == 0) { // punt...don't support these yet
			return generateFormalTimeSounds(time);
		} else if (minute >= 5 && minute <= 25 && minute != 15) {  // punt...french doesn't have informal for 5, 10, 20, and 25 after
			return generateFormalTimeSounds(time);
		}
		
		var timeSounds = [];
		timeSounds.push(hour+'H');
		var minuteSound = isBeforeSound ? 60 - time.getMinute() : time.getMinute();
		minuteSound = minuteSound + (isBeforeSound ? CASUAL_BEFORE_SUFFIX : CASUAL_AFTER_SUFFIX);
		timeSounds.push(minuteSound);
		return timeSounds;
	}
};

/************************   American Clock    ******************************/
AmericanClock = function() {
	var self = this;
	Clock.call(self);
	var CASUAL_STYLE = 'casual'; // e.g, half-past five, five after ten
	var FORMAL_STYLE = 'formal'; // e.g, five thirty, ten o-five
	var STYLES =[FORMAL_STYLE, CASUAL_STYLE, FORMAL_STYLE]; // the frequency of a style in the array effects how often it will play
	var CASUAL_AFTER_SUFFIX = '-after'; // e.g., 5-after
	var CASUAL_BEFORE_SUFFIX = '-before'; // e.g., 10-before
	var oclockSound = 'oclock';
	var zeroHourSound = 'o';
	
	this.CONTEXT_SOUNDS = [
	    {},  // this will generate no context
	    {before: 'she-is-picking-me-up-at', after: 'on-tuesday'},
	    {before: 'ok-i-have-your-table-reserved-for'},
	    {before: 'she-told-me-that-she-would-be-here-at', after: 'tomorrow'},
	    {before: 'can-you-pick-me-up-at', after: 'time-please'},
	    {before: 'at-time', after: 'the-train-leaves'},
	    {before: 'yes-the-plane-leaves-at'},
	    {before: 'i-will-be-there-at'},
	    {before: 'he-came-at', after: 'yesterday'},
	    {before: 'the-movie-starts-at'},
	    {before: 'the-tv-show-ends-at'},
	    {before: 'i-will-be-back-at'},
	    {before: 'i-have-to-go-at'},
	    {after: 'is-when-he-thinks-he-can-be-here'},
	    {before: 'the-performance-starts-at', after: 'and-goes-for-thirty-minutes'}
//	    {before: '?', after: '?'},
//	    {before: '?'}
	]; 
		
	this.generateLocaleTimeSounds = function(time) {
		var style = self.generateRandomElement(STYLES,'style',5);
		var is5MinInc = time.getMinute() % 5 == 0;
		//style = CASUAL_STYLE; // uncomment to force a style
		var timeSounds = (is5MinInc && style == CASUAL_STYLE) ? 
				generateCasualTimeSounds(time) : generateFormalTimeSounds(time);
		return timeSounds;
	};
	
	function generateFormalTimeSounds(time) {
		var timeSounds = [];
		// pattern:  two fifteen, two o-five, two o'clock
		timeSounds.push(time.getHour() == 0 ? zeroHourSound : time.getHour()+'');
		timeSounds.push(time.getMinute() == 0 ? oclockSound : 
			(time.getMinute() < 10 ? '0'+time.getMinute() : time.getMinute()+'-'));
		return timeSounds;
	};
	
	function generateCasualTimeSounds(time) {
		var isBeforeSound = time.getMinute() > 30;
		var hour = isBeforeSound ? time.getHour() + 1 : time.getHour();
		if (hour > self.getHourMax()) {
			hour = 1;
		}
		if (time.getMinute() == 0 || hour == 0) { // punt...don't support these yet
			return generateFormalTimeSounds(time);
		}
		
		var timeSounds = [];
		var minuteSound = isBeforeSound ? 60 - time.getMinute() : time.getMinute();
		minuteSound = minuteSound + (isBeforeSound ? CASUAL_BEFORE_SUFFIX : CASUAL_AFTER_SUFFIX);
		timeSounds.push(minuteSound);
		timeSounds.push(hour+'-');
		return timeSounds;
	}

	
};

