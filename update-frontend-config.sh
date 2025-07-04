#!/bin/bash

# 更新前端配置以连接API服务器
echo "🔧 更新前端配置..."

# 创建新的前端配置文件
cat > config/api.js << 'EOF'
// API配置 - 指向后端服务器
export const API_CONFIG = {
  // API基础URL
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'http://8.219.57.204:3001/api/mindpilse'
    : 'http://localhost:3001/api/mindpilse',
  
  // 支持的API端点
  ENDPOINTS: {
    CHAT: '/chat',
    TEST_CONNECTION: '/test-connection',
    EXTRACT_VARIABLES: '/extract-variables',
    QUANTUM_SOLVE: '/quantum-solve',
    ASSET_ALLOCATION: '/asset-allocation',
    GENERATE_REPORT: '/generate-report',
    ASTOCK_DATA: '/astock-data',
    YAHOO_FINANCE: '/yahoo-finance',
    INDEX_DATA: '/index-data',
    CONVERSATIONS: '/conversations',
    FILES: '/files',
    GENERATE_GRAPH: '/generate-graph'
  },
  
  // 请求配置
  REQUEST: {
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

// API请求封装函数
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config = {
    ...API_CONFIG.REQUEST,
    ...options,
    headers: {
      ...API_CONFIG.REQUEST.headers,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// 测试API连接
export async function testApiConnection() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api/mindpilse', '')}/health`);
    const data = await response.json();
    return {
      success: true,
      status: data.status,
      timestamp: data.timestamp,
      database: data.database
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
EOF

# 创建环境变量文件
cat > .env.local << 'EOF'
# 本地开发环境
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/mindpilse
NEXT_PUBLIC_API_HEALTH_URL=http://localhost:3001/health
EOF

cat > .env.production << 'EOF'
# 生产环境
NEXT_PUBLIC_API_BASE_URL=http://8.219.57.204:3001/api/mindpilse
NEXT_PUBLIC_API_HEALTH_URL=http://8.219.57.204:3001/health
EOF

# 修改前端页面配置
echo "📝 更新前端组件配置..."

# 创建一个配置更新的JS文件
cat > update-api-calls.js << 'EOF'
const fs = require('fs');
const path = require('path');

// 需要更新的文件列表
const filesToUpdate = [
  'components/pages/QuantumDecisions.tsx',
  'components/pages/AssetAllocation.tsx',
  'components/pages/AIExplorationHubV2.tsx',
  'components/pages/ConsciousnessHub.tsx'
];

// API URL替换规则
const replacements = [
  {
    from: /\/api\/mindpilot\//g,
    to: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://8.219.57.204:3001/api/mindpilse'}/`
  },
  {
    from: /fetch\(['"`]\/api\/mindpilot\//g,
    to: `fetch('${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://8.219.57.204:3001/api/mindpilse'}/`
  }
];

// 更新文件
filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ 更新文件: ${filePath}`);
  } else {
    console.log(`⚠️ 文件不存在: ${filePath}`);
  }
});

console.log('🎉 API配置更新完成！');
EOF

# 运行配置更新
node update-api-calls.js

# 重新构建前端
echo "🔄 重新构建前端..."
export NODE_ENV=production
npm run build

# 重新创建FTP上传文件
echo "📁 重新创建FTP上传文件..."
rm -rf ftp-upload
mkdir -p ftp-upload
cp -r .next-prod/* ftp-upload/
cp public/.htaccess ftp-upload/.htaccess

echo "✅ 前端配置更新完成！"
echo ""
echo "📋 配置变更："
echo "- API服务器: http://8.219.57.204:3001"
echo "- 健康检查: http://8.219.57.204:3001/health"
echo "- 前端文件已重新构建"
echo ""
echo "🔄 下一步："
echo "1. 上传新的前端文件: ./auto-ftp-deploy.sh"
echo "2. 部署后端API服务: ./deploy-backend-api.sh"
echo "3. 在服务器上启动API服务"

# 清理临时文件
rm -f update-api-calls.js 