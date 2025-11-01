<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image'])) {
        $uploadDir = '../uploads/';
        $uploadFile = $uploadDir . basename($_FILES['image']['name']);

        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $imageUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/mibodaideal/uploads/' . basename($_FILES['image']['name']);
            echo json_encode(['imageUrl' => $imageUrl]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al mover el archivo subido.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No se recibió ningún archivo.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
}
?>