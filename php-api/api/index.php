<?php
require_once '../config/database.php';
require_once '../utils/response.php';
require_once '../utils/http_client.php';

// 处理跨域预检请求
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0);
}

// 路由处理 - 支持多种URL格式
$endpoint = '';

// 方法1: 从URL路径解析
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// 移除 'api' 前缀，找到端点
$foundApi = false;
foreach ($pathParts as $part) {
    if ($foundApi) {
        $endpoint = $part;
        break;
    }
    if ($part === 'api') {
        $foundApi = true;
    }
}

// 方法2: 从查询参数获取
if (!$endpoint && isset($_GET['endpoint'])) {
    $endpoint = $_GET['endpoint'];
}

// 方法3: 从POST数据获取
if (!$endpoint && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($input['endpoint'])) {
        $endpoint = $input['endpoint'];
    }
}

// 路由分发
switch ($endpoint) {
    case 'health':
        include 'health.php';
        break;
    case 'chat':
        include 'chat.php';
        break;
    case 'test-connection':
        include 'test-connection.php';
        break;
    case 'extract-variables':
        include 'extract-variables.php';
        break;
    default:
        Response::error('API端点不存在: ' . $endpoint . ' (路径: ' . $path . ')', 404);
}
?>
