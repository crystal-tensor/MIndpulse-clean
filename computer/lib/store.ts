import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// UI状态接口
interface UIState {
  sidebarCollapsed: boolean;
  isMobile: boolean;
  currentTheme: 'cyberpunk' | 'ethereal' | 'mystical';
  isFullScreenBrowserOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
  setTheme: (theme: UIState['currentTheme']) => void;
  setFullScreenBrowserOpen: (open: boolean) => void;
}

// 通知状态接口
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

// 用户状态接口
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  level: number;
  experience: number;
  valuePoints: number;
  setUser: (user: User | null) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  logout: () => void;
}

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface UserStats {
  level: number;
  experience: number;
  valuePoints: number;
  knowledgeNodes: number;
  connections: number;
  completedDecisions: number;
  dailyStreak: number;
}

// 应用状态接口
interface AppState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  setInitialized: (initialized: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 浏览器状态接口
interface BrowserState {
  currentUrl: string;
  isLoading: boolean;
  tabs: BrowserTab[];
  activeTabId: string;
  history: BrowserHistory[];
  historyIndex: number;
  bookmarks: BrowserBookmark[];
  setCurrentUrl: (url: string) => void;
  setIsLoading: (loading: boolean) => void;
  addTab: (tab: Omit<BrowserTab, 'id'>) => void;
  removeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<BrowserTab>) => void;
  addToHistory: (entry: Omit<BrowserHistory, 'timestamp'>) => void;
  navigateHistory: (direction: 'back' | 'forward') => void;
  addBookmark: (bookmark: Omit<BrowserBookmark, 'id'>) => void;
  removeBookmark: (bookmarkId: string) => void;
}

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
  isLoading?: boolean;
}

interface BrowserHistory {
  url: string;
  title: string;
  timestamp: number;
}

interface BrowserBookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder?: string;
}

// UI状态管理
export const useUI = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarCollapsed: false,
        isMobile: false,
        currentTheme: 'cyberpunk',
        isFullScreenBrowserOpen: false,
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }),
        setIsMobile: (mobile) => set({ isMobile: mobile }),
        setTheme: (theme) => set({ currentTheme: theme }),
        setFullScreenBrowserOpen: (open) => set({ isFullScreenBrowserOpen: open }),
      }),
      {
        name: 'mindpulse-ui-state',
        partialize: (state) => ({ 
          sidebarCollapsed: state.sidebarCollapsed,
          currentTheme: state.currentTheme 
        }),
      }
    ),
    { name: 'UI Store' }
  )
);

// 通知状态管理
export const useNotifications = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now(),
          read: false,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
          unreadCount: 0,
        })),
      removeNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;
          return {
            notifications: state.notifications.filter((notif) => notif.id !== id),
            unreadCount: wasUnread 
              ? Math.max(0, state.unreadCount - 1) 
              : state.unreadCount,
          };
        }),
    }),
    { name: 'Notifications Store' }
  )
);

// 用户状态管理
export const useUser = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        level: 1,
        experience: 0,
        valuePoints: 0,
        setUser: (user) =>
          set({ user, isAuthenticated: !!user }),
        updateUserStats: (stats) =>
          set((state) => ({
            level: stats.level ?? state.level,
            experience: stats.experience ?? state.experience,
            valuePoints: stats.valuePoints ?? state.valuePoints,
          })),
        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            level: 1,
            experience: 0,
            valuePoints: 0,
          }),
      }),
      {
        name: 'mindpulse-user-state',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          level: state.level,
          experience: state.experience,
          valuePoints: state.valuePoints,
        }),
      }
    ),
    { name: 'User Store' }
  )
);

