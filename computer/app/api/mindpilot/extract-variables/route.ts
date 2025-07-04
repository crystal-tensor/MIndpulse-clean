import { NextRequest, NextResponse } from 'next/server';

interface ExtractRequest {
  message: string;
  phase: number;
  sessionId: string;
  llmSettings?: {
    provider: string;
    model: string;
    apiKey: string;
    temperature: number;
    baseUrl?: string;
  };
}

interface ExtractedVariables {
  goals: string[];
  assets: string[];
  risks: string[];
}

// 模型提供方配置 (从PVE/MindPilot参考)
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

const EXTRACTION_SYSTEM_PROMPT = `
你是一个专业的资产配置顾问，负责从用户的自然语言描述中提取结构化的投资决策要素。

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
2. assets: 用户可投资的资产类型：股票、债券、基金、房地产、黄金等  
3. risks: 风险约束、投资限制、风险承受能力等

如果某个类别没有新内容，返回空数组。
用简洁的短语描述每个要素，不要包含模板默认内容。
当用户在当前阶段提供了足够信息时，设置shouldShowSummary为true。
重要：只提取用户实际提到的内容，不要添加任何默认的或假设的内容。
`;

async function callLLMAPI(text: string, phase: number, llmSettings?: any): Promise<any> {
  // 优先使用前端传递的设置，否则使用环境变量
  const apiKey = llmSettings?.apiKey || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
  const provider = llmSettings?.provider || process.env.LLM_PROVIDER || 'deepseek';
  const model = llmSettings?.model || (provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini');
  const temperature = llmSettings?.temperature || 0.2;
  const baseUrl = llmSettings?.baseUrl || (provider === 'deepseek' ? 'https://api.deepseek.com/v1' : 'https://api.openai.com/v1');
  
  if (!apiKey) {
    throw new Error('LLM API密钥未配置');
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

// Redis模拟存储 (生产环境应使用真实Redis)
const sessionStore = new Map<string, ExtractedVariables>();

function mergeVariables(sessionId: string, newVariables: ExtractedVariables): ExtractedVariables {
  const existing = sessionStore.get(sessionId) || { goals: [], assets: [], risks: [] };
  
  const merged = {
    goals: Array.from(new Set([...existing.goals, ...newVariables.goals])),
    assets: Array.from(new Set([...existing.assets, ...newVariables.assets])),
    risks: Array.from(new Set([...existing.risks, ...newVariables.risks]))
  };
  
  sessionStore.set(sessionId, merged);
  return merged;
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
      aiResponse = `我理解了您的目标。${extracted.goals.length > 1 ? '看起来您有多个目标' : '您的目标很明确'}。`;
    } else if (phase === 2 && extracted.resources?.length > 0) {
      aiResponse = `很好，我了解了您的资源情况。这些${extracted.resources.length > 1 ? '资源' : '资源'}将有助于实现您的目标。`;
    } else if (phase === 3 && extracted.constraints?.length > 0) {
      aiResponse = `明白了您的约束条件。我们在制定方案时会充分考虑这些${extracted.constraints.length > 1 ? '限制因素' : '限制因素'}。`;
    }

    return NextResponse.json({
      extracted: mergedVariables,
      aiResponse,
      shouldShowSummary: extracted.shouldShowSummary || false,
      currentPhaseCount: {
        goals: extracted.goals?.length || 0,
        resources: extracted.resources?.length || 0,
        constraints: extracted.constraints?.length || 0
      }
    });

  } catch (error) {
    console.error('变量提取错误:', error);
    
    return NextResponse.json(
      { 
        error: '变量提取失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
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