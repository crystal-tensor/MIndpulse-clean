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
          data-oid="v7_rvfe"
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
        data-oid="qm3sa:_"
      >
        {/* 背景神秘图案 */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden"
          data-oid="1x.c2ao"
        >
          <div
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            data-oid=":.ap34c"
          >
            <div
              className="w-48 h-48 border border-cyan-400/30 rounded-full animate-spin-slow"
              style={{ animationDuration: "20s" }}
              data-oid="hzo9pdd"
            />
          </div>
          <div
            className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2"
            data-oid="e4:j47o"
          >
            <div
              className="w-32 h-32 border border-purple-400/20 rounded-full animate-spin-slow"
              style={{
                animationDuration: "30s",
                animationDirection: "reverse",
              }}
              data-oid="a34bk:k"
            />
          </div>
        </div>

        {/* Logo区域 - MindPulse品牌 */}
        <div
          className="flex items-center justify-between p-4 border-b border-cyan-500/20 relative z-10"
          data-oid="_bwpdcj"
        >
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3" data-oid="ptl89nd">
              <div className="relative group" data-oid="wy28jz4">
                <div
                  className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative overflow-hidden"
                  data-oid="i3s1tz6"
                >
                  <span
                    className="text-white font-bold text-lg relative z-10 font-mono"
                    data-oid="f4wktdx"
                  >
                    M
                  </span>
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 animate-pulse"
                    data-oid="1g-g8ir"
                  />
                  <div
                    className="energy-pulse absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                    data-oid="dw-ahu0"
                  />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                  data-oid="c5.2hkx"
                />

                {/* 悬浮时的神秘符文 */}
                <div
                  className="absolute -inset-2 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  data-oid="0nvcgdz"
                >
                  <div
                    className="w-full h-full border border-cyan-400/50 rounded-xl animate-pulse"
                    data-oid="_mnwo3b"
                  />
                </div>
              </div>

              <div data-oid="4oe7:15">
                <span
                  className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                  data-oid="58pt-uf"
                >
                  MindPulse
                </span>
                <div
                  className="flex items-center space-x-1 mt-0.5"
                  data-oid="25bayc3"
                >
                  <div
                    className="w-1 h-1 bg-green-400 rounded-full animate-pulse"
                    data-oid="mi52ih4"
                  />
                  <p className="text-xs text-gray-400" data-oid="vd3xnd5">
                    量子智能引擎
                  </p>
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
            data-oid="57m9eln"
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon
                className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all"
                data-oid="0ojo50z"
              />
            ) : (
              <ChevronLeftIcon
                className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all"
                data-oid="0u.903h"
              />
            )}

            {/* 能量光环效果 */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              data-oid="c-vz-kz"
            >
              <div
                className="w-full h-full bg-cyan-400/10 rounded-lg animate-pulse"
                data-oid="_2pmto2"
              />
            </div>
          </button>
        </div>

        {/* 用户等级状态 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-cyan-500/20" data-oid="9i2zlwt">
            <div className="space-y-3" data-oid="7.xwqze">
              <div
                className="flex items-center justify-between"
                data-oid="uxypq2:"
              >
                <div className="flex items-center space-x-2" data-oid="clu9lkg">
                  <BoltIcon
                    className="w-4 h-4 text-yellow-400"
                    data-oid="bvt54-f"
                  />
                  <span className="text-xs text-gray-400" data-oid="_m.lw_6">
                    Lv.{userStats.level}
                  </span>
                </div>
                <span
                  className="text-xs text-cyan-400 font-medium"
                  data-oid="2sd6ikw"
                >
                  {userStats.experience}/{userStats.nextLevelXP} XP
                </span>
              </div>

              {/* 经验值进度条 */}
              <div
                className="w-full bg-gray-700 rounded-full h-2 overflow-hidden"
                data-oid=":x1fj-n"
              >
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 relative"
                  style={{ width: `${experiencePercentage}%` }}
                  data-oid="xlpwe8l"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                    data-oid="u.vuem9"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 主导航菜单 */}
        <nav
          className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar"
          data-oid=":7m93n5"
        >
          {navigationItems.map((item, index) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <div key={item.id} className="relative group" data-oid="c5v0lpf">
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
                  data-oid="vo5w:7o"
                >
                  {/* 背景能量效果 */}
                  {isActive && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 animate-pulse"
                      data-oid="b_es980"
                    />
                  )}

                  {/* 左侧能量指示器 */}
                  {isActive && !sidebarCollapsed && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-r"
                      data-oid="k9ud-bv"
                    />
                  )}

                  {/* 图标容器 */}
                  <div
                    className={clsx(
                      "relative flex items-center justify-center rounded-lg transition-all duration-300",
                      sidebarCollapsed ? "w-8 h-8" : "w-8 h-8 mr-3",
                      isActive &&
                        `bg-gradient-to-br ${item.energyColor} shadow-lg`,
                    )}
                    data-oid="0ps-ktp"
                  >
                    <item.icon
                      className={clsx(
                        "transition-all duration-300",
                        sidebarCollapsed ? "w-5 h-5" : "w-5 h-5",
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-cyan-400",
                      )}
                      data-oid="2z_8mfu"
                    />

                    {/* 神秘符号悬浮效果 */}
                    {hoveredItem === item.id && (
                      <div
                        className="absolute -top-1 -right-1 text-xs animate-bounce"
                        data-oid="uzwt:ai"
                      >
                        {item.mysticSymbol}
                      </div>
                    )}
                  </div>

                  {/* 文字标签 */}
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0" data-oid="4uf2ar:">
                      <div
                        className="flex items-center justify-between"
                        data-oid="4twugkk"
                      >
                        <span
                          className={clsx(
                            "font-medium transition-colors duration-300",
                            isActive
                              ? "text-white"
                              : "text-gray-300 group-hover:text-white",
                          )}
                          data-oid="n9-01l_"
                        >
                          {item.name}
                        </span>

                        {/* 中国元素标识 */}
                        {hoveredItem === item.id && (
                          <span
                            className="text-xs text-cyan-400 opacity-70 font-mono"
                            data-oid="5:lzb6s"
                          >
                            {item.chineseElement}
                          </span>
                        )}
                      </div>

                      <p
                        className={clsx(
                          "text-xs mt-0.5 transition-colors duration-300",
                          isActive ? "text-cyan-200" : "text-gray-500",
                        )}
                        data-oid="hv7p46i"
                      >
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* 折叠状态下的神秘提示框 */}
                  {sidebarCollapsed && (
                    <div
                      className="absolute left-full ml-3 px-3 py-2 bg-gray-900/95 border border-cyan-500/30 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 backdrop-blur-sm"
                      data-oid="9c3156d"
                    >
                      <div className="font-medium" data-oid="o.26s_a">
                        {item.name}
                      </div>
                      <div
                        className="text-xs text-gray-400 mt-1"
                        data-oid=":4lfips"
                      >
                        {item.description}
                      </div>
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-t border-cyan-500/30 rotate-45"
                        data-oid="-k8xx1j"
                      />
                    </div>
                  )}
                </Link>

                {/* 路径连接线动画 */}
                {isActive && index < navigationItems.length - 1 && (
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-4 bg-gradient-to-b from-cyan-400/50 to-transparent"
                    data-oid="9n-vsvt"
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* 快捷功能区 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-cyan-500/20" data-oid="kpd-eyb">
            <div className="space-y-2" data-oid="y8:29ia">
              <h5
                className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center"
                data-oid="bo77r8p"
              >
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"
                  data-oid="dy0t9zg"
                />
                快捷传送
              </h5>

              <div className="grid grid-cols-3 gap-2" data-oid="-:-ebc6">
                {quickActions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.path}
                    className="group relative p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-105"
                    data-oid="ld9w9w1"
                  >
                    <div
                      className={clsx(
                        "w-6 h-6 mx-auto mb-1 rounded bg-gradient-to-br",
                        action.energyColor,
                        "flex items-center justify-center group-hover:shadow-lg transition-all",
                      )}
                      data-oid="0pg0idd"
                    >
                      <action.icon
                        className="w-3 h-3 text-white"
                        data-oid="u5d0m1o"
                      />
                    </div>
                    <div
                      className="text-xs text-gray-400 text-center truncate group-hover:text-gray-200 transition-colors"
                      data-oid=":-.bl5m"
                    >
                      {action.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 底部状态信息 */}
        <div className="p-4 border-t border-cyan-500/20" data-oid="e5zg.hp">
          {!sidebarCollapsed ? (
            <div className="space-y-3" data-oid="pis5gs3">
              <div
                className="text-xs text-gray-500 text-center flex items-center justify-center"
                data-oid="u6:d41l"
              >
                <div
                  className="w-1 h-1 bg-green-400 rounded-full mr-2 animate-pulse"
                  data-oid="680m8ag"
                />
                🌟 今日价值创造
              </div>

              <div
                className="grid grid-cols-2 gap-4 text-xs"
                data-oid="30f6x_k"
              >
                <div className="text-center" data-oid="goglb0c">
                  <div className="text-gray-400" data-oid="91026:k">
                    连接数
                  </div>
                  <div className="text-cyan-400 font-medium" data-oid="v42-ond">
                    {userStats.connectionsCount}
                  </div>
                </div>
                <div className="text-center" data-oid="oyax-1f">
                  <div className="text-gray-400" data-oid="-u-l.0i">
                    价值点
                  </div>
                  <div
                    className="text-purple-400 font-medium"
                    data-oid="x9z3zd5"
                  >
                    {userStats.valuePoints}
                  </div>
                </div>
              </div>

              <div
                className="w-full bg-gray-700 rounded-full h-1.5"
                data-oid="1n2s6x5"
              >
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: "68%" }}
                  data-oid="vhfo8u:"
                />
              </div>

              <div className="text-center" data-oid="3uma__d">
                <div className="text-xs text-gray-400" data-oid="zq27hnr">
                  连续登录 {userStats.dailyStreak} 天
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" data-oid="7vnzpr6">
              <div
                className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold relative"
                data-oid="ve-gbm."
              >
                68%
                <div
                  className="absolute inset-0 bg-white/20 rounded-full animate-ping"
                  data-oid="fykah4h"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 自定义样式 */}
      <style jsx data-oid="2gu2y-_">{`
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
