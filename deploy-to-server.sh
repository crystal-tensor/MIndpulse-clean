#!/bin/bash

echo "开始构建MindPulse静态站点..."

# 清理之前的构建
rm -rf out
rm -rf .next-prod

# 设置生产环境
export NODE_ENV=production

# 安装依赖
echo "安装依赖..."
npm install

# 构建项目
echo "构建项目..."
npm run build

# 检查构建是否成功 - 检查.next-prod目录
if [ -d ".next-prod" ]; then
    echo "构建成功！静态文件已生成在 .next-prod/ 目录"
    
    # 创建部署包
    echo "创建部署包..."
    tar -czf mindpulse-deploy.tar.gz .next-prod/
    
    echo "部署包已创建：mindpulse-deploy.tar.gz"
    echo ""
    echo "部署步骤："
    echo "1. 将 mindpulse-deploy.tar.gz 上传到你的服务器"
    echo "2. 在服务器上解压：tar -xzf mindpulse-deploy.tar.gz"
    echo "3. 将 .next-prod/ 目录中的内容复制到 /Mindpulse/ 目录"
    echo "4. 确保服务器配置支持单页应用路由"
    echo ""
    echo "访问地址：https://wavefunction.top/Mindpulse/"
    echo ""
    echo "文件列表："
    ls -la .next-prod/
else
    echo "构建失败！请检查错误信息"
    exit 1
fi 