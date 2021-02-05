const {
  login
} = require('../controller/user');
const {
  set
} = require('../db/redis');
const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')

const handleUserRouter = (req, res) => {
  const method = req.method;

  if (method === 'POST' && req.path === "/api/user/login") {
    const {
      username,
      password
    } = req.body;
    const result = login(username, password);
    return result.then(data => {
      if (data.username) {
        // 设置session
        req.session.username = data.username;
        req.session.realname = data.realname;

        set(req.sessionId, req.session)
        return new SuccessModel(data);
      }
      return new ErrorModel("登录失败");
    })
  }

  // 登陆验证的测试
  if (method === "GET" && req.path === "/api/user/login-test") {

  }
}

module.exports = handleUserRouter