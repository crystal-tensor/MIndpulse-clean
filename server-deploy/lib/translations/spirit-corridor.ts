export type Language = 'zh' | 'en';

export interface SpiritCorridorTranslation {
  title: string;
  subtitle: string;
  slogan: string;
  searchPlaceholder: string;
  authorizationManagement: string;
  avatarCombinationTool: string;
  privacyProtected: string;
  
  // 知识节点
  nodes: {
    programming: string;
    ai: string;
    design: string;
    marketing: string;
    communication: string;
    leadership: string;
  };
  
  // 数字分身
  avatars: {
    codemaster: {
      name: string;
      role: string;
      description: string;
    };
    marketpioneer: {
      name: string;
      role: string;
      description: string;
    };
  };
  
  // 知识共鸣
  knowledgeResonance: {
    title: string;
    enableComparison: string;
    analyzing: string;
    consensusReached: string;
    matchRate: string;
    commonKnowledge: string;
  };
  
  // 智慧投影
  wisdomProjection: {
    title: string;
    newAvatar: string;
    efficiency: string;
    accuracy: string;
    automation: string;
    avatarDetails: string;
    detailsPlaceholder: string;
  };
  
  // 授权模态框
  authModal: {
    title: string;
    stranger: string;
    recruiter: string;
    colleague: string;
    family: string;
    privacyNotice: string;
  };
  
  // 分身创建模态框
  avatarModal: {
    title: string;
    previous: string;
    next: string;
    create: string;
    
    step1: {
      title: string;
      namePlaceholder: string;
      selectRole: string;
      technical: string;
      management: string;
      creative: string;
      business: string;
    };
    
    step2: {
      title: string;
      description: string;
    };
    
    step3: {
      title: string;
      description: string;
      placeholder: string;
    };
    
    step4: {
      title: string;
      name: string;
      role: string;
      selectedNodes: string;
    };
  };
}

