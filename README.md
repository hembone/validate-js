Validate-js
===========

Version 1.0

```html
<form id="validate_form" method="post" action="">

	<label>Name:</label>
	<input data-validate="required" type="text" name="name" />

	<label>Email:</label>
	<input data-validate="required, email" type="text" name="email" />

	<label>Verify Email:</label>
	<input data-validate="required, match:email|Email" type="text" name="email2" />

	<button type="submit">Submit</button>

</form>
```


```html
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="/validate/jquery.validate.js"></script>

<script>
$(function() {

	$('#validate_form').validate();

});
</script>
```
