/* Copyright (C) 2011 by Summit Hill Software, Inc, St. Paul, MN, USA  */
/************************   Util functions    ******************************/
		
function getQueryParameters() {
    var result = {};
    window.location.search.replace(/([^?&=]+)(=([^&]*))?/g, function(str, p1, p2, p3) {
        result[unescape(p1)] = unescape(p3);
        return str;
    });
    return result;
}
		
function playSounds(arrayOfSoundNames, loadCallback, playCallback) {
	soundPlayer.loadAndPlaySounds(arrayOfSoundNames, loadCallback, playCallback);
}

function isIPad() {
    return (navigator.platform.indexOf("iPad") != -1);
}

function isIPhone() {
    return (navigator.platform.indexOf("iPhone") != -1);
}

function warnIosUsers() {
	if (isIPad() || isIPhone()) {
		displayError('Sorry...this tool does not currently support iPad/iPhone.  We\'re working on an iPad version right now.', 'Unsupported Computer');
	}
}
		
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function setSpeller(spellerCode) {
	  // load via on-demand javascript so we don't have to load all languages initially
	  loadScript('spelling-' + spellerCode);
}

function persistInstructionsLang(languageCode) {
	  createCookie('instruction-lang',languageCode,300); 
}

function setInitialInstructionsLang(defaultLanguageCode) {
	  var langCode = getPersistedInstructionsLang();
	  switchInstructionsLang(langCode == null ? defaultLanguageCode : langCode);
}

function getPersistedInstructionsLang() {
	  return readCookie('instruction-lang');
}

function setLocale(locales, defaultLocaleCode) {
	var localeCode = getQueryParameters()['locale'];
	if (!localeCode) {
		localeCode = readCookie('locale-code');
	}
	if (!localeCode) {
		localeCode = defaultLocaleCode;
	}
	if (!locales[localeCode]) {
		localeCode = defaultLocaleCode;
		displayError('Sorry, the locale specified is invalid.  We\'ll use the default locale.', 'Invalid Locale');
	}
	LocaleProperties = locales[localeCode]; 
	LocaleProperties.locale = localeCode;
	createCookie('locale-code',localeCode,300); 
}

function loadScript(scriptFileName) {
	  var scriptElement=document.createElement('script');
	  scriptElement.setAttribute("type","text/javascript");
	  scriptElement.setAttribute("src", 'js/' + scriptFileName + '.js');
	  document.getElementsByTagName("head")[0].appendChild(scriptElement);
}

function initLocaleLinks() {
	$('.localeLink').each(function() {
		var $link = $(this);
		var href = $link.attr('href');
		if (href.match(/.*\?.*/) == null) {
			$link.attr('href', href + '?locale=' + LocaleProperties.locale);
		}
	});
}

function isEmpty(value) {
	return value == null || jQuery.trim(value) == '';	
}

function displayError(message, title) {
	var title = title == null ? InstructionsText['ErrorDialogTitle'] : title;
	$('<div></div>').html(message).dialog({title: title, modal: true });
}

function invisible(domElementId, shouldMakeInvisible) {
	$('#' + domElementId).toggleClass('invisible', shouldMakeInvisible);
}

function hide(domElementId, shouldHide) {
	$('#' + domElementId).toggleClass('hidden', shouldHide);
}

function flashGuessIndicator($el, isGood, isBackgound) {
	// animate going from special color back to original
	var colorProperty = isBackgound ? 'backgroundColor' : 'color';
	var flashColor = isGood ? 'green' : 'red';
	var animateProperties = {};
	animateProperties[colorProperty] = getOriginalCssProperty($el, colorProperty); 
	$el.css(colorProperty, flashColor).animate(animateProperties, 1500);
}

function getOriginalCssProperty($el, propertyName) {
	var original = $el.get(0)['original'+propertyName];
	if (!original) {
		original = $el.css(propertyName);
		$el.get(0)['original'+propertyName] = original;
	}
	return original;
}

function log(message) {
	if (window.console) {
		console.log(message);
	} else {
		//alert(message);
	}
}

function setExerciseInstructions() {
	if (window.InstructionsText) {
		for (id in InstructionsText) {
			$el = $('#'+id);
			if ($el.attr('type') == 'button' || $el.attr('type') == 'text') {
				$el.val(InstructionsText[id]);
			} else {
				$el.html(InstructionsText[id]);
			}
		}
	}
	if (LocaleProperties.language && window.ExcerciseLanguageText) {
		var excerciseText = ExcerciseLanguageText[LocaleProperties.language];
		for (id in excerciseText) {
			$el = $('#'+id);
			if ($el.attr('type') == 'button' || $el.attr('type') == 'text') {
				$el.val(excerciseText[id]);
			} else {
				$el.html(excerciseText[id]);
			}
		}
	}
};