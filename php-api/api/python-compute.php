<?php
// Python计算API - 调用服务器上的Python脚本
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

$script = $input['script'] ?? '';
$params = $input['params'] ?? [];

// 可用的Python脚本
$availableScripts = [
    'portfolio_optimization' => 'Portfolio-Optimization.py',
    'var_calculation' => 'VaR_values.py',
    'option_pricing' => 'European_call_option_pricing.py',
    'stock_info' => 'Get_Stock_Info.py',
    'garch_model' => 'garch.py',
    'portfolio_random' => 'Portfolio_TrueRandom.py'
];

if (!$script || !isset($availableScripts[$script])) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'error' => '无效的脚本名称',
        'available_scripts' => array_keys($availableScripts)
    ]);
    exit;
}

try {
    $pythonScript = $availableScripts[$script];
    $pythonPath = '/home/myfolder/' . $pythonScript;
    
    // 构建Python命令
    $command = "python3 $pythonPath";
    
    // 如果有参数，通过环境变量传递
    if (!empty($params)) {
        $paramsJson = json_encode($params);
        $command = "PARAMS=" . escapeshellarg($paramsJson) . " $command";
    }
    
    // 执行Python脚本
    $output = shell_exec($command . ' 2>&1');
    
    if ($output === null) {
        throw new Exception('Python脚本执行失败');
    }
    
    // 尝试解析JSON输出
    $result = json_decode($output, true);
    
    if (json_last_error() === JSON_ERROR_NONE) {
        echo json_encode([
            'success' => true,
            'data' => $result,
            'script' => $script
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => [
                'output' => $output,
                'raw' => true
            ],
            'script' => $script
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Python计算失败: ' . $e->getMessage()
    ]);
}
?> 