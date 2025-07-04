#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
指数数据获取API - 使用baostock数据源
"""
import sys
import json
import numpy as np
import pandas as pd
import baostock as bs
from datetime import datetime, timedelta
import warnings

warnings.filterwarnings('ignore')

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
            # 查询指数历史数据
            rs = bs.query_history_k_data_plus(
                index_code,
                "date,code,open,high,low,close,preclose,volume,amount,pctChg",
                start_date=start_date, 
                end_date=end_date, 
                frequency="d"
            )
            
            if rs.error_code != '0':
                continue
            
            # 获取数据列表
            data_list = []
            while (rs.error_code == '0') & rs.next():
                data_list.append(rs.get_row_data())
            
            if not data_list:
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
                
                pass
            else:
                pass
                
        except Exception as e:
            continue
    
    return index_data

def main():
    """主函数 - 处理命令行参数"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({
                'success': False,
                'error': '缺少指数代码参数'
            }, ensure_ascii=False))
            sys.exit(1)
        
        # 解析JSON参数
        index_codes_json = sys.argv[1]
        index_codes = json.loads(index_codes_json)
        
        if not isinstance(index_codes, list) or len(index_codes) == 0:
            print(json.dumps({
                'success': False,
                'error': '指数代码列表不能为空'
            }, ensure_ascii=False))
            sys.exit(1)
        
        # 登录baostock
        if not login_baostock():
            print(json.dumps({
                'success': False,
                'error': 'baostock登录失败'
            }, ensure_ascii=False))
            sys.exit(1)
        
        try:
            # 获取指数数据
            index_data = get_index_data(index_codes)
            
            if not index_data:
                result = {
                    'success': False,
                    'error': '没有获取到任何指数数据',
                    'data': {}
                }
            else:
                result = {
                    'success': True,
                    'data': index_data,
                    'message': f'成功获取 {len(index_data)} 个指数的数据'
                }
            
            # 输出JSON结果
            print(json.dumps(result, ensure_ascii=False, default=str))
            
        finally:
            logout_baostock()
        
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