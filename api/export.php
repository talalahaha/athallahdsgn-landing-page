<?php
/**
 * athallahDsgn — Export Leads to CSV
 */

require_once __DIR__ . '/../database/db.php';

$pdo = getDatabaseConnection();

try {
    $stmt = $pdo->query("SELECT id, name, email, service, budget, message, status, notes, created_at FROM consultations ORDER BY created_at DESC");
    $leads = $stmt->fetchAll();

    $filename = "athallahdsgn_leads_" . date('Y-m-d_His') . ".csv";

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $output = fopen('php://output', 'w');

    // Output UTF-8 BOM for Excel compatibility
    fputs($output, "\xEF\xBB\xBF");

    // Header row
    fputcsv($output, ['ID', 'Nama Klien', 'Email', 'Layanan', 'Estimasi Budget', 'Pesan / Kebutuhan', 'Status', 'Catatan Admin', 'Tanggal Masuk']);

    foreach ($leads as $lead) {
        fputcsv($output, [
            $lead['id'],
            $lead['name'],
            $lead['email'],
            $lead['service'],
            $lead['budget'],
            $lead['message'],
            $lead['status'],
            $lead['notes'] ?? '',
            $lead['created_at']
        ]);
    }

    fclose($output);
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    echo "Error exporting data: " . $e->getMessage();
    exit;
}
