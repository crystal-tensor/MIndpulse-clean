# 智核交互测试连接功能使用指南

## 功能说明

测试连接功能已经完全修复并优化，现在可以正常验证API配置是否正确。

## 使用步骤

### 1. 访问设置页面
- 打开智核交互界面：`http://localhost:3001/ai-exploration`
- 点击右上角的设置按钮（齿轮图标）

### 2. 配置大模型设置
1. **选择模型提供商**：DeepSeek、OpenAI、Claude、Gemini、通义千问
2. **选择具体模型**：根据提供商自动显示可用模型
3. **输入API密钥**：输入有效的API密钥
4. **配置基础URL**（可选）：如需使用自定义端点

### 3. 测试连接
1. 确保已配置API密钥和选择模型
2. 点击绿色的"测试连接"按钮
3. 观察测试结果：
   - **成功**：显示"连接测试成功！模型：xxx"
   - **失败**：显示具体错误信息

## 测试状态指示

- **测试中**：按钮显示旋转图标和"测试中..."文字
- **按钮禁用**：测试期间按钮变灰，防止重复点击
- **实时反馈**：顶部通知栏显示测试进度和结果

## 常见错误及解决方案

### 1. "请先配置API密钥"
**原因**：未输入API密钥
**解决**：在API密钥输入框中输入有效密钥

### 2. "请先选择模型"
**原因**：未选择具体模型
**解决**：在模型下拉列表中选择一个模型

### 3. "Authentication Fails"
**原因**：API密钥无效或过期
**解决**：检查API密钥是否正确，或重新生成密钥

### 4. "API错误: 401"
**原因**：认证失败
**解决**：验证API密钥格式和有效性

### 5. "API错误: 404"
**原因**：API端点不正确
**解决**：检查基础URL设置，或使用默认端点

### 6. "连接测试失败，请检查网络和设置"
**原因**：网络连接问题
**解决**：检查网络连接和防火墙设置

## 支持的提供商

### DeepSeek
- **默认端点**：`https://api.deepseek.com/chat/completions`
- **模型示例**：deepseek-chat, deepseek-coder

### OpenAI
- **默认端点**：`https://api.openai.com/v1/chat/completions`
- **模型示例**：gpt-3.5-turbo, gpt-4

### Claude
- **默认端点**：`https://api.anthropic.com/v1/messages`
- **模型示例**：claude-3-haiku-20240307

### Gemini
- **默认端点**：`https://generativelanguage.googleapis.com/v1/models/`
- **模型示例**：gemini-pro

### 通义千问
- **默认端点**：`https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- **模型示例**：qwen-turbo

## 技术细节

### API请求格式
```json
{
  "provider": "deepseek",
  "model": "deepseek-chat", 
  "apiKey": "your-api-key",
  "baseUrl": "optional-custom-url"
}
```

### 成功响应示例
```json
{
  "success": true,
  "message": "连接测试成功",
  "details": {
    "model": "deepseek-chat",
    "usage": {...},
    "response": "连接成功"
  }
}
```

### 错误响应示例
```json
{
  "error": "连接测试失败",
  "details": "DeepSeek API错误: 401 - Authentication Fails"
}
```

## 注意事项

1. **API密钥安全**：请妥善保管API密钥，不要分享给他人
2. **网络要求**：确保网络可以访问相应的API端点
3. **配额限制**：注意API调用配额和费用
4. **模型可用性**：不同提供商的模型可用性可能有差异

测试连接功能现已完全正常工作！🎉 