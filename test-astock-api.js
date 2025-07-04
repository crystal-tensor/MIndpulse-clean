// 测试A股数据API完整流程
const testAssets = ['平安银行', '招商银行', '贵州茅台'];

async function testAStockAPI() {
  console.log('🔍 测试A股数据API完整流程...');
  console.log('测试资产:', testAssets);
  
  try {
    // 1. 测试股票数据获取
    console.log('\n📊 步骤1: 获取A股数据...');
    const stockResponse = await fetch('http://localhost:3000/api/mindpilot/yahoo-finance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assets: testAssets
      })
    });

    if (!stockResponse.ok) {
      throw new Error(`股票数据获取失败: ${stockResponse.status}`);
    }

    const stockData = await stockResponse.json();
    console.log('✅ A股数据获取成功');
    console.log('数据源:', stockData.success ? 'baostock真实数据' : '备用数据');
    
    if (stockData.data) {
      console.log('\n💰 股票价格信息:');
      stockData.data.forEach(stock => {
        console.log(`${stock.name}: ¥${stock.currentPrice.toFixed(2)} (${stock.symbol})`);
        console.log(`  - 年化收益率: ${(stock.metrics.returnRate * 100).toFixed(2)}%`);
        console.log(`  - 波动率: ${(stock.metrics.volatility * 100).toFixed(2)}%`);
        console.log(`  - 夏普比率: ${stock.metrics.sharpeRatio.toFixed(2)}`);
        console.log(`  - 最大回撤: ${(stock.metrics.maxDrawdown * 100).toFixed(2)}%`);
        console.log(`  - 历史数据点: ${stock.historicalPrices.length}个`);
      });
    }

    // 2. 测试资产优化
    console.log('\n⚡ 步骤2: 测试资产优化...');
    const optimizationResponse = await fetch('http://localhost:3000/api/mindpilot/asset-optimization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variables: {
          goals: ['长期增值', '稳健收益'],
          assets: testAssets,
          risks: ['市场风险', '流动性风险']
        },
        stockData: stockData.data,
        portfolioData: stockData.portfolioData,
        algorithm: 'qaoa'
      })
    });

    if (!optimizationResponse.ok) {
      throw new Error(`资产优化失败: ${optimizationResponse.status}`);
    }

    const optimizationResult = await optimizationResponse.json();
    console.log('✅ 资产优化完成');
    console.log('算法:', optimizationResult.algorithm);
    
    if (optimizationResult.assets) {
      console.log('\n📈 优化结果:');
      optimizationResult.assets.forEach(asset => {
        console.log(`${asset.name}:`);
        console.log(`  - 优化前权重: ${(asset.weightBefore * 100).toFixed(1)}%`);
        console.log(`  - 优化后权重: ${(asset.weightAfter * 100).toFixed(1)}%`);
        console.log(`  - 当前价格: ¥${asset.currentPrice.toFixed(2)}`);
      });
      
      console.log('\n📊 组合指标:');
      const metrics = optimizationResult.portfolioMetrics;
      console.log(`优化前收益率: ${(metrics.returnBefore * 100).toFixed(2)}%`);
      console.log(`优化后收益率: ${(metrics.returnAfter * 100).toFixed(2)}%`);
      console.log(`优化前风险: ${(metrics.riskBefore * 100).toFixed(2)}%`);
      console.log(`优化后风险: ${(metrics.riskAfter * 100).toFixed(2)}%`);
    }

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
          assets: testAssets,
          risks: ['市场风险', '流动性风险']
        },
        optimizationResult: optimizationResult,
        stockData: stockData.data,
        portfolioData: stockData.portfolioData
      })
    });

    if (!reportResponse.ok) {
      throw new Error(`报告生成失败: ${reportResponse.status}`);
    }

    const reportResult = await reportResponse.json();
    console.log('✅ 报告生成完成');
    
    if (reportResult.report) {
      console.log('\n📄 报告内容预览:');
      console.log('报告标题:', reportResult.report.title);
      console.log('报告长度:', reportResult.report.content.length, '字符');
      
      if (reportResult.assetTable) {
        console.log('\n📊 资产配置表格:');
        reportResult.assetTable.forEach(asset => {
          console.log(`${asset.name}: ¥${asset.currentPrice} (优化前${asset.beforeWeight}% → 优化后${asset.afterWeight}%)`);
        });
      }
      
      if (reportResult.chartData) {
        console.log('\n📈 图表数据:');
        console.log('收益率对比数据点:', reportResult.chartData.portfolioComparison.dates.length);
        console.log('价格走势图数量:', reportResult.chartData.priceCharts.length);
        
        if (reportResult.chartData.covarianceMatrix) {
          console.log('协方差矩阵维度:', reportResult.chartData.covarianceMatrix.length, 'x', reportResult.chartData.covarianceMatrix[0].length);
        }
      }
    }

    console.log('\n🎉 A股API完整流程测试成功！');
    console.log('✅ 数据获取 → ✅ 资产优化 → ✅ 报告生成');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error);
  }
}

// 运行测试
testAStockAPI(); 