"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  HomeIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  BellIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  UserIcon,
  ChevronDownIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useUI, useNotifications, useBrowser } from "@/lib/store";
import { clsx } from "clsx";
import FullScreenBrowser from "./FullScreenBrowser";

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
  isLoading?: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder?: string;
}

interface BrowserHistory {
  url: string;
  title: string;
  timestamp: number;
}

export default function MindPulseHeader() {
  const { sidebarCollapsed, isMobile, setFullScreenBrowserOpen } = useUI();
  const { unreadCount } = useNotifications();
  const {
    currentUrl,
    isLoading,
    tabs,
    history,
    historyIndex,
    bookmarks,
    setCurrentUrl,
    setIsLoading,
    addTab,
    removeTab,
    switchTab,
    updateTab,
    addToHistory,
    navigateHistory,
    addBookmark,
    removeBookmark,
  } = useBrowser();

  const [urlInput, setUrlInput] = useState(currentUrl);
  const [isUrlEditing, setIsUrlEditing] = useState(false);

  // 全屏浏览器状态
  const [showFullScreenBrowser, setShowFullScreenBrowser] = useState(false);
  const [fullScreenUrl, setFullScreenUrl] = useState("");

  // 下拉菜单状态
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("中文");

  // 语言选项
  const languages = [
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
  ];

  // 能量粒子背景效果
  useEffect(() => {
    const interval = setInterval(() => {
      const particles = document.querySelectorAll(".energy-particle");
      particles.forEach((particle, index) => {
        const delay = index * 200;
        setTimeout(() => {
          (particle as HTMLElement).style.animationDelay =
            `${Math.random() * 2}s`;
        }, delay);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 导航处理
  const handleNavigation = useCallback(
    (url: string, shouldAddToHistory = true) => {
      setCurrentUrl(url);
      setUrlInput(url);
      setIsUrlEditing(false);
      setIsLoading(true);

      // 添加到历史记录
      if (shouldAddToHistory) {
        addToHistory({
          url,
          title: getPageTitle(url),
        });
      }

      // 更新当前标签页
      const activeTab = tabs.find((tab) => tab.isActive);
      if (activeTab) {
        updateTab(activeTab.id, {
          url,
          title: getPageTitle(url),
          isLoading: true,
        });
      }

      // 模拟加载延迟
      setTimeout(() => {
        setIsLoading(false);
        if (activeTab) {
          updateTab(activeTab.id, { isLoading: false });
        }
      }, 800);
    },
    [setCurrentUrl, setIsLoading, addToHistory, updateTab, tabs],
  );

  // 后退/前进
  const handleBack = () => {
    navigateHistory("back");
  };

  const handleForward = () => {
    navigateHistory("forward");
  };

  // 刷新
  const handleRefresh = () => {
    setIsLoading(true);
    const activeTab = tabs.find((tab) => tab.isActive);
    if (activeTab) {
      updateTab(activeTab.id, { isLoading: true });
    }

    setTimeout(() => {
      setIsLoading(false);
      if (activeTab) {
        updateTab(activeTab.id, { isLoading: false });
      }
    }, 1000);
  };

  // 回到主页
  const handleHome = () => {
    handleNavigation("mindpulse://consciousness-hub");
  };

  // URL输入处理
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      const processedUrl = urlInput.trim();

      // 检查是否为外部网址
      if (
        processedUrl.startsWith("http://") ||
        processedUrl.startsWith("https://") ||
        (!processedUrl.startsWith("mindpulse://") && processedUrl.includes("."))
      ) {
        // 外部网址，打开全屏浏览器
        let finalUrl = processedUrl;
        if (
          !processedUrl.startsWith("http://") &&
          !processedUrl.startsWith("https://")
        ) {
          finalUrl = `https://${processedUrl}`;
        }
        setFullScreenUrl(finalUrl);
        setShowFullScreenBrowser(true);
        setFullScreenBrowserOpen(true);
      } else {
        // 内部导航
        handleNavigation(processedUrl);
      }
    }
  };

  // 获取页面标题
  const getPageTitle = (url: string): string => {
    const titleMap: { [key: string]: string } = {
      "mindpulse://consciousness-hub": "意识枢纽",
      "mindpulse://knowledge-graph": "灵境回廊",
      "mindpulse://ai-exploration": "智核交互",
      "mindpulse://quantum-decisions": "命运织机",
      "mindpulse://marketplace": "奇点交易所",
      "mindpulse://profile": "自我机体",
    };
    return titleMap[url] || "MindPulse";
  };

  // 添加新标签页
  const handleAddNewTab = () => {
    addTab({
      title: "新标签页",
      url: "mindpulse://consciousness-hub",
      isActive: true,
    });
    handleNavigation("mindpulse://consciousness-hub");
  };

  // 关闭标签页
  const handleCloseTab = (tabId: string) => {
    removeTab(tabId);
  };

  // 切换标签页
  const handleSwitchTab = (tabId: string) => {
    switchTab(tabId);
    const targetTab = tabs.find((tab) => tab.id === tabId);
    if (targetTab) {
      setUrlInput(targetTab.url);
    }
  };

  // 添加书签
  const handleAddBookmark = () => {
    addBookmark({
      title: getPageTitle(currentUrl),
      url: currentUrl,
    });
  };

  return (
    <header
      className={clsx(
        "fixed top-0 right-0 z-[9998] transition-all duration-300",
        "bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95",
        "backdrop-blur-md border-b border-cyan-500/20",
        "mindpulse-browser-header",
        sidebarCollapsed ? "left-16" : "left-64",
        isMobile && "left-0",
      )}
    >
      {/* 能量粒子背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="energy-particle"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* 标签页栏 */}
      <div className="flex items-center px-2 py-1 border-b border-gray-700/50 relative z-10">
        <div className="flex items-center space-x-1 flex-1 min-w-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={clsx(
                "group flex items-center px-3 py-1.5 rounded-t-md cursor-pointer",
                "transition-all duration-200 max-w-xs min-w-0",
                tab.isActive
                  ? "bg-gray-800 border-t border-x border-cyan-500/30"
                  : "bg-gray-900/50 hover:bg-gray-800/70",
              )}
              onClick={() => handleSwitchTab(tab.id)}
            >
              {tab.isLoading && (
                <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
              )}
              <span className="text-xs text-gray-300 truncate flex-1">
                {tab.title}
              </span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(tab.id);
                  }}
                  className="ml-2 p-0.5 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          ))}

          {/* 新建标签页按钮 */}
          <button
            onClick={handleAddNewTab}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
            title="新建标签页"
          >
            <PlusIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 主要导航栏 */}
      <div className="flex items-center px-4 py-2 relative z-10">
        {/* 导航控制按钮 */}
        <div className="flex items-center space-x-1 mr-4">
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              historyIndex <= 0
                ? "text-gray-600 cursor-not-allowed"
                : "text-cyan-400 hover:bg-cyan-500/20",
            )}
            title="后退"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              historyIndex >= history.length - 1
                ? "text-gray-600 cursor-not-allowed"
                : "text-cyan-400 hover:bg-cyan-500/20",
            )}
            title="前进"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            title="刷新"
          >
            <ArrowPathIcon
              className={clsx("w-4 h-4", isLoading && "animate-spin")}
            />
          </button>
          <button
            onClick={handleHome}
            className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            title="主页"
          >
            <HomeIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 地址栏 */}
        <form onSubmit={handleUrlSubmit} className="flex-1 max-w-2xl mx-4">
          <div className="relative group">
            {!isUrlEditing && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            )}
            <input
              type="text"
              value={isUrlEditing ? urlInput : currentUrl}
              onChange={(e) => setUrlInput(e.target.value)}
              onFocus={() => {
                setIsUrlEditing(true);
                setUrlInput(currentUrl);
              }}
              onBlur={() => {
                if (!urlInput.trim()) {
                  setIsUrlEditing(false);
                  setUrlInput(currentUrl);
                }
              }}
              placeholder="输入 MindPulse 地址或搜索..."
              className={clsx(
                "w-full py-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400",
                "text-gray-100 placeholder-gray-400 backdrop-blur-sm",
                "hover:border-cyan-400/50 transition-all duration-300",
                "text-sm leading-normal",
                isUrlEditing ? "pl-3 pr-4" : "pl-8 pr-4",
              )}
            />

            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </form>

        {/* 右侧功能按钮 */}
        <div className="flex items-center space-x-2">
          {/* 书签按钮 */}
          <div className="relative">
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              title="书签"
            >
              <BookmarkIcon className="w-4 h-4" />
            </button>

            {showBookmarks && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">书签</h3>
                    <button
                      onClick={handleAddBookmark}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      添加当前页
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {bookmarks.map((bookmark) => (
                    <button
                      key={bookmark.id}
                      onClick={() => {
                        handleNavigation(bookmark.url);
                        setShowBookmarks(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-sm text-white truncate">
                        {bookmark.title}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {bookmark.url}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 语言切换 */}
          <div className="relative">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center space-x-1 p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              title="语言"
            >
              <GlobeAltIcon className="w-4 h-4" />
              <ChevronDownIcon className="w-3 h-3" />
            </button>

            {showLanguages && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-xl z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLanguage(lang.name);
                      setShowLanguages(false);
                    }}
                    className={clsx(
                      "w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-700 transition-colors",
                      currentLanguage === lang.name && "bg-gray-700",
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-sm text-white">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 通知 */}
          <button
            className="relative p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            title="通知"
          >
            <BellIcon className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* 更多选项 */}
          <button
            className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            title="更多"
          >
            <EllipsisHorizontalIcon className="w-4 h-4" />
          </button>

          {/* 用户菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-cyan-500/20 transition-colors"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <ChevronDownIcon className="w-3 h-3 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-gray-700">
                  <div className="text-sm font-medium text-white">张小明</div>
                  <div className="text-xs text-gray-400">
                    mindpulse@example.com
                  </div>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    <UserIcon className="w-4 h-4 mr-3" />
                    个人资料
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    <Cog6ToothIcon className="w-4 h-4 mr-3" />
                    设置
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        .energy-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: linear-gradient(45deg, #00ffff, #ff00ff);
          border-radius: 50%;
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-10px) scale(1.2);
            opacity: 1;
          }
        }

        .mindpulse-browser-header {
          box-shadow: 0 4px 20px rgba(0, 255, 255, 0.1);
        }
      `}</style>

      {/* 全屏浏览器 */}
      {showFullScreenBrowser && (
        <FullScreenBrowser
          url={fullScreenUrl}
          onClose={() => {
            setShowFullScreenBrowser(false);
            setFullScreenBrowserOpen(false);
          }}
        />
      )}
    </header>
  );
}
