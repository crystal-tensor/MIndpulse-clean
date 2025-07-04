'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SpiritCorridorV2 from './SpiritCorridorV2';
import SpiritCorridorV3 from './SpiritCorridorV3';
import {
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ShareIcon,
  PlusIcon,
  CogIcon,
  GlobeAltIcon,
  ChartBarIcon,
  UserPlusIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CloudArrowDownIcon,
  FolderIcon,
  DocumentTextIcon,
  BeakerIcon,
  CpuChipIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

// 3D知识图谱节点接口
interface KnowledgeNode3D {
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

// 图谱生成配置
interface GraphConfig {
  startDate: Date | null;
  endDate: Date | null;
  mode: '2d' | '3d';
  name: string;
  saveLocation: 'cloud' | 'local';
  localPath?: string;
}

// 数字分身配置
interface DigitalTwinConfig {
  name: string;
  description: string;
  selectedGraph: string;
  temperamentType: string;
  selectedAgents: string[];
  llmModel: string;
}

export default function SpiritCorridorV4() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 核心状态
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode3D[]>([]);
  const [savedGraphs, setSavedGraphs] = useState<Array<{id: string, name: string, createdAt: Date}>>([]);
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwinConfig[]>([]);
  
  // UI状态
  const [activePanel, setActivePanel] = useState<'graph' | 'twin' | 'privacy'>('graph');
  const [showGraphConfig, setShowGraphConfig] = useState(false);
  const [showTwinConfig, setShowTwinConfig] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [currentView, setCurrentView] = useState<'v4' | 'v2' | 'v3'>('v4');
  
  // 图谱生成配置
  const [graphConfig, setGraphConfig] = useState<GraphConfig>({
    startDate: null,
    endDate: null,
    mode: '3d',
    name: '',
    saveLocation: 'cloud',
    localPath: '',
  });
  
  // 数字分身配置
  const [twinConfig, setTwinConfig] = useState<DigitalTwinConfig>({
    name: '',
    description: '',
    selectedGraph: '',
    temperamentType: '',
    selectedAgents: ['智能决策', '资产配置'],
    llmModel: 'gpt-4',
  });

  // 初始化3D知识图谱
  useEffect(() => {
    const mock3DNodes: KnowledgeNode3D[] = [
      {
        id: '1',
        name: '量子决策理论',
        category: 'quantum',
        connections: ['2', '3'],
        level: 5,
        x: 100,
        y: 100,
        z: 50,
        color: '#8B5CF6',
        sourceConversation: 'conv-001',
        extractedTime: new Date(),
        confidence: 0.95,
        size: 8,
      },
      {
        id: '2',
        name: '资产配置优化',
        category: 'finance',
        connections: ['1', '3'],
        level: 4,
        x: 200,
        y: 150,
        z: 75,
        color: '#10B981',
        sourceConversation: 'conv-002',
        extractedTime: new Date(),
        confidence: 0.87,
        size: 6,
      },
      {
        id: '3',
        name: '数字分身意识',
        category: 'consciousness',
        connections: ['1', '2'],
        level: 5,
        x: 150,
        y: 200,
        z: 100,
        color: '#F59E0B',
        sourceConversation: 'conv-003',
        extractedTime: new Date(),
        confidence: 0.92,
        size: 10,
      },
    ];
    
    setKnowledgeNodes(mock3DNodes);
  }, []);

  // 绘制3D知识图谱
  const draw3DGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置画布大小
    canvas.width = 800;
    canvas.height = 600;
    
    // 清空画布
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制3D效果的节点
    knowledgeNodes.forEach(node => {
      // 根据z轴位置计算透视效果
      const perspective = 300 / (300 + node.z);
      const x = node.x * perspective + canvas.width / 2;
      const y = node.y * perspective + canvas.height / 2;
      const size = node.size * perspective;
      
      // 绘制节点
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 绘制节点名称
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${12 * perspective}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(node.name, x, y + size + 15);
    });
    
    // 绘制连接线
    knowledgeNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = knowledgeNodes.find(n => n.id === connectionId);
        if (targetNode) {
          const perspective1 = 300 / (300 + node.z);
          const perspective2 = 300 / (300 + targetNode.z);
          
          const x1 = node.x * perspective1 + canvas.width / 2;
          const y1 = node.y * perspective1 + canvas.height / 2;
          const x2 = targetNode.x * perspective2 + canvas.width / 2;
          const y2 = targetNode.y * perspective2 + canvas.height / 2;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = '#4B5563';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
  }, [knowledgeNodes]);

  useEffect(() => {
    draw3DGraph();
  }, [draw3DGraph]);

  // 生成图谱
  const handleGenerateGraph = async () => {
    if (!graphConfig.name.trim()) {
      alert('请输入图谱名称');
      return;
    }
    
    try {
      const response = await fetch('/api/mindpilot/generate-graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: graphConfig.startDate?.toISOString(),
          endDate: graphConfig.endDate?.toISOString(),
          mode: graphConfig.mode,
          name: graphConfig.name,
          saveLocation: graphConfig.saveLocation,
          localPath: graphConfig.localPath,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        const newGraph = {
          id: result.data.graph.metadata.id,
          name: result.data.graph.metadata.name,
          createdAt: new Date(result.data.graph.metadata.createdAt),
        };
        
        setSavedGraphs(prev => [...prev, newGraph]);
        
        // 更新3D知识图谱显示
        if (result.data.graph.nodes) {
          setKnowledgeNodes(result.data.graph.nodes);
        }
        
        setShowGraphConfig(false);
        alert(result.data.message);
      } else {
        alert(result.error || '图谱生成失败');
      }
    } catch (error) {
      console.error('图谱生成错误:', error);
      alert('图谱生成失败，请重试');
    }
  };

  // 创建数字分身
  const handleCreateTwin = async () => {
    if (!twinConfig.name.trim() || !twinConfig.selectedGraph) {
      alert('请填写完整的数字分身配置');
      return;
    }
    
    try {
      const response = await fetch('/api/mindpilot/digital-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(twinConfig),
      });

      const result = await response.json();
      
      if (result.success) {
        setDigitalTwins(prev => [...prev, twinConfig]);
        setShowTwinConfig(false);
        
        // 重置配置
        setTwinConfig({
          name: '',
          description: '',
          selectedGraph: '',
          temperamentType: '',
          selectedAgents: ['智能决策', '资产配置'],
          llmModel: 'gpt-4',
        });
        
        alert(result.data.message);
      } else {
        alert(result.error || '数字分身创建失败');
      }
    } catch (error) {
      console.error('数字分身创建错误:', error);
      alert('数字分身创建失败，请重试');
    }
  };

  if (currentView === 'v2') {
    return <SpiritCorridorV2 />;
  }
  
  if (currentView === 'v3') {
    return <SpiritCorridorV3 />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* 顶部导航 */}
      <div className="border-b border-gray-700 bg-black/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              灵境回廊 V4
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('v4')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'v4' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                V4
              </button>
              <button
                onClick={() => setCurrentView('v2')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'v2' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                V2
              </button>
              <button
                onClick={() => setCurrentView('v3')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'v3' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                V3
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧功能面板 */}
          <div className="col-span-3">
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-6">功能面板</h2>
              
              {/* 图谱生成 */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowGraphConfig(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <ChartBarIcon className="h-5 w-5" />
                  <span>图谱生成</span>
                </button>
                
                <button
                  onClick={() => setShowTwinConfig(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  <span>数字分身</span>
                </button>
                
                <button
                  onClick={() => setShowPrivacySettings(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  <LockClosedIcon className="h-5 w-5" />
                  <span>隐私设置</span>
                </button>
              </div>
              
              {/* 已保存的图谱 */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">已保存图谱</h3>
                <div className="space-y-2">
                  {savedGraphs.map(graph => (
                    <div key={graph.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-sm font-medium">{graph.name}</div>
                      <div className="text-xs text-gray-400">
                        {graph.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 数字分身列表 */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">数字分身</h3>
                <div className="space-y-2">
                  {digitalTwins.map((twin, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-sm font-medium">{twin.name}</div>
                      <div className="text-xs text-gray-400">{twin.temperamentType}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 中间3D知识图谱 */}
          <div className="col-span-6">
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">3D智核交互知识图谱</h2>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-600 rounded-lg"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                基于所有智核对话生成的3D知识网络
              </div>
            </div>
          </div>

          {/* 右侧信息面板 */}
          <div className="col-span-3">
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-6">详细信息</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-900/30 rounded-lg">
                  <h3 className="font-medium text-purple-300">节点统计</h3>
                  <div className="text-2xl font-bold">{knowledgeNodes.length}</div>
                  <div className="text-sm text-gray-400">总知识节点</div>
                </div>
                
                <div className="p-4 bg-blue-900/30 rounded-lg">
                  <h3 className="font-medium text-blue-300">已保存图谱</h3>
                  <div className="text-2xl font-bold">{savedGraphs.length}</div>
                  <div className="text-sm text-gray-400">图谱库</div>
                </div>
                
                <div className="p-4 bg-green-900/30 rounded-lg">
                  <h3 className="font-medium text-green-300">数字分身</h3>
                  <div className="text-2xl font-bold">{digitalTwins.length}</div>
                  <div className="text-sm text-gray-400">活跃分身</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图谱生成弹窗 */}
      {showGraphConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">生成知识图谱</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">开始日期</label>
                <input
                  type="date"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  onChange={(e) => setGraphConfig(prev => ({
                    ...prev,
                    startDate: e.target.value ? new Date(e.target.value) : null
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">结束日期</label>
                <input
                  type="date"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  onChange={(e) => setGraphConfig(prev => ({
                    ...prev,
                    endDate: e.target.value ? new Date(e.target.value) : null
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">图谱模式</label>
                <select
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  value={graphConfig.mode}
                  onChange={(e) => setGraphConfig(prev => ({
                    ...prev,
                    mode: e.target.value as '2d' | '3d'
                  }))}
                >
                  <option value="2d">2D图谱</option>
                  <option value="3d">3D图谱</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">图谱名称</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  placeholder="输入图谱名称"
                  value={graphConfig.name}
                  onChange={(e) => setGraphConfig(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">保存位置</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="saveLocation"
                      value="cloud"
                      checked={graphConfig.saveLocation === 'cloud'}
                      onChange={(e) => setGraphConfig(prev => ({
                        ...prev,
                        saveLocation: e.target.value as 'cloud' | 'local'
                      }))}
                      className="mr-2"
                    />
                    云端保存
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="saveLocation"
                      value="local"
                      checked={graphConfig.saveLocation === 'local'}
                      onChange={(e) => setGraphConfig(prev => ({
                        ...prev,
                        saveLocation: e.target.value as 'cloud' | 'local'
                      }))}
                      className="mr-2"
                    />
                    本地保存
                  </label>
                </div>
              </div>
              
              {graphConfig.saveLocation === 'local' && (
                <div>
                  <label className="block text-sm font-medium mb-2">保存目录</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                    placeholder="选择保存目录"
                    value={graphConfig.localPath}
                    onChange={(e) => setGraphConfig(prev => ({
                      ...prev,
                      localPath: e.target.value
                    }))}
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleGenerateGraph}
                className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                生成图谱
              </button>
              <button
                onClick={() => setShowGraphConfig(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 数字分身配置弹窗 */}
      {showTwinConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">创建数字分身</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">选择图谱</label>
                <select
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  value={twinConfig.selectedGraph}
                  onChange={(e) => setTwinConfig(prev => ({
                    ...prev,
                    selectedGraph: e.target.value
                  }))}
                >
                  <option value="">选择已保存的图谱</option>
                  {savedGraphs.map(graph => (
                    <option key={graph.id} value={graph.id}>
                      {graph.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">气质类型</label>
                <select
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  value={twinConfig.temperamentType}
                  onChange={(e) => setTwinConfig(prev => ({
                    ...prev,
                    temperamentType: e.target.value
                  }))}
                >
                  <option value="">选择气质类型</option>
                  <option value="分析型">分析型</option>
                  <option value="创造型">创造型</option>
                  <option value="实用型">实用型</option>
                  <option value="社交型">社交型</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Agent选择</label>
                <div className="space-y-2">
                  {['智能决策', '资产配置', '知识挖掘', '创意生成'].map(agent => (
                    <label key={agent} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={twinConfig.selectedAgents.includes(agent)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTwinConfig(prev => ({
                              ...prev,
                              selectedAgents: [...prev.selectedAgents, agent]
                            }));
                          } else {
                            setTwinConfig(prev => ({
                              ...prev,
                              selectedAgents: prev.selectedAgents.filter(a => a !== agent)
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      {agent}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">分身名称</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  placeholder="输入分身名称"
                  value={twinConfig.name}
                  onChange={(e) => setTwinConfig(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">描述</label>
                <textarea
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  placeholder="描述分身功能"
                  value={twinConfig.description}
                  onChange={(e) => setTwinConfig(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">大模型语言</label>
                <select
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
                  value={twinConfig.llmModel}
                  onChange={(e) => setTwinConfig(prev => ({
                    ...prev,
                    llmModel: e.target.value
                  }))}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3">Claude-3</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateTwin}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                创建分身
              </button>
              <button
                onClick={() => setShowTwinConfig(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 隐私设置弹窗 */}
      {showPrivacySettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">隐私设置</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>数据加密</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <span>匿名模式</span>
                <input type="checkbox" className="toggle" />
              </div>
              
              <div className="flex items-center justify-between">
                <span>分享权限</span>
                <select className="p-1 bg-gray-800 border border-gray-600 rounded">
                  <option>仅自己</option>
                  <option>朋友</option>
                  <option>公开</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPrivacySettings(false)}
                className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                保存设置
              </button>
              <button
                onClick={() => setShowPrivacySettings(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部版本展示区域 */}
      <div className="border-t border-gray-700 bg-black/20 mt-8">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-6 text-center">灵境回廊版本对比</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* V2版本预览 */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-purple-300">灵境回廊 V2</h3>
                <p className="text-sm text-gray-400">36军官数字分身体系</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">36军官分身系统</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">量子意识理论</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">论文价值评估</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">人机协作模式</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView('v2')}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  切换到 V2
                </button>
              </div>
            </div>

            {/* V3版本预览 */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-blue-300">灵境回廊 V3</h3>
                <p className="text-sm text-gray-400">奇点交易所与知识商业化</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">知识图谱评估</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">奇点交易所</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">数字分身创建</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">商业价值计算</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView('v3')}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  切换到 V3
                </button>
              </div>
            </div>

            {/* V4版本预览 */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden ring-2 ring-purple-500">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-pink-300">灵境回廊 V4</h3>
                <p className="text-sm text-gray-400">3D知识图谱与智能分身</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm">3D智核知识图谱</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">智能图谱生成</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-sm">定制化数字分身</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm">多版本融合</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView('v4')}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  当前版本 V4
                </button>
              </div>
            </div>
          </div>

          {/* 版本特性对比表 */}
          <div className="mt-8 bg-gray-900/30 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium">版本特性对比</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left">特性</th>
                    <th className="px-4 py-3 text-center">V2</th>
                    <th className="px-4 py-3 text-center">V3</th>
                    <th className="px-4 py-3 text-center">V4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr>
                    <td className="px-4 py-3">知识图谱</td>
                    <td className="px-4 py-3 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-purple-400">3D</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">数字分身</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-purple-400">36军官</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-cyan-400">定制化</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">商业化</td>
                    <td className="px-4 py-3 text-center">
                      <XMarkIcon className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-green-400">交易所</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">图谱生成工具</td>
                    <td className="px-4 py-3 text-center">
                      <XMarkIcon className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <XMarkIcon className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-pink-400">时间范围</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">隐私设置</td>
                    <td className="px-4 py-3 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-emerald-400">增强</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 