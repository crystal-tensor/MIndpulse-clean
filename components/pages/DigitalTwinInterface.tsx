'use client';

import { useState, useEffect } from 'react';
import {
  UserIcon,
  SparklesIcon,
  CogIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  BeakerIcon,
  CpuChipIcon,
  BoltIcon,
  HeartIcon,
  LightBulbIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  FireIcon,
  ShieldCheckIcon,
  StarIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  extractedTime: Date;
  confidence: number;
}

interface DigitalTwin {
  id: string;
  name: string;
  description: string;
  avatar: string;
  baseKnowledgeNodes: string[];
  timeRange: { start: Date; end: Date; };
  personality: {
    traits: string[];
    temperament: string;
    communicationStyle: string;
  };
  capabilities: {
    reasoning: number;
    creativity: number;
    empathy: number;
    expertise: string[];
  };
  tools: {
    mcpTools: string[];
    llmModel: string;
    agents: string[];
  };
  isActive: boolean;
  lastUpdated: Date;
  createdAt: Date;
}

interface DigitalTwinInterfaceProps {
  twin: DigitalTwin;
  knowledgeNodes: KnowledgeNode[];
  onUpdate: (updatedTwin: DigitalTwin) => void;
  onClose: () => void;
}

export default function DigitalTwinInterface({ twin, knowledgeNodes, onUpdate, onClose }: DigitalTwinInterfaceProps) {
  const [editedTwin, setEditedTwin] = useState<DigitalTwin>(twin);
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'personality' | 'capabilities' | 'tools' | 'chat'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: 'user' | 'twin', content: string, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');

  // 可用的MCP工具
  const availableMcpTools = [
    'filesystem', 'web-search', 'calculator', 'code-interpreter', 
    'image-generator', 'pdf-reader', 'email-client', 'calendar',
    'database-query', 'api-client', 'text-translator', 'voice-synthesis'
  ];

  // 可用的智能体
  const availableAgents = [
    'research-assistant', 'code-reviewer', 'content-writer', 'data-analyst',
    'project-manager', 'creative-director', 'technical-advisor', 'business-consultant'
  ];

  // 性格特质选项
  const personalityTraits = [
    '理性', '感性', '创新', '务实', '乐观', '谨慎', '外向', '内向',
    '合作', '独立', '细致', '宏观', '稳定', '灵活', '传统', '前卫'
  ];

  // 专业领域选项
  const expertiseAreas = [
    '人工智能', '机器学习', '数据科学', '软件开发', '产品设计', '项目管理',
    '商业分析', '市场营销', '用户体验', '系统架构', '网络安全', '区块链',
    '量子计算', '生物技术', '金融科技', '教育科技', '医疗健康', '可持续发展'
  ];

  // 根据时间范围筛选知识节点
  const getFilteredKnowledgeNodes = () => {
    return knowledgeNodes.filter(node => 
      node.extractedTime >= editedTwin.timeRange.start && 
      node.extractedTime <= editedTwin.timeRange.end
    );
  };

  // 保存更改
  const handleSave = () => {
    onUpdate(editedTwin);
    setIsEditing(false);
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user' as const,
      content: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // 模拟数字分身回复
    setTimeout(() => {
      const twinMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'twin' as const,
        content: `基于我的知识图谱和配置，我理解您的问题。作为${editedTwin.personality.temperament}的数字分身，我会用${editedTwin.personality.communicationStyle}的方式来回应...`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, twinMessage]);
    }, 1000);
    
    setNewMessage('');
  };

  // 激活/休眠数字分身
  const toggleTwinStatus = () => {
    setEditedTwin(prev => ({
      ...prev,
      isActive: !prev.isActive,
      lastUpdated: new Date()
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{editedTwin.avatar}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{editedTwin.name}</h2>
              <p className="text-white/70">{editedTwin.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTwinStatus}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  editedTwin.isActive 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-white'
                }`}
              >
                {editedTwin.isActive ? (
                  <>
                    <PlayIcon className="w-4 h-4 mr-1" />
                    活跃
                  </>
                ) : (
                  <>
                    <PauseIcon className="w-4 h-4 mr-1" />
                    休眠
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <CheckIcon className="w-5 h-5 mr-2" />
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditedTwin(twin);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  取消
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <CogIcon className="w-5 h-5 mr-2" />
                编辑
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 标签栏 */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: '概览', icon: EyeIcon },
            { id: 'knowledge', label: '知识图谱', icon: AcademicCapIcon },
            { id: 'personality', label: '性格特征', icon: HeartIcon },
            { id: 'capabilities', label: '能力配置', icon: BoltIcon },
            { id: 'tools', label: '工具配置', icon: WrenchScrewdriverIcon },
            { id: 'chat', label: '对话交互', icon: ChatBubbleLeftRightIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 概览标签 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 基本信息 */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    基本信息
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">创建时间</span>
                      <span className="text-white">{editedTwin.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">最后更新</span>
                      <span className="text-white">{editedTwin.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">状态</span>
                      <span className={editedTwin.isActive ? 'text-green-400' : 'text-gray-400'}>
                        {editedTwin.isActive ? '活跃' : '休眠'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 知识基础 */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-2" />
                    知识基础
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">知识节点</span>
                      <span className="text-blue-400">{editedTwin.baseKnowledgeNodes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">时间范围</span>
                      <span className="text-white text-xs">
                        {editedTwin.timeRange.start.toLocaleDateString()} - {editedTwin.timeRange.end.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">可用节点</span>
                      <span className="text-green-400">{getFilteredKnowledgeNodes().length}</span>
                    </div>
                  </div>
                </div>

                {/* 能力指标 */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <BoltIcon className="w-5 h-5 mr-2" />
                    能力指标
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(editedTwin.capabilities).filter(([key]) => key !== 'expertise').map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">
                            {key === 'reasoning' ? '推理' : key === 'creativity' ? '创造' : '共情'}
                          </span>
                          <span className="text-white">{value}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              key === 'reasoning' ? 'bg-blue-400' :
                              key === 'creativity' ? 'bg-purple-400' : 'bg-green-400'
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 配置工具概览 */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3 flex items-center">
                  <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
                  工具配置
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-white/70 text-sm mb-2">大语言模型</div>
                    <div className="bg-white/20 rounded px-3 py-2 text-white text-sm">
                      {editedTwin.tools.llmModel}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-2">MCP工具 ({editedTwin.tools.mcpTools.length})</div>
                    <div className="bg-white/20 rounded px-3 py-2 text-white text-sm">
                      {editedTwin.tools.mcpTools.length > 0 
                        ? editedTwin.tools.mcpTools.slice(0, 2).join(', ') + (editedTwin.tools.mcpTools.length > 2 ? '...' : '')
                        : '未配置'
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-2">智能体 ({editedTwin.tools.agents.length})</div>
                    <div className="bg-white/20 rounded px-3 py-2 text-white text-sm">
                      {editedTwin.tools.agents.length > 0 
                        ? editedTwin.tools.agents.slice(0, 2).join(', ') + (editedTwin.tools.agents.length > 2 ? '...' : '')
                        : '未配置'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 知识图谱标签 */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              {/* 时间范围选择 */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  时间范围选择
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">开始时间</label>
                    <input
                      type="date"
                      value={editedTwin.timeRange.start.toISOString().split('T')[0]}
                      onChange={(e) => setEditedTwin(prev => ({
                        ...prev,
                        timeRange: { ...prev.timeRange, start: new Date(e.target.value) }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">结束时间</label>
                    <input
                      type="date"
                      value={editedTwin.timeRange.end.toISOString().split('T')[0]}
                      onChange={(e) => setEditedTwin(prev => ({
                        ...prev,
                        timeRange: { ...prev.timeRange, end: new Date(e.target.value) }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* 可用知识节点 */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">可用知识节点 ({getFilteredKnowledgeNodes().length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getFilteredKnowledgeNodes().map(node => (
                    <div
                      key={node.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        editedTwin.baseKnowledgeNodes.includes(node.id)
                          ? 'bg-indigo-600/30 border border-indigo-400'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => {
                        if (!isEditing) return;
                        setEditedTwin(prev => ({
                          ...prev,
                          baseKnowledgeNodes: prev.baseKnowledgeNodes.includes(node.id)
                            ? prev.baseKnowledgeNodes.filter(id => id !== node.id)
                            : [...prev.baseKnowledgeNodes, node.id]
                        }));
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{node.name}</div>
                          <div className="text-white/60 text-sm">{node.category}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-white/60">{node.extractedTime.toLocaleDateString()}</div>
                          <div className="text-green-400">{(node.confidence * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 其他标签内容... */}
          {activeTab === 'personality' && (
            <div className="space-y-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">性格配置</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">气质类型</label>
                    <select
                      value={editedTwin.personality.temperament}
                      onChange={(e) => setEditedTwin(prev => ({
                        ...prev,
                        personality: { ...prev.personality, temperament: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50"
                    >
                      <option value="理性分析型">理性分析型</option>
                      <option value="创意想象型">创意想象型</option>
                      <option value="温和共情型">温和共情型</option>
                      <option value="积极行动型">积极行动型</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">沟通风格</label>
                    <input
                      type="text"
                      value={editedTwin.personality.communicationStyle}
                      onChange={(e) => setEditedTwin(prev => ({
                        ...prev,
                        personality: { ...prev.personality, communicationStyle: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50"
                      placeholder="描述沟通风格"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">性格特质</label>
                    <div className="grid grid-cols-4 gap-2">
                      {personalityTraits.map(trait => (
                        <button
                          key={trait}
                          onClick={() => {
                            if (!isEditing) return;
                            setEditedTwin(prev => ({
                              ...prev,
                              personality: {
                                ...prev.personality,
                                traits: prev.personality.traits.includes(trait)
                                  ? prev.personality.traits.filter(t => t !== trait)
                                  : [...prev.personality.traits, trait]
                              }
                            }));
                          }}
                          disabled={!isEditing}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                            editedTwin.personality.traits.includes(trait)
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {trait}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 对话交互标签 */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white/5 rounded-lg p-4 mb-4 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-white/50 py-8">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-white/30" />
                    <p>开始与您的数字分身对话</p>
                    <p className="text-sm mt-2">基于配置的知识图谱和个性进行交互</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/10 text-white'
                        }`}>
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="输入消息..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  发送
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 