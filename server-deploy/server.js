const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS配置
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// 中间件
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// API路由
app.use('/api/mindpilse', require('./api/mindpilot'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: process.env.DB_HOST ? 'configured' : 'not configured'
  });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MindPulse API服务器运行在端口 ${PORT}`);
  console.log(`📊 数据库: ${process.env.DB_HOST}`);
  console.log(`🌐 允许跨域: ${allowedOrigins.join(', ')}`);
});
