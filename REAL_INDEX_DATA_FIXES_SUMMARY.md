# 真实指数数据修复总结

## 问题描述

用户报告投资组合与市场指数对比图中的指数走势不对，无论选择哪个指数，显示的都是模拟数据而不是真实的指数历史数据。需要：

1. 从股票字典中获取真实的指数代码
2. 根据代码获取真实的指数历史数据
3. 对比时进行统一的归一化处理

## 修复方案

### 1. 创建指数数据获取Python脚本

**文件**: `python-api/get_index_data.py`

**功能**:
- 使用baostock数据源获取真实指数历史数据
- 支持多个指数同时获取
- 自动计算归一化收益率（以第一个交易日为基准）
- 输出标准JSON格式数据

**关键特性**:
```python
def get_index_data(index_codes, start_date=None, end_date=None):
    # 获取一年的历史数据
    # 计算归一化收益率: (price/base_price - 1) * 100
    # 返回包含日期、价格、收益率的完整数据
```

### 2. 创建指数数据API端点

**文件**: `app/api/mindpilot/index-data/route.ts`

**功能**:
- 接收指数代码列表
- 调用Python脚本获取真实数据
- 处理baostock登录/登出信息输出
- 返回标准化的JSON响应

**关键修复**:
```typescript
// 过滤掉baostock的登录/登出信息，只解析JSON数据
for (let i = lines.length - 1; i >= 0; i--) {
  const line = lines[i].trim();
  if (line.startsWith('{') && line.includes('success')) {
    jsonLine = line;
    break;
  }
}
```

### 3. 修改报告生成逻辑

**文件**: `app/api/mindpilot/generate-report/route.ts`

**修改内容**:

1. **新增真实指数数据获取函数**:
```typescript
async function generateIndexComparison(request: NextRequest) {
  // 获取真实指数数据
  const indexData = await getIndexData(indexCodes);
  // 进行归一化处理
  // 返回标准化的指数对比数据
}
```

2. **保留模拟数据作为回退**:
```typescript
function generateSimulatedIndexComparison() {
  // 当无法获取真实数据时使用模拟数据
}
```

3. **修改图表数据生成**:
```typescript
async function generateChartData(..., request?: NextRequest) {
  const indexComparison = request ? 
    await generateIndexComparison(request) : 
    generateSimulatedIndexComparison();
}
```

### 4. 指数名称和代码映射

**修复的指数映射**:
```typescript
const indices = [
  { name: '上证综合指数', symbol: 'sh.000001', color: '#FF6B6B' },
  { name: '深证成指', symbol: 'sz.399001', color: '#4ECDC4' },
  { name: '沪深300指数', symbol: 'sz.399300', color: '#45B7D1' },
  { name: '中证500指数', symbol: 'sz.399905', color: '#96CEB4' },
  { name: '创业板指数(价格)', symbol: 'sz.399006', color: '#FFEAA7' }
];
```

### 5. 归一化处理

**统一归一化算法**:
```python
# 以第一个交易日为基准，计算相对收益率
base_price = df['close'].iloc[0]
normalized_returns = ((df['close'] / base_price - 1) * 100).tolist()
```

这确保了：
- 所有指数都从0%开始
- 投资组合和指数可以在同一坐标系下对比
- 收益率以百分比形式显示

## 测试验证

**测试文件**: `test-real-index-data.js`

**测试结果**:
```
✅ 指数数据API响应成功
📈 获取5个指数的真实数据，各242个数据点
📊 日期范围: 2024-06-28 到 2025-06-27
🎯 所有指数都有正确的归一化收益率
```

**测试的指数**:
- 上证综合指数 (sh.000001): 15.39%收益率
- 深证成指 (sz.399001): 17.29%收益率  
- 沪深300指数 (sz.399300): 13.29%收益率
- 中证500指数 (sz.399905): 18.63%收益率
- 创业板指数 (sz.399006): 26.19%收益率

## 修复效果

### 修复前
- 指数对比图显示模拟数据
- 指数走势与实际市场不符
- 无法进行真实的业绩对比

### 修复后
- ✅ 获取真实的指数历史数据
- ✅ 正确的归一化处理
- ✅ 投资组合与市场指数可以准确对比
- ✅ 数据来源标记为'real'
- ✅ 支持多个主要市场指数

## 技术要点

1. **数据源**: 使用baostock获取真实市场数据
2. **归一化**: 统一以第一个交易日为基准计算收益率
3. **容错**: 保留模拟数据作为备选方案
4. **性能**: 支持批量获取多个指数数据
5. **标准化**: JSON格式输出，便于前端处理

## 文件变更列表

- ✅ `python-api/get_index_data.py` - 新增
- ✅ `app/api/mindpilot/index-data/route.ts` - 新增  
- ✅ `app/api/mindpilot/generate-report/route.ts` - 修改
- ✅ `python-api/baostock_data.py` - 修改（移除调试输出）
- ✅ `test-real-index-data.js` - 新增测试文件

## 使用说明

用户现在可以在资产配置报告中选择任意指数进行对比，系统将：

1. 自动获取该指数的真实历史数据
2. 进行归一化处理
3. 与投资组合表现进行准确对比
4. 显示真实的市场走势

这为投资决策提供了更准确的参考依据。 