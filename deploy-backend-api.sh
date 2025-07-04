#!/bin/bash

# 自动化后端API部署脚本
echo "🚀 开始部署后端API服务..."

# FTP服务器信息
FTP_HOST="8.219.57.204"
FTP_USER="wh-ng5i6t4sqnqpocplcca"
FTP_PASS="6012.QuPunkftp"
DEPLOY_FILE="mindpulse-full-deploy.tar.gz"

# 检查部署文件是否存在
if [ ! -f "$DEPLOY_FILE" ]; then
    echo "❌ 错误：未找到 $DEPLOY_FILE 文件"
    echo "请先运行 ./full-server-deploy.sh 创建部署包"
    exit 1
fi

echo "📦 上传后端API服务到服务器..."

# 使用 lftp 上传文件
lftp -c "
set ftp:ssl-allow no
set ftp:passive-mode on
set net:timeout 30
set net:max-retries 3
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST
cd /htdocs
put $DEPLOY_FILE
quit
"

if [ $? -eq 0 ]; then
    echo "✅ 后端服务文件上传成功！"
    echo ""
    echo "📋 接下来需要在服务器上手动操作："
    echo ""
    echo "1️⃣ SSH登录服务器或使用主机控制面板的终端："
    echo "   ssh root@8.219.57.204"
    echo ""
    echo "2️⃣ 解压部署包："
    echo "   cd /htdocs"
    echo "   tar -xzf mindpulse-full-deploy.tar.gz"
    echo "   cd server-deploy"
    echo ""
    echo "3️⃣ 安装Node.js (如果未安装)："
    echo "   # CentOS/RHEL:"
    echo "   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -"
    echo "   sudo yum install -y nodejs"
    echo ""
    echo "   # Ubuntu/Debian:"
    echo "   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "   sudo apt-get install -y nodejs"
    echo ""
    echo "4️⃣ 安装项目依赖："
    echo "   npm run install-deps"
    echo ""
    echo "5️⃣ 测试数据库连接："
    echo "   node init-database.js"
    echo ""
    echo "6️⃣ 启动API服务器："
    echo "   nohup npm start > api.log 2>&1 &"
    echo ""
    echo "7️⃣ 验证服务运行："
    echo "   curl http://8.219.57.204:3001/health"
    echo ""
    echo "🌐 API服务地址："
    echo "- 健康检查: http://8.219.57.204:3001/health"
    echo "- 聊天API: http://8.219.57.204:3001/api/mindpilse/chat"
    echo "- 测试连接: http://8.219.57.204:3001/api/mindpilse/test-connection"
    echo ""
    echo "💡 提示："
    echo "- 如果服务器支持PM2，可以使用: npm install -g pm2 && pm2 start server.js"
    echo "- 确保服务器防火墙允许3001端口访问"
    echo "- 前端页面将自动连接到这个API服务"
    
else
    echo "❌ 文件上传失败！"
    echo "请检查FTP连接或手动上传文件"
fi 