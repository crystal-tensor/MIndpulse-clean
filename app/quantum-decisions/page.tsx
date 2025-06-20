"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentCheckIcon,  
  BeakerIcon,
  LightBulbIcon,
  ClockIcon,
  Cog6ToothIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface DecisionVariable {
  id: string;
  type: "目标" | "约束" | "资源";
  name: string;
  value: string;
  confidence: number;
  weight: number;
  editable: boolean;
}

interface QuantumProgress {
  qubits: number;
  shots: number;
  currentIteration: number;
  totalIterations: number;
  energy: number[];
  status: "idle" | "running" | "completed" | "error";
  backend: string;
  eta: string;
}

interface DecisionSolution {
  id: string;
  probability: number;
  strategy: string;
  metrics: { [key: string]: number };
  actions: {
    immediate: string[];
    monitor: string[];
    fallback: string[];
  };
  quantumMetrics?: {
    eigenvalue: number;
    convergenceIterations: number;
    quantumVolume: number;
    paretoFront: { risk: number; reward: number; feasibility: number }[];
    paretoFrontChart?: {
      data: Array<{
        x: number;
        y: number;
        z: number;
        name: string;
        color: number;
        isOptimal?: boolean;
      }>;
      layout: {
        title: string;
        xaxis: string;
        yaxis: string;
        zaxis: string;
      };
    }; // 三维图表数据结构
  };
  aiInsight?: {
    title: string;
    content: string;
    risks: string;
    probability: string;
  };
}

type ActiveTab = "dialogue" | "summary" | "quantum" | "solutions" | "history" | "settings";

interface ChatMessage {
  id: string;
  role: "user" | "system" | "assistant";
  content: string;
  timestamp: Date;
  phaseSummary?: {
    title: string;
    items: string[];
  };
  showConfirmButtons?: boolean;
}

