const SSOHandler = require('./handler');

module.exports = {
  login: SSOHandler.login.bind(SSOHandler),
  authorize: SSOHandler.authorize.bind(SSOHandler),
  token: SSOHandler.token.bind(SSOHandler),
  userInfo: SSOHandler.userInfo.bind(SSOHandler),
  callback: SSOHandler.callback.bind(SSOHandler),
  logout: SSOHandler.logout.bind(SSOHandler),
};