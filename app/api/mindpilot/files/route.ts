import { NextRequest, NextResponse } from "next/server";

// 模拟文件数据存储
let files: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    let filteredFiles = files;

    if (user_id) {
      filteredFiles = filteredFiles.filter(file => file.user_id === user_id);
    }

    return NextResponse.json({ files: filteredFiles });
  } catch (error) {
    console.error("Get files error:", error);
    return NextResponse.json(
      { error: "获取文件列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const user_id = formData.get('user_id') as string;

    if (!file) {
      return NextResponse.json(
        { error: "没有上传文件" },
        { status: 400 }
      );
    }

    // 读取文件内容
    const fileContent = await file.text();
    
    // 生成文件摘要
    const summary = generateFileSummary(fileContent);

    const fileInfo = {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      filename: file.name,
      file_size: file.size,
      user_id,
      content: fileContent,
      summary,
      uploaded_at: new Date().toISOString(),
      mime_type: file.type,
    };

    files.push(fileInfo);

    return NextResponse.json({
      success: true,
      file_info: {
        filename: fileInfo.filename,
        file_size: fileInfo.file_size,
        uploaded_at: fileInfo.uploaded_at,
        summary: fileInfo.summary,
      },
      summary: fileInfo.summary,
    });
  } catch (error) {
    console.error("Upload file error:", error);
    return NextResponse.json(
      { error: "文件上传失败" },
      { status: 500 }
    );
  }
}

function generateFileSummary(content: string): string {
  // 简单的文件摘要生成
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const wordCount = content.split(/\s+/).length;
  
  let summary = `文档包含 ${lines.length} 行，约 ${wordCount} 个词。`;
  
  if (lines.length > 0) {
    const firstFewLines = lines.slice(0, 3).join(' ');
    summary += `\n\n内容预览：${firstFewLines.substring(0, 200)}${firstFewLines.length > 200 ? '...' : ''}`;
  }
  
  return summary;
} 