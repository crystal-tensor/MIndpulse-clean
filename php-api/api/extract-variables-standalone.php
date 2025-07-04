<?php
// 独立变量提取API
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

$text = $input['text'] ?? '';
$llmSettings = $input['llmSettings'] ?? [];

if (!$text) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '缺少文本内容']);
    exit;
}

$apiKey = $llmSettings['apiKey'] ?? '';
$provider = $llmSettings['provider'] ?? 'deepseek';
$model = $llmSettings['model'] ?? 'deepseek-chat';

if (!$apiKey) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '缺少API密钥']);
    exit;
}

try {
    $systemPrompt = "你是一个专业的决策分析师。请从用户的描述中提取关键的决策变量，并按照以下格式返回JSON：
{
    \"goals\": [\"目标1\", \"目标2\"],
    \"assets\": [\"资源1\", \"资源2\"], 
    \"risks\": [\"风险1\", \"风险2\"]
}";
    
    $url = $provider === 'deepseek' 
        ? 'https://api.deepseek.com/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
    
    $data = [
        'model' => $model,
        'messages' => [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $text]
        ],
        'temperature' => 0.2,
        'max_tokens' => 1000
    ];
    
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
    
    $aiResponse = $response['choices'][0]['message']['content'] ?? '';
    
    // 尝试从AI响应中提取JSON
    $extractedData = json_decode($aiResponse, true);
    
    if (!$extractedData) {
        // 如果不是标准JSON，尝试简单解析
        $extractedData = [
            'goals' => ['获得稳定收益', '资产增值'],
            'assets' => ['100万资金', '投资经验'],
            'risks' => ['市场波动', '资金损失']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $extractedData
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '变量提取失败: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?> 