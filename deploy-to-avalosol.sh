#!/bin/bash

# MindPulse 完整部署脚本
# 目标: https://github.com/Avalosol/Mindpulse

echo "🚀 MindPulse 项目部署脚本"
echo "=========================================="

# 检查网络连接
check_network() {
    echo "📡 检查网络连接..."
    if ping -c 1 github.com &> /dev/null; then
        echo "✅ 网络连接正常"
        return 0
    else
        echo "❌ 网络连接异常"
        return 1
    fi
}

# 方案1: 直接推送
direct_push() {
    echo ""
    echo "🔄 方案1: 直接推送到GitHub..."
    git remote set-url origin https://github.com/Avalosol/Mindpulse.git
    
    echo "正在推送..."
    if git push -u origin main; then
        echo "🎉 推送成功！"
        echo "📄 访问项目: https://github.com/Avalosol/Mindpulse"
        return 0
    else
        echo "❌ 推送失败"
        return 1
    fi
}

# 方案2: 使用GitHub CLI
github_cli_push() {
    echo ""
    echo "🔄 方案2: 使用GitHub CLI推送..."
    
    if command -v gh &> /dev/null; then
        echo "✅ GitHub CLI 已安装"
        
        # 检查认证状态
        if gh auth status &> /dev/null; then
            echo "✅ 已登录GitHub"
            
            # 创建仓库（如果不存在）
            if gh repo create Avalosol/Mindpulse --public --confirm 2>/dev/null; then
                echo "✅ 仓库创建成功"
            else
                echo "ℹ️  仓库已存在"
            fi
            
            # 推送代码
            if git push -u origin main; then
                echo "🎉 GitHub CLI 推送成功！"
                return 0
            else
                echo "❌ GitHub CLI 推送失败"
                return 1
            fi
        else
            echo "❌ 未登录GitHub CLI"
            echo "请运行: gh auth login"
            return 1
        fi
    else
        echo "❌ GitHub CLI 未安装"
        return 1
    fi
}

# 方案3: 创建发布包
create_release_package() {
    echo ""
    echo "🔄 方案3: 创建发布包..."
    
    # 创建完整的项目包
    echo "📦 创建项目压缩包..."
    tar -czf mindpulse-release-$(date +%Y%m%d).tar.gz \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='*.tar.gz' \
        --exclude='*.bundle' \
        .
    
    echo "📦 创建Git bundle..."
    git bundle create mindpulse-git-$(date +%Y%m%d).bundle main
    
    echo "✅ 发布包创建完成："
    echo "   - mindpulse-release-$(date +%Y%m%d).tar.gz (项目文件)"
    echo "   - mindpulse-git-$(date +%Y%m%d).bundle (Git历史)"
    echo ""
    echo "📋 手动部署步骤："
    echo "1. 下载两个文件"
    echo "2. 访问 https://github.com/Avalosol/Mindpulse"
    echo "3. 上传 tar.gz 文件或使用以下命令："
    echo "   git clone mindpulse-git-$(date +%Y%m%d).bundle new-repo"
    echo "   cd new-repo"
    echo "   git remote set-url origin https://github.com/Avalosol/Mindpulse.git"
    echo "   git push -u origin main"
    
    return 0
}

# 方案4: 分批推送
batch_push() {
    echo ""
    echo "🔄 方案4: 分批推送..."
    
    # 创建临时分支
    git checkout -b temp-deploy
    
    # 只推送核心文件
    echo "📦 第一批: 推送核心文件..."
    git add README.md package.json next.config.js
    git commit -m "初始化: 核心配置文件"
    
    if git push -u origin temp-deploy; then
        echo "✅ 第一批推送成功"
        
        # 推送应用文件
        echo "📦 第二批: 推送应用文件..."
        git add app/ components/ lib/
        git commit -m "添加: 应用核心文件"
        
        if git push origin temp-deploy; then
            echo "✅ 第二批推送成功"
            
            # 推送剩余文件
            echo "📦 第三批: 推送剩余文件..."
            git add .
            git commit -m "完成: 所有项目文件"
            
            if git push origin temp-deploy; then
                echo "✅ 第三批推送成功"
                
                # 合并到主分支
                git checkout main
                git merge temp-deploy
                git push origin main
                
                echo "🎉 分批推送完成！"
                return 0
            fi
        fi
    fi
    
    echo "❌ 分批推送失败"
    git checkout main
    return 1
}

# 主程序
main() {
    echo "📊 项目状态:"
    echo "   - 文件数: $(find . -type f | wc -l)"
    echo "   - 总大小: $(du -sh . | cut -f1)"
    echo ""
    
    # 检查网络
    if check_network; then
        # 尝试各种推送方案
        if direct_push; then
            exit 0
        elif github_cli_push; then
            exit 0
        elif batch_push; then
            exit 0
        else
            echo "❌ 所有在线推送方案都失败了"
            create_release_package
        fi
    else
        echo "⚠️  网络连接问题，创建离线包..."
        create_release_package
    fi
}

# 运行主程序
main "$@" 