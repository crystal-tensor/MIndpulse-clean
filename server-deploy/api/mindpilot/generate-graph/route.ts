import { NextRequest, NextResponse } from "next/server";

// 模拟图谱数据存储
let graphData: any[] = [];

// 获取历史对话消息
async function getHistoricalMessages(userId: string, startDate: Date) {
  // 在服务器端无法访问localStorage，这里返回空数组
  // 实际应用中应该从数据库查询历史对话
  // 目前图谱生成将只使用当前传入的对话消息
  console.log(`尝试获取用户 ${userId} 从 ${startDate.toISOString()} 开始的历史消息`);
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, graph_type = "2d", user_id, time_range } = body;

    // 获取所有历史对话数据（默认过去6个月）
    let allMessages = messages || [];
    
    // 如果没有指定时间范围，默认使用过去6个月
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // 模拟从数据库获取历史对话（实际应用中需要从数据库查询）
    try {
      // 这里应该从数据库获取用户的所有对话
      // 为了防止图谱过大，限制在过去6个月内
      const historicalMessages = await getHistoricalMessages(user_id, sixMonthsAgo);
      allMessages = [...allMessages, ...historicalMessages];
    } catch (error) {
      console.log("获取历史对话失败，使用当前对话:", error);
    }

    if (!allMessages || allMessages.length === 0) {
      return NextResponse.json(
        { error: "缺少对话消息" },
        { status: 400 }
      );
    }

    // 提取对话内容
    const conversationText = allMessages
      .map((msg: any) => msg.content)
      .join(" ");

    // 生成知识图谱数据
    const graphResult = await generateKnowledgeGraph(conversationText, graph_type, time_range);

    // 保存图谱数据
    const graphEntry = {
      id: `graph_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user_id,
      graph_type,
      data: graphResult,
      created_at: new Date().toISOString(),
      messages_count: allMessages.length,
      time_range: time_range || { start: sixMonthsAgo.toISOString(), end: new Date().toISOString() },
    };

    graphData.push(graphEntry);

    return NextResponse.json({
      success: true,
      graph_url: graphResult.graph_url,
      graph_data: graphResult,
      messages_processed: allMessages.length,
    });
  } catch (error) {
    console.error("Generate graph error:", error);
    return NextResponse.json(
      { error: "生成图谱失败" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const graph_type = searchParams.get('graph_type');

    let filteredGraphs = graphData;

    if (user_id) {
      filteredGraphs = filteredGraphs.filter(graph => graph.user_id === user_id);
    }

    if (graph_type) {
      filteredGraphs = filteredGraphs.filter(graph => graph.graph_type === graph_type);
    }

    return NextResponse.json({ graphs: filteredGraphs });
  } catch (error) {
    console.error("Get graphs error:", error);
    return NextResponse.json(
      { error: "获取图谱失败" },
      { status: 500 }
    );
  }
}

async function generateKnowledgeGraph(text: string, graphType: string, timeRange?: any) {
  // 模拟知识图谱生成
  const entities = extractEntities(text);
  const relationships = extractRelationships(text, entities);

  if (graphType === "3d") {
    return generate3DGraph(entities, relationships);
  } else {
    return generate2DGraph(entities, relationships);
  }
}

function extractEntities(text: string) {
  // 简单的实体提取（实际应用中可以使用NLP库）
  const words = text.split(/\s+/);
  const entities = [];
  
  // 提取名词和重要概念
  for (let i = 0; i < Math.min(words.length, 20); i++) {
    const word = words[i].trim();
    // 过滤掉标点符号和短词
    if (word.length > 1 && !/^[，。！？；：""''（）【】\s\.,!?;:()\[\]]+$/.test(word)) {
      entities.push({
        id: `entity_${i}`,
        name: escapeHtml(word), // 转义HTML字符
        type: "concept",
        weight: Math.random() * 0.5 + 0.5,
      });
    }
  }

  return entities.slice(0, 10); // 限制实体数量
}

// HTML字符转义函数
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function extractRelationships(text: string, entities: any[]) {
  const relationships = [];
  
  // 生成实体间的关系
  for (let i = 0; i < entities.length - 1; i++) {
    for (let j = i + 1; j < Math.min(entities.length, i + 3); j++) {
      relationships.push({
        source: entities[i].id,
        target: entities[j].id,
        type: "relates_to",
        weight: Math.random() * 0.8 + 0.2,
      });
    }
  }

  return relationships;
}

function generate2DGraph(entities: any[], relationships: any[]) {
  // 生成2D图谱数据
  const nodes = entities.map((entity, index) => ({
    ...entity,
    x: Math.cos(index * 2 * Math.PI / entities.length) * 100 + 200,
    y: Math.sin(index * 2 * Math.PI / entities.length) * 100 + 200,
  }));

  return {
    type: "2d",
    nodes,
    edges: relationships,
    graph_url: generateGraphVisualization(nodes, relationships, "2d"),
    metadata: {
      node_count: nodes.length,
      edge_count: relationships.length,
      created_at: new Date().toISOString(),
    },
  };
}

function generate3DGraph(entities: any[], relationships: any[]) {
  // 生成3D图谱数据
  const nodes = entities.map((entity, index) => ({
    ...entity,
    x: Math.cos(index * 2 * Math.PI / entities.length) * 100,
    y: Math.sin(index * 2 * Math.PI / entities.length) * 100,
    z: (index % 3 - 1) * 50,
  }));

  return {
    type: "3d",
    nodes,
    edges: relationships,
    graph_url: generateGraphVisualization(nodes, relationships, "3d"),
    metadata: {
      node_count: nodes.length,
      edge_count: relationships.length,
      created_at: new Date().toISOString(),
    },
  };
}

function generateGraphVisualization(nodes: any[], edges: any[], type: string) {
  if (type === "3d") {
    return generate3DVisualization(nodes, edges);
  } else {
    return generate2DVisualization(nodes, edges);
  }
}

function generate2DVisualization(nodes: any[], edges: any[]) {
  // 生成2D图谱的HTML可视化
  const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>2D知识图谱</title>
      <style>
        body { 
          margin: 0; 
          padding: 20px; 
          font-family: Arial, sans-serif; 
          background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
          color: white;
          overflow: hidden;
        }
        .graph-container { 
          width: 100%; 
          height: 100vh; 
          position: relative; 
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .node { 
          position: absolute; 
          background: rgba(74, 222, 128, 0.8);
          border: 2px solid #22c55e;
          border-radius: 50%; 
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1f2937;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .node:hover {
          transform: scale(1.2);
          background: rgba(34, 197, 94, 0.9);
        }
        .edge {
          position: absolute;
          background: rgba(107, 114, 128, 0.6);
          transform-origin: left center;
          pointer-events: none;
        }
        .title {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 24px;
          font-weight: bold;
        }
        .stats {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.3);
          padding: 10px;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="title">2D知识图谱</div>
      <div class="graph-container">
        ${edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return '';
          
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          return `<div class="edge" style="
            left: ${sourceNode.x}px;
            top: ${sourceNode.y}px;
            width: ${length}px;
            height: 2px;
            transform: rotate(${angle}deg);
            opacity: ${edge.weight};
          "></div>`;
        }).join('')}
        
        ${nodes.map(node => `
          <div class="node" style="
            left: ${node.x - (node.weight * 15 + 15)}px;
            top: ${node.y - (node.weight * 15 + 15)}px;
            width: ${(node.weight * 30 + 30)}px;
            height: ${(node.weight * 30 + 30)}px;
          " title="${node.name}">
            ${node.name.substring(0, 6)}
          </div>
        `).join('')}
      </div>
      <div class="stats">
        节点: ${nodes.length} | 边: ${edges.length}
      </div>
    </body>
    </html>
  `;
  
  return `data:text/html;charset=utf-8;base64,${Buffer.from(html, 'utf8').toString('base64')}`;
}

function generate3DVisualization(nodes: any[], edges: any[]) {
  // 生成3D图谱的HTML可视化
  const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>3D知识图谱</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          font-family: Arial, sans-serif; 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          color: white;
          overflow: hidden;
        }
        .graph-3d { 
          width: 100vw; 
          height: 100vh; 
          perspective: 1000px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scene {
          width: 400px;
          height: 400px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotate 20s infinite linear;
        }
        .node-3d { 
          position: absolute; 
          background: rgba(147, 51, 234, 0.8);
          border: 2px solid #a855f7;
          border-radius: 50%; 
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
        }
        .node-3d:hover {
          transform: scale(1.3);
          background: rgba(168, 85, 247, 0.9);
        }
        .title {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 24px;
          font-weight: bold;
          z-index: 100;
        }
        .stats {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.3);
          padding: 10px;
          border-radius: 8px;
          z-index: 100;
        }
        @keyframes rotate {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="title">3D知识图谱</div>
      <div class="graph-3d">
        <div class="scene">
          ${nodes.map(node => `
            <div class="node-3d" style="
              left: ${200 + node.x}px;
              top: ${200 + node.y}px;
              transform: translateZ(${node.z || 0}px);
              width: ${(node.weight * 20 + 20)}px;
              height: ${(node.weight * 20 + 20)}px;
            " title="${node.name}">
              ${node.name.substring(0, 4)}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="stats">
        节点: ${nodes.length} | 边: ${edges.length} | 3D空间
      </div>
    </body>
    </html>
  `;
  
  return `data:text/html;charset=utf-8;base64,${Buffer.from(html, 'utf8').toString('base64')}`;
} 