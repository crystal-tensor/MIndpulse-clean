#!/bin/bash

# MindPulse项目推送脚本
# 目标仓库: https://github.com/Avalosol/Mindpulse

echo "🚀 开始推送MindPulse项目到GitHub..."

# 检查网络连接
echo "📡 检查网络连接..."
if curl -I https://github.com 2>/dev/null | head -n 1 | grep -q 200; then
    echo "✅ 网络连接正常"
else
    echo "❌ 网络连接异常，请检查网络或VPN"
    exit 1
fi

# 确认远程仓库配置
echo "🔧 确认远程仓库配置..."
git remote set-url origin https://github.com/Avalosol/Mindpulse.git

# 显示当前状态
echo "📊 当前Git状态："
git status

# 推送到远程仓库
echo "⬆️  推送到远程仓库..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "🎉 推送成功！"
    echo "📄 项目已成功推送到: https://github.com/Avalosol/Mindpulse"
    echo "🔗 访问仓库: https://github.com/Avalosol/Mindpulse"
else
    echo "❌ 推送失败，请检查："
    echo "   1. 网络连接是否正常"
    echo "   2. 是否有仓库推送权限"
    echo "   3. 是否需要认证（Personal Access Token）"
    echo ""
    echo "🔧 手动推送方法："
    echo "   git push -u origin main"
fi 