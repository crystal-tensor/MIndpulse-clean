'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WalletIcon,
  UserIcon,
  ChartBarIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
  CpuChipIcon,
  BanknotesIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  MapIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  HeartIcon,
  EyeIcon,
  LinkIcon,
  UserGroupIcon,
  BoltIcon,
  GlobeAltIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ClockIcon,
  TagIcon,
  BeakerIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  HandRaisedIcon,
  BookOpenIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  Bars3Icon,
  Squares2X2Icon,
  ListBulletIcon,
  CalendarIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

// 用户角色类型
type UserRole = 'tech' | 'resource' | 'capital' | 'hybrid';

// 资产类型
interface TechAsset {
  id: string;
  name: string;
  type: 'digital_twin' | 'agent' | 'knowledge_graph';
  description: string;
  creator: string;
  price: number;
  rating: number;
  usage: number;
  avatar: string;
  tags: string[];
  createdAt: Date;
  featured: boolean;
  // V2新增字段
  revenueShare: {
    tech: number;
    resource: number;
    capital: number;
    platform: number;
  };
  creditScore: number;
  collaborationCount: number;
  successRate: number;
}

// 需求数据
interface ResourceDemand {
  id: string;
  title: string;
  description: string;
  industry: string;
  budget: number;
  deadline: string;
  requirements: string[];
  publisher: string;
  publisherRating: number;
  status: 'active' | 'matched' | 'completed';
  matchedTech?: string;
  estimatedRevenue: number;
  urgency: 'low' | 'medium' | 'high';
}

// 资金方数据
interface CapitalProvider {
  id: string;
  name: string;
  avatar: string;
  focus: string[];
  budget: string;
  investmentStyle: string;
  successfulProjects: number;
  averageReturn: number;
  creditScore: number;
  preferences: {
    riskLevel: 'low' | 'medium' | 'high';
    returnExpectation: number;
    investmentHorizon: string;
  };
}

// 枢纽价值数据
interface HubValue {
  userId: string;
  userName: string;
  role: UserRole;
  connections: number;
  totalValue: number;
  creditScore: number;
  badges: string[];
  monthlyGrowth: number;
}

