#!/bin/bash

# 本地解压脚本 - 为FTP上传准备文件
echo "准备FTP上传文件..."

# 创建FTP上传目录
rm -rf ftp-upload
mkdir -p ftp-upload

# 检查部署包是否存在
if [ -f "mindpulse-deploy.tar.gz" ]; then
    echo "解压部署包..."
    tar -xzf mindpulse-deploy.tar.gz
    
    # 复制文件到FTP上传目录
    echo "准备FTP上传文件..."
    cp -r .next-prod/* ftp-upload/
    
    echo "✅ FTP上传文件已准备完成！"
    echo ""
    echo "📁 文件位置：./ftp-upload/"
    echo ""
    echo "📋 下一步操作："
    echo "1. 使用FTP工具（如FileZilla）连接到你的服务器"
    echo "2. 在服务器上创建 Mindpulse 目录"
    echo "3. 将 ftp-upload 目录中的所有文件上传到 Mindpulse 目录"
    echo "4. 访问 https://wavefunction.top/Mindpulse/ 测试"
    echo ""
    echo "📂 需要上传的文件列表："
    ls -la ftp-upload/
    echo ""
    echo "🔍 重要文件："
    echo "- index.html (主页)"
    echo "- .htaccess (路由配置，很重要！)"
    echo "- _next/ 目录 (所有CSS和JS文件)"
    echo "- 各个页面目录 (landing/, consciousness-hub/ 等)"
    
else
    echo "❌ 错误：未找到 mindpulse-deploy.tar.gz 文件"
    echo "请先运行 ./deploy-to-server.sh 生成部署包"
    exit 1
fi 