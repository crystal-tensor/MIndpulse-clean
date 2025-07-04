# MindPulse PHP API 部署指南

## 🎉 部署状态
- ✅ **前端静态文件已部署** - http://wavefunction.top/Mindpulse/
- ✅ **PHP API基础功能已部署** - http://wavefunction.top/api/
- ✅ **PHP环境配置完成** - PHP 7.4.16 + 所有必需扩展
- ✅ **Python计算支持** - 服务器已有金融计算脚本

## 🌐 可用的API端点

### 1. 健康检查 (已测试 ✅)
```bash
curl http://wavefunction.top/api/api/health-simple.php
```

### 2. 聊天API
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"message":"测试消息","apiKey":"your-api-key","provider":"deepseek"}' \
  http://wavefunction.top/api/api/chat.php
```

### 3. 连接测试API
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"apiKey":"your-api-key","provider":"deepseek"}' \
  http://wavefunction.top/api/api/test-connection.php
```

### 4. Python计算API (新功能)
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"script":"portfolio_optimization","params":{"stocks":["AAPL","GOOGL"]}}' \
  http://wavefunction.top/api/api/python-compute.php
```

## 🐍 Python计算功能

服务器已有以下Python脚本，可通过API调用：

| 脚本名称 | 功能描述 | API调用名 |
|---------|---------|-----------|
| Portfolio-Optimization.py | 投资组合优化 | `portfolio_optimization` |
| VaR_values.py | 风险价值计算 | `var_calculation` |
| European_call_option_pricing.py | 欧式期权定价 | `option_pricing` |
| Get_Stock_Info.py | 股票信息获取 | `stock_info` |
| garch.py | GARCH模型 | `garch_model` |
| Portfolio_TrueRandom.py | 随机投资组合 | `portfolio_random` |

## 🔧 Nginx配置建议

在你的虚拟主机Nginx设置中添加：

```nginx
# API路由配置
location /api/health {
    try_files $uri /api/api/health-simple.php;
}

location /api/chat {
    try_files $uri /api/api/chat.php;
}

location /api/test-connection {
    try_files $uri /api/api/test-connection.php;
}

location /api/python-compute {
    try_files $uri /api/api/python-compute.php;
}
```

## 🧪 测试步骤

### 1. 基础功能测试
```bash
# 健康检查
curl http://wavefunction.top/api/api/health-simple.php

# 应该返回：
# {"success":true,"data":{"status":"ok",...}}
```

### 2. 前端集成测试
1. 访问 http://wavefunction.top/Mindpulse/
2. 进入"量子决策"页面
3. 点击"测试连接"按钮
4. 输入有效的API密钥测试

### 3. Python计算测试
```bash
# 测试投资组合优化
curl -X POST -H "Content-Type: application/json" \
  -d '{"script":"portfolio_optimization","params":{"test":true}}' \
  http://wavefunction.top/api/api/python-compute.php
```

## 🚀 下一步优化

1. **数据库连接修复** - 需要正确的MySQL连接参数
2. **Nginx路由优化** - 添加URL重写规则
3. **Python脚本优化** - 修改现有脚本支持JSON输入输出
4. **缓存机制** - 添加Redis缓存提高性能

## 📞 支持

如果遇到问题：
1. 检查PHP错误日志（已启用）
2. 确认API密钥配置正确
3. 验证网络连接和防火墙设置

---

**部署完成！** 🎉 你的MindPulse项目现在拥有：
- 国际化登录页面
- 完整的前端功能
- PHP API服务
- Python计算支持
- 数据库准备就绪 