export default function SingularityExchangeV2() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'flow' | 'tech' | 'resource' | 'capital' | 'hub'>('flow');
  const [selectedRole, setSelectedRole] = useState<UserRole>('hybrid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<TechAsset | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<ResourceDemand | null>(null);
  const [showRevShareCalculator, setShowRevShareCalculator] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    techShare: 30,
    resourceShare: 40,
    capitalShare: 20,
    platformShare: 10,
    totalRevenue: 100000,
  });

  // 主要的渲染逻辑
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* 顶部导航 */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">奇点交易所 V2</h1>
                  <p className="text-xs text-purple-300">资源流转中枢</p>
                </div>
              </div>
              
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveView('flow')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === 'flow' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <ArrowPathIcon className="w-4 h-4 inline mr-1" />
                  资源流转
                </button>
                <button
                  onClick={() => setActiveView('tech')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === 'tech' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <CpuChipIcon className="w-4 h-4 inline mr-1" />
                  技术产品库
                </button>
                <button
                  onClick={() => setActiveView('resource')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === 'resource' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <HandRaisedIcon className="w-4 h-4 inline mr-1" />
                  资源需求墙
                </button>
                <button
                  onClick={() => setActiveView('capital')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === 'capital' 
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <BanknotesIcon className="w-4 h-4 inline mr-1" />
                  资金对接池
                </button>
                <button
                  onClick={() => setActiveView('hub')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === 'hub' 
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <MapIcon className="w-4 h-4 inline mr-1" />
                  价值热力图
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索技术、需求或资金..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <WalletIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300">¥99,999</span>
              </div>
              
              <button className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <UserIcon className="w-5 h-5 text-purple-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'flow' && <ResourceFlowView />}
        {activeView === 'tech' && <TechProductView />}
        {activeView === 'resource' && <ResourceDemandView />}
        {activeView === 'capital' && <CapitalPoolView />}
        {activeView === 'hub' && <ValueHeatmapView />}
      </main>

      {/* 分账计算器模态框 */}
      {showRevShareCalculator && (
        <RevenueShareCalculator 
          onClose={() => setShowRevShareCalculator(false)}
          data={calculatorData}
          onUpdate={setCalculatorData}
        />
      )}
    </div>
  );
}

// 资源流转视图组件
function ResourceFlowView() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">资源流转中枢</h2>
        <p className="text-gray-300">让技术方专注创造，资源方高效嫁接，资金方精准投资</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 技术方区域 */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-300">技术方</h3>
            <span className="text-sm text-blue-400">出专利占20%</span>
          </div>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-white">156</div>
            <div className="text-sm text-gray-300">活跃技术创作者</div>
            <div className="text-sm text-blue-300">平均收益分成: 30%</div>
          </div>
        </div>

        {/* 资源方区域 */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-300">资源方</h3>
            <span className="text-sm text-green-400">嫁接需求获40%</span>
          </div>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-white">89</div>
            <div className="text-sm text-gray-300">活跃资源连接者</div>
            <div className="text-sm text-green-300">平均收益分成: 40%</div>
          </div>
        </div>

        {/* 资金方区域 */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-yellow-300">资金方</h3>
            <span className="text-sm text-yellow-400">出资占40%</span>
          </div>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-white">234</div>
            <div className="text-sm text-gray-300">活跃投资者</div>
            <div className="text-sm text-yellow-300">平均收益分成: 20%</div>
          </div>
        </div>
      </div>

      {/* 流转可视化 */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">实时资源流转</h3>
        <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <ArrowPathIcon className="w-12 h-12 mx-auto mb-2 animate-spin" />
            <p>资源流转可视化图表</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 技术产品视图组件
function TechProductView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">技术产品库</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <PlusIcon className="w-4 h-4 inline mr-2" />
          发布技术产品
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 技术产品卡片 */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl">🧠</div>
            <div className="text-sm text-blue-300">数字分身</div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">智能投资顾问</h3>
          <p className="text-sm text-gray-300 mb-4">专业的AI投资顾问，具备深度市场分析能力</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">@金融大师</span>
            <span className="text-yellow-400">⭐ 4.9</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">分账预设</div>
            <div className="flex justify-between text-xs">
              <span>技术30%</span>
              <span>资源40%</span>
              <span>资金20%</span>
              <span>平台10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 资源需求视图组件
function ResourceDemandView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">资源需求墙</h2>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          <PlusIcon className="w-4 h-4 inline mr-2" />
          发布需求
        </button>
      </div>
      
      <div className="space-y-4">
        {/* 需求卡片 */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-400">紧急需求</span>
            </div>
            <span className="text-sm text-gray-400">2小时前</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">跨境电商需AI客服分身</h3>
          <p className="text-sm text-gray-300 mb-4">寻找专业的AI客服解决方案，支持多语言，24小时在线</p>
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-semibold">预算: ¥50万</span>
            <span className="text-yellow-400">预计收益: ¥20万</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 资金对接池视图组件
function CapitalPoolView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">资金对接池</h2>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
          <PlusIcon className="w-4 h-4 inline mr-2" />
          注册资金方
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 资金方卡片 */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">李</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">李总</h3>
              <p className="text-sm text-gray-400">专注AIGC赛道</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">投资偏好</span>
              <span className="text-yellow-400">AI应用</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">预算范围</span>
              <span className="text-white">50-200万</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">信用评分</span>
              <span className="text-green-400">AAA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 价值热力图视图组件
function ValueHeatmapView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">价值热力图</h2>
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">枢纽价值分布</h3>
        <div className="h-96 bg-gray-900/50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <MapIcon className="w-12 h-12 mx-auto mb-2" />
            <p>价值热力图可视化</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 分账计算器组件
function RevenueShareCalculator({ onClose, data, onUpdate }: {
  onClose: () => void;
  data: any;
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">分账计算器</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">预计总收益</label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              value={data.totalRevenue}
              onChange={(e) => onUpdate({ ...data, totalRevenue: parseInt(e.target.value) })}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">技术方分成</span>
              <span className="text-blue-400">{data.techShare}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">资源方分成</span>
              <span className="text-green-400">{data.resourceShare}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">资金方分成</span>
              <span className="text-yellow-400">{data.capitalShare}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">平台分成</span>
              <span className="text-purple-400">{data.platformShare}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            确认方案
          </button>
        </div>
      </div>
    </div>
  );
} 