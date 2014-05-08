<?php
if($_POST['email']) {
	if(checkdnsrr(array_pop(explode("@",$_POST['email'])),"MX")) {
		echo json_encode(array('result'=>'valid'));
	} else {
		echo json_encode(array('result'=>'invalid'));
	}
}
?>