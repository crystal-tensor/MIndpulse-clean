import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// 定义股票数据接口
interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  historicalPrices: {
    date: string;
    price: number;
    volume: number;
  }[];
  metrics: {
    returnRate: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

// 基于Qiskit Finance的投资组合数据结构
interface PortfolioData {
  assets: string[];
  expectedReturns: number[];
  covarianceMatrix: number[][];
  correlationMatrix: number[][];
  historicalData: {
    dates: string[];
    prices: { [asset: string]: number[] };
  };
}

// A股股票映射表
const A_STOCK_MAPPING: Record<string, string> = {
  '平安银行': 'sz.000001',
  '万科A': 'sz.000002', 
  '中国平安': 'sz.000858',
  '招商银行': 'sh.600036',
  '贵州茅台': 'sh.600519',
  '五粮液': 'sz.000858',
  '中国石化': 'sh.600028',
  '中国石油': 'sh.601857',
  '工商银行': 'sh.601398',
  '建设银行': 'sh.601939',
  '农业银行': 'sh.601288',
  '中国银行': 'sh.601988',
  '中信证券': 'sh.600030',
  '海康威视': 'sz.002415',
  '美的集团': 'sz.000333',
  '格力电器': 'sz.000651',
  '比亚迪': 'sz.002594',
  '宁德时代': 'sz.300750',
  '立讯精密': 'sz.002475',
  '三一重工': 'sh.600031',
  '中国中车': 'sh.601766',
  '恒瑞医药': 'sh.600276',
  '药明康德': 'sh.603259',
  '东方财富': 'sz.300059',
  '同花顺': 'sz.300033',
  '上证50ETF': 'sh.510050',
  '沪深300ETF': 'sh.510300',
  '中证500ETF': 'sh.510500',
  '创业板ETF': 'sz.159915',
  '科技ETF': 'sh.515000'
};

/**
 * 调用Python脚本获取A股数据
 */
async function getBaostockData(assets: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(process.cwd(), 'python-api', 'baostock_data.py');
    const assetsJson = JSON.stringify(assets);
    
    console.log('调用Python脚本获取A股数据:', pythonScriptPath);
    console.log('资产列表:', assets);
    
    const pythonProcess = spawn('python3', [pythonScriptPath, assetsJson], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      console.log('Python脚本执行完成，退出代码:', code);
      console.log('Python标准输出长度:', stdout.length);
      if (stderr) {
        console.log('Python错误输出:', stderr);
      }
      
      if (code !== 0) {
        console.error('Python脚本退出代码非0，使用备用数据');
        reject(new Error(`Python脚本执行失败，退出代码: ${code}, 错误: ${stderr}`));
        return;
      }
      
      try {
        // 找到JSON输出（最后一行通常是结果）
        const lines = stdout.trim().split('\n');
        const jsonLine = lines[lines.length - 1];
        
        // 验证JSON格式
        if (!jsonLine.startsWith('{')) {
          console.error('Python输出格式不正确，最后一行不是JSON');
          console.error('最后一行:', jsonLine);
          reject(new Error('Python输出格式不正确'));
          return;
        }
        
        const result = JSON.parse(jsonLine);
        
        // 验证结果格式
        if (!result.success || !result.data || !Array.isArray(result.data)) {
          console.error('Python返回数据格式不正确:', result);
          reject(new Error('Python返回数据格式不正确'));
          return;
        }
        
        console.log('Python数据解析成功，股票数量:', result.data.length);
        resolve(result);
      } catch (error) {
        console.error('解析Python输出失败:', error);
        console.error('原始输出长度:', stdout.length);
        console.error('原始输出前500字符:', stdout.substring(0, 500));
        console.error('原始输出后500字符:', stdout.substring(Math.max(0, stdout.length - 500)));
        reject(new Error(`解析Python输出失败: ${error}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      console.error('启动Python进程失败:', error);
      reject(new Error(`启动Python进程失败: ${error.message}`));
    });
  });
}

/**
 * 生成备用A股数据（当baostock失败时）
 */
function generateBackupAStockData(assets: string[]): any {
  console.log('生成备用A股数据');
  
  const stockData = assets.map(assetName => {
    const symbol = A_STOCK_MAPPING[assetName] || 'sz.000001';
    
    // A股典型价格范围
    const basePrice = getAStockBasePrice(assetName);
    const historicalPrices = [];
    
    // 生成一年的历史数据
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    let price = basePrice * 0.85; // 从85%开始
    
    for (let i = 0; i < 252; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 1.44);
      
      // 模拟A股波动
      const change = (Math.random() - 0.5) * 0.03; // 3%的日波动
      const trend = (i / 252) * 0.15; // 15%的年度趋势
      price = price * (1 + change + trend / 252);
      
      historicalPrices.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000)
      });
    }
    
    // 计算指标
    const prices = historicalPrices.map(h => h.price);
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length) * Math.sqrt(252);
    const annualizedReturn = avgReturn * 252;
    
    return {
      symbol,
      name: assetName,
      currentPrice: prices[prices.length - 1],
      historicalPrices,
      metrics: {
        returnRate: annualizedReturn,
        volatility,
        sharpeRatio: (annualizedReturn - 0.03) / volatility,
        maxDrawdown: Math.random() * 0.15 // 随机最大回撤
      }
    };
  });
  
  // 生成投资组合数据
  const portfolioData = {
    assets: assets,
    expectedReturns: stockData.map(s => s.metrics.returnRate),
    covarianceMatrix: generateCovarianceMatrix(stockData.length),
    correlationMatrix: generateCorrelationMatrix(stockData.length),
    historicalData: {
      dates: stockData[0].historicalPrices.map(h => h.date),
      prices: Object.fromEntries(
        stockData.map(s => [s.name, s.historicalPrices.map(h => h.price)])
      )
    }
  };
  
  return {
    success: true,
    data: stockData,
    portfolioData,
    message: 'A股备用数据生成成功'
  };
}

/**
 * 获取A股基础价格
 */
function getAStockBasePrice(assetName: string): number {
  const basePrices: Record<string, number> = {
    '平安银行': 12.5,
    '万科A': 8.2,
    '中国平安': 45.8,
    '招商银行': 35.6,
    '贵州茅台': 1580.0,
    '五粮液': 128.5,
    '中国石化': 5.8,
    '中国石油': 7.2,
    '工商银行': 4.9,
    '建设银行': 6.8,
    '农业银行': 3.2,
    '中国银行': 3.8,
    '中信证券': 18.5,
    '海康威视': 32.1,
    '美的集团': 52.3,
    '格力电器': 28.9,
    '比亚迪': 185.6,
    '宁德时代': 168.2,
    '立讯精密': 28.4,
    '三一重工': 15.8,
    '中国中车': 5.6,
    '恒瑞医药': 45.2,
    '药明康德': 52.8,
    '东方财富': 12.3,
    '同花顺': 85.6,
    '上证50ETF': 2.85,
    '沪深300ETF': 3.92,
    '中证500ETF': 5.68,
    '创业板ETF': 2.15,
    '科技ETF': 1.25
  };
  
  return basePrices[assetName] || 10.0;
}

/**
 * 生成协方差矩阵
 */
function generateCovarianceMatrix(size: number): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) {
      if (i === j) {
        matrix[i][j] = 0.04; // 对角线元素
      } else {
        matrix[i][j] = 0.01 + Math.random() * 0.02; // 非对角线元素
      }
    }
  }
  return matrix;
}

/**
 * 生成相关系数矩阵
 */
function generateCorrelationMatrix(size: number): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) {
      if (i === j) {
        matrix[i][j] = 1.0; // 对角线元素
      } else {
        matrix[i][j] = 0.2 + Math.random() * 0.6; // 相关系数0.2-0.8
      }
    }
  }
  return matrix;
}

export async function POST(request: NextRequest) {
  try {
    const { assets } = await request.json();

    if (!assets || !Array.isArray(assets)) {
      return NextResponse.json(
        { error: '资产列表不能为空' },
        { status: 400 }
      );
    }

    console.log('开始获取A股数据，资产列表:', assets);

    try {
      // 首先尝试使用baostock获取真实数据
      const result = await getBaostockData(assets);
      
      if (result && result.success) {
        console.log('baostock数据获取成功');
        return NextResponse.json(result);
      } else {
        throw new Error('baostock返回数据无效');
      }
    } catch (error) {
      console.error('baostock数据获取失败:', error);
      console.log('使用备用A股数据');
      
      // 使用备用数据
      const backupResult = generateBackupAStockData(assets);
      return NextResponse.json(backupResult);
    }

  } catch (error) {
    console.error('A股数据API错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { success: false, error: '获取A股数据失败: ' + errorMessage },
      { status: 500 }
    );
  }
} 