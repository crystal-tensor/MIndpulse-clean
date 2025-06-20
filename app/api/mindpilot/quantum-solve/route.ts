import { NextRequest, NextResponse } from 'next/server';

interface DecisionVariable {
  id: string;
  type: "目标" | "约束" | "资源";
  name: string;
  value: string;
  confidence: number;
  weight: number;
}

interface QuantumSolveRequest {
  variables: DecisionVariable[];
  sessionId: string;
  problemTitle: string;
  systemSettings?: {
    riskPreference: number;
    quantumBackend: string;
  };
  llmSettings?: {
    provider: string;
    model: string;
    apiKey: string;
    temperature: number;
    baseUrl?: string;
  };
}

interface QuantumSolution {
  id: string;
  probability: number;
  strategy: string;
  metrics: { [key: string]: number };
  actions: {
    immediate: string[];
    monitor: string[];
    fallback: string[];
  };
  quantumMetrics: {
    eigenvalue: number;
    convergenceIterations: number;
    quantumVolume: number;
    paretoFront: Array<{
      risk: number;
      reward: number;
      feasibility: number;
    }>;
    paretoFrontChart?: {
      data: Array<{
        x: number;
        y: number;
        z: number;
        name: string;
        color: number;
        isOptimal?: boolean;
      }>;
      layout: {
        title: string;
        xaxis: string;
        yaxis: string;
        zaxis: string;
      };
    }; // 三维图表数据结构
  };
  aiInsight?: {
    title: string;
    content: string;
    risks: string;
    probability: string;
  };
}

// LLM调用函数
async function generateAIInsight(
  variables: DecisionVariable[],
  solution: any,
  llmSettings?: any
): Promise<{
  title: string;
  content: string;
  risks: string;
  probability: string;
}> {
  const apiKey = llmSettings?.apiKey || process.env.DEEPSEEK_API_KEY;
  const provider = llmSettings?.provider || 'deepseek';
  const model = llmSettings?.model || 'deepseek-chat';
  const baseUrl = llmSettings?.baseUrl || 'https://api.deepseek.com/v1';

  if (!apiKey) {
    return {
      title: "量子洞察",
      content: "🌟 在命运的织机上，每一个选择都是一根丝线，编织着未来的图案。",
      risks: "⚠️ 山重水复疑无路，柳暗花明又一村。",
      probability: `成功概率：${Math.round(solution.probability * 100)}%`
    };
  }

  const goals = variables.filter(v => v.type === "目标").map(v => v.name);
  const resources = variables.filter(v => v.type === "资源").map(v => v.name);
  const constraints = variables.filter(v => v.type === "约束").map(v => v.name);

  const prompt = `
作为一位专业的决策分析师，请基于以下量子计算结果，为用户提供极具专业而富有洞察力的建议：

**用户情况分析：**
- 目标：${goals.join(', ')}
- 可用资源：${resources.join(', ')}
- 约束条件：${constraints.join(', ')}

**量子计算结果：**
- 成功概率：${Math.round(solution.probability * 100)}%
- 风险系数：${solution.metrics["风险系数"]}%
- 可行性：${solution.metrics["可行性"]}%
- 综合得分：${solution.metrics["综合得分"]}%

请从以下角度分析：
1. 资源与约束的各种组合与目标的差距、关联性和可能性
2. 在当前资源配置下达到目标的突破方向和解决方案
3. 基于成功概率${Math.round(solution.probability * 100)}%的最有效途径分析
4. 如果成功概率较高(>70%)给予肯定，如果较低(<50%)鼓励探索最切实际的解决方案

请用JSON格式返回：
{
  "title": "专业分析标题",
  "content": "深度分析内容（专业洞察，突破方向，解决方案，最有效途径）",
  "risks": "风险提示（保持专业而不失幽默的风格）",
  "probability": "基于成功概率${Math.round(solution.probability * 100)}%的专业解读（从资源约束组合与目标差距角度分析）"
}
`;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const rawContent = data.choices[0].message.content;
      
      try {
        const parsedContent = JSON.parse(rawContent);
        
        // 确保所有字段都是字符串
        const result = {
          title: String(parsedContent.title || "量子洞察分析"),
          content: typeof parsedContent.content === 'object' 
            ? Object.entries(parsedContent.content).map(([key, value]) => `**${key}**: ${value}`).join('\n\n')
            : String(parsedContent.content || "基于量子计算结果的专业分析"),
          risks: String(parsedContent.risks || "请注意相关风险因素"),
          probability: String(parsedContent.probability || `成功概率：${Math.round(solution.probability * 100)}%`)
        };
        
        return result;
      } catch (parseError) {
        console.error('JSON解析失败:', parseError);
        // 如果JSON解析失败，尝试直接使用原始内容
        return {
          title: "量子洞察分析",
          content: String(rawContent),
          risks: "请仔细评估相关风险",
          probability: `成功概率：${Math.round(solution.probability * 100)}%`
        };
      }
    }
  } catch (error) {
    console.error('LLM调用失败:', error);
  }

  // 默认回复
  return {
    title: "量子洞察",
    content: "🌟 在命运的织机上，每一个选择都是一根丝线，编织着未来的图案。",
    risks: "⚠️ 山重水复疑无路，柳暗花明又一村。",
    probability: `成功概率：${Math.round(solution.probability * 100)}%`
  };
}

