<?php
// 聊天API
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('只支持POST请求', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    Response::error('无效的JSON数据', 400);
}

$message = $input['message'] ?? '';
$apiKey = $input['apiKey'] ?? '';
$provider = $input['provider'] ?? 'deepseek';
$model = $input['model'] ?? 'deepseek-chat';
$temperature = $input['temperature'] ?? 0.7;
$baseUrl = $input['base_url'] ?? '';

if (!$message || !$apiKey) {
    Response::error('缺少必要参数：message 或 apiKey', 400);
}

try {
    $response = '';
    
    switch ($provider) {
        case 'deepseek':
            $url = $baseUrl ?: 'https://api.deepseek.com/chat/completions';
            $response = HttpClient::post($url, [
                'model' => $model,
                'messages' => [
                    ['role' => 'user', 'content' => $message]
                ],
                'temperature' => $temperature,
                'max_tokens' => 2000
            ], [
                'Authorization: Bearer ' . $apiKey
            ]);
            $result = $response['choices'][0]['message']['content'] ?? '抱歉，没有收到有效回复。';
            break;
            
        case 'openai':
            $url = $baseUrl ?: 'https://api.openai.com/v1/chat/completions';
            $response = HttpClient::post($url, [
                'model' => $model,
                'messages' => [
                    ['role' => 'user', 'content' => $message]
                ],
                'temperature' => $temperature,
                'max_tokens' => 2000
            ], [
                'Authorization: Bearer ' . $apiKey
            ]);
            $result = $response['choices'][0]['message']['content'] ?? '抱歉，没有收到有效回复。';
            break;
            
        default:
            $result = '暂不支持该AI提供商';
    }
    
    Response::success(['response' => $result]);
    
} catch (Exception $e) {
    Response::error('聊天请求失败: ' . $e->getMessage());
}
?>
