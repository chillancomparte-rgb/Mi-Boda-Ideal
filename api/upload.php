<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-control-allow-headers: Content-Type, X-Requested-With"); // Añadir X-Requested-With para algunas peticiones AJAX

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image'])) {
        $file = $_FILES['image'];

        // 1. Validar errores de subida
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'Error en la subida del archivo: ' . $file['error']]);
            exit();
        }

        // 2. Validar tipo de archivo (solo imágenes)
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, GIF, WEBP.']);
            exit();
        }

        // 3. Validar tamaño de archivo (ej. 5MB)
        $maxFileSize = 5 * 1024 * 1024; // 5 MB
        if ($file['size'] > $maxFileSize) {
            http_response_code(400);
            echo json_encode(['error' => 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.']);
            exit();
        }

        // 4. Crear subdirectorios por año/mes
        $year = date('Y');
        $month = date('m');
        $baseUploadDir = '../uploads/';
        $targetDir = $baseUploadDir . $year . '/' . $month . '/';

        if (!is_dir($targetDir)) {
            if (!mkdir($targetDir, 0777, true)) { // 0777 para permisos completos, true para recursivo
                http_response_code(500);
                echo json_encode(['error' => 'Error al crear el directorio de subida.']);
                exit();
            }
        }

        // 5. Generar nombre de archivo único
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $uniqueFileName = uniqid() . '_' . time() . '.' . $fileExtension;
        $uploadFile = $targetDir . $uniqueFileName;

        if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'];
            // La URL debe reflejar la estructura de subdirectorios
            $path = '/uploads/' . $year . '/' . $month . '/' . $uniqueFileName;
            $imageUrl = $protocol . '://' . $host . $path;
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