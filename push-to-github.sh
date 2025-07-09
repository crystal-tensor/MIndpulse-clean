#!/bin/bash

echo "🚀 MindPulse项目推送到GitHub脚本"
echo "=================================="

# 检查网络连接
echo "📡 检查网络连接..."
if ping -c 1 github.com > /dev/null 2>&1; then
    echo "✅ 网络连接正常"
else
    echo "❌ 无法连接到GitHub，请检查网络连接"
    exit 1
fi

# 检查Git状态
echo "📋 检查Git状态..."
git status

# 确认是否继续推送
read -p "确认推送到GitHub? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ 取消推送"
    exit 0
fi

# 添加所有更改（排除库文件，根据.gitignore）
echo "📦 添加文件到暂存区..."
git add .

# 显示将要提交的文件
echo "📝 即将提交的文件:"
git status --short

# 提交更改
echo "💾 提交更改..."
git commit -m "feat: 完整项目推送

🎯 核心功能:
- 智核交互 (AI Core) - 对话式AI交互和知识提取
- 灵境回廊 (Spirit Corridor) - 知识图谱构建和数字分身
- 智能决策 (Quantum Decisions) - 量子决策优化
- 资产配置 (Asset Allocation) - 智能投资组合
- 奇点交易所 (Singularity Exchange) - 数字分身交易平台

🔧 技术栈:
- Next.js 14 + TypeScript
- Tailwind CSS + Framer Motion
- 多模型AI集成 (DeepSeek, OpenAI, Claude等)
- 量子计算仿真
- 实时图谱可视化

📈 新增功能:
- 修复智核交互图谱生成功能
- 节点大小差异化显示
- 3D图谱连接线精确定位
- 连接线权重可视化
- 智能概念提取和分析

📚 文档:
- 完整商业计划书
- 项目技术文档
- 部署和使用指南" || echo "⚠️  没有新的更改需要提交"

# 推送到远程仓库
echo "🚀 推送到GitHub..."
if git push origin main; then
    echo "✅ 成功推送到 https://github.com/Avalosol/Mindpulse"
    echo ""
    echo "🎉 推送完成！你可以在以下网址查看项目:"
    echo "   https://github.com/Avalosol/Mindpulse"
    echo ""
    echo "📋 推送内容包括:"
    echo "   - 所有源代码文件"
    echo "   - 配置文件"
    echo "   - 文档和说明"
    echo "   - 商业计划书"
    echo "   ❌ 已排除: node_modules/, .next/, build/ 等库文件"
else
    echo "❌ 推送失败，请检查："
    echo "   1. 网络连接是否正常"
    echo "   2. GitHub访问权限"
    echo "   3. 仓库地址是否正确"
    echo ""
    echo "📝 当前远程仓库:"
    git remote -v
fi 