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
} from '@heroicons/react/24/outline';
import { SpiritCorridorTranslations, Language } from '@/lib/translations/spirit-corridor';

// 知识图谱节点接口
interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  connections: string[];
  level: number;
  x: number;
  y: number;
  color: string;
  // 新增价值评估属性
  citations: number;          // 被引用次数
  impact: number;            // 影响力分数
  revenue: number;           // 广告收益
  visibility: 'public' | 'private' | 'selective'; // 可见性
  viewers: string[];         // 允许查看的用户
  lastUpdated: Date;
  quantumEntanglement: string[]; // 量子纠缠关联节点
}

// 数字分身接口
interface DigitalAvatar {
  id: string;
  name: string;
  role: string;
  description: string;
  knowledgeNodes: string[];
  tools: string[];
  performance: {
    efficiency: number;
    accuracy: number;
    automation: number;
    learning: number;
  };
  isActive: boolean;
  color: string;
  // 新增36军官特性
  militaryRank: string;
  specialization: string;
  quantumState: 'superposition' | 'entangled' | 'collapsed';
  consciousness: number; // 意识水平 0-100
  empathy: number;      // 共情能力 0-100
  creativity: number;   // 创造力 0-100
}

// 量子计算状态
interface QuantumState {
  isActive: boolean;
  coherence: number;
  entanglement: number;
  superposition: string[];
}

// 人机互动状态
interface InteractionState {
  mode: 'observe' | 'collaborate' | 'learn' | 'create';
  trust: number;
  understanding: number;
  synergy: number;
}

