<?php

$id = $_REQUEST["i"];
$flagged = $_REQUEST["f"];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if($flagged == "true")
	$sql = "UPDATE email SET Flagged = 0 WHERE ID = '$id';";
else
	$sql = "UPDATE email SET Flagged = 1 WHERE ID = '$id';";

if(mysqli_query($conn, $sql)) {
	echo "";
}
else {
	echo "Failed to insert into database";
}

$conn->close();

?>