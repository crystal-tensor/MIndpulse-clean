# MindPulse 虚拟主机 FTP 部署指南

## 🌐 虚拟主机部署方案

由于你的虚拟主机不支持SSH，我们使用FTP方式进行部署。

### 📋 部署前准备

1. **FTP工具**：下载并安装以下任一工具
   - **FileZilla**（推荐，免费）：https://filezilla-project.org/
   - **WinSCP**（Windows）：https://winscp.net/
   - **Cyberduck**（Mac）：https://cyberduck.io/

2. **虚拟主机信息**：准备以下信息
   - FTP服务器地址
   - FTP用户名
   - FTP密码
   - 网站根目录路径（通常是 `/public_html/` 或 `/www/`）

### 🚀 部署步骤

#### 步骤1：解压部署包到本地

```bash
# 在你的电脑上解压
tar -xzf mindpulse-deploy.tar.gz
```

如果你的电脑不支持tar命令，可以：
1. 将 `mindpulse-deploy.tar.gz` 重命名为 `mindpulse-deploy.zip`
2. 使用WinRAR、7-Zip等工具解压

#### 步骤2：连接FTP服务器

**使用FileZilla：**
1. 打开FileZilla
2. 在顶部输入：
   - 主机：你的FTP服务器地址
   - 用户名：FTP用户名
   - 密码：FTP密码
   - 端口：21（普通FTP）或22（SFTP）
3. 点击"快速连接"

#### 步骤3：创建目录结构

在FTP服务器上：
1. 进入网站根目录（通常是 `public_html` 或 `www`）
2. 创建 `Mindpulse` 文件夹
3. 进入 `Mindpulse` 文件夹

#### 步骤4：上传文件

将解压后的 `.next-prod` 目录中的**所有内容**上传到 `Mindpulse` 文件夹：

**重要文件列表：**
- `index.html` - 主页文件
- `404.html` - 错误页面
- `_next/` 文件夹 - JavaScript和CSS资源
- `landing/` 文件夹 - 登录页面
- `consciousness-hub/` 文件夹 - 意识枢纽
- `spirit-corridor/` 文件夹 - 精神走廊
- `quantum-decisions/` 文件夹 - 量子决策
- `asset-allocation/` 文件夹 - 资产配置
- `MindFace.jpg` - 品牌图片
- `.htaccess` - 路由配置文件

#### 步骤5：配置.htaccess文件

如果虚拟主机支持.htaccess，确保上传了正确的配置。如果不支持，请联系主机商启用。

### 🔧 手动创建.htaccess（如有需要）

如果.htaccess文件没有正确上传，在FTP工具中创建新文件，命名为`.htaccess`，内容如下：

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

# 安全头
<IfModule mod_headers.c>
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### 📁 目录结构示例

部署完成后，你的服务器目录结构应该是这样：

```
/public_html/  (或 /www/)
└── Mindpulse/
    ├── index.html
    ├── 404.html
    ├── .htaccess
    ├── MindFace.jpg
    ├── _next/
    │   ├── static/
    │   └── ...
    ├── landing/
    │   └── index.html
    ├── consciousness-hub/
    │   └── index.html
    ├── spirit-corridor/
    │   └── index.html
    ├── quantum-decisions/
    │   └── index.html
    └── asset-allocation/
        └── index.html
```

### ✅ 验证部署

1. 访问：`https://wavefunction.top/Mindpulse/`
2. 检查各个页面是否正常加载：
   - `https://wavefunction.top/Mindpulse/landing/`
   - `https://wavefunction.top/Mindpulse/consciousness-hub/`

### 🚨 常见问题解决

#### 问题1：页面显示404错误
**解决方案：**
- 检查.htaccess文件是否正确上传
- 联系主机商确认是否支持mod_rewrite
- 确认文件路径正确

#### 问题2：CSS/JS文件加载失败
**解决方案：**
- 检查`_next`文件夹是否完整上传
- 确认文件权限设置为755
- 检查网络连接是否稳定

#### 问题3：.htaccess文件不生效
**解决方案：**
- 联系主机商启用mod_rewrite模块
- 尝试将规则添加到主机控制面板的重写规则中

#### 问题4：文件上传失败
**解决方案：**
- 分批上传，避免一次性上传太多文件
- 检查FTP连接稳定性
- 使用二进制模式上传

### 📞 技术支持

如果遇到问题：
1. **检查主机配置**：确认支持PHP和.htaccess
2. **联系主机商**：询问是否支持单页应用部署
3. **查看错误日志**：通过控制面板查看错误日志
4. **测试基本功能**：先确保index.html能正常访问

### 🎯 最终访问地址

- **主页**：https://wavefunction.top/Mindpulse/
- **登录页**：https://wavefunction.top/Mindpulse/landing/
- **意识枢纽**：https://wavefunction.top/Mindpulse/consciousness-hub/

### 💡 提示

- 文件上传可能需要一些时间，请耐心等待
- 建议使用SFTP而不是FTP，更安全
- 上传完成后清除浏览器缓存再测试
- 如果主机不支持.htaccess，可以考虑升级主机方案 