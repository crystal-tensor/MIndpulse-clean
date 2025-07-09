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

// 知识图谱节点接口
interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  connections: string[];
  level: number;
  x: number;
  y: number;
  z: number;
  color: string;
  sourceConversation: string;
  extractedTime: Date;
  confidence: number;
  size: number;
}

// 支持两种API参数格式
interface GraphGenerationRequest {
  startDate?: string;
  endDate?: string;
  mode?: '2d' | '3d';
  name?: string;
  saveLocation?: 'cloud' | 'local';
  localPath?: string;
  // 新增支持的参数格式
  messages?: any[];
  graph_type?: string;
  user_id?: string;
  time_range?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: GraphGenerationRequest = await request.json();
    
    // 兼容两种参数格式
    const { 
      startDate, 
      endDate, 
      mode, 
      name, 
      saveLocation, 
      localPath,
      messages,
      graph_type,
      user_id,
      time_range
    } = body;

    // 统一参数格式
    const graphMode = mode || (graph_type === '3d' ? '3d' : '2d');
    const graphName = name || `智核知识图谱_${new Date().toLocaleDateString()}`;
    const saveLocation_ = saveLocation || 'cloud';
    
    // 如果有messages参数，使用传入的消息内容，否则使用模拟数据
    let mockConversations = [];
    
