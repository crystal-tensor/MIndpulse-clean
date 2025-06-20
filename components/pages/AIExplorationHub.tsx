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
  const [conversationName, setConversationName] = useState("");
  const [renameId, setRenameId] = useState("");
  const [newConversationName, setNewConversationName] = useState("");

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
  const [layoutMode, setLayoutMode] = useState<"both" | "chat-only" | "visualization-only">("both");
  const [chatHeight, setChatHeight] = useState(40); // 百分比

  // 引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = useRef(`user_${Math.random().toString(36).substring(2, 9)}`);

  // 初始化加载
  useEffect(() => {
    loadSettings();
    loadConversations();
    loadUploadedFiles();
    
    // 添加欢迎消息
    setMessages([{
      role: "assistant",
      content: "欢迎来到智核交互界面！我是您的AI认知探索伙伴，可以帮您分析问题、构建知识图谱、做出智能决策。请告诉我您想探讨的话题。",
    }]);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 加载设置
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem("mindpilot_settings");
      if (saved) {
        setSettings({ ...settings, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error("加载设置失败:", error);
    }
  };

  // 保存设置
  const saveSettings = () => {
    try {
      localStorage.setItem("mindpilot_settings", JSON.stringify(settings));
      showNotification("设置已保存", "success");
    } catch (error) {
      console.error("保存设置失败:", error);
      showNotification("保存设置失败", "error");
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!settings.apiKey) {
      showNotification("请先在设置中配置API密钥", "error");
      setShowSettings(true);
      return;
    }

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
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
        formatted_content: data.response,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 更新图谱URLs
      if (data.knowledge_graph_url) {
        setGraphUrls(prev => ({
          ...prev,
          "knowledge-graph": data.knowledge_graph_url,
          "thought-chain": data.thought_chain_url || "",
          "cognitive-map": data.cognitive_map_url || "",
          "decision-model": data.decision_model_url || "",
        }));
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      showNotification(`发送失败: ${error instanceof Error ? error.message : "未知错误"}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 加载对话列表
  const loadConversations = async () => {
    try {
      const response = await fetch("/api/mindpilot/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("加载对话列表失败:", error);
    }
  };

  // 保存对话
  const saveConversation = async () => {
    if (!conversationName.trim()) {
      showNotification("请输入对话名称", "error");
      return;
    }

    try {
      const response = await fetch("/api/mindpilot/save_conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId.current,
          conversation_name: conversationName,
          chat_history: messages,
        }),
      });

      if (response.ok) {
        showNotification("对话保存成功！", "success");
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

  // 加载对话
  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/mindpilot/load_conversation/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.chat_history || []);
        showNotification(`对话"${data.name}"加载成功！`, "success");
      }
    } catch (error) {
      console.error("加载对话失败:", error);
      showNotification("加载对话失败", "error");
    }
  };

  // 删除对话
  const deleteConversation = async (conversationId: string) => {
    if (!confirm("确定要删除这个对话吗？")) return;

    try {
      const response = await fetch(`/api/mindpilot/delete_conversation/${conversationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification("对话删除成功", "success");
        loadConversations();
      }
    } catch (error) {
      console.error("删除对话失败:", error);
      showNotification("删除对话失败", "error");
    }
  };

  // 生成知识图谱
  const generateGraph = async (graphType: string = "2d") => {
    try {
      const response = await fetch("/api/mindpilot/generate_graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId.current,
          graph_type: graphType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGraphUrls(prev => ({
          ...prev,
          "knowledge-graph": data.graph_url,
        }));
        showNotification("知识图谱生成成功！", "success");
      }
    } catch (error) {
      console.error("生成图谱失败:", error);
      showNotification("生成图谱失败", "error");
    }
  };

  // 文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await fetch("/api/mindpilot/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        showNotification(`成功上传 ${data.uploaded_files?.length || 0} 个文件`, "success");
        loadUploadedFiles();
      }
    } catch (error) {
      console.error("文件上传失败:", error);
      showNotification("文件上传失败", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // 加载已上传文件
  const loadUploadedFiles = async () => {
    try {
      const response = await fetch("/api/mindpilot/uploaded_files");
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.files || []);
      }
    } catch (error) {
      console.error("加载文件列表失败:", error);
    }
  };

  // 通知系统
  const showNotification = (message: string, type: "success" | "error" = "success") => {
    // 这里可以集成更复杂的通知系统
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  // 获取标签页图标
  const getTabIcon = (tabName: string) => {
    const icons = {
      "knowledge-graph": CircleStackIcon,
      "thought-chain": CommandLineIcon,
      "cognitive-map": BeakerIcon,
      "decision-model": CubeTransparentIcon,
    };
    return icons[tabName as keyof typeof icons] || ChartBarIcon;
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* 主界面 */}
      <div className="relative z-10 h-full flex">
        {/* 左侧边栏 */}
        <div className="w-80 bg-gray-800/50 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col">
          {/* 标题区域 */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  智核交互
                </h1>
                <p className="text-xs text-gray-400">AI Cognitive Interface</p>
              </div>
            </div>
          </div>

          {/* 功能按钮组 */}
          <div className="p-4 space-y-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-300 group"
            >
              <CogIcon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
              <span className="text-sm">模型设置</span>
            </button>

            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-300 group"
            >
              <BookmarkIcon className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
              <span className="text-sm">保存对话</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-300 group"
            >
              <DocumentArrowUpIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
              <span className="text-sm">上传文件</span>
              {isUploading && <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />}
            </button>

            <button
              onClick={() => generateGraph("3d")}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-300 group"
            >
              <ArrowPathIcon className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
              <span className="text-sm">生成图谱</span>
            </button>
          </div>

          {/* 布局控制 */}
          <div className="p-4 border-t border-gray-700/50">
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">界面布局</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mode: "both", icon: Squares2X2Icon, label: "双栏" },
                { mode: "chat-only", icon: ChatBubbleLeftRightIcon, label: "对话" },
                { mode: "visualization-only", icon: RectangleStackIcon, label: "可视化" },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setLayoutMode(mode as any)}
                  className={clsx(
                    "flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300",
                    layoutMode === mode
                      ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                      : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-400"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 对话历史列表 */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">对话历史</h4>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-600/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-white truncate">{conv.name}</h5>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => loadConversation(conv.id)}
                        className="p-1 hover:bg-cyan-500/20 rounded text-cyan-400"
                      >
                        <FolderOpenIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setRenameId(conv.id);
                          setNewConversationName(conv.name);
                          setShowRenameModal(true);
                        }}
                        className="p-1 hover:bg-yellow-500/20 rounded text-yellow-400"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteConversation(conv.id)}
                        className="p-1 hover:bg-red-500/20 rounded text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {conv.message_count} 条消息 • {new Date(conv.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 文件列表 */}
          <div className="p-4 border-t border-gray-700/50">
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">已上传文件</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="bg-gray-700/30 rounded p-2">
                  <div className="text-xs font-medium text-white truncate">{file.filename}</div>
                  <div className="text-xs text-gray-400">
                    {(file.file_size / 1024).toFixed(1)} KB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 设置面板 */}
          {showSettings && (
            <div className="bg-gray-800/90 backdrop-blur-xl border-b border-cyan-500/20 p-6">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4">模型配置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">提供方</label>
                    <select
                      value={settings.provider}
                      onChange={(e) => setSettings(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="deepseek">DeepSeek</option>
                      <option value="openai">OpenAI</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="claude">Anthropic Claude</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">API密钥</label>
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="输入API密钥..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">模型名称</label>
                    <input
                      type="text"
                      value={settings.modelName}
                      onChange={(e) => setSettings(prev => ({ ...prev, modelName: e.target.value }))}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">温度 ({settings.temperature})</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">上下文窗口</label>
                    <input
                      type="number"
                      value={settings.contextWindow}
                      onChange={(e) => setSettings(prev => ({ ...prev, contextWindow: parseInt(e.target.value) }))}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.streamingResponse}
                      onChange={(e) => setSettings(prev => ({ ...prev, streamingResponse: e.target.checked }))}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-300">流式响应</label>
                  </div>
                </div>

                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={saveSettings}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg text-white transition-colors"
                  >
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 对话和可视化区域 */}
          <div className="flex-1 flex flex-col">
            {(layoutMode === "both" || layoutMode === "chat-only") && (
              <div 
                className="bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50 flex flex-col"
                style={{ 
                  height: layoutMode === "chat-only" ? "100%" : `${chatHeight}%`,
                  minHeight: layoutMode === "both" ? "200px" : "auto"
                }}
              >
                {/* 消息区域 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={clsx(
                          "max-w-[80%] rounded-2xl px-6 py-4 shadow-lg",
                          message.role === "user"
                            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                            : "bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 text-gray-100"
                        )}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: message.formatted_content || message.content
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
                        className="w-full bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl px-6 py-4 text-white transition-all duration-300 shadow-lg"
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
            {layoutMode === "both" && (
              <div
                className="h-2 bg-gray-700/50 cursor-row-resize hover:bg-cyan-500/30 transition-colors relative group"
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startHeight = chatHeight;
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaY = e.clientY - startY;
                    const containerHeight = window.innerHeight - 200; // 大致的容器高度
                    const newHeight = Math.max(20, Math.min(80, startHeight + (deltaY / containerHeight) * 100));
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
            {(layoutMode === "both" || layoutMode === "visualization-only") && (
              <div 
                className="bg-gray-800/30 backdrop-blur-xl flex flex-col"
                style={{ 
                  height: layoutMode === "visualization-only" ? "100%" : `${100 - chatHeight}%`,
                  minHeight: layoutMode === "both" ? "200px" : "auto"
                }}
              >
                {/* 标签页 */}
                <div className="flex space-x-1 p-4 border-b border-gray-700/50">
                  {Object.keys(graphUrls).map((tabName) => {
                    const Icon = getTabIcon(tabName);
                    const tabLabels = {
                      "knowledge-graph": "知识图谱",
                      "thought-chain": "思维链",
                      "cognitive-map": "认知图谱", 
                      "decision-model": "决策模型",
                    };
                    
                    return (
                      <button
                        key={tabName}
                        onClick={() => setCurrentTab(tabName)}
                        className={clsx(
                          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                          currentTab === tabName
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400"
                            : "bg-gray-700/30 hover:bg-gray-600/30 text-gray-400 hover:text-white"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{tabLabels[tabName as keyof typeof tabLabels]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 可视化内容 */}
                <div className="flex-1 p-6 overflow-auto">
                  {graphUrls[currentTab as keyof GraphUrls] ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={graphUrls[currentTab as keyof GraphUrls]}
                        alt={`${currentTab} visualization`}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                      />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                          <ChartBarIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">等待数据生成</h3>
                        <p className="text-gray-500">开始对话以生成可视化图谱</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
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
                onClick={async () => {
                  // 这里应该调用重命名API
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
    </div>
  );
} 