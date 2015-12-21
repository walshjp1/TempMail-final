<?php

session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$usr = $_SESSION["usrname"];

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "SELECT UserName FROM accounts;";

$results = mysqli_query($conn, $sql);
$rows = mysqli_fetch_all($results, MYSQLI_ASSOC);

if($results) {
	echo json_encode($rows);
}
else {
	echo "Failed to get accounts from database";
}

$conn->close();

?>