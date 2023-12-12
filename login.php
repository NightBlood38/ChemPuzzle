<?php
session_start();
require 'config.php';
require 'db_conn.php';

$response = array('error' => false, 'message' => '');

$username = $_POST['username'];
$password = $_POST['password'];


if (empty($username) || empty($password)) {
    $response['error'] = true;
    $response['message'] = 'Fields cannot be empty';
    echo json_encode($response);
    exit;
}

try {
    $stmt = $conn->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user){
        $user_password = $user['password'];
        $_SESSION['username'] = $user['username'];

        if (password_verify($password, $user_password)) {
        } else {
            $response['error'] = true;
            $response['message'] = 'Hibás felhasználónév vagy jelszó';
        }
    } else {
        $response['error'] = true;
        $response['message'] = 'Sikertelen belépés';
    }
} catch (Exception $e) {
    $response['error'] = true;
    $response['message'] = 'Adatbázis hiba';
}

echo json_encode($response);
$stmt = null;
?>
