"use client";

import React, { useState, useEffect } from "react";
import {
  BoltIcon,
  SparklesIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  BeakerIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface UserStats {
  level: number;
  experience: number;
  nextLevelXP: number;
  valuePoints: number;
  knowledgeNodes: number;
  connections: number;
  completedDecisions: number;
  dailyStreak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface AIRecommendation {
  id: string;
  type: "knowledge" | "decision" | "connection" | "opportunity";
  title: string;
  description: string;
  confidence: number;
  estimatedValue: number;
  timeToComplete: string;
}

export default function ConsciousnessHub() {
  // 用户数据状态
  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    experience: 3840,
    nextLevelXP: 5000,
    valuePoints: 1247,
    knowledgeNodes: 156,
    connections: 23,
    completedDecisions: 8,
    dailyStreak: 7,
  });

  // 成就数据
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_connection",
      title: "初遇知音",
      description: "建立第一个知识连接",
      icon: "🔗",
      rarity: "common",
      unlockedAt: "2024-01-15",
    },
    {
      id: "quantum_pioneer",
      title: "量子先驱",
      description: "完成首个量子决策分析",
      icon: "⚛️",
      rarity: "rare",
      unlockedAt: "2024-01-20",
    },
    {
      id: "knowledge_architect",
      title: "知识建筑师",
      description: "构建超过100个知识节点",
      icon: "🏗️",
      rarity: "epic",
      progress: 156,
      maxProgress: 100,
      unlockedAt: "2024-01-25",
    },
    {
      id: "mind_weaver",
      title: "思维编织者",
      description: "连续7天活跃使用",
      icon: "🧠",
      rarity: "legendary",
      progress: 7,
      maxProgress: 7,
    },
  ]);

  // AI推荐
  const [aiRecommendations, setAiRecommendations] = useState<
    AIRecommendation[]
  >([
    {
      id: "rec_1",
      type: "knowledge",
      title: "探索量子计算与意识关联",
      description: "基于您的认知科学兴趣，推荐深入量子意识理论",
      confidence: 92,
      estimatedValue: 450,
      timeToComplete: "2小时",
    },
    {
      id: "rec_2",
      type: "connection",
      title: "与张博士建立学术连接",
      description: "认知科学领域专家，匹配度85%",
      confidence: 85,
      estimatedValue: 680,
      timeToComplete: "15分钟",
    },
    {
      id: "rec_3",
      type: "decision",
      title: "职业发展路径分析",
      description: "使用量子决策引擎分析未来3-5年发展方向",
      confidence: 78,
      estimatedValue: 1200,
      timeToComplete: "45分钟",
    },
  ]);

  // 热门话题
  const [trendingTopics] = useState([
    { id: 1, title: "量子计算的哲学思考", engagement: 89, participants: 234 },
    { id: 2, title: "AI意识的边界探索", engagement: 76, participants: 189 },
    { id: 3, title: "认知增强的伦理考量", engagement: 92, participants: 156 },
    { id: 4, title: "元宇宙中的身份建构", engagement: 67, participants: 134 },
  ]);

  // 实时动态效果
  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟实时数据更新
      setUserStats((prev) => ({
        ...prev,
        experience: prev.experience + Math.floor(Math.random() * 5),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 获取稀有度颜色
  const getRarityColor = (rarity: Achievement["rarity"]) => {
    const colors = {
      common: "from-gray-400 to-gray-600",
      rare: "from-blue-400 to-blue-600",
      epic: "from-purple-400 to-purple-600",
      legendary: "from-yellow-400 to-orange-500",
    };
    return colors[rarity];
  };

  // 获取推荐类型图标
  const getRecommendationIcon = (type: AIRecommendation["type"]) => {
    const icons = {
      knowledge: LightBulbIcon,
      decision: SparklesIcon,
      connection: UserGroupIcon,
      opportunity: RocketLaunchIcon,
    };
    return icons[type];
  };

  const experiencePercentage =
    (userStats.experience / userStats.nextLevelXP) * 100;

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-cyan-500/20 p-6">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full blur-3xl" />

          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                意识枢纽 - Consciousness Hub
              </h1>
              <p className="text-gray-400 mt-1">欢迎回到你的认知成长宇宙</p>
            </div>

            {/* 等级显示 */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <BoltIcon className="w-5 h-5 text-yellow-400" />

                  <span className="text-xl font-bold text-white">
                    Lv.{userStats.level}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {userStats.experience}/{userStats.nextLevelXP} XP
                </div>
              </div>

              {/* 头像 */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">张</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* 经验值进度条 */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 relative"
              style={{ width: `${experiencePercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "价值点",
            value: userStats.valuePoints,
            icon: StarIcon,
            color: "from-yellow-400 to-orange-500",
          },
          {
            label: "知识节点",
            value: userStats.knowledgeNodes,
            icon: GlobeAltIcon,
            color: "from-cyan-400 to-blue-500",
          },
          {
            label: "连接数",
            value: userStats.connections,
            icon: UserGroupIcon,
            color: "from-purple-400 to-pink-500",
          },
          {
            label: "决策完成",
            value: userStats.completedDecisions,
            icon: SparklesIcon,
            color: "from-green-400 to-emerald-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div
                className={clsx(
                  "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform",
                  stat.color,
                )}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：AI推荐 */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI智能推荐 */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <BeakerIcon className="w-5 h-5 text-cyan-400 mr-2" />
                AI智能推荐
              </h3>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                实时更新
              </span>
            </div>

            <div className="space-y-4">
              {aiRecommendations.map((rec) => {
                const IconComponent = getRecommendationIcon(rec.type);
                return (
                  <div
                    key={rec.id}
                    className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-4 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                            {rec.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-green-400">
                              +{rec.estimatedValue} VP
                            </span>
                            <span className="text-xs text-gray-400">
                              {rec.timeToComplete}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-3">
                          {rec.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              AI信心度
                            </span>
                            <div className="w-16 bg-gray-700 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-green-400 to-cyan-400 h-1.5 rounded-full"
                                style={{ width: `${rec.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs text-cyan-400">
                              {rec.confidence}%
                            </span>
                          </div>

                          <button className="text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full hover:from-cyan-400 hover:to-purple-400 transition-all">
                            立即行动
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 热门探索话题 */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 text-purple-400 mr-2" />
              热门认知探索
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-4 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group"
                >
                  <h4 className="text-white font-medium mb-2 group-hover:text-purple-400 transition-colors">
                    {topic.title}
                  </h4>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">参与者</span>
                      <span className="text-purple-400 font-medium">
                        {topic.participants}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">热度</span>
                      <div className="w-12 bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-1.5 rounded-full"
                          style={{ width: `${topic.engagement}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：成就和状态 */}
        <div className="space-y-6">
          {/* 最新成就 */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrophyIcon className="w-5 h-5 text-yellow-400 mr-2" />
              成就展示
            </h3>

            <div className="space-y-3">
              {achievements.slice(0, 4).map((achievement) => (
                <div
                  key={achievement.id}
                  className={clsx(
                    "p-3 rounded-lg border transition-all duration-300",
                    achievement.unlockedAt
                      ? "bg-gradient-to-r border-yellow-500/30"
                      : "bg-gray-900/50 border-gray-600/30",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-xl",
                        achievement.unlockedAt
                          ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}`
                          : "bg-gray-700",
                      )}
                    >
                      {achievement.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={clsx(
                          "font-medium text-sm",
                          achievement.unlockedAt
                            ? "text-white"
                            : "text-gray-500",
                        )}
                      >
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {achievement.description}
                      </p>

                      {achievement.progress && achievement.maxProgress && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                            <span className="text-cyan-400">
                              {Math.round(
                                (achievement.progress /
                                  achievement.maxProgress) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                            <div
                              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1 rounded-full transition-all duration-500"
                              style={{
                                width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 每日任务 */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BoltIcon className="w-5 h-5 text-green-400 mr-2" />
              每日挑战
            </h3>

            <div className="space-y-3">
              {[
                {
                  task: "完成一次AI对话",
                  progress: 1,
                  max: 1,
                  completed: true,
                },
                {
                  task: "添加3个知识节点",
                  progress: 2,
                  max: 3,
                  completed: false,
                },
                {
                  task: "建立1个新连接",
                  progress: 0,
                  max: 1,
                  completed: false,
                },
              ].map((quest, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        quest.completed
                          ? "bg-green-500"
                          : "border-2 border-gray-600",
                      )}
                    >
                      {quest.completed && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <span
                      className={clsx(
                        "text-sm",
                        quest.completed
                          ? "text-green-400 line-through"
                          : "text-gray-300",
                      )}
                    >
                      {quest.task}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    {quest.progress}/{quest.max}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">连续登录</span>
                <span className="text-cyan-400 font-medium">
                  {userStats.dailyStreak} 天
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
