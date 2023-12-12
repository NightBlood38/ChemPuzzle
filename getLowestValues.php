<?php
require 'config.php';
require 'db_conn.php';

try {
    $sql = 'SELECT username,best_time FROM users WHERE best_time IS NOT NULL ORDER BY best_time ASC LIMIT 5';

    $stmt = $conn->prepare($sql);

    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(['error' => true, 'message' => 'Database error']);
}


$conn = null;
?>
