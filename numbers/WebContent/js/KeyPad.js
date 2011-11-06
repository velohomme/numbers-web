/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/************************   KeyPad    ******************************/

KeyPad = function($domElementToControl) {
	var self = this;
	var $numberDomElement = $domElementToControl;
	var changeListener;
	var fractionalDigits;
	var maxWholeDigits;
	var clearLabel = 'C';
	var backLabel = '&larr;';
	var decimalChar = null;
	var cellHtml1 = '<td><a class="keypad-button blue" href="javascript:void(0)">';
	var cellHtml2 = '</a></td>';
	var blankCell = '<td></td>';
	var finishedDecimalRegex;
	var keyHeight = 50;
	var keyWidth = 50;
	var keyGap = 2;
	
	// Render the keypad in this container.  aDecimalChar should be NULL if you don't need decimals
	// The (optional) aChangeListener will be called (with one argument: current value) after any change
	this.render = function($container, aDecimalChar, numberFractionalDigits, numberMaxWholeDigits, aChangeListener) {
		decimalChar = aDecimalChar;
		fractionalDigits = numberFractionalDigits;
		maxWholeDigits = numberMaxWholeDigits;
		changeListener = aChangeListener;
		$container.append(createHtml());
		bindKeyEvents();
		finishedDecimalRegex = new RegExp(".*\\" + decimalChar + "\\d\\d");
	};

	function createHtml() {
		var html = [];
		var lowerLeftCorner = decimalChar ? decimalChar : clearLabel;
		html[html.length] = '<div class="keypad">';
		var keyNum = 0;
		for ( var i = 0; i < 4; i++) {
			for ( var j = 1; j < 4; j++) {
				var number = (i * 3) + j;
				number = number < 10 ? number : (number == 10 ? lowerLeftCorner :  (number == 11 ? 0 : backLabel));
				addKey(html, number, i, j-1);
			}
		}
		if (decimalChar) {
			addKey(html, clearLabel, 4, 1);
		}
		return html.join('');
	}
	
	
	function addKey(html, text, row, column) {
		var top = row * (keyGap + keyHeight);
		var left = column * (keyGap + keyWidth);
		html[html.length] = '<input type="button" class="button blue keypad-button" value="';
		html[html.length] = text;
		html[html.length] = '" style="top:';
		html[html.length] = top;
		html[html.length] = 'px;left:';
		html[html.length] = left;
		html[html.length] = 'px;"/>';
	}
	
	function bindKeyEvents() {
		$('.keypad-button').bind('click', function(event) {
			var value = $(this).val();
			handleKeyClicked(value);
		});
	}
	
	function handleKeyClicked(keyName) {
		var beforeValue = getFieldText();
		var keyIsNumber = isNumber(keyName);
		// clear
		if (keyName == clearLabel) {
			setFieldText('');
		// back button
		} else if (!keyIsNumber && keyName != decimalChar) {
			var currentValue = getFieldText();
			if (currentValue != '') {
				setFieldText(currentValue.substring(0,currentValue.length - 1));
			}
		// ignore leading 0s
		} else if (keyName == '0' && beforeValue == '') {
			ignoredCharWarning();
		// ignore more than one decimal char
		} else if (keyName == decimalChar && beforeValue.indexOf(decimalChar) > -1) {
			ignoredCharWarning();
		// ignore anything after decimal char + max decimal chars	
		} else if (keyIsNumber && beforeValue.match(finishedDecimalRegex)) {
			ignoredCharWarning();	
		// ignore anything after we've reached the max length
		} else if (beforeValue.length >= fractionalDigits + maxWholeDigits + (decimalChar ? 1 : 0)) {
			ignoredCharWarning();	
		// append 
		} else {
			setFieldText(getFieldText() + keyName);
		}
		if (changeListener != null) {
			var currentValue = getFieldText();
			if (getFieldText() != beforeValue) {
				changeListener(currentValue);
			}
		}
	}
	
	function ignoredCharWarning() {
		// no-op...
	}
	
	function isNumber(label) {
		return ! isNaN (label-0);
	}
	
	function getFieldText() {
		return isInputField() ? $numberDomElement.val() : $numberDomElement.html();
	}
	
	function setFieldText(text) {
		return isInputField() ? $numberDomElement.val(text) : $numberDomElement.html(text);
	}
	
	function isInputField() {
		return $numberDomElement.attr('type') == 'text';
	}
	
};