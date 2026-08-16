<?php
/**
 * athallahDsgn — Newsletter Subscribers API Endpoint
 */

require_once __DIR__ . '/../database/db.php';

$pdo = getDatabaseConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// 1. GET: Fetch all subscribers
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC");
    $subscribers = $stmt->fetchAll();

    sendJsonResponse([
        'success' => true,
        'count' => count($subscribers),
        'data' => $subscribers
    ]);
}

// 2. POST: Subscribe a new email
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!$input) {
        $input = $_POST;
    }

    $email = isset($input['email']) ? trim(filter_var($input['email'], FILTER_SANITIZE_EMAIL)) : '';

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Alamat email tidak valid.'
        ], 400);
    }

    try {
        $checkStmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = :email");
        $checkStmt->execute([':email' => $email]);
        if ($checkStmt->fetch()) {
            sendJsonResponse([
                'success' => true,
                'message' => 'Email Anda sudah terdaftar di newsletter athallahDsgn.'
            ]);
        }

        $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email) VALUES (:email)");
        $stmt->execute([':email' => $email]);

        sendJsonResponse([
            'success' => true,
            'message' => 'Terima kasih telah berlangganan newsletter wawasan desain athallahDsgn!'
        ], 201);
    } catch (PDOException $e) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Gagal mendaftarkan email: ' . $e->getMessage()
        ], 500);
    }
}

// 3. DELETE: Remove subscriber
if ($method === 'DELETE') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    $id = isset($input['id']) ? intval($input['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);

    if ($id <= 0) {
        sendJsonResponse(['success' => false, 'message' => 'ID subscriber tidak valid.'], 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM newsletter_subscribers WHERE id = :id");
        $stmt->execute([':id' => $id]);
        sendJsonResponse(['success' => true, 'message' => 'Subscriber berhasil dihapus.']);
    } catch (PDOException $e) {
        sendJsonResponse(['success' => false, 'message' => 'Gagal: ' . $e->getMessage()], 500);
    }
}

sendJsonResponse(['success' => false, 'message' => 'Metode HTTP tidak didukung'], 405);
