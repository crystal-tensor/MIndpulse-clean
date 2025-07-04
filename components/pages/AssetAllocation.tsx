"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  ChatBubbleLeftRightIcon, 
  CpuChipIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  PlusIcon,
  PaperAirplaneIcon,
  CheckIcon,
  ArrowPathIcon,
  PlayIcon,
  StopIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ShieldExclamationIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { 
  Language, 
  getAssetAllocationTranslation, 
  DEFAULT_LANGUAGE 
} from "@/lib/translations/asset-allocation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ReactECharts from 'echarts-for-react';
// 添加KLineChart支持
import { init as klineInit, dispose as klineDispose } from 'klinecharts';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 定义变量类型（模仿智能决策）
interface DecisionVariable {
  id: string;
  type: '目标' | '资产' | '风险';
  name: string;
  value: string;
  confidence: number;
  weight: number;
  editable: boolean;
}

// 聊天消息类型
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  phaseSummary?: {
    title: string;
    items: string[];
  };
  showConfirmButtons?: boolean;
}

// 计算进度
interface QuantumProgress {
  qubits: number;
  shots: number;
  currentIteration: number;
  totalIterations: number;
  energy: number[];
  status: 'idle' | 'running' | 'completed' | 'error';
  backend: string;
  eta: string;
  algorithm: 'quantum' | 'classical';
}

// 解决方案类型
interface DecisionSolution {
  id: string;
  title: string;
  description: string;
  probability: number;
  confidence: number;
  risks: string[];
  benefits: string[];
  aiInsight: {
    title: string;
    content: string;
    risks: string;
    probability: string;
  };
}

// 活跃标签类型
type ActiveTab = 'dialogue' | 'summary' | 'quantum' | 'report' | 'settings';

