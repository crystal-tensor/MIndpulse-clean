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
} from '@heroicons/react/24/outline';

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
  // 价值评估属性
  citations: number;          // 被引用次数
  impact: number;            // 影响力分数
  revenue: number;           // 广告收益
  visibility: 'public' | 'private' | 'selective'; // 可见性
  viewers: string[];         // 允许查看的用户
  lastUpdated: Date;
  quantumEntanglement: string[]; // 量子纠缠关联节点
  paperReferences: string[];     // 论文引用
  valueScore: number;           // 综合价值评分
}

// 数字分身接口 - 36军官体系
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
  // 36军官特性
  militaryRank: string;
  specialization: string;
  quantumState: 'superposition' | 'entangled' | 'collapsed';
  consciousness: number; // 意识水平 0-100
  empathy: number;      // 共情能力 0-100
  creativity: number;   // 创造力 0-100
  commandLevel: number; // 指挥层级 1-6
}

// 量子计算状态
interface QuantumState {
  isActive: boolean;
  coherence: number;
  entanglement: number;
  superposition: string[];
  quantumAdvantage: number;
}

// 人机互动状态
interface InteractionState {
  mode: 'observe' | 'collaborate' | 'learn' | 'create';
  trust: number;
  understanding: number;
  synergy: number;
  digitalTwinSync: number;
}

