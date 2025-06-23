import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, user_id, model, temperature, provider, apiKey, base_url } = body;

    console.log('Chat API request:', { 
      provider, 
      model: model?.substring(0, 10) + '...', 
      hasApiKey: !!apiKey, 
      base_url,
      messageLength: message?.length 
    });

    if (!message || !apiKey) {
      return NextResponse.json(
        { error: "缺少必要参数：message 或 apiKey" },
        { status: 400 }
      );
    }

    // 根据不同提供商调用相应的API
    let response;
    switch (provider) {
      case "deepseek":
        response = await callDeepSeekAPI(message, model, temperature, apiKey, base_url);
        break;
      case "openai":
        response = await callOpenAIAPI(message, model, temperature, apiKey, base_url);
        break;
      case "claude":
        response = await callClaudeAPI(message, model, temperature, apiKey, base_url);
        break;
      default:
        response = await callDeepSeekAPI(message, model, temperature, apiKey, base_url);
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "处理消息时发生错误" },
      { status: 500 }
    );
  }
}

async function callDeepSeekAPI(message: string, model: string, temperature: number, apiKey: string, baseUrl?: string) {
  // 如果用户设置了错误的baseUrl，自动修正
  let url = baseUrl || "https://api.deepseek.com/chat/completions";
  if (baseUrl && baseUrl.includes('deepseek.com') && !baseUrl.includes('/chat/completions')) {
    const originalUrl = url;
    url = baseUrl.replace(/\/v1$/, '') + '/chat/completions';
    console.log(`DeepSeek URL corrected: ${originalUrl} -> ${url}`);
  }
  
  console.log('DeepSeek API call:', { url, model });
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "deepseek-chat",
      messages: [
        { role: "user", content: message }
      ],
      temperature: temperature || 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "抱歉，没有收到有效回复。";
}

async function callOpenAIAPI(message: string, model: string, temperature: number, apiKey: string, baseUrl?: string) {
  const url = baseUrl || "https://api.openai.com/v1/chat/completions";
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-3.5-turbo",
      messages: [
        { role: "user", content: message }
      ],
      temperature: temperature || 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "抱歉，没有收到有效回复。";
}

async function callClaudeAPI(message: string, model: string, temperature: number, apiKey: string, baseUrl?: string) {
  const url = baseUrl || "https://api.anthropic.com/v1/messages";
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model || "claude-3-haiku-20240307",
      max_tokens: 2000,
      temperature: temperature || 0.7,
      messages: [
        { role: "user", content: message }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "抱歉，没有收到有效回复。";
} 