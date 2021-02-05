# node-study-blog
学习node搭建博客系统

## 第一天
### 1. blog系统分层设计 
入口为www.js负责create server (创建server 端 设定端口号)  
app.js负责 响应头的封装 读取 url path querystring postData(流 stream)  
router 负责路由匹配规则  
controller 负责业务逻辑 与数据交互更多  
model 负责封装响应数据格式 code data message  

## 第二天

### 1. 与MySQL数据库建立连接
需要 npm i mysql 依赖
在config目录下配置 连接文件
通过单列模式封装mysql.js并向外暴露一个可以执行SQL语句的API，执行SQL语句返回一个带有结果的Promise
control 层主要编写SQL语句 -> 数据API -> router层 -> 加上Model 返回给前端


## 第三天

### 1. 与redis建立连接 实现登录
配合 session 和 cookie 真的有意思
坑：set-cookie path = / 不能写成 path = '/' 导致无效 path 为当前路由


## 第四天

### 1. 使用nginx 前后端联调
nginx 可以做 静态服务器 负载均衡
反向代理真有趣