export default function SpiritCorridorV2() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
    quantumAdvantage: 0,
  });
  
  // 人机互动状态
  const [interaction, setInteraction] = useState<InteractionState>({
    mode: 'observe',
    trust: 50,
    understanding: 50,
    synergy: 50,
    digitalTwinSync: 0,
  });
  
  // UI状态
  const [activePanel, setActivePanel] = useState<'knowledge' | 'avatars' | 'quantum' | 'interaction'>('knowledge');
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showRevenuePanel, setShowRevenuePanel] = useState(false);
  const [showPaperEvaluation, setShowPaperEvaluation] = useState(false);
  const [isQuantumMode, setIsQuantumMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'avatar', 
    content: string, 
    timestamp: Date,
    avatarId?: string
  }>>([]);

  // 初始化知识图谱数据
  useEffect(() => {
    const initialNodes: KnowledgeNode[] = [
      {
        id: '1',
        name: '量子意识理论',
        category: 'quantum-consciousness',
        connections: ['2', '3', '7'],
        level: 5,
        x: 200,
        y: 150,
        color: '#8B5CF6',
        citations: 247,
        impact: 95,
        revenue: 2470.50,
        visibility: 'selective',
        viewers: ['quantum-researcher', 'consciousness-expert'],
        lastUpdated: new Date(),
        quantumEntanglement: ['2', '7'],
        paperReferences: ['Nature Quantum', 'Science', 'Physical Review'],
        valueScore: 92,
      },
      {
        id: '2',
        name: '数字分身伦理',
        category: 'digital-ethics',
        connections: ['1', '4', '5'],
        level: 4,
        x: 350,
        y: 200,
        color: '#10B981',
        citations: 156,
        impact: 88,
        revenue: 1560.25,
        visibility: 'public',
        viewers: [],
        lastUpdated: new Date(),
        quantumEntanglement: ['1', '4'],
        paperReferences: ['AI Ethics Journal', 'IEEE Computer'],
        valueScore: 85,
      },
      {
        id: '3',
        name: '集体智慧涌现',
        category: 'collective-intelligence',
        connections: ['1', '6', '8'],
        level: 5,
        x: 150,
        y: 300,
        color: '#F59E0B',
        citations: 203,
        impact: 91,
        revenue: 2030.75,
        visibility: 'private',
        viewers: ['self'],
        lastUpdated: new Date(),
        quantumEntanglement: ['1', '6'],
        paperReferences: ['Complexity Science', 'Network Science'],
        valueScore: 89,
      },
      {
        id: '4',
        name: '36军官指挥体系',
        category: 'command-system',
        connections: ['2', '5', '8'],
        level: 4,
        x: 400,
        y: 100,
        color: '#DC2626',
        citations: 89,
        impact: 82,
        revenue: 890.00,
        visibility: 'selective',
        viewers: ['military-ai', 'strategy-expert'],
        lastUpdated: new Date(),
        quantumEntanglement: ['2', '8'],
        paperReferences: ['Military AI Review', 'Defense Technology'],
        valueScore: 78,
      },
      {
        id: '5',
        name: '完美人机互动',
        category: 'human-ai-interaction',
        connections: ['2', '4', '6'],
        level: 3,
        x: 300,
        y: 350,
        color: '#3B82F6',
        citations: 134,
        impact: 86,
        revenue: 1340.30,
        visibility: 'public',
        viewers: [],
        lastUpdated: new Date(),
        quantumEntanglement: ['4', '6'],
        paperReferences: ['HCI Journal', 'Interaction Studies'],
        valueScore: 83,
      },
      {
        id: '6',
        name: '意识枢纽连接',
        category: 'consciousness-hub',
        connections: ['3', '5', '7'],
        level: 4,
        x: 100,
        y: 400,
        color: '#06B6D4',
        citations: 178,
        impact: 93,
        revenue: 1780.60,
        visibility: 'selective',
        viewers: ['consciousness-researcher'],
        lastUpdated: new Date(),
        quantumEntanglement: ['3', '5'],
        paperReferences: ['Consciousness Studies', 'Mind & Machine'],
        valueScore: 90,
      },
      {
        id: '7',
        name: '量子纠缠网络',
        category: 'quantum-network',
        connections: ['1', '6', '8'],
        level: 5,
        x: 50,
        y: 100,
        color: '#8B5CF6',
        citations: 298,
        impact: 97,
        revenue: 2980.90,
        visibility: 'private',
        viewers: ['self'],
        lastUpdated: new Date(),
        quantumEntanglement: ['1', '8'],
        paperReferences: ['Nature Physics', 'Quantum Information'],
        valueScore: 96,
      },
      {
        id: '8',
        name: '垂手可得的人性',
        category: 'human-nature',
        connections: ['3', '4', '7'],
        level: 5,
        x: 450,
        y: 50,
        color: '#EF4444',
        citations: 167,
        impact: 89,
        revenue: 1670.45,
        visibility: 'selective',
        viewers: ['psychology-expert', 'philosophy-scholar'],
        lastUpdated: new Date(),
        quantumEntanglement: ['4', '7'],
        paperReferences: ['Psychology Today', 'Philosophy of Mind'],
        valueScore: 87,
      },
    ];
    setKnowledgeNodes(initialNodes);
  }, []);

  // 初始化36军官数字分身体系
  useEffect(() => {
    const militaryAvatars: DigitalAvatar[] = [
      // 指挥层 (Level 6) - 元帅级
      {
        id: 'marshal-1',
        name: '量子元帅',
        role: '最高战略指挥官',
        description: '统领全局，掌控量子计算优势，制定最高层战略决策',
        knowledgeNodes: ['1', '7', '8'],
        tools: ['量子战略矩阵', '全局决策树', '时空模拟器'],
        performance: { efficiency: 98, accuracy: 99, automation: 90, learning: 95 },
        isActive: true,
        color: 'from-purple-700 to-indigo-800',
        militaryRank: '元帅',
        specialization: '量子战略统筹',
        quantumState: 'superposition',
        consciousness: 98,
        empathy: 85,
        creativity: 92,
        commandLevel: 6,
      },
      
      // 战略层 (Level 5) - 上将级
      {
        id: 'general-1',
        name: '意识上将',
        role: '意识枢纽战略官',
        description: '负责意识层面的战略规划，连接人类与AI的深层理解',
        knowledgeNodes: ['3', '6', '8'],
        tools: ['意识映射', '情感计算', '共情网络'],
        performance: { efficiency: 95, accuracy: 96, automation: 85, learning: 98 },
        isActive: true,
        color: 'from-amber-600 to-orange-700',
        militaryRank: '上将',
        specialization: '意识战略',
        quantumState: 'entangled',
        consciousness: 96,
        empathy: 99,
        creativity: 89,
        commandLevel: 5,
      },
      
      {
        id: 'general-2',
        name: '创新上将',
        role: '技术创新战略官',
        description: '推动技术边界，探索未知领域，引领创新方向',
        knowledgeNodes: ['1', '2', '4'],
        tools: ['创新引擎', '技术预测', '突破分析'],
        performance: { efficiency: 92, accuracy: 94, automation: 95, learning: 97 },
        isActive: true,
        color: 'from-blue-600 to-cyan-700',
        militaryRank: '上将',
        specialization: '技术创新',
        quantumState: 'superposition',
        consciousness: 88,
        empathy: 75,
        creativity: 99,
        commandLevel: 5,
      },
      
      // 战术层 (Level 4) - 中将级
      {
        id: 'lieutenant-general-1',
        name: '伦理中将',
        role: '道德与伦理监督官',
        description: '确保所有决策符合伦理标准，保护人类核心价值',
        knowledgeNodes: ['2', '5', '8'],
        tools: ['伦理检测器', '价值对齐', '道德推理'],
        performance: { efficiency: 88, accuracy: 97, automation: 70, learning: 92 },
        isActive: true,
        color: 'from-green-600 to-emerald-700',
        militaryRank: '中将',
        specialization: '伦理监督',
        quantumState: 'collapsed',
        consciousness: 94,
        empathy: 97,
        creativity: 82,
        commandLevel: 4,
      },
      
      {
        id: 'lieutenant-general-2',
        name: '互动中将',
        role: '人机交互指挥官',
        description: '优化人机协作模式，实现完美互动体验',
        knowledgeNodes: ['5', '6', '8'],
        tools: ['交互优化', '体验设计', '协作引擎'],
        performance: { efficiency: 90, accuracy: 93, automation: 88, learning: 94 },
        isActive: true,
        color: 'from-pink-600 to-rose-700',
        militaryRank: '中将',
        specialization: '人机交互',
        quantumState: 'entangled',
        consciousness: 91,
        empathy: 95,
        creativity: 88,
        commandLevel: 4,
      },
      
      // 执行层 (Level 3) - 少将级
      {
        id: 'major-general-1',
        name: '数据少将',
        role: '数据分析与洞察官',
        description: '深度分析数据模式，提供战略洞察和预测',
        knowledgeNodes: ['1', '3', '7'],
        tools: ['数据挖掘', '模式识别', '预测分析'],
        performance: { efficiency: 94, accuracy: 96, automation: 92, learning: 89 },
        isActive: false,
        color: 'from-indigo-600 to-purple-700',
        militaryRank: '少将',
        specialization: '数据分析',
        quantumState: 'superposition',
        consciousness: 85,
        empathy: 70,
        creativity: 85,
        commandLevel: 3,
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

    // 绘制背景网格（量子效果）
    if (isQuantumMode) {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

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
          ctx.setLineDash([8, 4]);
          
          // 添加量子效果动画
          if (isQuantumMode) {
            const gradient = ctx.createLinearGradient(node.x, node.y, connectedNode.x, connectedNode.y);
            gradient.addColorStop(0, '#8B5CF6');
            gradient.addColorStop(0.5, '#3B82F6');
            gradient.addColorStop(1, '#8B5CF6');
            ctx.strokeStyle = gradient;
          }
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
      // 节点主体
      ctx.beginPath();
      const radius = 20 + node.level * 3;
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      // 根据可见性和价值设置样式
      let alpha = 1.0;
      if (node.visibility === 'private') alpha = 0.6;
      else if (node.visibility === 'selective') alpha = 0.8;
      
      // 价值越高，光晕越强
      if (node.valueScore > 90) {
        const glowRadius = radius + 10;
        const gradient = ctx.createRadialGradient(node.x, node.y, radius, node.x, node.y, glowRadius);
        gradient.addColorStop(0, node.color + 'FF');
        gradient.addColorStop(1, node.color + '00');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      ctx.fillStyle = node.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
      
      // 选中状态
      if (selectedNode === node.id) {
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      
      // 收益指示器
      if (node.revenue > 1500) {
        ctx.beginPath();
        ctx.arc(node.x + radius - 5, node.y - radius + 5, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#10B981';
        ctx.fill();
        
        // 收益数字
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('¥', node.x + radius - 5, node.y - radius + 9);
      }
      
      // 引用数量指示器
      if (node.citations > 100) {
        ctx.beginPath();
        ctx.arc(node.x - radius + 5, node.y - radius + 5, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.citations.toString(), node.x - radius + 5, node.y - radius + 9);
      }
      
      // 节点名称
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + radius + 15);
    });
  }, [knowledgeNodes, selectedNode, isQuantumMode]);

  // 画布点击处理
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 检查点击的节点
    const clickedNode = knowledgeNodes.find(node => {
      const radius = 20 + node.level * 3;
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= radius;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode.id);
      // 根据可见性检查是否可以查看
      if (clickedNode.visibility === 'private' && !clickedNode.viewers.includes('self')) {
        // 显示"看不透"的效果
        alert('此节点为私有，您无法查看详细信息，但可以看到其存在。');
        return;
      }
    } else {
      setSelectedNode(null);
    }
  };

  // 启动量子模式
  const activateQuantumMode = () => {
    setIsQuantumMode(true);
    setQuantumState({
      isActive: true,
      coherence: 92,
      entanglement: 85,
      superposition: ['1', '7', '8'],
      quantumAdvantage: 78,
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
        let response = '';
        
        // 根据军衔和专长生成不同回复
        switch (avatar.militaryRank) {
          case '元帅':
            response = `从最高战略层面分析，${chatInput}涉及的问题需要量子计算优势来解决。我建议启动全局决策矩阵...`;
            break;
          case '上将':
            response = `基于我的${avatar.specialization}专长，这个问题触及了人性的底层逻辑。让我们从意识层面来理解...`;
            break;
          case '中将':
            response = `从${avatar.specialization}角度，我需要确保我们的方案符合伦理标准。建议进行价值对齐检查...`;
            break;
          default:
            response = `作为${avatar.name}，我将运用${avatar.specialization}能力来协助您...`;
        }
        
        const avatarMessage = {
          role: 'avatar' as const,
          content: response,
          timestamp: new Date(),
          avatarId: avatar.id,
        };
        setChatHistory(prev => [...prev, avatarMessage]);
        
        // 提升互动指标
        setInteraction(prev => ({
          ...prev,
          trust: Math.min(100, prev.trust + avatar.empathy / 20),
          understanding: Math.min(100, prev.understanding + avatar.consciousness / 50),
          synergy: Math.min(100, prev.synergy + 2),
          digitalTwinSync: Math.min(100, prev.digitalTwinSync + 3),
        }));
      }
    }, 1500);

    setChatInput('');
  };

  // 重绘画布
  useEffect(() => {
    drawKnowledgeGraph();
  }, [drawKnowledgeGraph]);

  const selectedNodeData = selectedNode ? knowledgeNodes.find(n => n.id === selectedNode) : null;
  const selectedAvatarData = selectedAvatar ? avatars.find(a => a.id === selectedAvatar) : null;
  const totalRevenue = knowledgeNodes.reduce((sum, node) => sum + node.revenue, 0);

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
                  灵境回廊 2.0
                  <span className="ml-2 text-sm bg-purple-600 px-2 py-1 rounded">量子增强</span>
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
                      {panel === 'avatars' && '36军官'}
                      {panel === 'quantum' && '量子计算'}
                      {panel === 'interaction' && '数字分身'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* 总收益显示 */}
                <div className="bg-green-600/20 px-3 py-1 rounded-lg">
                  <span className="text-green-400 font-bold">¥{totalRevenue.toFixed(2)}</span>
                </div>
                
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
                  {isQuantumMode ? '量子激活' : '量子模式'}
                </button>
                
                {/* 论文评价 */}
                <button
                  onClick={() => setShowPaperEvaluation(true)}
                  className="p-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20"
                >
                  <BuildingLibraryIcon className="w-5 h-5" />
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
              <div className="absolute inset-0 bg-purple-500/5 backdrop-blur-[1px]">
                <div className="absolute top-4 left-4 bg-black/70 rounded-lg p-4 text-white">
                  <h3 className="font-bold mb-2 flex items-center">
                    <CpuChipIcon className="w-5 h-5 mr-2 text-purple-400" />
                    量子计算状态
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>相干性: {quantumState.coherence}%</div>
                    <div>纠缠度: {quantumState.entanglement}%</div>
                    <div>量子优势: {quantumState.quantumAdvantage}%</div>
                    <div>叠加态: {quantumState.superposition.length} 个节点</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 设计原则提示 */}
            <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 text-white max-w-xs">
              <h4 className="font-semibold mb-2">设计原则</h4>
              <div className="text-xs space-y-1 text-white/80">
                <div>✓ 别人看不透我，但能看懂我</div>
                <div>✓ 知识价值可量化和变现</div>
                <div>✓ 引用越多，收益越高</div>
                <div>✓ 36军官数字分身体系</div>
                <div>✓ 量子计算优势应用</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="w-96 bg-black/20 backdrop-blur-sm border-l border-white/10 overflow-y-auto">
          {activePanel === 'knowledge' && selectedNodeData && (
            <div className="p-6 space-y-6">
              {/* 节点基本信息 */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{selectedNodeData.name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">价值评分</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${selectedNodeData.valueScore}%` }}
                        />
                      </div>
                      <span className="text-white font-bold">{selectedNodeData.valueScore}/100</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">影响力</span>
                    <span className="text-white font-bold">{selectedNodeData.impact}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">被引用</span>
                    <span className="text-blue-400 font-bold">{selectedNodeData.citations} 次</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">广告收益</span>
                    <span className="text-green-400 font-bold">¥{selectedNodeData.revenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 论文引用 */}
              <div>
                <h4 className="text-white font-semibold mb-3">论文引用期刊</h4>
                <div className="space-y-2">
                  {selectedNodeData.paperReferences.map((journal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <BuildingLibraryIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-white/70">{journal}</span>
                    </div>
                  ))}
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
                        {visibility === 'public' && '🌍 公开 - 所有人可见'}
                        {visibility === 'selective' && '👥 选择性 - 指定用户可见'}
                        {visibility === 'private' && '🔒 私有 - 只有自己可见'}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-purple-600/20 rounded-lg">
                  <p className="text-white/80 text-sm">
                    💡 "别人看不透我，但能看懂我" - 选择性可见让您控制知识的暴露程度
                  </p>
                </div>
              </div>

              {/* 量子纠缠关系 */}
              <div>
                <h4 className="text-white font-semibold mb-3">量子纠缠关系</h4>
                <div className="space-y-2">
                  {selectedNodeData.quantumEntanglement.map(entangledId => {
                    const entangledNode = knowledgeNodes.find(n => n.id === entangledId);
                    return entangledNode ? (
                      <div key={entangledId} className="flex items-center space-x-2 p-2 bg-purple-600/20 rounded">
                        <div 
                          className="w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: entangledNode.color }}
                        />
                        <span className="text-white/70">{entangledNode.name}</span>
                        <CpuChipIcon className="w-4 h-4 text-purple-400 ml-auto" />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {activePanel === 'avatars' && (
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <CommandLineIcon className="w-6 h-6 mr-2 text-red-400" />
                36军官数字分身体系
              </h3>
              
              {/* 指挥层级显示 */}
              <div className="mb-6">
                <div className="text-white/70 text-sm mb-2">指挥层级结构</div>
                <div className="space-y-1">
                  {[6, 5, 4, 3, 2, 1].map(level => {
                    const levelAvatars = avatars.filter(a => a.commandLevel === level);
                    const levelName = level === 6 ? '元帅' : level === 5 ? '上将' : level === 4 ? '中将' : 
                                     level === 3 ? '少将' : level === 2 ? '上校' : '中校';
                    return (
                      <div key={level} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${levelAvatars.length > 0 ? 'bg-green-400' : 'bg-gray-600'}`} />
                        <span className="text-white/60 text-sm">{levelName} ({levelAvatars.length})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

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
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white">{avatar.name}</h4>
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                          {avatar.militaryRank}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        avatar.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                      }`}>
                        {avatar.isActive ? '在线' : '离线'}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">{avatar.role}</p>
                    <p className="text-white/60 text-xs mb-3">{avatar.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div className="text-white/60">专长: {avatar.specialization}</div>
                      <div className="text-purple-400">意识: {avatar.consciousness}%</div>
                      <div className="text-blue-400">共情: {avatar.empathy}%</div>
                      <div className="text-green-400">创造: {avatar.creativity}%</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          avatar.quantumState === 'superposition' ? 'bg-purple-400 animate-pulse' :
                          avatar.quantumState === 'entangled' ? 'bg-blue-400' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-white/60">{avatar.quantumState}</span>
                      </div>
                      <div className="text-xs text-white/60">Lv.{avatar.commandLevel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePanel === 'quantum' && (
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <CpuChipIcon className="w-6 h-6 mr-2 text-purple-400" />
                量子计算中心
              </h3>
              
              {/* 量子优势展示 */}
              <div className="bg-purple-600/20 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">量子优势应用</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">并行处理能力</span>
                    <span className="text-purple-400">2^n 倍提升</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">优化算法效率</span>
                    <span className="text-purple-400">指数级加速</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">模式识别精度</span>
                    <span className="text-purple-400">量子增强</span>
                  </div>
                </div>
              </div>

              {/* 系统状态监控 */}
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
                        className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
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
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${quantumState.entanglement}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-white/70">量子优势</span>
                      <span className="text-white">{quantumState.quantumAdvantage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${quantumState.quantumAdvantage}%` }}
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
                      <div className="flex items-center space-x-2">
                        <span className="text-white/70 text-sm">{avatar.name}</span>
                        <span className="text-xs text-white/50">({avatar.militaryRank})</span>
                      </div>
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
          )}

          {activePanel === 'interaction' && (
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-blue-400" />
                完美人机互动
              </h3>
              
              {/* 数字分身同步度 */}
              <div className="mb-4 p-3 bg-blue-600/20 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-white/70">数字分身同步度</span>
                  <span className="text-blue-400 font-bold">{interaction.digitalTwinSync}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${interaction.digitalTwinSync}%` }}
                  />
                </div>
              </div>
              
              {/* 互动指标 */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/70">信任度</span>
                    <span className="text-white">{interaction.trust}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000"
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
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
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
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
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
                      <RocketLaunchIcon className="w-12 h-12 mx-auto mb-4 text-white/30" />
                      <p>选择一个36军官数字分身开始深度对话...</p>
                      <p className="text-xs mt-2">体验完美的人机互动</p>
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
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-white/60">
                              {message.role === 'user' ? '您' : 
                               avatars.find(a => a.id === message.avatarId)?.name || '分身'}
                            </span>
                            <span className="text-xs text-white/40">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-white text-sm">{message.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 当前选中的分身信息 */}
                {selectedAvatarData && (
                  <div className="mb-3 p-2 bg-white/10 rounded-lg">
                    <div className="text-xs text-white/70">
                      正在与 <span className="text-white font-bold">{selectedAvatarData.name}</span> 
                      ({selectedAvatarData.militaryRank}) 对话
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      专长: {selectedAvatarData.specialization} | 
                      意识: {selectedAvatarData.consciousness}% | 
                      共情: {selectedAvatarData.empathy}%
                    </div>
                  </div>
                )}
                
                {/* 输入区域 */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={selectedAvatar ? "与数字分身深度对话..." : "请先选择一个36军官分身"}
                    disabled={!selectedAvatar}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!selectedAvatar || !chatInput.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
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
              <h3 className="text-xl font-bold text-white flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 mr-2 text-green-400" />
                知识变现收益
              </h3>
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
                  <div className="text-3xl font-bold text-green-400">
                    ¥{totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-white/70">总收益</div>
                  <div className="text-xs text-white/50 mt-1">
                    基于论文引用和知识价值评估
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold">收益明细</h4>
                {knowledgeNodes
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((node) => (
                    <div key={node.id} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <div className="flex-1">
                        <div className="text-white font-medium">{node.name}</div>
                        <div className="text-white/60 text-sm flex items-center space-x-2">
                          <span>{node.citations} 次引用</span>
                          <span>•</span>
                          <span>价值评分: {node.valueScore}/100</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {node.visibility === 'public' && <span className="text-green-400 text-xs">🌍 公开</span>}
                          {node.visibility === 'selective' && <span className="text-yellow-400 text-xs">👥 选择性</span>}
                          {node.visibility === 'private' && <span className="text-red-400 text-xs">🔒 私有</span>}
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">
                        ¥{node.revenue.toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="bg-blue-600/20 rounded-lg p-3">
                <div className="text-white/80 text-sm">
                  💡 收益计算公式: 引用次数 × 影响力 × 价值评分 × 可见性系数
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 隐私设置模态框 */}
      {showPrivacySettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <EyeSlashIcon className="w-6 h-6 mr-2 text-purple-400" />
                隐私设置
              </h3>
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
                  <option value="public">🌍 公开 - 所有人可见</option>
                  <option value="selective">👥 选择性 - 指定用户可见</option>
                  <option value="private">🔒 私有 - 仅自己可见</option>
                </select>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">核心设计原则</h4>
                <div className="bg-purple-600/20 rounded-lg p-4">
                  <div className="text-white/90 text-sm space-y-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>别人看不透我，但能看懂我</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>知识价值可量化和变现</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>引用越多，收益越高</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>36军官数字分身体系</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>量子计算优势应用</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">与意识枢纽对应</h4>
                <div className="bg-blue-600/20 rounded-lg p-3">
                  <div className="text-white/80 text-sm">
                    灵境回廊的功能与意识枢纽主界面完全对应，实现了垂手可得的人性底层逻辑需求。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 论文评价模态框 */}
      {showPaperEvaluation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <BuildingLibraryIcon className="w-6 h-6 mr-2 text-blue-400" />
                论文评价体系
              </h3>
              <button
                onClick={() => setShowPaperEvaluation(false)}
                className="text-white/70 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-600/20 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">评价维度</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-white font-medium">影响因子</div>
                    <div className="text-white/70">期刊影响力评分</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-white font-medium">引用次数</div>
                    <div className="text-white/70">被其他论文引用</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-white font-medium">创新程度</div>
                    <div className="text-white/70">原创性和突破性</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-white font-medium">实用价值</div>
                    <div className="text-white/70">应用前景和意义</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">知识图谱价值评估</h4>
                <div className="space-y-3">
                  {knowledgeNodes.map((node) => (
                    <div key={node.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-white">{node.name}</div>
                        <div className="text-right">
                          <div className="text-white font-bold">{node.valueScore}/100</div>
                          <div className="text-xs text-white/60">综合评分</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-white/60">引用: </span>
                          <span className="text-blue-400">{node.citations}</span>
                        </div>
                        <div>
                          <span className="text-white/60">影响: </span>
                          <span className="text-green-400">{node.impact}/100</span>
                        </div>
                        <div>
                          <span className="text-white/60">收益: </span>
                          <span className="text-yellow-400">¥{node.revenue.toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-white/60 mb-1">发表期刊:</div>
                        <div className="flex flex-wrap gap-1">
                          {node.paperReferences.map((journal, index) => (
                            <span key={index} className="text-xs bg-blue-600/30 px-2 py-1 rounded">
                              {journal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-600/20 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">价值认证与变现</h4>
                <div className="text-white/80 text-sm space-y-2">
                  <p>• 基于论文评价体系的知识价值自动评估</p>
                  <p>• 被引用次数直接影响广告收益分成</p>
                  <p>• 个人知识图谱的新概念，连接数越多收益越高</p>
                  <p>• 实现知识的量化价值和市场化变现</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 