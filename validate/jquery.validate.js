var errorLang = {
	'empty-text':{
		'en':'This field must be filled in.' // english
	}
	,'min-text-1':{
		'en':'This field needs at least ' // english
	}
	,'min-text-2':{
		'en':' characters.' // english
	}	
	,'max-text-1':{
		'en':'This field must not exceed ' // english
	}
	,'max-text-2':{
		'en':' characters.' // english
	}
	,'match-text-1':{
		'en':'This field must match the ' // english
	}
	,'match-text-2':{
		'en':' field.' // english
	}
	,'valid-password':{
		'en':'Your password must be at least 8 characters in length and contain an alpha, a numeric and one of the following special characters:  !, $, #, %, &, *, @' // english
	}
	,'valid-email':{
		'en':'You must enter a valid email address.' // english
	}
	,'email-exists':{
		'en':'That email address already exists in our system.' // english
	}
	,'phone-exists':{
		'en':'That phone number already exists in our system.' // english
	}
	,'make-selection':{
		'en':'You must make a selection.' // english
	}
};

var allScripts = document.getElementsByTagName("script");
var validateScriptLocation = allScripts[allScripts.length - 1].src;
var splitLoc = validateScriptLocation.split('/');
var jsFileName = splitLoc[splitLoc.length - 1];
var basePath = validateScriptLocation.replace(jsFileName,'');

var validateConfigs = {
	checkMX: false
	,emailRegEx: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	,passwordRegEx:/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!$#%&*@ "]).*$/
	,lang: 'en'
	,errorClass:'validate-error'
	,errorTextClass:'validate-error-text'
	,errors: 0
};

function validate(formClass, settings) {
	setDefaults(settings);
	setCss();
	iterateFields(formClass, true);
	setSubmit(formClass);
}

function setDefaults(settings) {
	if(typeof settings !== 'undefined') {
		if(typeof settings.checkMX !== 'undefined') {
			validateConfigs.checkMX = settings.checkMX;
		}
		if(typeof settings.emailRegEx !== 'undefined') {
			validateConfigs.emailRegEx = settings.emailRegEx;
		}
		if(typeof settings.passwordRegEx !== 'undefined') {
			validateConfigs.passwordRegEx = settings.passwordRegEx;
		}
		if(typeof settings.lang !== 'undefined') {
			validateConfigs.lang = settings.lang;
		}
		if(typeof settings.errorClass !== 'undefined') {
			validateConfigs.errorClass = settings.errorClass;
		}
		if(typeof settings.errorTextClass !== 'undefined') {
			validateConfigs.errorTextClass = settings.errorTextClass;
		}
	}
}

function setCss() {
	var height = ($(window).height()/2)-150;
	var width = ($(window).width()/2)-100;
	$('body').prepend('<div id="overlay"><img src="'+basePath+'loader.gif"/></div>');
	var cssStyles = '<style type="text/css">'+
	'.validate-error {border:1px solid #b50000;}'+
	'.validate-error-text {color:#b50000;font-size:0.8em;}'+
	'#overlay {display:none;box-shadow:4px 4px 10px 0 #444;background:url(\''+basePath+'black_50.png\');position:fixed;z-index:1000;top:'+height+'px;left:'+width+'px;width:200px;height:200px;border-radius:20px;}'+
	'#overlay img {display:block;margin:0 auto;position:relative;top:35px;}'+
	'</style>';
	$('body').prepend(cssStyles);
}