// 应用状态管理
export const useApp = create<AppState>()(
  devtools(
    (set) => ({
      initialized: false,
      loading: false,
      error: null,
      setInitialized: (initialized) => set({ initialized }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: 'App Store' }
  )
);

// 浏览器状态管理
export const useBrowser = create<BrowserState>()(
  devtools(
    persist(
      (set, get) => ({
        currentUrl: "mindpulse://consciousness-hub",
        isLoading: false,
        tabs: [
          {
            id: "default-tab",
            title: "意识枢纽",
            url: "mindpulse://consciousness-hub",
            isActive: true,
          }
        ],
        activeTabId: "default-tab",
        history: [
          {
            url: "mindpulse://consciousness-hub",
            title: "意识枢纽",
            timestamp: Date.now(),
          }
        ],
        historyIndex: 0,
        bookmarks: [
          { id: "1", title: "意识枢纽", url: "mindpulse://consciousness-hub" },
          { id: "2", title: "灵境回廊", url: "mindpulse://knowledge-graph" },
          { id: "3", title: "智核交互", url: "mindpulse://ai-exploration" },
          { id: "4", title: "智能决策", url: "mindpulse://quantum-decisions" },
        ],
        setCurrentUrl: (url) => {
          set({ currentUrl: url });
          
          // 更新活跃标签页
          const state = get();
          const updatedTabs = state.tabs.map(tab =>
            tab.id === state.activeTabId
              ? { ...tab, url, title: getTitleFromUrl(url) }
              : tab
          );
          set({ tabs: updatedTabs });
        },
        setIsLoading: (loading) => set({ isLoading: loading }),
        addTab: (tabData) => {
          const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          const newTab: BrowserTab = { ...tabData, id };
          
          set((state) => ({
            tabs: [...state.tabs.map(tab => ({ ...tab, isActive: false })), { ...newTab, isActive: true }],
            activeTabId: id,
            currentUrl: newTab.url,
          }));
        },
        removeTab: (tabId) => {
          const state = get();
          if (state.tabs.length === 1) return; // 至少保留一个标签页
          
          const newTabs = state.tabs.filter(tab => tab.id !== tabId);
          const removedTab = state.tabs.find(tab => tab.id === tabId);
          
          if (removedTab?.isActive && newTabs.length > 0) {
            newTabs[0].isActive = true;
            set({
              tabs: newTabs,
              activeTabId: newTabs[0].id,
              currentUrl: newTabs[0].url,
            });
          } else {
            set({ tabs: newTabs });
          }
        },
        switchTab: (tabId) => {
          const state = get();
          const targetTab = state.tabs.find(tab => tab.id === tabId);
          if (!targetTab) return;
          
          const updatedTabs = state.tabs.map(tab => ({
            ...tab,
            isActive: tab.id === tabId
          }));
          
          set({
            tabs: updatedTabs,
            activeTabId: tabId,
            currentUrl: targetTab.url,
          });
        },
        updateTab: (tabId, updates) => {
          set((state) => ({
            tabs: state.tabs.map(tab =>
              tab.id === tabId ? { ...tab, ...updates } : tab
            ),
          }));
        },
        addToHistory: (entry) => {
          const timestamp = Date.now();
          const historyEntry: BrowserHistory = { ...entry, timestamp };
          
          set((state) => {
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), historyEntry];
            return {
              history: newHistory,
              historyIndex: newHistory.length - 1,
            };
          });
        },
        navigateHistory: (direction) => {
          const state = get();
          if (direction === 'back' && state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            const historyEntry = state.history[newIndex];
            set({
              historyIndex: newIndex,
              currentUrl: historyEntry.url,
            });
          } else if (direction === 'forward' && state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            const historyEntry = state.history[newIndex];
            set({
              historyIndex: newIndex,
              currentUrl: historyEntry.url,
            });
          }
        },
        addBookmark: (bookmarkData) => {
          const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          const newBookmark: BrowserBookmark = { ...bookmarkData, id };
          
          set((state) => ({
            bookmarks: [...state.bookmarks, newBookmark],
          }));
        },
        removeBookmark: (bookmarkId) => {
          set((state) => ({
            bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== bookmarkId),
          }));
        },
      }),
      {
        name: 'mindpulse-browser-state',
        partialize: (state) => ({
          bookmarks: state.bookmarks,
          history: state.history,
        }),
      }
    ),
    { name: 'Browser Store' }
  )
);

// 辅助函数
function getTitleFromUrl(url: string): string {
  const titleMap: { [key: string]: string } = {
    "mindpulse://consciousness-hub": "意识枢纽",
    "mindpulse://knowledge-graph": "灵境回廊",
    "mindpulse://ai-exploration": "智核交互",
    "mindpulse://quantum-decisions": "智能决策",
    "mindpulse://marketplace": "奇点交易所",
    "mindpulse://profile": "自我机体",
  };
  return titleMap[url] || url;
}

// 类型导出
export type { 
  UIState, 
  NotificationState, 
  UserState, 
  AppState, 
  BrowserState,
  User, 
  UserStats, 
  Notification,
  BrowserTab,
  BrowserHistory,
  BrowserBookmark 
}; 