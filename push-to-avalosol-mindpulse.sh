#!/bin/bash

# MindPulse项目推送脚本
# 目标仓库: https://github.com/Avalosol/Mindpulse

echo "🚀 开始推送MindPulse项目到Avalosol仓库..."
echo "=========================================="

# 检查网络连接
echo "📡 检查网络连接到GitHub..."
if ping -c 1 github.com &> /dev/null; then
    echo "✅ 网络连接正常"
else
    echo "❌ 网络连接异常，请检查网络或VPN连接"
    echo "💡 建议："
    echo "   1. 检查网络连接"
    echo "   2. 使用VPN或移动热点"
    echo "   3. 稍后重试"
    exit 1
fi

# 确认Git配置
echo ""
echo "🔧 确认Git配置..."
git remote -v
echo ""

# 检查当前状态
echo "📊 当前Git状态："
git status --short
echo ""

# 显示最新提交
echo "📝 最新提交信息："
git log --oneline -1
echo ""

# 执行推送
echo "⬆️  开始推送到远程仓库..."
echo "目标: https://github.com/Avalosol/Mindpulse"
echo ""

if git push origin main; then
    echo ""
    echo "🎉 推送成功！"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📄 项目已成功推送到: https://github.com/Avalosol/Mindpulse"
    echo "🔗 访问仓库查看项目内容"
    echo ""
    echo "✨ 新增功能亮点："
    echo "   • 奇点交易所V2 - 资源流转中枢"
    echo "   • 三方协作模式：技术方+资源方+资金方"
    echo "   • 分账计算器和智能匹配系统"
    echo "   • 价值热力图和枢纽价值评估"
    echo "   • 完整的设计文档和使用指南"
    echo ""
    echo "📊 项目统计："
    echo "   • 文件数量: $(git ls-files | wc -l | tr -d ' ') 个"
    echo "   • 代码行数: $(git ls-files | xargs wc -l | tail -1 | awk '{print $1}') 行"
    echo "   • 提交数量: $(git rev-list --count HEAD) 个"
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 可能的原因："
    echo "   1. 网络连接问题"
    echo "   2. 认证权限问题"
    echo "   3. 仓库权限不足"
    echo ""
    echo "🔧 解决方案："
    echo "   1. 检查GitHub账户权限"
    echo "   2. 使用GitHub Personal Access Token"
    echo "   3. 联系仓库管理员"
    echo ""
    echo "📞 获取帮助："
    echo "   • GitHub文档: https://docs.github.com"
    echo "   • 技术支持: support@github.com"
    echo ""
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 任务完成！MindPulse项目已成功部署到Avalosol仓库"
echo "🌟 感谢使用MindPulse - 让AI资产交易更简单！" 