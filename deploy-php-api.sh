#!/bin/bash

# PHP API自动部署脚本
echo "🚀 开始部署PHP API到服务器..."

# FTP配置
FTP_HOST="8.219.57.204"
FTP_USER="wh-ng5i6t4sqnqpocplcca"
FTP_PASS="6012.QuPunkftp"
REMOTE_DIR="/htdocs"

# 检查部署包是否存在
if [ ! -f "mindpulse-php-api.tar.gz" ]; then
    echo "❌ 部署包不存在，正在创建..."
    ./create-php-api.sh
fi

echo "📤 上传PHP API到服务器..."

# 使用lftp上传
lftp -c "
set ftp:ssl-allow no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
cd $REMOTE_DIR

# 上传API部署包
put mindpulse-php-api.tar.gz

# 解压API文件
quote site exec tar -xzf mindpulse-php-api.tar.gz

# 移动API文件到正确位置
quote site exec mv php-api api

# 清理临时文件
quote site exec rm mindpulse-php-api.tar.gz

quit
"

if [ $? -eq 0 ]; then
    echo "✅ PHP API部署成功！"
    echo ""
    echo "🌐 API端点："
    echo "- 健康检查: http://wavefunction.top/api/health"
    echo "- 聊天: http://wavefunction.top/api/chat"  
    echo "- 测试连接: http://wavefunction.top/api/test-connection"
    echo "- 变量提取: http://wavefunction.top/api/extract-variables"
    echo ""
    echo "🧪 测试命令："
    echo "curl http://wavefunction.top/api/health"
else
    echo "❌ PHP API部署失败！"
    exit 1
fi 