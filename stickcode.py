import baostock as bs
import pandas as pd

# 登陆系统
lg = bs.login()
# 显示登陆返回信息
print('login respond error_code:'+ lg.error_code)
print('login respond  error_msg:'+ lg.error_msg)

# 获取股票列表
stock_rs = bs.query_stock_basic()
# 打印结果集
stock_df = stock_rs.get_data()
print('共有股票：' + str(len(stock_df)) + '支')

# 将结果转换为字典
stock_dict = {}
for index, row in stock_df.iterrows():
    stock_dict[row["code"]] = row["code_name"]

# 打印前10条记录
print("前10条记录：")
for i, (code, name) in enumerate(stock_dict.items()):
    # if i >= 10:
    #     break
    print(f"{code}: {name}")

# 登出系统
bs.logout()