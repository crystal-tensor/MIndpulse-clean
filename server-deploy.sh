#!/bin/bash

# 服务器端部署脚本
# 在你的阿里云服务器上运行此脚本

echo "开始部署MindPulse到服务器..."

# 设置变量
DEPLOY_DIR="/var/www/html/Mindpulse"  # 修改为你的网站目录
BACKUP_DIR="/var/backups/mindpulse-$(date +%Y%m%d_%H%M%S)"

# 检查是否以root权限运行
if [[ $EUID -eq 0 ]]; then
   echo "正在以root权限运行..."
else
   echo "请使用sudo运行此脚本"
   exit 1
fi

# 创建备份
if [ -d "$DEPLOY_DIR" ]; then
    echo "创建备份到 $BACKUP_DIR..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$DEPLOY_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true
fi

# 创建部署目录
echo "创建部署目录 $DEPLOY_DIR..."
mkdir -p "$DEPLOY_DIR"

# 解压部署包
if [ -f "mindpulse-deploy.tar.gz" ]; then
    echo "解压部署包..."
    tar -xzf mindpulse-deploy.tar.gz
    
    # 复制文件
    echo "复制文件到部署目录..."
    cp -r .next-prod/* "$DEPLOY_DIR/"
    
    # 设置权限
    echo "设置文件权限..."
    chown -R www-data:www-data "$DEPLOY_DIR"
    chmod -R 755 "$DEPLOY_DIR"
    
    # 创建.htaccess文件（如果不存在）
    if [ ! -f "$DEPLOY_DIR/.htaccess" ]; then
        echo "创建.htaccess文件..."
        cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
RewriteEngine On

# 处理静态资源
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# SPA路由处理
RewriteRule ^(.*)$ /Mindpulse/index.html [L,QSA]

# 缓存设置
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# 启用Gzip压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# 安全头
<IfModule mod_headers.c>
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOF
        chown www-data:www-data "$DEPLOY_DIR/.htaccess"
        chmod 644 "$DEPLOY_DIR/.htaccess"
    fi
    
    echo "部署完成！"
    echo ""
    echo "访问地址：https://wavefunction.top/Mindpulse/"
    echo "备份位置：$BACKUP_DIR"
    echo ""
    echo "检查部署状态："
    ls -la "$DEPLOY_DIR"
    
else
    echo "错误：未找到 mindpulse-deploy.tar.gz 文件"
    echo "请确保已上传部署包到当前目录"
    exit 1
fi 