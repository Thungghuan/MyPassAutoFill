# MyPassAutoFill

MyPass 每日健康填报脚本 XD

## 食用方法

1. 克隆仓库

2. Python3 环境

3. Requests 库

   ```shell
   $ pip install requests
   ```

4. 复制[`data.example.py`](data.example.py)到`data.py`

   修改`data.py`文件(支持多个账号)

   > 注：使用模块导入的方式，防止以路径导入 json 文件时 crontab 等报错

   ```py
   [
       {
           "username": "统一认证账号",
           "password": "统一认证密码"
       },
       {
           "username": "统一认证账号",
           "password": "统一认证密码"
       }
   ]
   ```

5. 直接运行`start.sh`即可(添加到`crontab`里面，可更改里面的时间)

   > 注：mypass的开放时间是8:00-20:00，请注意crontab的设置

   ```shell
   # 确保当前pwd为MyPassAutoFill文件目录
   ./start.sh
   ```

## 文件目录

```
.
|-- mypass.py 主文件
|-- des.py 加密算法
|-- data.py 账号数据
|-- mypasslog 日志记录
```