export default function SpiritCorridor() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('zh');
  
  // 核心状态
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([]);
  const [avatars, setAvatars] = useState<DigitalAvatar[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  
  // 量子计算状态
  const [quantumState, setQuantumState] = useState<QuantumState>({
    isActive: false,
    coherence: 0,
    entanglement: 0,
    superposition: [],
  });
  
  // 人机互动状态
  const [interaction, setInteraction] = useState<InteractionState>({
    mode: 'observe',
    trust: 50,
    understanding: 50,
    synergy: 50,
  });
  
  // UI状态
  const [activePanel, setActivePanel] = useState<'knowledge' | 'avatars' | 'quantum' | 'interaction'>('knowledge');
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showRevenuePanel, setShowRevenuePanel] = useState(false);
  const [isQuantumMode, setIsQuantumMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'avatar', content: string, timestamp: Date}>>([]);

  const t = SpiritCorridorTranslations[currentLanguage];

  // 初始化知识图谱数据
  useEffect(() => {
    const initialNodes: KnowledgeNode[] = [
      {
        id: '1',
        name: '量子计算理论',
        category: 'quantum',
        connections: ['2', '3', '7'],
        level: 5,
        x: 200,
        y: 150,
        color: '#8B5CF6',
        citations: 147,
        impact: 92,
        revenue: 1250.50,
        visibility: 'selective',
        viewers: ['researcher', 'quantum-physicist'],
        lastUpdated: new Date(),
        quantumEntanglement: ['2', '7'],
      },
      {
        id: '2',
        name: '人工智能伦理',
        category: 'ai-ethics',
        connections: ['1', '4', '5'],
        level: 4,
        x: 350,
        y: 200,
        color: '#10B981',
        citations: 89,
        impact: 78,
        revenue: 890.25,
        visibility: 'public',
        viewers: [],
        lastUpdated: new Date(),
        quantumEntanglement: ['1', '4'],
      },
      {
        id: '3',
        name: '意识哲学',
        category: 'consciousness',
        connections: ['1', '6'],
        level: 5,
        x: 150,
        y: 300,
        color: '#F59E0B',
        citations: 203,
        impact: 95,
        revenue: 2100.75,
        visibility: 'private',
        viewers: ['self'],
        lastUpdated: new Date(),
        quantumEntanglement: ['1', '6'],
      },
      {
        id: '4',
        name: '数字分身技术',
        category: 'digital-twin',
        connections: ['2', '5', '8'],
        level: 4,
        x: 400,
        y: 100,
        color: '#3B82F6',
        citations: 156,
        impact: 85,
        revenue: 1560.00,
        visibility: 'selective',
        viewers: ['tech-lead', 'ai-researcher'],
        lastUpdated: new Date(),
        quantumEntanglement: ['2', '8'],
      },
      {
        id: '5',
        name: '人机协作',
        category: 'human-ai',
        connections: ['2', '4', '6'],
        level: 3,
        x: 300,
        y: 350,
        color: '#EF4444',
        citations: 67,
        impact: 72,
        revenue: 670.30,
        visibility: 'public',
        viewers: [],
        lastUpdated: new Date(),
        quantumEntanglement: ['4', '6'],
      },
      {
        id: '6',
        name: '集体智慧',
        category: 'collective',
        connections: ['3', '5'],
        level: 4,
        x: 100,
        y: 400,
        color: '#06B6D4',
        citations: 134,
        impact: 88,
        revenue: 1340.60,
        visibility: 'selective',
        viewers: ['community-leader'],
        lastUpdated: new Date(),
        quantumEntanglement: ['3', '5'],
      },
      {
        id: '7',
        name: '量子纠缠网络',
        category: 'quantum',
        connections: ['1', '8'],
        level: 5,
        x: 50,
        y: 100,
        color: '#8B5CF6',
        citations: 178,
        impact: 94,
        revenue: 1780.90,
        visibility: 'private',
        viewers: ['self'],
        lastUpdated: new Date(),
        quantumEntanglement: ['1', '8'],
      },
      {
        id: '8',
        name: '36军官体系',
        category: 'military-ai',
        connections: ['4', '7'],
        level: 5,
        x: 450,
        y: 50,
        color: '#DC2626',
        citations: 92,
        impact: 89,
        revenue: 920.45,
        visibility: 'selective',
        viewers: ['strategic-ai'],
        lastUpdated: new Date(),
        quantumEntanglement: ['4', '7'],
      },
    ];
    setKnowledgeNodes(initialNodes);
  }, []);

  // 初始化36军官数字分身
  useEffect(() => {
    const militaryAvatars: DigitalAvatar[] = [
      {
        id: 'general-1',
        name: '量子战略官',
        role: '战略规划与量子计算',
        description: '负责整体战略规划，运用量子计算优化决策路径',
        knowledgeNodes: ['1', '7', '8'],
        tools: ['量子模拟器', '战略分析', '决策树'],
        performance: { efficiency: 95, accuracy: 98, automation: 85, learning: 92 },
        isActive: true,
        color: 'from-purple-600 to-blue-600',
        militaryRank: '上将',
        specialization: '量子战略',
        quantumState: 'superposition',
        consciousness: 95,
        empathy: 75,
        creativity: 88,
      },
      {
        id: 'colonel-1',
        name: '意识交互官',
        role: '人机意识桥梁',
        description: '专注于理解和翻译人类意识，建立深度人机连接',
        knowledgeNodes: ['3', '5', '6'],
        tools: ['意识分析', '情感计算', '共情模拟'],
        performance: { efficiency: 88, accuracy: 92, automation: 70, learning: 96 },
        isActive: true,
        color: 'from-amber-500 to-orange-600',
        militaryRank: '上校',
        specialization: '意识交互',
        quantumState: 'entangled',
        consciousness: 92,
        empathy: 98,
        creativity: 85,
      },
      {
        id: 'major-1',
        name: '伦理守护官',
        role: 'AI伦理与道德监督',
        description: '确保AI系统的伦理合规，保护人类价值观',
        knowledgeNodes: ['2', '3', '5'],
        tools: ['伦理检测', '道德推理', '价值对齐'],
        performance: { efficiency: 82, accuracy: 96, automation: 65, learning: 89 },
        isActive: true,
        color: 'from-green-500 to-teal-600',
        militaryRank: '少校',
        specialization: '伦理监督',
        quantumState: 'collapsed',
        consciousness: 88,
        empathy: 95,
        creativity: 78,
      },
      {
        id: 'captain-1',
        name: '创新探索官',
        role: '技术创新与研发',
        description: '探索前沿技术，推动数字分身技术边界',
        knowledgeNodes: ['4', '7', '8'],
        tools: ['创新引擎', '技术雷达', '原型开发'],
        performance: { efficiency: 90, accuracy: 87, automation: 92, learning: 94 },
        isActive: false,
        color: 'from-blue-500 to-indigo-600',
        militaryRank: '上尉',
        specialization: '技术创新',
        quantumState: 'superposition',
        consciousness: 85,
        empathy: 70,
        creativity: 96,
      },
    ];
    setAvatars(militaryAvatars);
  }, []);

  // 绘制知识图谱
  const drawKnowledgeGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制连接线
    knowledgeNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = knowledgeNodes.find(n => n.id === connectionId);
        if (!connectedNode) return;

        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(connectedNode.x, connectedNode.y);
        
        // 量子纠缠连接用特殊样式
        if (node.quantumEntanglement.includes(connectionId)) {
          ctx.strokeStyle = '#8B5CF6';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
        } else {
          ctx.strokeStyle = '#6B7280';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        }
        ctx.stroke();
      });
    });

    // 绘制节点
    knowledgeNodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20 + node.level * 2, 0, 2 * Math.PI);
      
      // 根据可见性设置透明度
      const alpha = node.visibility === 'private' ? 0.5 : 
                   node.visibility === 'selective' ? 0.7 : 1.0;
      
      ctx.fillStyle = node.color + Math.floor(alpha * 255).toString(16);
      ctx.fill();
      
      // 选中状态
      if (selectedNode === node.id) {
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // 绘制收益指示器
      if (node.revenue > 1000) {
        ctx.beginPath();
        ctx.arc(node.x + 15, node.y - 15, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#10B981';
        ctx.fill();
      }
    });
  }, [knowledgeNodes, selectedNode]);

  // 画布点击处理
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 检查点击的节点
    const clickedNode = knowledgeNodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 20 + node.level * 2;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode.id);
    } else {
      setSelectedNode(null);
    }
  };

  // 启动量子模式
  const activateQuantumMode = () => {
    setIsQuantumMode(true);
    setQuantumState({
      isActive: true,
      coherence: 85,
      entanglement: 72,
      superposition: ['1', '7', '8'],
    });
    
    // 更新分身量子状态
    setAvatars(prev => prev.map(avatar => ({
      ...avatar,
      quantumState: Math.random() > 0.5 ? 'superposition' : 'entangled' as any,
    })));
  };

  // 发送聊天消息
  const sendMessage = () => {
    if (!chatInput.trim() || !selectedAvatar) return;

    const newMessage = {
      role: 'user' as const,
      content: chatInput,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, newMessage]);

    // 模拟分身回复
    setTimeout(() => {
      const avatar = avatars.find(a => a.id === selectedAvatar);
      if (avatar) {
        const response = {
          role: 'avatar' as const,
          content: `作为${avatar.name}，我理解您的需求。基于我的${avatar.specialization}专长，我建议...`,
          timestamp: new Date(),
        };
        setChatHistory(prev => [...prev, response]);
        
        // 提升互动指标
        setInteraction(prev => ({
          ...prev,
          trust: Math.min(100, prev.trust + 2),
          understanding: Math.min(100, prev.understanding + 1),
          synergy: Math.min(100, prev.synergy + 1),
        }));
      }
    }, 1000);

    setChatInput('');
  };

  // 重绘画布
  useEffect(() => {
    drawKnowledgeGraph();
  }, [drawKnowledgeGraph]);

  const selectedNodeData = selectedNode ? knowledgeNodes.find(n => n.id === selectedNode) : null;
  const selectedAvatarData = selectedAvatar ? avatars.find(a => a.id === selectedAvatar) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 主要内容区域 */}
      <div className="flex h-screen">
        {/* 中央知识图谱区域 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部控制栏 */}
          <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <SparklesIcon className="w-8 h-8 mr-2 text-purple-400" />
                  灵境回廊
                </h1>
                <div className="flex space-x-2">
                  {(['knowledge', 'avatars', 'quantum', 'interaction'] as const).map((panel) => (
                    <button
                      key={panel}
                      onClick={() => setActivePanel(panel)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        activePanel === panel
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {panel === 'knowledge' && '知识图谱'}
                      {panel === 'avatars' && '数字分身'}
                      {panel === 'quantum' && '量子计算'}
                      {panel === 'interaction' && '人机互动'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* 量子模式切换 */}
                <button
                  onClick={activateQuantumMode}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                    isQuantumMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <CpuChipIcon className="w-5 h-5 mr-2" />
                  量子模式
                </button>
                
                {/* 隐私设置 */}
                <button
                  onClick={() => setShowPrivacySettings(true)}
                  className="p-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20"
                >
                  <EyeSlashIcon className="w-5 h-5" />
                </button>
                
                {/* 收益面板 */}
                <button
                  onClick={() => setShowRevenuePanel(true)}
                  className="p-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20"
                >
                  <CurrencyDollarIcon className="w-5 h-5" />
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
            
            {/* 量子状态叠加层 */}
            {isQuantumMode && (
              <div className="absolute inset-0 bg-purple-500/10 backdrop-blur-sm">
                <div className="absolute top-4 left-4 bg-black/50 rounded-lg p-4 text-white">
                  <h3 className="font-bold mb-2">量子计算状态</h3>
                  <div className="space-y-2">
                    <div>相干性: {quantumState.coherence}%</div>
                    <div>纠缠度: {quantumState.entanglement}%</div>
                    <div>叠加态: {quantumState.superposition.length} 个节点</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="w-96 bg-black/20 backdrop-blur-sm border-l border-white/10">
          {activePanel === 'knowledge' && selectedNodeData && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                {/* 节点基本信息 */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">{selectedNodeData.name}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">影响力</span>
                      <span className="text-white font-bold">{selectedNodeData.impact}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">被引用</span>
                      <span className="text-white font-bold">{selectedNodeData.citations} 次</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">广告收益</span>
                      <span className="text-green-400 font-bold">¥{selectedNodeData.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* 可见性设置 */}
                <div>
                  <h4 className="text-white font-semibold mb-3">可见性设置</h4>
                  <div className="space-y-2">
                    {(['public', 'selective', 'private'] as const).map((visibility) => (
                      <label key={visibility} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="visibility"
                          checked={selectedNodeData.visibility === visibility}
                          onChange={() => {
                            setKnowledgeNodes(prev => prev.map(node =>
                              node.id === selectedNodeData.id
                                ? { ...node, visibility }
                                : node
                            ));
                          }}
                          className="text-purple-600"
                        />
                        <span className="text-white/70">
                          {visibility === 'public' && '公开'}
                          {visibility === 'selective' && '选择性可见'}
                          {visibility === 'private' && '私有'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 量子纠缠关系 */}
                <div>
                  <h4 className="text-white font-semibold mb-3">量子纠缠关系</h4>
                  <div className="space-y-2">
                    {selectedNodeData.quantumEntanglement.map(entangledId => {
                      const entangledNode = knowledgeNodes.find(n => n.id === entangledId);
                      return entangledNode ? (
                        <div key={entangledId} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entangledNode.color }}
                          />
                          <span className="text-white/70">{entangledNode.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'avatars' && (
            <div className="p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">36军官数字分身</h3>
              <div className="space-y-4">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedAvatar === avatar.id
                        ? 'bg-purple-600/30 border-2 border-purple-400'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{avatar.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        avatar.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                      }`}>
                        {avatar.isActive ? '在线' : '离线'}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">{avatar.role}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">军衔: {avatar.militaryRank}</span>
                      <span className="text-purple-400">意识: {avatar.consciousness}%</span>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        avatar.quantumState === 'superposition' ? 'bg-purple-400 animate-pulse' :
                        avatar.quantumState === 'entangled' ? 'bg-blue-400' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs text-white/60">{avatar.quantumState}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePanel === 'quantum' && (
            <div className="p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">量子计算中心</h3>
              <div className="space-y-6">
                {/* 量子状态监控 */}
                <div>
                  <h4 className="font-semibold text-white mb-3">系统状态</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/70">量子相干性</span>
                        <span className="text-white">{quantumState.coherence}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${quantumState.coherence}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/70">纠缠强度</span>
                        <span className="text-white">{quantumState.entanglement}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${quantumState.entanglement}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 36军官量子状态 */}
                <div>
                  <h4 className="font-semibold text-white mb-3">军官量子状态</h4>
                  <div className="space-y-2">
                    {avatars.map((avatar) => (
                      <div key={avatar.id} className="flex items-center justify-between p-2 bg-white/10 rounded">
                        <span className="text-white/70">{avatar.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            avatar.quantumState === 'superposition' ? 'bg-purple-400 animate-pulse' :
                            avatar.quantumState === 'entangled' ? 'bg-blue-400' : 'bg-gray-400'
                          }`} />
                          <span className="text-xs text-white/60">{avatar.quantumState}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'interaction' && (
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4">人机互动中心</h3>
              
              {/* 互动指标 */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/70">信任度</span>
                    <span className="text-white">{interaction.trust}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${interaction.trust}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/70">理解度</span>
                    <span className="text-white">{interaction.understanding}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${interaction.understanding}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/70">协同度</span>
                    <span className="text-white">{interaction.synergy}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${interaction.synergy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 聊天区域 */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-black/30 rounded-lg p-4 mb-4 overflow-y-auto">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-white/50 mt-8">
                      选择一个数字分身开始对话...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-purple-600/30 ml-4'
                              : 'bg-blue-600/30 mr-4'
                          }`}
                        >
                          <div className="text-white text-sm">{message.content}</div>
                          <div className="text-white/50 text-xs mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 输入区域 */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={selectedAvatar ? "与数字分身对话..." : "请先选择一个分身"}
                    disabled={!selectedAvatar}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!selectedAvatar || !chatInput.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 收益面板模态框 */}
      {showRevenuePanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">知识变现收益</h3>
              <button
                onClick={() => setShowRevenuePanel(false)}
                className="text-white/70 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-600/20 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ¥{knowledgeNodes.reduce((sum, node) => sum + node.revenue, 0).toFixed(2)}
                  </div>
                  <div className="text-white/70">总收益</div>
                </div>
              </div>
              
              {knowledgeNodes.map((node) => (
                <div key={node.id} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{node.name}</div>
                    <div className="text-white/60 text-sm">{node.citations} 次引用</div>
                  </div>
                  <div className="text-green-400 font-bold">
                    ¥{node.revenue.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 隐私设置模态框 */}
      {showPrivacySettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">隐私设置</h3>
              <button
                onClick={() => setShowPrivacySettings(false)}
                className="text-white/70 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">默认可见性</h4>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option value="public">公开 - 所有人可见</option>
                  <option value="selective">选择性 - 指定用户可见</option>
                  <option value="private">私有 - 仅自己可见</option>
                </select>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">核心设计原则</h4>
                <div className="bg-purple-600/20 rounded-lg p-3">
                  <div className="text-white/90 text-sm space-y-1">
                    <div>✓ 别人看不透我，但能看懂我</div>
                    <div>✓ 知识价值可量化和变现</div>
                    <div>✓ 引用越多，收益越高</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 