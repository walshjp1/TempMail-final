<?php

session_start();

$usr = $_POST['usr'];
$pwd = $_POST['pwd'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "SELECT * FROM accounts WHERE (UserName = '$usr' AND Password = AES_ENCRYPT('$pwd', 'wolfe'));";

$results = mysqli_query($conn, $sql);
$row = mysqli_fetch_row($results);

if($results->num_rows === 0) {
	echo "No account found. Please create an account or use the correct credentials.";
}
else if($results->num_rows === 1) {
	if($row[4] == 0) {
		$_SESSION["usrname"] = $row[0];
		header("LOCATION: email_selector.html");
	}
	else {
		$_SESSION["usrname"] = $row[0];
		header("LOCATION: admin.html");
	}
}

$conn->close();

?>