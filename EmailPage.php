<?php

$sender = $_REQUEST["s"];
$receiver = $_REQUEST['r'];
$month = idate("m");
$day = idate("d");
$hour = idate("H");
$minute = idate("i");
$second = idate("s");
if($month < 10) {
	$month = "0".$month;
}
if($day < 10) {
	$day = "0".$day;
}
if($hour < 10) {
	$hour = "0".$hour;
}
if($minute < 10) {
	$minute = "0".$minute;
}
if($second < 10) {
	$second = "0".$second;
}
$time = idate("Y"). "-". $month. "-". $day. " ". $hour. ":". $minute. ":". $second;
$subject = $_REQUEST['sub'];
$message = $_REQUEST['m'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "INSERT INTO email (Receiver, Sender, TimeSent, TimeRecieved, Viewed, Flagged, Subject, Content, ID) VALUES (?, ?, ?, ?, '0', '0', ?, ?, NULL);";


/* create a prepared statement */
if ($stmt = $conn->prepare($sql)) {

    /* bind parameters for markers */
    $stmt->bind_param("ssssss", $receiver, $sender, $time, $time, $subject, $message);

    /* execute query */
    $stmt->execute();

    /* close statement */
    $stmt->close();
}

$conn->close();

?>