// 量子VQE算法核心类 (基于paretogame9success.py)
class QuantumVQEEngine {
  private variables: DecisionVariable[];
  private riskPreference: number;
  
  constructor(variables: DecisionVariable[], riskPreference: number = 0.5) {
    this.variables = variables;
    this.riskPreference = riskPreference;
  }
  
  // 生成三维帕累托前沿分布图数据
  private generateParetoFrontChart(paretoFront: Array<{
    risk: number;
    reward: number;
    feasibility: number;
  }>): {
    data: Array<{
      x: number;
      y: number;
      z: number;
      name: string;
      color: number;
      isOptimal?: boolean;
    }>;
    layout: {
      title: string;
      xaxis: string;
      yaxis: string;
      zaxis: string;
    };
  } {
    // 找到最优解（综合得分最高的点）
    let optimalIndex = 0;
    let maxScore = -Infinity;
    
    paretoFront.forEach((point, index) => {
      const score = point.reward - point.risk + point.feasibility; // 综合得分
      if (score > maxScore) {
        maxScore = score;
        optimalIndex = index;
      }
    });

    return {
      data: paretoFront.map((point, index) => ({
        x: point.risk,
        y: point.reward,
        z: point.feasibility,
        name: `策略 ${index + 1}`,
        color: point.reward - point.risk, // 净收益作为颜色值
        isOptimal: index === optimalIndex // 标记最优解
      })),
      layout: {
        title: '三维帕累托前沿分布（风险-回报-策略）',
        xaxis: '风险指数',
        yaxis: '回报指数',
        zaxis: '策略可行性'
      }
    };
  }

