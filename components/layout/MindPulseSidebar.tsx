"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  GlobeAltIcon,
  CpuChipIcon,
  SparklesIcon,
  ArrowsRightLeftIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BeakerIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { useUI } from "@/lib/store";
import { clsx } from "clsx";

const navigationItems = [
  {
    id: "consciousness-hub",
    name: "意识枢纽",
    nameEn: "Consciousness Hub",
    path: "/",
    icon: HomeIcon,
    mysticSymbol: "⚡",
    energyColor: "from-cyan-400 to-blue-500",
    description: "个人认知成长仪表盘",
    chineseElement: "太极",
  },
  {
    id: "spirit-corridor",
    name: "灵境回廊",
    nameEn: "Spirit Corridor",
    path: "/knowledge-graph",
    icon: GlobeAltIcon,
    mysticSymbol: "🌌",
    energyColor: "from-purple-400 to-pink-500",
    description: "知识图谱社交中心",
    chineseElement: "八卦",
  },
  {
    id: "ai-core",
    name: "智核交互",
    nameEn: "AI Core",
    path: "/ai-exploration",
    icon: CpuChipIcon,
    mysticSymbol: "🧠",
    energyColor: "from-green-400 to-emerald-500",
    description: "AI认知探索界面",
    chineseElement: "灵犀",
  },
  {
    id: "destiny-weaver",
    name: "命运织机",
    nameEn: "Destiny Weaver",
    path: "/quantum-decisions",
    icon: SparklesIcon,
    mysticSymbol: "🎯",
    energyColor: "from-yellow-400 to-orange-500",
    description: "量子智能决策系统",
    chineseElement: "奇门",
  },
  {
    id: "singularity-exchange",
    name: "奇点交易所",
    nameEn: "Singularity Exchange",
    path: "/marketplace",
    icon: ArrowsRightLeftIcon,
    mysticSymbol: "💎",
    energyColor: "from-red-400 to-rose-500",
    description: "价值创造与交易平台",
    chineseElement: "五行",
  },
  {
    id: "self-entity",
    name: "自我机体",
    nameEn: "Self Entity",
    path: "/profile",
    icon: UserIcon,
    mysticSymbol: "👤",
    energyColor: "from-indigo-400 to-purple-500",
    description: "个人中心与成长档案",
    chineseElement: "元神",
  },
];

// 快捷功能区
const quickActions = [
  {
    id: "mind-pilot",
    name: "思维导航",
    icon: BeakerIcon,
    path: "/mind-pilot",
    energyColor: "from-teal-400 to-cyan-500",
  },
  {
    id: "knowledge-base",
    name: "知识库",
    icon: BookOpenIcon,
    path: "/knowledge-base",
    energyColor: "from-violet-400 to-purple-500",
  },
  {
    id: "neural-chat",
    name: "神经对话",
    icon: ChatBubbleLeftRightIcon,
    path: "/neural-chat",
    energyColor: "from-pink-400 to-rose-500",
  },
];

