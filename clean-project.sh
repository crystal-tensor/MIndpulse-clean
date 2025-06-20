#!/bin/bash

# MindPulse项目清理脚本
# 此脚本将删除可以重新生成的文件，大大减少项目体积

echo "🧹 开始清理 MindPulse 项目..."

# 删除node_modules (最大的占用者)
if [ -d "node_modules" ]; then
    echo "🗑️  删除 node_modules/ 目录 (约761MB)"
    rm -rf node_modules/
    echo "✅ node_modules/ 已删除"
fi

# 删除Next.js构建缓存
if [ -d ".next" ]; then
    echo "🗑️  删除 .next/ 构建缓存 (约35MB)"
    rm -rf .next/
    echo "✅ .next/ 已删除"
fi

# 删除其他临时文件
echo "🗑️  删除其他临时文件..."
rm -f .DS_Store
rm -f *.log
rm -rf .turbo/
rm -rf dist/
rm -rf build/

echo ""
echo "🎉 清理完成！项目现在应该只有约16MB"
echo ""
echo "📋 要恢复项目运行，请执行："
echo "   npm install      # 重新安装依赖"
echo "   npm run dev      # 启动开发服务器"
echo ""
echo "⚠️  注意：这些文件在下次运行项目时会自动重新生成" 