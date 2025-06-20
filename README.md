# MindPulse - 智能决策与意识探索平台

## 项目简介

MindPulse是一个基于Next.js构建的智能决策与意识探索平台，集成了量子计算、AI洞察分析和知识图谱可视化等先进技术，为用户提供全方位的决策支持和思维探索体验。

## 核心功能

### 🧠 意识枢纽 (Consciousness Hub)
- 智能浏览器界面，支持多标签页管理
- 统一的导航和控制中心
- 现代化的玻璃态设计风格

### 🔮 命运织机 (Quantum Decisions)
- **四步决策对话流程**：目标设定 → 资源评估 → 约束分析 → 摘要确认
- **量子VQE算法**：基于变分量子本征求解器的决策优化
- **帕累托前沿分析**：三维风险-回报-策略分布可视化
- **AI洞察建议**：专业的决策分析和突破方向建议
- **实时变量提取**：智能识别和管理决策变量

### 🌐 灵境回廊 (Knowledge Graph)
- 知识图谱可视化
- 多维度数据关联分析

### 🤖 智核交互 (AI Exploration)
- 多模态AI交互体验
- 智能对话和分析功能

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI库**: React 18 + TypeScript
- **样式**: Tailwind CSS + 玻璃态设计
- **状态管理**: Zustand
- **图标**: Heroicons
- **量子计算**: 自研VQE算法引擎
- **AI集成**: 支持多种大模型API (DeepSeek, OpenAI, Claude等)

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### ⚠️ 重要提醒
**项目克隆后必须执行以下两个步骤才能正常运行：**

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/crystal-tensor/MindPulse.git
cd MindPulse
```

2. **安装依赖** (⚠️ 必须先执行)
```bash
npm install
```
> **注意**: 这一步会安装所有必要的依赖包，包括React、Next.js等，大约需要几分钟时间

3. **环境配置** (可选)
创建 `.env.local` 文件并配置API密钥：
```env
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. **启动开发服务器** (⚠️ 安装依赖后执行)
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 `http://localhost:3000`

## 🔧 常见问题

### Q: 为什么克隆后直接运行 `npm run dev` 会出错？
A: 项目仓库不包含 `node_modules` 目录（为了减小仓库体积），必须先运行 `npm install` 安装依赖。

### Q: `npm install` 需要多长时间？
A: 首次安装大约需要3-5分钟，取决于网络速度。安装完成后，`node_modules` 目录大约800MB。

### Q: 如何清理项目体积？
A: 可以删除 `node_modules` 和 `.next` 目录来节省空间，需要运行时再重新 `npm install`。

## 项目结构

```
MindPulse-Clean/
├── app/                      # Next.js App Router
│   ├── api/                  # API路由
│   │   └── mindpilot/       # 核心API接口
│   ├── quantum-decisions/    # 量子决策页面
│   ├── knowledge-graph/      # 知识图谱页面
│   ├── ai-exploration/       # AI探索页面
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页
├── components/              # React组件
│   ├── browser/            # 浏览器相关组件
│   ├── games/              # 游戏组件
│   ├── layout/             # 布局组件
│   └── pages/              # 页面组件
├── lib/                    # 工具库
│   ├── providers/          # 状态提供者
│   └── store.ts           # 状态管理
└── public/                 # 静态资源
```

## 核心特性详解

### 量子决策算法
- **QUBO建模**: 将决策问题转换为二次无约束二进制优化问题
- **VQE求解**: 使用变分量子本征求解器寻找最优解
- **帕累托优化**: 多目标优化，生成帕累托前沿解集
- **风险评估**: 基于约束条件的风险量化分析

### AI洞察系统
- **专业分析**: 基于量子计算结果的深度洞察
- **突破方向**: 资源约束组合的最优化建议  
- **概率解读**: 基于真实成功概率的专业解释
- **风险提示**: 专业而富有洞察力的风险警示

### 可视化系统
- **三维帕累托前沿**: 风险×回报×策略的立体分布
- **最优解标记**: 黄色高亮显示最佳决策点
- **交互式图表**: 支持多角度投影查看
- **实时数据**: 动态更新计算结果

## 开发指南

### 添加新页面
1. 在 `app/` 目录下创建新的路由文件夹
2. 添加 `page.tsx` 文件
3. 在导航中添加对应链接

### 添加新API
1. 在 `app/api/` 目录下创建路由文件夹
2. 添加 `route.ts` 文件
3. 实现GET/POST等HTTP方法

### 自定义组件
1. 在 `components/` 对应分类下创建组件
2. 使用TypeScript定义接口
3. 遵循现有的设计规范

## 部署

### Vercel部署 (推荐)
```bash
npm run build
vercel --prod
```

### Docker部署
```bash
docker build -t mindpulse .
docker run -p 3000:3000 mindpulse
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [GitHub Issues]
- 邮箱: your-email@example.com

---

**MindPulse** - 探索意识边界，织就智慧未来 🌟 