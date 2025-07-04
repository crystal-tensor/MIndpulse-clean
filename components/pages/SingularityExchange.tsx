'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WalletIcon,
  UserIcon,
  HomeIcon,
  ChartBarIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
  ShareIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  QrCodeIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  TrophyIcon,
  FireIcon,
  SparklesIcon,
  CpuChipIcon,
  BookOpenIcon,
  BoltIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  LinkIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BeakerIcon,
  BuildingLibraryIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  PlusIcon,
  MinusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

// 资产类型定义
interface Asset {
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
}

// 用户钱包信息
interface Wallet {
  dcep: number;
  usdt: number;
  eth: number;
  balance: number;
}

// 支付方式
interface PaymentMethod {
  id: string;
  name: string;
  type: 'traditional' | 'crypto' | 'dcep';
  fee: string;
  time: string;
  icon: string;
  available: boolean;
}

export default function SingularityExchange() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'market' | 'assets' | 'wallet'>('market');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'usage'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);

  // 模拟数据
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: '智能投资顾问小王',
      type: 'digital_twin',
      description: '专业的AI投资顾问，具备深度市场分析能力，为您提供个性化的投资建议和风险管理方案。',
      creator: '@金融大师',
      price: 2999,
      rating: 4.9,
      usage: 2345,
      avatar: '🧠',
      tags: ['投资理财', '风险管理', '量化交易'],
      createdAt: new Date('2024-01-15'),
      featured: true,
    },
    {
      id: '2',
      name: 'Python编程助手',
      type: 'agent',
      description: '专业的Python编程AI助手，支持代码生成、调试、优化等功能，提升开发效率。',
      creator: '@代码大师',
      price: 599,
      rating: 4.7,
      usage: 1567,
      avatar: '🤖',
      tags: ['编程', 'Python', '代码生成'],
      createdAt: new Date('2024-02-01'),
      featured: false,
    },
    {
      id: '3',
      name: '量子计算理论图谱',
      type: 'knowledge_graph',
      description: '完整的量子计算理论知识图谱，包含核心概念、算法原理、应用场景等。',
      creator: '@量子专家',
      price: 1299,
      rating: 4.8,
      usage: 892,
      avatar: '🔗',
      tags: ['量子计算', '理论物理', '算法'],
      createdAt: new Date('2024-01-20'),
      featured: true,
    },
    {
      id: '4',
      name: '创意设计师小美',
      type: 'digital_twin',
      description: '专业的AI设计师，擅长平面设计、UI/UX设计、品牌设计等，创意无限。',
      creator: '@设计工作室',
      price: 1899,
      rating: 4.6,
      usage: 1234,
      avatar: '🎨',
      tags: ['设计', '创意', 'UI/UX'],
      createdAt: new Date('2024-01-25'),
      featured: false,
    },
    {
      id: '5',
      name: '自动化测试工具',
      type: 'agent',
      description: '智能化的自动化测试工具，支持多种测试框架，提高测试效率和质量。',
      creator: '@测试专家',
      price: 799,
      rating: 4.5,
      usage: 678,
      avatar: '⚙️',
      tags: ['自动化', '测试', '质量保证'],
      createdAt: new Date('2024-02-05'),
      featured: false,
    },
    {
      id: '6',
      name: '区块链技术知识库',
      type: 'knowledge_graph',
      description: '全面的区块链技术知识库，涵盖基础概念、技术架构、应用案例等。',
      creator: '@区块链研究院',
      price: 999,
      rating: 4.4,
      usage: 456,
      avatar: '⛓️',
      tags: ['区块链', '加密货币', '智能合约'],
      createdAt: new Date('2024-01-30'),
      featured: false,
    },
  ]);

  const [wallet, setWallet] = useState<Wallet>({
    dcep: 9999,
    usdt: 1234.56,
    eth: 0.5678,
    balance: 23456.78,
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'wechat',
      name: '微信支付',
      type: 'traditional',
      fee: '0%',
      time: '即时',
      icon: '💰',
      available: true,
    },
    {
      id: 'alipay',
      name: '支付宝',
      type: 'traditional',
      fee: '0%',
      time: '即时',
      icon: '💰',
      available: true,
    },
    {
      id: 'dcep',
      name: '数字人民币',
      type: 'dcep',
      fee: '0%',
      time: '即时',
      icon: '🇨🇳',
      available: true,
    },
    {
      id: 'usdt',
      name: 'USDT',
      type: 'crypto',
      fee: '~$0.01',
      time: '2-5分钟',
      icon: '🪙',
      available: true,
    },
    {
      id: 'eth',
      name: 'ETH',
      type: 'crypto',
      fee: '~$5-20',
      time: '2-5分钟',
      icon: '🪙',
      available: true,
    },
  ];

  // 过滤和排序资产
  const filteredAssets = assets
    .filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || asset.type === selectedCategory;
      const matchesPrice = asset.price >= priceRange[0] && asset.price <= priceRange[1];
      const matchesRating = asset.rating >= minRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'usage':
          return b.usage - a.usage;
        default:
          return 0;
      }
    });

  // 获取资产类型显示名称
  const getAssetTypeName = (type: string) => {
    switch (type) {
      case 'digital_twin':
        return '数字分身';
      case 'agent':
        return '智能Agent';
      case 'knowledge_graph':
        return '知识图谱';
      default:
        return type;
    }
  };

  // 获取资产类型图标
  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'digital_twin':
        return '🧠';
      case 'agent':
        return '🤖';
      case 'knowledge_graph':
        return '🔗';
      default:
        return '📦';
    }
  };

  // 处理资产购买
  const handleBuyAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowPaymentModal(true);
  };

  // 处理支付确认
  const handlePaymentConfirm = () => {
    if (selectedAsset && selectedPaymentMethod) {
      // 模拟支付处理
      alert(`正在使用${paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name}购买${selectedAsset.name}...`);
      setShowPaymentModal(false);
      setSelectedAsset(null);
      setSelectedPaymentMethod('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* 顶部导航栏 */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">💎</span>
                </div>
                <h1 className="text-xl font-bold text-white">奇点交易所</h1>
              </div>
              
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('market')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'market'
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <HomeIcon className="w-4 h-4 inline-block mr-2" />
                  市场
                </button>
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'assets'
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ChartBarIcon className="w-4 h-4 inline-block mr-2" />
                  我的资产
                </button>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'wallet'
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <WalletIcon className="w-4 h-4 inline-block mr-2" />
                  钱包
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索AI资产..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-2.5 w-5 h-5 text-white/50" />
              </div>
              
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                <LinkIcon className="w-4 h-4 inline-block mr-2" />
                连接钱包
              </button>
              
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
                <UserIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 左侧分类面板 */}
          <div className="w-64 space-y-6">
            {/* 资产分类 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <CubeIcon className="w-5 h-5 mr-2" />
                资产分类
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📂 全部资产
                </button>
                <button
                  onClick={() => setSelectedCategory('digital_twin')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedCategory === 'digital_twin'
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🧠 数字分身
                </button>
                <button
                  onClick={() => setSelectedCategory('agent')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedCategory === 'agent'
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🤖 智能Agent
                </button>
                <button
                  onClick={() => setSelectedCategory('knowledge_graph')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedCategory === 'knowledge_graph'
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🔗 知识图谱
                </button>
              </div>
            </div>

            {/* 筛选条件 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <FunnelIcon className="w-5 h-5 mr-2" />
                筛选条件
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">价格区间</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    />
                    <span className="text-white/50">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm mb-2 block">最低评分</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                  >
                    <option value={0}>不限</option>
                    <option value={3}>3星以上</option>
                    <option value={4}>4星以上</option>
                    <option value={4.5}>4.5星以上</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 市场统计 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                市场统计
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">今日交易量</span>
                  <span className="text-green-400">¥1,234,567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">活跃用户</span>
                  <span className="text-blue-400">12,345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">平均成交价</span>
                  <span className="text-yellow-400">¥1,899</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">上架资产</span>
                  <span className="text-purple-400">8,456</span>
                </div>
              </div>
            </div>
          </div>

          {/* 中央内容区域 */}
          <div className="flex-1 space-y-6">
            {/* 排序和筛选控制 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-white/70">排序方式：</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'usage')}
                    className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
                  >
                    <option value="rating">评分最高</option>
                    <option value="usage">使用最多</option>
                    <option value="price">价格最低</option>
                  </select>
                </div>
                
                <div className="text-white/70 text-sm">
                  共找到 {filteredAssets.length} 个资产
                </div>
              </div>
            </div>

            {/* 资产列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center text-xl">
                        {asset.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{asset.name}</h4>
                        <p className="text-white/70 text-sm">{getAssetTypeName(asset.type)}</p>
                      </div>
                    </div>
                    {asset.featured && (
                      <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">
                        精选
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {asset.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/70">{asset.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-white/70">{asset.usage}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserIcon className="w-4 h-4 text-green-400" />
                      <span className="text-white/70">{asset.creator}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {asset.tags.map((tag, index) => (
                      <span key={index} className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">
                      ¥{asset.price.toLocaleString()}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBuyAsset(asset)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        💰 立即购买
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                        👁️ 查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧信息面板 */}
          <div className="w-80 space-y-6">
            {/* 我的钱包 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <WalletIcon className="w-5 h-5 mr-2" />
                我的钱包
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">数字人民币</span>
                  <span className="text-white font-semibold">¥{wallet.dcep.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">USDT</span>
                  <span className="text-white font-semibold">{wallet.usdt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">ETH</span>
                  <span className="text-white font-semibold">{wallet.eth}</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">总价值</span>
                    <span className="text-green-400 font-bold">¥{wallet.balance.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm">
                    💳 充值
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm">
                    💸 提现
                  </button>
                </div>
              </div>
            </div>

            {/* 投资组合 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                投资组合
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">总价值</span>
                  <span className="text-green-400 font-bold">¥12,345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">今日收益</span>
                  <span className="text-green-400">+2.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">持有资产</span>
                  <span className="text-white">8个</span>
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors text-sm">
                  📈 查看详情
                </button>
              </div>
            </div>

            {/* 消息通知 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <BellIcon className="w-5 h-5 mr-2" />
                消息通知
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-white">🆕 新的出价通知</p>
                    <p className="text-white/70 text-xs">2分钟前</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-white">✅ 交易完成确认</p>
                    <p className="text-white/70 text-xs">1小时前</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-white">📊 资产评估更新</p>
                    <p className="text-white/70 text-xs">3小时前</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 推荐榜单 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <TrophyIcon className="w-5 h-5 mr-2" />
                推荐榜单
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <FireIcon className="w-4 h-4 text-red-400" />
                  <span className="text-white/70">本周热门</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/70">新晋精品</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                  <span className="text-white/70">高回报资产</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 支付模态框 */}
      {showPaymentModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">选择支付方式</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-white/50 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* 订单信息 */}
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <h4 className="text-white font-semibold mb-2">订单详情</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">商品</span>
                  <span className="text-white">{selectedAsset.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">类型</span>
                  <span className="text-white">{getAssetTypeName(selectedAsset.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">价格</span>
                  <span className="text-white">¥{selectedAsset.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">手续费</span>
                  <span className="text-white">¥0</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white/70">总计</span>
                    <span className="text-green-400">¥{selectedAsset.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 支付方式选择 */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">支付方式</h4>
              {paymentMethods.map((method) => (
                <div key={method.id} className="space-y-2">
                  <button
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`w-full p-3 rounded-lg border transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{method.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-white/70">
                            手续费: {method.fee} | 到账: {method.time}
                          </div>
                        </div>
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <CheckIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* 安全保障 */}
            <div className="bg-green-600/20 rounded-lg p-3 mt-6">
              <h4 className="text-green-400 font-semibold text-sm mb-2">🛡️ 安全保障</h4>
              <div className="space-y-1 text-xs text-green-300">
                <div>✅ 256位SSL加密传输</div>
                <div>✅ 第三方资金托管</div>
                <div>✅ 7天无理由退款</div>
                <div>✅ 24/7客服支持</div>
              </div>
            </div>

            {/* 确认按钮 */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handlePaymentConfirm}
                disabled={!selectedPaymentMethod}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 