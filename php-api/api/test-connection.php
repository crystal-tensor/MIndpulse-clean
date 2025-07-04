<?php
// 包含依赖
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../utils/http_client.php';

// 连接测试API
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('只支持POST请求', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    Response::error('无效的JSON数据', 400);
}

$apiKey = $input['apiKey'] ?? '';
$provider = $input['provider'] ?? 'deepseek';
$model = $input['model'] ?? 'deepseek-chat';
$baseUrl = $input['baseUrl'] ?? '';

if (!$apiKey) {
    Response::error('缺少API密钥', 400);
}

try {
    $url = '';
    $testData = [
        'model' => $model,
        'messages' => [
            ['role' => 'user', 'content' => '测试连接，请回复"连接成功"']
        ],
        'max_tokens' => 10,
        'temperature' => 0.1
    ];
    
    switch ($provider) {
        case 'deepseek':
            $url = $baseUrl ?: 'https://api.deepseek.com/chat/completions';
            break;
        case 'openai':
            $url = $baseUrl ?: 'https://api.openai.com/v1/chat/completions';
            break;
        default:
            Response::error('不支持的AI提供商', 400);
    }
    
    $response = HttpClient::post($url, $testData, [
        'Authorization: Bearer ' . $apiKey
    ]);
    
    Response::success([
        'provider' => $provider,
        'model' => $model,
        'response' => $response['choices'][0]['message']['content'] ?? '测试成功',
        'usage' => $response['usage'] ?? null
    ]);
    
} catch (Exception $e) {
    Response::error('连接测试失败: ' . $e->getMessage());
}
?>
