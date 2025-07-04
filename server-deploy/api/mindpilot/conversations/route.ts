import { NextRequest, NextResponse } from "next/server";

// 模拟数据存储（实际项目中应使用数据库）
let conversations: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // 获取特定对话
      const conversation = conversations.find(conv => conv.id === id);
      if (conversation) {
        return NextResponse.json(conversation);
      } else {
        return NextResponse.json({ error: "对话不存在" }, { status: 404 });
      }
    } else {
      // 获取所有对话列表
      return NextResponse.json({ conversations });
    }
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json(
      { error: "获取对话列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, chat_history, user_id } = body;

    if (!name || !chat_history) {
      return NextResponse.json(
        { error: "缺少必要参数：name 或 chat_history" },
        { status: 400 }
      );
    }

    const newConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      chat_history,
      user_id,
      created_at: new Date().toISOString(),
      message_count: chat_history.length,
    };

    conversations.push(newConversation);

    return NextResponse.json({ 
      success: true, 
      conversation: newConversation 
    });
  } catch (error) {
    console.error("Save conversation error:", error);
    return NextResponse.json(
      { error: "保存对话失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "缺少参数：id" },
        { status: 400 }
      );
    }

    const index = conversations.findIndex(conv => conv.id === id);
    if (index !== -1) {
      conversations.splice(index, 1);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "对话不存在" }, { status: 404 });
    }
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json(
      { error: "删除对话失败" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "缺少参数：id 或 name" },
        { status: 400 }
      );
    }

    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.name = name;
      return NextResponse.json({ success: true, conversation });
    } else {
      return NextResponse.json({ error: "对话不存在" }, { status: 404 });
    }
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json(
      { error: "更新对话失败" },
      { status: 500 }
    );
  }
} 