export const SpiritCorridorTranslations: Record<Language, SpiritCorridorTranslation> = {
  zh: {
    title: '灵境回廊',
    subtitle: 'Spirit Corridor',
    slogan: '发现共识，创造分身，提升自我',
    searchPlaceholder: '搜索数字分身、知识节点或连接用户...',
    authorizationManagement: '授权管理',
    avatarCombinationTool: '分身组合工具',
    privacyProtected: '🔒 您的隐私受到严格保护',
    
    nodes: {
      programming: '编程',
      ai: '人工智能',
      design: '设计',
      marketing: '营销',
      communication: '沟通',
      leadership: '领导力',
    },
    
    avatars: {
      codemaster: {
        name: '代码大师',
        role: '技术专家',
        description: '专注于编程开发和技术创新，具备丰富的软件工程经验和人工智能应用能力。',
      },
      marketpioneer: {
        name: '市场先锋',
        role: '市场策略师',
        description: '擅长市场分析、用户洞察和品牌策略，具备敏锐的商业嗅觉和沟通协调能力。',
      },
    },
    
    knowledgeResonance: {
      title: '知识共鸣',
      enableComparison: '启用比较',
      analyzing: '正在分析知识图谱...',
      consensusReached: '共识达成',
      matchRate: '匹配度',
      commonKnowledge: '共同知识点',
    },
    
    wisdomProjection: {
      title: '智慧投影',
      newAvatar: '新分身',
      efficiency: '效率',
      accuracy: '准确度',
      automation: '自动化',
      avatarDetails: '分身详情',
      detailsPlaceholder: '选择一个分身查看详细信息...',
    },
    
    authModal: {
      title: '选择可查看人群',
      stranger: '陌生人（初次见面）',
      recruiter: '招聘HR（职业匹配）',
      colleague: '同事群（项目协作）',
      family: '家庭成员（情感连接）',
      privacyNotice: '您的知识图谱将仅在您明确授权后才会与他人分享。您可以随时撤销授权。',
    },
    
    avatarModal: {
      title: '创建数字分身',
      previous: '上一步',
      next: '下一步',
      create: '创建',
      
      step1: {
        title: '命名和角色定义',
        namePlaceholder: '请输入分身名称（如：代码大师、市场先锋）',
        selectRole: '选择角色类型',
        technical: '技术',
        management: '管理',
        creative: '创意',
        business: '商业',
      },
      
      step2: {
        title: '知识提取',
        description: '从您的知识图谱中选择与此分身相关的知识点和技能：',
      },
      
      step3: {
        title: '功能描述',
        description: '描述这个分身的主要功能和特点：',
        placeholder: '例如：专注于前端开发，擅长React和Vue.js技术栈，具备良好的用户体验设计能力...',
      },
      
      step4: {
        title: '预览与确认',
        name: '分身名称',
        role: '角色类型',
        selectedNodes: '选中的知识点',
      },
    },
  },
  
  en: {
    title: 'Spirit Corridor',
    subtitle: 'Digital Twin Platform',
    slogan: 'Discover Consensus, Create Avatars, Elevate Yourself',
    searchPlaceholder: 'Search digital avatars, knowledge nodes or connected users...',
    authorizationManagement: 'Authorization Management',
    avatarCombinationTool: 'Avatar Combination Tool',
    privacyProtected: '🔒 Your privacy is strictly protected',
    
    nodes: {
      programming: 'Programming',
      ai: 'Artificial Intelligence',
      design: 'Design',
      marketing: 'Marketing',
      communication: 'Communication',
      leadership: 'Leadership',
    },
    
    avatars: {
      codemaster: {
        name: 'Code Master',
        role: 'Technical Expert',
        description: 'Focuses on programming development and technical innovation, with rich software engineering experience and AI application capabilities.',
      },
      marketpioneer: {
        name: 'Market Pioneer',
        role: 'Marketing Strategist',
        description: 'Excels in market analysis, user insights and brand strategy, with keen business acumen and communication coordination abilities.',
      },
    },
    
    knowledgeResonance: {
      title: 'Knowledge Resonance',
      enableComparison: 'Enable Comparison',
      analyzing: 'Analyzing knowledge graph...',
      consensusReached: 'Consensus Reached',
      matchRate: 'Match Rate',
      commonKnowledge: 'Common Knowledge',
    },
    
    wisdomProjection: {
      title: 'Wisdom Projection',
      newAvatar: 'New Avatar',
      efficiency: 'Efficiency',
      accuracy: 'Accuracy',
      automation: 'Automation',
      avatarDetails: 'Avatar Details',
      detailsPlaceholder: 'Select an avatar to view detailed information...',
    },
    
    authModal: {
      title: 'Select Viewer Group',
      stranger: 'Strangers (First Meeting)',
      recruiter: 'Recruiters (Job Matching)',
      colleague: 'Colleagues (Project Collaboration)',
      family: 'Family Members (Emotional Connection)',
      privacyNotice: 'Your knowledge graph will only be shared with others after your explicit authorization. You can revoke authorization at any time.',
    },
    
    avatarModal: {
      title: 'Create Digital Avatar',
      previous: 'Previous',
      next: 'Next',
      create: 'Create',
      
      step1: {
        title: 'Naming and Role Definition',
        namePlaceholder: 'Enter avatar name (e.g., Code Master, Market Pioneer)',
        selectRole: 'Select role type',
        technical: 'Technical',
        management: 'Management',
        creative: 'Creative',
        business: 'Business',
      },
      
      step2: {
        title: 'Knowledge Extraction',
        description: 'Select knowledge points and skills related to this avatar from your knowledge graph:',
      },
      
      step3: {
        title: 'Function Description',
        description: 'Describe the main functions and characteristics of this avatar:',
        placeholder: 'e.g., Focuses on frontend development, proficient in React and Vue.js tech stack, with good UX design capabilities...',
      },
      
      step4: {
        title: 'Preview and Confirm',
        name: 'Avatar Name',
        role: 'Role Type',
        selectedNodes: 'Selected Knowledge Points',
      },
    },
  },
}; 