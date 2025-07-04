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
    open: number;
    high: number;
    low: number;
    close: number;
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

/**
 * 调用Python脚本获取A股数据
 */
async function getBaostockData(assets: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(process.cwd(), 'python-api', 'baostock_data.py');
    const assetsJson = JSON.stringify(assets);
    
    console.log('🔍 调用Python脚本获取A股数据:', pythonScriptPath);
    console.log('📊 资产列表:', assets);
    
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
      console.log('✅ Python脚本执行完成，退出代码:', code);
      console.log('📈 Python标准输出长度:', stdout.length);
      if (stderr) {
        console.log('⚠️ Python错误输出:', stderr);
      }
      
      if (code !== 0) {
        console.error('❌ Python脚本退出代码非0');
        reject(new Error(`Python脚本执行失败，退出代码: ${code}, 错误: ${stderr}`));
        return;
      }
      
      try {
        // 找到JSON输出（最后一行通常是结果）
        const lines = stdout.trim().split('\n');
        const jsonLine = lines[lines.length - 1];
        
        // 验证JSON格式
        if (!jsonLine.startsWith('{')) {
          console.error('❌ Python输出格式不正确，最后一行不是JSON');
          console.error('最后一行:', jsonLine);
          reject(new Error('Python输出格式不正确'));
          return;
        }
        
        const result = JSON.parse(jsonLine);
        
        // 验证结果格式
        if (!result.success || !result.data || !Array.isArray(result.data)) {
          console.error('❌ Python返回数据格式不正确:', result);
          reject(new Error('Python返回数据格式不正确'));
          return;
        }
        
        console.log('✅ Python数据解析成功，股票数量:', result.data.length);
        
        // 验证每个股票的数据结构
        for (const stock of result.data) {
          if (!stock.historicalPrices || !Array.isArray(stock.historicalPrices)) {
            console.error('❌ 股票历史价格数据缺失:', stock.name);
            continue;
          }
          
          // 验证OHLC数据完整性
          let ohlcCount = 0;
          for (const price of stock.historicalPrices) {
            if (price.open && price.high && price.low && price.close) {
              ohlcCount++;
            }
          }
          console.log(`📊 ${stock.name} OHLC数据完整性: ${ohlcCount}/${stock.historicalPrices.length}`);
        }
        
        resolve(result);
      } catch (error) {
        console.error('❌ 解析Python输出失败:', error);
        console.error('原始输出长度:', stdout.length);
        console.error('原始输出前500字符:', stdout.substring(0, 500));
        reject(new Error(`解析Python输出失败: ${error}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      console.error('❌ 启动Python进程失败:', error);
      reject(new Error(`启动Python进程失败: ${error.message}`));
    });
  });
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

    console.log('🚀 开始获取A股数据，资产列表:', assets);

    try {
      // 使用baostock获取真实A股数据
      const result = await getBaostockData(assets);
      
      if (result && result.success) {
        console.log('✅ baostock数据获取成功');
        return NextResponse.json(result);
      } else {
        throw new Error('baostock数据获取失败');
      }
      
    } catch (error) {
      console.error('❌ baostock数据获取失败:', error);
      
      return NextResponse.json(
        { 
          error: 'A股数据获取失败',
          details: error instanceof Error ? error.message : '未知错误'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ A股数据API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 