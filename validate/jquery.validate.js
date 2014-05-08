var errorLang = {
	'empty-text':{
		'en':'This field must be filled in.' // english
		,'fr':'Ce champ doit être rempli po.' // french
		,'mx-es':'Este campo debe ser llenado pulg.' // mexican spanish
		,'la-es':'Este campo debe ser llenado pulg.' // latin american spanish
	}
	,'min-text-1':{
		'en':'This field needs at least ' // english
		,'fr':'Ce champ a besoin d\'au moins ' // french
		,'mx-es':'Este campo necesita al menos ' // mexican spanish
		,'la-es':'Este campo necesita al menos ' // latin american spanish
	}
	,'min-text-2':{
		'en':' characters.' // english
		,'fr':' caractères.' // french
		,'mx-es':' caracteres.' // mexican spanish
		,'la-es':' caracteres.' // latin american spanish
	}	
	,'max-text-1':{
		'en':'This field must not exceed ' // english
		,'fr':'Ce champ ne doit pas dépasser ' // french
		,'mx-es':'Este campo no debe superar ' // mexican spanish
		,'la-es':'Este campo no debe superar ' // latin american spanish
	}
	,'max-text-2':{
		'en':' characters.' // english
		,'fr':' caractères.' // french
		,'mx-es':' caracteres.' // mexican spanish
		,'la-es':' caracteres.' // latin american spanish
	}
	,'match-text-1':{
		'en':'This field must match the ' // english
		,'fr':'Ce champ doit correspondre à la ' // french
		,'mx-es':'Este campo debe coincidir con el ' // mexican spanish
		,'la-es':'Este campo debe coincidir con el ' // latin american spanish
	}
	,'match-text-2':{
		'en':' field.' // english
		,'fr':' field.' // french
		,'mx-es':' field.' // mexican spanish
		,'la-es':' field.' // latin american spanish
	}
	,'valid-email':{
		'en':'You must enter a valid email address.' // english
		,'fr':'Vous devez entrer une adresse email valide.' // french
		,'mx-es':'Debe introducir una dirección de correo electrónico válida.' // mexican spanish
		,'la-es':'Debe introducir una dirección de correo electrónico válida.' // latin american spanish
	}
	,'email-exists':{
		'en':'That email address already exists in our system.' // english
		,'fr':'Cette adresse e-mail existe déjà dans notre système.' // french
		,'mx-es':'Esa dirección de correo electrónico ya existe en nuestro sistema.' // mexican spanish
		,'la-es':'Esa dirección de correo electrónico ya existe en nuestro sistema.' // latin american spanish
	}
	,'phone-exists':{
		'en':'That phone number already exists in our system.' // english
		,'fr':'Ce numéro de téléphone existe déjà dans notre système.' // french
		,'mx-es':'Que el número de teléfono que ya existe en nuestro sistema.' // mexican spanish
		,'la-es':'Que el número de teléfono que ya existe en nuestro sistema.' // latin american spanish
	}
	,'make-selection':{
		'en':'You must make a selection.' // english
		,'fr':'Vous devez faire un choix.' // french
		,'mx-es':'Usted debe hacer una selección.' // mexican spanish
		,'la-es':'Usted debe hacer una selección.' // latin american spanish
	}
};

var allScripts = document.getElementsByTagName("script")
    ,validateScriptLocation = allScripts[allScripts.length - 1].src
	,splitLoc = validateScriptLocation.split('/')
	,jsFileName = splitLoc[splitLoc.length - 1];

var validateConfigs = {
	checkMX:false
	,emailRegEx:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	,lang:'en'
	,phpFilePath:$('script[src$="'+jsFileName+'"]').attr('src').replace(jsFileName,'')+'jquery.validate.php'
	,errors:0
};

function validate(formClass, settings) {
	setDefaults(settings);
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
		if(typeof settings.lang !== 'undefined') {
			validateConfigs.lang = settings.lang;
		}
		if(typeof settings.phpFilePath !== 'undefined') {
			validateConfigs.phpFilePath = settings.phpFilePath;
		}
	}
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
	theField.parent().removeClass('validate-error');
	$('#'+formClass+'-'+fieldId).remove();
	if(errorText !== '') {
		theField.parent().addClass('validate-error');
		theField.parent().after('<div id="'+formClass+'-'+fieldId+'" class="validate-error-text">'+errorText+'</div>');
	}
}

////////////////////
// FIELD SETTERS
////////////////////

var delay;

function setText(formClass, fieldId, rules) {
	$('[data-'+formClass+'-id="'+fieldId+'"]').on('keyup change blur', function() {
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
	validateConfigs.errors = 0;
	iterateFields(formClass, false);
	if(validateConfigs.errors === 0){
		return true;
	} else {
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
	var matchInput = $('[name="'+value+'"]').val();
	if(input.trim() !== matchInput.trim()) {
		return errorLang['match-text-1'][validateConfigs.lang]+value+errorLang['match-text-2'][validateConfigs.lang];
	} else {
		return false;
	}
}

function isEmail(input, formClass, fieldId) {
	var errorText = errorLang['valid-email'][validateConfigs.lang];
	if(!validateConfigs.emailRegEx.test(input)) {
		return errorText;
	} else {
		if(validateConfigs.checkMX) {
			$.ajax({
				type:'POST'
				,url:validateConfigs.phpFilePath
				,dataType:'json'
				,data:{email:input}
			})
			.done(function(res) {
				if(res.result === 'invalid') {
					displayError(formClass, fieldId, errorText);
				} else {
					dupEmail(input, formClass, fieldId);
				}
			});
		} else {
			return false;
		}
	}
}

function isSelected(input) {
	if(input.trim() === '' || input.trim() === 'null') {
		return errorLang['make-selection'][validateConfigs.lang];
	} else {
		return false;
	}
}

function dupEmail(input, formClass, fieldId) {
	var errorText = errorLang['email-exists'][validateConfigs.lang];
	$.ajax({
		type:'POST'
		,url:'/validate.api.php'
		,dataType:'json'
		,data:{dup_email:input}
	})
	.done(function(res) {
		if(res.result === 'invalid') {
			displayError(formClass, fieldId, errorText);
		} else {
			return false;
		}
	});
}

function dupPhone(input, formClass, fieldId) {
	var errorText = errorLang['phone-exists'][validateConfigs.lang];
	$.ajax({
		type:'POST'
		,url:'/validate.api.php'
		,dataType:'json'
		,data:{dup_phone:input}
	})
	.done(function(res) {
		if(res.result === 'invalid') {
			displayError(formClass, fieldId, errorText);
		} else {
			return false;
		}
	});
}
