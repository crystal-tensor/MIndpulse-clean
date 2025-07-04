# 资产配置系统使用指南 / Asset Allocation System Guide

## 中文版本

### 功能概述
资产配置系统是一个基于量子计算和人工智能的智能投资组合优化工具，帮助用户通过结构化对话确定投资目标，识别可投资资产，评估风险约束，最终生成最优的资产配置方案。

### 核心特性
- ✨ **多语言支持**：支持中文和英文界面切换
- 🎯 **三阶段对话**：目标确认 → 资产识别 → 风险评估
- ⚡ **量子优化**：使用QUBO算法和经典算法对比优化
- 📊 **专业报告**：生成详细的资产配置优化报告
- 🔄 **实时调整**：支持重新计算和参数调整

### 使用流程

#### 第一阶段：目标确认
1. 访问资产配置页面（/quantum-decisions）
2. 描述您的投资目标，例如：
   - "希望3年内实现年化收益率8%"
   - "为退休准备，投资期限20年"
   - "短期理财，风险偏好稳健"

#### 第二阶段：资产识别
1. 列出您可以投资的资产类型：
   - 股票型基金、债券型基金
   - 股票、债券、黄金
   - 房地产信托基金(REITs)
   - 现金及现金等价物

#### 第三阶段：风险评估
1. 描述您的风险约束：
   - 最大可接受回撤
   - 投资限制和偏好
   - 流动性要求

#### 第四阶段：量子计算
1. 选择算法类型：
   - **量子算法(QUBO)**：使用量子优化求解
   - **经典算法**：使用传统优化方法
2. 开始计算并等待结果

#### 第五阶段：结果分析
查看生成的优化报告，包括：
- 资产配置表格（优化前后权重对比）
- 收益率、夏普比率、最大回撤等指标
- 收益率曲线和价格走势图
- 量子算法与经典算法结果对比

### 多语言切换
在页面顶部可以切换语言：
- **中文**：完整的中文界面
- **English**：完整的英文界面

### 技术特性
- **智能提取**：自动从对话中提取投资要素
- **量子增强**：使用VQE算法进行帕累托前沿优化
- **可视化展示**：三维帕累托前沿分布图
- **实时计算**：动态调整参数并重新计算

---

## English Version

### Feature Overview
The Asset Allocation System is an intelligent portfolio optimization tool based on quantum computing and artificial intelligence, helping users determine investment goals through structured dialogue, identify investable assets, assess risk constraints, and ultimately generate optimal asset allocation strategies.

### Core Features
- ✨ **Multi-language Support**: Chinese and English interface switching
- 🎯 **Three-stage Dialogue**: Goal Setting → Asset Identification → Risk Assessment
- ⚡ **Quantum Optimization**: QUBO algorithm vs classical algorithm comparison
- 📊 **Professional Reports**: Detailed asset allocation optimization reports
- 🔄 **Real-time Adjustment**: Support for recalculation and parameter adjustment

### Usage Flow

#### Stage 1: Goal Setting
1. Access the asset allocation page (/quantum-decisions)
2. Describe your investment goals, for example:
   - "Achieve 8% annual return within 3 years"
   - "Retirement preparation, 20-year investment horizon"
   - "Short-term wealth management, conservative risk preference"

#### Stage 2: Asset Identification
1. List the asset types you can invest in:
   - Equity funds, bond funds
   - Stocks, bonds, gold
   - Real Estate Investment Trusts (REITs)
   - Cash and cash equivalents

#### Stage 3: Risk Assessment
1. Describe your risk constraints:
   - Maximum acceptable drawdown
   - Investment restrictions and preferences
   - Liquidity requirements

#### Stage 4: Quantum Computing
1. Choose algorithm type:
   - **Quantum Algorithm (QUBO)**: Use quantum optimization solving
   - **Classical Algorithm**: Use traditional optimization methods
2. Start calculation and wait for results

#### Stage 5: Result Analysis
View the generated optimization report, including:
- Asset allocation table (before/after weight comparison)
- Return rate, Sharpe ratio, maximum drawdown indicators
- Return curves and price trend charts
- Quantum vs classical algorithm result comparison

### Language Switching
Switch languages at the top of the page:
- **中文**: Complete Chinese interface
- **English**: Complete English interface

### Technical Features
- **Intelligent Extraction**: Automatically extract investment elements from dialogue
- **Quantum Enhancement**: Use VQE algorithm for Pareto frontier optimization
- **Visualization**: 3D Pareto frontier distribution charts
- **Real-time Computing**: Dynamic parameter adjustment and recalculation

---

## 示例对话 / Example Dialogue

### 中文示例
```
用户: 我想为孩子的教育金做投资规划，希望10年后有150万元，可以接受中等风险。

系统: 我理解了您的目标。现在让我们来识别一下您的可投资资产。

用户: 我可以投资股票基金、债券基金、银行理财产品，还有一些余额宝这样的货币基金。

系统: 了解了您的资产情况。接下来请告诉我您的风险约束条件。

用户: 最大回撤不超过20%，希望流动性比较好，每年可能需要取出一部分用于其他支出。

系统: 明白了您的风险偏好。让我们开始进行量子优化计算。
```

### English Example
```
User: I want to plan investments for my child's education fund, hoping to have 1.5 million yuan in 10 years, and can accept moderate risk.

System: I understand your goal. Now let's identify your investable assets.

User: I can invest in equity funds, bond funds, bank wealth management products, and money market funds like Yu'e Bao.

System: I understand your asset situation. Next, please tell me about your risk constraints.

User: Maximum drawdown should not exceed 20%, hope for good liquidity, may need to withdraw some funds annually for other expenses.

System: I understand your risk preferences. Let's start the quantum optimization calculation.
```

---

## 支持的资产类型 / Supported Asset Types

### 股票类 / Equity
- 沪深300ETF / CSI 300 ETF
- 中证500ETF / CSI 500 ETF  
- 科创50ETF / STAR 50 ETF
- 美股ETF / US Stock ETF

### 债券类 / Fixed Income
- 国债ETF / Treasury Bond ETF
- 企业债基金 / Corporate Bond Fund
- 可转债基金 / Convertible Bond Fund

### 另类投资 / Alternative Investments
- 黄金ETF / Gold ETF
- 房地产信托基金 / REITs
- 商品期货基金 / Commodity Funds

### 现金类 / Cash Equivalents
- 货币基金 / Money Market Fund
- 银行理财 / Bank Wealth Management
- 定期存款 / Time Deposits

---

## 注意事项 / Important Notes

### 中文
1. **风险提示**：投资有风险，系统提供的建议仅供参考
2. **数据准确性**：请确保输入的信息准确完整
3. **定期调整**：建议定期回顾和调整投资组合
4. **专业咨询**：重大投资决策建议咨询专业理财顾问

### English
1. **Risk Warning**: Investment involves risks, system recommendations are for reference only
2. **Data Accuracy**: Please ensure input information is accurate and complete
3. **Regular Review**: Recommend regular portfolio review and adjustment
4. **Professional Advice**: Consult professional financial advisors for major investment decisions 