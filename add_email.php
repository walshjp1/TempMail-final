<?php

session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$email = $_REQUEST["e"];
$usr = $_SESSION["usrname"];

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "INSERT INTO emailaccount (Address, UserName) VALUES ('$email', '$usr');";

mysqli_query($conn, $sql);

$conn->close();

?>