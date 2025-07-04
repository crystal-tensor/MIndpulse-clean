<?php
// 健康检查
try {
    $db = new Database();
    $pdo = $db->connect();
    
    $dbStatus = $pdo ? 'connected' : 'disconnected';
    
    Response::success([
        'status' => 'ok',
        'timestamp' => date('c'),
        'database' => $dbStatus,
        'php_version' => phpversion(),
        'server' => 'PHP API Server'
    ]);
} catch (Exception $e) {
    Response::error('健康检查失败: ' . $e->getMessage());
}
?>