    if (messages && messages.length > 0) {
      // 从传入的消息构建对话内容
      const conversationMap = new Map();
      
      messages.forEach((msg, index) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          const convId = `conv-${Math.floor(index / 2)}`;
          if (!conversationMap.has(convId)) {
            conversationMap.set(convId, {
              id: convId,
              content: '',
              date: new Date(),
              extractedConcepts: []
            });
          }
          const conv = conversationMap.get(convId);
          conv.content += msg.content + ' ';
        }
      });
      
      // 从内容中提取概念
      conversationMap.forEach((conv, convId) => {
        const content = conv.content.toLowerCase();
        const concepts = [];
        
        // 提取技术相关概念
        if (content.includes('ai') || content.includes('人工智能')) concepts.push('人工智能');
        if (content.includes('量子') || content.includes('quantum')) concepts.push('量子计算');
        if (content.includes('区块链') || content.includes('blockchain')) concepts.push('区块链');
        if (content.includes('机器学习') || content.includes('ml')) concepts.push('机器学习');
        if (content.includes('深度学习') || content.includes('deep learning')) concepts.push('深度学习');
        if (content.includes('算法') || content.includes('algorithm')) concepts.push('算法优化');
        if (content.includes('数据') || content.includes('data')) concepts.push('数据分析');
        if (content.includes('网络') || content.includes('network')) concepts.push('网络架构');
        if (content.includes('安全') || content.includes('security')) concepts.push('网络安全');
        if (content.includes('云计算') || content.includes('cloud')) concepts.push('云计算');
        if (content.includes('大数据') || content.includes('big data')) concepts.push('大数据');
        if (content.includes('物联网') || content.includes('iot')) concepts.push('物联网');
        if (content.includes('虚拟现实') || content.includes('vr')) concepts.push('虚拟现实');
        if (content.includes('增强现实') || content.includes('ar')) concepts.push('增强现实');
        if (content.includes('数字分身') || content.includes('digital twin')) concepts.push('数字分身');
        if (content.includes('意识') || content.includes('consciousness')) concepts.push('意识模拟');
        if (content.includes('神经网络') || content.includes('neural')) concepts.push('神经网络');
        if (content.includes('自然语言') || content.includes('nlp')) concepts.push('自然语言处理');
        if (content.includes('计算机视觉') || content.includes('cv')) concepts.push('计算机视觉');
        if (content.includes('推荐系统') || content.includes('recommendation')) concepts.push('推荐系统');
        if (content.includes('决策') || content.includes('decision')) concepts.push('智能决策');
        if (content.includes('优化') || content.includes('optimization')) concepts.push('智能优化');
        if (content.includes('自动化') || content.includes('automation')) concepts.push('自动化');
        if (content.includes('机器人') || content.includes('robot')) concepts.push('机器人技术');
        if (content.includes('金融') || content.includes('finance')) concepts.push('金融科技');
        if (content.includes('医疗') || content.includes('medical')) concepts.push('医疗AI');
        if (content.includes('教育') || content.includes('education')) concepts.push('教育技术');
        if (content.includes('智能制造') || content.includes('smart manufacturing')) concepts.push('智能制造');
        if (content.includes('自动驾驶') || content.includes('autonomous')) concepts.push('自动驾驶');
        
        // 如果没有找到特定概念，使用通用概念
        if (concepts.length === 0) {
          concepts.push('知识节点', '信息处理', '系统架构');
        }
        
        conv.extractedConcepts = concepts.slice(0, 5); // 限制概念数量
      });
      
      mockConversations = Array.from(conversationMap.values());
    } else {
      // 使用默认模拟数据
      mockConversations = [
        {
          id: 'conv-001',
          content: '讨论量子计算在金融决策中的应用',
          date: new Date('2024-01-15'),
          extractedConcepts: ['量子计算', '金融决策', '优化算法']
        },
        {
          id: 'conv-002',
          content: '分析人工智能在资产配置中的角色',
          date: new Date('2024-01-20'),
          extractedConcepts: ['人工智能', '资产配置', '风险管理']
        },
        {
          id: 'conv-003',
          content: '探讨数字分身的意识模拟技术',
          date: new Date('2024-01-25'),
          extractedConcepts: ['数字分身', '意识模拟', '神经网络']
        },
      ];
    }

    // 根据时间范围过滤对话
    let filteredConversations = mockConversations;
    if (startDate) {
      const start = new Date(startDate);
      filteredConversations = filteredConversations.filter(conv => conv.date >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filteredConversations = filteredConversations.filter(conv => conv.date <= end);
    }

    // 生成知识节点
    const nodes: KnowledgeNode[] = [];
    const categories = ['quantum', 'ai', 'finance', 'consciousness', 'technology'];
    const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

    // 计算概念频率和重要性
    const conceptFrequency = new Map<string, number>();
    const conceptImportance = new Map<string, number>();
    
    filteredConversations.forEach((conv) => {
      conv.extractedConcepts.forEach((concept: string) => {
        conceptFrequency.set(concept, (conceptFrequency.get(concept) || 0) + 1);
        
        // 基于概念长度和关键词计算重要性
        let importance = 0.3; // 基础重要性
        
        // 技术关键词加权
        if (concept.includes('AI') || concept.includes('人工智能')) importance += 0.4;
        if (concept.includes('量子')) importance += 0.3;
        if (concept.includes('算法') || concept.includes('优化')) importance += 0.2;
        if (concept.includes('决策') || concept.includes('智能')) importance += 0.2;
        if (concept.includes('分析') || concept.includes('处理')) importance += 0.1;
        
        // 概念复杂度加权
        if (concept.length > 8) importance += 0.1;
        if (concept.length > 12) importance += 0.1;
        
        conceptImportance.set(concept, Math.max(conceptImportance.get(concept) || 0, importance));
      });
    });

    let nodeId = 1;
    filteredConversations.forEach((conv, convIndex) => {
      conv.extractedConcepts.forEach((concept: string, conceptIndex: number) => {
        const category = categories[conceptIndex % categories.length];
        const color = colors[conceptIndex % colors.length];
        
        // 基于频率和重要性计算权重
        const frequency = conceptFrequency.get(concept) || 1;
        const importance = conceptImportance.get(concept) || 0.3;
        const weight = Math.min(1.0, 0.3 + (frequency * 0.2) + importance);
        
        // 为3D模式添加z坐标
        const node: KnowledgeNode = {
          id: nodeId.toString(),
          name: concept,
          category,
          connections: [], // 稍后建立连接
          level: Math.floor(Math.random() * 5) + 1,
          x: 100 + (nodeId * 80) % 600,
          y: 100 + (nodeId * 60) % 400,
          z: graphMode === '3d' ? 50 + (nodeId * 30) % 200 : 0,
          color,
          sourceConversation: conv.id,
          extractedTime: conv.date,
          confidence: weight,
          size: Math.floor(weight * 20 + 10), // 基于权重的大小
        };
        
        nodes.push(node);
        nodeId++;
      });
    });

    // 建立节点间的连接（基于共现和语义相似性）
    const connections: Array<{source: string, target: string, weight: number}> = [];
    
    nodes.forEach((node, index) => {
      // 与同一对话中的其他节点建立连接
      const sameConvNodes = nodes.filter(n => 
        n.sourceConversation === node.sourceConversation && n.id !== node.id
      );
      sameConvNodes.forEach(connNode => {
        if (!node.connections.includes(connNode.id)) {
          node.connections.push(connNode.id);
          // 同一对话中的节点连接权重较高
          connections.push({
            source: node.id,
            target: connNode.id,
            weight: 0.8 + Math.random() * 0.2
          });
        }
      });

      // 与相似类别的节点建立弱连接
      if (Math.random() > 0.7) {
        const similarNodes = nodes.filter(n => 
          n.category === node.category && n.id !== node.id && !node.connections.includes(n.id)
        );
        if (similarNodes.length > 0) {
          const randomSimilar = similarNodes[Math.floor(Math.random() * similarNodes.length)];
          node.connections.push(randomSimilar.id);
          // 相似类别的连接权重较低
          connections.push({
            source: node.id,
            target: randomSimilar.id,
            weight: 0.3 + Math.random() * 0.4
          });
        }
      }
    });

    // 图谱元数据
    const graphMetadata = {
      id: Date.now().toString(),
      name: graphName,
      mode: graphMode,
      nodeCount: nodes.length,
      connectionCount: connections.length,
      timeRange: {
        start: startDate || filteredConversations[0]?.date,
        end: endDate || filteredConversations[filteredConversations.length - 1]?.date,
      },
      saveLocation: saveLocation_,
      localPath: saveLocation_ === 'local' ? localPath : undefined,
      createdAt: new Date(),
      generatedFrom: filteredConversations.length,
    };

    // 生成图谱可视化
    const entities = nodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.category,
      weight: node.confidence,
      x: node.x,
      y: node.y,
      z: node.z,
      color: node.color,
      size: node.size
    }));

    const relationships = connections.map(conn => ({
      source: conn.source,
      target: conn.target,
      type: "relates_to",
      weight: conn.weight,
    }));

    const graph_url = generateGraphVisualization(entities, relationships, graphMode);

    // 模拟保存过程
    if (saveLocation_ === 'cloud') {
      console.log(`图谱 "${graphName}" 已保存到云端`);
    } else if (saveLocation_ === 'local' && localPath) {
      console.log(`图谱 "${graphName}" 已保存到本地路径: ${localPath}`);
    }

    return NextResponse.json({
      success: true,
      graph_url,
      graph_data: {
        nodes,
        connections,
        metadata: graphMetadata,
      },
      messages_processed: filteredConversations.length,
      data: {
        graph: {
          metadata: graphMetadata,
          nodes,
        },
        message: `成功生成${graphMode.toUpperCase()}知识图谱 "${graphName}"，包含${nodes.length}个节点和${connections.length}条连接`,
      }
    });
  } catch (error) {
    console.error('图谱生成错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '图谱生成失败，请重试',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 获取已保存的图谱列表
    const mockSavedGraphs = [
      {
        id: '1',
        name: '2024年1月智核决策图谱',
        mode: '3d',
        nodeCount: 15,
        createdAt: new Date('2024-01-30'),
        saveLocation: 'cloud',
      },
      {
        id: '2', 
        name: '量子计算知识网络',
        mode: '2d',
        nodeCount: 8,
        createdAt: new Date('2024-01-25'),
        saveLocation: 'local',
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        graphs: mockSavedGraphs,
        total: mockSavedGraphs.length,
      }
    });

  } catch (error) {
    console.error('获取图谱列表错误:', error);
    return NextResponse.json(
      { success: false, error: '获取图谱列表失败' },
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
          border-radius: 50%; 
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          text-shadow: 0 0 2px rgba(0,0,0,0.5);
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
          
          // 计算节点中心位置
          const sourceSize = sourceNode.weight * 40 + 20;
          const targetSize = targetNode.weight * 40 + 20;
          
          const sourceCenterX = sourceNode.x;
          const sourceCenterY = sourceNode.y;
          
          const targetCenterX = targetNode.x;
          const targetCenterY = targetNode.y;
          
          // 计算方向向量
          const dx = targetCenterX - sourceCenterX;
          const dy = targetCenterY - sourceCenterY;
          const length = Math.sqrt(dx * dx + dy * dy);
          
          // 避免零长度连接
          if (length < 1) return '';
          
          // 计算单位向量
          const unitX = dx / length;
          const unitY = dy / length;
          
          // 计算连接线起点（从源节点边缘开始）
          const startX = sourceCenterX + unitX * (sourceSize / 2);
          const startY = sourceCenterY + unitY * (sourceSize / 2);
          
          // 计算连接线长度（减去两个节点的半径）
          const lineLength = Math.max(1, length - (sourceSize / 2) - (targetSize / 2));
          
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          // 根据权重计算线条粗细 (1-8px)
          const lineWidth = Math.max(1, Math.min(8, Math.round(edge.weight * 8)));
          
          return `<div class="edge" style="
            left: ${startX}px;
            top: ${startY}px;
            width: ${lineLength}px;
            height: ${lineWidth}px;
            transform: rotate(${angle}deg);
            opacity: ${0.4 + edge.weight * 0.6};
          "></div>`;
        }).join('')}
        
        ${nodes.map(node => {
          const nodeSize = node.weight * 40 + 20; // 更大的尺寸差异 (20-60px)
          return `
          <div class="node" style="
            left: ${node.x - nodeSize/2}px;
            top: ${node.y - nodeSize/2}px;
            width: ${nodeSize}px;
            height: ${nodeSize}px;
            font-size: ${Math.max(10, nodeSize * 0.2)}px;
            background: ${node.color || 'rgba(74, 222, 128, 0.8)'};
            border: 2px solid ${node.color || '#22c55e'};
          " title="${node.name}">
            ${node.name.substring(0, Math.max(4, Math.floor(nodeSize / 8)))}
          </div>
        `;
        }).join('')}
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
  // 生成3D图谱的HTML可视化，包含连接线
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
        .edge-3d {
          position: absolute;
          background: linear-gradient(90deg, rgba(107, 114, 128, 0.6), rgba(147, 51, 234, 0.6));
          transform-origin: left center;
          pointer-events: none;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(107, 114, 128, 0.3);
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
          ${edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return '';
            
            // 计算节点中心位置
            const sourceSize = sourceNode.weight * 30 + 15;
            const targetSize = targetNode.weight * 30 + 15;
            
            const sourceCenterX = sourceNode.x;
            const sourceCenterY = sourceNode.y;
            const sourceCenterZ = sourceNode.z || 0;
            
            const targetCenterX = targetNode.x;
            const targetCenterY = targetNode.y;
            const targetCenterZ = targetNode.z || 0;
            
            // 计算方向向量
            const dx = targetCenterX - sourceCenterX;
            const dy = targetCenterY - sourceCenterY;
            const dz = targetCenterZ - sourceCenterZ;
            
            // 计算3D距离
            const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // 避免零长度连接
            if (length < 1) return '';
            
            // 计算单位向量
            const unitX = dx / length;
            const unitY = dy / length;
            const unitZ = dz / length;
            
            // 计算连接线起点（从源节点边缘开始）
            const startX = sourceCenterX + unitX * (sourceSize / 2);
            const startY = sourceCenterY + unitY * (sourceSize / 2);
            const startZ = sourceCenterZ + unitZ * (sourceSize / 2);
            
            // 计算连接线长度（减去两个节点的半径）
            const lineLength = Math.max(1, length - (sourceSize / 2) - (targetSize / 2));
            
            // 计算旋转角度
            const angleY = Math.atan2(dx, dz) * 180 / Math.PI;
            const angleX = Math.atan2(-dy, Math.sqrt(dx * dx + dz * dz)) * 180 / Math.PI;
            
            // 根据权重计算线条粗细 (1-6px)
            const lineWidth = Math.max(1, Math.min(6, Math.round(edge.weight * 6)));
            
            return `<div class="edge-3d" style="
              left: ${200 + startX}px;
              top: ${200 + startY}px;
              width: ${lineLength}px;
              height: ${lineWidth}px;
              transform: translateZ(${startZ}px) rotateY(${angleY}deg) rotateX(${angleX}deg);
              opacity: ${0.4 + edge.weight * 0.6};
            "></div>`;
          }).join('')}
          
          ${nodes.map(node => {
            const nodeSize = node.weight * 30 + 15; // 更大的尺寸差异 (15-45px)
            return `
            <div class="node-3d" style="
              left: ${200 + node.x - nodeSize/2}px;
              top: ${200 + node.y - nodeSize/2}px;
              transform: translateZ(${node.z || 0}px);
              width: ${nodeSize}px;
              height: ${nodeSize}px;
              font-size: ${Math.max(8, nodeSize * 0.25)}px;
              background: ${node.color || 'rgba(147, 51, 234, 0.8)'};
              border: 2px solid ${node.color || '#a855f7'};
            " title="${node.name}">
              ${node.name.substring(0, Math.max(3, Math.floor(nodeSize / 8)))}
            </div>
          `;
          }).join('')}
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