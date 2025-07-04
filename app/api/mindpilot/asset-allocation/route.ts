import { NextRequest, NextResponse } from 'next/server';

// 定义变量类型
interface DecisionVariable {
  id: string;
  type: '目标' | '资产' | '风险';
  name: string;
  value: string;
  confidence: number;
  weight: number;
  editable: boolean;
}

// 请求接口
interface ExtractRequest {
  message: string;
  phase: number;
  sessionId: string;
  llmSettings?: any;
}

// 会话存储
const sessionStore = new Map<string, {
  goals: string[];
  assets: string[];
  risks: string[];
}>();

// 合并变量到会话
function mergeVariables(sessionId: string, newVars: {
  goals: string[];
  assets: string[];
  risks: string[];
}) {
  const existing = sessionStore.get(sessionId) || { goals: [], assets: [], risks: [] };
  
  const merged = {
    goals: Array.from(new Set([...existing.goals, ...newVars.goals])),
    assets: Array.from(new Set([...existing.assets, ...newVars.assets])),
    risks: Array.from(new Set([...existing.risks, ...newVars.risks]))
  };
  
  sessionStore.set(sessionId, merged);
  return merged;
}

// 模型提供方配置
const modelProviders = {
  'deepseek': {
    'base_url': 'https://api.deepseek.com/v1',
    'default_model': 'deepseek-chat'
  },
  'openai': {
    'base_url': 'https://api.openai.com/v1',
    'default_model': 'gpt-4'
  },
  'claude': {
    'base_url': 'https://api.anthropic.com/v1',
    'default_model': 'claude-3-haiku'
  }
};

// 模拟提取响应函数（用于没有API密钥时的演示）
function simulateExtractionResponse(text: string, phase: number): any {
  const lowerText = text.toLowerCase();
  
  // 根据关键词模拟提取
  const goals: string[] = [];
  const assets: string[] = [];
  const risks: string[] = [];
  
  // 提取投资目标
  if (lowerText.includes('稳定') || lowerText.includes('保守')) {
    goals.push('稳定收益');
  }
  if (lowerText.includes('增长') || lowerText.includes('长期')) {
    goals.push('长期增长');
  }
  if (lowerText.includes('退休') || lowerText.includes('养老')) {
    goals.push('退休规划');
  }
  if (/\d+万/.test(text) || /\d+元/.test(text)) {
    const amount = text.match(/(\d+)万/) || text.match(/(\d+)元/);
    if (amount) {
      goals.push(`投资${amount[1]}${amount[0].includes('万') ? '万元' : '元'}`);
    }
  }
  
  // 提取资产类型（A股市场）
  if (lowerText.includes('银行') || lowerText.includes('金融')) {
    assets.push('平安银行');
    assets.push('招商银行');
  }
  if (lowerText.includes('茅台') || lowerText.includes('白酒')) {
    assets.push('贵州茅台');
  }
  if (lowerText.includes('新能源') || lowerText.includes('电动车') || lowerText.includes('比亚迪')) {
    assets.push('比亚迪');
  }
  if (lowerText.includes('电池') || lowerText.includes('宁德')) {
    assets.push('宁德时代');
  }
  if (lowerText.includes('科技') || lowerText.includes('技术') || lowerText.includes('海康')) {
    assets.push('海康威视');
  }
  if (lowerText.includes('家电') || lowerText.includes('美的') || lowerText.includes('格力')) {
    assets.push('美的集团');
    assets.push('格力电器');
  }
  if (lowerText.includes('医药') || lowerText.includes('恒瑞')) {
    assets.push('恒瑞医药');
  }
  if (lowerText.includes('基金') || lowerText.includes('ETF')) {
    assets.push('沪深300ETF');
    assets.push('上证50ETF');
  }
  if (lowerText.includes('股票') || lowerText.includes('股市')) {
    // 默认推荐一些热门A股
    assets.push('平安银行');
    assets.push('招商银行');
    assets.push('贵州茅台');
  }
  
  // 提取风险因素
  if (lowerText.includes('风险') && (lowerText.includes('低') || lowerText.includes('保守'))) {
    risks.push('低风险偏好');
  }
  if (lowerText.includes('风险') && (lowerText.includes('中') || lowerText.includes('适中'))) {
    risks.push('中等风险承受');
  }
  if (lowerText.includes('风险') && (lowerText.includes('高') || lowerText.includes('激进'))) {
    risks.push('高风险承受');
  }
  if (/\d+年/.test(text)) {
    const years = text.match(/(\d+)年/);
    if (years) {
      risks.push(`投资期限${years[1]}年`);
    }
  }
  
  // 生成回应
  let aiResponse = "感谢您提供的信息！";
  if (phase === 1) {
    aiResponse = `我了解了您的投资目标。${goals.length > 0 ? `特别是关于${goals.join('、')}的需求。` : '请告诉我更多关于您期望实现的投资目标。'}`;
  } else if (phase === 2) {
    aiResponse = `很好，我理解您的资产偏好。${assets.length > 0 ? `您提到的${assets.join('、')}都是不错的选择。` : '您可以告诉我更多关于您感兴趣的投资品种。'}`;
  } else if (phase === 3) {
    aiResponse = `明白了您的风险偏好。${risks.length > 0 ? `考虑到您${risks.join('、')}的特点，我们会相应调整配置策略。` : '请告诉我您的风险承受能力和投资期限。'}`;
  }
  
  // 判断是否显示总结 - 总是显示以便用户确认每个阶段
  const shouldShowSummary = true;
  
  return {
    goals,
    assets,
    risks,
    aiResponse,
    shouldShowSummary
  };
}

