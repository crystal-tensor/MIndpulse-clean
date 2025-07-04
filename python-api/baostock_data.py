#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
A股数据获取API - 使用baostock数据源
"""
import sys
import json
import numpy as np
import pandas as pd
import baostock as bs
from datetime import datetime, timedelta
import warnings
import json
import os
warnings.filterwarnings('ignore')

def load_stock_mapping():
    """从字典文件加载股票映射"""
    try:
        # 尝试加载最新的股票字典
        dict_file = os.path.join(os.path.dirname(__file__), 'stock_dict_latest.json')
        if os.path.exists(dict_file):
            with open(dict_file, 'r', encoding='utf-8') as f:
                stock_dict = json.load(f)
                name_to_code = stock_dict.get('name_to_code', {})
                print(f"成功从字典文件加载 {len(name_to_code)} 支股票映射")
                return name_to_code
        else:
            print(f"股票字典文件不存在: {dict_file}")
            # 返回一个基本的映射表作为备选
            return get_fallback_mapping()
    except Exception as e:
        print(f"加载股票字典时出错: {e}")
        return get_fallback_mapping()

def get_fallback_mapping():
    """备用的基本股票映射表"""
    return {
        '平安银行': 'sz.000001',
        '万科A': 'sz.000002',
        '中国平安': 'sh.601318',
        '招商银行': 'sh.600036',
        '贵州茅台': 'sh.600519',
        '五粮液': 'sz.000858',
        '中国石化': 'sh.600028',
        '中国石油': 'sh.601857',
        '工商银行': 'sh.601398',
        '建设银行': 'sh.601939',
        '比亚迪': 'sz.002594',
        '宁德时代': 'sz.300750',
        '新亚电子': 'sz.002388',
        '野马电池': 'sh.605378',
        '华远控股': 'sh.600743',
        '华运控股': 'sh.600743',  # 华运控股映射到华远控股
        '时代万恒': 'sz.002057'
    }

# 加载完整的股票映射字典
STOCK_MAPPING = load_stock_mapping()

def login_baostock():
    """登录baostock系统"""
    try:
        lg = bs.login()
        if lg.error_code != '0':
            return False
        return True
    except Exception as e:
        return False

def logout_baostock():
    """登出baostock系统"""
    try:
        bs.logout()
    except Exception as e:
        pass

def search_stock_by_name(asset_name):
    """
    根据资产名称在baostock中搜索相同或相似的股票
    
    Args:
        asset_name: 用户输入的资产名称
    
    Returns:
        str: 找到的股票代码，如果没找到返回None
    """
    try:
        # 首先检查是否有精确匹配的映射
        if asset_name in STOCK_MAPPING:
            return STOCK_MAPPING[asset_name]
        
        # 获取所有A股股票基本信息
        rs = bs.query_all_stock(day=datetime.now().strftime('%Y-%m-%d'))
        if rs.error_code != '0':
            print(f'查询股票列表失败: {rs.error_msg}')
            return None
        
        stock_list = []
        while (rs.error_code == '0') & rs.next():
            stock_list.append(rs.get_row_data())
        
        if not stock_list:
            return None
        
        # 转换为DataFrame
        df = pd.DataFrame(stock_list, columns=rs.fields)
        
        # 搜索逻辑：
        # 1. 精确匹配股票名称
        exact_match = df[df['code_name'] == asset_name]
        if not exact_match.empty:
            stock_code = exact_match.iloc[0]['code']
            print(f'✅ 精确匹配找到: {asset_name} -> {stock_code}')
            return stock_code
        
        # 2. 部分匹配股票名称（包含关键词）
        partial_matches = df[df['code_name'].str.contains(asset_name, na=False)]
        if not partial_matches.empty:
            # 选择第一个匹配的股票
            stock_code = partial_matches.iloc[0]['code']
            matched_name = partial_matches.iloc[0]['code_name']
            print(f'📊 部分匹配找到: {asset_name} -> {matched_name} ({stock_code})')
            return stock_code
        
        # 3. 关键词匹配（去掉常见后缀如ETF、基金等）
        clean_name = asset_name.replace('ETF', '').replace('基金', '').replace('股份', '').replace('集团', '').strip()
        if clean_name and clean_name != asset_name:
            keyword_matches = df[df['code_name'].str.contains(clean_name, na=False)]
            if not keyword_matches.empty:
                stock_code = keyword_matches.iloc[0]['code']
                matched_name = keyword_matches.iloc[0]['code_name']
                print(f'🔍 关键词匹配找到: {asset_name} -> {matched_name} ({stock_code})')
                return stock_code
        
        print(f'⚠️ 未找到匹配的股票: {asset_name}')
        return None
        
    except Exception as e:
        print(f'搜索股票异常 {asset_name}: {str(e)}')
        return None

def search_stock_by_name_enhanced(asset_name):
    """
    增强的股票搜索函数，返回详细的匹配信息
    
    Args:
        asset_name: 用户输入的资产名称
    
    Returns:
        dict: 包含匹配结果和详细信息的字典
    """
    try:
        # 首先检查是否有精确匹配的映射
        if asset_name in STOCK_MAPPING:
            return {
                'found': True,
                'stock_code': STOCK_MAPPING[asset_name],
                'matched_name': asset_name,
                'match_type': 'exact_mapping',
                'confidence': 1.0,
                'note': '精确映射匹配'
            }
        
        # 在字典中进行模糊匹配
        for stock_name, stock_code in STOCK_MAPPING.items():
            # 字符替换匹配
            if '华运' in asset_name and '华远' in stock_name:
                return {
                    'found': True,
                    'stock_code': stock_code,
                    'matched_name': stock_name,
                    'match_type': 'dictionary_fuzzy',
                    'confidence': 0.9,
                    'note': f'字典模糊匹配: {asset_name} -> {stock_name}'
                }
            
            # 包含匹配
            if asset_name in stock_name or stock_name in asset_name:
                return {
                    'found': True,
                    'stock_code': stock_code,
                    'matched_name': stock_name,
                    'match_type': 'dictionary_contains',
                    'confidence': 0.8,
                    'note': f'字典包含匹配: {asset_name} -> {stock_name}'
                }
            
            # 关键词匹配
            clean_asset_name = asset_name.replace('控股', '').replace('集团', '').replace('股份', '').strip()
            clean_stock_name = stock_name.replace('控股', '').replace('集团', '').replace('股份', '').strip()
            if len(clean_asset_name) >= 2 and clean_asset_name in clean_stock_name:
                return {
                    'found': True,
                    'stock_code': stock_code,
                    'matched_name': stock_name,
                    'match_type': 'dictionary_keyword',
                    'confidence': 0.7,
                    'note': f'字典关键词匹配: {clean_asset_name} -> {stock_name}'
                }
        
        # 获取所有A股股票基本信息
        rs = bs.query_all_stock(day=datetime.now().strftime('%Y-%m-%d'))
        if rs.error_code != '0':
            return {
                'found': False,
                'stock_code': None,
                'matched_name': None,
                'match_type': 'error',
                'confidence': 0.0,
                'note': f'查询股票列表失败: {rs.error_msg}'
            }
        
        stock_list = []
        while (rs.error_code == '0') & rs.next():
            stock_list.append(rs.get_row_data())
        
        if not stock_list:
            return {
                'found': False,
                'stock_code': None,
                'matched_name': None,
                'match_type': 'no_data',
                'confidence': 0.0,
                'note': '无法获取股票列表数据'
            }
        
        # 转换为DataFrame
        df = pd.DataFrame(stock_list, columns=rs.fields)
        
        # 1. 精确匹配股票名称
        exact_match = df[df['code_name'] == asset_name]
        if not exact_match.empty:
            return {
                'found': True,
                'stock_code': exact_match.iloc[0]['code'],
                'matched_name': exact_match.iloc[0]['code_name'],
                'match_type': 'exact',
                'confidence': 1.0,
                'note': '股票名称精确匹配'
            }
        
        # 2. 包含匹配（用户输入包含在股票名称中）
        contains_matches = df[df['code_name'].str.contains(asset_name, na=False)]
        if not contains_matches.empty:
            matched_row = contains_matches.iloc[0]
            return {
                'found': True,
                'stock_code': matched_row['code'],
                'matched_name': matched_row['code_name'],
                'match_type': 'contains',
                'confidence': 0.9,
                'note': f'股票名称包含匹配: {matched_row["code_name"]}'
            }
        
        # 3. 反向包含匹配（股票名称包含在用户输入中）
        reverse_matches = df[df['code_name'].apply(lambda x: x in asset_name if pd.notna(x) else False)]
        if not reverse_matches.empty:
            matched_row = reverse_matches.iloc[0]
            return {
                'found': True,
                'stock_code': matched_row['code'],
                'matched_name': matched_row['code_name'],
                'match_type': 'reverse_contains',
                'confidence': 0.8,
                'note': f'反向包含匹配: {matched_row["code_name"]}'
            }
        
        # 4. 关键词匹配（去掉常见后缀）
        clean_name = asset_name.replace('ETF', '').replace('基金', '').replace('股份', '').replace('集团', '').replace('有限公司', '').replace('公司', '').replace('控股', '').strip()
        if clean_name and clean_name != asset_name and len(clean_name) >= 2:
            keyword_matches = df[df['code_name'].str.contains(clean_name, na=False)]
            if not keyword_matches.empty:
                matched_row = keyword_matches.iloc[0]
                return {
                    'found': True,
                    'stock_code': matched_row['code'],
                    'matched_name': matched_row['code_name'],
                    'match_type': 'keyword',
                    'confidence': 0.7,
                    'note': f'关键词匹配: {clean_name} -> {matched_row["code_name"]}'
                }
        
        # 4.5. 字符替换匹配（处理常见的字符混淆）
        # 例如："华运控股" -> "华远控股"
        char_replacements = [
            ('运', '远'),  # 华运 -> 华远
            ('华运', '华远'),  # 直接替换
            ('银行', ''),   # 去掉银行后缀再匹配
            ('集团', ''),   # 去掉集团后缀再匹配
        ]
        
        for old_char, new_char in char_replacements:
            if old_char in asset_name:
                corrected_name = asset_name.replace(old_char, new_char)
                if corrected_name != asset_name:
                    # 尝试精确匹配修正后的名称
                    corrected_exact_match = df[df['code_name'] == corrected_name]
                    if not corrected_exact_match.empty:
                        matched_row = corrected_exact_match.iloc[0]
                        return {
                            'found': True,
                            'stock_code': matched_row['code'],
                            'matched_name': matched_row['code_name'],
                            'match_type': 'character_correction',
                            'confidence': 0.85,
                            'note': f'字符修正匹配: {asset_name} -> {corrected_name}'
                        }
                    
                    # 尝试包含匹配修正后的名称
                    corrected_contains_match = df[df['code_name'].str.contains(corrected_name, na=False)]
                    if not corrected_contains_match.empty:
                        matched_row = corrected_contains_match.iloc[0]
                        return {
                            'found': True,
                            'stock_code': matched_row['code'],
                            'matched_name': matched_row['code_name'],
                            'match_type': 'character_correction_contains',
                            'confidence': 0.75,
                            'note': f'字符修正包含匹配: {asset_name} -> {corrected_name} -> {matched_row["code_name"]}'
                        }
        
        # 5. 模糊匹配（字符相似度）
        best_match = None
        best_score = 0.0
        
        for _, row in df.iterrows():
            stock_name = row['code_name']
            if pd.isna(stock_name):
                continue
                
            # 计算相似度
            similarity = calculate_string_similarity(asset_name, stock_name)
            if similarity > 0.6 and similarity > best_score:
                best_match = row
                best_score = similarity
        
        if best_match is not None:
            return {
                'found': True,
                'stock_code': best_match['code'],
                'matched_name': best_match['code_name'],
                'match_type': 'fuzzy',
                'confidence': best_score,
                'note': f'模糊匹配: 相似度 {best_score:.2f}'
            }
        
        # 未找到任何匹配
        return {
            'found': False,
            'stock_code': None,
            'matched_name': None,
            'match_type': 'not_found',
            'confidence': 0.0,
            'note': f'未找到匹配的股票，已搜索 {len(df)} 只股票'
        }
        
    except Exception as e:
        return {
            'found': False,
            'stock_code': None,
            'matched_name': None,
            'match_type': 'error',
            'confidence': 0.0,
            'note': f'搜索异常: {str(e)}'
        }

def calculate_string_similarity(str1, str2):
    """
    计算两个字符串的相似度
    """
    if not str1 or not str2:
        return 0.0
    
    # 转换为小写并去除空格
    s1 = str1.lower().replace(' ', '')
    s2 = str2.lower().replace(' ', '')
    
    # 计算最长公共子序列长度
    def lcs_length(x, y):
        m, n = len(x), len(y)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if x[i-1] == y[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        
        return dp[m][n]
    
    # 计算相似度
    lcs_len = lcs_length(s1, s2)
    max_len = max(len(s1), len(s2))
    
    if max_len == 0:
        return 1.0
    
    return lcs_len / max_len

def get_index_data(index_codes, start_date=None, end_date=None):
    """
    获取多个指数的历史数据
    
    Args:
        index_codes: 指数代码列表 (如: ['sh.000001', 'sz.399300'])
        start_date: 开始日期 (如: 2023-01-01)
        end_date: 结束日期 (如: 2024-01-01)
    
    Returns:
        dict: 包含各指数历史数据的字典
    """
    if not start_date:
        start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    index_data = {}
    
    for index_code in index_codes:
        try:
            print(f'正在获取指数数据: {index_code}')
            
            # 查询指数历史数据
            rs = bs.query_history_k_data_plus(
                index_code,
                "date,code,open,high,low,close,preclose,volume,amount,pctChg",
                start_date=start_date, 
                end_date=end_date, 
                frequency="d"
            )
            
            if rs.error_code != '0':
                print(f'查询指数数据失败 {index_code}: {rs.error_msg}')
                continue
            
            # 获取数据列表
            data_list = []
            while (rs.error_code == '0') & rs.next():
                data_list.append(rs.get_row_data())
            
            if not data_list:
                print(f'指数 {index_code} 没有数据')
                continue
            
            # 转换为DataFrame
            df = pd.DataFrame(data_list, columns=rs.fields)
            
            # 数据类型转换
            df['date'] = pd.to_datetime(df['date'])
            numeric_columns = ['open', 'high', 'low', 'close', 'preclose', 'volume', 'amount', 'pctChg']
            for col in numeric_columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
            
            # 去除空值
            df = df.dropna()
            
            # 按日期排序
            df = df.sort_values('date').reset_index(drop=True)
            
            if len(df) > 0:
                # 计算归一化收益率（以第一个交易日为基准）
                base_price = df['close'].iloc[0]
                normalized_returns = ((df['close'] / base_price - 1) * 100).tolist()
                
                index_data[index_code] = {
                    'dates': df['date'].dt.strftime('%Y-%m-%d').tolist(),
                    'prices': df['close'].tolist(),
                    'returns': normalized_returns,
                    'data_points': len(df)
                }
                
                print(f'✅ 成功获取指数 {index_code} 数据: {len(df)} 个数据点')
            else:
                print(f'⚠️ 指数 {index_code} 数据为空')
                
        except Exception as e:
            print(f'获取指数数据异常 {index_code}: {str(e)}')
            continue
    
    return index_data

def get_stock_data(stock_code, start_date=None, end_date=None):
    """
    获取单个股票的历史数据
    
    Args:
        stock_code: 股票代码 (如: sz.000001)
        start_date: 开始日期 (如: 2023-01-01)
        end_date: 结束日期 (如: 2024-01-01)
    
    Returns:
        DataFrame: 包含历史数据的DataFrame
    """
    if not start_date:
        start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    try:
        # 查询历史K线数据
        rs = bs.query_history_k_data_plus(
            stock_code,
            "date,code,open,high,low,close,preclose,volume,amount,pctChg",
            start_date=start_date, 
            end_date=end_date, 
            frequency="d"
        )
        
        if rs.error_code != '0':
            print(f'查询股票数据失败 {stock_code}: {rs.error_msg}')
            return None
        
        # 获取数据列表
        data_list = []
        while (rs.error_code == '0') & rs.next():
            data_list.append(rs.get_row_data())
        
        if not data_list:
            print(f'股票 {stock_code} 没有数据')
            return None
        
        # 转换为DataFrame
        df = pd.DataFrame(data_list, columns=rs.fields)
        
        # 数据类型转换
        df['date'] = pd.to_datetime(df['date'])
        numeric_columns = ['open', 'high', 'low', 'close', 'preclose', 'volume', 'amount', 'pctChg']
        for col in numeric_columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # 去除空值
        df = df.dropna()
        
        # 按日期排序
        df = df.sort_values('date').reset_index(drop=True)
        
        return df
        
    except Exception as e:
        print(f'获取股票数据异常 {stock_code}: {str(e)}')
        return None

def calculate_metrics(prices):
    """
    计算金融指标
    
    Args:
        prices: 价格序列
    
    Returns:
        dict: 包含各种金融指标的字典
    """
    if len(prices) < 2:
        return {
            'returnRate': 0,
            'volatility': 0,
            'sharpeRatio': 0,
            'maxDrawdown': 0
        }
    
    prices = np.array(prices)
    
    # 计算日收益率
    returns = np.diff(prices) / prices[:-1]
    returns = returns[~np.isnan(returns)]  # 去除NaN值
    
    if len(returns) == 0:
        return {
            'returnRate': 0,
            'volatility': 0,
            'sharpeRatio': 0,
            'maxDrawdown': 0
        }
    
    # 年化收益率
    total_return = (prices[-1] - prices[0]) / prices[0]
    trading_days = len(prices)
    annualized_return = (1 + total_return) ** (252 / trading_days) - 1
    
    # 波动率（年化）
    volatility = np.std(returns) * np.sqrt(252)
    
    # 夏普比率（假设无风险利率为3%）
    risk_free_rate = 0.03
    sharpe_ratio = (annualized_return - risk_free_rate) / volatility if volatility > 0 else 0
    
    # 最大回撤
    peak = prices[0]
    max_drawdown = 0
    for price in prices:
        if price > peak:
            peak = price
        else:
            drawdown = (peak - price) / peak
            max_drawdown = max(max_drawdown, drawdown)
    
    return {
        'returnRate': float(annualized_return),
        'volatility': float(volatility),
        'sharpeRatio': float(sharpe_ratio),
        'maxDrawdown': float(max_drawdown)
    }

def generate_portfolio_data(assets):
    """
    生成投资组合数据（基于baostock真实A股数据）
    
    Args:
        assets: 资产名称列表
    
    Returns:
        dict: 投资组合数据
    """
    if not login_baostock():
        return None
    
    try:
        stock_data_list = []
        all_historical_data = {}
        common_dates = None
        
        # 动态搜索在baostock中存在的资产
        available_assets = []
        asset_stock_mapping = {}  # 存储找到的资产和股票代码映射
        asset_match_info = {}  # 存储匹配信息用于标记
        
        for asset_name in assets:
            print(f'🔍 搜索资产: {asset_name}')
            result = search_stock_by_name_enhanced(asset_name)
            asset_match_info[asset_name] = result
            
            if result['found']:
                available_assets.append(asset_name)
                asset_stock_mapping[asset_name] = result['stock_code']
                print(f'✅ 找到股票: {asset_name} -> {result["stock_code"]} ({result["matched_name"]}) [{result["match_type"]}] 置信度: {result["confidence"]:.2f}')
            else:
                print(f'⚠️ 跳过未找到的资产: {asset_name} - {result["note"]}')
        
        if not available_assets:
            print('❌ 没有找到任何可用的资产')
            return {
                'success': False,
                'error': '没有找到任何可用的资产',
                'data': [],
                'portfolioData': None,
                'assetMatchInfo': asset_match_info
            }
        
        print(f'✅ 找到 {len(available_assets)} 个可用资产: {available_assets}')
        
        # 获取每个可用股票的数据
        for asset_name in available_assets:
            stock_code = asset_stock_mapping[asset_name]
            
            print(f'正在获取 {asset_name} ({stock_code}) 的A股数据...')
            df = get_stock_data(stock_code)
            
            if df is None or len(df) == 0:
                print(f'⚠️ 无法获取 {asset_name} 的数据，跳过此资产')
                continue
            
            # 提取数据（包含OHLC）
            current_price = float(df['close'].iloc[-1])
            historical_prices = []
            
            for _, row in df.iterrows():
                historical_prices.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'open': float(row['open']) if pd.notna(row['open']) else float(row['close']),
                    'high': float(row['high']) if pd.notna(row['high']) else float(row['close']),
                    'low': float(row['low']) if pd.notna(row['low']) else float(row['close']),
                    'close': float(row['close']),
                    'price': float(row['close']),  # 保持兼容性
                    'volume': int(row['volume']) if pd.notna(row['volume']) else 0
                })
            
            # 计算指标
            prices = df['close'].values
            metrics = calculate_metrics(prices)
            
            stock_info = {
                'symbol': stock_code,
                'name': asset_name,
                'currentPrice': current_price,
                'historicalPrices': historical_prices,
                'metrics': metrics
            }
            
            stock_data_list.append(stock_info)
            
            # 保存历史数据用于投资组合计算
            dates = [item['date'] for item in historical_prices]
            prices = [item['price'] for item in historical_prices]
            all_historical_data[asset_name] = {'dates': dates, 'prices': prices}
            
            # 设置共同日期
            if common_dates is None:
                common_dates = dates
            else:
                # 取交集
                common_dates = list(set(common_dates) & set(dates))
        
        if not stock_data_list:
            print('没有获取到任何股票数据')
            return None
        
        # 确保日期排序
        common_dates.sort()
        
        # 计算期望收益率和协方差矩阵
        returns_matrix = []
        asset_names = []
        
        for stock in stock_data_list:
            asset_name = stock['name']
            asset_names.append(asset_name)
            
            # 获取共同日期的价格
            price_dict = {item['date']: item['price'] for item in stock['historicalPrices']}
            common_prices = [price_dict.get(date, stock['currentPrice']) for date in common_dates]
            
            # 计算收益率
            if len(common_prices) > 1:
                asset_returns = []
                for i in range(1, len(common_prices)):
                    if common_prices[i-1] > 0:
                        ret = (common_prices[i] - common_prices[i-1]) / common_prices[i-1]
                        asset_returns.append(ret)
                    else:
                        asset_returns.append(0)
                returns_matrix.append(asset_returns)
            else:
                returns_matrix.append([0])
        
        # 计算期望收益率（年化）
        expected_returns = []
        for returns in returns_matrix:
            if len(returns) > 0:
                avg_return = np.mean(returns)
                expected_returns.append(avg_return * 252)  # 年化
            else:
                expected_returns.append(0.08)  # 默认8%
        
        # 计算协方差矩阵
        num_assets = len(asset_names)
        covariance_matrix = np.zeros((num_assets, num_assets))
        
        for i in range(num_assets):
            for j in range(num_assets):
                if len(returns_matrix[i]) > 1 and len(returns_matrix[j]) > 1:
                    # 确保两个序列长度相同
                    min_len = min(len(returns_matrix[i]), len(returns_matrix[j]))
                    returns_i = returns_matrix[i][:min_len]
                    returns_j = returns_matrix[j][:min_len]
                    
                    cov = np.cov(returns_i, returns_j)[0, 1] * 252  # 年化协方差
                    covariance_matrix[i, j] = cov
                else:
                    covariance_matrix[i, j] = 0.04 if i == j else 0.01  # 默认值
        
        # 计算相关系数矩阵
        correlation_matrix = np.zeros((num_assets, num_assets))
        for i in range(num_assets):
            for j in range(num_assets):
                std_i = np.sqrt(abs(covariance_matrix[i, i]))
                std_j = np.sqrt(abs(covariance_matrix[j, j]))
                if std_i > 0 and std_j > 0:
                    correlation_matrix[i, j] = covariance_matrix[i, j] / (std_i * std_j)
                else:
                    correlation_matrix[i, j] = 1 if i == j else 0
        
        # 构建历史数据
        historical_data = {
            'dates': common_dates,
            'prices': {}
        }
        
        for stock in stock_data_list:
            asset_name = stock['name']
            price_dict = {item['date']: item['price'] for item in stock['historicalPrices']}
            historical_data['prices'][asset_name] = [
                price_dict.get(date, stock['currentPrice']) for date in common_dates
            ]
        
        portfolio_data = {
            'assets': asset_names,
            'expectedReturns': expected_returns,
            'covarianceMatrix': covariance_matrix.tolist(),
            'correlationMatrix': correlation_matrix.tolist(),
            'historicalData': historical_data
        }
        
        return {
            'success': True,
            'data': stock_data_list,
            'portfolioData': portfolio_data,
            'assetMatchInfo': asset_match_info,
            'message': 'A股真实数据获取成功'
        }
        
    except Exception as e:
        print(f'生成投资组合数据异常: {str(e)}')
        return None
    finally:
        logout_baostock()

def main():
    """主函数 - 处理命令行参数"""
    try:
        if len(sys.argv) < 2:
            print('错误: 缺少资产参数')
            sys.exit(1)
        
        # 解析JSON参数
        assets_json = sys.argv[1]
        assets = json.loads(assets_json)
        
        if not isinstance(assets, list) or len(assets) == 0:
            print('错误: 资产列表不能为空')
            sys.exit(1)
        
        # 获取数据
        result = generate_portfolio_data(assets)
        
        if result is None:
            print(json.dumps({
                'success': False,
                'error': '获取A股数据失败'
            }, ensure_ascii=False))
            sys.exit(1)
        
        # 即使部分资产不可用，只要有可用资产就返回成功
        if result.get('success') == False and result.get('data') == []:
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        # 输出JSON结果
        print(json.dumps(result, ensure_ascii=False, default=str))
        
    except json.JSONDecodeError:
        print(json.dumps({
            'success': False,
            'error': '无效的JSON参数'
        }, ensure_ascii=False))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': f'处理异常: {str(e)}'
        }, ensure_ascii=False))
        sys.exit(1)

if __name__ == '__main__':
    main() 