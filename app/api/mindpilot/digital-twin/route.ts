import { NextRequest, NextResponse } from 'next/server';

// 数字分身配置接口
interface DigitalTwinConfig {
  name: string;
  description: string;
  selectedGraph: string;
  temperamentType: string;
  selectedAgents: string[];
  llmModel: string;
}

// 数字分身完整信息
interface DigitalTwin {
  id: string;
  name: string;
  description: string;
  selectedGraph: string;
  temperamentType: string;
  selectedAgents: string[];
  llmModel: string;
  createdAt: Date;
  isActive: boolean;
  performance: {
    efficiency: number;
    accuracy: number;
    automation: number;
    learning: number;
  };
  capabilities: {
    reasoning: number;
    creativity: number;
    empathy: number;
    expertise: string[];
  };
}

// 模拟数字分身存储
let digitalTwins: DigitalTwin[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: DigitalTwinConfig = await request.json();
    const { name, description, selectedGraph, temperamentType, selectedAgents, llmModel } = body;

    // 验证必需字段
    if (!name.trim()) {
      return NextResponse.json(
        { success: false, error: '数字分身名称不能为空' },
        { status: 400 }
      );
    }

    if (!selectedGraph) {
      return NextResponse.json(
        { success: false, error: '请选择一个知识图谱作为基础' },
        { status: 400 }
      );
    }

    if (!temperamentType) {
      return NextResponse.json(
        { success: false, error: '请选择气质类型' },
        { status: 400 }
      );
    }

    // 根据气质类型生成能力参数
    const getCapabilitiesByTemperament = (temperament: string) => {
      switch (temperament) {
        case '分析型':
          return {
            reasoning: 90,
            creativity: 60,
            empathy: 70,
            expertise: ['数据分析', '逻辑推理', '统计建模'],
          };
        case '创造型':
          return {
            reasoning: 70,
            creativity: 95,
            empathy: 80,
            expertise: ['创意设计', '内容创作', '艺术表达'],
          };
        case '实用型':
          return {
            reasoning: 80,
            creativity: 70,
            empathy: 60,
            expertise: ['项目管理', '执行力', '问题解决'],
          };
        case '社交型':
          return {
            reasoning: 75,
            creativity: 80,
            empathy: 95,
            expertise: ['沟通协调', '人际关系', '团队合作'],
          };
        default:
          return {
            reasoning: 75,
            creativity: 75,
            empathy: 75,
            expertise: ['通用智能'],
          };
      }
    };

    // 根据选择的agents生成性能参数
    const getPerformanceByAgents = (agents: string[]) => {
      const basePerformance = { efficiency: 50, accuracy: 50, automation: 50, learning: 50 };
      
      agents.forEach(agent => {
        switch (agent) {
          case '智能决策':
            basePerformance.efficiency += 20;
            basePerformance.accuracy += 15;
            break;
          case '资产配置':
            basePerformance.accuracy += 25;
            basePerformance.automation += 15;
            break;
          case '知识挖掘':
            basePerformance.learning += 30;
            basePerformance.efficiency += 10;
            break;
          case '创意生成':
            basePerformance.learning += 20;
            basePerformance.efficiency += 10;
            break;
        }
      });

      // 确保值不超过100
      Object.keys(basePerformance).forEach(key => {
        basePerformance[key as keyof typeof basePerformance] = Math.min(100, basePerformance[key as keyof typeof basePerformance]);
      });

      return basePerformance;
    };

    // 创建新的数字分身
    const newTwin: DigitalTwin = {
      id: Date.now().toString(),
      name,
      description,
      selectedGraph,
      temperamentType,
      selectedAgents,
      llmModel,
      createdAt: new Date(),
      isActive: true,
      performance: getPerformanceByAgents(selectedAgents),
      capabilities: getCapabilitiesByTemperament(temperamentType),
    };

    // 保存到存储
    digitalTwins.push(newTwin);

    // 模拟数字分身初始化过程
    console.log(`数字分身 "${name}" 正在初始化...`);
    console.log(`基于图谱: ${selectedGraph}`);
    console.log(`气质类型: ${temperamentType}`);
    console.log(`配置的Agents: ${selectedAgents.join(', ')}`);
    console.log(`使用模型: ${llmModel}`);

    return NextResponse.json({
      success: true,
      data: {
        twin: newTwin,
        message: `数字分身 "${name}" 创建成功！基于${temperamentType}气质类型，配备${selectedAgents.length}个智能代理。`,
      }
    });

  } catch (error) {
    console.error('数字分身创建错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '数字分身创建失败，请重试',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 获取已创建的数字分身列表
    return NextResponse.json({
      success: true,
      data: {
        twins: digitalTwins,
        total: digitalTwins.length,
        active: digitalTwins.filter(twin => twin.isActive).length,
      }
    });

  } catch (error) {
    console.error('获取数字分身列表错误:', error);
    return NextResponse.json(
      { success: false, error: '获取数字分身列表失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { twinId, action } = await request.json();

    if (!twinId) {
      return NextResponse.json(
        { success: false, error: '缺少数字分身ID' },
        { status: 400 }
      );
    }

    const twinIndex = digitalTwins.findIndex(twin => twin.id === twinId);
    if (twinIndex === -1) {
      return NextResponse.json(
        { success: false, error: '数字分身不存在' },
        { status: 404 }
      );
    }

    // 执行操作
    switch (action) {
      case 'activate':
        digitalTwins[twinIndex].isActive = true;
        break;
      case 'deactivate':
        digitalTwins[twinIndex].isActive = false;
        break;
      case 'delete':
        digitalTwins.splice(twinIndex, 1);
        break;
      default:
        return NextResponse.json(
          { success: false, error: '无效的操作类型' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: `数字分身操作 "${action}" 执行成功`,
        twin: action === 'delete' ? null : digitalTwins[twinIndex],
      }
    });

  } catch (error) {
    console.error('数字分身操作错误:', error);
    return NextResponse.json(
      { success: false, error: '数字分身操作失败' },
      { status: 500 }
    );
  }
} 