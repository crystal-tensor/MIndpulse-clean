"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  CubeTransparentIcon,
  ChartBarIcon,
  ArrowPathIcon,
  PlayIcon,
  PaperAirplaneIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  Squares2X2Icon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  StarIcon,
  TagIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

// 接口定义
interface Message {
  role: "user" | "assistant";
  content: string;
  stage?: "goal" | "resources" | "constraints" | "reasoning";
  extracted_entities?: Entity[];
}

interface Entity {
  id: string;
  type: "goal" | "resource" | "constraint";
  name: string;
  description: string;
  weight?: number;
}

interface Conversation {
  id: string;
  name: string;
  created_at: string;
  starred: boolean;
  tags: string[];
  stage: "goal" | "resources" | "constraints" | "reasoning" | "completed";
  entities: Entity[];
}

interface GraphNode {
  id: string;
  type: "goal" | "resource" | "constraint";
  name: string;
  x: number;
  y: number;
  selected: boolean;
  quantum_selected?: boolean;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: "supports" | "conflicts" | "requires";
  weight: number;
}

interface QuantumResult {
  solution_id: string;
  probability: number;
  objective_values: number[];
  selected_nodes: string[];
  pareto_optimal: boolean;
}

export default function AIExplorationHubV2() {
  // 核心状态
  const [currentTab, setCurrentTab] = useState<
    "dialogue" | "graph" | "reasoning" | "compare"
  >("dialogue");
  const [currentStage, setCurrentStage] = useState<
    "goal" | "resources" | "constraints" | "reasoning"
  >("goal");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 对话管理
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [showNewConversation, setShowNewConversation] = useState(false);

  // 实体与图谱
  const [entities, setEntities] = useState<Entity[]>([]);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  // 量子推理
  const [quantumResults, setQuantumResults] = useState<QuantumResult[]>([]);
  const [isQuantumRunning, setIsQuantumRunning] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  // 布局与视图
  const [viewMode, setViewMode] = useState<
    "full" | "dialogue-only" | "graph-only"
  >("full");
  const [graphLayers, setGraphLayers] = useState({
    goals: true,
    resources: true,
    constraints: true,
  });

  // 引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);

  // 初始化
  useEffect(() => {
    initializeWelcome();
    loadConversations();
  }, []);

  // 自动滚动到消息底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 初始化欢迎消息
  const initializeWelcome = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "欢迎来到智核交互工作台！让我们开始一个结构化的决策对话。首先，请告诉我您的目标是什么？",
        stage: "goal",
      },
    ]);
  };

  // 加载对话列表
  const loadConversations = async () => {
    // 模拟数据
    setConversations([
      {
        id: "1",
        name: "投资决策分析",
        created_at: new Date().toISOString(),
        starred: true,
        tags: ["投资", "风险"],
        stage: "completed",
        entities: [],
      },
      {
        id: "2",
        name: "产品发布策略",
        created_at: new Date().toISOString(),
        starred: false,
        tags: ["产品", "策略"],
        stage: "reasoning",
        entities: [],
      },
    ]);
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      stage: currentStage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // 调用后端API进行实体提取和响应生成
      const response = await fetch("/api/mindpilot/extract-variables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          stage: currentStage,
          context: messages.slice(-5), // 最近5条消息作为上下文
        }),
      });

      if (!response.ok) {
        throw new Error("API请求失败");
      }

      const data = await response.json();

      // 添加AI响应
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        stage: currentStage,
        extracted_entities: data.entities,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 更新实体列表
      if (data.entities && data.entities.length > 0) {
        setEntities((prev) => [...prev, ...data.entities]);
        updateGraphNodes(data.entities);
      }

      // 检查是否应该进入下一阶段
      if (data.next_stage && data.next_stage !== currentStage) {
        setTimeout(() => {
          setCurrentStage(data.next_stage);
          if (data.next_stage === "reasoning") {
            // 自动运行量子推理
            runQuantumReasoning();
          }
        }, 1000);
      }
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

  // 更新图谱节点
  const updateGraphNodes = (newEntities: Entity[]) => {
    const newNodes = newEntities.map((entity, index) => ({
      id: entity.id,
      type: entity.type,
      name: entity.name,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      selected: false,
    }));

    setGraphNodes((prev) => [...prev, ...newNodes]);
  };

  // 运行量子推理
  const runQuantumReasoning = async () => {
    setIsQuantumRunning(true);
    setCurrentTab("reasoning");

    try {
      const response = await fetch("/api/mindpilot/quantum-solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entities: entities,
          graph_nodes: graphNodes,
          graph_edges: graphEdges,
        }),
      });

      if (!response.ok) {
        throw new Error("量子推理失败");
      }

      const data = await response.json();
      setQuantumResults(data.solutions);

      // 高亮量子选中的节点
      if (data.solutions.length > 0) {
        const bestSolution = data.solutions[0];
        setGraphNodes((prev) =>
          prev.map((node) => ({
            ...node,
            quantum_selected: bestSolution.selected_nodes.includes(node.id),
          })),
        );
        setSelectedSolution(bestSolution.solution_id);
      }
    } catch (error) {
      console.error("量子推理失败:", error);
    } finally {
      setIsQuantumRunning(false);
    }
  };

  // 阶段指示器
  const StageIndicator = () => {
    const stages = [
      { id: "goal", name: "目标", icon: SparklesIcon },
      { id: "resources", name: "资源", icon: CubeTransparentIcon },
      { id: "constraints", name: "约束", icon: ExclamationTriangleIcon },
      { id: "reasoning", name: "推理", icon: CpuChipIcon },
    ];

    return (
      <div className="flex items-center space-x-2 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.id;
          const isCompleted =
            stages.findIndex((s) => s.id === currentStage) > index;

          return (
            <React.Fragment key={stage.id}>
              <div
                className={clsx(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all",
                  isActive &&
                    "bg-purple-500/20 text-purple-300 border border-purple-400/30",
                  isCompleted && "bg-green-500/20 text-green-300",
                  !isActive && !isCompleted && "text-gray-400",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{stage.name}</span>
                {isCompleted && (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                )}
                {entities.filter((e) => e.type === stage.id).length > 0 && (
                  <span className="bg-white/10 text-xs px-2 py-1 rounded-full">
                    {entities.filter((e) => e.type === stage.id).length}
                  </span>
                )}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={clsx(
                    "w-8 h-0.5 transition-colors",
                    isCompleted ? "bg-green-500" : "bg-gray-600",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // 对话区域
  const DialoguePanel = () => (
    <div className="flex flex-col h-full">
      {/* 阶段指示器 */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <StageIndicator />
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(
              "flex items-start space-x-3",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <CpuChipIcon className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={clsx(
                "max-w-2xl p-4 rounded-lg",
                message.role === "user"
                  ? "bg-blue-500/20 text-blue-100 border border-blue-400/30"
                  : "bg-white/5 text-gray-100 border border-white/10",
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.extracted_entities &&
                message.extracted_entities.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-2">提取的实体：</p>
                    <div className="flex flex-wrap gap-2">
                      {message.extracted_entities.map((entity, idx) => (
                        <span
                          key={idx}
                          className={clsx(
                            "px-2 py-1 rounded-full text-xs",
                            entity.type === "goal" &&
                              "bg-purple-500/20 text-purple-300",
                            entity.type === "resource" &&
                              "bg-blue-500/20 text-blue-300",
                            entity.type === "constraint" &&
                              "bg-red-500/20 text-red-300",
                          )}
                        >
                          {entity.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI正在思考...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="flex-shrink-0 p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder={
                currentStage === "goal"
                  ? "描述您的目标..."
                  : currentStage === "resources"
                    ? "列出可用资源..."
                    : currentStage === "constraints"
                      ? "说明约束条件..."
                      : "继续对话..."
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // 图谱面板
  const GraphPanel = () => (
    <div className="flex flex-col h-full">
      {/* 图层控制 */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">知识图谱</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">图层:</span>
              {Object.entries(graphLayers).map(([key, visible]) => (
                <button
                  key={key}
                  onClick={() =>
                    setGraphLayers((prev) => ({ ...prev, [key]: !visible }))
                  }
                  className={clsx(
                    "px-3 py-1 rounded-full text-xs transition-colors",
                    visible
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-gray-600/20 text-gray-400",
                  )}
                >
                  {key === "goals"
                    ? "目标"
                    : key === "resources"
                      ? "资源"
                      : "约束"}
                </button>
              ))}
            </div>
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <DocumentArrowDownIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 图谱画布 */}
      <div className="flex-1 relative bg-gray-900/50 rounded-lg m-4">
        {graphNodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <CubeTransparentIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>开始对话后，知识图谱将在这里显示</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* 简化的图谱渲染 */}
            <svg className="w-full h-full">
              {/* 连接线 */}
              {graphEdges.map((edge) => {
                const sourceNode = graphNodes.find((n) => n.id === edge.source);
                const targetNode = graphNodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                return (
                  <line
                    key={edge.id}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={edge.type === "conflicts" ? "#ef4444" : "#6b7280"}
                    strokeWidth="2"
                    strokeDasharray={edge.type === "requires" ? "5,5" : "none"}
                  />
                );
              })}

              {/* 节点 */}
              {graphNodes.map((node) => {
                if (!graphLayers[(node.type + "s") as keyof typeof graphLayers])
                  return null;

                const nodeColor =
                  node.type === "goal"
                    ? "#8b5cf6"
                    : node.type === "resource"
                      ? "#3b82f6"
                      : "#ef4444";

                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.quantum_selected ? "20" : "15"}
                      fill={nodeColor}
                      stroke={node.quantum_selected ? "#fbbf24" : "none"}
                      strokeWidth="3"
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedNodes((prev) =>
                          prev.includes(node.id)
                            ? prev.filter((id) => id !== node.id)
                            : [...prev, node.id],
                        );
                      }}
                    />

                    <text
                      x={node.x}
                      y={node.y + 30}
                      textAnchor="middle"
                      className="text-xs fill-gray-300 pointer-events-none"
                    >
                      {node.name.substring(0, 15)}...
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  // 推理面板
  const ReasoningPanel = () => (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">量子推理结果</h3>
          <button
            onClick={runQuantumReasoning}
            disabled={isQuantumRunning || entities.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isQuantumRunning ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                <span>计算中...</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4" />
                <span>运行VQE</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {quantumResults.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <BeakerIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>完成对话后，点击"运行VQE"查看量子推理结果</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pareto前沿散点图 */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-medium text-white mb-4">
                Pareto前沿分析
              </h4>
              <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">散点图区域（需要集成图表库）</p>
              </div>
            </div>

            {/* 解决方案列表 */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-medium text-white mb-4">推荐方案</h4>
              <div className="space-y-3">
                {quantumResults.slice(0, 5).map((result, index) => (
                  <div
                    key={result.solution_id}
                    className={clsx(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedSolution === result.solution_id
                        ? "border-purple-400 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                    onClick={() => setSelectedSolution(result.solution_id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">
                        方案 {index + 1}
                        {result.pareto_optimal && (
                          <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                            Pareto最优
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400">
                        概率: {(result.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-300">
                      目标值:{" "}
                      {result.objective_values
                        .map((v) => v.toFixed(2))
                        .join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 主界面
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="flex h-full">
        {/* 左侧边栏 - 会话列表 */}
        <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <button
              onClick={() => setShowNewConversation(true)}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              新建对话
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* 会话列表将在这里显示 */}
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                历史对话
              </div>
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={clsx(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    currentConversationId === conv.id
                      ? "border-purple-400 bg-purple-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  )}
                  onClick={() => setCurrentConversationId(conv.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {conv.name}
                    </span>
                    {conv.starred && (
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(conv.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center mt-2 space-x-1">
                    <span
                      className={clsx(
                        "w-2 h-2 rounded-full",
                        conv.stage === "completed"
                          ? "bg-green-500"
                          : "bg-yellow-500",
                      )}
                    />

                    <span className="text-xs text-gray-400">{conv.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部标签栏 */}
          <div className="flex-shrink-0 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-1">
                {[
                  {
                    id: "dialogue",
                    name: "Dialogue",
                    icon: ChatBubbleLeftRightIcon,
                  },
                  { id: "graph", name: "Graph", icon: CubeTransparentIcon },
                  { id: "reasoning", name: "Reasoning", icon: BeakerIcon },
                  { id: "compare", name: "Compare", icon: ChartBarIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id as any)}
                      className={clsx(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                        currentTab === tab.id
                          ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                          : "text-gray-400 hover:text-gray-300 hover:bg-white/5",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* 视图模式切换 */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-white/5 rounded-lg p-1">
                  {[
                    { id: "full", icon: Squares2X2Icon, tooltip: "完整视图" },
                    {
                      id: "dialogue-only",
                      icon: ChatBubbleLeftRightIcon,
                      tooltip: "仅对话",
                    },
                    {
                      id: "graph-only",
                      icon: CubeTransparentIcon,
                      tooltip: "仅图谱",
                    },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setViewMode(mode.id as any)}
                        className={clsx(
                          "p-2 rounded-lg transition-all",
                          viewMode === mode.id
                            ? "bg-purple-500/20 text-purple-300"
                            : "text-gray-400 hover:text-gray-300",
                        )}
                        title={mode.tooltip}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 内容面板 */}
          <div className="flex-1 overflow-hidden">
            {currentTab === "dialogue" && <DialoguePanel />}
            {currentTab === "graph" && <GraphPanel />}
            {currentTab === "reasoning" && <ReasoningPanel />}
            {currentTab === "compare" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>方案比较功能即将推出</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
