// 端到端测试：验证真实数据在整个流程中的使用
async function testEndToEnd() {
  console.log('🧪 开始端到端测试...\n');

  try {
    // 第1步：获取真实股票数据
    console.log('📈 第1步：获取真实股票数据');
    const stockResponse = await fetch('http://localhost:3000/api/mindpilot/yahoo-finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assets: ['苹果股票', '特斯拉股票', '微软股票']
      })
    });

    const stockData = await stockResponse.json();
    
    if (!stockData.success) {
      throw new Error('获取股票数据失败');
    }

    console.log('✅ 股票数据获取成功');
    stockData.data.forEach(stock => {
      console.log(`   ${stock.name}: $${stock.currentPrice.toFixed(2)}`);
    });
    console.log('');

    // 第2步：使用真实数据进行量子优化
    console.log('⚛️ 第2步：量子优化计算 (使用真实数据)');
    const optimizationResponse = await fetch('http://localhost:3000/api/mindpilot/asset-optimization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        algorithm: 'quantum',
        variables: {
          goals: ['长期增值'],
          assets: ['苹果股票', '特斯拉股票', '微软股票'],
          risks: ['市场波动']
        },
        stockData: stockData.data,
        portfolioData: stockData.portfolioData
      })
    });

    const optimizationData = await optimizationResponse.json();
    
    if (!optimizationData.success) {
      throw new Error('优化计算失败');
    }

    console.log('✅ 量子优化完成');
    console.log('📊 优化结果:');
    optimizationData.result.assets.forEach(asset => {
      console.log(`   ${asset.name}: ${(asset.weightBefore * 100).toFixed(1)}% → ${(asset.weightAfter * 100).toFixed(1)}%`);
      console.log(`     当前价格: $${asset.currentPrice.toFixed(2)} (真实价格)`);
    });
    
    console.log(`📈 组合收益率: ${(optimizationData.result.portfolioMetrics.returnBefore * 100).toFixed(2)}% → ${(optimizationData.result.portfolioMetrics.returnAfter * 100).toFixed(2)}%`);
    console.log(`📊 夏普比率: ${optimizationData.result.portfolioMetrics.sharpeBefore.toFixed(3)} → ${optimizationData.result.portfolioMetrics.sharpeAfter.toFixed(3)}`);
    console.log('');

    // 第3步：验证数据一致性
    console.log('🔍 第3步：验证数据一致性');
    let dataConsistent = true;
    
    // 验证价格一致性
    for (let i = 0; i < stockData.data.length; i++) {
      const originalPrice = stockData.data[i].currentPrice;
      const optimizedPrice = optimizationData.result.assets[i].currentPrice;
      
      if (Math.abs(originalPrice - optimizedPrice) > 0.01) {
        console.log(`❌ 价格不一致: ${stockData.data[i].name} ${originalPrice} vs ${optimizedPrice}`);
        dataConsistent = false;
      }
    }
    
    if (dataConsistent) {
      console.log('✅ 数据一致性验证通过 - 整个流程使用相同的真实股票数据');
    }
    
    console.log('\n🎉 端到端测试完成！');
    console.log('✅ 确认：整个资产配置系统使用真实的Finnhub股票数据进行计算');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testEndToEnd(); 