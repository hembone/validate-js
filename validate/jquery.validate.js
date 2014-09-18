// Validate-js   Version 1.01
////////////////////////////////

(function($) {


	$.fn.validate = function(options) {

		////////////////////
		// SET VARIABLES
		////////////////////
		var errorLang = {
			'empty-text':{
				'en':'This field must be filled in.'
			}
			,'min-text-1':{
				'en':'This field needs at least '
			}
			,'min-text-2':{
				'en':' characters.'
			}	
			,'max-text-1':{
				'en':'This field must not exceed '
			}
			,'max-text-2':{
				'en':' characters.'
			}
			,'match-text-1':{
				'en':'This field must match the '
			}
			,'match-text-2':{
				'en':' field.'
			}
			,'valid-password':{
				'en':'Your password must be at least 8 characters in length and contain an alpha, a numeric and one of the following special characters:  !, $, #, %, &, *, @'
			}
			,'valid-email':{
				'en':'You must enter a valid email address.'
			}
			,'make-selection':{
				'en':'You must make a selection.'
			}
		};
		var formObj = this;
		var formSelector = this.selector.replace(/[#.]/, '');
		var basePath = window.location.protocol + "//" + window.location.host + "/"
		var delay;
		var settings = $.extend({
			filePath: "validate/"
			,emailRegEx: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			,passwordRegEx: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!$#%&*@ "]).*$/
			,lang: 'en'
			,showOverlay: true
			,errorClass: 'validate-error'
			,errorTextClass: 'validate-error-text'
			,errors: 0
		}, options);
		////////////////////
		////////////////////


		////////////////////
		// SET CSS
		////////////////////
		var height = ($(window).height()/2)-100;
		var width = ($(window).width()/2)-100;
		$('body').prepend('<div id="overlay"><img src="'+basePath+settings.filePath+'loader.gif"/></div>');
		var cssStyles = '<style type="text/css">'+
		'.validate-error {border:1px solid #b50000;}'+
		'.validate-error-text {color:#b50000;font-size:0.8em;}'+
		'#overlay {display:none;box-shadow:4px 4px 10px 0 #444;background:url(\''+basePath+settings.filePath+'black_50.png\');position:fixed;z-index:1000;top:'+height+'px;left:'+width+'px;width:200px;height:200px;border-radius:20px;}'+
		'#overlay img {display:block;margin:0 auto;position:relative;top:35px;}'+
		'</style>';
		$('body').prepend(cssStyles);
		////////////////////
		////////////////////


		////////////////////
		// SET SUBMIT
		////////////////////
		this.on('submit', function(event) {
			if(checkAll()) {
			} else {
				event.preventDefault();
			}
		});
		////////////////////
		////////////////////


		////////////////////
		// ITERATE FIELDS
		////////////////////
		iterateFields(true);

		function iterateFields(set) {
			if(set) {
				var fieldId = 0;
			}
			$(formObj.selector+' *').filter(':input').each(function(key, el) {
				var dataValue = $(el).data().validate;
				//console.log(dataValue);
				if(dataValue) {
					if(set) {
						$(el).attr('data-'+formSelector+'-id', fieldId);
					} else {
						fieldId = $(el).attr('data-'+formSelector+'-id');
					}
					var rules = parseDataValue(dataValue);
					var type = $(el).prop('type');
					switch(type) {
						case 'text':
						case 'password':
						case 'textarea':
							if(set) {
								setText(fieldId, rules);
							} else {
								checkText(fieldId, rules);
							}
							break;
						case 'select-one':
						case 'select-multiple':
							if(set) {
								setSelect(fieldId, rules);
							} else {
								checkSelect(fieldId, rules);
							}
							break;
						default:
					}
				}
				if(set) {
					fieldId++;
				}
			});
		}
		////////////////////
		////////////////////


		////////////////////
		// PARSE DATA VALUES
		////////////////////
		function parseDataValue(dataValue) {
			var rules = [];
			var splitValues = dataValue.split(',');
			$.each(splitValues, function(key, value) {
				rules.push(value.trim());
			});
			return rules;
		}
		////////////////////
		////////////////////


		////////////////////
		// DISPLAY ERRORS
		////////////////////
		function displayError(fieldId, errorText) {
			var theField = $('[data-'+formSelector+'-id="'+fieldId+'"]');
			theField.removeClass(settings.errorClass);
			$('#'+formSelector+'-'+fieldId).remove();
			if(errorText !== '') {
				theField.addClass(settings.errorClass);
				theField.after('<div id="'+formSelector+'-'+fieldId+'" class="'+settings.errorTextClass+'">'+errorText+'</div>');
			}
		}
		////////////////////
		////////////////////


		////////////////////
		// FIELD SETTERS
		////////////////////
		function setText(fieldId, rules) {
			$('[data-'+formSelector+'-id="'+fieldId+'"]').on('change blur', function() {
				clearTimeout(delay);
				delay = setTimeout(function() {	
					checkText(fieldId, rules);
				}, 300);
			});
		}

		function setSelect(fieldId, rules) {
			$('[data-'+formSelector+'-id="'+fieldId+'"]').on('change blur', function() {
				clearTimeout(delay);
				delay = setTimeout(function(){
					checkSelect(fieldId, rules);
				}, 300);
			});
		}
		////////////////////
		////////////////////


		////////////////////
		// FIELD CHECKERS
		////////////////////
		function checkText(fieldId, rules) {
			var theField = $('[data-'+formSelector+'-id="'+fieldId+'"]');
			var fieldData = theField[0];
			var input = fieldData.value;
			var errorText = '';

			////////////////////
			// EXCEPTIONS
			////////////////////
			var checkField = true;
			////////////////////
			////////////////////

			if(checkField) {

				$.each(rules, function(key, rule) {
					var splitRule = rule.split(':');
					if(splitRule.length > 1) {
						rule = splitRule[0];
						var value = splitRule[1];
					}
					switch(rule) {
						case 'required':
							var response = isEmpty(input);
							if(response) {
								settings.errors++;
								errorText = response;
							}
							break;
						case 'min-length':
							var response = isMinLength(input, value);
							if(response) {
								settings.errors++;
								errorText = response;
							}
							break;
						case 'max-length':
							var response = isMaxLength(input, value);
							if(response) {
								settings.errors++;
								errorText = response;
							}
							break;
						case 'match':
							var response = isMatch(input, value);
							if(response) {
								settings.errors++;
								errorText = response;
							}
							break;
						case 'password':
							var response = isPassword(input);
							if(response) {
								settings.errors++;
								errorText = response;
							}
							break;
						case 'email':
							var response = isEmail(input, fieldId);
							if(response) {
								settings.errors++;
								errorText = response;
							}
							break;
					}
				});

			}

			displayError(fieldId, errorText);
		}

		function checkSelect(fieldId, rules) {
			var theField = $('[data-'+formSelector+'-id="'+fieldId+'"]');
			var fieldData = theField[0];
			var input = fieldData.value;
			var errorText = '';

			////////////////////
			// EXCEPTIONS
			////////////////////
			var checkField = true;
			////////////////////
			////////////////////
			
			if(checkField) {

				$.each(rules, function(key, rule) {
					switch(rule) {
						case 'required':
							var response = isSelected(input);
							if(response) {
								settings.errors++;
								errorText = response;
							}
							break;
					}
				});

			}

			displayError(fieldId, errorText);
		}

		function checkRadio(fieldId, rules) {
			var theField = $('[data-'+formSelector+'-id="'+fieldId+'"]');
			var fieldData = theField[0];
			var input = fieldData.value;
			var errorText = '';

			////////////////////
			// EXCEPTIONS
			////////////////////
			var checkField = true;
			////////////////////
			////////////////////
			
			if(checkField) {

				$.each(rules, function(key, rule) {
					switch(rule) {
						case 'required':
							var response = isSelected(input);
							if(response) {
								settings.errors++;
								errorText = response;
							}
							break;
					}
				});

			}

			displayError(fieldId, errorText);
		}

		function checkAll() {
			if(settings.showOverlay) {
				$('#overlay').show();
			}
			settings.errors = 0;
			iterateFields(false);
			if(settings.errors === 0){
				return true;
			} else {
				if(settings.showOverlay) {
					$('#overlay').fadeOut();
				}
				return false;
			}
		}
		////////////////////
		////////////////////


		////////////////////
		// RULES
		////////////////////
		function isEmpty(input) {
			if(input.trim() === '') {
				return errorLang['empty-text'][settings.lang];
			} else {
				return false;
			}
		}

		function isMinLength(input, value) {
			if(input.trim().length < value) {
				return errorLang['min-text-1'][settings.lang]+value+errorLang['min-text-2'][settings.lang];
			} else {
				return false;
			}
		}

		function isMaxLength(input, value) {
			if(input.trim().length > value) {
				return errorLang['max-text-1'][settings.lang]+value+errorLang['max-text-2'][settings.lang];
			} else {
				return false;
			}
		}

		function isMatch(input, value) {
			var splitValue = value.split('|');
			var name = splitValue[0];
			var field = splitValue[1];
			var matchInput = $('[name="'+name+'"]').val();
			if($.trim(input) !== $.trim(matchInput)) {
				return errorLang['match-text-1'][settings.lang]+field+errorLang['match-text-2'][settings.lang];
			} else {
				return false;
			}
		}

		function isPassword(input) {
			if(!settings.passwordRegEx.test(input)) {
				return errorLang['valid-password'][settings.lang];
			} else {
				return false;
			}
		}

		function isEmail(input, fieldId) {
			if(input !== '') {
				if(!settings.emailRegEx.test(input)) {
					return errorLang['valid-email'][settings.lang];
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		function isSelected(input) {
			if(input.trim() === '' || input.trim() === 'null') {
				return errorLang['make-selection'][settings.lang];
			} else {
				return false;
			}
		}
		////////////////////
		////////////////////

	};


}(jQuery));