#!/bin/bash

# 服务器端一键部署脚本
# 在你的阿里云服务器上运行此脚本

echo "🚀 MindPulse服务器端一键部署开始..."

# 检查是否在正确的目录
if [ ! -f "mindpulse-full-deploy.tar.gz" ]; then
    echo "❌ 错误：未找到 mindpulse-full-deploy.tar.gz 文件"
    echo "请确保已上传部署包到当前目录"
    exit 1
fi

# 解压部署包
echo "📦 解压部署包..."
tar -xzf mindpulse-full-deploy.tar.gz
cd server-deploy

# 检查Node.js是否已安装
if ! command -v node &> /dev/null; then
    echo "📦 安装Node.js..."
    
    # 检测操作系统
    if [ -f /etc/redhat-release ]; then
        # CentOS/RHEL
        curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
        yum install -y nodejs
    elif [ -f /etc/debian_version ]; then
        # Ubuntu/Debian
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    else
        echo "❌ 不支持的操作系统，请手动安装Node.js"
        exit 1
    fi
fi

echo "📋 Node.js版本: $(node --version)"
echo "📋 NPM版本: $(npm --version)"

# 安装项目依赖
echo "📦 安装项目依赖..."
npm run install-deps

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败，尝试手动安装..."
    npm install express cors dotenv mysql2 axios
fi

# 测试数据库连接并初始化
echo "🗄️ 初始化数据库..."
node init-database.js

if [ $? -eq 0 ]; then
    echo "✅ 数据库初始化成功"
else
    echo "⚠️ 数据库初始化失败，请检查数据库配置"
fi

# 启动API服务器
echo "🚀 启动API服务器..."

# 检查是否有PM2
if command -v pm2 &> /dev/null; then
    echo "使用PM2启动服务..."
    pm2 start server.js --name mindpulse-api
    pm2 save
else
    echo "使用nohup启动服务..."
    nohup node server.js > api.log 2>&1 &
    echo $! > server.pid
fi

# 等待服务启动
sleep 5

# 检查服务状态
echo "🔍 检查服务状态..."
if curl -f http://localhost:3001/health &> /dev/null; then
    echo "✅ API服务启动成功！"
    echo ""
    echo "🌐 服务地址："
    echo "- 健康检查: http://8.219.57.204:3001/health"
    echo "- API基础: http://8.219.57.204:3001/api/mindpilse/"
    echo ""
    echo "📊 服务状态："
    curl http://localhost:3001/health
    echo ""
    echo ""
    echo "📝 日志文件: api.log"
    echo "🔧 停止服务: kill \$(cat server.pid) 或 pm2 stop mindpulse-api"
else
    echo "❌ API服务启动失败"
    echo "📝 检查日志: tail -f api.log"
    exit 1
fi

echo ""
echo "🎉 部署完成！现在你可以在前端页面测试API连接了。" 