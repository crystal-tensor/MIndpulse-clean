#!/bin/bash

# MindPulse-Clean 项目推送脚本
# 使用方法: ./push_to_github.sh

echo "🚀 MindPulse-Clean GitHub推送脚本"
echo "=================================="

# 检查网络连接
echo "📡 检查网络连接..."
if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    echo "✅ 基本网络连接正常"
else
    echo "❌ 网络连接异常，请检查网络设置"
    exit 1
fi

# 检查GitHub连接
echo "🔍 检查GitHub连接..."
if curl -s --connect-timeout 10 https://github.com > /dev/null 2>&1; then
    echo "✅ GitHub连接正常"
    GITHUB_ACCESSIBLE=true
else
    echo "⚠️  GitHub连接异常，可能需要VPN或代理"
    GITHUB_ACCESSIBLE=false
fi

# 确保在正确的目录
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    echo "❌ 请在MindPulse-Clean项目根目录运行此脚本"
    exit 1
fi

echo "📋 项目状态检查..."
echo "- 项目目录: $(pwd)"
echo "- Git状态: $(git status --porcelain | wc -l) 个未提交的更改"
echo "- 远程仓库: $(git remote get-url origin)"

# 提交未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 提交未保存的更改..."
    git add .
    git commit -m "自动提交: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 尝试推送
if [ "$GITHUB_ACCESSIBLE" = true ]; then
    echo "🚀 开始推送到GitHub..."
    
    # 方法1: 标准HTTPS推送
    echo "📤 尝试HTTPS推送..."
    if git push -u origin main; then
        echo "✅ 推送成功！"
        echo "🎉 项目已成功推送到: https://github.com/crystal-tensor/MindPulse-Clean"
        exit 0
    else
        echo "⚠️  HTTPS推送失败，尝试SSH..."
        
        # 方法2: SSH推送
        git remote set-url origin git@github.com:crystal-tensor/MindPulse-Clean.git
        if git push -u origin main; then
            echo "✅ SSH推送成功！"
            echo "🎉 项目已成功推送到: https://github.com/crystal-tensor/MindPulse-Clean"
            exit 0
        else
            echo "❌ SSH推送也失败了"
        fi
    fi
else
    echo "❌ 无法连接到GitHub，请尝试以下解决方案："
    echo ""
    echo "1. 启用VPN后重新运行此脚本"
    echo "2. 配置代理："
    echo "   git config --global http.proxy http://your-proxy:port"
    echo "   git config --global https.proxy https://your-proxy:port"
    echo "3. 使用GitHub CLI:"
    echo "   brew install gh"
    echo "   gh auth login"
    echo "   gh repo create MindPulse-Clean --public --source=. --push"
    echo "4. 手动上传到GitHub网页界面"
    echo ""
    echo "📦 已为您准备好所有文件，共 $(find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './.next/*' | wc -l) 个文件"
fi

echo ""
echo "📁 项目包含以下主要文件和目录："
echo "- ✅ 应用页面: app/ (量子决策、AI探索、知识图谱等)"
echo "- ✅ 组件库: components/ (布局、游戏、页面组件)"
echo "- ✅ API接口: app/api/mindpilot/ (聊天、量子求解、图谱生成等)"
echo "- ✅ 配置文件: package.json, next.config.js, tailwind.config.js"
echo "- ✅ 文档文件: README.md, 各种指南和总结"
echo "- ❌ 已排除: node_modules/, .next/, .next-prod/" 