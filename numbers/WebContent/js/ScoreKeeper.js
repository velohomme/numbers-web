/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/************************   Time    ******************************/

ScoreKeeper = function() {
	var self = this;
	
	var $container;
	
	var numberOfTestsStarted = 0;
	var totalTimeToAnswerTests = 0;
	var numberOfTestsCompleted = 0;
	var numberOfTestsSkipped = 0;
	var lastTestStartedTime = 0;

	this.testStarted = function() {
		numberOfTestsStarted++;
		if (lastTestStartedTime != 0) {
			numberOfTestsSkipped++;
		}
		lastTestStartedTime = (new Date).getTime();
	};
	
	this.testCompleted = function() {
		if (lastTestStartedTime != 0) { // only update if haven't already completed this test
			numberOfTestsCompleted++;
			var timeForCompletion = (new Date).getTime() - lastTestStartedTime;
			totalTimeToAnswerTests += timeForCompletion;
			lastTestStartedTime = 0;
		}
	};
	
	// Draw can be called multiple times for the same ScoreKeeper instance.  Previous
	// drawings will removed when the method is called.
	this.draw = function($containerDomElement) {
		jQuery('#scoreResetButton').unbind();
		if ($container) {
			$container.html('');
		}
		$container = $containerDomElement;
		html = [];
		html[html.length] = '<span id="YourScoreLabel"/>';
		html[html.length] = '<ul>';
		html[html.length] = '<li><span id="TotalNumberOfTestsLabel"/>:&nbsp;<span id="TotalNumberOfTests">0</span></li>';
		html[html.length] = '<li><span id="TestsCompletedLabel"/>:&nbsp;<span id="TestsCompleted">0</span></li>';
		html[html.length] = '<li><span id="TestsSkippedLabel"/>:&nbsp;<span id="TestsSkipped">0</span></li>';
		html[html.length] = '<li><span id="AverageTestCompletionTimeLabel"/>:&nbsp;<span id="AverageTestCompletionTime">0</span></li>';
		html[html.length] = '</ul>';
		html[html.length] = '<input id="scoreResetButton" type="button" class="button blue" value="Reset"/>';
		$container.html(html.join(''));
		jQuery('#scoreResetButton').bind('click', clearScore);
		self.refreshView();
	};
	
	this.refreshView = function() {
		$('#TotalNumberOfTests').html(numberOfTestsStarted+'');
		$('#TestsCompleted').html(numberOfTestsCompleted+'');
		$('#TestsSkipped').html(numberOfTestsSkipped+'');
		$('#AverageTestCompletionTime').html(getFormattedAverageCompleteTime());
	};
	
	function getAverageCompleteTime() {
		return numberOfTestsCompleted == 0 ? 0 : Math.floor(totalTimeToAnswerTests/numberOfTestsCompleted);
	}
		
	function getFormattedAverageCompleteTime() {
		var avg = getAverageCompleteTime();
		avg = Math.floor(avg / 100); 
		if (avg == 0) {
			return '0';
		} else if (avg < 10) {
			return avg+'';
		} else {
			var formatted = avg+'';
			var decimalSeparator = (InstructionsText && InstructionsText.DecimalSeparator)  ? InstructionsText.DecimalSeparator : '.';
			return formatted.substring(0, formatted.length-1) + decimalSeparator + formatted.substring(formatted.length-1);
		}
	}
	
	function clearScore() {
		numberOfTestsStarted = 0;
		totalTimeToAnswerTests = 0;
		numberOfTestsCompleted = 0;
		numberOfTestsSkipped = 0;
		lastTestStartedTime = 0;
		self.refreshView();
	}
};
