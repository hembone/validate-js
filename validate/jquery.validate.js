(function($) {
  
	$.fn.validate = function(options) {

		var settings = $.extend({
			checkMX: false
			,emailRegEx: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			,passwordRegEx: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!$#%&*@ "]).*$/
			,lang: 'en'
			,errorClass: 'validate-error'
			,errorTextClass: 'validate-error-text'
			,errors: 0
		}, options);

		console.log(this);

		this.each(function(key, el) {
			
		});


	};
 
}(jQuery));