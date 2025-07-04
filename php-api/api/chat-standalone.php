<?php
// 独立聊天API - 不依赖外部类
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => '只支持POST请求']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '无效的JSON数据']);
    exit;
}

$message = $input['message'] ?? '';
$apiKey = $input['apiKey'] ?? '';
$provider = $input['provider'] ?? 'deepseek';
$model = $input['model'] ?? 'deepseek-chat';
$temperature = $input['temperature'] ?? 0.7;
$baseUrl = $input['base_url'] ?? '';

if (!$message || !$apiKey) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '缺少必要参数：message 或 apiKey']);
    exit;
}

try {
    $url = '';
    $data = [
        'model' => $model,
        'messages' => [
            ['role' => 'user', 'content' => $message]
        ],
        'temperature' => $temperature,
        'max_tokens' => 2000
    ];
    
    switch ($provider) {
        case 'deepseek':
            $url = $baseUrl ?: 'https://api.deepseek.com/chat/completions';
            break;
        case 'openai':
            $url = $baseUrl ?: 'https://api.openai.com/v1/chat/completions';
            break;
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '暂不支持该AI提供商']);
            exit;
    }
    
    // 使用cURL发送请求
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("HTTP请求错误: " . $error);
    }
    
    if ($httpCode >= 400) {
        throw new Exception("HTTP错误: " . $httpCode . " - " . $result);
    }
    
    $response = json_decode($result, true);
    
    if (!$response) {
        throw new Exception("无效的API响应");
    }
    
    $aiResponse = $response['choices'][0]['message']['content'] ?? '抱歉，没有收到有效回复。';
    
    echo json_encode([
        'success' => true,
        'data' => [
            'response' => $aiResponse,
            'provider' => $provider,
            'model' => $model,
            'usage' => $response['usage'] ?? null
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '聊天请求失败: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?> 