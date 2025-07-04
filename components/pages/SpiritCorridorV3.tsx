'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ShareIcon,
  PlusIcon,
  CogIcon,
  GlobeAltIcon,
  HeartIcon,
  BriefcaseIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  SparklesIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  CheckIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  StarIcon,
  BeakerIcon,
  CpuChipIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  UserPlusIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  CircleStackIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';

// 从智核交互生成的知识图谱节点
interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  connections: string[];
  level: number;
  x: number;
  y: number;
  color: string;
  // 来源信息
  sourceConversation: string;    // 来源对话ID
  extractedTime: Date;          // 提取时间
  confidence: number;           // 提取置信度
  // 评估信息
  isEvaluated: boolean;         // 是否已评估
  evaluationScore: number;      // 评估分数
  marketValue: number;          // 潜在市场价值
  // 交易信息
  isListed: boolean;           // 是否在奇点交易所上架
  citationCount: number;       // 被引用次数
  adRevenue: number;          // 广告收益
  visibility: 'public' | 'private' | 'selective';
}

// 数字分身定义
interface DigitalTwin {
  id: string;
  name: string;
  description: string;
  avatar: string;
  // 知识图谱基础
  baseKnowledgeNodes: string[];     // 基础知识节点
  timeRange: {                      // 时间范围
    start: Date;
    end: Date;
  };
  // 性格特征
  personality: {
    traits: string[];               // 性格特质
    temperament: string;            // 气质类型
    communicationStyle: string;     // 沟通风格
  };
  // 能力配置
  capabilities: {
    reasoning: number;              // 推理能力
    creativity: number;             // 创造力
    empathy: number;               // 共情能力
    expertise: string[];           // 专业领域
  };
  // 工具配置
  tools: {
    mcpTools: string[];            // MCP工具
    llmModel: string;              // 大语言模型
    agents: string[];              // 智能体
  };
  // 状态
  isActive: boolean;
  lastUpdated: Date;
  createdAt: Date;
}

// 知识图谱评估结果
interface KnowledgeEvaluation {
  nodeId: string;
  evaluationId: string;
  // 论文式评估
  abstract: string;                 // 摘要
  methodology: string;              // 方法论
  findings: string;                 // 发现
  implications: string;             // 意义
  limitations: string;              // 局限性
  // 市场评估
  marketPotential: number;          // 市场潜力 0-100
  commercialViability: number;      // 商业可行性 0-100
  innovationLevel: number;          // 创新程度 0-100
  competitiveAdvantage: number;     // 竞争优势 0-100
  // 综合评分
  overallScore: number;             // 综合评分 0-100
  recommendedPrice: number;         // 建议定价
  evaluatedAt: Date;
  evaluator: string;                // 评估者（AI或专家）
}

// 奇点交易所条目
interface SingularityMarketItem {
  id: string;
  knowledgeNodeId: string;
  title: string;
  description: string;
  price: number;
  seller: string;
  // 交易统计
  views: number;
  citations: number;
  purchases: number;
  adClicks: number;
  totalRevenue: number;
  // 状态
  status: 'active' | 'sold' | 'draft';
  listedAt: Date;
  lastSold?: Date;
}

