const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring');
const {
  set,
  get
} = require('./src/db/redis');


// cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  // console.log("d.toGMTstring() is", d.toGMTString());
  return d.toGMTString();
};

// 用于处理 post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({
        post: "false"
      })
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({
        "content-type": "false"
      })
      return;
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({
          postData: 'false'
        })
        return;
      }
      resolve(JSON.parse(postData));
    })
  })
  return promise;
}

const serverHandle = (req, res) => {
  //
  res.setHeader('Content-type', 'application/json')

  // 获取 path
  const url = req.url
  req.path = url.split('?')[0]

  // 获取 query
  req.query = querystring.parse(url.split('?')[1])

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").map(item => {
    if (!item) return;
    const arr = item.split("=");
    const key = arr[0].trim();
    const value = arr[1].trim();
    req.cookie[key] = value;
  });

  // 解析session（使用redis）
  let needSetCookie = false;
  let userId = req.cookie.userid;
  console.log("userId", userId);
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化redis 中session的初始值
    set(userId, {});
  }
  // 为req创建一个sessionId属性，
  req.sessionId = userId;
  get(req.sessionId)
    .then(sessionData => {
      console.log("req.sessionId userId", req.sessionId, userId);
      console.log("sessionData", sessionData);

      if (!sessionData) {
        //
        set(req.sessionId, {})
        req.session = {};
      } else {
        req.sessionId = sessionData
      }
      return getPostData(req);
    })
    .then(postData => {
      req.body = postData;

      const blogResult = handleBlogRouter(req, res)
      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            res.setHeader(
              "Set-Cookie",
              `userid=${userId};path='/';httpOnly;expires=${getCookieExpires()}`
            )
          }
          res.end(JSON.stringify(blogData))
        });
        return;
      }
      // 处理 user 路由
      const userResult = handleUserRouter(req, res)

      if (userResult) {
        userResult.then(userData => {
          if (needSetCookie) {
            res.setHeader(
              "Set-Cookie",
              `userid=${userId};path='/';httpOnly;expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(userData));
        })
        return;
      }

      // 未命中路由， 返回 404
      res.writeHead(404, {
        "Content-type": "text/plain"
      })
      res.write("404 Not Found\n")
      res.end()
    })
};



module.exports = serverHandle
// process.env.NODE_ENV