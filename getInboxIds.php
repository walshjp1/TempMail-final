<?php

$email = $_REQUEST["e"];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "SELECT * FROM email WHERE Receiver = '$email';";
$results = mysqli_query($conn, $sql);
$rows = mysqli_fetch_all($results, MYSQLI_ASSOC);


if($results) {
	echo json_encode($rows);
}
else {
	echo "Failed to get inbox from database";
}

$conn->close();

?>