"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  CogIcon,
  DocumentArrowUpIcon,
  BookmarkIcon,
  TrashIcon,
  PencilIcon,
  FolderOpenIcon,
  ArrowPathIcon,
  StopIcon,
  PaperAirplaneIcon,
  CircleStackIcon,
  EyeIcon,
  SparklesIcon,
  Squares2X2Icon,
  RectangleStackIcon,
  CommandLineIcon,
  BeakerIcon,
  CubeTransparentIcon,
  ChartBarIcon,
  PlusIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";

// 接口定义
interface Message {
  role: "user" | "assistant";
  content: string;
  formatted_content?: string;
}

interface Settings {
  provider: string;
  apiKey: string;
  modelName: string;
  baseUrl: string;
  temperature: number;
  contextWindow: number;
  streamingResponse: boolean;
}

interface Conversation {
  id: string;
  name: string;
  created_at: string;
  message_count: number;
  chat_history: Message[];
}

interface UploadedFile {
  filename: string;
  file_size: number;
  uploaded_at: string;
  summary?: string;
  mind_map_filename?: string;
}

interface GraphUrls {
  "knowledge-graph": string;
  "thought-chain": string;
  "cognitive-map": string;
  "decision-model": string;
}

export default function AIExplorationHub() {
  // 核心状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("knowledge-graph");

  // 设置状态
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    provider: "deepseek",
    apiKey: "",
    modelName: "deepseek-chat",
    baseUrl: "https://api.deepseek.com/v1",
    temperature: 0.7,
    contextWindow: 4000,
    streamingResponse: false,
  });

  // 对话管理状态
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showSaveLocationModal, setShowSaveLocationModal] = useState(false);
  const [conversationName, setConversationName] = useState("");
  const [renameId, setRenameId] = useState("");
  const [newConversationName, setNewConversationName] = useState("");
  const [saveLocation, setSaveLocation] = useState<"local" | "cloud" | "both">("local");
  const [defaultSaveLocation, setDefaultSaveLocation] = useState<"local" | "cloud" | "both" | null>(null);
  const [pinnedConversations, setPinnedConversations] = useState<string[]>([]);

  // 文件上传状态
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 可视化状态
  const [graphUrls, setGraphUrls] = useState<GraphUrls>({
    "knowledge-graph": "",
    "thought-chain": "",
    "cognitive-map": "",
    "decision-model": "",
  });

  // 布局状态
  const [activeView, setActiveView] = useState<"both" | "chat" | "graph" | "growth" | "settings">("both");
  const [chatHeight, setChatHeight] = useState(50); // 百分比
  
  // 系统设置状态
  const [systemSettings, setSystemSettings] = useState({
    riskPreference: 0.5,
    quantumBackend: "IBM Quantum Simulator",
    language: "zh",
    emailNotification: true,
    autoSave: true,
    theme: "dark",
  });

  // 图谱设置
  const [graphSettings, setGraphSettings] = useState({
    graphType: "2d" as "2d" | "3d",
    timeRange: "all" as "all" | "custom",
    startDate: "",
    endDate: "",
  });

  // 成长对比设置
  const [growthSettings, setGrowthSettings] = useState({
    compareMode: "last" as "last" | "custom",
    customStartDate: "",
    customEndDate: "",
  });

  // 历史图谱数据
  const [historicalGraphs, setHistoricalGraphs] = useState<any[]>([]);

  // 测试连接状态
  const [isTesting, setIsTesting] = useState(false);

  // 通知状态
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    show: boolean;
  }>({ message: "", type: "success", show: false });

  // 引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = useRef(`user_${Math.random().toString(36).substring(2, 9)}`);

  // 初始化加载
  useEffect(() => {
    loadSettings();
    loadConversations();
    loadUploadedFiles();
    loadSavePreferences();
    loadHistoricalGraphs();

    // 添加欢迎消息（延迟添加以确保formatAiResponse函数可用）
    setTimeout(() => {
      const welcomeMessage = "欢迎来到智核交互界面！我是您的AI认知探索伙伴，可以帮您分析问题、构建知识图谱、做出智能决策。请告诉我您想探讨的话题。";
      setMessages([
        {
          role: "assistant",
          content: welcomeMessage,
          formatted_content: formatAiResponse(welcomeMessage),
        },
      ]);
    }, 100);
  }, []);

  // 对话滚动状态
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 智能滚动管理
  useEffect(() => {
    if (messagesEndRef.current && isAutoScrollEnabled) {
      // 查找消息容器
      const scrollContainer = messagesContainerRef.current;
      if (scrollContainer) {
        // 检查用户是否在底部附近（50px内）
        const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 50;
        
        if (isNearBottom) {
          // 使用requestAnimationFrame确保DOM更新完成后再滚动
          requestAnimationFrame(() => {
            scrollContainer.scrollTo({
              top: scrollContainer.scrollHeight,
              behavior: 'smooth'
            });
          });
        }
      }
    }
  }, [messages, isAutoScrollEnabled]);

  // 监听滚动事件
  const handleMessagesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    
    // 如果用户手动滚动到非底部，禁用自动滚动
    if (!isAtBottom && isAutoScrollEnabled) {
      setIsAutoScrollEnabled(false);
      setShowScrollToBottom(true);
    } else if (isAtBottom && !isAutoScrollEnabled) {
      setIsAutoScrollEnabled(true);
      setShowScrollToBottom(false);
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsAutoScrollEnabled(true);
      setShowScrollToBottom(false);
    }
  };

  // 加载设置
  const loadSettings = () => {
    try {
      const savedLlm = localStorage.getItem("mindpulse-llm-settings");
      if (savedLlm) {
        setSettings({ ...settings, ...JSON.parse(savedLlm) });
      }
      
      const savedSystem = localStorage.getItem("mindpulse-system-settings");
      if (savedSystem) {
        setSystemSettings({ ...systemSettings, ...JSON.parse(savedSystem) });
      }
    } catch (error) {
      console.error("加载设置失败:", error);
    }
  };

  // 加载保存偏好设置
  const loadSavePreferences = () => {
    try {
      const savedLocation = localStorage.getItem("mindpulse-save-location");
      if (savedLocation) {
        setDefaultSaveLocation(savedLocation as "local" | "cloud" | "both");
        setSaveLocation(savedLocation as "local" | "cloud" | "both");
      }
      
      const savedPinned = localStorage.getItem("mindpulse-pinned-conversations");
      if (savedPinned) {
        setPinnedConversations(JSON.parse(savedPinned));
      }
    } catch (error) {
      console.error("加载保存偏好失败:", error);
    }
  };

  // 保存设置
  const saveSettings = () => {
    try {
      localStorage.setItem("mindpulse-llm-settings", JSON.stringify(settings));
      showNotification("设置已保存", "success");
    } catch (error) {
      console.error("保存设置失败:", error);
      showNotification("保存设置失败", "error");
    }
  };

  // 保存系统设置
  const saveSystemSettings = () => {
    try {
      localStorage.setItem("mindpulse-system-settings", JSON.stringify(systemSettings));
      showNotification("系统设置已保存", "success");
    } catch (error) {
      console.error("保存系统设置失败:", error);
      showNotification("保存系统设置失败", "error");
    }
  };

  // 测试连接
  const testConnection = async () => {
    if (!settings.apiKey) {
      showNotification("请先配置API密钥", "error");
      return;
    }

    if (!settings.modelName) {
      showNotification("请先选择模型", "error");
      return;
    }

    setIsTesting(true);
    showNotification("正在测试连接...", "success");

    try {
      const response = await fetch("/api/mindpilot/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: settings.provider,
          apiKey: settings.apiKey,
          model: settings.modelName,
          baseUrl: settings.baseUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showNotification(`连接测试成功！模型：${data.details?.model || settings.modelName}`, "success");
      } else {
        const error = await response.json();
        const errorMsg = error.details || error.error || "未知错误";
        showNotification(`连接测试失败：${errorMsg}`, "error");
      }
    } catch (error) {
      console.error("测试连接失败:", error);
      showNotification("连接测试失败，请检查网络和设置", "error");
    } finally {
      setIsTesting(false);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!settings.apiKey) {
      showNotification("请先在设置中配置API密钥", "error");
      setActiveView("settings");
      return;
    }

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/mindpilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          user_id: userId.current,
          model: settings.modelName,
          temperature: settings.temperature,
          stream: settings.streamingResponse,
          provider: settings.provider,
          apiKey: settings.apiKey,
          base_url: settings.baseUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "网络响应异常");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        formatted_content: formatAiResponse(data.response),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 自动生成2D知识图谱
      setTimeout(() => generateGraph("2d"), 1000);
    } catch (error) {
      console.error("发送消息失败:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，处理您的消息时出现了错误。请重试。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载对话列表
  const loadConversations = async () => {
    try {
      let allConversations: Conversation[] = [];

      // 加载云端对话
      try {
        const response = await fetch("/api/mindpilot/conversations");
        if (response.ok) {
          const data = await response.json();
          allConversations = [...(data.conversations || [])];
        }
      } catch (error) {
        console.error("加载云端对话失败:", error);
      }

      // 加载本地对话
      try {
        const localConversations = JSON.parse(localStorage.getItem('mindpulse-local-conversations') || '[]');
        allConversations = [...allConversations, ...localConversations];
      } catch (error) {
        console.error("加载本地对话失败:", error);
      }

      // 按创建时间排序
      allConversations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setConversations(allConversations);
    } catch (error) {
      console.error("加载对话列表失败:", error);
    }
  };

  // 自动生成对话名称
  const generateConversationName = () => {
    const firstUserMessage = messages.find(msg => msg.role === "user")?.content || "";
    
    // 提取对话内容关键词
    let summary = "";
    if (firstUserMessage) {
      // 去除标点符号，提取主要内容
      const cleanContent = firstUserMessage.replace(/[，。！？；：""''（）【】\s]/g, '');
      summary = cleanContent.length > 15 
        ? cleanContent.substring(0, 15) + "..." 
        : cleanContent || "新对话";
    } else {
      summary = "新对话";
    }
    
    // 生成简化时间戳：月日时分
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${month}${day}${hour}${minute}`;
    
    return `${summary}_${timestamp}`;
  };

  // 保存到本地文件系统
  const saveToLocalFile = async (name: string, data: any) => {
    try {
      // 创建文件内容
      const fileContent = JSON.stringify({
        name,
        timestamp: new Date().toISOString(),
        messages: data.chat_history,
        user_id: data.user_id
      }, null, 2);

      // 创建下载链接
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // 创建隐藏的下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 同时保存到 localStorage 以便重启后加载
      const localConversations = JSON.parse(localStorage.getItem('mindpulse-local-conversations') || '[]');
      localConversations.push({
        id: `local_${Date.now()}`,
        name,
        created_at: new Date().toISOString(),
        message_count: data.chat_history.length,
        chat_history: data.chat_history,
        save_location: 'local'
      });
      localStorage.setItem('mindpulse-local-conversations', JSON.stringify(localConversations));

      return true;
    } catch (error) {
      console.error('保存到本地文件失败:', error);
      return false;
    }
  };

  // 保存当前对话
  const saveConversation = async () => {
    // 首次保存需要选择保存位置
    if (defaultSaveLocation === null) {
      setShowSaveLocationModal(true);
      return;
    }

    const finalName = conversationName.trim() || generateConversationName();
    const conversationData = {
      name: finalName,
      chat_history: messages,
      user_id: userId.current,
      save_location: saveLocation,
    };

    try {
      let success = false;

      // 根据保存位置执行不同的保存逻辑
      if (saveLocation === 'local') {
        success = await saveToLocalFile(finalName, conversationData);
        if (success) {
          showNotification("对话已保存到本地文件", "success");
        }
      } else if (saveLocation === 'cloud') {
        const response = await fetch("/api/mindpilot/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conversationData),
        });
        success = response.ok;
        if (success) {
          showNotification("对话已保存到云端", "success");
        }
      } else if (saveLocation === 'both') {
        // 同时保存到本地和云端
        const localSuccess = await saveToLocalFile(finalName, conversationData);
        const response = await fetch("/api/mindpilot/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conversationData),
        });
        const cloudSuccess = response.ok;
        
        if (localSuccess && cloudSuccess) {
          showNotification("对话已保存到本地和云端", "success");
          success = true;
        } else if (localSuccess) {
          showNotification("对话已保存到本地，云端保存失败", "error");
          success = true;
        } else if (cloudSuccess) {
          showNotification("对话已保存到云端，本地保存失败", "error");
          success = true;
        }
      }

      if (success) {
        setShowSaveModal(false);
        setConversationName("");
        loadConversations();
      } else {
        throw new Error("保存失败");
      }
    } catch (error) {
      console.error("保存对话失败:", error);
      showNotification("保存对话失败", "error");
    }
  };

  // 确认保存位置并保存
  const confirmSaveLocation = () => {
    localStorage.setItem("mindpulse-save-location", saveLocation);
    setDefaultSaveLocation(saveLocation);
    setShowSaveLocationModal(false);
    setShowSaveModal(true);
    setConversationName(generateConversationName());
  };

  // 加载历史对话
  const loadConversation = async (conversationId: string) => {
    try {
      // 检查是否是本地对话
      if (conversationId.startsWith('local_')) {
        const localConversations = JSON.parse(localStorage.getItem('mindpulse-local-conversations') || '[]');
        const conversation = localConversations.find((conv: Conversation) => conv.id === conversationId);
        if (conversation) {
          // 对历史消息应用格式化
          const formattedMessages = (conversation.chat_history || []).map((msg: Message) => ({
            ...msg,
            formatted_content: msg.role === 'assistant' ? formatAiResponse(msg.content) : msg.content
          }));
          setMessages(formattedMessages);
          showNotification("本地对话已加载", "success");
          return;
        }
      }

      // 加载云端对话
      const response = await fetch(
        `/api/mindpilot/conversations?id=${conversationId}`
      );
      if (response.ok) {
        const data = await response.json();
        // 对历史消息应用格式化
        const formattedMessages = (data.chat_history || []).map((msg: Message) => ({
          ...msg,
          formatted_content: msg.role === 'assistant' ? formatAiResponse(msg.content) : msg.content
        }));
        setMessages(formattedMessages);
        showNotification("对话已加载", "success");
      }
    } catch (error) {
      console.error("加载对话失败:", error);
      showNotification("加载对话失败", "error");
    }
  };

  // 置顶/取消置顶对话
  const togglePinConversation = (conversationId: string) => {
    const newPinned = pinnedConversations.includes(conversationId)
      ? pinnedConversations.filter(id => id !== conversationId)
      : [...pinnedConversations, conversationId];
    
    setPinnedConversations(newPinned);
    localStorage.setItem("mindpulse-pinned-conversations", JSON.stringify(newPinned));
    showNotification(
      pinnedConversations.includes(conversationId) ? "已取消置顶" : "已置顶对话", 
      "success"
    );
  };

  // 删除对话
  const deleteConversation = async (conversationId: string) => {
    if (!confirm("确定要删除这个对话吗？")) return;

    try {
      // 检查是否是本地对话
      if (conversationId.startsWith('local_')) {
        const localConversations = JSON.parse(localStorage.getItem('mindpulse-local-conversations') || '[]');
        const filteredConversations = localConversations.filter((conv: Conversation) => conv.id !== conversationId);
        localStorage.setItem('mindpulse-local-conversations', JSON.stringify(filteredConversations));
        showNotification("本地对话已删除", "success");
      } else {
        // 删除云端对话
        const response = await fetch(`/api/mindpilot/conversations`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: conversationId }),
        });

        if (response.ok) {
          showNotification("对话已删除", "success");
        } else {
          throw new Error("删除云端对话失败");
        }
      }

      // 同时从置顶列表中移除
      const newPinned = pinnedConversations.filter(id => id !== conversationId);
      setPinnedConversations(newPinned);
      localStorage.setItem("mindpulse-pinned-conversations", JSON.stringify(newPinned));
      loadConversations();
    } catch (error) {
      console.error("删除对话失败:", error);
      showNotification("删除对话失败", "error");
    }
  };

  // 新建对话
  const newConversation = () => {
    const welcomeMessage = "欢迎来到智核交互界面！我是您的AI认知探索伙伴，可以帮您分析问题、构建知识图谱、做出智能决策。请告诉我您想探讨的话题。";
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
        formatted_content: formatAiResponse(welcomeMessage),
      },
    ]);
  };

  // 生成图谱
  const generateGraph = async (graphType: string = "2d") => {
    if (messages.length === 0) return;

    try {
      // 收集所有历史对话消息（过去6个月）
      let allMessages = [...messages];
      
      // 获取本地对话历史
      try {
        const localConversations = JSON.parse(localStorage.getItem('mindpulse-local-conversations') || '[]');
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        localConversations.forEach((conv: any) => {
          if (new Date(conv.created_at) >= sixMonthsAgo && conv.chat_history) {
            allMessages = [...allMessages, ...conv.chat_history];
          }
        });
      } catch (error) {
        console.log("获取本地对话历史失败:", error);
      }

      // 获取云端对话历史
      try {
        const response = await fetch("/api/mindpilot/conversations");
        if (response.ok) {
          const data = await response.json();
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          
          data.conversations?.forEach((conv: any) => {
            if (new Date(conv.created_at) >= sixMonthsAgo && conv.chat_history) {
              allMessages = [...allMessages, ...conv.chat_history];
            }
          });
        }
      } catch (error) {
        console.log("获取云端对话历史失败:", error);
      }

      // 根据时间范围筛选消息
      let filteredMessages = allMessages;
      if (graphSettings.timeRange === "custom" && graphSettings.startDate && graphSettings.endDate) {
        // 这里可以根据消息的时间戳进行筛选
        // 简化实现，使用所有消息
      }

      console.log(`准备生成${graphType.toUpperCase()}图谱，处理${filteredMessages.length}条消息`);

      const response = await fetch("/api/mindpilot/generate-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: filteredMessages,
          graph_type: graphType,
          user_id: userId.current,
          time_range: graphSettings.timeRange === "custom" ? {
            start: graphSettings.startDate,
            end: graphSettings.endDate,
          } : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("图谱生成成功:", data);
        
        // 更新对应的图谱类型
        if (graphType === "2d") {
          setGraphUrls((prev) => ({
            ...prev,
            "knowledge-graph": data.graph_url,
          }));
        } else if (graphType === "3d") {
          setGraphUrls((prev) => ({
            ...prev,
            "cognitive-map": data.graph_url,
          }));
        }

        // 保存历史图谱数据用于成长对比
        const newGraphData = {
          ...data.graph_data,
          timestamp: new Date().toISOString(),
          type: graphType,
        };
        
        setHistoricalGraphs(prev => {
          const updated = [...prev, newGraphData];
          // 持久化到localStorage
          try {
            localStorage.setItem("mindpulse-historical-graphs", JSON.stringify(updated));
          } catch (error) {
            console.error("保存历史图谱数据失败:", error);
          }
          return updated;
        });

        showNotification(`${graphType.toUpperCase()}图谱已生成，处理了${data.messages_processed}条消息`, "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成图谱失败");
      }
    } catch (error) {
      console.error("生成图谱失败:", error);
      showNotification("生成图谱失败: " + (error as Error).message, "error");
    }
  };

  // 文件上传处理
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId.current);

    try {
      const response = await fetch("/api/mindpilot/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFiles((prev) => [...prev, data.file_info]);
        showNotification("文件上传成功", "success");

        // 添加文件摘要到对话
        if (data.summary) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `文件 "${file.name}" 已上传。文件摘要：\n\n${data.summary}`,
            },
          ]);
        }
      } else {
        throw new Error("上传失败");
      }
    } catch (error) {
      console.error("文件上传失败:", error);
      showNotification("文件上传失败", "error");
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  // 加载已上传文件
  const loadUploadedFiles = async () => {
    try {
      const response = await fetch(
        `/api/mindpilot/files?user_id=${userId.current}`
      );
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.files || []);
      }
    } catch (error) {
      console.error("加载文件列表失败:", error);
    }
  };

  // 加载历史图谱数据
  const loadHistoricalGraphs = () => {
    try {
      const savedGraphs = localStorage.getItem("mindpulse-historical-graphs");
      if (savedGraphs) {
        setHistoricalGraphs(JSON.parse(savedGraphs));
      }
    } catch (error) {
      console.error("加载历史图谱数据失败:", error);
    }
  };

  // 显示通知
  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    console.log(`${type}: ${message}`);
    setNotification({ message, type, show: true });
    
    // 3秒后自动隐藏
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // 格式化大模型回复内容
  const formatAiResponse = (content: string): string => {
    if (!content) return content;

    // 1. 首先处理代码块，避免被误处理
    const codeBlocks: string[] = [];
    let processedContent = content.replace(/```[\s\S]*?```/g, (match) => {
      codeBlocks.push(match);
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    // 2. 处理行内代码
    const inlineCodes: string[] = [];
    processedContent = processedContent.replace(/`[^`]+`/g, (match) => {
      inlineCodes.push(match);
      return `__INLINE_CODE_${inlineCodes.length - 1}__`;
    });

    // 3. 按句号、问号、感叹号等标点符号和换行符分段
    const sentences = processedContent
      .split(/([。！？；\n]{1,2})/)
      .filter(part => part.trim() !== '');

    // 4. 重新组合段落，每2-3个句子为一段
    const formattedParagraphs: string[] = [];
    let currentParagraph = '';
    let sentenceCount = 0;

    for (let i = 0; i < sentences.length; i++) {
      const part = sentences[i].trim();
      
      if (!part) continue;

      // 如果是标点符号
      if (/^[。！？；\n]+$/.test(part)) {
        currentParagraph += part;
        sentenceCount++;
        
        // 每2-3个句子或遇到换行符就分段
        if (sentenceCount >= 2 || part.includes('\n')) {
          if (currentParagraph.trim()) {
            formattedParagraphs.push(currentParagraph.trim());
          }
          currentParagraph = '';
          sentenceCount = 0;
        }
      } else {
        // 如果当前段落已经很长，先结束当前段落
        if (currentParagraph.length > 120) {
          if (currentParagraph.trim()) {
            formattedParagraphs.push(currentParagraph.trim());
          }
          currentParagraph = part;
          sentenceCount = 0;
        } else {
          currentParagraph += part;
        }
      }
    }

    // 添加最后一段
    if (currentParagraph.trim()) {
      formattedParagraphs.push(currentParagraph.trim());
    }

    // 5. 处理特殊格式：数字列表、要点等
    const finalParagraphs = formattedParagraphs.map(paragraph => {
      // 检测数字列表 (1. 2. 3. 等)
      if (/^\d+[\.、]\s/.test(paragraph)) {
        return `<div class="mb-2 pl-4 border-l-2 border-cyan-400/30">${paragraph}</div>`;
      }
      
      // 检测项目符号列表 (- * • 等)
      if (/^[-*•]\s/.test(paragraph)) {
        return `<div class="mb-2 pl-4 border-l-2 border-purple-400/30">${paragraph}</div>`;
      }
      
      // 检测标题格式 (## ### 等)
      if (/^#{1,6}\s/.test(paragraph)) {
        const level = paragraph.match(/^(#{1,6})/)?.[1].length || 1;
        const title = paragraph.replace(/^#{1,6}\s/, '');
        return `<h${Math.min(level + 1, 6)} class="text-lg font-semibold text-cyan-400 mt-4 mb-2">${title}</h${Math.min(level + 1, 6)}>`;
      }
      
      // 普通段落
      return `<p class="mb-3 leading-relaxed">${paragraph}</p>`;
    });

    // 6. 恢复代码块和行内代码
    let result = finalParagraphs.join('');
    
    // 恢复行内代码
    inlineCodes.forEach((code, index) => {
      result = result.replace(`__INLINE_CODE_${index}__`, 
        `<code class="bg-gray-700/50 px-2 py-1 rounded text-cyan-300 text-sm">${code.slice(1, -1)}</code>`);
    });
    
    // 恢复代码块
    codeBlocks.forEach((code, index) => {
      const lang = code.match(/```(\w+)/)?.[1] || '';
      const codeContent = code.replace(/```\w*\n?/, '').replace(/```$/, '');
      result = result.replace(`__CODE_BLOCK_${index}__`, 
        `<pre class="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4 mt-4 mb-4 overflow-x-auto"><code class="text-green-300 text-sm">${codeContent}</code></pre>`);
    });

    return result;
  };

  // 生成成长对比分析
  const generateGrowthAnalysis = async () => {
    if (historicalGraphs.length < 2) {
      showNotification("需要至少2个图谱才能进行对比分析", "error");
      return;
    }

    try {
      showNotification("正在分析知识成长...", "success");

      // 获取最新的两个图谱进行对比
      const latestGraph = historicalGraphs[historicalGraphs.length - 1];
      const previousGraph = growthSettings.compareMode === "last" 
        ? historicalGraphs[historicalGraphs.length - 2]
        : historicalGraphs.find(graph => {
            if (!growthSettings.customStartDate || !growthSettings.customEndDate) return false;
            const graphDate = new Date(graph.timestamp);
            const startDate = new Date(growthSettings.customStartDate);
            const endDate = new Date(growthSettings.customEndDate);
            return graphDate >= startDate && graphDate <= endDate;
          }) || historicalGraphs[historicalGraphs.length - 2];

      // 计算成长指标
      const nodeGrowth = (latestGraph.metadata?.node_count || 0) - (previousGraph.metadata?.node_count || 0);
      const edgeGrowth = (latestGraph.metadata?.edge_count || 0) - (previousGraph.metadata?.edge_count || 0);
      const complexityGrowth = nodeGrowth + edgeGrowth;

      // 生成分析报告
      const analysisPrompt = `请基于以下知识图谱数据生成一份详细的成长对比分析报告：

当前图谱数据：
- 节点数量：${latestGraph.metadata?.node_count || 0}
- 边数量：${latestGraph.metadata?.edge_count || 0}
- 生成时间：${new Date(latestGraph.timestamp).toLocaleString()}

对比图谱数据：
- 节点数量：${previousGraph.metadata?.node_count || 0}
- 边数量：${previousGraph.metadata?.edge_count || 0}
- 生成时间：${new Date(previousGraph.timestamp).toLocaleString()}

变化情况：
- 节点增长：${nodeGrowth > 0 ? '+' : ''}${nodeGrowth}
- 边增长：${edgeGrowth > 0 ? '+' : ''}${edgeGrowth}
- 复杂度变化：${complexityGrowth > 0 ? '提升' : complexityGrowth < 0 ? '简化' : '保持稳定'}

请从以下几个维度进行分析：
1. 知识结构的变化和发展
2. 学习深度和广度的变化
3. 知识连接性的改善
4. 认知能力的提升
5. 未来学习建议

请用中文回答，并提供具体的洞察和建议。`;

      // 调用AI进行分析
      const response = await fetch("/api/mindpilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: analysisPrompt,
          user_id: userId.current,
          model: settings.modelName,
          temperature: 0.7,
          stream: false,
          provider: settings.provider,
          apiKey: settings.apiKey,
          base_url: settings.baseUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("分析请求失败");
      }

      const data = await response.json();
      
      // 将分析结果添加到消息中
      const analysisMessage: Message = {
        role: "assistant",
        content: data.response,
        formatted_content: formatAiResponse(data.response),
      };

      setMessages((prev) => [...prev, {
        role: "user",
        content: "请为我生成知识成长对比分析报告"
      }, analysisMessage]);

      showNotification("成长对比分析已生成", "success");
    } catch (error) {
      console.error("生成成长分析失败:", error);
      showNotification("生成分析失败: " + (error as Error).message, "error");
    }
  };

  // 获取标签图标
  const getTabIcon = (tabName: string) => {
    const icons = {
      "knowledge-graph": CircleStackIcon,
      "thought-chain": CommandLineIcon,
      "cognitive-map": BeakerIcon,
      "decision-model": CubeTransparentIcon,
    };
    return icons[tabName as keyof typeof icons] || ChartBarIcon;
  };

  // 获取模型选项
  const getModelOptions = (provider: string) => {
    const modelMap = {
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
        { value: "claude-3-opus", label: "Claude 3 Opus" },
        { value: "claude-3-haiku", label: "Claude 3 Haiku" },
      ],
      gemini: [{ value: "gemini-pro", label: "Gemini Pro" }],
      tongyi: [
        { value: "qwen-max", label: "通义千问 Max" },
        { value: "qwen-plus", label: "通义千问 Plus" },
      ],
    };
    return modelMap[provider as keyof typeof modelMap] || [];
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* 顶部导航栏 */}
      <div className="h-16 bg-gray-800/50 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between px-6">
        {/* 左侧标题 */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              智核交互
            </h1>
            <p className="text-xs text-gray-400">AI Core Interface</p>
          </div>
        </div>

        {/* 中间导航标签 */}
        <nav className="flex items-center space-x-1">
          {[
            { id: "both", label: "双栏", icon: Squares2X2Icon },
            { id: "chat", label: "对话", icon: ChatBubbleLeftRightIcon },
            { id: "graph", label: "图谱", icon: RectangleStackIcon },
            { id: "growth", label: "成长", icon: AcademicCapIcon },
            { id: "settings", label: "设置", icon: Cog6ToothIcon },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={clsx(
                "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                activeView === id
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400"
                  : "bg-gray-700/30 hover:bg-gray-600/30 text-gray-400 hover:text-white",
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>

        {/* 右侧设置按钮 */}
        <button
          onClick={() => setActiveView("settings")}
          className={clsx(
            "p-2 rounded-lg transition-colors",
            activeView === "settings"
              ? "bg-cyan-500/20 text-cyan-400"
              : "hover:bg-gray-700/50 text-gray-400 hover:text-white"
          )}
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* 左侧对话历史栏 */}
        <div className="w-80 bg-gray-800/30 backdrop-blur-xl border-r border-gray-700/50 flex flex-col">
          {/* 新建对话按钮 */}
          <div className="p-4 border-b border-gray-700/50">
            <button
              onClick={newConversation}
              className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">新建对话</span>
            </button>
          </div>

          {/* 对话列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {[...conversations]
              .sort((a, b) => {
                // 置顶对话优先显示
                const aIsPinned = pinnedConversations.includes(a.id);
                const bIsPinned = pinnedConversations.includes(b.id);
                
                if (aIsPinned && !bIsPinned) return -1;
                if (!aIsPinned && bIsPinned) return 1;
                
                // 然后按创建时间排序
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              })
              .map((conv) => {
                const isPinned = pinnedConversations.includes(conv.id);
                return (
                  <div
                    key={conv.id}
                    className={`group rounded-lg p-3 transition-all cursor-pointer ${
                      isPinned 
                        ? "bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20" 
                        : "bg-gray-700/30 hover:bg-gray-600/30"
                    }`}
                    onClick={() => loadConversation(conv.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {isPinned && (
                          <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
                        )}
                        <h5 className="text-sm font-medium text-white truncate">
                          {conv.name}
                        </h5>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinConversation(conv.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            isPinned 
                              ? "bg-cyan-500/20 text-cyan-400" 
                              : "hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400"
                          }`}
                          title={isPinned ? "取消置顶" : "置顶对话"}
                        >
                          <BookmarkIcon className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameId(conv.id);
                            setNewConversationName(conv.name);
                            setShowRenameModal(true);
                          }}
                          className="p-1 hover:bg-yellow-500/20 rounded text-yellow-400"
                          title="重命名"
                        >
                          <PencilIcon className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conv.id);
                          }}
                          className="p-1 hover:bg-red-500/20 rounded text-red-400"
                          title="删除"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {conv.message_count} 条消息 • {new Date(conv.created_at).toLocaleDateString()}
                      {isPinned && <span className="ml-2 text-cyan-400">• 已置顶</span>}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* 底部功能按钮 */}
          <div className="p-4 border-t border-gray-700/50 space-y-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all text-sm"
            >
              <BookmarkIcon className="w-4 h-4" />
              <span>保存对话</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all text-sm"
            >
              <DocumentArrowUpIcon className="w-4 h-4" />
              <span>上传文件</span>
              {isUploading && (
                <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>
        </div>

        {/* 主工作区 */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* 设置页面 */}
          {activeView === "settings" && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* 大模型设置 */}
                <div className="glassmorphism rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-cyan-400 mb-6">大模型设置</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">模型提供商</h3>
                        <select
                          value={settings.provider}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              provider: e.target.value,
                            }))
                          }
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
                        <h3 className="font-medium text-purple-400 mb-2">模型选择</h3>
                        <select
                          value={settings.modelName}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              modelName: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                        >
                          {getModelOptions(settings.provider).map((model) => (
                            <option key={model.value} value={model.value}>
                              {model.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">API密钥</h3>
                        <input
                          type="password"
                          value={settings.apiKey}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              apiKey: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                          placeholder="输入API密钥"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">
                          温度设置 ({settings.temperature})
                        </h3>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={settings.temperature}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              temperature: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">基础URL</h3>
                        <input
                          type="text"
                          value={settings.baseUrl}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              baseUrl: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                          placeholder="可选，自定义API地址"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="streaming"
                          checked={settings.streamingResponse}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              streamingResponse: e.target.checked,
                            }))
                          }
                          className="w-4 h-4"
                        />
                        <label htmlFor="streaming" className="text-sm text-gray-300">
                          流式响应
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={testConnection}
                      disabled={isTesting}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 disabled:from-gray-500 disabled:to-gray-600 rounded-lg font-medium transition-all flex items-center space-x-2"
                    >
                      {isTesting && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <span>{isTesting ? "测试中..." : "测试连接"}</span>
                    </button>
                    <button
                      onClick={saveSettings}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-medium transition-all"
                    >
                      保存设置
                    </button>
                  </div>
                </div>

                {/* 系统设置 */}
                <div className="glassmorphism rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-cyan-400 mb-6">系统设置</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">
                          风险偏好 ({systemSettings.riskPreference.toFixed(1)})
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
                          <span>保守</span>
                          <span>激进</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">语言设置</h3>
                        <select
                          value={systemSettings.language}
                          onChange={(e) =>
                            setSystemSettings((prev) => ({
                              ...prev,
                              language: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2"
                        >
                          <option value="zh">中文</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">主题设置</h3>
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
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="emailNotification"
                            checked={systemSettings.emailNotification}
                            onChange={(e) =>
                              setSystemSettings((prev) => ({
                                ...prev,
                                emailNotification: e.target.checked,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          <label htmlFor="emailNotification" className="text-sm text-gray-300">
                            邮件通知
                          </label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="autoSave"
                            checked={systemSettings.autoSave}
                            onChange={(e) =>
                              setSystemSettings((prev) => ({
                                ...prev,
                                autoSave: e.target.checked,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          <label htmlFor="autoSave" className="text-sm text-gray-300">
                            自动保存
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={saveSystemSettings}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-medium transition-all"
                    >
                      保存系统设置
                    </button>
                  </div>
                </div>

                {/* 数据管理 */}
                <div className="glassmorphism rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-cyan-400 mb-6">数据管理</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">对话数据</h3>
                        <p className="text-sm text-gray-400 mb-3">
                          当前共有 {conversations.length} 个对话记录
                        </p>
                        <button className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm transition-colors">
                          导出对话数据
                        </button>
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">图谱数据</h3>
                        <p className="text-sm text-gray-400 mb-3">
                          当前共有 {historicalGraphs.length} 个图谱记录
                        </p>
                        <button className="w-full px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-sm transition-colors">
                          导出图谱数据
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">清理数据</h3>
                        <p className="text-sm text-gray-400 mb-3">
                          清理超过30天的临时数据
                        </p>
                        <button className="w-full px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-lg text-sm transition-colors">
                          清理临时文件
                        </button>
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-400 mb-2">重置数据</h3>
                        <p className="text-sm text-gray-400 mb-3">
                          删除所有本地数据（不可恢复）
                        </p>
                        <button 
                          onClick={() => {
                            if (confirm("确定要重置所有数据吗？此操作不可恢复。")) {
                              localStorage.clear();
                              window.location.reload();
                            }
                          }}
                          className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-sm transition-colors"
                        >
                          重置所有数据
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 成长页面 */}
          {activeView === "growth" && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* 成长控制栏 */}
                <div className="glassmorphism rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-cyan-400">知识成长对比</h2>
                    <div className="flex items-center space-x-4">
                      {/* 对比模式选择 */}
                      <select
                        value={growthSettings.compareMode}
                        onChange={(e) => setGrowthSettings(prev => ({ ...prev, compareMode: e.target.value as "last" | "custom" }))}
                        className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="last">与上次对话对比</option>
                        <option value="custom">自定义时间段对比</option>
                      </select>
                      
                      {/* 自定义时间范围 */}
                      {growthSettings.compareMode === "custom" && (
                        <>
                          <input
                            type="date"
                            value={growthSettings.customStartDate}
                            onChange={(e) => setGrowthSettings(prev => ({ ...prev, customStartDate: e.target.value }))}
                            className="bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-sm"
                            placeholder="开始日期"
                          />
                          <span className="text-gray-400">至</span>
                          <input
                            type="date"
                            value={growthSettings.customEndDate}
                            onChange={(e) => setGrowthSettings(prev => ({ ...prev, customEndDate: e.target.value }))}
                            className="bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-sm"
                            placeholder="结束日期"
                          />
                        </>
                      )}
                      
                      <button
                        onClick={generateGrowthAnalysis}
                        disabled={historicalGraphs.length < 2}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 rounded-lg text-sm font-medium transition-all"
                      >
                        生成对比分析
                      </button>
                    </div>
                  </div>
                </div>

                {/* 成长统计 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glassmorphism rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-400">对话数量</h3>
                      <div className="text-2xl">💬</div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{conversations.length}</div>
                    <div className="text-sm text-gray-400">
                      {conversations.length > 0 ? `较上次增长 ${Math.max(0, conversations.length - 1)} 个` : "开始你的第一次对话"}
                    </div>
                  </div>

                  <div className="glassmorphism rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-400">知识节点</h3>
                      <div className="text-2xl">🧠</div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {historicalGraphs.reduce((acc, graph) => acc + (graph.metadata?.node_count || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-400">
                      总计知识节点数量
                    </div>
                  </div>

                  <div className="glassmorphism rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-400">图谱生成</h3>
                      <div className="text-2xl">📊</div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{historicalGraphs.length}</div>
                    <div className="text-sm text-gray-400">
                      已生成图谱数量
                    </div>
                  </div>
                </div>

                {/* 成长趋势图 */}
                <div className="glassmorphism rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-400 mb-6">知识成长趋势</h3>
                  {historicalGraphs.length >= 2 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 当前图谱 */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-purple-400">当前知识图谱</h4>
                        {historicalGraphs.length > 0 && (
                          <div className="bg-gray-900/50 rounded-xl p-4 aspect-square">
                            <iframe
                              src={historicalGraphs[historicalGraphs.length - 1]?.graph_url || ""}
                              title="当前知识图谱"
                              className="w-full h-full border-0 rounded-lg"
                              style={{ minHeight: '400px' }}
                            />
                          </div>
                        )}
                        <div className="text-sm text-gray-400">
                          节点数: {historicalGraphs[historicalGraphs.length - 1]?.metadata?.node_count || 0}
                        </div>
                      </div>

                      {/* 对比图谱 */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-purple-400">
                          {growthSettings.compareMode === "last" ? "上次知识图谱" : "对比期间图谱"}
                        </h4>
                        {historicalGraphs.length > 1 && (
                          <div className="bg-gray-900/50 rounded-xl p-4 aspect-square">
                            <iframe
                              src={historicalGraphs[historicalGraphs.length - 2]?.graph_url || ""}
                              title="对比知识图谱"
                              className="w-full h-full border-0 rounded-lg"
                              style={{ minHeight: '400px' }}
                            />
                          </div>
                        )}
                        <div className="text-sm text-gray-400">
                          节点数: {historicalGraphs[historicalGraphs.length - 2]?.metadata?.node_count || 0}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📈</div>
                      <h4 className="text-lg font-medium text-gray-300 mb-2">
                        等待更多数据
                      </h4>
                      <p className="text-gray-500">
                        需要至少2个图谱才能进行成长对比分析
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        继续对话以生成更多知识图谱
                      </p>
                    </div>
                  )}
                </div>

                {/* 成长洞察 */}
                {historicalGraphs.length >= 2 && (
                  <div className="glassmorphism rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-cyan-400 mb-6">成长洞察</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-300">
                            知识节点增长: +{Math.max(0, 
                              (historicalGraphs[historicalGraphs.length - 1]?.metadata?.node_count || 0) - 
                              (historicalGraphs[historicalGraphs.length - 2]?.metadata?.node_count || 0)
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-300">
                            连接关系增长: +{Math.max(0,
                              (historicalGraphs[historicalGraphs.length - 1]?.metadata?.edge_count || 0) - 
                              (historicalGraphs[historicalGraphs.length - 2]?.metadata?.edge_count || 0)
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-300">
                            图谱复杂度提升
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                          <span className="text-sm text-gray-300">
                            知识结构优化
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 对话和图谱区域 */}
          {(activeView === "both" || activeView === "chat" || activeView === "graph") && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* 对话区域 */}
              {(activeView === "both" || activeView === "chat") && (
                <div
                  className="bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50 flex flex-col min-h-0"
                  style={{
                    height: activeView === "chat" ? "100%" : `${chatHeight}%`,
                    minHeight: activeView === "both" ? "300px" : "auto",
                  }}
                >
                  {/* 消息区域 */}
                  <div className="flex-1 relative min-h-0">
                    <div 
                      ref={messagesContainerRef}
                      className="absolute inset-0 overflow-y-auto p-6 space-y-4 scroll-smooth"
                      onScroll={handleMessagesScroll}
                    >
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={clsx(
                            "flex",
                            message.role === "user" ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={clsx(
                              "max-w-[80%] rounded-2xl px-6 py-4 shadow-lg",
                              message.role === "user"
                                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                                : "bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 text-gray-100",
                            )}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: message.formatted_content || message.content,
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100" />
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200" />
                              <span className="text-gray-300 ml-2">AI正在思考...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* 滚动到底部按钮 */}
                    {showScrollToBottom && (
                      <button
                        onClick={scrollToBottom}
                        className="absolute bottom-4 right-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-3 shadow-lg transition-all z-10 animate-bounce"
                        title="滚动到最新消息"
                      >
                        <ArrowPathIcon className="w-5 h-5 rotate-90" />
                      </button>
                    )}
                  </div>

                  {/* 输入区域 */}
                  <div className="p-6 border-t border-gray-700/50">
                    <div className="flex space-x-4">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          placeholder="探索你的认知边界，输入任何想法..."
                          disabled={isLoading}
                          className="w-full bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        />
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={isLoading || !inputValue.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl px-6 py-4 text-white transition-all shadow-lg"
                      >
                        {isLoading ? (
                          <StopIcon className="w-6 h-6" />
                        ) : (
                          <PaperAirplaneIcon className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 可调整分隔条 */}
              {activeView === "both" && (
                <div
                  className="h-2 bg-gray-700/50 cursor-row-resize hover:bg-cyan-500/30 transition-colors relative group"
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startHeight = chatHeight;

                    const handleMouseMove = (e: MouseEvent) => {
                      const deltaY = e.clientY - startY;
                      const containerHeight = window.innerHeight - 200;
                      const newHeight = Math.max(
                        20,
                        Math.min(80, startHeight + (deltaY / containerHeight) * 100),
                      );
                      setChatHeight(newHeight);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener("mousemove", handleMouseMove);
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-1 bg-gray-500 rounded-full group-hover:bg-cyan-400 transition-colors" />
                  </div>
                </div>
              )}

              {/* 可视化区域 */}
              {(activeView === "both" || activeView === "graph") && (
                <div
                  className="bg-gray-800/30 backdrop-blur-xl flex flex-col"
                  style={{
                    height: activeView === "graph" ? "100%" : `${100 - chatHeight}%`,
                    minHeight: activeView === "both" ? "300px" : "auto",
                  }}
                >
                  {/* 图谱控制栏 */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                    <div className="flex space-x-1">
                      {Object.keys(graphUrls).map((tabName) => {
                        const Icon = getTabIcon(tabName);
                        const tabLabels = {
                          "knowledge-graph": "2D知识图谱",
                          "thought-chain": "思维链",
                          "cognitive-map": "3D认知图谱",
                          "decision-model": "决策模型",
                        };

                        return (
                          <button
                            key={tabName}
                            onClick={() => setCurrentTab(tabName)}
                            className={clsx(
                              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                              currentTab === tabName
                                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400"
                                : "bg-gray-700/30 hover:bg-gray-600/30 text-gray-400 hover:text-white",
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">
                              {tabLabels[tabName as keyof typeof tabLabels]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* 图谱类型选择 */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setGraphSettings(prev => ({ ...prev, graphType: "2d" }));
                            setCurrentTab("knowledge-graph");
                          }}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            graphSettings.graphType === "2d"
                              ? "bg-cyan-500 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          2D图谱
                        </button>
                        <button
                          onClick={() => {
                            setGraphSettings(prev => ({ ...prev, graphType: "3d" }));
                            setCurrentTab("cognitive-map");
                          }}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            graphSettings.graphType === "3d"
                              ? "bg-purple-500 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          3D图谱
                        </button>
                      </div>
                      
                      {/* 时间范围选择 */}
                      <select
                        value={graphSettings.timeRange}
                        onChange={(e) => setGraphSettings(prev => ({ ...prev, timeRange: e.target.value as "all" | "custom" }))}
                        className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-1 text-sm"
                      >
                        <option value="all">全部对话</option>
                        <option value="custom">自定义时间</option>
                      </select>
                      
                      {/* 自定义时间范围 */}
                      {graphSettings.timeRange === "custom" && (
                        <>
                          <input
                            type="date"
                            value={graphSettings.startDate}
                            onChange={(e) => setGraphSettings(prev => ({ ...prev, startDate: e.target.value }))}
                            className="bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-sm"
                          />
                          <span className="text-gray-400">至</span>
                          <input
                            type="date"
                            value={graphSettings.endDate}
                            onChange={(e) => setGraphSettings(prev => ({ ...prev, endDate: e.target.value }))}
                            className="bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-sm"
                          />
                        </>
                      )}
                      
                      <button
                        onClick={() => generateGraph(graphSettings.graphType)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg text-sm font-medium transition-all"
                      >
                        {graphSettings.graphType === "3d" ? "生成3D图谱" : "重新生成"}
                      </button>
                    </div>
                  </div>

                  {/* 可视化内容 */}
                  <div className="flex-1 overflow-hidden">
                    {graphUrls[currentTab as keyof GraphUrls] ? (
                      <iframe
                        src={graphUrls[currentTab as keyof GraphUrls]}
                        title={`${currentTab} visualization`}
                        className="w-full h-full border-0 rounded-lg"
                        style={{ minHeight: '500px' }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center p-6">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                            <ChartBarIcon className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-300 mb-2">
                            等待数据生成
                          </h3>
                          <p className="text-gray-500">
                            开始对话后将自动生成2D知识图谱
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            点击"生成3D图谱"按钮生成三维图谱
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        style={{ display: "none" }}
        accept=".txt,.md,.pdf,.doc,.docx"
      />

      {/* 保存对话模态框 */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">保存对话</h3>
            <input
              type="text"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="输入对话名称..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveConversation}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg text-white transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重命名对话模态框 */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">重命名对话</h3>
            <input
              type="text"
              value={newConversationName}
              onChange={(e) => setNewConversationName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 重命名逻辑
                  setShowRenameModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg text-white transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 保存位置选择模态框 */}
      {showSaveLocationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">选择保存位置</h3>
            <p className="text-gray-300 text-sm mb-6">
              首次保存对话，请选择默认保存位置。此设置将应用于以后的所有对话保存。
            </p>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="saveLocation"
                  value="local"
                  checked={saveLocation === "local"}
                  onChange={(e) => setSaveLocation(e.target.value as "local")}
                  className="text-cyan-500"
                />
                <div>
                  <div className="text-white font-medium">本地存储</div>
                  <div className="text-gray-400 text-xs">保存在浏览器本地，快速访问</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="saveLocation"
                  value="cloud"
                  checked={saveLocation === "cloud"}
                  onChange={(e) => setSaveLocation(e.target.value as "cloud")}
                  className="text-cyan-500"
                />
                <div>
                  <div className="text-white font-medium">云端存储</div>
                  <div className="text-gray-400 text-xs">保存到云端，跨设备同步</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="saveLocation"
                  value="both"
                  checked={saveLocation === "both"}
                  onChange={(e) => setSaveLocation(e.target.value as "both")}
                  className="text-cyan-500"
                />
                <div>
                  <div className="text-white font-medium">本地+云端</div>
                  <div className="text-gray-400 text-xs">同时保存到本地和云端，双重保障</div>
                </div>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveLocationModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmSaveLocation}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg text-white transition-colors"
              >
                确定并保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通知组件 */}
      {notification.show && (
        <div
          className={clsx(
            "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg backdrop-blur-xl transition-all duration-300",
            notification.type === "success"
              ? "bg-green-500/20 border border-green-500/50 text-green-400"
              : "bg-red-500/20 border border-red-500/50 text-red-400"
          )}
        >
          <div className="flex items-center space-x-3">
            {notification.type === "success" ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <XCircleIcon className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
