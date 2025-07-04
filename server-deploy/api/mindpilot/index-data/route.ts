import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

/**
 * 调用Python脚本获取指数数据
 */
async function getIndexData(indexCodes: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(process.cwd(), 'python-api', 'get_index_data.py');
    const indexCodesJson = JSON.stringify(indexCodes);
    
    console.log('🔍 调用Python脚本获取指数数据:', pythonScriptPath);
    console.log('📊 指数列表:', indexCodes);
    
    const pythonProcess = spawn('python3', [pythonScriptPath, indexCodesJson], {
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
        // 找到JSON输出（过滤掉baostock的登录/登出信息）
        const lines = stdout.trim().split('\n');
        let jsonLine = '';
        
        // 从后往前找第一个JSON行
        for (let i = lines.length - 1; i >= 0; i--) {
          const line = lines[i].trim();
          if (line.startsWith('{') && line.includes('success')) {
            jsonLine = line;
            break;
          }
        }
        
        // 验证JSON格式
        if (!jsonLine || !jsonLine.startsWith('{')) {
          console.error('❌ Python输出中未找到有效JSON');
          console.error('所有行:', lines);
          reject(new Error('Python输出格式不正确'));
          return;
        }
        
        const result = JSON.parse(jsonLine);
        
        // 验证结果格式
        if (!result.success) {
          console.error('❌ Python返回数据格式不正确:', result);
          reject(new Error('Python返回数据格式不正确'));
          return;
        }
        
        console.log('✅ Python指数数据解析成功，指数数量:', Object.keys(result.data || {}).length);
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
    const { indexCodes } = await request.json();

    if (!indexCodes || !Array.isArray(indexCodes)) {
      return NextResponse.json(
        { error: '指数代码列表不能为空' },
        { status: 400 }
      );
    }

    console.log('🚀 开始获取指数数据，指数列表:', indexCodes);

    try {
      // 获取真实指数数据
      const result = await getIndexData(indexCodes);
      
      if (result && result.success) {
        console.log('✅ 指数数据获取成功');
        return NextResponse.json(result);
      } else {
        throw new Error('指数数据获取失败');
      }
      
    } catch (error) {
      console.error('❌ 指数数据获取失败:', error);
      
      return NextResponse.json(
        { 
          error: '指数数据获取失败',
          details: error instanceof Error ? error.message : '未知错误'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ 指数数据API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 