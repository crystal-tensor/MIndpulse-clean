#!/bin/bash

# 完整的MindPulse服务器部署脚本
# 包含前端静态文件 + Node.js API服务 + MySQL数据库

echo "🚀 开始完整服务器部署..."

# 服务器信息
FTP_HOST="8.219.57.204"
FTP_USER="wh-ng5i6t4sqnqpocplcca"
FTP_PASS="6012.QuPunkftp"
LOCAL_DIR="./ftp-upload"

# 数据库信息
DB_HOST="gdm643972455.my3w.com"
DB_NAME="gdm643972455_db"
DB_USER="gdm643972455"
DB_PASS="6012.QuPunkmysql"

echo "📊 数据库配置："
echo "- 主机: $DB_HOST"
echo "- 数据库: $DB_NAME"
echo "- 用户: $DB_USER"
echo ""

# 1. 创建服务器端项目结构
echo "📁 创建服务器端项目..."
rm -rf server-deploy
mkdir -p server-deploy/{api,frontend,config}

# 2. 复制API文件
echo "📋 复制API文件..."
cp -r app/api/mindpilot server-deploy/api/
cp -r lib server-deploy/
cp package.json server-deploy/
cp next.config.js server-deploy/

# 3. 创建服务器端环境配置
echo "⚙️ 创建环境配置..."
cat > server-deploy/.env << EOF
# 数据库配置
DB_HOST=$DB_HOST
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_PORT=3306

# 服务器配置
PORT=3001
NODE_ENV=production

# API配置
API_BASE_URL=http://8.219.57.204:3001/api/mindpilse

# 允许的跨域来源
ALLOWED_ORIGINS=http://8.219.57.204,https://wavefunction.top,http://wavefunction.top
EOF

# 4. 创建简化的服务器入口文件
echo "🔧 创建服务器入口..."
cat > server-deploy/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS配置
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// 中间件
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// API路由
app.use('/api/mindpilse', require('./api/mindpilot'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: process.env.DB_HOST ? 'configured' : 'not configured'
  });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MindPulse API服务器运行在端口 ${PORT}`);
  console.log(`📊 数据库: ${process.env.DB_HOST}`);
  console.log(`🌐 允许跨域: ${allowedOrigins.join(', ')}`);
});
EOF

# 5. 创建简化的package.json
cat > server-deploy/package.json << 'EOF'
{
  "name": "mindpulse-api-server",
  "version": "1.0.0",
  "description": "MindPulse API Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "install-deps": "npm install express cors dotenv mysql2 axios"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "mysql2": "^3.6.0",
    "axios": "^1.6.0"
  },
  "keywords": ["mindpulse", "api", "ai"],
  "author": "MindPulse Team"
}
EOF

# 6. 创建数据库初始化脚本
echo "🗄️ 创建数据库初始化脚本..."
cat > server-deploy/init-database.js << 'EOF'
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ 数据库连接成功');

    // 创建用户表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 创建对话表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        session_id VARCHAR(100) NOT NULL,
        conversation_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 创建决策变量表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS decision_variables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100) NOT NULL,
        variable_type ENUM('goals', 'assets', 'risks') NOT NULL,
        variable_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session_id (session_id)
      )
    `);

    // 创建用户设置表
    await connection.execute(`
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
    `);

    console.log('✅ 数据库表创建成功');
    await connection.end();
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
EOF

# 7. 复制前端文件到server-deploy
echo "📱 复制前端文件..."
cp -r ftp-upload/* server-deploy/frontend/

# 8. 创建部署包
echo "📦 创建完整部署包..."
tar -czf mindpulse-full-deploy.tar.gz server-deploy/

echo "✅ 完整部署包已创建：mindpulse-full-deploy.tar.gz"
echo ""
echo "📋 下一步操作："
echo "1. 上传 mindpulse-full-deploy.tar.gz 到服务器"
echo "2. 在服务器上解压并安装Node.js环境"
echo "3. 安装依赖并启动API服务"
echo "4. 配置反向代理（可选）"
echo ""
echo "🔧 服务器端命令："
echo "# 解压文件"
echo "tar -xzf mindpulse-full-deploy.tar.gz"
echo "cd server-deploy"
echo ""
echo "# 安装Node.js依赖"
echo "npm run install-deps"
echo ""
echo "# 初始化数据库"
echo "node init-database.js"
echo ""
echo "# 启动API服务器"
echo "npm start"
echo ""
echo "🌐 API服务器将运行在: http://8.219.57.204:3001"
echo "📊 健康检查: http://8.219.57.204:3001/health" 