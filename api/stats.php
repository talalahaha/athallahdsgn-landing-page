<?php
/**
 * athallahDsgn — Dashboard Analytics & Stats API Endpoint
 */

require_once __DIR__ . '/../database/db.php';

$pdo = getDatabaseConnection();

try {
    // 1. Leads breakdown by status
    $stmt = $pdo->query("SELECT 
        COUNT(*) as total_leads,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_leads,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted_leads,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_leads,
        SUM(CASE WHEN status = 'closed_won' THEN 1 ELSE 0 END) as won_leads,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived_leads
    FROM consultations");
    $leadStats = $stmt->fetch();

    // 2. Newsletter subscribers count
    $subStmt = $pdo->query("SELECT COUNT(*) as total_subscribers FROM newsletter_subscribers");
    $subStats = $subStmt->fetch();

    // 3. Service demand distribution
    $serviceStmt = $pdo->query("SELECT service, COUNT(*) as count FROM consultations GROUP BY service ORDER BY count DESC");
    $serviceStats = $serviceStmt->fetchAll();

    // 4. Recent leads (latest 5)
    $recentStmt = $pdo->query("SELECT id, name, email, service, budget, status, created_at FROM consultations ORDER BY created_at DESC LIMIT 5");
    $recentLeads = $recentStmt->fetchAll();

    sendJsonResponse([
        'success' => true,
        'data' => [
            'metrics' => [
                'total_leads' => intval($leadStats['total_leads'] ?? 0),
                'pending_leads' => intval($leadStats['pending_leads'] ?? 0),
                'contacted_leads' => intval($leadStats['contacted_leads'] ?? 0),
                'in_progress_leads' => intval($leadStats['in_progress_leads'] ?? 0),
                'won_leads' => intval($leadStats['won_leads'] ?? 0),
                'archived_leads' => intval($leadStats['archived_leads'] ?? 0),
                'total_subscribers' => intval($subStats['total_subscribers'] ?? 0)
            ],
            'service_distribution' => $serviceStats,
            'recent_leads' => $recentLeads
        ]
    ]);
} catch (PDOException $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Gagal memuat statistik: ' . $e->getMessage()
    ], 500);
}
