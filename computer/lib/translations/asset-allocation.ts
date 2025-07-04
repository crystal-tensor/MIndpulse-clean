export type Language = 'zh' | 'en';

export interface AssetAllocationTranslation {
  // 页面标题
  title: string;
  subtitle: string;
  description: string;
  
  // 阶段标题
  phases: {
    goal: string;
    asset: string;
    risk: string;
    summary: string;
  };
  
  // 对话相关
  dialogue: {
    welcomeMessage: string;
    goalPrompt: string;
    assetPrompt: string;
    riskPrompt: string;
    goalPlaceholder: string;
    assetPlaceholder: string;
    riskPlaceholder: string;
    confirmGoal: string;
    confirmAsset: string;
    confirmRisk: string;
    confirmMessage: {
      goal: string;
      asset: string;
      risk: string;
    };
    phaseConfirm: {
      goal: string;
      asset: string;
      risk: string;
    };
  };
  
  // 变量类型
  variableTypes: {
    goal: string;
    asset: string;
    risk: string;
  };
  
  // 计算相关
  computation: {
    algorithmSelection: string;
    quantumAlgorithm: string;
    classicalAlgorithm: string;
    startComputation: string;
    computing: string;
    computationComplete: string;
    viewReport: string;
    recalculate: string;
    progress: string;
    iterations: string;
    currentIteration: string;
    energy: string;
    convergence: string;
  };
  
  // 报告相关
  report: {
    title: string;
    optimizationResults: string;
    assetTable: {
      assetName: string;
      currentPrice: string;
      weightBefore: string;
      weightAfter: string;
      returnRate: string;
      sharpeRatio: string;
      maxDrawdown: string;
    };
    portfolioComparison: string;
    beforeOptimization: string;
    afterOptimization: string;
    returnCurve: string;
    priceChart: string;
    algorithmComparison: string;
    quantumResults: string;
    classicalResults: string;
  };
  
  // 设置
  settings: {
    llmSettings: string;
    provider: string;
    model: string;
    apiKey: string;
    temperature: string;
    baseUrl: string;
    testConnection: string;
    save: string;
    reset: string;
    systemSettings: string;
    riskPreference: string;
    quantumBackend: string;
    language: string;
    theme: string;
    autoSave: string;
    emailNotification: string;
  };
  
  // 状态消息
  status: {
    idle: string;
    running: string;
    completed: string;
    error: string;
    connecting: string;
    connected: string;
    connectionFailed: string;
    saving: string;
    saved: string;
    extracting: string;
  };
  
  // 按钮
  buttons: {
    send: string;
    confirm: string;
    cancel: string;
    next: string;
    previous: string;
    start: string;
    stop: string;
    retry: string;
    close: string;
    back: string;
  };
  
  // 标签页
  tabs: {
    dialogue: string;
    summary: string;
    quantum: string;
    solutions: string;
    history: string;
    settings: string;
  };
  
  // 错误消息
  errors: {
    networkError: string;
    apiError: string;
    extractionFailed: string;
    computationFailed: string;
    invalidInput: string;
    missingApiKey: string;
    connectionTimeout: string;
  };
  
  // 成功消息
  success: {
    variablesExtracted: string;
    computationCompleted: string;
    settingsSaved: string;
    reportGenerated: string;
  };
}

