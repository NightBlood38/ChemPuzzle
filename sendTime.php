<?php
session_start();
require 'config.php';
require 'db_conn.php';

$bestTimeValue = $_POST['best_time'];
$selectSql = 'SELECT * FROM users WHERE username = :sessionUsername';
$select = $conn->prepare($selectSql);
$select->bindParam(':sessionUsername', $_SESSION['username']);
$select->execute();
$user = $select->fetch(PDO::FETCH_ASSOC);

if ($user['best_time'] > $bestTimeValue || !isset($user['best_time'])){
    $sql = 'UPDATE users SET best_time = :bestTime WHERE username = :sessionUsername';

    $update = $conn->prepare($sql);
    $update->bindParam(':bestTime', $bestTimeValue);
    $update->bindParam(':sessionUsername', $_SESSION['username']);
    $update->execute();
}

$conn = null;
?>
