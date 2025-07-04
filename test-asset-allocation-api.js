#!/usr/bin/env node

/**
 * 资产配置API功能测试脚本
 */

const http = require('http');

// 测试配置
const TEST_CONFIG = {
  SERVER_URL: 'http://wavefunction.top',
  API_BASE_URL: 'http://wavefunction.top/api',
  DEEPSEEK_API_KEY: 'sk-5c35391ff9f04c73a3ccafff36fed371'
};

// HTTP请求函数
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            body: body,
            json: null
          };
          
          try {
            result.json = JSON.parse(body);
          } catch (e) {
            // 不是JSON格式
          }
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 测试API连接
async function testApiConnection() {
  console.log('🧪 测试API连接...');
  
  const url = `${TEST_CONFIG.API_BASE_URL}/test-connection.php`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const data = {
    provider: 'deepseek',
    model: 'deepseek-chat',
    apiKey: TEST_CONFIG.DEEPSEEK_API_KEY,
    temperature: 0.7
  };
  
  try {
    const response = await makeRequest(url, options, data);
    console.log(`状态码: ${response.statusCode}`);
    console.log(`响应:`, response.body);
    
    if (response.statusCode === 200) {
      console.log('✅ API连接测试成功');
    } else {
      console.log('❌ API连接测试失败');
    }
  } catch (error) {
    console.log('💥 请求失败:', error.message);
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 MindPulse 资产配置API测试');
  console.log('=' .repeat(40));
  
  await testApiConnection();
  
  console.log('\n📖 使用说明:');
  console.log(`1. 访问: ${TEST_CONFIG.SERVER_URL}/Mindpulse/asset-allocation/`);
  console.log(`2. 点击"设置"标签`);
  console.log(`3. 输入API密钥: ${TEST_CONFIG.DEEPSEEK_API_KEY}`);
  console.log(`4. 点击"测试连接"`);
}

runTests().catch(console.error); 