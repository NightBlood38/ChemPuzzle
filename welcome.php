<?php
session_start();
require 'config.php';
require 'db_conn.php';

try {
    $sql = 'SELECT username FROM users WHERE username = :username';

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':username', $_SESSION['username']);

    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(['error' => true, 'message' => 'Database error']);
}

$conn = null;
?>