export default function QuantumDecisions() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dialogue");
  const [currentPhase, setCurrentPhase] = useState(1); // 1: 目标, 2: 资源, 3: 约束, 4: 摘要
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<ChatMessage>>([
    {
      id: "welcome",
      role: "system",
      content: "欢迎来到命运织机！我是您的量子决策助理。请先描述您想要达成的目标，可以是一个或多个目标。",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState("");
  const [variables, setVariables] = useState<DecisionVariable[]>([]);
  const [hasStartedExtraction, setHasStartedExtraction] = useState(false);
  const [variablesHash, setVariablesHash] = useState<string>(""); // 用于检测变量变化

  const [quantumProgress, setQuantumProgress] = useState<QuantumProgress>({
    qubits: 8,
    shots: 1024,
    currentIteration: 0,
    totalIterations: 100,
    energy: [],
    status: "idle",
    backend: "IBM Quantum Simulator",
    eta: "3分钟"
  });

  const [solutions, setSolutions] = useState<DecisionSolution[]>([]);

  const [completionProgress, setCompletionProgress] = useState(0);
  
  // LLM设置状态
  const [llmSettings, setLlmSettings] = useState({
    provider: 'deepseek',
    model: 'deepseek-chat',
    apiKey: '',
    temperature: 0.7,
    baseUrl: ''
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string} | null>(null);
  
  // 系统设置状态
  const [systemSettings, setSystemSettings] = useState({
    riskPreference: 0.5,
    quantumBackend: 'IBM Quantum Simulator',
    language: 'zh',
    emailNotification: true,
    autoSave: true,
    theme: 'dark'
  });

  // 聊天消息容器引用，用于自动滚动
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // 自动滚动到聊天底部
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 检测变量权重变化
  useEffect(() => {
    const currentHash = JSON.stringify(variables.map(v => ({ id: v.id, weight: v.weight })));
    if (variablesHash && variablesHash !== currentHash && quantumProgress.status === "completed") {
      // 变量权重发生变化，重置量子计算状态
      setQuantumProgress(prev => ({ ...prev, status: "idle", currentIteration: 0, energy: [] }));
      setSolutions([]); // 清除旧的解决方案
    }
    setVariablesHash(currentHash);
  }, [variables, variablesHash, quantumProgress.status]);

  // 量子运行状态模拟
  useEffect(() => {
    if (quantumProgress.status === "running") {
      const interval = setInterval(() => {
        setQuantumProgress(prev => {
          if (prev.currentIteration >= prev.totalIterations) {
            return { ...prev, status: "completed" };
          }
          
          const newEnergy = [...prev.energy, Math.random() * 0.5 + Math.sin(prev.currentIteration * 0.1) * 0.2];
          return {
            ...prev,
            currentIteration: prev.currentIteration + 1,
            energy: newEnergy.slice(-50) // 只保留最近50个点
          };
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [quantumProgress.status]);

  // 动态计算完成度
  useEffect(() => {
    const goalCount = variables.filter(v => v.type === "目标").length;
    const resourceCount = variables.filter(v => v.type === "资源").length;
    const constraintCount = variables.filter(v => v.type === "约束").length;
    
    const totalExpected = Math.max(1, goalCount + resourceCount + constraintCount);
    const phaseProgress = currentPhase === 4 ? 100 : Math.min(95, (totalExpected / 6) * 100);
    
    setCompletionProgress(phaseProgress);
  }, [variables, currentPhase]);

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    setIsExtracting(true);

    try {
      // 清除默认变量，开始真正的提取
      if (!hasStartedExtraction) {
        setVariables([]);
        setHasStartedExtraction(true);
      }

      const response = await fetch('/api/mindpilot/extract-variables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          phase: currentPhase,
          sessionId: `session_${Date.now()}`,
          llmSettings
        }),
      });

      const data = await response.json();
      
            if (response.ok) {
        // 更新变量
        let newVariables: DecisionVariable[] = [];
        if (data.extracted) {
          // 添加目标
          data.extracted.goals?.forEach((goal: string, index: number) => {
            newVariables.push({
              id: `goal_${Date.now()}_${index}`,
              type: "目标",
              name: goal,
              value: `实现${goal}`,
              confidence: 0.8 + Math.random() * 0.15,
              weight: 0.7 + Math.random() * 0.2,
              editable: true
            });
          });
          
          // 添加资源
          data.extracted.resources?.forEach((resource: string, index: number) => {
            newVariables.push({
              id: `resource_${Date.now()}_${index}`,
              type: "资源",
              name: resource,
              value: `利用${resource}`,
              confidence: 0.75 + Math.random() * 0.2,
              weight: 0.6 + Math.random() * 0.3,
              editable: true
            });
          });
          
          // 添加约束
          data.extracted.constraints?.forEach((constraint: string, index: number) => {
            newVariables.push({
              id: `constraint_${Date.now()}_${index}`,
              type: "约束",
              name: constraint,
              value: `遵守${constraint}`,
              confidence: 0.85 + Math.random() * 0.1,
              weight: 0.5 + Math.random() * 0.4,
              editable: true
            });
          });
          
          setVariables(prev => {
            // 合并新变量，避免重复
            const existingNames = prev.map(v => v.name);
            const uniqueNewVars = newVariables.filter(v => !existingNames.includes(v.name));
            return [...prev, ...uniqueNewVars];
          });
        }
        
        // 添加AI回应
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.aiResponse || "我已经分析了您的输入并提取了相关信息。",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
        
        // 检查是否应该显示阶段总结和确认按钮
        if (data.shouldShowSummary && currentPhase <= 4) {
          setTimeout(() => {
            // 获取当前阶段的变量
            const currentPhaseVariables = variables.filter(v => {
              if (currentPhase === 1) return v.type === "目标";
              if (currentPhase === 2) return v.type === "资源";
              if (currentPhase === 3) return v.type === "约束";
              return false;
            });
            
            // 获取新提取的变量
            const newPhaseVariables = newVariables.filter((v: DecisionVariable) => {
              if (currentPhase === 1) return v.type === "目标";
              if (currentPhase === 2) return v.type === "资源";
              if (currentPhase === 3) return v.type === "约束";
              return false;
            });
            
            // 合并所有当前阶段的变量
            const allPhaseVariables = [...currentPhaseVariables.map(v => v.name), ...newPhaseVariables.map(v => v.name)];
            
            // 添加阶段总结消息
            const summaryMessage: ChatMessage = {
              id: Date.now().toString(),
              role: "system",
              content: "",
              timestamp: new Date(),
              phaseSummary: {
                title: `我已收集到以下${getPhaseTitle(currentPhase).replace('收集', '').replace('盘点', '').replace('识别', '')}：`,
                items: allPhaseVariables
              }
            };
            setChatMessages(prev => [...prev, summaryMessage]);
            
            // 添加确认按钮消息
            const confirmMessage: ChatMessage = {
              id: `confirm_${Date.now()}`,
              role: "system",
              content: currentPhase < 4 ? 
                "这个阶段的信息是否完整？可以进入下一步了吗？" : 
                "以上信息确认无误，可以开始量子计算了吗？",
              timestamp: new Date(),
              showConfirmButtons: true
            };
            setChatMessages(prev => [...prev, confirmMessage]);
          }, 1000);
        }
        
      } else {
        throw new Error(data.error || '提取失败');
      }
    } catch (error) {
      console.error('提取变量错误:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content: "抱歉，处理您的消息时出现了错误。请重试。",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsExtracting(false);
    }
  };

  const startQuantumRun = async () => {
    if (variables.length === 0) {
      alert("请先完成变量提取");
      return;
    }

    setQuantumProgress(prev => ({ 
      ...prev, 
      status: "running", 
      currentIteration: 0,
      energy: [] // 重置能量数据
    }));
    
    try {
      // 调用真正的量子计算API
      const response = await fetch('/api/mindpilot/quantum-solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables,
          sessionId: `session_${Date.now()}`,
          problemTitle: "量子决策分析",
          systemSettings,
          llmSettings
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // 更新解决方案
        setSolutions(data.solutions);
        console.log('量子计算完成:', data);
      } else {
        throw new Error(data.error || '量子计算失败');
      }
    } catch (error) {
      console.error('量子计算错误:', error);
      setQuantumProgress(prev => ({ ...prev, status: "error" }));
      alert("量子计算出现错误，请检查网络连接或重试");
    }
  };

  const getVariableIcon = (type: DecisionVariable["type"]) => {
    switch (type) {
      case "目标": return "🎯";
      case "约束": return "🛑";
      case "资源": return "🧰";
    }
  };

  const getStatusColor = (status: QuantumProgress["status"]) => {
    switch (status) {
      case "idle": return "bg-gray-500";
      case "running": return "bg-orange-500 animate-pulse";
      case "completed": return "bg-green-500";
      case "error": return "bg-red-500";
    }
  };

  // 辅助函数
  const getPhaseTitle = (phase: number) => {
    switch (phase) {
      case 1: return "目标收集";
      case 2: return "资源盘点";
      case 3: return "约束识别";
      case 4: return "摘要确认";
      default: return "决策对话";
    }
  };

  const getPhasePrompt = (phase: number) => {
    switch (phase) {
      case 1: return "请详细描述您想要达成的目标，可以包含多个目标。例如：职业晋升、收入提升、技能发展等。";
      case 2: return "请告诉我您可以支配的资源有哪些？包括：教育背景、工作经验、人脉关系、资金状况、时间安排等。";
      case 3: return "有哪些限制条件或必须满足的要求？比如：地理位置、时间限制、预算约束、家庭因素等。";
      case 4: return "请确认以上信息是否完整准确，我们将基于这些信息进行量子决策分析。";
      default: return "请按照提示逐步完善您的决策信息。";
    }
  };

  const getInputPlaceholder = (phase: number) => {
    switch (phase) {
      case 1: return "描述您的目标...";
      case 2: return "列出您的资源...";
      case 3: return "说明约束条件...";
      default: return "继续对话...";
    }
  };

  const handlePhaseConfirm = (confirmed: boolean) => {
    if (confirmed) {
      if (currentPhase < 4) {
        setCurrentPhase(prev => prev + 1);
        // 添加阶段转换消息
        const transitionMessages = {
          1: "很好！现在让我们来盘点一下您可用的资源。",
          2: "了解了您的资源情况。接下来请告诉我有哪些约束条件。",
          3: "信息收集完成！让我为您整理并确认所有决策要素。"
        };
        
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "system",
          content: transitionMessages[currentPhase as keyof typeof transitionMessages] || "",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, newMessage]);
        
        if (currentPhase === 3) {
          setActiveTab("summary");
        }
      } else if (currentPhase === 4) {
        // 从摘要确认进入量子计算，标记第四步完成
        setCurrentPhase(5); // 设置为5表示第四步已完成
        setActiveTab("quantum");
      }
    } else {
      // 用户需要补充信息，继续当前阶段
      const supplementMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content: "请继续补充相关信息，确保我们获得完整的决策要素。",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, supplementMessage]);
    }
  };

  // LLM设置相关函数
  const getModelOptions = (provider: string) => {
    const modelMap = {
      'deepseek': [
        { value: 'deepseek-chat', label: 'DeepSeek Chat' },
        { value: 'deepseek-coder', label: 'DeepSeek Coder' }
      ],
      'openai': [
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-4o-mini', label: 'GPT-4O Mini' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
      ],
      'claude': [
        { value: 'claude-3-opus', label: 'Claude 3 Opus' },
        { value: 'claude-3-haiku', label: 'Claude 3 Haiku' }
      ],
      'gemini': [
        { value: 'gemini-pro', label: 'Gemini Pro' }
      ],
      'tongyi': [
        { value: 'qwen-max', label: '通义千问 Max' },
        { value: 'qwen-plus', label: '通义千问 Plus' }
      ]
    };
    return modelMap[provider as keyof typeof modelMap] || [];
  };

  const testConnection = async () => {
    if (!llmSettings.apiKey) {
      setConnectionStatus({ success: false, message: '请先输入API密钥' });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus(null);

    try {
      const response = await fetch('/api/mindpilot/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: llmSettings.provider,
          model: llmSettings.model,
          apiKey: llmSettings.apiKey,
          baseUrl: llmSettings.baseUrl
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setConnectionStatus({ success: true, message: '连接测试成功！' });
      } else {
        setConnectionStatus({ success: false, message: data.error || '连接测试失败' });
      }
    } catch (error) {
      setConnectionStatus({ success: false, message: '网络错误，请检查网络连接' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveLlmSettings = () => {
    // 保存到localStorage
    localStorage.setItem('mindpulse-llm-settings', JSON.stringify(llmSettings));
    setConnectionStatus({ success: true, message: '设置已保存！' });
    
    // 3秒后清除状态消息
    setTimeout(() => {
      setConnectionStatus(null);
    }, 3000);
  };

  const saveSystemSettings = () => {
    // 保存系统设置到localStorage
    localStorage.setItem('mindpulse-system-settings', JSON.stringify(systemSettings));
    setConnectionStatus({ success: true, message: '系统设置已保存！' });
    
    // 3秒后清除状态消息
    setTimeout(() => {
      setConnectionStatus(null);
    }, 3000);
  };

  const resetSettings = () => {
    if (confirm('确定要重置所有设置吗？此操作无法撤销。')) {
      // 重置LLM设置
      setLlmSettings({
        provider: 'deepseek',
        model: 'deepseek-chat',
        apiKey: '',
        temperature: 0.7,
        baseUrl: ''
      });
      
      // 重置系统设置
      setSystemSettings({
        riskPreference: 0.5,
        quantumBackend: 'IBM Quantum Simulator',
        language: 'zh',
        emailNotification: true,
        autoSave: true,
        theme: 'dark'
      });
      
      // 清除localStorage
      localStorage.removeItem('mindpulse-llm-settings');
      localStorage.removeItem('mindpulse-system-settings');
      
      setConnectionStatus({ success: true, message: '设置已重置！' });
      setTimeout(() => {
        setConnectionStatus(null);
      }, 3000);
    }
  };

  // 加载保存的设置
  useEffect(() => {
    // 加载LLM设置
    const savedLlmSettings = localStorage.getItem('mindpulse-llm-settings');
    if (savedLlmSettings) {
      try {
        const parsed = JSON.parse(savedLlmSettings);
        setLlmSettings(parsed);
      } catch (error) {
        console.error('加载LLM设置失败:', error);
      }
    }
    
    // 加载系统设置
    const savedSystemSettings = localStorage.getItem('mindpulse-system-settings');
    if (savedSystemSettings) {
      try {
        const parsed = JSON.parse(savedSystemSettings);
        setSystemSettings(parsed);
      } catch (error) {
        console.error('加载系统设置失败:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen consciousness-bg text-white">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  命运织机
                </h1>
                <p className="text-xs text-gray-400">Weave Your Fate with Quantum Insight</p>
              </div>
            </div>

            {/* 导航按钮 */}
            <nav className="flex items-center space-x-1">
              {[
                { id: "dialogue", label: "决策对话", icon: ChatBubbleBottomCenterTextIcon, enabled: true },
                { id: "summary", label: "摘要确认", icon: ClipboardDocumentCheckIcon, enabled: completionProgress >= 75 },
                { id: "quantum", label: "魔镜运行", icon: BeakerIcon, enabled: activeTab === "summary" || quantumProgress.status !== "idle" },
                { id: "solutions", label: "建议行动", icon: LightBulbIcon, enabled: quantumProgress.status === "completed" },
                { id: "history", label: "历史", icon: ClockIcon, enabled: true },
                { id: "settings", label: "设置", icon: Cog6ToothIcon, enabled: true },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => tab.enabled && setActiveTab(tab.id as ActiveTab)}
                  className={clsx(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30"
                      : tab.enabled
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-600 cursor-not-allowed",
                    quantumProgress.status === "completed" && tab.id === "solutions" && "animate-pulse border-green-500/50"
                  )}
                  disabled={!tab.enabled}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === "solutions" && quantumProgress.status === "completed" && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                      新
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 决策对话页 */}
        {activeTab === "dialogue" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 聊天窗口 */}
            <div className="lg:col-span-2 space-y-4">
              {/* 流程指示条 */}
              <div className="glassmorphism rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    {[
                      { id: "goals", label: "目标", icon: "🎯", phase: 1 },
                      { id: "resources", label: "资源", icon: "🧰", phase: 2 },
                      { id: "constraints", label: "约束", icon: "🛑", phase: 3 },
                      { id: "summary", label: "摘要确认", icon: "📋", phase: 4 }
                    ].map((step) => (
                      <div key={step.id} className="flex items-center space-x-2">
                        <div
                          className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                            currentPhase === step.phase && activeTab === "dialogue"
                              ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white animate-pulse"
                              : currentPhase > step.phase || (step.phase === 4 && currentPhase >= 5)
                              ? "bg-green-500 text-white"
                              : "bg-gray-600 text-gray-300"
                          )}
                        >
                          {(currentPhase > step.phase || (step.phase === 4 && currentPhase >= 5)) ? "✓" : step.phase}
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{step.icon} {step.label}</div>
                                                      <div className={clsx(
                              "text-xs",
                              currentPhase === step.phase && activeTab === "dialogue" ? "text-cyan-400" : "text-gray-400"
                            )}>
                              {currentPhase === step.phase && activeTab === "dialogue" ? "进行中" : 
                               currentPhase > step.phase || (step.phase === 4 && currentPhase >= 5) ? "已完成" : "等待中"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glassmorphism rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-cyan-400">
                    阶段 {currentPhase}: {getPhaseTitle(currentPhase)}
                  </h2>
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">选择模板</option>
                    <option value="career">职业发展</option>
                    <option value="investment">投资理财</option>
                    <option value="health">健康管理</option>
                    <option value="relationship">关系决策</option>
                    <option value="education">教育选择</option>
                  </select>
                </div>

                {/* 阶段提示卡片 */}
                <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-gray-300">
                    {getPhasePrompt(currentPhase)}
                  </p>
                </div>
                
                {/* 消息列表 */}
                <div ref={chatMessagesRef} className="h-96 overflow-y-auto custom-scrollbar space-y-4 mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id}>
                      <div
                        className={clsx(
                          "flex",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={clsx(
                            "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl",
                            message.role === "user"
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                              : message.role === "system"
                              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                              : "bg-gray-700/50 border border-gray-600"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* 阶段总结卡片 */}
                      {message.phaseSummary && (
                        <div className="mt-3 mx-4">
                          <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-4">
                            <h4 className="font-medium text-green-400 mb-2">
                              👉 {message.phaseSummary.title}
                            </h4>
                            <ul className="space-y-1 text-sm text-gray-300">
                              {message.phaseSummary.items.map((item, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {/* 确认按钮 */}
                      {message.showConfirmButtons && (
                        <div className="mt-3 mx-4">
                          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-4">
                            <p className="text-sm text-gray-300 mb-3">{message.content}</p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePhaseConfirm(true)}
                                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-sm text-green-400 transition-colors"
                              >
                                {currentPhase < 4 ? "确认继续" : "开始量子计算"}
                              </button>
                              <button
                                onClick={() => handlePhaseConfirm(false)}
                                className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 rounded-lg text-sm text-gray-400 transition-colors"
                              >
                                需要补充
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* 加载指示器 */}
                  {isExtracting && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700/50 border border-gray-600 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                          <span className="text-sm text-gray-300">正在分析和提取变量...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 输入框 */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={getInputPlaceholder(currentPhase)}
                    className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    disabled={isExtracting}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isExtracting || !currentInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>

            {/* 变量板 */}
            <div className="space-y-4">
              <div className="glassmorphism rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-400">变量提取</h3>
                  <button className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
                    <span className="text-xl">+</span>
                  </button>
                </div>

                {variables.length === 0 && !hasStartedExtraction && (
                  <div className="text-center py-8 text-gray-400">
                    <p>开始对话后，系统将自动提取决策变量</p>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  {variables.map((variable) => (
                    <div
                      key={variable.id}
                      className={clsx(
                        "p-3 rounded-lg border transition-all duration-200",
                        variable.confidence >= 0.8
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-yellow-500/10 border-yellow-500/30"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <span className="text-lg">{getVariableIcon(variable.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50">
                                {variable.type}
                              </span>
                              <span className="text-sm font-medium">{variable.name}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{variable.value}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs">置信度:</span>
                              <div className="flex-1 bg-gray-700 rounded-full h-1">
                                <div
                                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1 rounded-full"
                                  style={{ width: `${variable.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-xs">{Math.round(variable.confidence * 100)}%</span>
                            </div>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-white">
                          ✎
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 完整度进度条 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>信息完整度</span>
                    <span>{Math.round(completionProgress)}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionProgress}%` }}
                    />
                  </div>
                  {completionProgress >= 75 && (
                    <p className="text-xs text-green-400 flex items-center space-x-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>信息收集完成，可以进入摘要确认</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 摘要确认页 */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">决策要素确认</h2>
              
              {/* 变量摘要表格 */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-2">类型</th>
                      <th className="text-left py-3 px-2">名称</th>
                      <th className="text-left py-3 px-2">当前值</th>
                      <th className="text-left py-3 px-2">权重</th>
                      <th className="text-left py-3 px-2">置信度</th>
                      <th className="text-left py-3 px-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variables.map((variable) => (
                      <tr key={variable.id} className="border-b border-gray-700/50">
                        <td className="py-3 px-2">
                          <span className="px-2 py-1 bg-gray-700/50 rounded text-xs">
                            {variable.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium">{variable.name}</td>
                        <td className="py-3 px-2 text-sm text-gray-300">{variable.value}</td>
                        <td className="py-3 px-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={variable.weight}
                            onChange={(e) => {
                              const newWeight = parseFloat(e.target.value);
                              setVariables(prev => prev.map(v => 
                                v.id === variable.id ? { ...v, weight: newWeight } : v
                              ));
                            }}
                            className="w-16"
                          />
                          <span className="ml-2 text-sm">{variable.weight.toFixed(1)}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={clsx(
                            "px-2 py-1 rounded text-xs",
                            variable.confidence >= 0.8 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                          )}>
                            {Math.round(variable.confidence * 100)}%
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                            编辑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 冲突检测 */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-400">潜在冲突检测</h4>
                    <p className="text-sm text-gray-300 mt-1">
                      目标"3年内晋升"与约束"工作地点限制"可能存在冲突，建议调整权重平衡或考虑远程工作可能性。
                    </p>
                  </div>
                </div>
              </div>

              {/* 量子参数映射预览 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-purple-400 mb-3">量子参数映射</h4>
                  <div className="space-y-2">
                    {variables.map((variable) => (
                      <div key={variable.id} className="flex justify-between items-center text-sm">
                        <span>{variable.name}</span>
                        <span className="text-cyan-400">{(variable.weight * variable.confidence).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-purple-400 mb-3">预估计算资源</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>量子比特数:</span>
                      <span className="text-cyan-400">{quantumProgress.qubits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>采样次数:</span>
                      <span className="text-cyan-400">{quantumProgress.shots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>预计用时:</span>
                      <span className="text-cyan-400">{quantumProgress.eta}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-between">
                <button
                  onClick={() => setActiveTab("dialogue")}
                  className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg font-medium transition-colors"
                >
                  返回对话
                </button>
                <button
                  onClick={() => {
                    setCurrentPhase(5); // 设置为5表示第4步已完成
                    setActiveTab("quantum");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <BeakerIcon className="w-5 h-5" />
                  <span>开始量子计算</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 魔镜运行页 */}
        {activeTab === "quantum" && (
          <div className="space-y-6">
            <div className="glassmorphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-400">量子魔镜</h2>
                <div className="flex items-center space-x-3">
                  <div className={clsx("w-3 h-3 rounded-full", getStatusColor(quantumProgress.status))} />
                  <span className="text-sm capitalize">{quantumProgress.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 进度面板 */}
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-medium text-cyan-400 mb-3">运行参数</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">量子比特:</span>
                        <span className="ml-2 text-white">{quantumProgress.qubits}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">采样数:</span>
                        <span className="ml-2 text-white">{quantumProgress.shots}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">迭代:</span>
                        <span className="ml-2 text-white">
                          {quantumProgress.currentIteration}/{quantumProgress.totalIterations}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">后端:</span>
                        <span className="ml-2 text-white text-xs">{quantumProgress.backend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-medium text-cyan-400 mb-3">进度</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>完成度</span>
                        <span>{Math.round((quantumProgress.currentIteration / quantumProgress.totalIterations) * 100)}%</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(quantumProgress.currentIteration / quantumProgress.totalIterations) * 100}%` }}
                        />
                      </div>
                      {quantumProgress.status === "running" && (
                        <p className="text-xs text-cyan-400">预计剩余时间: {quantumProgress.eta}</p>
                      )}
                    </div>
                  </div>

                  {/* 控制按钮 */}
                  <div className="flex space-x-3">
                    {quantumProgress.status === "idle" && (
                      <button
                        onClick={startQuantumRun}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <PlayIcon className="w-5 h-5" />
                        <span>开始运行</span>
                      </button>
                    )}
                    {quantumProgress.status === "running" && (
                      <button
                        onClick={() => setQuantumProgress(prev => ({ ...prev, status: "idle" }))}
                        className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <PauseIcon className="w-5 h-5" />
                        <span>暂停</span>
                      </button>
                    )}
                    {quantumProgress.status === "completed" && (
                      <div className="flex-1 flex space-x-2">
                        <button
                          onClick={startQuantumRun}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <ArrowPathIcon className="w-5 h-5" />
                          <span>重新计算</span>
                        </button>
                        <button
                          onClick={() => setActiveTab("solutions")}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          <span>查看结果</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 能量收敛图 */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-cyan-400 mb-3">能量收敛曲线</h3>
                  <div className="h-48 flex items-end justify-between space-x-1">
                    {Array.from({ length: 50 }, (_, i) => {
                      const hasData = i < quantumProgress.energy.length;
                      const height = hasData 
                        ? Math.max(5, (1 - Math.abs(quantumProgress.energy[i])) * 180)
                        : 5;
                      return (
                        <div
                          key={i}
                          className={clsx(
                            "w-1 bg-gradient-to-t transition-all duration-300",
                            hasData
                              ? "from-purple-500 to-cyan-400"
                              : "from-gray-600 to-gray-500"
                          )}
                          style={{ height: `${height}px` }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>起始</span>
                    <span>收敛目标</span>
                  </div>
                </div>
              </div>

              {/* 运行日志 */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-white">
                  运行日志 {quantumProgress.status === "running" && "(实时)"}
                </summary>
                <div className="mt-3 bg-gray-900/50 rounded-lg p-4 text-xs font-mono space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  <div>[{new Date().toLocaleTimeString()}] 初始化VQE参数...</div>
                  <div>[{new Date().toLocaleTimeString()}] 量子比特映射完成</div>
                  <div>[{new Date().toLocaleTimeString()}] 开始QAOA优化循环</div>
                  {quantumProgress.status === "running" && (
                    <div className="text-cyan-400">
                      [{new Date().toLocaleTimeString()}] 迭代 {quantumProgress.currentIteration}: Energy = {quantumProgress.energy[quantumProgress.energy.length - 1]?.toFixed(6) || "0.000000"}
                    </div>
                  )}
                  {quantumProgress.status === "completed" && (
                    <div className="text-green-400">
                      [{new Date().toLocaleTimeString()}] 优化完成，找到最优解
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
        )}

        {/* 建议与行动方案页 */}
        {activeTab === "solutions" && (
          <div className="space-y-6">
            <div className="glassmorphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-400">量子决策方案</h2>
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>计算完成</span>
                </div>
              </div>

              {solutions.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>正在生成AI洞察建议...</p>
                  <p className="text-sm mt-2">请稍等片刻，我们正在分析您的决策方案</p>
                </div>
              )}

              {solutions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 解决方案列表 */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* 量子计算结果概览 */}
                    {solutions[0]?.quantumMetrics && (
                      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-purple-400 mb-3">量子计算概览</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">基态能量:</span>
                            <div className="text-cyan-400 font-mono">{solutions[0].quantumMetrics.eigenvalue.toFixed(4)}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">收敛迭代:</span>
                            <div className="text-cyan-400">{solutions[0].quantumMetrics.convergenceIterations}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">量子体积:</span>
                            <div className="text-cyan-400">{solutions[0].quantumMetrics.quantumVolume}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">帕累托解数:</span>
                            <div className="text-cyan-400">{solutions[0].quantumMetrics.paretoFront.length}</div>
                          </div>
                        </div>
                        
                        {/* 帕累托前沿可视化 */}
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-300 mb-2">帕累托前沿分布</h5>
                          
                          {/* 三维分布图 */}
                          {solutions[0].quantumMetrics.paretoFrontChart && (
                            <div className="mb-4">
                              <div className="bg-gray-900/50 rounded-lg p-4">
                                <h6 className="text-sm font-medium text-cyan-400 mb-3">
                                  {solutions[0].quantumMetrics.paretoFrontChart.layout.title}
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* X-Y 平面投影 (风险-回报) */}
                                  <div className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 mb-2">风险-回报投影</div>
                                    <div className="relative h-24 bg-gray-700/30 rounded">
                                      <svg className="w-full h-full" viewBox="0 0 100 100">
                                        {solutions[0].quantumMetrics.paretoFrontChart.data.map((point, index) => (
                                          <circle
                                            key={index}
                                            cx={point.x * 80 + 10}
                                            cy={90 - point.y * 80}
                                            r={point.isOptimal ? "4" : "2"}
                                            fill={point.isOptimal ? "#fbbf24" : (point.color > 0 ? "#10b981" : "#ef4444")}
                                            opacity="0.8"
                                            stroke={point.isOptimal ? "#f59e0b" : "#ffffff"}
                                            strokeWidth={point.isOptimal ? "1" : "0.5"}
                                          />
                                        ))}
                                      </svg>
                                    </div>
                                  </div>
                                  
                                  {/* Y-Z 平面投影 (回报-策略) */}
                                  <div className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 mb-2">回报-策略投影</div>
                                    <div className="relative h-24 bg-gray-700/30 rounded">
                                      <svg className="w-full h-full" viewBox="0 0 100 100">
                                        {solutions[0].quantumMetrics.paretoFrontChart.data.map((point, index) => (
                                          <circle
                                            key={index}
                                            cx={point.y * 80 + 10}
                                            cy={90 - point.z * 80}
                                            r={point.isOptimal ? "4" : "2"}
                                            fill={point.isOptimal ? "#fbbf24" : (point.color > 0 ? "#10b981" : "#ef4444")}
                                            opacity="0.8"
                                            stroke={point.isOptimal ? "#f59e0b" : "#ffffff"}
                                            strokeWidth={point.isOptimal ? "1" : "0.5"}
                                          />
                                        ))}
                                      </svg>
                                    </div>
                                  </div>
                                  
                                  {/* X-Z 平面投影 (风险-策略) */}
                                  <div className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 mb-2">风险-策略投影</div>
                                    <div className="relative h-24 bg-gray-700/30 rounded">
                                      <svg className="w-full h-full" viewBox="0 0 100 100">
                                        {solutions[0].quantumMetrics.paretoFrontChart.data.map((point, index) => (
                                          <circle
                                            key={index}
                                            cx={point.x * 80 + 10}
                                            cy={90 - point.z * 80}
                                            r={point.isOptimal ? "4" : "2"}
                                            fill={point.isOptimal ? "#fbbf24" : (point.color > 0 ? "#10b981" : "#ef4444")}
                                            opacity="0.8"
                                            stroke={point.isOptimal ? "#f59e0b" : "#ffffff"}
                                            strokeWidth={point.isOptimal ? "1" : "0.5"}
                                          />
                                        ))}
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* 图例 */}
                                <div className="mt-3 flex justify-center items-center space-x-4 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-400">正净收益</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-400">负净收益</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full border border-yellow-600"></div>
                                    <span className="text-gray-400">最优解</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 mt-2 text-center">
                                三维帕累托前沿分布 - 风险 × 回报 × 策略
                              </p>
                            </div>
                          )}
                          
                          {/* 数据表格 */}
                          <div className="grid grid-cols-3 gap-2">
                            {solutions[0].quantumMetrics.paretoFront.slice(0, 6).map((point, index) => (
                              <div key={index} className="bg-gray-800/50 rounded p-2 text-xs">
                                <div className="flex justify-between">
                                  <span>风险:</span>
                                  <span className="text-red-400">{(point.risk * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>回报:</span>
                                  <span className="text-green-400">{(point.reward * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>可行性:</span>
                                  <span className="text-blue-400">{(point.feasibility * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 解决方案详情 */}
                    {solutions.map((solution, index) => (
                      <details key={solution.id} className="bg-gray-800/30 rounded-lg" open={index === 0}>
                        <summary className="cursor-pointer p-4 hover:bg-gray-700/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">方案 {index + 1}</span>
                              <span className="ml-3 px-2 py-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-400 rounded-full text-xs">
                                概率 {Math.round(solution.probability * 100)}%
                              </span>
                              {solution.quantumMetrics && (
                                <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                  VQE优化
                                </span>
                              )}
                            </div>
                            <ChartBarIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        </summary>
                        
                        <div className="p-4 pt-0 space-y-4">
                          {/* AI洞察建议 */}
                          {solution.aiInsight && (
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                              <h4 className="font-medium text-purple-400 mb-3 flex items-center">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {solution.aiInsight.title}
                              </h4>
                              
                              {/* 主要建议内容 */}
                              <div className="bg-gray-900/50 rounded-lg p-4 mb-3">
                                <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                                  {solution.aiInsight.content}
                                </div>
                              </div>
                              
                              {/* 概率解读 */}
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
                                <div className="text-sm text-blue-200">
                                  📊 {solution.aiInsight.probability}
                                </div>
                              </div>
                              
                              {/* 风险提示 */}
                              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                                <div className="text-sm text-orange-200">
                                  ⚠️ {solution.aiInsight.risks}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-gray-300">{solution.strategy}</p>
                          
                          {/* 关键指标 */}
                          <div>
                            <h4 className="font-medium text-cyan-400 mb-2">关键指标预估</h4>
                            <div className="space-y-2">
                              {Object.entries(solution.metrics).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between">
                                  <span className="text-sm">{key}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-24 bg-gray-700 rounded-full h-2">
                                      <div
                                        className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full"
                                        style={{ width: `${Math.min(100, Math.abs(value))}%` }}
                                      />
                                    </div>
                                    <span className="text-sm w-10 text-right">{value}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 量子计算特有指标 */}
                          {solution.quantumMetrics && (
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                              <h5 className="text-sm font-medium text-purple-400 mb-2">量子计算详情</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-400">基态能量:</span>
                                  <span className="ml-1 text-cyan-400 font-mono">{solution.quantumMetrics.eigenvalue.toFixed(6)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">优化迭代:</span>
                                  <span className="ml-1 text-cyan-400">{solution.quantumMetrics.convergenceIterations}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 敏感度分析 */}
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <span className="text-xs text-gray-400">
                              敏感度区间: ±{solution.quantumMetrics ? '3' : '5'}% | 
                              置信度: {solution.quantumMetrics ? '92' : '85'}%
                              {solution.quantumMetrics && ' | 量子增强'}
                            </span>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>

                  {/* 行动面板 */}
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-medium text-purple-400 mb-3">立即行动</h3>
                      <ul className="space-y-2">
                        {solutions[0]?.actions.immediate.map((action, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="text-green-400 flex-shrink-0 mt-0.5">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-400 mb-3">监控指标</h3>
                      <ul className="space-y-2">
                        {solutions[0]?.actions.monitor.map((action, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="text-yellow-400 flex-shrink-0 mt-0.5">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-medium text-red-400 mb-3">备选方案</h3>
                      <ul className="space-y-2">
                        {solutions[0]?.actions.fallback.map((action, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 导出选项 */}
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm transition-colors">
                        导出PDF报告
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-sm transition-colors">
                        保存到Notion
                      </button>
                    </div>

                    {/* 采纳按钮 */}
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 rounded-lg font-medium transition-all duration-200">
                      采纳方案 #1
                      {solutions[0]?.quantumMetrics && (
                        <span className="ml-2 text-xs opacity-75">(量子优化)</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 历史页面 */}
        {activeTab === "history" && (
          <div className="glassmorphism rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">决策历史</h2>
            <div className="text-center py-12 text-gray-400">
              <ClockIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>暂无历史记录</p>
              <p className="text-sm mt-2">完成首个决策后，历史记录将出现在这里</p>
            </div>
          </div>
        )}

        {/* 设置页面 */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* 大模型设置 */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">大模型设置</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">模型提供商</h3>
                    <select 
                      value={llmSettings.provider}
                      onChange={(e) => setLlmSettings(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                    >
                      <option value="deepseek">DeepSeek</option>
                      <option value="openai">OpenAI</option>
                      <option value="claude">Claude</option>
                      <option value="gemini">Gemini</option>
                      <option value="tongyi">通义千问</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">模型名称</h3>
                    <select 
                      value={llmSettings.model}
                      onChange={(e) => setLlmSettings(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                    >
                      {getModelOptions(llmSettings.provider).map(model => (
                        <option key={model.value} value={model.value}>{model.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">API密钥</h3>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={llmSettings.apiKey}
                        onChange={(e) => setLlmSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="请输入API密钥"
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showApiKey ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">温度设置</h3>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={llmSettings.temperature}
                      onChange={(e) => setLlmSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>保守 (0.0)</span>
                      <span className="text-cyan-400">{llmSettings.temperature}</span>
                      <span>创意 (1.0)</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">自定义Base URL</h3>
                    <input
                      type="url"
                      value={llmSettings.baseUrl}
                      onChange={(e) => setLlmSettings(prev => ({ ...prev, baseUrl: e.target.value }))}
                      placeholder="可选，使用自定义API端点"
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={testConnection}
                      disabled={isTestingConnection}
                      className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg text-sm text-blue-400 transition-colors disabled:opacity-50"
                    >
                      {isTestingConnection ? "测试中..." : "测试连接"}
                    </button>
                    <button
                      onClick={saveLlmSettings}
                      className="flex-1 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-lg text-sm text-green-400 transition-colors"
                    >
                      保存设置
                    </button>
                  </div>
                  {connectionStatus && (
                    <div className={clsx(
                      "p-3 rounded-lg text-sm",
                      connectionStatus.success 
                        ? "bg-green-500/10 border border-green-500/30 text-green-400"
                        : "bg-red-500/10 border border-red-500/30 text-red-400"
                    )}>
                      {connectionStatus.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 系统设置 */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">系统设置</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">风险偏好</h3>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={systemSettings.riskPreference}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, riskPreference: parseFloat(e.target.value) }))}
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>保守 (0.0)</span>
                      <span className="text-cyan-400">{systemSettings.riskPreference.toFixed(1)}</span>
                      <span>激进 (1.0)</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">量子后端</h3>
                    <select 
                      value={systemSettings.quantumBackend}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, quantumBackend: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                    >
                      <option value="IBM Quantum Simulator">IBM Quantum Simulator</option>
                      <option value="Rigetti QPU">Rigetti QPU</option>
                      <option value="本地模拟器">本地模拟器</option>
                      <option value="Google Quantum AI">Google Quantum AI</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">主题设置</h3>
                    <select 
                      value={systemSettings.theme}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, theme: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                    >
                      <option value="dark">深色模式</option>
                      <option value="light">浅色模式</option>
                      <option value="auto">跟随系统</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">语言设置</h3>
                    <select 
                      value={systemSettings.language}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                    >
                      <option value="zh">中文</option>
                      <option value="en">English</option>
                      <option value="bilingual">双语</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">通知设置</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={systemSettings.emailNotification}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, emailNotification: e.target.checked }))}
                          className="rounded" 
                        />
                        <span className="text-sm">运行完毕邮件通知</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={systemSettings.autoSave}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                          className="rounded" 
                        />
                        <span className="text-sm">自动保存对话</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={saveSystemSettings}
                      className="flex-1 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-lg text-sm text-green-400 transition-colors"
                    >
                      保存系统设置
                    </button>
                    <button
                      onClick={resetSettings}
                      className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-sm text-red-400 transition-colors"
                    >
                      重置所有设置
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 数据管理 */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">数据管理</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">数据导出</h3>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm transition-colors">
                        导出所有对话记录
                      </button>
                      <button className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm transition-colors">
                        导出决策历史
                      </button>
                      <button className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm transition-colors">
                        导出用户设置
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2">数据清理</h3>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-lg text-sm transition-colors">
                        清理缓存数据
                      </button>
                      <button className="w-full px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg text-sm transition-colors">
                        清理30天前对话
                      </button>
                      <button className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-sm transition-colors">
                        清理所有数据
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 关于信息 */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">关于</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-purple-400 mb-3">版本信息</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>应用版本:</span>
                      <span className="text-cyan-400">v1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>构建时间:</span>
                      <span className="text-cyan-400">2024-01-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>量子SDK:</span>
                      <span className="text-cyan-400">Qiskit 0.45.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>运行环境:</span>
                      <span className="text-cyan-400">Next.js 14</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-purple-400 mb-3">支持</h3>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-sm transition-colors">
                      查看帮助文档
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-sm transition-colors">
                      反馈问题
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-sm transition-colors">
                      检查更新
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部栏 */}
      <footer className="mt-12 border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-6 text-sm text-gray-400">
          <span>© 2024 MindPulse</span>
          <a href="#" className="hover:text-white">隐私声明</a>
          <a href="#" className="hover:text-white">联系我们</a>
        </div>
      </footer>
    </div>
  );
}