export default function MindPulseSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, isMobile } = useUI();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    level: 12,
    experience: 3840,
    nextLevelXP: 5000,
    valuePoints: 1247,
    connectionsCount: 23,
    dailyStreak: 7,
  });

  // 能量脉冲动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      const energyElements = document.querySelectorAll(".energy-pulse");
      energyElements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add("animate-pulse");
          setTimeout(() => {
            element.classList.remove("animate-pulse");
          }, 1000);
        }, index * 200);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 计算经验值百分比
  const experiencePercentage =
    (userStats.experience / userStats.nextLevelXP) * 100;

  return (
    <>
      {/* 移动端遮罩 */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* 侧边栏主体 */}
      <div
        className={clsx(
          "fixed left-0 top-0 h-full z-[9999] transition-all duration-300 ease-in-out",
          "flex flex-col consciousness-bg",
          "border-r border-cyan-500/20 backdrop-blur-md",
          sidebarCollapsed ? "w-16" : "w-64",
          isMobile && sidebarCollapsed && "-translate-x-full",
          "lg:translate-x-0",
        )}
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(10, 10, 10, 0.95) 0%, 
              rgba(26, 26, 46, 0.95) 50%, 
              rgba(22, 33, 62, 0.95) 100%
            )
          `,
        }}
      >
        {/* 背景神秘图案 */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="w-48 h-48 border border-cyan-400/30 rounded-full animate-spin-slow"
              style={{ animationDuration: "20s" }}
            />
          </div>
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div
              className="w-32 h-32 border border-purple-400/20 rounded-full animate-spin-slow"
              style={{
                animationDuration: "30s",
                animationDirection: "reverse",
              }}
            />
          </div>
        </div>

        {/* Logo区域 - MindPulse品牌 */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 relative z-10">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <span className="text-white font-bold text-lg relative z-10 font-mono">
                    M
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 animate-pulse" />

                  <div className="energy-pulse absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />

                {/* 悬浮时的神秘符文 */}
                <div className="absolute -inset-2 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                  <div className="w-full h-full border border-cyan-400/50 rounded-xl animate-pulse" />
                </div>
              </div>

              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  MindPulse
                </span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />

                  <p className="text-xs text-gray-400">量子智能引擎</p>
                </div>
              </div>
            </div>
          )}

          {/* 折叠按钮 */}
          <button
            onClick={toggleSidebar}
            className={clsx(
              "p-1.5 rounded-lg hover:bg-cyan-500/20 transition-all duration-300 group relative",
              sidebarCollapsed && "mx-auto",
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all" />
            )}

            {/* 能量光环效果 */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-full h-full bg-cyan-400/10 rounded-lg animate-pulse" />
            </div>
          </button>
        </div>

        {/* 用户等级状态 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-cyan-500/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BoltIcon className="w-4 h-4 text-yellow-400" />

                  <span className="text-xs text-gray-400">
                    Lv.{userStats.level}
                  </span>
                </div>
                <span className="text-xs text-cyan-400 font-medium">
                  {userStats.experience}/{userStats.nextLevelXP} XP
                </span>
              </div>

              {/* 经验值进度条 */}
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 relative"
                  style={{ width: `${experiencePercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 主导航菜单 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navigationItems.map((item, index) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <div key={item.id} className="relative group">
                <Link
                  href={item.path}
                  className={clsx(
                    "relative flex items-center rounded-xl transition-all duration-300 overflow-hidden",
                    "hover:scale-[1.02] hover:shadow-lg",
                    sidebarCollapsed
                      ? "justify-center px-2 py-3"
                      : "justify-start px-4 py-3",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"
                      : "hover:bg-gray-800/50",
                  )}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  {/* 背景能量效果 */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 animate-pulse" />
                  )}

                  {/* 左侧能量指示器 */}
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-r" />
                  )}

                  {/* 图标容器 */}
                  <div
                    className={clsx(
                      "relative flex items-center justify-center rounded-lg transition-all duration-300",
                      sidebarCollapsed ? "w-8 h-8" : "w-8 h-8 mr-3",
                      isActive &&
                        `bg-gradient-to-br ${item.energyColor} shadow-lg`,
                    )}
                  >
                    <item.icon
                      className={clsx(
                        "transition-all duration-300",
                        sidebarCollapsed ? "w-5 h-5" : "w-5 h-5",
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-cyan-400",
                      )}
                    />

                    {/* 神秘符号悬浮效果 */}
                    {hoveredItem === item.id && (
                      <div className="absolute -top-1 -right-1 text-xs animate-bounce">
                        {item.mysticSymbol}
                      </div>
                    )}
                  </div>

                  {/* 文字标签 */}
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={clsx(
                            "font-medium transition-colors duration-300",
                            isActive
                              ? "text-white"
                              : "text-gray-300 group-hover:text-white",
                          )}
                        >
                          {item.name}
                        </span>

                        {/* 中国元素标识 */}
                        {hoveredItem === item.id && (
                          <span className="text-xs text-cyan-400 opacity-70 font-mono">
                            {item.chineseElement}
                          </span>
                        )}
                      </div>

                      <p
                        className={clsx(
                          "text-xs mt-0.5 transition-colors duration-300",
                          isActive ? "text-cyan-200" : "text-gray-500",
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* 折叠状态下的神秘提示框 */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/95 border border-cyan-500/30 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 backdrop-blur-sm">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.description}
                      </div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-t border-cyan-500/30 rotate-45" />
                    </div>
                  )}
                </Link>

                {/* 路径连接线动画 */}
                {isActive && index < navigationItems.length - 1 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-4 bg-gradient-to-b from-cyan-400/50 to-transparent" />
                )}
              </div>
            );
          })}
        </nav>

        {/* 快捷功能区 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-cyan-500/20">
            <div className="space-y-2">
              <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse" />
                快捷传送
              </h5>

              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.path}
                    className="group relative p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className={clsx(
                        "w-6 h-6 mx-auto mb-1 rounded bg-gradient-to-br",
                        action.energyColor,
                        "flex items-center justify-center group-hover:shadow-lg transition-all",
                      )}
                    >
                      <action.icon className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-xs text-gray-400 text-center truncate group-hover:text-gray-200 transition-colors">
                      {action.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 底部状态信息 */}
        <div className="p-4 border-t border-cyan-500/20">
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 text-center flex items-center justify-center">
                <div className="w-1 h-1 bg-green-400 rounded-full mr-2 animate-pulse" />
                🌟 今日价值创造
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-gray-400">连接数</div>
                  <div className="text-cyan-400 font-medium">
                    {userStats.connectionsCount}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">价值点</div>
                  <div className="text-purple-400 font-medium">
                    {userStats.valuePoints}
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: "68%" }}
                />
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-400">
                  连续登录 {userStats.dailyStreak} 天
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold relative">
                68%
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        .consciousness-bg {
          position: relative;
        }

        .consciousness-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00ffff, #ff00ff);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00cccc, #cc00cc);
        }

        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
