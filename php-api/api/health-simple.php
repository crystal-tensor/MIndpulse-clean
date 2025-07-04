<?php
// 简单健康检查 - 不依赖数据库
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

echo json_encode([
    'success' => true,
    'data' => [
        'status' => 'ok',
        'timestamp' => date('c'),
        'php_version' => phpversion(),
        'server' => 'MindPulse PHP API Server',
        'curl_available' => function_exists('curl_init'),
        'json_available' => function_exists('json_encode'),
        'python_support' => 'available'
    ]
], JSON_UNESCAPED_UNICODE);
?> 