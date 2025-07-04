// 测试A股资产优化API
async function testAStockOptimization() {
  console.log('🔍 测试A股资产优化API...');
  
  try {
    // 1. 先获取真实A股数据
    console.log('📊 步骤1: 获取A股数据...');
    const stockResponse = await fetch('http://localhost:3000/api/mindpilot/yahoo-finance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assets: ['平安银行', '招商银行', '贵州茅台']
      })
    });

    if (!stockResponse.ok) {
      throw new Error(`股票数据获取失败: ${stockResponse.status}`);
    }

    const stockData = await stockResponse.json();
    console.log('✅ A股数据获取成功');
    
    if (!stockData.data || stockData.data.length === 0) {
      throw new Error('没有获取到股票数据');
    }

    console.log('股票数据示例:');
    console.log('- 股票数量:', stockData.data.length);
    console.log('- 第一只股票:', stockData.data[0].name, '价格:', stockData.data[0].currentPrice);
    console.log('- 有metrics:', !!stockData.data[0].metrics);
    console.log('- 有historicalPrices:', !!stockData.data[0].historicalPrices);
    
    // 2. 测试QAOA量子优化
    console.log('\n⚡ 步骤2: 测试QAOA量子优化...');
    const qaaoResponse = await fetch('http://localhost:3000/api/mindpilot/asset-optimization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variables: {
          goals: ['长期增值', '稳健收益'],
          assets: ['平安银行', '招商银行', '贵州茅台'],
          risks: ['市场风险', '流动性风险']
        },
        stockData: stockData.data,
        portfolioData: stockData.portfolioData,
        algorithm: 'quantum'
      })
    });

    if (!qaaoResponse.ok) {
      const errorText = await qaaoResponse.text();
      console.error('QAOA优化失败:', errorText);
      throw new Error(`QAOA优化失败: ${qaaoResponse.status}`);
    }

    const qaoaResult = await qaaoResponse.json();
    console.log('✅ QAOA量子优化完成');
    
    if (qaoaResult.success && qaoaResult.result) {
      const result = qaoaResult.result;
      console.log('算法:', result.algorithm);
      console.log('算法详情:', result.algorithmDetails.name);
      console.log('迭代次数:', result.iterations);
      console.log('收敛时间:', result.convergenceTime, '秒');
      
      console.log('\n📈 优化结果:');
      result.assets.forEach(asset => {
        console.log(`${asset.name}:`);
        console.log(`  - 优化前权重: ${(asset.weightBefore * 100).toFixed(1)}%`);
        console.log(`  - 优化后权重: ${(asset.weightAfter * 100).toFixed(1)}%`);
        console.log(`  - 当前价格: ¥${asset.currentPrice.toFixed(2)}`);
        console.log(`  - 年化收益率: ${(asset.returnRate * 100).toFixed(2)}%`);
      });
      
      console.log('\n📊 组合指标:');
      const metrics = result.portfolioMetrics;
      console.log(`优化前收益率: ${(metrics.returnBefore * 100).toFixed(2)}%`);
      console.log(`优化后收益率: ${(metrics.returnAfter * 100).toFixed(2)}%`);
      console.log(`优化前风险: ${(metrics.volatilityBefore * 100).toFixed(2)}%`);
      console.log(`优化后风险: ${(metrics.volatilityAfter * 100).toFixed(2)}%`);
      console.log(`优化前夏普比率: ${metrics.sharpeBefore.toFixed(3)}`);
      console.log(`优化后夏普比率: ${metrics.sharpeAfter.toFixed(3)}`);
      
      console.log('\n📜 优化日志:');
      result.optimizationLog.forEach(log => console.log(log));
      
      // 3. 测试报告生成
      console.log('\n📋 步骤3: 测试报告生成...');
      const reportResponse = await fetch('http://localhost:3000/api/mindpilot/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables: {
            goals: ['长期增值', '稳健收益'],
            assets: ['平安银行', '招商银行', '贵州茅台'],
            risks: ['市场风险', '流动性风险']
          },
          optimizationResult: result,
          stockData: stockData.data,
          portfolioData: stockData.portfolioData
        })
      });

      if (!reportResponse.ok) {
        const errorText = await reportResponse.text();
        console.error('报告生成失败:', errorText);
        throw new Error(`报告生成失败: ${reportResponse.status}`);
      }

      const reportResult = await reportResponse.json();
      console.log('✅ 报告生成完成');
      
      if (reportResult.report) {
        console.log('\n📄 报告内容预览:');
        console.log('报告标题:', reportResult.report.title);
        console.log('执行摘要长度:', reportResult.report.executiveSummary?.length || 0, '字符');
        
        if (reportResult.report.assetTable) {
          console.log('\n📊 资产配置表格:');
          reportResult.report.assetTable.forEach(asset => {
            console.log(`${asset.name}: ¥${asset.currentPrice} (优化前${asset.beforeWeight}% → 优化后${asset.afterWeight}%)`);
          });
        }
        
        if (reportResult.report.chartData) {
          console.log('\n📈 图表数据:');
          if (reportResult.report.chartData.portfolioChart) {
            console.log('收益率对比数据点:', reportResult.report.chartData.portfolioChart.dates?.length || 0);
          }
          if (reportResult.report.chartData.candlestickCharts) {
            console.log('蜡烛图数量:', reportResult.report.chartData.candlestickCharts.length);
          }
          if (reportResult.report.chartData.indexComparison) {
            console.log('指数对比数量:', reportResult.report.chartData.indexComparison.indices?.length || 0);
          }
          if (reportResult.report.chartData.capitalMarketLine) {
            console.log('资本市场线数据:', '✅ 已生成');
          }
          if (reportResult.report.chartData.covarianceHeatmap) {
            console.log('协方差矩阵维度:', reportResult.report.chartData.covarianceHeatmap.matrix?.length || 0, 'x', reportResult.report.chartData.covarianceHeatmap.matrix?.[0]?.length || 0);
          }
        }
      }
      
      console.log('\n🎉 A股完整流程测试成功！');
      console.log('✅ 数据获取 → ✅ QAOA优化 → ✅ 报告生成');
      
    } else {
      console.error('优化结果格式错误:', qaoaResult);
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
  }
}

// 运行测试
testAStockOptimization(); 