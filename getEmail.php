<?php

$id = $_REQUEST["i"];
$isInbox = $_REQUEST["b"];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "SELECT * FROM email WHERE ID = '$id';";
if($isInbox == "true") {
  $sql2 = "UPDATE email SET Viewed = 1 WHERE ID = '$id';";
}
else $sql2 = "UPDATE email SET Viewed = Viewed WHERE ID = '$id';";

mysqli_query($conn, $sql2);
$results = mysqli_query($conn, $sql);
$rows = mysqli_fetch_all($results, MYSQLI_ASSOC);


if($results) {
	echo json_encode($rows);
}
else {
	echo "Failed to get email from database";
}

$conn->close();

?>