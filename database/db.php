<?php
/**
 * athallahDsgn — Database Connection & Initializer
 * SQLite3 via PHP PDO
 */

function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Handle CORS Preflight OPTIONS requests
if ($requestMethod === 'OPTIONS') {
    if (!headers_sent()) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
    http_response_code(200);
    exit;
}

function getDatabaseConnection() {
    $dbDir = __DIR__;
    if (!is_dir($dbDir)) {
        mkdir($dbDir, 0777, true);
    }

    $dbFile = $dbDir . DIRECTORY_SEPARATOR . 'athallahdsgn.sqlite';
    $isNewDb = !file_exists($dbFile);

    try {
        $pdo = new PDO("sqlite:" . $dbFile);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        initializeSchema($pdo, $isNewDb);

        return $pdo;
    } catch (PDOException $e) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Database connection failed: ' . $e->getMessage()
        ], 500);
    }
}

function initializeSchema($pdo, $isNewDb = false) {
    // 1. Table: consultations (Leads)
    $pdo->exec("CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        service TEXT NOT NULL,
        budget TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. Table: newsletter_subscribers
    $pdo->exec("CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Insert sample initial data if empty
    $checkStmt = $pdo->query("SELECT COUNT(*) as total FROM consultations");
    $row = $checkStmt->fetch();
    if ($row['total'] == 0) {
        $sampleLeads = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@finovate.id',
                'service' => 'Full Product Design',
                'budget' => '30-60jt',
                'message' => 'Kami sedang membangun aplikasi fintech B2B dan memerlukan redesain UI/UX serta design system lengkap untuk platform mobile dan web kami.',
                'status' => 'contacted',
                'created_at' => date('Y-m-d H:i:s', strtotime('-3 days'))
            ],
            [
                'name' => 'Clarissa Tan',
                'email' => 'clarissa@auraluxe.co',
                'service' => 'Design Sprint',
                'budget' => '15-30jt',
                'message' => 'Ingin melakukan audit UX dan redesain alur checkout untuk platform e-commerce mode kami guna meningkatkan konversi transaksi.',
                'status' => 'pending',
                'created_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
            ],
            [
                'name' => 'Reza Pratama',
                'email' => 'reza@cloudscale.io',
                'service' => 'Dedicated Retainer',
                'budget' => '>60jt',
                'message' => 'Mencari tim desain partner bulanan untuk mendampingi pengembangan dashboard analytics cloud kami selama 6 bulan ke depan.',
                'status' => 'in_progress',
                'created_at' => date('Y-m-d H:i:s', strtotime('-5 days'))
            ]
        ];

        $insertStmt = $pdo->prepare("INSERT INTO consultations (name, email, service, budget, message, status, created_at) VALUES (:name, :email, :service, :budget, :message, :status, :created_at)");
        foreach ($sampleLeads as $lead) {
            $insertStmt->execute($lead);
        }

        $subscribers = ['alex@startup.id', 'dina@productdesign.com', 'kevin@techhub.id'];
        $subStmt = $pdo->prepare("INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (:email)");
        foreach ($subscribers as $subEmail) {
            $subStmt->execute([':email' => $subEmail]);
        }
    }
}