  // 建模为QUBO问题
  private modelAsQUBO(): number[][] {
    const n = this.variables.length;
    const Q = Array(n).fill(0).map(() => Array(n).fill(0));
    
    // 目标函数系数（最大化目标）
    for (let i = 0; i < n; i++) {
      const variable = this.variables[i];
      if (variable.type === "目标") {
        Q[i][i] += variable.weight * variable.confidence;
      } else if (variable.type === "资源") {
        Q[i][i] += 0.8 * variable.weight * variable.confidence;
      }
    }
    
    // 约束条件处理：在哈密顿量中使用加法添加惩罚项
    for (let i = 0; i < n; i++) {
      const variable = this.variables[i];
      if (variable.type === "约束") {
        // 约束违反的惩罚项（加法形式）
        const penalty = variable.weight * (1 - variable.confidence) * 2.0;
        Q[i][i] += penalty; // 注意这里是加法，不是减法
        
        // 约束与其他变量的耦合项（约束越强，对其他变量的影响越大）
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            const otherVar = this.variables[j];
            if (otherVar.type === "目标") {
              // 约束对目标的限制效应
              Q[i][j] += penalty * 0.5;
              Q[j][i] += penalty * 0.5;
            }
          }
        }
      }
    }
    
    // 添加变量间的协同效应
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const var1 = this.variables[i];
        const var2 = this.variables[j];
        
        // 目标与资源的协同效应
        if (var1.type === "目标" && var2.type === "资源") {
          const synergy = 0.3 * this.riskPreference;
          Q[i][j] += synergy;
          Q[j][i] += synergy;
        }
        // 资源间的互补效应
        else if (var1.type === "资源" && var2.type === "资源") {
          const complement = 0.2 * (1 - this.riskPreference);
          Q[i][j] += complement;
          Q[j][i] += complement;
        }
      }
    }
    
    return Q;
  }
  
  // VQE求解器 (模拟量子计算)
  private solveVQE(Q: number[][]): {
    eigenvalue: number;
    eigenvector: number[];
    iterations: number;
  } {
    const n = Q.length;
    const maxIterations = 100;
    let bestEigenvalue = Infinity;
    let bestEigenvector = Array(n).fill(0);
    
    for (let iter = 0; iter < maxIterations; iter++) {
      // 生成随机量子态
      const state = Array(n).fill(0).map(() => Math.random() * 2 - 1);
      
      // 计算期望值 (哈密顿量期望)
      let expectation = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          expectation += Q[i][j] * state[i] * state[j];
        }
      }
      
      // 加入量子噪声和退相干效应
      const noise = (Math.random() - 0.5) * 0.1;
      expectation += noise;
      
      if (expectation < bestEigenvalue) {
        bestEigenvalue = expectation;
        bestEigenvector = [...state];
      }
      
      // 模拟退火优化
      if (iter % 10 === 0) {
        const temperature = 1.0 - iter / maxIterations;
        for (let i = 0; i < n; i++) {
          bestEigenvector[i] += (Math.random() - 0.5) * temperature * 0.1;
        }
      }
    }
    
    // 归一化
    const norm = Math.sqrt(bestEigenvector.reduce((sum, x) => sum + x * x, 0));
    bestEigenvector = bestEigenvector.map(x => x / norm);
    
    return {
      eigenvalue: bestEigenvalue,
      eigenvector: bestEigenvector,
      iterations: maxIterations
    };
  }
  
  // 帕累托前沿计算
  private calculateParetoFront(solutions: Array<{
    vector: number[];
    risk: number;
    reward: number;
    feasibility: number;
  }>): Array<{
    risk: number;
    reward: number;
    feasibility: number;
  }> {
    const paretoFront: Array<{
      risk: number;
      reward: number;
      feasibility: number;
    }> = [];
    
    for (let i = 0; i < solutions.length; i++) {
      let isDominated = false;
      
      for (let j = 0; j < solutions.length; j++) {
        if (i !== j) {
          // 检查是否被支配 (风险更低，回报更高，可行性更高)
          if (solutions[j].risk <= solutions[i].risk &&
              solutions[j].reward >= solutions[i].reward &&
              solutions[j].feasibility >= solutions[i].feasibility &&
              (solutions[j].risk < solutions[i].risk ||
               solutions[j].reward > solutions[i].reward ||
               solutions[j].feasibility > solutions[i].feasibility)) {
            isDominated = true;
            break;
          }
        }
      }
      
      if (!isDominated) {
        paretoFront.push({
          risk: solutions[i].risk,
          reward: solutions[i].reward,
          feasibility: solutions[i].feasibility
        });
      }
    }
    
    return paretoFront;
  }
  
  // 主求解方法
  public async solve(llmSettings?: any): Promise<QuantumSolution[]> {
    const Q = this.modelAsQUBO();
    const vqeResult = this.solveVQE(Q);
    
    // 生成多个候选解
    const candidateSolutions = [];
    for (let i = 0; i < 50; i++) {
      const perturbation = vqeResult.eigenvector.map(x => 
        x + (Math.random() - 0.5) * 0.2
      );
      
      // 计算风险、回报、可行性
      const risk = this.calculateRisk(perturbation);
      const reward = this.calculateReward(perturbation);
      const feasibility = this.calculateFeasibility(perturbation);
      
      candidateSolutions.push({
        vector: perturbation,
        risk,
        reward,
        feasibility
      });
    }
    
    // 计算帕累托前沿
    const paretoFront = this.calculateParetoFront(candidateSolutions);
    
    // 生成二维分布图
    const paretoFrontChart = this.generateParetoFrontChart(paretoFront);
    
    // 选择前3个最优解
    const topSolutions = candidateSolutions
      .sort((a, b) => (b.reward - b.risk * this.riskPreference) - (a.reward - a.risk * this.riskPreference))
      .slice(0, 3);
    
    // 为每个解决方案生成AI洞察
    const solutions: QuantumSolution[] = [];
    for (let index = 0; index < topSolutions.length; index++) {
      const sol = topSolutions[index];
      const baseSolution = {
        id: `solution_${index + 1}`,
        probability: this.calculateProbability(sol.vector),
        strategy: this.generateStrategy(sol.vector, index),
        metrics: {
          "成功概率": Math.round(sol.reward * 100),
          "风险系数": Math.round(sol.risk * 100),
          "可行性": Math.round(sol.feasibility * 100),
          "综合得分": Math.round((sol.reward - sol.risk * this.riskPreference) * 100)
        },
        actions: this.generateActions(sol.vector, index),
        quantumMetrics: {
          eigenvalue: vqeResult.eigenvalue,
          convergenceIterations: vqeResult.iterations,
          quantumVolume: this.variables.length * 1024, // 模拟量子体积
          paretoFront,
          paretoFrontChart // 添加图表数据
        }
      };

      // 生成AI洞察
      try {
        const aiInsight = await generateAIInsight(this.variables, baseSolution, llmSettings);
        solutions.push({
          ...baseSolution,
          aiInsight
        });
      } catch (error) {
        console.error('生成AI洞察失败:', error);
        solutions.push(baseSolution);
      }
    }
    
    return solutions;
  }
  
  private calculateRisk(vector: number[]): number {
    let risk = 0;
    for (let i = 0; i < this.variables.length; i++) {
      const variable = this.variables[i];
      if (variable.type === "约束") {
        risk += Math.abs(vector[i]) * variable.weight * (1 - variable.confidence);
      }
    }
    return Math.min(1, risk / this.variables.length);
  }
  
  private calculateReward(vector: number[]): number {
    let reward = 0;
    for (let i = 0; i < this.variables.length; i++) {
      const variable = this.variables[i];
      if (variable.type === "目标") {
        reward += Math.abs(vector[i]) * variable.weight * variable.confidence;
      }
    }
    return Math.min(1, reward / this.variables.filter(v => v.type === "目标").length);
  }
  
  private calculateFeasibility(vector: number[]): number {
    let feasibility = 0;
    for (let i = 0; i < this.variables.length; i++) {
      const variable = this.variables[i];
      if (variable.type === "资源") {
        feasibility += Math.abs(vector[i]) * variable.weight * variable.confidence;
      }
    }
    return Math.min(1, feasibility / this.variables.filter(v => v.type === "资源").length);
  }
  
  private calculateProbability(vector: number[]): number {
    const sum = vector.reduce((acc, val) => acc + val * val, 0);
    return Math.min(1, Math.max(0, sum / vector.length));
  }
  
  private generateStrategy(vector: number[], index: number): string {
    const strategies = [
      "专注核心目标，优化资源配置，审慎管理风险",
      "平衡发展策略，兼顾多个目标，稳健推进",
      "创新突破方案，承担适度风险，寻求最大回报"
    ];
    
    const goals = this.variables.filter(v => v.type === "目标");
    const resources = this.variables.filter(v => v.type === "资源");
    const constraints = this.variables.filter(v => v.type === "约束");
    
    let strategy = strategies[index] || strategies[0];
    
    // 基于变量定制策略
    if (goals.length > 0) {
      const primaryGoal = goals[0];
      strategy = `${strategy}。重点关注${primaryGoal.name}，`;
    }
    
    if (resources.length > 0) {
      const primaryResource = resources[0];
      strategy += `充分利用${primaryResource.name}，`;
    }
    
    if (constraints.length > 0) {
      const primaryConstraint = constraints[0];
      strategy += `同时注意${primaryConstraint.name}的限制。`;
    }
    
    return strategy;
  }
  
  private generateActions(vector: number[], index: number): {
    immediate: string[];
    monitor: string[];
    fallback: string[];
  } {
    const goals = this.variables.filter(v => v.type === "目标");
    const resources = this.variables.filter(v => v.type === "资源");
    const constraints = this.variables.filter(v => v.type === "约束");
    
    return {
      immediate: [
        `制定${goals[0]?.name || "核心目标"}的具体实施计划`,
        `评估和调配${resources[0]?.name || "关键资源"}`,
        `建立${constraints[0]?.name || "约束条件"}的监控机制`
      ],
      monitor: [
        "跟踪关键指标的变化趋势",
        "定期评估策略执行效果",
        "监控外部环境变化"
      ],
      fallback: [
        "如果进展不及预期，考虑调整策略权重",
        "准备替代方案以应对突发情况",
        "建立风险预警和应急响应机制"
      ]
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: QuantumSolveRequest = await request.json();
    const { variables, sessionId, problemTitle, systemSettings, llmSettings } = body;

    if (!variables || variables.length === 0) {
      return NextResponse.json(
        { error: '缺少决策变量' },
        { status: 400 }
      );
    }

    // 初始化量子引擎
    const quantumEngine = new QuantumVQEEngine(
      variables, 
      systemSettings?.riskPreference || 0.5
    );

    // 执行量子计算
    const solutions = await quantumEngine.solve(llmSettings);

    // 记录计算结果到会话
    console.log(`量子计算完成 - 会话ID: ${sessionId}, 问题: ${problemTitle}`);
    console.log(`生成了 ${solutions.length} 个解决方案`);

    return NextResponse.json({
      success: true,
      solutions,
      metadata: {
        sessionId,
        problemTitle,
        computedAt: new Date().toISOString(),
        algorithm: "VQE + Pareto Optimization",
        quantumBackend: systemSettings?.quantumBackend || "IBM Quantum Simulator"
      }
    });

  } catch (error) {
    console.error('量子计算错误:', error);
    
    return NextResponse.json(
      { 
        error: '量子计算失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 