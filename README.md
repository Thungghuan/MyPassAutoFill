# MyPassAutoFill
MyPass每日健康填报脚本XD

## 食用方法

1. 克隆仓库

2. Python3环境

3. Requests库

   ```shell
   $ pip install requests
   ```

4. 修改`data.py`文件(支持多个账号)

   > 注：使用模块导入的方式，防止以路径导入json文件时crontab等报错

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

5. 运行即可一键填报

   > 注：一键填报需要之前有填过才有效，如果没填过要先填一次，隔天开始才能使用本脚本。

   ```shell
   $ python3 mypass.py
   ```

6. 添加定时任务即可每天自动报

   ```shell
   # 例如设置crontab每天早上八点填报
   0 8 * * * /usr/bin/python3 ~/MyPassAutoFill/mypass.py >> ~/mypasslog 2>&1
   ```

## 文件目录

```
.
|-- mypass.py 主文件
|-- des.py 加密算法
|-- data.py 账号数据
```