function iterateFields(formClass, set) {
	if(set) {
		var fieldId = 0;
	}
	$('.'+formClass+' *').filter(':input').each(function(key, el) {
		var elData = $(el).data();
		var dataValue = elData.validate;
		if(dataValue) {
			if(set) {
				$(el).attr('data-'+formClass+'-id', fieldId);
			} else {
				fieldId = $(el).attr('data-'+formClass+'-id');
			}
			var rules = parseDataValue(dataValue);
			var type = $(el).prop('type');
			switch(type) {
				case 'text':
				case 'password':
				case 'textarea':
					if(set) {
						setText(formClass, fieldId, rules);
					} else {
						checkText(formClass, fieldId, rules);
					}
					break;
				case 'select-one':
				case 'select-multiple':
					if(set) {
						setSelect(formClass, fieldId, rules);
					} else {
						checkSelect(formClass, fieldId, rules);
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

function setSubmit(formClass) {
	var theForm = $('.'+formClass);
	theForm.on('submit', function(event) {
		if(checkAll(formClass)) {
			theForm.submit();
		}
		event.preventDefault();
	});
}

function parseDataValue(dataValue) {
	var rules = [];
	var splitValues = dataValue.split(',');
	$.each(splitValues, function(key, value) {
		rules.push(value.trim());
	});
	return rules;
}

function displayError(formClass, fieldId, errorText) {
	var theField = $('[data-'+formClass+'-id="'+fieldId+'"]');
	theField.removeClass(validateConfigs.errorClass);
	$('#'+formClass+'-'+fieldId).remove();
	if(errorText !== '') {
		theField.addClass(validateConfigs.errorClass);
		theField.after('<div id="'+formClass+'-'+fieldId+'" class="'+validateConfigs.errorTextClass+'">'+errorText+'</div>');
	}
}

////////////////////
// FIELD SETTERS
////////////////////

var delay;

function setText(formClass, fieldId, rules) {
	$('[data-'+formClass+'-id="'+fieldId+'"]').on('change blur', function() {
		clearTimeout(delay);
		delay = setTimeout(function() {	
			checkText(formClass, fieldId, rules);
		}, 300);
	});
}

function setSelect(formClass, fieldId, rules) {
	$('[data-'+formClass+'-id="'+fieldId+'"]').on('change blur', function() {
		clearTimeout(delay);
		delay = setTimeout(function(){
			checkSelect(formClass, fieldId, rules);
		}, 300);
	});
}

////////////////////
// FIELD CHECKERS
////////////////////

function checkText(formClass, fieldId, rules) {
	var input = $('[data-'+formClass+'-id="'+fieldId+'"]').val();
	var errorText = '';
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
					validateConfigs.errors++;
					errorText = response;
				}
				break;
			case 'min-length':
				var response = isMinLength(input, value);
				if(response) {
					validateConfigs.errors++;
					errorText = response;
				}
				break;
			case 'max-length':
				var response = isMaxLength(input, value);
				if(response) {
					validateConfigs.errors++;
					errorText = response;
				}
				break;
			case 'match':
				var response = isMatch(input, value);
				if(response) {
					validateConfigs.errors++;
					errorText = response;
				}
				break;
			case 'password':
				var response = isPassword(input);
				if(response) {
					validateConfigs.errors++;
					errorText = response;
				}
				break;
			case 'email':
				var response = isEmail(input, formClass, fieldId);
				if(response) {
					validateConfigs.errors++;
					errorText = response;
				}
				break;
			case 'phone':
				var response = dupPhone(input, formClass, fieldId);
				if(response) {
					validateConfigs.errors++;
					errorText = response;
				}
				break;
		}
	});
	displayError(formClass, fieldId, errorText);
}

function checkSelect(formClass, fieldId, rules) {
	var input = $('[data-'+formClass+'-id="'+fieldId+'"]').val();
	var errorText = '';
	$.each(rules, function(key, rule) {
		switch(rule) {
			case 'required':
				var response = isSelected(input);
				if(response) {
					validateConfigs.errors++;
					errorText = response;
				}
				break;
		}
	});
	displayError(formClass, fieldId, errorText);
}

function checkAll(formClass) {
	$('#overlay').show();
	validateConfigs.errors = 0;
	iterateFields(formClass, false);
	if(validateConfigs.errors === 0){
		return true;
	} else {
		$('#overlay').fadeOut();
		return false;
	}
}

////////////////////
// RULES
////////////////////

function isEmpty(input) {
	if(input.trim() === '') {
		return errorLang['empty-text'][validateConfigs.lang];
	} else {
		return false;
	}
}

function isMinLength(input, value) {
	if(input.trim().length < value) {
		return errorLang['min-text-1'][validateConfigs.lang]+value+errorLang['min-text-2'][validateConfigs.lang];
	} else {
		return false;
	}
}

function isMaxLength(input, value) {
	if(input.trim().length > value) {
		return errorLang['max-text-1'][validateConfigs.lang]+value+errorLang['max-text-2'][validateConfigs.lang];
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
		return errorLang['match-text-1'][validateConfigs.lang]+field+errorLang['match-text-2'][validateConfigs.lang];
	} else {
		return false;
	}
}

function isPassword(input) {
	if(!validateConfigs.passwordRegEx.test(input)) {
		return errorLang['valid-password'][validateConfigs.lang];
	} else {
		return false;
	}
}

function isEmail(input, formClass, fieldId) {
	var errorText = errorLang['valid-email'][validateConfigs.lang];
	if(input !== '') {
		if(!validateConfigs.emailRegEx.test(input)) {
			return errorText;
		} else {
			if(validateConfigs.checkMX) {
				$.ajax({
					type:'POST'
					,url:basePath+'jquery.validate.php'
					,dataType:'json'
					,data:{email:input}
				})
				.done(function(res) {
					if(res.result === 'invalid') {
						displayError(formClass, fieldId, errorText);
					} else {
						return false;
					}
				});
			} else {
				return false;
			}
		}
	} else {
		return false;
	}
}

function isSelected(input) {
	if(input.trim() === '' || input.trim() === 'null') {
		return errorLang['make-selection'][validateConfigs.lang];
	} else {
		return false;
	}
}