#!/bin/bash

# 创建PHP版本的API服务
echo "🚀 创建PHP版本的MindPulse API服务..."

# 创建PHP API目录
rm -rf php-api
mkdir -p php-api/{api,config,utils}

# 数据库配置
cat > php-api/config/database.php << 'EOF'
<?php
// 数据库配置
class Database {
    private $host = 'gdm643972455.my3w.com';
    private $db_name = 'gdm643972455_db';
    private $username = 'gdm643972455';
    private $password = '6012.QuPunkmysql';
    private $pdo;

    public function connect() {
        $this->pdo = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8";
            $this->pdo = new PDO($dsn, $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            error_log("连接错误: " . $e->getMessage());
        }
        
        return $this->pdo;
    }
}
?>
EOF

# 工具类
cat > php-api/utils/response.php << 'EOF'
<?php
// 响应工具类
class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit(0);
        }
        
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    public static function error($message, $status = 500) {
        self::json([
            'success' => false,
            'error' => $message
        ], $status);
    }
    
    public static function success($data) {
        self::json([
            'success' => true,
            'data' => $data
        ]);
    }
}
?>
EOF

# HTTP客户端
cat > php-api/utils/http_client.php << 'EOF'
<?php
// HTTP请求客户端
class HttpClient {
    public static function post($url, $data, $headers = []) {
        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge([
            'Content-Type: application/json'
        ], $headers));
        
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            throw new Exception("HTTP请求错误: " . $error);
        }
        
        if ($httpCode >= 400) {
            throw new Exception("HTTP错误: " . $httpCode);
        }
        
        return json_decode($result, true);
    }
}
?>
EOF

# 主API入口文件
cat > php-api/api/index.php << 'EOF'
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

// 路由处理
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// 移除 'api' 前缀
if ($pathParts[0] === 'api') {
    array_shift($pathParts);
}

$endpoint = $pathParts[0] ?? '';

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
        Response::error('API端点不存在', 404);
}
?>
EOF

# 健康检查API
cat > php-api/api/health.php << 'EOF'
<?php
// 健康检查
try {
    $db = new Database();
    $pdo = $db->connect();
    
    $dbStatus = $pdo ? 'connected' : 'disconnected';
    
    Response::success([
        'status' => 'ok',
        'timestamp' => date('c'),
        'database' => $dbStatus,
        'php_version' => phpversion(),
        'server' => 'PHP API Server'
    ]);
} catch (Exception $e) {
    Response::error('健康检查失败: ' . $e->getMessage());
}
?>
EOF

# 聊天API
cat > php-api/api/chat.php << 'EOF'
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
EOF

# 连接测试API
cat > php-api/api/test-connection.php << 'EOF'
<?php
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
EOF

# 变量提取API
cat > php-api/api/extract-variables.php << 'EOF'
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
EOF

# .htaccess文件用于路由
cat > php-api/.htaccess << 'EOF'
RewriteEngine On

# 处理CORS预检请求
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ api/index.php [L]

# API路由
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ api/index.php [L,QSA]
EOF

# 数据库初始化脚本
cat > php-api/init-database.php << 'EOF'
<?php
require_once 'config/database.php';

echo "🗄️ 初始化数据库...\n";

try {
    $db = new Database();
    $pdo = $db->connect();
    
    if (!$pdo) {
        throw new Exception("数据库连接失败");
    }
    
    echo "✅ 数据库连接成功\n";
    
    // 创建用户表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    
    // 创建对话表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS conversations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            session_id VARCHAR(100) NOT NULL,
            conversation_data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
    
    // 创建决策变量表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS decision_variables (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(100) NOT NULL,
            variable_type ENUM('goals', 'assets', 'risks', 'extraction') NOT NULL,
            variable_data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_session_id (session_id)
        )
    ");
    
    // 创建用户设置表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            setting_key VARCHAR(100) NOT NULL,
            setting_value TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_setting (user_id, setting_key)
        )
    ");
    
    echo "✅ 数据库表创建成功\n";
    echo "🎉 数据库初始化完成！\n";
    
} catch (Exception $e) {
    echo "❌ 数据库初始化失败: " . $e->getMessage() . "\n";
    exit(1);
}
?>
EOF

# 创建部署包
echo "📦 创建PHP API部署包..."
tar -czf mindpulse-php-api.tar.gz php-api/

echo "✅ PHP API服务创建完成！"
echo ""
echo "📦 部署包: mindpulse-php-api.tar.gz"
echo ""
echo "📋 部署步骤："
echo "1. 上传 mindpulse-php-api.tar.gz 到服务器"
echo "2. 解压到 /htdocs/api/ 目录"
echo "3. 访问 http://8.219.57.204/api/health 测试"
echo ""
echo "🌐 API端点："
echo "- 健康检查: http://8.219.57.204/api/health"
echo "- 聊天: http://8.219.57.204/api/chat"
echo "- 测试连接: http://8.219.57.204/api/test-connection"
echo "- 变量提取: http://8.219.57.204/api/extract-variables" 