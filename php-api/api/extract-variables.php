<?php
// 变量提取API
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('只支持POST请求', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    Response::error('无效的JSON数据', 400);
}

$text = $input['text'] ?? '';
$phase = $input['phase'] ?? 1;
$sessionId = $input['sessionId'] ?? '';
$llmSettings = $input['llmSettings'] ?? [];

if (!$text) {
    Response::error('缺少文本内容', 400);
}

try {
    $apiKey = $llmSettings['apiKey'] ?? '';
    $provider = $llmSettings['provider'] ?? 'deepseek';
    $model = $llmSettings['model'] ?? 'deepseek-chat';
    
    if (!$apiKey) {
        Response::error('缺少API密钥', 400);
    }
    
    $systemPrompt = "你是一个专业的决策分析师。请从用户的描述中提取关键的决策变量，并按照以下格式返回JSON：
{
    \"goals\": [\"目标1\", \"目标2\"],
    \"assets\": [\"资源1\", \"资源2\"], 
    \"risks\": [\"风险1\", \"风险2\"]
}";
    
    $url = $provider === 'deepseek' 
        ? 'https://api.deepseek.com/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
        
    $response = HttpClient::post($url, [
        'model' => $model,
        'messages' => [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $text]
        ],
        'temperature' => 0.2,
        'response_format' => ['type' => 'json_object']
    ], [
        'Authorization: Bearer ' . $apiKey
    ]);
    
    $result = json_decode($response['choices'][0]['message']['content'], true);
    
    // 保存到数据库（如果有sessionId）
    if ($sessionId) {
        $db = new Database();
        $pdo = $db->connect();
        
        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO decision_variables (session_id, variable_type, variable_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE variable_data = VALUES(variable_data)");
            $stmt->execute([$sessionId, 'extraction', json_encode($result)]);
        }
    }
    
    Response::success($result);
    
} catch (Exception $e) {
    Response::error('变量提取失败: ' . $e->getMessage());
}
?>
