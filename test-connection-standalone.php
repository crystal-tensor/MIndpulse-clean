<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => '只支持POST请求']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$apiKey = $input['apiKey'] ?? '';

if (!$apiKey) {
    echo json_encode(['success' => false, 'error' => '缺少API密钥']);
    exit;
}

try {
    $url = 'https://api.deepseek.com/chat/completions';
    $data = [
        'model' => 'deepseek-chat',
        'messages' => [['role' => 'user', 'content' => '测试']],
        'max_tokens' => 5
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo json_encode(['success' => true, 'message' => '连接成功']);
    } else {
        echo json_encode(['success' => false, 'error' => 'HTTP ' . $httpCode]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
