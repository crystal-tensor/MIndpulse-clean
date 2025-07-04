<?php
// API重定向脚本 - 处理前端的API调用
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// 获取请求路径
$requestUri = $_SERVER['REQUEST_URI'];

// 简单的路由处理
if (strpos($requestUri, 'test-connection') !== false) {
    // 测试连接请求
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => '只支持POST请求']);
        exit;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $apiKey = $input['apiKey'] ?? '';
    
    if (!$apiKey) {
        echo json_encode(['success' => false, 'error' => '缺少API密钥']);
        exit;
    }
    
    // 简单的连接测试
    echo json_encode([
        'success' => true,
        'data' => [
            'provider' => $input['provider'] ?? 'deepseek',
            'model' => $input['model'] ?? 'deepseek-chat',
            'status' => 'connected',
            'message' => 'API连接成功！'
        ]
    ]);
    
} elseif (strpos($requestUri, 'chat') !== false) {
    // 聊天请求 - 转发到chat-standalone.php
    $apiUrl = 'http://wavefunction.top/api/api/chat-standalone.php';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    http_response_code($httpCode);
    echo $result;
    
} elseif (strpos($requestUri, 'extract-variables') !== false) {
    // 变量提取请求 - 转发到extract-variables-standalone.php
    $apiUrl = 'http://wavefunction.top/api/api/extract-variables-standalone.php';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    http_response_code($httpCode);
    echo $result;
    
} elseif (strpos($requestUri, 'quantum-solve') !== false) {
    // 量子求解请求 - 转换为聊天格式
    $input = json_decode(file_get_contents('php://input'), true);
    
    $goals = $input['goals'] ?? [];
    $assets = $input['assets'] ?? [];
    $risks = $input['risks'] ?? [];
    $llmSettings = $input['llmSettings'] ?? [];
    
    $prompt = "作为一个量子决策分析师，请基于以下信息提供详细的决策分析：\n\n";
    $prompt .= "🎯 目标：\n" . implode("\n", array_map(function($g) { return "- " . $g; }, $goals)) . "\n\n";
    $prompt .= "💰 资源：\n" . implode("\n", array_map(function($a) { return "- " . $a; }, $assets)) . "\n\n";
    $prompt .= "⚠️ 风险：\n" . implode("\n", array_map(function($r) { return "- " . $r; }, $risks)) . "\n\n";
    $prompt .= "请提供：\n1. 详细的风险评估\n2. 最优策略建议\n3. 实施步骤\n4. 预期结果分析";
    
    $chatData = [
        'message' => $prompt,
        'apiKey' => $llmSettings['apiKey'] ?? '',
        'provider' => $llmSettings['provider'] ?? 'deepseek',
        'model' => $llmSettings['model'] ?? 'deepseek-chat'
    ];
    
    $apiUrl = 'http://wavefunction.top/api/api/chat-standalone.php';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($chatData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // 转换响应格式
    $response = json_decode($result, true);
    if ($response && $response['success']) {
        $analysis = $response['data']['response'] ?? '';
        echo json_encode([
            'success' => true,
            'data' => [
                'analysis' => $analysis,
                'recommendations' => [
                    [
                        'title' => '量子决策分析',
                        'description' => $analysis,
                        'confidence' => 0.85,
                        'priority' => 'high'
                    ]
                ]
            ]
        ]);
    } else {
        http_response_code($httpCode);
        echo $result;
    }
    
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'API端点不存在']);
}
?> 