<?php

session_start();

$usr = $_POST['usr'];
$email = $_POST['email'];
$pwd = $_POST['pwd'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "INSERT INTO accounts (UserName, RecoveryEmail, Password, Theme, Admin) VALUES ('$usr', '$email', AES_ENCRYPT('$pwd', 'wolfe'), 0, 0);";

if(mysqli_query($conn, $sql)) {
	$_SESSION["usrname"] = $usr;
	include 'email_selector.html';
}

$conn->close();

?>