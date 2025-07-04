// 生产环境配置
export const config = {
  // API基础URL - 指向你的服务器API
  API_BASE_URL: 'https://wavefunction.top/api/mindpulse',
  
  // 网站基础URL
  SITE_URL: 'https://wavefunction.top/Mindpulse',
  
  // 是否为生产环境
  IS_PRODUCTION: true,
  
  // 默认LLM配置
  DEFAULT_LLM: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com/v1'
  }
}; 