# 🚀 MindPulse FTP上传检查清单

## ✅ 准备工作已完成

你的文件已经准备好上传！位置：`./ftp-upload/`

## 📋 上传清单

### 必须上传的文件和文件夹：

#### 🔥 核心文件（必须）
- [ ] `index.html` - 网站主页（5KB）
- [ ] `.htaccess` - 路由配置文件（1.4KB）**非常重要！**
- [ ] `404.html` - 错误页面（7.9KB）
- [ ] `MindFace.jpg` - 品牌图片（3.2MB）

#### 📁 资源文件夹（必须）
- [ ] `_next/` - 所有CSS、JS和资源文件
  - 包含静态资源和编译后的代码
  - 大小约50-100MB

#### 🎯 页面文件夹（必须）
- [ ] `landing/` - 登录页面
- [ ] `consciousness-hub/` - 意识枢纽（免费体验入口）
- [ ] `spirit-corridor/` - 精神走廊
- [ ] `spirit-corridor-v2/` - 精神走廊V2
- [ ] `quantum-decisions/` - 量子决策
- [ ] `asset-allocation/` - 资产配置
- [ ] `ai-exploration/` - AI探索
- [ ] `ai-exploration-v2/` - AI探索V2
- [ ] `knowledge-graph/` - 知识图谱

## 🔧 FTP上传步骤

### 步骤1：连接FTP
1. 打开FileZilla（或其他FTP工具）
2. 输入你的阿里云虚拟主机FTP信息：
   - 主机：你的FTP地址
   - 用户名：FTP用户名
   - 密码：FTP密码
   - 端口：21（FTP）或22（SFTP）

### 步骤2：创建目录
1. 在右侧（服务器端）找到网站根目录
   - 通常是 `public_html` 或 `www` 或 `htdocs`
2. 右键创建新文件夹，命名为 `Mindpulse`
3. 双击进入 `Mindpulse` 文件夹

### 步骤3：上传文件
1. 在左侧（本地）导航到你的项目目录
2. 进入 `ftp-upload` 文件夹
3. 选择所有文件和文件夹（Ctrl+A 或 Cmd+A）
4. 拖拽到右侧或右键选择"上传"

### 步骤4：确认上传
**重要检查项：**
- [ ] `.htaccess` 文件已上传（有些FTP工具默认隐藏点文件）
- [ ] `_next` 文件夹完整上传（包含所有子文件）
- [ ] 所有页面文件夹都已上传
- [ ] 文件权限设置为755（如果需要）

## 🎯 测试清单

上传完成后，依次测试以下地址：

### 基础测试
- [ ] https://wavefunction.top/Mindpulse/ - 主页加载
- [ ] https://wavefunction.top/Mindpulse/landing/ - 登录页面
- [ ] https://wavefunction.top/Mindpulse/consciousness-hub/ - 意识枢纽

### 功能测试
- [ ] 页面样式正常显示（CSS加载成功）
- [ ] 页面交互正常（JavaScript运行）
- [ ] 语言切换功能正常
- [ ] 导航菜单正常工作
- [ ] 响应式设计（手机访问测试）

### 路由测试
- [ ] 直接访问子页面不显示404
- [ ] 页面刷新后仍能正常显示
- [ ] 浏览器前进后退按钮正常

## 🚨 常见问题解决

### 问题1：.htaccess文件看不到
**原因：** FTP工具隐藏了点文件
**解决：** 在FileZilla中点击 服务器 > 强制显示隐藏文件

### 问题2：页面显示404或500错误
**原因：** .htaccess文件未生效或路径错误
**解决：** 
1. 确认虚拟主机支持.htaccess
2. 检查文件内容是否正确
3. 联系主机商启用mod_rewrite

### 问题3：样式丢失或页面显示异常
**原因：** `_next` 文件夹未完整上传
**解决：** 重新上传整个 `_next` 文件夹

### 问题4：上传速度慢或中断
**解决：** 
1. 分批上传大文件夹
2. 使用SFTP替代FTP
3. 检查网络连接稳定性

## 📞 获取帮助

如果遇到问题：
1. **查看主机控制面板**的错误日志
2. **联系主机商**确认技术支持
3. **检查域名解析**是否正确指向服务器

## 🎉 部署成功标志

当你能正常访问以下所有地址时，部署就成功了：

- ✅ https://wavefunction.top/Mindpulse/ - 显示主页
- ✅ https://wavefunction.top/Mindpulse/landing/ - 显示英文登录页
- ✅ https://wavefunction.top/Mindpulse/consciousness-hub/ - 显示意识枢纽

**恭喜！你的MindPulse应用已成功部署！** 🎊 