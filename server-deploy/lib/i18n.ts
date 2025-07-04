import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 英文翻译
const enTranslations = {
  common: {
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    watchDemo: 'Watch Demo',
    tryFree: 'Try Free',
    upgrade: 'Upgrade',
    features: 'Features',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    contact: 'Contact',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    free: 'Free',
    month: '/month',
    popular: 'Most Popular',
    comingSoon: 'Coming Soon'
  },
  hero: {
    title: 'Your Mind, Amplified.',
    subtitle: 'Your Future, Simplified.',
    description: 'MindPulse creates your digital twin - available 24/7 for growth, decisions, and breakthrough moments that define your journey.',
    cta: 'Start Your Transformation',
    watchIntro: 'Watch Introduction',
    videoSection: {
      title: 'See MindPulse in Action',
      subtitle: 'Watch how industry leaders are transforming their digital presence',
      demoTitle: 'Product Demo',
      duration: '3 minutes • Full walkthrough'
    }
  },
  features: {
    aiCore: {
      title: 'AI Core',
      subtitle: 'Think Deep, Learn Smart',
      description: 'Engage with multiple AI models in meaningful conversations that extract and organize your knowledge automatically.',
      benefits: [
        'Multi-model AI integration',
        'Automatic knowledge extraction',
        'Cognitive ability assessment',
        'Personalized learning paths'
      ]
    },
    spiritCorridor: {
      title: 'Spirit Corridor',
      subtitle: 'Build Your Digital Soul',
      description: 'Create your personalized digital twin based on real conversations and knowledge graphs.',
      benefits: [
        'Interactive knowledge visualization',
        'Custom digital twin creation',
        'Academic-level evaluation',
        'Monetization opportunities'
      ]
    },
    quantumDecisions: {
      title: 'Quantum Decisions',
      subtitle: 'Decide Wise, Rise High',
      description: 'Make optimal decisions using quantum-inspired algorithms and multi-dimensional analysis.',
      benefits: [
        'Multi-dimensional analysis',
        'Quantum algorithm optimization',
        'Scenario simulation',
        'Decision history tracking'
      ]
    },
    assetAllocation: {
      title: 'Asset Allocation',
      subtitle: 'Invest Smart, Grow Fast',
      description: 'AI-driven portfolio optimization with real-time market data and risk assessment.',
      benefits: [
        'Real-time market analysis',
        'Personalized investment strategies',
        'Portfolio optimization',
        'Risk assessment tools'
      ]
    }
  },
  pricing: {
    basic: {
      title: 'Basic',
      price: 'Free',
      duration: '3 months free trial',
      description: 'Perfect for exploring AI-powered personal growth',
      features: [
        'AI Core - Limited conversations',
        'Spirit Corridor - Basic digital twin',
        'Consciousness Hub - Free access',
        'Community support',
        'Basic knowledge graphs'
      ]
    },
    pro: {
      title: 'Pro',
      price: '$19',
      duration: '/month',
      description: 'Unlock your full potential with advanced features',
      features: [
        'AI Core - Unlimited conversations',
        'Spirit Corridor - Advanced digital twin',
        'Quantum Decisions - Full access',
        'Asset Allocation - Complete suite',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'Export capabilities'
      ]
    }
  },
  testimonials: {
    title: 'Voices of Transformation',
    subtitle: 'See how MindPulse is changing lives worldwide'
  }
};

// 中文翻译
const zhTranslations = {
  common: {
    getStarted: '开始使用',
    learnMore: '了解更多',
    watchDemo: '观看演示',
    tryFree: '免费试用',
    upgrade: '升级',
    features: '功能特色',
    pricing: '价格方案',
    testimonials: '用户见证',
    contact: '联系我们',
    signIn: '登录',
    signUp: '注册',
    free: '免费',
    month: '/月',
    popular: '最受欢迎',
    comingSoon: '敬请期待'
  },
  hero: {
    title: '思维放大，',
    subtitle: '未来简化。',
    description: 'MindPulse 创建您的数字分身 - 24/7 为您的成长、决策和突破时刻服务。',
    cta: '开始您的蜕变',
    watchIntro: '观看介绍',
    videoSection: {
      title: '看看MindPulse的实际效果',
      subtitle: '观看行业领袖如何转变他们的数字化存在',
      demoTitle: '产品演示',
      duration: '3分钟 • 完整演示'
    }
  },
  features: {
    aiCore: {
      title: '智核交互',
      subtitle: '深度思考，智能学习',
      description: '与多个AI模型进行有意义的对话，自动提取和整理您的知识。',
      benefits: [
        '多模型AI集成',
        '自动知识提取',
        '认知能力评估',
        '个性化学习路径'
      ]
    },
    spiritCorridor: {
      title: '灵境回廊',
      subtitle: '构建数字灵魂',
      description: '基于真实对话和知识图谱创建您的个性化数字分身。',
      benefits: [
        '交互式知识可视化',
        '定制数字分身创建',
        '学术级别评估',
        '变现机会'
      ]
    },
    quantumDecisions: {
      title: '智能决策',
      subtitle: '明智决策，高效崛起',
      description: '使用量子启发算法和多维分析做出最优决策。',
      benefits: [
        '多维度分析',
        '量子算法优化',
        '情景模拟',
        '决策历史追踪'
      ]
    },
    assetAllocation: {
      title: '资产配置',
      subtitle: '智能投资，快速增长',
      description: 'AI驱动的投资组合优化，实时市场数据和风险评估。',
      benefits: [
        '实时市场分析',
        '个性化投资策略',
        '投资组合优化',
        '风险评估工具'
      ]
    }
  },
  pricing: {
    basic: {
      title: '基础版',
      price: '免费',
      duration: '3个月免费试用',
      description: '探索AI驱动个人成长的完美选择',
      features: [
        '智核交互 - 有限对话',
        '灵境回廊 - 基础数字分身',
        '意识枢纽 - 免费访问',
        '社区支持',
        '基础知识图谱'
      ]
    },
    pro: {
      title: '专业版',
      price: '¥129',
      duration: '/月',
      description: '解锁高级功能，释放全部潜能',
      features: [
        '智核交互 - 无限对话',
        '灵境回廊 - 高级数字分身',
        '智能决策 - 完整访问',
        '资产配置 - 完整套件',
        '优先支持',
        '高级分析',
        '定制集成',
        '导出功能'
      ]
    }
  },
  testimonials: {
    title: '蜕变之声',
    subtitle: '看看MindPulse如何改变全世界的生活'
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      zh: { translation: zhTranslations }
    },
    lng: 'en', // 默认英文
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n; 