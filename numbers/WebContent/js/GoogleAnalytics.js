// adds google analytics code to page  


// INITIALIZE google analytics on page
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-26486056-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// generic tracking method for the pages

function sendTrackingEvent(category, action, opt_label, opt_value, opt_noninteraction) {
	// set a custom session variable (in this example we'll put ipad vs. non-ipad in a session custom variable).
	// This could be used to indicated connected vs. disconnected
	var isiPad = navigator.userAgent.match(/iPad/i) != null;
	_gaq.push(['_setCustomVar',
	           1,                   	// This custom var is set to slot #1.  Required parameter.
	           'iPadSession', 	  	 	// The name of the custom variable.  Required parameter.
	           (isiPad ? 'Yes' : 'No'), // The value of the custom variable.  Required parameter.
	           2                    	// Sets the scope to session-level.  Optional parameter.
	        ]);
	
	// send the tracking event
	_gaq.push(['_trackEvent', category, action, opt_label, opt_value]);
}