export const AssetAllocationTranslations: Record<Language, AssetAllocationTranslation> = {
  zh: {
    title: '资产配置',
    subtitle: 'Asset Allocation',
    description: '量子智能资产配置系统',
    
    phases: {
      goal: '目标确认',
      asset: '资产识别',
      risk: '风险评估',
      summary: '配置摘要',
    },
    
    dialogue: {
      welcomeMessage: '欢迎来到资产配置系统！我是您的量子投资顾问。请先描述您的投资目标，比如：预期收益率、投资期限、风险偏好等。',
      goalPrompt: '请详细描述您的投资目标。您希望通过这次资产配置达到什么样的投资收益？投资期限是多久？',
      assetPrompt: '现在让我们了解您可以投资的资产类型。请告诉我您考虑投资的资产有哪些？比如：股票、债券、基金、房地产、黄金等。',
      riskPrompt: '最后，让我们评估风险约束。请告诉我您的风险承受能力如何？有哪些投资限制或约束条件？',
      goalPlaceholder: '描述您的投资目标...',
      assetPlaceholder: '列出您的可投资资产...',
      riskPlaceholder: '说明风险约束条件...',
      confirmGoal: '确认目标',
      confirmAsset: '确认资产',
      confirmRisk: '确认风险',
      confirmMessage: {
        goal: '投资目标信息是否完整？可以进入资产识别了吗？',
        asset: '资产信息是否完整？可以进入风险评估了吗？',
        risk: '风险约束信息是否完整？可以进入配置摘要了吗？',
      },
      phaseConfirm: {
        goal: '很好！现在让我们来识别一下您的可投资资产。',
        asset: '了解了您的资产情况。接下来请告诉我您的风险约束条件。',
        risk: '明白了您的风险偏好。让我们开始进行量子优化计算。',
      },
    },
    
    variableTypes: {
      goal: '目标',
      asset: '资产',
      risk: '风险',
    },
    
    computation: {
      algorithmSelection: '算法选择',
      quantumAlgorithm: '量子算法(QUBO)',
      classicalAlgorithm: '经典算法',
      startComputation: '开始计算',
      computing: '计算中...',
      computationComplete: '计算完成',
      viewReport: '查看报告',
      recalculate: '重新计算',
      progress: '进度',
      iterations: '迭代次数',
      currentIteration: '当前迭代',
      energy: '能量',
      convergence: '收敛性',
    },
    
    report: {
      title: '资产配置优化报告',
      optimizationResults: '优化结果',
      assetTable: {
        assetName: '资产名称',
        currentPrice: '当前价格',
        weightBefore: '优化前权重',
        weightAfter: '优化后权重',
        returnRate: '收益率',
        sharpeRatio: '夏普比率',
        maxDrawdown: '最大回撤',
      },
      portfolioComparison: '组合对比',
      beforeOptimization: '优化前',
      afterOptimization: '优化后',
      returnCurve: '收益率曲线',
      priceChart: '价格走势图',
      algorithmComparison: '算法对比',
      quantumResults: '量子算法结果',
      classicalResults: '经典算法结果',
    },
    
    settings: {
      llmSettings: 'LLM设置',
      provider: '服务提供商',
      model: '模型',
      apiKey: 'API密钥',
      temperature: '温度',
      baseUrl: '基础URL',
      testConnection: '测试连接',
      save: '保存',
      reset: '重置',
      systemSettings: '系统设置',
      riskPreference: '风险偏好',
      quantumBackend: '量子后端',
      language: '语言',
      theme: '主题',
      autoSave: '自动保存',
      emailNotification: '邮件通知',
    },
    
    status: {
      idle: '空闲',
      running: '运行中',
      completed: '已完成',
      error: '错误',
      connecting: '连接中',
      connected: '已连接',
      connectionFailed: '连接失败',
      saving: '保存中',
      saved: '已保存',
      extracting: '提取中',
    },
    
    buttons: {
      send: '发送',
      confirm: '确认',
      cancel: '取消',
      next: '下一步',
      previous: '上一步',
      start: '开始',
      stop: '停止',
      retry: '重试',
      close: '关闭',
      back: '返回',
    },
    
    tabs: {
      dialogue: '对话',
      summary: '摘要',
      quantum: '量子计算',
      solutions: '解决方案',
      history: '历史',
      settings: '设置',
    },
    
    errors: {
      networkError: '网络错误，请检查网络连接',
      apiError: 'API调用失败，请检查设置',
      extractionFailed: '变量提取失败，请重试',
      computationFailed: '计算失败，请检查输入参数',
      invalidInput: '输入无效，请检查格式',
      missingApiKey: '缺少API密钥，请在设置中配置',
      connectionTimeout: '连接超时，请重试',
    },
    
    success: {
      variablesExtracted: '变量提取成功',
      computationCompleted: '计算完成',
      settingsSaved: '设置保存成功',
      reportGenerated: '报告生成成功',
    },
  },
  
  en: {
    title: 'Asset Allocation',
    subtitle: 'Asset Allocation',
    description: 'Quantum Intelligent Asset Allocation System',
    
    phases: {
      goal: 'Goal Setting',
      asset: 'Asset Identification',
      risk: 'Risk Assessment',
      summary: 'Configuration Summary',
    },
    
    dialogue: {
      welcomeMessage: 'Welcome to the Asset Allocation System! I am your quantum investment advisor. Please first describe your investment goals, such as: expected returns, investment horizon, risk preferences, etc.',
      goalPrompt: 'Please describe your investment goals in detail. What kind of investment returns do you hope to achieve through this asset allocation? What is your investment timeline?',
      assetPrompt: 'Now let\'s understand the types of assets you can invest in. Please tell me what assets you are considering investing in? For example: stocks, bonds, funds, real estate, gold, etc.',
      riskPrompt: 'Finally, let\'s assess risk constraints. Please tell me about your risk tolerance. What investment restrictions or constraints do you have?',
      goalPlaceholder: 'Describe your investment goals...',
      assetPlaceholder: 'List your investable assets...',
      riskPlaceholder: 'Explain risk constraints...',
      confirmGoal: 'Confirm Goals',
      confirmAsset: 'Confirm Assets',
      confirmRisk: 'Confirm Risks',
      confirmMessage: {
        goal: 'Is the investment goal information complete? Can we proceed to asset identification?',
        asset: 'Is the asset information complete? Can we proceed to risk assessment?',
        risk: 'Is the risk constraint information complete? Can we proceed to configuration summary?',
      },
      phaseConfirm: {
        goal: 'Great! Now let\'s identify your investable assets.',
        asset: 'I understand your asset situation. Next, please tell me about your risk constraints.',
        risk: 'I understand your risk preferences. Let\'s start the quantum optimization calculation.',
      },
    },
    
    variableTypes: {
      goal: 'Goal',
      asset: 'Asset',
      risk: 'Risk',
    },
    
    computation: {
      algorithmSelection: 'Algorithm Selection',
      quantumAlgorithm: 'Quantum Algorithm (QUBO)',
      classicalAlgorithm: 'Classical Algorithm',
      startComputation: 'Start Computation',
      computing: 'Computing...',
      computationComplete: 'Computation Complete',
      viewReport: 'View Report',
      recalculate: 'Recalculate',
      progress: 'Progress',
      iterations: 'Iterations',
      currentIteration: 'Current Iteration',
      energy: 'Energy',
      convergence: 'Convergence',
    },
    
    report: {
      title: 'Asset Allocation Optimization Report',
      optimizationResults: 'Optimization Results',
      assetTable: {
        assetName: 'Asset Name',
        currentPrice: 'Current Price',
        weightBefore: 'Weight Before',
        weightAfter: 'Weight After',
        returnRate: 'Return Rate',
        sharpeRatio: 'Sharpe Ratio',
        maxDrawdown: 'Max Drawdown',
      },
      portfolioComparison: 'Portfolio Comparison',
      beforeOptimization: 'Before Optimization',
      afterOptimization: 'After Optimization',
      returnCurve: 'Return Curve',
      priceChart: 'Price Chart',
      algorithmComparison: 'Algorithm Comparison',
      quantumResults: 'Quantum Algorithm Results',
      classicalResults: 'Classical Algorithm Results',
    },
    
    settings: {
      llmSettings: 'LLM Settings',
      provider: 'Provider',
      model: 'Model',
      apiKey: 'API Key',
      temperature: 'Temperature',
      baseUrl: 'Base URL',
      testConnection: 'Test Connection',
      save: 'Save',
      reset: 'Reset',
      systemSettings: 'System Settings',
      riskPreference: 'Risk Preference',
      quantumBackend: 'Quantum Backend',
      language: 'Language',
      theme: 'Theme',
      autoSave: 'Auto Save',
      emailNotification: 'Email Notification',
    },
    
    status: {
      idle: 'Idle',
      running: 'Running',
      completed: 'Completed',
      error: 'Error',
      connecting: 'Connecting',
      connected: 'Connected',
      connectionFailed: 'Connection Failed',
      saving: 'Saving',
      saved: 'Saved',
      extracting: 'Extracting',
    },
    
    buttons: {
      send: 'Send',
      confirm: 'Confirm',
      cancel: 'Cancel',
      next: 'Next',
      previous: 'Previous',
      start: 'Start',
      stop: 'Stop',
      retry: 'Retry',
      close: 'Close',
      back: 'Back',
    },
    
    tabs: {
      dialogue: 'Dialogue',
      summary: 'Summary',
      quantum: 'Quantum',
      solutions: 'Solutions',
      history: 'History',
      settings: 'Settings',
    },
    
    errors: {
      networkError: 'Network error, please check your connection',
      apiError: 'API call failed, please check settings',
      extractionFailed: 'Variable extraction failed, please retry',
      computationFailed: 'Computation failed, please check input parameters',
      invalidInput: 'Invalid input, please check format',
      missingApiKey: 'Missing API key, please configure in settings',
      connectionTimeout: 'Connection timeout, please retry',
    },
    
    success: {
      variablesExtracted: 'Variables extracted successfully',
      computationCompleted: 'Computation completed',
      settingsSaved: 'Settings saved successfully',
      reportGenerated: 'Report generated successfully',
    },
  },
};

// 导出翻译函数
export function getAssetAllocationTranslation(language: Language): AssetAllocationTranslation {
  return AssetAllocationTranslations[language];
}

// 导出默认语言
export const DEFAULT_LANGUAGE: Language = 'zh'; 