export default function SpiritCorridorV3() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 核心状态
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([]);
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>([]);
  const [evaluations, setEvaluations] = useState<KnowledgeEvaluation[]>([]);
  const [marketItems, setMarketItems] = useState<SingularityMarketItem[]>([]);
  
  // 选中状态
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedTwin, setSelectedTwin] = useState<string | null>(null);
  
  // UI状态
  const [activePanel, setActivePanel] = useState<'knowledge' | 'twins' | 'evaluation' | 'market'>('knowledge');
  const [showCreateTwin, setShowCreateTwin] = useState(false);
  const [showEvaluationPanel, setShowEvaluationPanel] = useState(false);
  const [showMarketPanel, setShowMarketPanel] = useState(false);
  const [showTwinInterface, setShowTwinInterface] = useState(false);
  
  // 创建数字分身的状态
  const [newTwin, setNewTwin] = useState<Partial<DigitalTwin>>({
    name: '',
    description: '',
    personality: {
      traits: [],
      temperament: '',
      communicationStyle: '',
    },
    capabilities: {
      reasoning: 50,
      creativity: 50,
      empathy: 50,
      expertise: [],
    },
    tools: {
      mcpTools: [],
      llmModel: 'gpt-4',
      agents: [],
    },
  });

  // 初始化知识图谱数据（模拟从智核交互生成）
  useEffect(() => {
    const simulatedNodes: KnowledgeNode[] = [
      {
        id: '1',
        name: '量子意识理论探讨',
        category: 'consciousness',
        connections: ['2', '3'],
        level: 4,
        x: 200,
        y: 150,
        color: '#8B5CF6',
        sourceConversation: 'conv_001',
        extractedTime: new Date('2024-01-15'),
        confidence: 0.92,
        isEvaluated: true,
        evaluationScore: 89,
        marketValue: 2500,
        isListed: true,
        citationCount: 15,
        adRevenue: 450.75,
        visibility: 'public',
      },
      {
        id: '2',
        name: 'AI伦理框架设计',
        category: 'ai-ethics',
        connections: ['1', '4'],
        level: 3,
        x: 350,
        y: 200,
        color: '#10B981',
        sourceConversation: 'conv_002',
        extractedTime: new Date('2024-01-16'),
        confidence: 0.87,
        isEvaluated: true,
        evaluationScore: 76,
        marketValue: 1800,
        isListed: false,
        citationCount: 8,
        adRevenue: 240.30,
        visibility: 'selective',
      },
      {
        id: '3',
        name: '数字分身技术架构',
        category: 'digital-twin',
        connections: ['1', '5'],
        level: 5,
        x: 150,
        y: 300,
        color: '#3B82F6',
        sourceConversation: 'conv_003',
        extractedTime: new Date('2024-01-17'),
        confidence: 0.95,
        isEvaluated: false,
        evaluationScore: 0,
        marketValue: 0,
        isListed: false,
        citationCount: 0,
        adRevenue: 0,
        visibility: 'private',
      },
      {
        id: '4',
        name: '人机协作模式创新',
        category: 'human-ai',
        connections: ['2', '5'],
        level: 4,
        x: 400,
        y: 100,
        color: '#F59E0B',
        sourceConversation: 'conv_004',
        extractedTime: new Date('2024-01-18'),
        confidence: 0.83,
        isEvaluated: true,
        evaluationScore: 82,
        marketValue: 2200,
        isListed: true,
        citationCount: 12,
        adRevenue: 360.90,
        visibility: 'public',
      },
      {
        id: '5',
        name: '奇点交易所概念',
        category: 'marketplace',
        connections: ['3', '4'],
        level: 3,
        x: 300,
        y: 350,
        color: '#EF4444',
        sourceConversation: 'conv_005',
        extractedTime: new Date('2024-01-19'),
        confidence: 0.90,
        isEvaluated: true,
        evaluationScore: 94,
        marketValue: 3500,
        isListed: true,
        citationCount: 23,
        adRevenue: 690.45,
        visibility: 'public',
      },
    ];
    setKnowledgeNodes(simulatedNodes);
    
    // 初始化评估数据
    const simulatedEvaluations: KnowledgeEvaluation[] = [
      {
        nodeId: '1',
        evaluationId: 'eval_001',
        abstract: '本研究探讨了量子意识理论在人工智能中的应用可能性，提出了一种基于量子叠加态的意识模拟框架。',
        methodology: '采用理论分析和数学建模相结合的方法，构建量子意识的数学表达式。',
        findings: '发现量子纠缠现象可能解释意识的非局域性特征，为人工意识的实现提供新思路。',
        implications: '该理论框架有望推动人工智能向真正的意识智能发展，具有重大科学价值。',
        limitations: '目前仍处于理论阶段，需要更多实验验证和技术突破。',
        marketPotential: 85,
        commercialViability: 72,
        innovationLevel: 95,
        competitiveAdvantage: 88,
        overallScore: 89,
        recommendedPrice: 2500,
        evaluatedAt: new Date('2024-01-20'),
        evaluator: 'AI评估系统',
      },
    ];
    setEvaluations(simulatedEvaluations);
    
    // 初始化市场数据
    const simulatedMarketItems: SingularityMarketItem[] = [
      {
        id: 'market_001',
        knowledgeNodeId: '1',
        title: '量子意识理论探讨',
        description: '创新的量子意识理论框架，适用于下一代AI系统开发',
        price: 2500,
        seller: 'user_001',
        views: 1250,
        citations: 15,
        purchases: 3,
        adClicks: 89,
        totalRevenue: 450.75,
        status: 'active',
        listedAt: new Date('2024-01-21'),
      },
    ];
    setMarketItems(simulatedMarketItems);
  }, []);

  // 绘制知识图谱
  const drawKnowledgeGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制连接线
    knowledgeNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = knowledgeNodes.find(n => n.id === connectionId);
        if (!connectedNode) return;

        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(connectedNode.x, connectedNode.y);
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // 绘制节点
    knowledgeNodes.forEach(node => {
      const radius = 15 + node.level * 3;
      
      // 节点主体
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // 选中状态
      if (selectedNode === node.id) {
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // 评估状态指示器
      if (node.isEvaluated) {
        ctx.beginPath();
        ctx.arc(node.x + radius - 3, node.y - radius + 3, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#10B981';
        ctx.fill();
      }
      
      // 交易状态指示器
      if (node.isListed) {
        ctx.beginPath();
        ctx.arc(node.x - radius + 3, node.y - radius + 3, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
      }
      
      // 节点名称
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      const maxWidth = 120;
      const text = node.name.length > 12 ? node.name.substring(0, 12) + '...' : node.name;
      ctx.fillText(text, node.x, node.y + radius + 15);
    });
  }, [knowledgeNodes, selectedNode]);

  // 画布点击处理
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNode = knowledgeNodes.find(node => {
      const radius = 15 + node.level * 3;
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= radius;
    });

    setSelectedNode(clickedNode ? clickedNode.id : null);
  };

  // 创建数字分身
  const createDigitalTwin = () => {
    if (!newTwin.name) return;
    
    const twin: DigitalTwin = {
      id: `twin_${Date.now()}`,
      name: newTwin.name,
      description: newTwin.description || '',
      avatar: '🤖',
      baseKnowledgeNodes: [], // 用户稍后选择
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 默认最近30天
        end: new Date(),
      },
      personality: newTwin.personality!,
      capabilities: newTwin.capabilities!,
      tools: newTwin.tools!,
      isActive: false,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    
    setDigitalTwins(prev => [...prev, twin]);
    setShowCreateTwin(false);
    setNewTwin({
      name: '',
      description: '',
      personality: { traits: [], temperament: '', communicationStyle: '' },
      capabilities: { reasoning: 50, creativity: 50, empathy: 50, expertise: [] },
      tools: { mcpTools: [], llmModel: 'gpt-4', agents: [] },
    });
  };

  // 评估知识图谱
  const evaluateKnowledgeNode = async (nodeId: string) => {
    const node = knowledgeNodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // 模拟AI评估过程
    const evaluation: KnowledgeEvaluation = {
      nodeId,
      evaluationId: `eval_${Date.now()}`,
      abstract: `基于"${node.name}"的深度分析，探讨其在当前技术环境下的创新价值和应用前景。`,
      methodology: '采用多维度评估框架，结合技术可行性、市场需求和创新程度进行综合分析。',
      findings: '该知识节点展现出较高的创新潜力和实用价值，在相关领域具有重要意义。',
      implications: '预期将对相关行业产生积极影响，具备良好的商业化前景。',
      limitations: '需要进一步验证和完善，存在一定的技术实现风险。',
      marketPotential: Math.floor(Math.random() * 30) + 70,
      commercialViability: Math.floor(Math.random() * 40) + 60,
      innovationLevel: Math.floor(Math.random() * 25) + 75,
      competitiveAdvantage: Math.floor(Math.random() * 35) + 65,
      overallScore: 0,
      recommendedPrice: Math.floor(Math.random() * 3000) + 1000,
      evaluatedAt: new Date(),
      evaluator: 'AI评估系统 v2.0',
    };
    
    evaluation.overallScore = Math.floor(
      (evaluation.marketPotential + evaluation.commercialViability + 
       evaluation.innovationLevel + evaluation.competitiveAdvantage) / 4
    );
    
    setEvaluations(prev => [...prev, evaluation]);
    
    // 更新节点评估状态
    setKnowledgeNodes(prev => prev.map(n => 
      n.id === nodeId 
        ? { ...n, isEvaluated: true, evaluationScore: evaluation.overallScore, marketValue: evaluation.recommendedPrice }
        : n
    ));
  };

  // 上架到奇点交易所
  const listToMarket = (nodeId: string) => {
    const node = knowledgeNodes.find(n => n.id === nodeId);
    const evaluation = evaluations.find(e => e.nodeId === nodeId);
    if (!node || !evaluation) return;
    
    const marketItem: SingularityMarketItem = {
      id: `market_${Date.now()}`,
      knowledgeNodeId: nodeId,
      title: node.name,
      description: evaluation.abstract,
      price: evaluation.recommendedPrice,
      seller: 'current_user',
      views: 0,
      citations: 0,
      purchases: 0,
      adClicks: 0,
      totalRevenue: 0,
      status: 'active',
      listedAt: new Date(),
    };
    
    setMarketItems(prev => [...prev, marketItem]);
    
    // 更新节点上架状态
    setKnowledgeNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, isListed: true } : n
    ));
  };

  useEffect(() => {
    drawKnowledgeGraph();
  }, [drawKnowledgeGraph]);

  const selectedNodeData = selectedNode ? knowledgeNodes.find(n => n.id === selectedNode) : null;
  const selectedNodeEvaluation = selectedNode ? evaluations.find(e => e.nodeId === selectedNode) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="flex h-screen">
        {/* 中央知识图谱区域 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部控制栏 */}
          <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <SparklesIcon className="w-8 h-8 mr-2 text-indigo-400" />
                  灵境回廊 3.0
                  <span className="ml-2 text-sm bg-indigo-600 px-2 py-1 rounded">智核驱动</span>
                </h1>
                <div className="flex space-x-2">
                  {(['knowledge', 'twins', 'evaluation', 'market'] as const).map((panel) => (
                    <button
                      key={panel}
                      onClick={() => setActivePanel(panel)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        activePanel === panel
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {panel === 'knowledge' && '知识图谱'}
                      {panel === 'twins' && '数字分身'}
                      {panel === 'evaluation' && '图谱评估'}
                      {panel === 'market' && '奇点交易所'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCreateTwin(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <UserPlusIcon className="w-5 h-5 mr-2" />
                  创建数字分身
                </button>
              </div>
            </div>
          </div>

          {/* 知识图谱画布 */}
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              className="w-full h-full cursor-pointer"
            />
            
            {/* 图例 */}
            <div className="absolute top-4 left-4 bg-black/70 rounded-lg p-4 text-white">
              <h3 className="font-bold mb-2">图例</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>已评估</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>已上架</span>
                </div>
                <div className="text-xs text-white/60 mt-2">
                  来源：智核交互对话提取
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="w-96 bg-black/20 backdrop-blur-sm border-l border-white/10 overflow-y-auto">
          {/* 面板内容根据activePanel显示不同内容 */}
          {activePanel === 'knowledge' && selectedNodeData && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{selectedNodeData.name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">来源对话</span>
                    <span className="text-blue-400 font-mono text-sm">{selectedNodeData.sourceConversation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">提取时间</span>
                    <span className="text-white/70">{selectedNodeData.extractedTime.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">置信度</span>
                    <span className="text-green-400">{(selectedNodeData.confidence * 100).toFixed(1)}%</span>
                  </div>
                  {selectedNodeData.isEvaluated && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">评估分数</span>
                        <span className="text-purple-400 font-bold">{selectedNodeData.evaluationScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">市场价值</span>
                        <span className="text-green-400 font-bold">¥{selectedNodeData.marketValue}</span>
                      </div>
                    </>
                  )}
                  {selectedNodeData.isListed && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">被引用</span>
                        <span className="text-blue-400">{selectedNodeData.citationCount} 次</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">广告收益</span>
                        <span className="text-green-400">¥{selectedNodeData.adRevenue.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {!selectedNodeData.isEvaluated && (
                  <button
                    onClick={() => evaluateKnowledgeNode(selectedNodeData.id)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    开始评估
                  </button>
                )}
                {selectedNodeData.isEvaluated && !selectedNodeData.isListed && (
                  <button
                    onClick={() => listToMarket(selectedNodeData.id)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    上架到奇点交易所
                  </button>
                )}
                {selectedNodeData.isListed && (
                  <div className="bg-green-600/20 rounded-lg p-3">
                    <div className="text-green-400 font-semibold">已在奇点交易所上架</div>
                    <div className="text-white/70 text-sm">等待用户引用以获得收益</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePanel === 'knowledge' && !selectedNodeData && (
            <div className="p-6 text-center text-white/50">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <p>点击左侧知识节点查看详情</p>
              <p className="text-xs mt-2">知识图谱来源于智核交互的对话内容</p>
            </div>
          )}

          {activePanel === 'twins' && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">数字分身</h3>
                <button
                  onClick={() => setShowCreateTwin(true)}
                  className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-blue-600/20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-2">数字分身概念</h4>
                <div className="text-white/80 text-sm space-y-1">
                  <p>• 基于特定时间段的知识图谱构建</p>
                  <p>• 可自定义性格、能力和工具配置</p>
                  <p>• 支持MCP工具、大模型和智能体集成</p>
                </div>
              </div>
              
              {digitalTwins.length === 0 ? (
                <div className="text-center text-white/50 mt-8">
                  <UserIcon className="w-12 h-12 mx-auto mb-4 text-white/30" />
                  <p>还没有创建数字分身</p>
                  <p className="text-xs mt-2">点击上方按钮创建您的第一个数字分身</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {digitalTwins.map((twin) => (
                    <div
                      key={twin.id}
                      onClick={() => {
                        setSelectedTwin(twin.id);
                        setShowTwinInterface(true);
                      }}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedTwin === twin.id
                          ? 'bg-indigo-600/30 border-2 border-indigo-400'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{twin.avatar}</span>
                        <div>
                          <h4 className="font-bold text-white">{twin.name}</h4>
                          <p className="text-white/70 text-sm">{twin.description}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-white/60">推理</div>
                          <div className="text-blue-400">{twin.capabilities.reasoning}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white/60">创造</div>
                          <div className="text-purple-400">{twin.capabilities.creativity}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white/60">共情</div>
                          <div className="text-green-400">{twin.capabilities.empathy}%</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs ${
                          twin.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
                          {twin.isActive ? '活跃' : '休眠'}
                        </span>
                        <span className="text-xs text-white/50">
                          {twin.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activePanel === 'evaluation' && (
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">知识图谱评估</h3>
              
              <div className="bg-purple-600/20 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">评估体系</h4>
                <div className="text-white/80 text-sm space-y-1">
                  <p>• 论文式评估：摘要、方法论、发现、意义</p>
                  <p>• 市场评估：潜力、可行性、创新度、优势</p>
                  <p>• 仅代表潜在价值，真正变现需上架交易</p>
                </div>
              </div>
              
              {evaluations.length === 0 ? (
                <div className="text-center text-white/50 mt-8">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-white/30" />
                  <p>还没有评估报告</p>
                  <p className="text-xs mt-2">选择知识节点进行评估</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {evaluations.map((evaluation) => {
                    const node = knowledgeNodes.find(n => n.id === evaluation.nodeId);
                    return (
                      <div key={evaluation.evaluationId} className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-bold text-white mb-2">{node?.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-white/70">综合评分: </span>
                            <span className="text-purple-400 font-bold">{evaluation.overallScore}/100</span>
                          </div>
                          <div>
                            <span className="text-white/70">建议定价: </span>
                            <span className="text-green-400">¥{evaluation.recommendedPrice}</span>
                          </div>
                          <div className="bg-black/30 rounded p-2 mt-2">
                            <div className="text-white/60 text-xs mb-1">摘要</div>
                            <div className="text-white/80 text-xs">{evaluation.abstract}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activePanel === 'market' && (
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <BanknotesIcon className="w-6 h-6 mr-2 text-yellow-400" />
                奇点交易所
              </h3>
              
              <div className="bg-yellow-600/20 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">交易机制</h4>
                <div className="text-white/80 text-sm space-y-1">
                  <p>• 评估后的知识图谱可在此上架交易</p>
                  <p>• 被引用次数决定广告收益分成</p>
                  <p>• 真正的变现需要通过市场交易实现</p>
                </div>
              </div>
              
              {marketItems.length === 0 ? (
                <div className="text-center text-white/50 mt-8">
                  <BanknotesIcon className="w-12 h-12 mx-auto mb-4 text-white/30" />
                  <p>暂无上架商品</p>
                  <p className="text-xs mt-2">评估知识节点后可上架交易</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {marketItems.map((item) => (
                    <div key={item.id} className="bg-white/10 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white">{item.title}</h4>
                        <span className="text-green-400 font-bold">¥{item.price}</span>
                      </div>
                      <p className="text-white/70 text-sm mb-3">{item.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-white/60">浏览: </span>
                          <span className="text-blue-400">{item.views}</span>
                        </div>
                        <div>
                          <span className="text-white/60">引用: </span>
                          <span className="text-purple-400">{item.citations}</span>
                        </div>
                        <div>
                          <span className="text-white/60">购买: </span>
                          <span className="text-green-400">{item.purchases}</span>
                        </div>
                        <div>
                          <span className="text-white/60">收益: </span>
                          <span className="text-yellow-400">¥{item.totalRevenue.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
                          {item.status === 'active' ? '销售中' : '已下架'}
                        </span>
                        <span className="text-xs text-white/50">
                          {item.listedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 创建数字分身模态框 */}
      {showCreateTwin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">创建数字分身</h3>
              <button
                onClick={() => setShowCreateTwin(false)}
                className="text-white/50 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">名称</label>
                <input
                  type="text"
                  value={newTwin.name || ''}
                  onChange={(e) => setNewTwin(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="为您的数字分身命名"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">描述</label>
                <textarea
                  value={newTwin.description || ''}
                  onChange={(e) => setNewTwin(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-20"
                  placeholder="描述数字分身的特点和用途"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">气质类型</label>
                <select
                  value={newTwin.personality?.temperament || ''}
                  onChange={(e) => setNewTwin(prev => ({
                    ...prev,
                    personality: { ...prev.personality!, temperament: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">选择气质类型</option>
                  <option value="理性分析型">理性分析型</option>
                  <option value="创意想象型">创意想象型</option>
                  <option value="温和共情型">温和共情型</option>
                  <option value="积极行动型">积极行动型</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">大语言模型</label>
                <select
                  value={newTwin.tools?.llmModel || 'gpt-4'}
                  onChange={(e) => setNewTwin(prev => ({
                    ...prev,
                    tools: { ...prev.tools!, llmModel: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3">Claude-3</option>
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="qwen-max">通义千问</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={createDigitalTwin}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  创建
                </button>
                <button
                  onClick={() => setShowCreateTwin(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 数字分身界面模态框 */}
      {showTwinInterface && selectedTwin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">数字分身界面</h3>
              <button
                onClick={() => setShowTwinInterface(false)}
                className="text-white/50 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-white/70 text-center py-8">
              <UserIcon className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p>数字分身界面开发中...</p>
              <p className="text-sm mt-2">将支持完整的个性化配置和交互功能</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 