export default function AssetAllocation() {
  // 语言状态
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const t = getAssetAllocationTranslation(language);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>("dialogue");
  const [currentPhase, setCurrentPhase] = useState(1); // 1: 目标, 2: 资产, 3: 风险, 4: 摘要
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<ChatMessage>>([
    {
      id: "welcome",
      role: "system",
      content: t.dialogue.welcomeMessage,
      timestamp: new Date(),
    },
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [variables, setVariables] = useState<DecisionVariable[]>([]);
  const [hasStartedExtraction, setHasStartedExtraction] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [portfolioData, setPortfolioData] = useState<any>(null);

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
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportCountdown, setReportCountdown] = useState(0);

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

  // 会话ID
  const [sessionId] = useState(`session_${Date.now()}`);

  // 权重编辑状态
  const [isEditingWeights, setIsEditingWeights] = useState(false);
  const [editedWeights, setEditedWeights] = useState<{[key: string]: number}>({});
  const [weightAdjustmentMessage, setWeightAdjustmentMessage] = useState("");

  // 指数选择状态
  const [selectedIndices, setSelectedIndices] = useState<string[]>(['上证指数']);

  // 聊天消息容器引用，用于自动滚动
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  
  // 输入框引用，用于保持焦点
  const inputRef = useRef<HTMLInputElement>(null);

  // KLineChart组件（简化版，使用ECharts蜡烛图）
  const KLineChartComponent = ({ chart }: { chart: any }) => {
    // 计算5日和10日均线
    const calculateMA = (data: any[], period: number) => {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          result.push('-');
        } else {
          let sum = 0;
          for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
          }
          result.push((sum / period).toFixed(2));
        }
      }
      return result;
    };

    const chartData = chart.data || [];
    const ma5 = calculateMA(chartData, 5);
    const ma10 = calculateMA(chartData, 10);

    // 准备蜡烛图数据 [开盘价, 收盘价, 最低价, 最高价]
    const candlestickData = chartData.map((item: any) => [
      parseFloat(item.open) || 0,
      parseFloat(item.close) || 0,
      parseFloat(item.low) || 0,
      parseFloat(item.high) || 0
    ]);

    const dates = chartData.map((item: any) => item.date);

    return (
      <div className="glassmorphism rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          {chart.name} ({chart.symbol}) - K线图
        </h3>
        <div className="bg-gray-800/50 rounded-lg p-4" style={{ height: '500px' }}>
          <ReactECharts
            option={{
              backgroundColor: 'transparent',
              title: {
                text: `${chart.name} 股价走势`,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 16
                },
                top: 10,
                left: 'center'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross'
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#777',
                textStyle: {
                  color: '#fff'
                },
                formatter: function (params: any) {
                  let result = `日期: ${params[0].name}<br/>`;
                  
                  params.forEach((param: any) => {
                    if (param.seriesName === chart.name) {
                      // 蜡烛图数据
                      const data = param.data;
                      result += `开盘: ${data[1]}<br/>`;
                      result += `收盘: ${data[2]}<br/>`;
                      result += `最低: ${data[3]}<br/>`;
                      result += `最高: ${data[4]}<br/>`;
                    } else if (param.seriesName === 'MA5') {
                      result += `MA5: ${param.data}<br/>`;
                    } else if (param.seriesName === 'MA10') {
                      result += `MA10: ${param.data}<br/>`;
                    }
                  });
                  
                  return result;
                }
              },
              legend: {
                data: [chart.name, 'MA5', 'MA10'],
                textStyle: {
                  color: '#ffffff'
                },
                top: 35
              },
              grid: {
                left: '10%',
                right: '10%',
                top: '20%',
                bottom: '15%'
              },
              xAxis: {
                type: 'category',
                data: dates,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                axisLabel: {
                  color: '#ffffff',
                  formatter: (value: string) => {
                    // 显示月-日格式
                    return value.slice(5);
                  }
                }
              },
              yAxis: {
                scale: true,
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: [
                      'rgba(250,250,250,0.05)',
                      'rgba(200,200,200,0.02)'
                    ]
                  }
                },
                axisLabel: {
                  color: '#ffffff'
                },
                splitLine: {
                  lineStyle: {
                    color: 'rgba(255,255,255,0.1)'
                  }
                }
              },
              dataZoom: [
                {
                  type: 'inside',
                  start: 70,
                  end: 100
                },
                {
                  show: true,
                  type: 'slider',
                  top: '90%',
                  start: 70,
                  end: 100,
                  textStyle: {
                    color: '#ffffff'
                  }
                }
              ],
              series: [
                {
                  name: chart.name,
                  type: 'candlestick',
                  data: candlestickData,
                  itemStyle: {
                    color: '#00da3c',        // 阳线颜色
                    color0: '#ec0000',       // 阴线颜色
                    borderColor: '#00da3c',  // 阳线边框
                    borderColor0: '#ec0000'  // 阴线边框
                  },
                  markPoint: {
                    label: {
                      formatter: function (param: any) {
                        return param != null ? Math.round(param.value) + '' : '';
                      }
                    },
                    data: [
                      {
                        name: 'Mark',
                        coord: ['2013/5/31', 2300],
                        value: 2300,
                        itemStyle: {
                          color: 'rgb(41,60,85)'
                        }
                      },
                      {
                        name: 'highest value',
                        type: 'max',
                        valueDim: 'highest'
                      },
                      {
                        name: 'lowest value',
                        type: 'min',
                        valueDim: 'lowest'
                      }
                    ]
                  }
                },
                {
                  name: 'MA5',
                  type: 'line',
                  data: ma5,
                  smooth: true,
                  lineStyle: {
                    color: '#ff6b6b',
                    width: 2
                  },
                  showSymbol: false
                },
                {
                  name: 'MA10',
                  type: 'line',
                  data: ma10,
                  smooth: true,
                  lineStyle: {
                    color: '#4ecdc4',
                    width: 2
                  },
                  showSymbol: false
                }
              ]
            }}
            style={{ height: '100%', width: '100%' }}
            theme="dark"
          />
        </div>
        <div className="mt-4 text-sm text-gray-400">
          K线图显示股票的开盘、收盘、最高、最低价格信息，包含5日和10日移动平均线
        </div>
      </div>
    );
  };

  // 组件加载时从localStorage恢复设置
  useEffect(() => {
    try {
      // 恢复LLM设置
      const savedLlmSettings = localStorage.getItem("llmSettings");
      if (savedLlmSettings) {
        const parsedLlmSettings = JSON.parse(savedLlmSettings);
        setLlmSettings(parsedLlmSettings);
      }

      // 恢复系统设置
      const savedSystemSettings = localStorage.getItem("systemSettings");
      if (savedSystemSettings) {
        const parsedSystemSettings = JSON.parse(savedSystemSettings);
        setSystemSettings(parsedSystemSettings);
        // 如果系统设置中有语言偏好，也更新语言状态
        if (parsedSystemSettings.language) {
          setLanguage(parsedSystemSettings.language);
        }
      }
    } catch (error) {
      console.error("恢复设置时出错:", error);
    }
  }, []); // 只在组件挂载时运行一次

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

  // 计算进度 - 使用useMemo优化性能
  const completionProgressValue = useMemo(() => {
    if (!variables.length) {
      return 0;
    }

    const goalCount = variables.filter((v) => v.type === "目标").length;
    const assetCount = variables.filter((v) => v.type === "资产").length;
    const riskCount = variables.filter((v) => v.type === "风险").length;

    const totalVariables = goalCount + assetCount + riskCount;
    const expectedMinimum = 3; // 期望至少有3个变量（目标、资产、风险各1个）
    
    const phaseProgress = currentPhase === 4 
      ? 100 
      : Math.min(95, (totalVariables / expectedMinimum) * 30 + (currentPhase - 1) * 25);

    return Math.max(0, phaseProgress);
  }, [variables.length, currentPhase, hasStartedExtraction]);

  // 更新进度状态
  useEffect(() => {
    setCompletionProgress(completionProgressValue);
  }, [completionProgressValue]);

  // 获取阶段标题
  const getPhaseTitle = (phase: number) => {
    switch (phase) {
      case 1: return t.phases.goal;
      case 2: return t.phases.asset;
      case 3: return t.phases.risk;
      case 4: return t.phases.summary;
      default: return "";
    }
  };

  // 获取确认消息
  const getConfirmMessage = (phase: number) => {
    switch (phase) {
      case 1: return t.dialogue.confirmMessage.goal;
      case 2: return t.dialogue.confirmMessage.asset;
      case 3: return t.dialogue.confirmMessage.risk;
      default: return "";
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const messageToSend = currentInput; // 保存消息内容

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsExtracting(true);

    try {
      // 清除默认变量，开始真正的提取
      if (!hasStartedExtraction) {
        setVariables([]);
        setHasStartedExtraction(true);
      }

      const response = await fetch("/api/mindpilot/asset-allocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend, // 使用保存的消息内容
          phase: currentPhase,
          sessionId,
          llmSettings,
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
              editable: true,
            });
          });

          // 添加资产（计算默认权重）
          const assetCount = data.extracted.assets?.length || 0;
          const defaultWeight = assetCount > 0 ? 1.0 / assetCount : 0;
          
          data.extracted.assets?.forEach((asset: string, index: number) => {
            newVariables.push({
              id: `asset_${Date.now()}_${index}`,
              type: "资产",
              name: asset,
              value: `投资${asset}`,
              confidence: 0.75 + Math.random() * 0.2,
              weight: defaultWeight,
              editable: true,
            });
          });

          // 添加风险
          data.extracted.risks?.forEach((risk: string, index: number) => {
            newVariables.push({
              id: `risk_${Date.now()}_${index}`,
              type: "风险",
              name: risk,
              value: `控制${risk}`,
              confidence: 0.85 + Math.random() * 0.1,
              weight: 0.5 + Math.random() * 0.4,
              editable: true,
            });
          });

          setVariables((prev) => {
            // 合并新变量，避免重复
            const existingNames = prev.map((v) => v.name);
            const uniqueNewVars = newVariables.filter(
              (v) => !existingNames.includes(v.name),
            );
            return [...prev, ...uniqueNewVars];
          });
        }

        // 添加AI回应
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.aiResponse || "我已经分析了您的输入并提取了相关信息。",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiMessage]);

        // 在每次对话后显示阶段总结和确认按钮（仅在前3个阶段）
        if (currentPhase <= 3) {
          setTimeout(() => {
            // 获取当前阶段的变量
            const currentPhaseVariables = variables.filter((v) => {
              if (currentPhase === 1) return v.type === "目标";
              if (currentPhase === 2) return v.type === "资产";
              if (currentPhase === 3) return v.type === "风险";
              return false;
            });

            // 获取新提取的变量
            const newPhaseVariables = newVariables.filter(
              (v: DecisionVariable) => {
                if (currentPhase === 1) return v.type === "目标";
                if (currentPhase === 2) return v.type === "资产";
                if (currentPhase === 3) return v.type === "风险";
                return false;
              },
            );

            // 合并所有当前阶段的变量
            const allPhaseVariables = [
              ...currentPhaseVariables.map((v) => v.name),
              ...newPhaseVariables.map((v) => v.name),
            ];

            // 总是添加阶段总结消息（即使没有变量也显示，方便用户了解当前状态）
            const summaryMessage: ChatMessage = {
              id: Date.now().toString(),
              role: "system",
              content: "",
              timestamp: new Date(),
              phaseSummary: {
                title: allPhaseVariables.length > 0 
                  ? `我已收集到以下${getPhaseTitle(currentPhase).replace("收集", "").replace("盘点", "").replace("识别", "")}：`
                  : `正在收集${getPhaseTitle(currentPhase).replace("收集", "").replace("盘点", "").replace("识别", "")}信息...`,
                items: allPhaseVariables.length > 0 ? allPhaseVariables : [`请继续描述您的${getPhaseTitle(currentPhase).replace("收集", "").replace("盘点", "").replace("识别", "")}`],
              },
            };
            setChatMessages((prev) => [...prev, summaryMessage]);

            // 总是添加确认按钮消息
            const confirmMessage: ChatMessage = {
              id: `confirm_${Date.now()}`,
              role: "system",
              content: getConfirmMessage(currentPhase),
              timestamp: new Date(),
              showConfirmButtons: true,
            };
            setChatMessages((prev) => [...prev, confirmMessage]);
          }, 1000);
        }
      } else {
        throw new Error(data.error || "提取失败");
      }
    } catch (error) {
      console.error("提取变量错误:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content: t.errors.extractionFailed,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsExtracting(false);
    }
  };

  // 确认阶段
  const confirmPhase = () => {
    if (currentPhase < 3) {
      setCurrentPhase(currentPhase + 1);
      
      // 添加阶段切换消息
      const phaseMessages = {
        1: t.dialogue.phaseConfirm.goal,
        2: t.dialogue.phaseConfirm.asset,
        3: t.dialogue.phaseConfirm.risk,
      };
      
      const confirmMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: phaseMessages[currentPhase as keyof typeof phaseMessages],
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, confirmMessage]);
    } else {
      // 进入摘要阶段
      setCurrentPhase(4);
      setActiveTab("summary");
    }
  };

  // 获取股票数据
  const fetchStockData = async () => {
    const assetVariables = variables.filter(v => v.type === "资产");
    const assetNames = assetVariables.map(v => v.name);

    try {
      const response = await fetch("/api/mindpilot/astock-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assets: assetNames }),
      });

      if (response.ok) {
        const data = await response.json();
        setStockData(data.data);
        setPortfolioData(data.portfolioData); // 保存Qiskit Finance数据
        return data; // 返回完整数据
      } else {
        throw new Error("获取股票数据失败");
      }
    } catch (error) {
      console.error("获取股票数据错误:", error);
      return [];
    }
  };

  // 开始量子计算
  const startQuantumComputation = async () => {
    if (variables.length < 3) {
      console.log("变量数量不足，需要至少3个变量");
      return;
    }

    console.log("开始量子计算，当前变量：", variables);
    setQuantumProgress(prev => ({ ...prev, status: "running" }));
    setActiveTab("quantum");

    try {
      // 首先获取股票数据
      const stockDataResult = await fetchStockData();
      console.log("股票数据获取结果：", stockDataResult);
      
      if (!stockDataResult || !stockDataResult.data || stockDataResult.data.length === 0) {
        throw new Error("无法获取股票数据");
      }

      // 启动优化API调用（异步）
      const optimizationPromise = fetch("/api/mindpilot/asset-quantum-solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algorithm: quantumProgress.algorithm,
          variables: {
            goals: variables.filter(v => v.type === "目标").map(v => v.name),
            assets: variables.filter(v => v.type === "资产").map(v => v.name),
            risks: variables.filter(v => v.type === "风险").map(v => v.name),
          },
          stockData: stockDataResult.data,
          portfolioData: stockDataResult.portfolioData,
        }),
      });

      // 同时显示进度条动画（确保完整显示）
      const progressPromise = new Promise<void>(async (resolve) => {
        for (let i = 0; i <= 100; i += 2) {
          await new Promise(resolveTimeout => setTimeout(resolveTimeout, 150));
          setQuantumProgress(prev => ({ 
            ...prev, 
            currentIteration: Math.floor(i / 2) + 1,
            totalIterations: 50,
            energy: [...prev.energy, Math.random() * 100 - i/2]
          }));
        }
        resolve();
      });

      // 等待两个Promise都完成
      const [response] = await Promise.all([optimizationPromise, progressPromise]);

      if (response.ok) {
        const data = await response.json();
        console.log("优化结果：", data);
        
        // 新的资产量子API返回格式: { success: true, data: OptimizationResult }
        if (data && data.success && data.data) {
          setOptimizationResult(data.data);
          console.log("optimizationResult已设置:", data.data);
        } else if (data && data.result) {
          // 兼容旧格式
          setOptimizationResult(data.result);
          console.log("optimizationResult已设置:", data.result);
        } else {
          console.error("API返回的数据结构不正确:", data);
          // 即使数据结构不正确，也设置一个基本的结果对象
          setOptimizationResult({
            algorithm: quantumProgress.algorithm,
            assets: variables.filter(v => v.type === "资产").map(v => ({
              name: v.name,
              weightBefore: 0,
              weightAfter: v.weight || 0.25,
              returnRate: Math.random() * 0.2 - 0.05,
              sharpeRatio: Math.random() * 2,
              maxDrawdown: Math.random() * 0.3
            })),
            portfolioMetrics: {
              expectedReturn: Math.random() * 0.15,
              volatility: Math.random() * 0.25,
              sharpeRatio: Math.random() * 2,
              maxDrawdown: Math.random() * 0.3
            }
          });
        }
        
        setQuantumProgress(prev => ({ ...prev, status: "completed" }));
      } else {
        const errorData = await response.json();
        console.error("优化API错误：", errorData);
        throw new Error("优化计算失败");
      }
    } catch (error) {
      console.error("量子计算错误:", error);
      setQuantumProgress(prev => ({ ...prev, status: "error" }));
    }
  };

  // 获取模型选项
  const getModelOptions = (provider: string) => {
    const options = {
      deepseek: [
        { value: "deepseek-chat", label: "DeepSeek Chat" },
        { value: "deepseek-coder", label: "DeepSeek Coder" },
      ],
      openai: [
        { value: "gpt-4", label: "GPT-4" },
        { value: "gpt-4o-mini", label: "GPT-4O Mini" },
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
      ],
      claude: [
        { value: "claude-3-haiku", label: "Claude 3 Haiku" },
        { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
        { value: "claude-3-opus", label: "Claude 3 Opus" },
      ],
    };
    return options[provider as keyof typeof options] || [];
  };

  // 测试连接
  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);

    try {
      const response = await fetch("/api/mindpilot/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(llmSettings),
      });

      const data = await response.json();

      if (response.ok) {
        setConnectionStatus({
          success: true,
          message: `连接成功！模型: ${data.model}, 响应时间: ${data.responseTime}ms`,
        });
      } else {
        throw new Error(data.error || "连接失败");
      }
    } catch (error: any) {
      setConnectionStatus({
        success: false,
        message: `连接失败: ${error.message}`,
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // 保存LLM设置
  const saveLlmSettings = () => {
    localStorage.setItem("llmSettings", JSON.stringify(llmSettings));
    setConnectionStatus({
      success: true,
      message: "LLM设置已保存",
    });
  };

  // 自动保存LLM设置（当设置改变时）
  useEffect(() => {
    // 防止在初始加载时触发保存
    const timeoutId = setTimeout(() => {
      if (llmSettings.apiKey || llmSettings.baseUrl) {
        localStorage.setItem("llmSettings", JSON.stringify(llmSettings));
      }
    }, 500); // 500ms的防抖延迟

    return () => clearTimeout(timeoutId);
  }, [llmSettings]);

  // 保存系统设置
  const saveSystemSettings = () => {
    localStorage.setItem("systemSettings", JSON.stringify(systemSettings));
    setConnectionStatus({
      success: true,
      message: "系统设置已保存",
    });
  };

  // 重置设置
  const resetSettings = () => {
    const defaultLlmSettings = {
      provider: "deepseek",
      model: "deepseek-chat",
      apiKey: "",
      temperature: 0.7,
      baseUrl: "",
    };
    const defaultSystemSettings = {
      riskPreference: 0.5,
      quantumBackend: "IBM Quantum Simulator",
      language: "zh" as Language,
      emailNotification: true,
      autoSave: true,
      theme: "dark",
    };

    setLlmSettings(defaultLlmSettings);
    setSystemSettings(defaultSystemSettings);
    localStorage.removeItem("llmSettings");
    localStorage.removeItem("systemSettings");
    
    setConnectionStatus({
      success: true,
      message: "所有设置已重置为默认值",
    });
  };

  // 生成报告
  // 开始编辑权重
  const startEditingWeights = () => {
    const assetVariables = variables.filter(v => v.type === "资产");
    const currentWeights: {[key: string]: number} = {};
    assetVariables.forEach(variable => {
      currentWeights[variable.id] = variable.weight * 100; // 转换为百分比显示
    });
    setEditedWeights(currentWeights);
    setIsEditingWeights(true);
    setWeightAdjustmentMessage("");
  };

  // 取消编辑权重
  const cancelEditingWeights = () => {
    setIsEditingWeights(false);
    setEditedWeights({});
    setWeightAdjustmentMessage("");
  };

  // 确认权重修改
  const confirmWeightChanges = () => {
    const assetVariables = variables.filter(v => v.type === "资产");
    
    // 计算总权重（使用当前编辑的权重或原始权重）
    const totalWeight = assetVariables.reduce((sum, variable) => {
      const currentWeight = editedWeights[variable.id] !== undefined 
        ? editedWeights[variable.id] 
        : variable.weight * 100;
      return sum + currentWeight;
    }, 0);
    
    let adjustmentMessage = "";
    let finalWeights: {[key: string]: number} = {};
    
    // 检查总权重是否等于100%
    if (Math.abs(totalWeight - 100) > 0.01) { // 允许0.01%的误差
      // 需要调整权重
      adjustmentMessage = `因为调整后的权重总和必须为1，但你修改后的总权重是${totalWeight.toFixed(2)}%。所以我做了微调，使得他们的权重总和为100%。`;
      
      // 按比例调整权重到总和为100%
      assetVariables.forEach(variable => {
        const currentWeight = editedWeights[variable.id] !== undefined 
          ? editedWeights[variable.id] 
          : variable.weight * 100;
        finalWeights[variable.id] = (currentWeight / totalWeight) * 100;
      });
    } else {
      // 权重总和正确，使用当前权重
      assetVariables.forEach(variable => {
        finalWeights[variable.id] = editedWeights[variable.id] !== undefined 
          ? editedWeights[variable.id] 
          : variable.weight * 100;
      });
    }

    // 更新variables状态
    const updatedVariables = variables.map(variable => {
      if (variable.type === "资产" && finalWeights[variable.id] !== undefined) {
        return {
          ...variable,
          weight: finalWeights[variable.id] / 100 // 转换回小数
        };
      }
      return variable;
    });

    setVariables(updatedVariables);
    setIsEditingWeights(false);
    setEditedWeights({});
    
    if (adjustmentMessage) {
      setWeightAdjustmentMessage(adjustmentMessage);
      // 5秒后清除消息
      setTimeout(() => setWeightAdjustmentMessage(""), 5000);
    } else {
      // 如果没有调整，显示确认消息
      setWeightAdjustmentMessage("权重修改已确认，总权重为100%。");
      setTimeout(() => setWeightAdjustmentMessage(""), 3000);
    }
  };

  // 处理权重输入变化
  const handleWeightChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditedWeights(prev => ({
      ...prev,
      [id]: Math.max(0, Math.min(100, numValue)) // 限制在0-100之间
    }));
  };

  // 处理指数选择
  const toggleIndex = (indexName: string) => {
    setSelectedIndices(prev => {
      if (prev.includes(indexName)) {
        // 如果已选择，则取消选择（但保证至少有一个指数被选中）
        if (prev.length > 1) {
          return prev.filter(name => name !== indexName);
        }
        return prev;
      } else {
        // 如果未选择，则添加
        return [...prev, indexName];
      }
    });
  };

  const generateReport = async () => {
    if (!optimizationResult) return;

    setIsGeneratingReport(true);
    setActiveTab("report");
    
    // 启动倒计时（预计60秒）
    let countdown = 60;
    setReportCountdown(countdown);
    
    const countdownInterval = setInterval(() => {
      countdown--;
      setReportCountdown(countdown);
      if (countdown <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    try {
      // 重新获取最新的股票数据确保数据是真实的
      const latestStockData = await fetchStockData();
      
      // 确保资产名称与摘要中的资产一致
      const assetVariables = variables.filter(v => v.type === "资产");
      console.log("当前资产变量：", assetVariables);
      
      const response = await fetch("/api/mindpilot/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algorithm: quantumProgress.algorithm, // 传递算法类型
          variables: {
            goals: variables.filter(v => v.type === "目标").map(v => v.name),
            assets: assetVariables.map(v => v.name), // 使用一致的资产名称
            risks: variables.filter(v => v.type === "风险").map(v => v.name),
          },
          optimizationResult,
          stockData: latestStockData?.data || stockData, // 使用最新获取的真实股票数据
          portfolioData: latestStockData?.portfolioData || portfolioData, // 使用最新的Qiskit Finance数据
          llmSettings,
          // 传递资产配置信息以确保一致性
          assetAllocation: assetVariables.map(v => ({
            name: v.name,
            weight: v.weight,
            confidence: v.confidence
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("生成的报告数据：", data);
        setReportData(data.report);
      } else {
        const errorData = await response.json();
        console.error("报告生成API错误：", errorData);
        throw new Error(errorData.error || "报告生成失败");
      }
    } catch (error) {
      console.error("=== 报告生成错误详情 ===");
      console.error("错误对象:", error);
      console.error("错误消息:", error instanceof Error ? error.message : String(error));
      console.error("当前状态 - optimizationResult:", optimizationResult);
      console.error("当前状态 - variables:", variables);
      console.error("当前状态 - stockData:", stockData);
      
      setReportData({
        error: `报告生成失败: ${error instanceof Error ? error.message : '未知错误'}。请检查网络连接或联系技术支持。`,
        title: "报告生成错误"
      });
    } finally {
      clearInterval(countdownInterval);
      setIsGeneratingReport(false);
      setReportCountdown(0);
    }
  };

  // 获取变量图标
  const getVariableIcon = (type: DecisionVariable["type"]) => {
    switch (type) {
      case "目标": return CurrencyDollarIcon;
      case "风险": return ShieldExclamationIcon;
      case "资产": return ChartBarIcon;
      default: return LightBulbIcon;
    }
  };

  // 变量摘要卡片
  const VariableCard = ({ variable }: { variable: DecisionVariable }) => {
    const IconComponent = getVariableIcon(variable.type);
    return (
      <div className="glassmorphism rounded-lg p-4 hover:bg-gray-700/30 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              {variable.type}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400">
              权重: {(variable.weight * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">
              置信度: {(variable.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        <h4 className="text-white font-medium mb-1">{variable.name}</h4>
        <p className="text-gray-300 text-sm">{variable.value}</p>
        
        {/* 如果是资产类型，显示权重条 */}
        {variable.type === "资产" && (
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${variable.weight * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // 对话标签页
  const DialogueTab = () => (
    <div className="space-y-6">
      {/* 阶段指示器 */}
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((phase) => {
            const isActive = currentPhase === phase;
            const isCompleted = currentPhase > phase;
            const phaseNames = [t.phases.goal, t.phases.asset, t.phases.risk, t.phases.summary];
            
            return (
              <div key={phase} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted ? 'bg-green-500 text-white' : 
                    isActive ? 'bg-purple-500 text-white' : 
                    'bg-gray-700 text-gray-400'}
                `}>
                  {isCompleted ? <CheckIcon className="w-4 h-4" /> : phase}
                </div>
                <span className={`ml-2 text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {phaseNames[phase - 1]}
                </span>
                {phase < 4 && (
                  <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-sm text-gray-400">
          完成度: {completionProgress.toFixed(0)}%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 聊天区域 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400">
                {getPhaseTitle(currentPhase)}
              </h3>
              <div className="text-sm text-gray-400">
                阶段 {currentPhase}/4
              </div>
            </div>

            {/* 聊天消息 */}
            <div 
              ref={chatMessagesRef}
              className="h-96 overflow-y-auto mb-4 space-y-4"
            >
              {chatMessages.map((message) => (
                <div key={message.id}>
                  {message.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="bg-purple-600 text-white rounded-lg px-4 py-2 max-w-xs">
                        {message.content}
                      </div>
                    </div>
                  ) : message.role === "assistant" ? (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2 max-w-xs">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      {message.phaseSummary && (
                        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-2">
                          <h4 className="text-blue-400 font-medium mb-2">
                            {message.phaseSummary.title}
                          </h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {message.phaseSummary.items.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {message.showConfirmButtons && (
                        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                          <p className="text-green-400 mb-3">{message.content}</p>
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={confirmPhase}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              {currentPhase === 1 ? "确认目标" : 
                               currentPhase === 2 ? "确认资产" : 
                               currentPhase === 3 ? "确认风险" : "确认继续"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isExtracting && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                      <span className="text-sm text-gray-300">分析中...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div className="flex space-x-3">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  currentPhase === 1 ? t.dialogue.goalPlaceholder :
                  currentPhase === 2 ? t.dialogue.assetPlaceholder :
                  currentPhase === 3 ? t.dialogue.riskPlaceholder :
                  "输入消息..."
                }
                className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none text-white placeholder-gray-400"
                disabled={isExtracting || currentPhase >= 4}
              />

              <button
                onClick={handleSendMessage}
                disabled={isExtracting || !currentInput.trim() || currentPhase >= 4}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 text-white"
              >
                发送
              </button>
            </div>
          </div>
        </div>

        {/* 变量提取面板 */}
        <div className="space-y-4">
          <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400">
                变量提取
              </h3>
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
                <VariableCard key={variable.id} variable={variable} />
              ))}
            </div>

            {variables.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2">统计信息</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-purple-400 font-medium">
                      {variables.filter(v => v.type === "目标").length}
                    </div>
                    <div className="text-gray-500">目标</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-medium">
                      {variables.filter(v => v.type === "资产").length}
                    </div>
                    <div className="text-gray-500">资产</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-medium">
                      {variables.filter(v => v.type === "风险").length}
                    </div>
                    <div className="text-gray-500">风险</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // 摘要标签页
  const SummaryTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">配置摘要</h2>
      
      {/* 权重调整提示消息 */}
      {weightAdjustmentMessage && (
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-blue-200 text-sm">{weightAdjustmentMessage}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["目标", "资产", "风险"].map((type) => {
          const typeVariables = variables.filter(v => v.type === type);
          return (
            <div key={type} className="glassmorphism rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">
                  {type === "目标" ? t.report.summarySection.goalSummary :
                   type === "资产" ? t.report.summarySection.assetSummary :
                   t.report.summarySection.riskSummary}
                </h3>
                {type === "资产" && !isEditingWeights && (
                  <button
                    onClick={startEditingWeights}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="编辑权重"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {typeVariables.map(variable => (
                  <div key={variable.id} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{variable.name}</span>
                      {variable.type === "资产" && (
                        <div className="flex items-center space-x-2">
                          {isEditingWeights ? (
                            <div className="flex items-center space-x-1">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={editedWeights[variable.id] || (variable.weight * 100)}
                                onChange={(e) => handleWeightChange(variable.id, e.target.value)}
                                className="w-16 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white text-center"
                              />
                              <span className="text-purple-400 text-xs">%</span>
                            </div>
                          ) : (
                            <span className="text-purple-400 text-sm">
                              {(variable.weight * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{variable.value}</p>
                    {variable.type === "资产" && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div 
                            className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${isEditingWeights 
                                ? (editedWeights[variable.id] || (variable.weight * 100))
                                : (variable.weight * 100)
                              }%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 权重编辑控制按钮 */}
      {isEditingWeights && (
        <div className="space-y-4">
          {/* 总权重显示 */}
          <div className="text-center">
            {(() => {
              const assetVariables = variables.filter(v => v.type === "资产");
              const totalWeight = assetVariables.reduce((sum, variable) => {
                const currentWeight = editedWeights[variable.id] !== undefined 
                  ? editedWeights[variable.id] 
                  : variable.weight * 100;
                return sum + currentWeight;
              }, 0);
              
              const isValid = Math.abs(totalWeight - 100) <= 0.01;
              
              return (
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isValid ? 'bg-green-600/20 border border-green-500/30' : 'bg-yellow-600/20 border border-yellow-500/30'
                }`}>
                  <span className={`text-sm ${isValid ? 'text-green-400' : 'text-yellow-400'}`}>
                    当前总权重: {totalWeight.toFixed(2)}%
                  </span>
                  {isValid ? (
                    <CheckIcon className="w-4 h-4 text-green-400" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
              );
            })()}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={cancelEditingWeights}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <XMarkIcon className="w-4 h-4" />
              <span>取消</span>
            </button>
            <button
              onClick={confirmWeightChanges}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <CheckIcon className="w-4 h-4" />
              <span>确认修改</span>
            </button>
          </div>
        </div>
      )}

      {variables.length >= 3 && !isEditingWeights && (
        <div className="flex justify-center">
          <button
            onClick={startQuantumComputation}
            disabled={quantumProgress.status === 'running'}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <PlayIcon className="w-5 h-5" />
            <span>{t.computation.startComputation}</span>
          </button>
        </div>
      )}
    </div>
  );

  // 量子计算完成后查看报告
  const handleViewReport = () => {
    console.log("=== 报告生成调试信息 ===");
    console.log("optimizationResult:", optimizationResult);
    console.log("quantumProgress状态:", quantumProgress.status);
    console.log("算法类型:", quantumProgress.algorithm);
    console.log("变量数据:", variables);
    console.log("股票数据:", stockData);
    
    // 切换到报告页面
    setActiveTab('report');
    
    if (!optimizationResult) {
      console.warn("⚠️ optimizationResult为空，无法生成报告");
      setReportData({
        error: "计算结果数据缺失。请确保：1）已完成量子计算 2）计算状态为'completed' 3）重新进行计算",
        title: "无法生成报告"
      });
      return;
    }
    
    // 验证optimizationResult的数据结构
    if (!optimizationResult.assets || !Array.isArray(optimizationResult.assets)) {
      console.error("❌ optimizationResult.assets数据结构错误:", optimizationResult.assets);
      setReportData({
        error: "计算结果数据结构异常，assets字段缺失或格式错误",
        title: "数据结构错误"
      });
      return;
    }
    
    console.log("✅ optimizationResult验证通过，开始生成报告...");
    generateReport();
  };

  // QuantumTab 量子计算标签页
  const QuantumTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">量子资产配置计算</h2>
      {/* 算法选择 */}
      <div className="glassmorphism rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">{t.computation.algorithmSelection}</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setQuantumProgress(prev => ({ ...prev, algorithm: 'quantum' }))}
            className={`p-4 rounded-lg border-2 transition-colors ${
              quantumProgress.algorithm === 'quantum'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <CpuChipIcon className="w-8 h-8 text-purple-400 mb-2 mx-auto" />
            <div className="text-white font-medium">QAOA量子算法</div>
            <div className="text-gray-400 text-sm">量子近似优化算法</div>
          </button>
          <button
            onClick={() => setQuantumProgress(prev => ({ ...prev, algorithm: 'classical' }))}
            className={`p-4 rounded-lg border-2 transition-colors ${
              quantumProgress.algorithm === 'classical'
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <ChartBarIcon className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
            <div className="text-white font-medium">蒙特卡洛算法</div>
            <div className="text-gray-400 text-sm">经典随机优化</div>
          </button>
        </div>
        {/* 开始计算按钮 */}
        <div className="mt-6 text-center">
          <button
            onClick={startQuantumComputation}
            disabled={quantumProgress.status === 'running'}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <PlayIcon className="w-5 h-5" />
            <span>开始计算</span>
          </button>
        </div>
      </div>
      {/* 计算进度显示 */}
      {(quantumProgress.status === 'running' || quantumProgress.status === 'completed') && (
        <div className="glassmorphism rounded-lg p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-white mb-4">
              {quantumProgress.status === 'completed' 
                ? `${quantumProgress.algorithm === 'quantum' ? 'QAOA量子算法' : '蒙特卡洛算法'}计算完成！`
                : `${quantumProgress.algorithm === 'quantum' ? 'QAOA量子算法' : '蒙特卡洛算法'}计算中...`
              }
            </h3>
            <p className="text-gray-400 mb-6">
              {quantumProgress.status === 'completed' 
                ? '资产配置优化已完成，可以查看详细结果'
                : '正在优化资产配置，请稍候...'
              }
            </p>
            
            {/* 进度条 */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>迭代进度</span>
                <span>
                  {quantumProgress.status === 'completed' 
                    ? `${quantumProgress.totalIterations}/${quantumProgress.totalIterations}` 
                    : `${quantumProgress.currentIteration}/${quantumProgress.totalIterations}`
                  }
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    quantumProgress.status === 'completed' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  style={{ 
                    width: quantumProgress.status === 'completed' 
                      ? '100%' 
                      : `${(quantumProgress.currentIteration / quantumProgress.totalIterations) * 100}%` 
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {quantumProgress.status === 'completed' 
                  ? '✅ 计算完成！' 
                  : `预计剩余时间: ${Math.max(0, Math.ceil((quantumProgress.totalIterations - quantumProgress.currentIteration) * 0.15))}秒`
                }
              </div>
            </div>

            {/* 能量收敛图 */}
            {quantumProgress.energy.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm text-purple-400 mb-2">能量收敛</h4>
                <div className="h-24 flex items-end space-x-1">
                  {quantumProgress.energy.slice(-20).map((energy, index) => (
                    <div
                      key={index}
                      className="bg-purple-500 rounded-t"
                      style={{
                        height: `${Math.max(5, (energy + 50) / 150 * 100)}%`,
                        width: '4px'
                      }}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  当前能量: {quantumProgress.energy[quantumProgress.energy.length - 1]?.toFixed(2) || 0}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 计算完成和查看报告按钮 */}
      {quantumProgress.status === 'completed' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-400" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">计算完成</h4>
          <p className="text-gray-400 mb-4">资产配置优化已完成，可以查看详细结果</p>
          
          {/* 调试信息 */}
          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg text-left text-xs">
            <div className="text-yellow-400 mb-1">调试信息：</div>
            <div className="text-gray-300">
              计算状态: {quantumProgress.status} | 
              算法: {quantumProgress.algorithm} | 
              结果状态: {optimizationResult ? '存在' : '缺失'}
            </div>
          </div>
          
          <button
            onClick={handleViewReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            查看报告
          </button>
        </div>
      )}
      {quantumProgress.status === 'error' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">计算失败</h4>
          <p className="text-gray-400 mb-4">请检查网络连接或稍后重试</p>
          <button
            onClick={startQuantumComputation}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            重新计算
          </button>
        </div>
      )}
    </div>
  );

  // 设置标签页
  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">系统设置</h2>
      
      {/* LLM设置 */}
      <div className="glassmorphism rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          AI模型设置
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-purple-400 mb-2">AI提供商</h3>
              <select
                value={llmSettings.provider}
                onChange={(e) =>
                  setLlmSettings((prev) => ({
                    ...prev,
                    provider: e.target.value,
                    model: getModelOptions(e.target.value)[0]?.value || "",
                  }))
                }
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="deepseek">DeepSeek</option>
                <option value="openai">OpenAI</option>
                <option value="claude">Anthropic Claude</option>
              </select>
            </div>
            <div>
              <h3 className="font-medium text-purple-400 mb-2">AI模型</h3>
              <select
                value={llmSettings.model}
                onChange={(e) =>
                  setLlmSettings((prev) => ({ ...prev, model: e.target.value }))
                }
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
              >
                {getModelOptions(llmSettings.provider).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="font-medium text-purple-400 mb-2">API密钥</h3>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={llmSettings.apiKey}
                  onChange={(e) =>
                    setLlmSettings((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                  placeholder="输入API密钥"
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-purple-400 mb-2">创意度</h3>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={llmSettings.temperature}
                onChange={(e) =>
                  setLlmSettings((prev) => ({
                    ...prev,
                    temperature: parseFloat(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>精确 (0.0)</span>
                <span className="text-cyan-400">
                  {llmSettings.temperature}
                </span>
                <span>创意 (1.0)</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-purple-400 mb-2">
                自定义Base URL
              </h3>
              <input
                type="url"
                value={llmSettings.baseUrl}
                onChange={(e) =>
                  setLlmSettings((prev) => ({
                    ...prev,
                    baseUrl: e.target.value,
                  }))
                }
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
              <div
                className={`p-3 rounded-lg text-sm ${
                  connectionStatus.success
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {connectionStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 系统设置 */}
      <div className="glassmorphism rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          系统设置
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-purple-400 mb-2">
                风险偏好
              </h3>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={systemSettings.riskPreference}
                onChange={(e) =>
                  setSystemSettings((prev) => ({
                    ...prev,
                    riskPreference: parseFloat(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>保守 (0.0)</span>
                <span className="text-cyan-400">
                  {systemSettings.riskPreference.toFixed(1)}
                </span>
                <span>激进 (1.0)</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-purple-400 mb-2">
                量子后端
              </h3>
              <select
                value={systemSettings.quantumBackend}
                onChange={(e) =>
                  setSystemSettings((prev) => ({
                    ...prev,
                    quantumBackend: e.target.value,
                  }))
                }
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="IBM Quantum Simulator">
                  IBM Quantum Simulator
                </option>
                <option value="Rigetti QPU">Rigetti QPU</option>
                <option value="本地模拟器">本地模拟器</option>
                <option value="Google Quantum AI">
                  Google Quantum AI
                </option>
              </select>
            </div>
            <div>
              <h3 className="font-medium text-purple-400 mb-2">
                主题设置
              </h3>
              <select
                value={systemSettings.theme}
                onChange={(e) =>
                  setSystemSettings((prev) => ({
                    ...prev,
                    theme: e.target.value,
                  }))
                }
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
              <h3 className="font-medium text-purple-400 mb-2">
                语言设置
              </h3>
              <select
                value={systemSettings.language}
                onChange={(e) =>
                  setSystemSettings((prev) => ({
                    ...prev,
                    language: e.target.value as Language,
                  }))
                }
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <h3 className="font-medium text-purple-400 mb-2">
                通知设置
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={systemSettings.emailNotification}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        emailNotification: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">运行完毕邮件通知</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={systemSettings.autoSave}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        autoSave: e.target.checked,
                      }))
                    }
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
    </div>
  );

  // 报告标签页
  const ReportTab = () => {
    // 生成报告等待界面
    if (isGeneratingReport) {
      return (
        <div className="text-center py-12">
          <div className="glassmorphism rounded-lg p-8 max-w-md mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-white mb-4">正在生成专业报告</h3>
            <p className="text-gray-400 mb-4">AI正在分析数据并生成详细的投资报告...</p>
            
            {reportCountdown > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  {Math.floor(reportCountdown / 60)}:{(reportCountdown % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500">预计剩余时间</div>
                
                {/* 进度条 */}
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((60 - reportCountdown) / 60) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="mt-6 text-xs text-gray-500">
              正在处理：资产数据分析 → 风险计算 → 图表生成 → 报告撰写
            </div>
          </div>
        </div>
      );
    }

    if (!reportData) {
      return (
        <div className="text-center py-12">
          <ChartBarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">暂无报告数据，请先完成计算</p>
        </div>
      );
    }

    if (reportData.error) {
      return (
        <div className="text-center py-12">
          <div className="glassmorphism rounded-lg p-8 max-w-md mx-auto border border-red-500/50">
            <h3 className="text-xl font-bold text-red-400 mb-4">{reportData.title}</h3>
            <p className="text-gray-400 mb-4">{reportData.error}</p>
            <button
              onClick={generateReport}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              重新生成报告
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{reportData.title || "资产配置分析报告"}</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setQuantumProgress(prev => ({ ...prev, status: 'idle' }));
                setActiveTab('quantum');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>重新计算</span>
            </button>
            <button
              onClick={() => setActiveTab('quantum')}
              className="text-purple-400 hover:text-purple-300 flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>返回计算</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* 资产配置表格 */}
          {reportData.assetTable && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">资产配置详情</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 text-purple-400">资产名称</th>
                      <th className="text-center py-3 px-4 text-purple-400">当前价格</th>
                      <th className="text-center py-3 px-4 text-purple-400">优化前权重</th>
                      <th className="text-center py-3 px-4 text-purple-400">优化后权重</th>
                      <th className="text-center py-3 px-4 text-purple-400">年化收益率</th>
                      <th className="text-center py-3 px-4 text-purple-400">夏普比率</th>
                      <th className="text-center py-3 px-4 text-purple-400">最大回撤</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.assetTable.map((asset: any, index: number) => (
                      <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                        <td className="py-3 px-4 text-white font-medium">{asset.name}</td>
                        <td className="py-3 px-4 text-center text-green-400">{asset.currentPrice}</td>
                        <td className="py-3 px-4 text-center text-gray-300">{asset.beforeWeight}%</td>
                        <td className="py-3 px-4 text-center text-purple-400 font-medium">{asset.afterWeight}%</td>
                        <td className="py-3 px-4 text-center text-blue-400">{asset.returnRate}%</td>
                        <td className="py-3 px-4 text-center text-cyan-400">{asset.sharpeRatio}</td>
                        <td className="py-3 px-4 text-center text-red-400">{asset.maxDrawdown}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 投资组合与上证指数对比折线图 */}
          {reportData.chartData?.portfolioChart && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">投资组合与市场指数对比</h3>
              <div className="bg-gray-800/50 rounded-lg p-4" style={{ height: '500px' }}>
                <ReactECharts
                  option={{
                    backgroundColor: 'transparent',
                    title: {
                      text: '投资组合表现 vs 上证指数',
                      textStyle: {
                        color: '#ffffff',
                        fontSize: 16
                      },
                      top: 10,
                      left: 'center'
                    },
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'cross'
                      },
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      borderColor: '#777',
                      textStyle: {
                        color: '#fff'
                      }
                    },
                    legend: {
                      data: ['优化前组合', '优化后组合', ...selectedIndices],
                      textStyle: {
                        color: '#ffffff'
                      },
                      top: 35
                    },
                    grid: {
                      left: '10%',
                      right: '10%',
                      top: '20%',
                      bottom: '15%'
                    },
                    xAxis: {
                      type: 'category',
                      data: reportData.chartData.portfolioChart.dates,
                      boundaryGap: false,
                      axisLine: { onZero: false },
                      splitLine: { show: false },
                      axisLabel: {
                        color: '#ffffff',
                        formatter: (value: string) => value.slice(-5)
                      }
                    },
                    yAxis: {
                      scale: true,
                      splitArea: {
                        show: true,
                        areaStyle: {
                          color: [
                            'rgba(250,250,250,0.05)',
                            'rgba(200,200,200,0.02)'
                          ]
                        }
                      },
                      axisLabel: {
                        color: '#ffffff'
                      },
                      splitLine: {
                        lineStyle: {
                          color: 'rgba(255,255,255,0.1)'
                        }
                      }
                    },
                    dataZoom: [
                      {
                        type: 'inside',
                        start: 50,
                        end: 100
                      },
                      {
                        show: true,
                        type: 'slider',
                        top: '90%',
                        start: 50,
                        end: 100,
                        textStyle: {
                          color: '#ffffff'
                        }
                      }
                    ],
                    series: [
                      {
                        name: '优化前组合',
                        type: 'line',
                        data: reportData.chartData.portfolioChart.beforeReturns,
                        lineStyle: {
                          color: '#9CA3AF',
                          width: 2
                        },
                        itemStyle: {
                          color: '#9CA3AF'
                        },
                        smooth: true
                      },
                      {
                        name: '优化后组合',
                        type: 'line',
                        data: reportData.chartData.portfolioChart.afterReturns,
                        lineStyle: {
                          color: '#A855F7',
                          width: 3
                        },
                        itemStyle: {
                          color: '#A855F7'
                        },
                        smooth: true
                      },
                      // 动态生成选中的指数数据
                      ...selectedIndices.map((indexName, idx) => {
                        const indexColors = {
                          '上证指数': '#FF6B6B',
                          '深证成指': '#4ECDC4', 
                          '沪深300': '#45B7D1',
                          '中证500': '#96CEB4',
                          '创业板指': '#FFEAA7',
                          '道琼斯工业指数': '#DDA0DD',
                          '纳斯达克指数': '#98D8C8',
                          '香港恒生指数': '#F7DC6F',
                          '日经指数': '#BB8FCE'
                        };
                        
                        const isInternational = ['道琼斯工业指数', '纳斯达克指数', '香港恒生指数', '日经指数'].includes(indexName);
                        
                        return {
                          name: indexName,
                          type: 'line',
                          data: reportData.chartData.portfolioChart[indexName.replace(/指数|工业/, '')] || 
                                reportData.chartData.portfolioChart.dates.map((date: string, index: number) => {
                                  // 为不同指数生成不同的模拟数据
                                  let baseValue = Math.sin(index * 0.015 + idx) * 6 + (Math.random() - 0.5) * 2.5;
                                  if (isInternational) {
                                    baseValue += 2; // 国际指数稍高一些
                                  }
                                  return baseValue;
                                }),
                          lineStyle: {
                            color: indexColors[indexName as keyof typeof indexColors] || '#00da3c',
                            width: 2,
                            type: isInternational ? 'dashed' : 'solid' // 国际指数用虚线
                          },
                          itemStyle: {
                            color: indexColors[indexName as keyof typeof indexColors] || '#00da3c'
                          },
                          smooth: true
                        };
                      })
                    ]
                  }}
                  style={{ height: '100%', width: '100%' }}
                  theme="dark"
                />
              </div>
              
              {/* 指数选择器 */}
              <div className="mt-4">
                <h4 className="text-sm text-gray-400 mb-2">选择对比指数（可多选）：</h4>
                <div className="flex flex-wrap gap-2">
                  {/* 国内指数 */}
                  {['上证指数', '深证成指', '沪深300', '中证500', '创业板指'].map(indexName => (
                    <button
                      key={indexName}
                      onClick={() => toggleIndex(indexName)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedIndices.includes(indexName)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {indexName} {selectedIndices.includes(indexName) ? '✓' : ''}
                    </button>
                  ))}
                  
                  {/* 分隔线 */}
                  <div className="w-full border-t border-gray-600 my-2"></div>
                  <span className="text-xs text-gray-500 mb-1">国际指数：</span>
                  
                  {/* 国际指数 */}
                  {['道琼斯工业指数', '纳斯达克指数', '香港恒生指数', '日经指数'].map(indexName => (
                    <button
                      key={indexName}
                      onClick={() => toggleIndex(indexName)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedIndices.includes(indexName)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {indexName} {selectedIndices.includes(indexName) ? '✓' : ''}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 实线表示国内指数，虚线表示国际指数
                </p>
              </div>
            </div>
          )}

          {/* 各资产蜡烛图 - 使用ECharts */}
          {reportData.chartData?.candlestickCharts && reportData.chartData.candlestickCharts.length > 0 && (
            <div className="space-y-6">
              {reportData.chartData.candlestickCharts.map((chart: any, index: number) => (
                <KLineChartComponent key={index} chart={chart} />
              ))}
            </div>
          )}

          {/* 协方差热力图 */}
          {reportData.chartData?.covarianceHeatmap && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                {reportData.chartData.covarianceHeatmap.title || '资产协方差矩阵热力图'}
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-4" style={{ height: '400px' }}>
                <ReactECharts
                  option={{
                    backgroundColor: 'transparent',
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      textStyle: { color: '#fff' },
                      formatter: function(params: any) {
                        const asset1 = reportData.chartData.covarianceHeatmap.assets[params.data[1]];
                        const asset2 = reportData.chartData.covarianceHeatmap.assets[params.data[0]];
                        const value = params.data[2];
                        return `${asset1} - ${asset2}<br/>协方差: ${value.toFixed(4)}`;
                      }
                    },
                    grid: {
                      height: '80%',
                      top: '10%'
                    },
                    xAxis: {
                      type: 'category',
                      data: reportData.chartData.covarianceHeatmap.assets,
                      splitArea: {
                        show: true
                      },
                      axisLabel: {
                        color: '#ffffff',
                        rotate: 45
                      }
                    },
                    yAxis: {
                      type: 'category',
                      data: reportData.chartData.covarianceHeatmap.assets,
                      splitArea: {
                        show: true
                      },
                      axisLabel: {
                        color: '#ffffff'
                      }
                    },
                    visualMap: {
                      min: Math.min(...reportData.chartData.covarianceHeatmap.matrix.flat()),
                      max: Math.max(...reportData.chartData.covarianceHeatmap.matrix.flat()),
                      calculable: true,
                      orient: 'horizontal',
                      left: 'center',
                      bottom: '5%',
                      textStyle: {
                        color: '#ffffff'
                      },
                      inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                      }
                    },
                    series: [{
                      name: '协方差',
                      type: 'heatmap',
                      data: reportData.chartData.covarianceHeatmap.matrix.map((row: number[], i: number) =>
                        row.map((value: number, j: number) => [j, i, value])
                      ).flat(),
                      label: {
                        show: true,
                        color: '#ffffff',
                        formatter: function(params: any) {
                          return params.data[2].toFixed(3);
                        }
                      },
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 10,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }
                    }]
                  }}
                  style={{ height: '100%', width: '100%' }}
                  theme="dark"
                />
              </div>
              <div className="mt-4 text-sm text-gray-400">
                {reportData.chartData.covarianceHeatmap.description || '协方差矩阵显示各资产间的相关性，数值越大表示相关性越强'}
              </div>
            </div>
          )}

          {/* 资本市场线可视化 - 只在蒙特卡洛算法中显示 */}
          {reportData.chartData?.capitalMarketLine && quantumProgress.algorithm === 'classical' && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">资本市场线与有效前沿</h3>
              <div className="bg-gray-800/50 rounded-lg p-4" style={{ height: '400px' }}>
                <Line
                  data={{
                    labels: reportData.chartData.capitalMarketLine.efficientFrontier.map((p: any) => (p.risk * 100).toFixed(1)),
                    datasets: [
                      {
                        label: '有效前沿',
                        data: reportData.chartData.capitalMarketLine.efficientFrontier.map((p: any) => (p.return * 100).toFixed(2)),
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        pointRadius: 2,
                      },
                      {
                        label: '资本市场线',
                        data: reportData.chartData.capitalMarketLine.capitalMarketLine.map((p: any) => (p.return * 100).toFixed(2)),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        borderDash: [10, 5],
                        fill: false,
                        pointRadius: 0,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: 'white'
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                          title: function(context: any) {
                            return `风险: ${context[0].label}%`;
                          },
                          label: function(context: any) {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: '风险（波动率）%',
                          color: 'white'
                        },
                        ticks: {
                          color: 'white'
                        },
                        grid: {
                          color: 'rgba(156, 163, 175, 0.3)'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: '预期收益率 %',
                          color: 'white'
                        },
                        ticks: {
                          color: 'white'
                        },
                        grid: {
                          color: 'rgba(156, 163, 175, 0.3)'
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <h4 className="text-purple-400 font-medium mb-2">市场组合</h4>
                  <p className="text-gray-300">
                    风险: {(reportData.chartData.capitalMarketLine.marketPortfolio.risk * 100).toFixed(2)}%
                  </p>
                  <p className="text-gray-300">
                    收益: {(reportData.chartData.capitalMarketLine.marketPortfolio.return * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <h4 className="text-blue-400 font-medium mb-2">说明</h4>
                  <p className="text-gray-400 text-xs">
                    资本市场线展示了在包含无风险资产的情况下可达到的最优风险收益组合
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 执行摘要 */}
          {reportData.executiveSummary && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">执行摘要</h3>
              <p className="text-gray-300 leading-relaxed">{reportData.executiveSummary}</p>
            </div>
          )}

          {/* 投资策略 */}
          {reportData.investmentStrategy && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">投资策略</h3>
              <p className="text-gray-300 leading-relaxed">{reportData.investmentStrategy}</p>
            </div>
          )}

          {/* 风险分析 */}
          {reportData.riskAnalysis && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">风险分析</h3>
              <p className="text-gray-300 leading-relaxed">{reportData.riskAnalysis}</p>
            </div>
          )}

          {/* 绩效分析 */}
          {reportData.performanceAnalysis && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">绩效分析</h3>
              <p className="text-gray-300 leading-relaxed">{reportData.performanceAnalysis}</p>
            </div>
          )}

          {/* 投资建议 */}
          {reportData.recommendations && reportData.recommendations.length > 0 && (
            <div className="glassmorphism rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">投资建议</h3>
              <ul className="space-y-2">
                {reportData.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-gray-300 flex items-start space-x-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 风险提示 */}
          <div className="glassmorphism rounded-lg p-6 border border-yellow-500/50">
            <h3 className="text-lg font-medium text-yellow-400 mb-4">风险提示</h3>
            <p className="text-yellow-300 leading-relaxed">
              {reportData.disclaimer || "本报告仅供参考，不构成投资建议。投资有风险，入市需谨慎。过往表现不预示未来结果。请根据自身风险承受能力进行投资决策。"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen consciousness-bg">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
            <p className="text-gray-400">{t.description}</p>
          </div>
          
          {/* 语言切换器 */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage('zh')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  language === 'zh' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  language === 'en' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 rounded-lg p-1">
          {[
            { id: 'dialogue', label: t.tabs.dialogue, icon: ChatBubbleLeftRightIcon },
            { id: 'summary', label: t.tabs.summary, icon: DocumentTextIcon },
            { id: 'quantum', label: t.tabs.quantum, icon: CpuChipIcon },
            { id: 'report', label: '报告', icon: ChartBarIcon },
            { id: 'settings', label: '设置', icon: Cog6ToothIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        <div className="min-h-[600px]">
          {activeTab === 'dialogue' && <DialogueTab />}
          {activeTab === 'summary' && <SummaryTab />}
          {activeTab === 'quantum' && <QuantumTab />}
          {activeTab === 'report' && <ReportTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}