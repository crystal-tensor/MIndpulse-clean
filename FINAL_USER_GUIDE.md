# 🎯 MindPulse 用户使用指南

## 🌟 系统已完全部署并可用！

### 📍 访问地址
**主网站**: http://wavefunction.top/Mindpulse/

## 🚀 快速开始

### 1. 访问登录页面
1. 打开浏览器访问: http://wavefunction.top/Mindpulse/
2. 你会看到美丽的国际化登录页面
3. 默认是英文，右上角可切换中文

### 2. 开始免费体验
点击页面上的 **"Start Free Trial"** 或 **"Experience Consciousness Hub"** 按钮

### 3. 进入核心功能

#### 🧠 意识枢纽 (免费体验)
- **访问**: http://wavefunction.top/Mindpulse/consciousness-hub
- **功能**: AI对话，智能问答
- **状态**: ✅ 完全可用

#### ⚡ 量子决策 (核心功能)
- **访问**: http://wavefunction.top/Mindpulse/quantum-decisions  
- **功能**: 智能决策分析，变量提取
- **状态**: ✅ 完全可用

#### 💰 资产配置
- **访问**: http://wavefunction.top/Mindpulse/asset-allocation
- **功能**: 投资组合优化
- **状态**: ✅ 界面可用

#### 🌟 灵魂走廊
- **访问**: http://wavefunction.top/Mindpulse/spirit-corridor
- **功能**: 个人成长指导
- **状态**: ✅ 界面可用

## 🔧 量子决策详细使用方法

### 步骤1: 进入量子决策页面
访问: http://wavefunction.top/Mindpulse/quantum-decisions

### 步骤2: 配置API设置
1. 点击页面上的"设置"或"API配置"
2. 输入你的DeepSeek API密钥: `sk-5c35391ff9f04c73a3ccafff36fed371`
3. 选择提供商: DeepSeek
4. 点击"测试连接"确认配置正确

### 步骤3: 开始决策分析
1. 在文本框中详细描述你的决策场景，例如：
   ```
   我想投资股票市场，有100万资金，希望在3年内获得稳定收益，
   但担心市场波动风险。我有一定的投资经验，倾向于保守投资策略。
   ```

2. 点击"分析决策"按钮

3. 系统会自动提取关键变量：
   - **目标**: 获得稳定收益、资产增值
   - **资源**: 100万资金、投资经验  
   - **风险**: 市场波动、资金损失

4. 基于提取的变量，系统会给出智能建议

## 🧪 API直接测试

如果你想直接测试API功能，可以使用以下命令：

### 测试聊天功能
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "message": "你好，我想了解投资建议",
    "apiKey": "sk-5c35391ff9f04c73a3ccafff36fed371",
    "provider": "deepseek"
  }' \
  http://wavefunction.top/api/api/chat-standalone.php
```

### 测试决策分析
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "text": "我想创业开一家咖啡店，有50万启动资金，但担心竞争激烈。",
    "llmSettings": {
      "apiKey": "sk-5c35391ff9f04c73a3ccafff36fed371",
      "provider": "deepseek"
    }
  }' \
  http://wavefunction.top/api/api/extract-variables-standalone.php
```

## 💡 使用技巧

### 1. 最佳决策描述方式
- **具体化**: 提供具体的数字、时间、目标
- **多维度**: 包含目标、资源、约束、风险等多个维度
- **情境化**: 描述具体的使用场景和背景

### 2. API密钥管理
- 当前提供的密钥是演示用途
- 建议申请你自己的DeepSeek API密钥
- 在设置中可以随时更换API密钥

### 3. 功能组合使用
- 先用意识枢纽进行初步对话
- 然后用量子决策进行深度分析
- 最后用资产配置进行具体规划

## 🎨 界面功能

### 语言切换
- 页面右上角有语言切换按钮
- 支持英文/中文切换
- 设置会自动保存

### 响应式设计
- 完美支持桌面端和移动端
- 自适应屏幕尺寸
- 触控友好的交互设计

### 主题风格
- 深色主题为主
- 蓝紫渐变色调
- 玻璃态模糊效果
- 现代化UI设计

## 🔮 高级功能

### Python计算集成
系统后端集成了强大的Python金融计算功能：
- 投资组合优化
- 风险价值计算  
- 期权定价模型
- GARCH波动率模型

### 未来扩展
- 用户注册登录系统
- 个人决策历史记录
- 高级分析报告导出
- 团队协作功能

## 🎊 恭喜！

你的MindPulse智能决策平台已经完全可用！

**立即开始使用**: http://wavefunction.top/Mindpulse/

---

*如有任何问题或需要技术支持，请随时联系。* 