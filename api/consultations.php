<?php
/**
 * athallahDsgn — Consultation Leads API Endpoint
 * Handles CRUD operations for consultation leads
 */

require_once __DIR__ . '/../database/db.php';

$pdo = getDatabaseConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// 1. GET: Fetch all consultations with optional search & filter
if ($method === 'GET') {
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $service = isset($_GET['service']) ? trim($_GET['service']) : '';

    $query = "SELECT * FROM consultations WHERE 1=1";
    $params = [];

    if (!empty($status) && $status !== 'all') {
        $query .= " AND status = :status";
        $params[':status'] = $status;
    }

    if (!empty($service) && $service !== 'all') {
        $query .= " AND service LIKE :service";
        $params[':service'] = "%$service%";
    }

    if (!empty($search)) {
        $query .= " AND (name LIKE :search OR email LIKE :search OR message LIKE :search)";
        $params[':search'] = "%$search%";
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $leads = $stmt->fetchAll();

    sendJsonResponse([
        'success' => true,
        'count' => count($leads),
        'data' => $leads
    ]);
}

// 2. POST: Submit a new consultation lead from landing page
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!$input) {
        $input = $_POST;
    }

    $name = isset($input['name']) ? trim(htmlspecialchars($input['name'])) : '';
    $email = isset($input['email']) ? trim(filter_var($input['email'], FILTER_SANITIZE_EMAIL)) : '';
    $service = isset($input['service']) ? trim(htmlspecialchars($input['service'])) : 'Full Product Design';
    $budget = isset($input['budget']) ? trim(htmlspecialchars($input['budget'])) : '15-30jt';
    $message = isset($input['message']) ? trim(htmlspecialchars($input['message'])) : '';

    // Validation
    if (empty($name) || empty($email) || empty($message)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Harap isi semua kolom wajib (Nama, Email, dan Pesan).'
        ], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Format email tidak valid.'
        ], 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO consultations (name, email, service, budget, message, status) VALUES (:name, :email, :service, :budget, :message, 'pending')");
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':service' => $service,
            ':budget' => $budget,
            ':message' => $message
        ]);

        $leadId = $pdo->lastInsertId();

        sendJsonResponse([
            'success' => true,
            'message' => 'Permintaan konsultasi Anda berhasil disimpan! Tim athallahDsgn akan segera menghubungi Anda.',
            'lead_id' => $leadId
        ], 201);
    } catch (PDOException $e) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Gagal menyimpan data: ' . $e->getMessage()
        ], 500);
    }
}

// 3. PATCH / PUT: Update status or notes of a lead
if ($method === 'PATCH' || $method === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    $id = isset($input['id']) ? intval($input['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
    $status = isset($input['status']) ? trim($input['status']) : '';
    $notes = isset($input['notes']) ? trim($input['notes']) : null;

    if ($id <= 0) {
        sendJsonResponse([
            'success' => false,
            'message' => 'ID prospek tidak valid.'
        ], 400);
    }

    $allowedStatuses = ['pending', 'contacted', 'in_progress', 'closed_won', 'archived'];
    if (!empty($status) && !in_array($status, $allowedStatuses)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Status tidak dikenali.'
        ], 400);
    }

    try {
        if ($notes !== null && !empty($status)) {
            $stmt = $pdo->prepare("UPDATE consultations SET status = :status, notes = :notes, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
            $stmt->execute([':status' => $status, ':notes' => $notes, ':id' => $id]);
        } elseif (!empty($status)) {
            $stmt = $pdo->prepare("UPDATE consultations SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);
        } elseif ($notes !== null) {
            $stmt = $pdo->prepare("UPDATE consultations SET notes = :notes, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
            $stmt->execute([':notes' => $notes, ':id' => $id]);
        }

        sendJsonResponse([
            'success' => true,
            'message' => 'Status prospek berhasil diperbarui.'
        ]);
    } catch (PDOException $e) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Gagal memperbarui: ' . $e->getMessage()
        ], 500);
    }
}

// 4. DELETE: Remove a lead
if ($method === 'DELETE') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    $id = isset($input['id']) ? intval($input['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);

    if ($id <= 0) {
        sendJsonResponse([
            'success' => false,
            'message' => 'ID prospek tidak valid.'
        ], 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM consultations WHERE id = :id");
        $stmt->execute([':id' => $id]);

        sendJsonResponse([
            'success' => true,
            'message' => 'Data prospek berhasil dihapus.'
        ]);
    } catch (PDOException $e) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Gagal menghapus data: ' . $e->getMessage()
        ], 500);
    }
}

sendJsonResponse(['success' => false, 'message' => 'Metode HTTP tidak didukung'], 405);
