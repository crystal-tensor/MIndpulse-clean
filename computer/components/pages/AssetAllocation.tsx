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
  CurrencyDollarIcon,
  ScaleIcon,
  ShieldExclamationIcon
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { getAssetAllocationTranslation, Language, DEFAULT_LANGUAGE } from "../../lib/translations/asset-allocation";

interface DecisionVariable {
  id: string;
  type: "目标" | "风险" | "资产";
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
  algorithm: "quantum" | "classical";
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
    };
  };
  aiInsight?: {
    title: string;
    content: string;
    risks: string;
    probability: string;
  };
}

type ActiveTab =
  | "dialogue"
  | "summary"
  | "quantum"
  | "solutions"
  | "history"
  | "settings";

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

export default function AssetAllocation() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const t = getAssetAllocationTranslation(language);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>("dialogue");
  const [currentPhase, setCurrentPhase] = useState(1); // 1: 目标, 2: 资产, 3: 风险, 4: 摘要
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<ChatMessage>>([]);

  const [currentInput, setCurrentInput] = useState("");
  const [variables, setVariables] = useState<DecisionVariable[]>([]);
  const [hasStartedExtraction, setHasStartedExtraction] = useState(false);
  const [variablesHash, setVariablesHash] = useState<string>("");

  const [quantumProgress, setQuantumProgress] = useState<QuantumProgress>({
    qubits: 8,
    shots: 1024,
    currentIteration: 0,
    totalIterations: 100,
    energy: [],
    status: "idle",
    backend: "IBM Quantum Simulator",
    eta: "3分钟",
    algorithm: "quantum"
  });

  const [solutions, setSolutions] = useState<DecisionSolution[]>([]);
  const [completionProgress, setCompletionProgress] = useState(0);

  // LLM设置状态
  const [llmSettings, setLlmSettings] = useState({
    provider: "deepseek",
    model: "deepseek-chat",
    apiKey: "",
    temperature: 0.7,
    baseUrl: "",
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // 系统设置状态
  const [systemSettings, setSystemSettings] = useState({
    riskPreference: 0.5,
    quantumBackend: "IBM Quantum Simulator",
    language: language,
    emailNotification: true,
    autoSave: true,
    theme: "dark",
  });

  // 聊天消息容器引用，用于自动滚动
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // 初始化欢迎消息
  useEffect(() => {
    setChatMessages([
      {
        id: "welcome",
        role: "system",
        content: t.dialogue.welcomeMessage,
        timestamp: new Date(),
      },
    ]);
  }, [language]);

  // 语言切换时更新系统设置
  useEffect(() => {
    setSystemSettings(prev => ({ ...prev, language }));
  }, [language]);

  // 自动滚动到聊天底部
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 计算进度
  useEffect(() => {
    if (!variables.length) {
      setCompletionProgress(0);
      return;
    }

    const goalCount = variables.filter((v) => v.type === "目标").length;
    const assetCount = variables.filter((v) => v.type === "资产").length;
    const riskCount = variables.filter((v) => v.type === "风险").length;

    const totalVariables = goalCount + assetCount + riskCount;
    const expectedMinimum = 3; // 期望至少有3个变量（目标、资产、风险各1个）
    
    const phaseProgress = currentPhase === 4 
      ? 100 
      : Math.min(95, (totalVariables / expectedMinimum) * 30 + (currentPhase - 1) * 25);

    setCompletionProgress(Math.max(0, phaseProgress));
  }, [variables, currentPhase, hasStartedExtraction]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsExtracting(true);

    try {
      if (!hasStartedExtraction) {
        setVariables([]);
        setHasStartedExtraction(true);
      }

      // 模拟API调用（因为computer版本可能没有完整的API）
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: getPhaseResponse(currentPhase),
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiMessage]);
        setIsExtracting(false);
      }, 1000);

    } catch (error) {
      console.error("提取变量错误:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content: t.errors.extractionFailed,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      setIsExtracting(false);
    }
  };

  const getPhaseResponse = (phase: number): string => {
    switch (phase) {
      case 1: return t.dialogue.goalPrompt;
      case 2: return t.dialogue.assetPrompt;
      case 3: return t.dialogue.riskPrompt;
      default: return t.dialogue.welcomeMessage;
    }
  };

  const getVariableIcon = (type: DecisionVariable["type"]) => {
    switch (type) {
      case "目标": return CurrencyDollarIcon;
      case "风险": return ShieldExclamationIcon;
      case "资产": return ChartBarIcon;
      default: return LightBulbIcon;
    }
  };

  const getStatusColor = (status: QuantumProgress["status"]) => {
    switch (status) {
      case "idle": return "text-gray-400";
      case "running": return "text-blue-400 animate-pulse";
      case "completed": return "text-green-400";
      case "error": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getPhaseTitle = (phase: number) => {
    switch (phase) {
      case 1: return t.phases.goal;
      case 2: return t.phases.asset;
      case 3: return t.phases.risk;
      case 4: return t.phases.summary;
      default: return t.phases.goal;
    }
  };

  const getInputPlaceholder = (phase: number) => {
    switch (phase) {
      case 1: return t.dialogue.goalPlaceholder;
      case 2: return t.dialogue.assetPlaceholder;
      case 3: return t.dialogue.riskPlaceholder;
      default: return t.dialogue.goalPlaceholder;
    }
  };

  const startQuantumRun = async () => {
    if (variables.length === 0) {
      alert("请先完成变量提取");
      return;
    }

    setQuantumProgress((prev) => ({
      ...prev,
      status: "running",
      currentIteration: 0,
      energy: [],
    }));

    // 模拟量子计算过程
    const interval = setInterval(() => {
      setQuantumProgress((prev) => {
        if (prev.currentIteration >= prev.totalIterations) {
          clearInterval(interval);
          return { ...prev, status: "completed" };
        }
        return {
          ...prev,
          currentIteration: prev.currentIteration + 1,
          energy: [...prev.energy, Math.random() * 100 - 50],
        };
      });
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* 主容器 */}
      <div className="flex h-full">
        {/* 左侧边栏 */}
        <div className="w-80 bg-black/30 backdrop-blur-md border-r border-emerald-500/20 flex flex-col">
          {/* 顶部标题 */}
          <div className="p-6 border-b border-emerald-500/20">
            <div className="flex items-center gap-3 mb-2">
              <ChartBarIcon className="w-8 h-8 text-emerald-400" />
              <div>
                <h1 className="text-xl font-bold text-white">{t.title}</h1>
                <p className="text-sm text-emerald-400">{t.description}</p>
              </div>
            </div>
            
            {/* 语言切换器 */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setLanguage('zh')}
                className={clsx(
                  "px-3 py-1 rounded text-sm transition-colors",
                  language === 'zh' 
                    ? "bg-emerald-500 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={clsx(
                  "px-3 py-1 rounded text-sm transition-colors",
                  language === 'en' 
                    ? "bg-emerald-500 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                English
              </button>
            </div>
          </div>

          {/* 阶段指示器 */}
          <div className="p-6">
            <div className="space-y-4">
              {[
                { id: 1, label: t.phases.goal, icon: "🎯", phase: 1 },
                { id: 2, label: t.phases.asset, icon: "📊", phase: 2 },
                { id: 3, label: t.phases.risk, icon: "⚠️", phase: 3 },
                { id: 4, label: t.phases.summary, icon: "📋", phase: 4 },
              ].map((item) => (
                <div
                  key={item.id}
                  className={clsx(
                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                    currentPhase === item.phase
                      ? "bg-emerald-500/20 border border-emerald-500/40"
                      : "bg-gray-800/50 border border-gray-700/50"
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span
                    className={clsx(
                      "text-sm font-medium",
                      currentPhase === item.phase
                        ? "text-emerald-400"
                        : "text-gray-400"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 标签栏 */}
          <div className="bg-black/20 backdrop-blur-md border-b border-emerald-500/20">
            <div className="flex space-x-8 px-6">
              {[
                { id: "dialogue" as ActiveTab, label: t.tabs.dialogue, icon: ChatBubbleBottomCenterTextIcon },
                { id: "summary" as ActiveTab, label: t.tabs.summary, icon: ClipboardDocumentCheckIcon },
                { id: "quantum" as ActiveTab, label: t.tabs.quantum, icon: BeakerIcon },
                { id: "solutions" as ActiveTab, label: t.tabs.solutions, icon: LightBulbIcon },
                { id: "settings" as ActiveTab, label: t.tabs.settings, icon: Cog6ToothIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "text-emerald-400 border-emerald-400"
                      : "text-gray-400 hover:text-gray-300 border-transparent hover:border-gray-600"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "dialogue" && (
              <div className="h-full flex flex-col">
                {/* 聊天区域 */}
                <div 
                  ref={chatMessagesRef} 
                  className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={clsx(
                        "flex gap-3",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={clsx(
                          "max-w-2xl p-4 rounded-lg",
                          message.role === "user"
                            ? "bg-emerald-500 text-white"
                            : message.role === "system"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-gray-700/50 text-gray-300"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.phaseSummary && (
                          <div className="mt-3 p-3 bg-black/20 rounded">
                            <h4 className="font-medium text-emerald-400 mb-2">
                              {message.phaseSummary.title}
                            </h4>
                            <ul className="space-y-1">
                              {message.phaseSummary.items.map((item, index) => (
                                <li key={index} className="text-sm text-gray-300">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isExtracting && (
                    <div className="flex gap-3 justify-start">
                      <div className="bg-gray-700/50 text-gray-300 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span>{t.status.extracting}...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 输入区域 */}
                <div className="p-6 border-t border-emerald-500/20">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={getInputPlaceholder(currentPhase)}
                      className="flex-1 bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
                      disabled={isExtracting}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!currentInput.trim() || isExtracting}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {t.buttons.send}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quantum" && (
              <div className="p-6 h-full overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {t.computation.algorithmSelection}
                    </h2>
                    <p className="text-gray-400">
                      {t.report.algorithmComparison}
                    </p>
                  </div>

                  {/* 算法选择 */}
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => setQuantumProgress(prev => ({ ...prev, algorithm: "quantum" }))}
                      className={clsx(
                        "p-6 rounded-lg border-2 transition-all",
                        quantumProgress.algorithm === "quantum"
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                      )}
                    >
                      <div className="text-center">
                        <BeakerIcon className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                        <h3 className="text-lg font-bold text-white mb-2">
                          {t.computation.quantumAlgorithm}
                        </h3>
                        <p className="text-sm text-gray-400">
                          使用QUBO算法进行量子优化
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setQuantumProgress(prev => ({ ...prev, algorithm: "classical" }))}
                      className={clsx(
                        "p-6 rounded-lg border-2 transition-all",
                        quantumProgress.algorithm === "classical"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                      )}
                    >
                      <div className="text-center">
                        <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                        <h3 className="text-lg font-bold text-white mb-2">
                          {t.computation.classicalAlgorithm}
                        </h3>
                        <p className="text-sm text-gray-400">
                          使用传统优化算法
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* 计算控制 */}
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">
                        {t.computation.progress}
                      </h3>
                      <div className="flex gap-3">
                        <button
                          onClick={startQuantumRun}
                          disabled={quantumProgress.status === "running"}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50"
                        >
                          <PlayIcon className="w-4 h-4" />
                          {t.computation.startComputation}
                        </button>
                        {quantumProgress.status === "completed" && (
                          <button
                            onClick={() => setActiveTab("solutions")}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            {t.computation.viewReport}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 进度显示 */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {t.computation.currentIteration}: {quantumProgress.currentIteration}
                        </span>
                        <span className={getStatusColor(quantumProgress.status)}>
                          {t.status[quantumProgress.status]}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(quantumProgress.currentIteration / quantumProgress.totalIterations) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "solutions" && (
              <div className="p-6 h-full overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {t.report.title}
                  </h2>
                  
                  {quantumProgress.status === "completed" ? (
                    <div className="space-y-6">
                      {/* 资产配置表格 */}
                      <div className="bg-gray-800/50 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                          {t.report.optimizationResults}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left p-3 text-gray-300">{t.report.assetTable.assetName}</th>
                                <th className="text-left p-3 text-gray-300">{t.report.assetTable.currentPrice}</th>
                                <th className="text-left p-3 text-gray-300">{t.report.assetTable.weightBefore}</th>
                                <th className="text-left p-3 text-gray-300">{t.report.assetTable.weightAfter}</th>
                                <th className="text-left p-3 text-gray-300">{t.report.assetTable.returnRate}</th>
                                <th className="text-left p-3 text-gray-300">{t.report.assetTable.sharpeRatio}</th>
                                <th className="text-left p-3 text-gray-300">{t.report.assetTable.maxDrawdown}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { name: "沪深300ETF", price: "4.2", before: "30%", after: "35%", return: "8.5%", sharpe: "1.2", drawdown: "12%" },
                                { name: "中证500ETF", price: "6.8", before: "25%", after: "28%", return: "12.3%", sharpe: "1.4", drawdown: "18%" },
                                { name: "国债ETF", price: "102.5", before: "20%", after: "15%", return: "3.2%", sharpe: "0.8", drawdown: "2%" },
                                { name: "黄金ETF", price: "4.1", before: "15%", after: "12%", return: "5.8%", sharpe: "0.9", drawdown: "8%" },
                                { name: "美股ETF", price: "3.9", before: "10%", after: "10%", return: "15.2%", sharpe: "1.6", drawdown: "25%" },
                              ].map((asset, index) => (
                                <tr key={index} className="border-b border-gray-700/50">
                                  <td className="p-3 text-white font-medium">{asset.name}</td>
                                  <td className="p-3 text-gray-300">¥{asset.price}</td>
                                  <td className="p-3 text-gray-300">{asset.before}</td>
                                  <td className="p-3 text-emerald-400 font-medium">{asset.after}</td>
                                  <td className="p-3 text-blue-400">{asset.return}</td>
                                  <td className="p-3 text-purple-400">{asset.sharpe}</td>
                                  <td className="p-3 text-red-400">{asset.drawdown}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 图表占位符 */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 rounded-lg p-6">
                          <h3 className="text-lg font-bold text-white mb-4">
                            {t.report.returnCurve}
                          </h3>
                          <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">
                              收益率曲线图表
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-lg p-6">
                          <h3 className="text-lg font-bold text-white mb-4">
                            {t.report.priceChart}
                          </h3>
                          <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">
                              价格走势图表
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BeakerIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">
                        请先完成量子计算以生成报告
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="p-6 h-full overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    {t.tabs.settings}
                  </h2>

                  {/* LLM设置 */}
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      {t.settings.llmSettings}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t.settings.provider}
                        </label>
                        <select
                          value={llmSettings.provider}
                          onChange={(e) => setLlmSettings(prev => ({ ...prev, provider: e.target.value }))}
                          className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-emerald-500"
                        >
                          <option value="deepseek">DeepSeek</option>
                          <option value="openai">OpenAI</option>
                          <option value="claude">Claude</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t.settings.language}
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as Language)}
                          className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-emerald-500"
                        >
                          <option value="zh">中文</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 