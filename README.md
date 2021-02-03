# node-study-blog
学习node搭建博客系统

## 第一天
### 1. blog系统分层设计 
入口为www.js负责create server (创建server 端 设定端口号)  
app.js负责 响应头的封装 读取 url path querystring postData(流 stream)  
router 负责路由匹配规则  
controller 负责业务逻辑 与数据交互更多  
model 负责封装响应数据格式 code data message  
