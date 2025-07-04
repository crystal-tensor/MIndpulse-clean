<?php
// API代理文件 - 将旧的API路径转发到新的PHP API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// 获取请求路径
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// API端点映射
$apiMapping = [
    '/api/mindpilot/test-connection' => 'test-connection-standalone.php',
    '/api/mindpilot/chat' => 'chat-standalone.php',
    '/api/mindpilot/extract-variables' => 'extract-variables-standalone.php',
    '/api/mindpilot/quantum-solve' => 'chat-standalone.php', // 暂时使用聊天API
    '/api/mindpilot/health' => 'health-simple.php'
];

// 检查是否是已知的API端点
$targetScript = null;
foreach ($apiMapping as $oldPath => $newScript) {
    if (strpos($path, $oldPath) !== false) {
        $targetScript = $newScript;
        break;
    }
}

if (!$targetScript) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'API端点不存在: ' . $path]);
    exit;
}

// 获取请求数据
$input = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
}

// 对于quantum-solve，转换为聊天格式
if (strpos($path, 'quantum-solve') !== false) {
    $goals = $input['goals'] ?? [];
    $assets = $input['assets'] ?? [];
    $risks = $input['risks'] ?? [];
    $llmSettings = $input['llmSettings'] ?? [];
    
    $prompt = "基于以下信息进行量子决策分析：\n";
    $prompt .= "目标：" . implode(', ', $goals) . "\n";
    $prompt .= "资源：" . implode(', ', $assets) . "\n";
    $prompt .= "风险：" . implode(', ', $risks) . "\n";
    $prompt .= "请提供详细的决策建议和分析。";
    
    $input = [
        'message' => $prompt,
        'apiKey' => $llmSettings['apiKey'] ?? '',
        'provider' => $llmSettings['provider'] ?? 'deepseek',
        'model' => $llmSettings['model'] ?? 'deepseek-chat'
    ];
}

// 转发请求到对应的API文件
$apiUrl = 'http://wavefunction.top/api/api/' . $targetScript;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, $_SERVER['REQUEST_METHOD'] === 'POST');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));
}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'API转发失败: ' . $error]);
    exit;
}

http_response_code($httpCode);
echo $result;
?> 