<?php

session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tempmail";

$email = $_REQUEST["e"];

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "DELETE FROM emailaccount WHERE Address = '$email';";

mysqli_query($conn, $sql);

$conn->close();

?>