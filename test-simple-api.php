<?php
header('Content-Type: application/json');

// 简单的API测试
echo json_encode([
    'success' => true,
    'message' => '测试成功',
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'input' => file_get_contents('php://input')
]);
?> 