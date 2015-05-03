<?php

/* ====================== Customization ======================== */

$my_email = "your@email.com"; 

/* ====================== Customization END ======================== */

/**
 * Include PHPMailer
 */

require('class.phpmailer.php');

/**
 * Cleaning up variables
 */

$name_contact = cleanEntries($_POST[name]);
$email_contact = cleanEntries($_POST[email]);
$subject_contact = "vCard - Message from " . $name_contact;
$message_contact = cleanEntries($_POST[message]);

/**
 * Initializing PHPMailer
 */

$mail = new PHPMailer();
$mail->From = $email_contact;
$mail->FromName = $name_contact;
$mail->AddAddress($my_email);
$mail->Subject = $subject_contact;
$mail->Body = $message_contact;

/**
 * Sending the Email with PHPMailer
 */

if ($name_contact && $email_contact && $subject_contact && $message_contact != "") {
	if( $mail->Send() ) {
		print "Email has been sent!";
	} else {
		print "Error while sending email!";
	}
} 

/**
 * Helper Function: removing unwanted characters
 */

function cleanEntries($parameter) {
	$parameter = trim(stripslashes(htmlspecialchars($parameter)));

	return $parameter;
}

?>