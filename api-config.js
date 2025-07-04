// API配置文件 - 将前端API调用映射到新的PHP API端点
const API_CONFIG = {
  // 基础URL
  BASE_URL: 'http://wavefunction.top/api/api',
  
  // API端点映射
  ENDPOINTS: {
    // 测试连接
    'test-connection': 'test-connection-standalone.php',
    
    // 聊天功能
    'chat': 'chat-standalone.php',
    
    // 变量提取
    'extract-variables': 'extract-variables-standalone.php',
    
    // 健康检查
    'health': 'health-simple.php',
    
    // Python计算
    'python-compute': 'python-compute.php'
  },
  
  // 默认API密钥 (用于演示)
  DEFAULT_API_KEY: 'sk-5c35391ff9f04c73a3ccafff36fed371',
  
  // 默认设置
  DEFAULT_SETTINGS: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    temperature: 0.7
  }
};

// 辅助函数：构建完整的API URL
function buildApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS[endpoint] || endpoint}`;
}

// 辅助函数：发送API请求
async function callApi(endpoint, data = {}, method = 'POST') {
  const url = buildApiUrl(endpoint);
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'POST' ? JSON.stringify(data) : undefined
  });
  
  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }
  
  return await response.json();
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, buildApiUrl, callApi };
} else {
  window.API_CONFIG = API_CONFIG;
  window.buildApiUrl = buildApiUrl;
  window.callApi = callApi;
} 