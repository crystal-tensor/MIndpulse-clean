<?php
// PHP环境测试文件
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$tests = [];

// 测试PHP版本
$tests['php_version'] = phpversion();

// 测试必需的函数
$tests['curl_available'] = function_exists('curl_init');
$tests['json_available'] = function_exists('json_encode');
$tests['pdo_available'] = class_exists('PDO');

// 测试MySQL连接
try {
    $dsn = "mysql:host=gdm643972455.my3w.com;dbname=gdm643972455_db;charset=utf8";
    $pdo = new PDO($dsn, 'gdm643972455', '6012.QuPunkmysql');
    $tests['database_connection'] = 'success';
} catch(Exception $e) {
    $tests['database_connection'] = 'failed: ' . $e->getMessage();
}

// 测试错误日志
$tests['error_log_enabled'] = ini_get('log_errors') ? 'enabled' : 'disabled';

// 测试文件上传
$tests['file_uploads'] = ini_get('file_uploads') ? 'enabled' : 'disabled';

// 测试输出缓冲
$tests['output_buffering'] = ini_get('output_buffering') ? 'enabled' : 'disabled';

// 测试fsockopen
$tests['fsockopen_available'] = function_exists('fsockopen');

echo json_encode([
    'status' => 'ok',
    'timestamp' => date('c'),
    'tests' => $tests
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?> 