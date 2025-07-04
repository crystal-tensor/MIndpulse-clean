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
