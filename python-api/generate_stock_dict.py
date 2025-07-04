#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
股票代码字典生成器
从baostock获取完整的股票列表，生成股票名称到代码的映射字典
"""

import baostock as bs
import pandas as pd
import json
import pickle
from datetime import datetime

def generate_stock_dict():
    """生成完整的股票代码字典"""
    print("正在登录baostock系统...")
    
    # 登陆系统
    lg = bs.login()
    if lg.error_code != '0':
        print(f'登录失败: {lg.error_msg}')
        return None
    
    print('登录成功！正在获取股票列表...')
    
    try:
        # 获取股票列表
        stock_rs = bs.query_stock_basic()
        stock_df = stock_rs.get_data()
        
        print(f'共获取到 {len(stock_df)} 支股票')
        
        # 生成股票名称到代码的映射字典
        name_to_code_dict = {}
        code_to_name_dict = {}
        
        for index, row in stock_df.iterrows():
            code = row["code"]
            name = row["code_name"]
            
            # 股票名称到代码的映射
            name_to_code_dict[name] = code
            # 股票代码到名称的映射
            code_to_name_dict[code] = name
        
        # 创建完整的字典数据
        complete_dict = {
            "name_to_code": name_to_code_dict,
            "code_to_name": code_to_name_dict,
            "total_count": len(stock_df),
            "generated_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "data_source": "baostock"
        }
        
        return complete_dict
        
    except Exception as e:
        print(f"获取股票数据时出错: {e}")
        return None
    finally:
        # 登出系统
        bs.logout()
        print("已登出baostock系统")

def save_stock_dict(stock_dict, format_type='json'):
    """保存股票字典到文件"""
    if stock_dict is None:
        print("股票字典为空，无法保存")
        return False
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    try:
        if format_type == 'json':
            # 保存为JSON格式
            filename = f"stock_dict_{timestamp}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(stock_dict, f, ensure_ascii=False, indent=2)
            print(f"股票字典已保存为JSON格式: {filename}")
            
            # 同时保存一个最新版本
            latest_filename = "stock_dict_latest.json"
            with open(latest_filename, 'w', encoding='utf-8') as f:
                json.dump(stock_dict, f, ensure_ascii=False, indent=2)
            print(f"最新版本已保存: {latest_filename}")
            
        elif format_type == 'pickle':
            # 保存为pickle格式（更快的读取速度）
            filename = f"stock_dict_{timestamp}.pkl"
            with open(filename, 'wb') as f:
                pickle.dump(stock_dict, f)
            print(f"股票字典已保存为pickle格式: {filename}")
            
            # 同时保存一个最新版本
            latest_filename = "stock_dict_latest.pkl"
            with open(latest_filename, 'wb') as f:
                pickle.dump(stock_dict, f)
            print(f"最新版本已保存: {latest_filename}")
        
        return True
        
    except Exception as e:
        print(f"保存股票字典时出错: {e}")
        return False

def load_stock_dict(filename=None, format_type='json'):
    """从文件加载股票字典"""
    if filename is None:
        filename = f"stock_dict_latest.{format_type if format_type == 'json' else 'pkl'}"
    
    try:
        if format_type == 'json':
            with open(filename, 'r', encoding='utf-8') as f:
                stock_dict = json.load(f)
        elif format_type == 'pickle':
            with open(filename, 'rb') as f:
                stock_dict = pickle.load(f)
        
        print(f"成功加载股票字典: {filename}")
        print(f"包含 {stock_dict.get('total_count', 0)} 支股票")
        print(f"生成时间: {stock_dict.get('generated_time', '未知')}")
        
        return stock_dict
        
    except FileNotFoundError:
        print(f"文件不存在: {filename}")
        return None
    except Exception as e:
        print(f"加载股票字典时出错: {e}")
        return None

def search_stock(stock_dict, search_term):
    """在股票字典中搜索股票"""
    if stock_dict is None:
        print("股票字典为空")
        return []
    
    name_to_code = stock_dict.get("name_to_code", {})
    results = []
    
    # 精确匹配
    if search_term in name_to_code:
        results.append({
            "name": search_term,
            "code": name_to_code[search_term],
            "match_type": "exact"
        })
    
    # 模糊匹配
    for name, code in name_to_code.items():
        if search_term in name and search_term != name:
            results.append({
                "name": name,
                "code": code,
                "match_type": "fuzzy"
            })
    
    return results

def print_sample_data(stock_dict, sample_size=20):
    """打印样本数据"""
    if stock_dict is None:
        print("股票字典为空")
        return
    
    name_to_code = stock_dict.get("name_to_code", {})
    print(f"\n样本数据 (前{sample_size}条):")
    print("-" * 50)
    
    for i, (name, code) in enumerate(name_to_code.items()):
        if i >= sample_size:
            break
        print(f"{code}: {name}")

if __name__ == "__main__":
    print("=" * 60)
    print("股票代码字典生成器")
    print("=" * 60)
    
    # 生成股票字典
    stock_dict = generate_stock_dict()
    
    if stock_dict:
        # 保存为JSON和pickle两种格式
        save_stock_dict(stock_dict, 'json')
        save_stock_dict(stock_dict, 'pickle')
        
        # 打印样本数据
        print_sample_data(stock_dict)
        
        # 测试搜索功能
        print("\n" + "=" * 60)
        print("测试搜索功能:")
        test_terms = ["万科", "平安", "茅台", "比亚迪", "宁德时代"]
        for term in test_terms:
            results = search_stock(stock_dict, term)
            print(f"\n搜索 '{term}':")
            for result in results[:3]:  # 只显示前3个结果
                print(f"  {result['code']}: {result['name']} ({result['match_type']})")
    
    print("\n" + "=" * 60)
    print("完成!") 