const EXTRACTION_SYSTEM_PROMPT = `
你是一个专业的A股资产配置顾问，负责从用户的自然语言描述中提取结构化的投资决策要素。

请严格按照以下JSON格式返回结果：
{
  "goals": ["目标1", "目标2"],
  "assets": ["资产1", "资产2"], 
  "risks": ["风险1", "风险2"],
  "aiResponse": "对用户输入的回应",
  "shouldShowSummary": true/false
}

提取规则：
1. goals: 用户的投资目标、期望收益、投资期限等
2. assets: 用户可投资的A股资产类型：个股、ETF基金、行业板块等  
3. risks: 风险约束、投资限制、风险承受能力等

如果某个类别没有新内容，返回空数组。
用简洁的短语描述每个要素，不要包含模板默认内容。
总是设置shouldShowSummary为true，以便用户可以确认每个阶段。
重要：只提取用户实际提到的内容，不要添加任何默认的或假设的内容。

对于A股资产类型，请提取具体的资产名称，如：
- 平安银行、招商银行、贵州茅台、比亚迪、宁德时代（具体个股名称）
- 沪深300ETF、上证50ETF、中证500ETF（具体ETF名称）
- 不要使用"银行股"、"科技股"等泛化描述，要具体到个股名称

可参考的A股资产包括但不限于：
金融：平安银行、招商银行、工商银行、建设银行、中国平安、中信证券
消费：贵州茅台、五粮液、美的集团、格力电器
科技：海康威视、立讯精密、东方财富、同花顺
新能源：比亚迪、宁德时代
医药：恒瑞医药、药明康德
工业：三一重工、中国中车
ETF：沪深300ETF、上证50ETF、中证500ETF、创业板ETF、科技ETF
`;

async function callLLMAPI(text: string, phase: number, llmSettings?: any): Promise<any> {
  // 优先使用前端传递的设置，否则使用环境变量
  const apiKey = llmSettings?.apiKey || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
  const provider = llmSettings?.provider || process.env.LLM_PROVIDER || 'deepseek';
  const model = llmSettings?.model || (provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini');
  const temperature = llmSettings?.temperature || 0.2;
  const baseUrl = llmSettings?.baseUrl || (provider === 'deepseek' ? 'https://api.deepseek.com/v1' : 'https://api.openai.com/v1');
  
  // 如果没有API密钥，使用模拟响应
  if (!apiKey) {
    return simulateExtractionResponse(text, phase);
  }

  const phaseContext = {
    1: "当前阶段：目标确认。重点提取用户的投资目标和期望。",
    2: "当前阶段：资产识别。重点提取用户的可投资资产类型。", 
    3: "当前阶段：风险评估。重点提取用户的风险约束条件。"
  };

  const systemPrompt = EXTRACTION_SYSTEM_PROMPT + "\n\n" + (phaseContext[phase as keyof typeof phaseContext] || "");

  try {
    // 构建API请求URL
    const apiUrl = `${baseUrl}/chat/completions`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: temperature,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${provider.toUpperCase()} API错误: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('LLM API调用失败:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ExtractRequest = await request.json();
    const { message, phase, sessionId, llmSettings } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 调用LLM进行变量提取
    const extracted = await callLLMAPI(message, phase, llmSettings);
    
    // 合并到会话存储
    const mergedVariables = mergeVariables(sessionId, {
      goals: extracted.goals || [],
      assets: extracted.assets || [],
      risks: extracted.risks || []
    });

    // 生成AI回应
    let aiResponse = extracted.aiResponse || "我已经分析了您的输入并提取了相关信息。";
    
    // 根据阶段调整回应
    if (phase === 1 && extracted.goals?.length > 0) {
      aiResponse = `我理解了您的投资目标。${extracted.goals.length > 1 ? '看起来您有多个目标' : '您的目标很明确'}。`;
    } else if (phase === 2 && extracted.assets?.length > 0) {
      aiResponse = `很好，我了解了您的资产偏好。这些${extracted.assets.length > 1 ? '资产' : '资产'}将构成您的投资组合。`;
    } else if (phase === 3 && extracted.risks?.length > 0) {
      aiResponse = `明白了您的风险约束条件。我们在优化配置时会充分考虑这些${extracted.risks.length > 1 ? '限制因素' : '限制因素'}。`;
    }

    return NextResponse.json({
      extracted: mergedVariables,
      aiResponse,
      shouldShowSummary: extracted.shouldShowSummary || false,
      currentPhaseCount: {
        goals: extracted.goals?.length || 0,
        assets: extracted.assets?.length || 0,
        risks: extracted.risks?.length || 0
      }
    });

  } catch (error) {
    console.error('资产配置API错误:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '处理请求时发生错误' },
      { status: 500 }
    );
  }
}

// 获取会话变量的GET接口
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少sessionId参数' },
        { status: 400 }
      );
    }

    const variables = sessionStore.get(sessionId) || { goals: [], assets: [], risks: [] };
    
    return NextResponse.json({
      variables,
      totalCount: variables.goals.length + variables.assets.length + variables.risks.length
    });

  } catch (error) {
    console.error('获取会话变量错误:', error);
    
    return NextResponse.json(
      { error: '获取变量失败' },
      { status: 500 }
    );
  }
} 