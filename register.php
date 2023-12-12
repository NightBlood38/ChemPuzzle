<?php
require 'config.php';
require 'db_conn.php';

$stmt = $conn->query("SELECT * FROM users");
$users = $stmt->fetchAll();
$response = array('error' => false, 'message' => '');

// Check database connection
if (!$conn) {
    $response['error'] = true;
    $response['message'] = 'Adatbázis elérése sikertelen';
    echo json_encode($response);
    exit;
}

if (!isset($_POST['username'], $_POST['password'], $_POST['email']) || empty($_POST['username']) || empty($_POST['password']) || empty($_POST['email'])) {
    $response['error'] = true;
    $response['message'] = 'Mező(k) üres(ek)';
    echo json_encode($response);
    exit;
}

if ($stmt = $conn->prepare('SELECT id, password FROM users WHERE username = ?')) {
    $stmt->bindValue(1, $_POST['username']);
    $stmt->execute();
    $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($stmt->rowCount() > 0) {
        $response['error'] = true;
        $response['message'] = 'A felhasználónév már létezik';
        echo json_encode($response);
    } else {
        if ($stmt = $conn->prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)')) {
            $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
            $stmt->bindValue(1, $_POST['username']);
            $stmt->bindValue(2, $password);
            $stmt->bindValue(3, $_POST['email']);
            $stmt->execute();
            $response['error'] = false;
            $response['message'] = 'Sikeres regisztráció! Kérlek, jelentkezz be';
            echo json_encode($response);
            exit;
        } else {
            $response['error'] = true;
            $response['message'] = 'Hiba történt';
            echo json_encode($response);
            exit;
        }
    }

    $stmt->closeCursor();
}
?>
