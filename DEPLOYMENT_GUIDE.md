# MindPulse 阿里云部署指南

## 部署方案概述

由于你的阿里云服务器主要支持静态HTML和PHP，我们采用混合部署方案：
- **前端**：静态化部署到 `/Mindpulse/` 目录
- **API**：需要单独的Node.js环境或使用外部API服务

## 方案一：纯静态部署（推荐用于演示）

### 1. 本地构建静态文件

```bash
# 给脚本执行权限
chmod +x deploy-to-server.sh

# 运行构建脚本
./deploy-to-server.sh
```

### 2. 上传到服务器

```bash
# 使用SCP上传（替换为你的服务器信息）
scp mindpulse-deploy.tar.gz username@wavefunction.top:/path/to/web/root/

# 或使用FTP工具上传 mindpulse-deploy.tar.gz
```

### 3. 服务器端操作

```bash
# SSH登录服务器
ssh username@wavefunction.top

# 解压文件
tar -xzf mindpulse-deploy.tar.gz

# 创建目标目录
mkdir -p /path/to/web/root/Mindpulse

# 复制文件
cp -r out/* /path/to/web/root/Mindpulse/

# 设置权限
chmod -R 755 /path/to/web/root/Mindpulse/
```

### 4. 配置Apache

在你的网站根目录或Mindpulse目录下创建 `.htaccess` 文件：

```apache
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
```

## 方案二：完整功能部署（需要Node.js）

### 1. 服务器环境准备

```bash
# 安装Node.js (如果未安装)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2进程管理器
npm install -g pm2

# 安装Python3和pip（用于股票数据API）
sudo apt-get install python3 python3-pip
pip3 install baostock pandas numpy
```

### 2. 上传完整项目

```bash
# 打包项目（排除node_modules）
tar --exclude='node_modules' --exclude='.next' --exclude='out' -czf mindpulse-full.tar.gz ./

# 上传到服务器
scp mindpulse-full.tar.gz username@wavefunction.top:/path/to/apps/
```

### 3. 服务器端部署

```bash
# 解压项目
cd /path/to/apps/
tar -xzf mindpulse-full.tar.gz
cd MindPulse-stock

# 安装依赖
npm install

# 构建项目
npm run build

# 使用PM2启动应用
pm2 start npm --name "mindpulse" -- start
pm2 save
pm2 startup
```

### 4. 配置反向代理

在Apache配置中添加：

```apache
# 反向代理到Node.js应用
ProxyPass /Mindpulse http://localhost:3000/Mindpulse
ProxyPassReverse /Mindpulse http://localhost:3000/Mindpulse

# API代理
ProxyPass /api/mindpulse http://localhost:3000/api/mindpulse
ProxyPassReverse /api/mindpulse http://localhost:3000/api/mindpulse
```

## 方案三：混合部署（推荐）

### 前端静态化 + 独立API服务

1. **前端**：按方案一部署静态文件
2. **API**：部署到子域名或独立端口
3. **配置**：修改前端配置指向API服务地址

```javascript
// 在 config/production.js 中设置
export const config = {
  API_BASE_URL: 'https://api.wavefunction.top/mindpulse', // 或 https://wavefunction.top:3001/api/mindpulse
  SITE_URL: 'https://wavefunction.top/Mindpulse'
};
```

## 功能限制说明

### 静态部署限制

1. **AI聊天功能**：需要用户在前端配置API密钥
2. **股票数据**：使用模拟数据或外部API
3. **文件上传**：不支持服务器端文件存储
4. **实时功能**：无WebSocket支持

### 解决方案

1. **外部API服务**：
   - 使用Vercel、Railway等平台部署API
   - 配置CORS允许你的域名访问

2. **第三方服务**：
   - 股票数据：使用Alpha Vantage、Yahoo Finance等API
   - AI服务：直接调用OpenAI、DeepSeek等API

## 测试部署

### 本地测试静态构建

```bash
# 构建静态文件
npm run build

# 使用Python简单服务器测试
cd out
python3 -m http.server 8080

# 访问 http://localhost:8080 测试
```

### 线上测试

1. 访问 `https://wavefunction.top/Mindpulse/`
2. 检查所有页面是否正常加载
3. 测试路由跳转
4. 测试响应式设计

## 故障排除

### 常见问题

1. **页面404错误**：检查.htaccess配置和路径设置
2. **资源加载失败**：检查basePath和assetPrefix配置
3. **API调用失败**：检查API_BASE_URL配置和CORS设置
4. **样式丢失**：检查CSS文件路径和权限

### 日志检查

```bash
# Apache错误日志
tail -f /var/log/apache2/error.log

# PM2应用日志（如果使用完整部署）
pm2 logs mindpulse
```

## 优化建议

1. **CDN加速**：使用阿里云CDN加速静态资源
2. **压缩优化**：启用Gzip压缩
3. **缓存策略**：设置合理的缓存头
4. **监控告警**：配置服务监控和告警

## 访问地址

部署成功后，访问：
- **主页**：https://wavefunction.top/Mindpulse/
- **登录页**：https://wavefunction.top/Mindpulse/landing/
- **意识枢纽**：https://wavefunction.top/Mindpulse/consciousness-hub/

## 技术支持

如遇到部署问题，请检查：
1. 服务器PHP和Apache版本
2. 文件权限设置
3. .htaccess是否生效
4. 域名DNS解析是否正确 