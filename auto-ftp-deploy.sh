#!/bin/bash

# 自动化FTP部署脚本
# 注意：请在运行前确保已安装 lftp 工具

echo "🚀 开始自动化FTP部署..."

# FTP服务器信息
FTP_HOST="8.219.57.204"
FTP_USER="wh-ng5i6t4sqnqpocplcca"
FTP_PASS="6012.QuPunkftp"
REMOTE_DIR="/htdocs/Mindpulse"
LOCAL_DIR="./ftp-upload"

# 检查本地文件是否存在
if [ ! -d "$LOCAL_DIR" ]; then
    echo "❌ 错误：未找到 $LOCAL_DIR 目录"
    echo "请先运行 ./extract-for-ftp.sh 准备文件"
    exit 1
fi

# 检查是否安装了 lftp
if ! command -v lftp &> /dev/null; then
    echo "❌ 错误：未安装 lftp 工具"
    echo "请安装 lftp："
    echo "  macOS: brew install lftp"
    echo "  Ubuntu/Debian: sudo apt-get install lftp"
    echo "  CentOS/RHEL: sudo yum install lftp"
    exit 1
fi

echo "📁 本地文件目录：$LOCAL_DIR"
echo "🌐 FTP服务器：$FTP_HOST"
echo "📂 远程目录：$REMOTE_DIR"
echo ""

# 使用 lftp 进行自动化部署
echo "🔄 开始上传文件..."

lftp -c "
set ftp:ssl-allow no
set ftp:passive-mode on
set net:timeout 30
set net:max-retries 3
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST
lcd $LOCAL_DIR
cd /htdocs || exit 1
mkdir -p Mindpulse || echo 'Directory might already exist'
cd Mindpulse || exit 1
mirror -R -e -v . .
quit
"

# 检查上传结果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "🎯 访问地址："
    echo "- 主页：http://8.219.57.204/Mindpulse/"
    echo "- 登录页：http://8.219.57.204/Mindpulse/landing/"
    echo "- 意识枢纽：http://8.219.57.204/Mindpulse/consciousness-hub/"
    echo ""
    echo "如果你的域名已解析到此IP，也可以访问："
    echo "- https://wavefunction.top/Mindpulse/"
    echo "- https://wavefunction.top/Mindpulse/landing/"
    echo "- https://wavefunction.top/Mindpulse/consciousness-hub/"
    echo ""
    echo "🔍 测试建议："
    echo "1. 先测试IP地址访问是否正常"
    echo "2. 检查样式和交互是否正常"
    echo "3. 测试各个页面链接"
    echo "4. 确认.htaccess文件是否生效"
else
    echo ""
    echo "❌ 部署失败！"
    echo "可能的原因："
    echo "1. FTP连接问题"
    echo "2. 权限不足"
    echo "3. 网络连接不稳定"
    echo ""
    echo "建议使用FileZilla等GUI工具手动上传"
fi 