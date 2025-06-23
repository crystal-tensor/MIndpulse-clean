import { NextRequest, NextResponse } from 'next/server';

interface TestConnectionRequest {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TestConnectionRequest = await request.json();
    const { provider, model, apiKey, baseUrl } = body;

    console.log('Test connection request:', { provider, model: model?.substring(0, 10) + '...', hasApiKey: !!apiKey, baseUrl });

    if (!provider || !model || !apiKey) {
      console.log('Missing parameters:', { provider: !!provider, model: !!model, apiKey: !!apiKey });
      return NextResponse.json(
        { error: '缺少必要参数', details: { provider: !!provider, model: !!model, apiKey: !!apiKey } },
        { status: 400 }
      );
    }

    // 根据提供商测试连接
    let testResult;
    
    switch (provider) {
      case 'openai':
        testResult = await testOpenAI(apiKey, model, baseUrl);
        break;
      case 'deepseek':
        testResult = await testDeepSeek(apiKey, model, baseUrl);
        break;
      case 'claude':
        testResult = await testClaude(apiKey, model, baseUrl);
        break;
      case 'gemini':
        testResult = await testGemini(apiKey, model, baseUrl);
        break;
      case 'tongyi':
        testResult = await testTongyi(apiKey, model, baseUrl);
        break;
      default:
        return NextResponse.json(
          { error: '不支持的模型提供商' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: '连接测试成功',
      details: testResult
    });

  } catch (error) {
    console.error('连接测试失败:', error);
    
    return NextResponse.json(
      { 
        error: '连接测试失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

async function testOpenAI(apiKey: string, model: string, baseUrl?: string): Promise<any> {
  const url = baseUrl || 'https://api.openai.com/v1/chat/completions';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'user', content: '测试连接，请回复"连接成功"' }
      ],
      max_tokens: 10,
      temperature: 0.1
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API错误: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    model: data.model,
    usage: data.usage,
    response: data.choices[0]?.message?.content
  };
}

async function testDeepSeek(apiKey: string, model: string, baseUrl?: string): Promise<any> {
  // 如果用户设置了错误的baseUrl，自动修正
  let url = baseUrl || 'https://api.deepseek.com/chat/completions';
  if (baseUrl && baseUrl.includes('deepseek.com') && !baseUrl.includes('/chat/completions')) {
    url = baseUrl.replace(/\/v1$/, '') + '/chat/completions';
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'user', content: '测试连接，请回复"连接成功"' }
      ],
      max_tokens: 10,
      temperature: 0.1
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek API错误: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    model: data.model,
    usage: data.usage,
    response: data.choices[0]?.message?.content
  };
}

async function testClaude(apiKey: string, model: string, baseUrl?: string): Promise<any> {
  const url = baseUrl || 'https://api.anthropic.com/v1/messages';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 10,
      messages: [
        { role: 'user', content: '测试连接，请回复"连接成功"' }
      ]
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Claude API错误: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    model: data.model,
    usage: data.usage,
    response: data.content[0]?.text
  };
}

async function testGemini(apiKey: string, model: string, baseUrl?: string): Promise<any> {
  const url = baseUrl || `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: '测试连接，请回复"连接成功"'
        }]
      }],
      generationConfig: {
        maxOutputTokens: 10,
        temperature: 0.1
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API错误: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    model: model,
    response: data.candidates[0]?.content?.parts[0]?.text
  };
}

async function testTongyi(apiKey: string, model: string, baseUrl?: string): Promise<any> {
  const url = baseUrl || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      input: {
        messages: [
          { role: 'user', content: '测试连接，请回复"连接成功"' }
        ]
      },
      parameters: {
        max_tokens: 10,
        temperature: 0.1
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`通义千问 API错误: ${response.status} - ${errorData.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    model: model,
    usage: data.usage,
    response: data.output?.text
  };
} 