"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useBrowser } from "@/lib/store";
import { clsx } from "clsx";

interface FullScreenBrowserProps {
  url: string;
  onClose: () => void;
}

export default function FullScreenBrowser({ url, onClose }: FullScreenBrowserProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [urlInput, setUrlInput] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const [isUrlEditing, setIsUrlEditing] = useState(false);
  const [history, setHistory] = useState<string[]>([url]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // 模拟页面加载
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentUrl]);

  // 导航处理
  const handleNavigation = (newUrl: string) => {
    setCurrentUrl(newUrl);
    setUrlInput(newUrl);
    setIsUrlEditing(false);

    // 添加到历史记录
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // URL输入处理
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      let processedUrl = urlInput.trim();
      
      // 如果不是完整URL，添加https://
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }
      
      handleNavigation(processedUrl);
    }
  };

  // 后退
  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const targetUrl = history[newIndex];
      setCurrentUrl(targetUrl);
      setUrlInput(targetUrl);
    }
  };

  // 前进
  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const targetUrl = history[newIndex];
      setCurrentUrl(targetUrl);
      setUrlInput(targetUrl);
    }
  };

  // 刷新
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // 检查是否为有效的URL
  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-gray-900 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-b border-cyan-500/20 p-3">
        <div className="flex items-center space-x-4">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-300 hover:text-white"
            title="关闭"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* 导航控制按钮 */}
          <div className="flex items-center space-x-2">
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
          </div>

          {/* 地址栏 */}
          <form onSubmit={handleUrlSubmit} className="flex-1 max-w-4xl">
            <div className="relative">
              {!isUrlEditing && isValidUrl(currentUrl) && (
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
                onBlur={() => setIsUrlEditing(false)}
                className={clsx(
                  "w-full px-4 py-2 bg-gray-800 border border-gray-600",
                  "rounded-lg text-white placeholder-gray-400",
                  "focus:outline-none focus:border-cyan-500 transition-colors",
                  !isUrlEditing && isValidUrl(currentUrl) && "pl-10"
                )}
                placeholder="输入网址或搜索..."
              />
            </div>
          </form>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">正在加载页面...</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-white">
            {isValidUrl(currentUrl) ? (
              <iframe
                src={currentUrl}
                className="w-full h-full border-0"
                title="浏览器内容"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">无效的网址</h2>
                  <p className="text-gray-600">请输入有效的网址，例如：https://www.example.com</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 