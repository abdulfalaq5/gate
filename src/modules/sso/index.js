const SSOHandler = require('./handler');
const {
  loginValidation,
  authorizeValidation,
  tokenValidation,
  callbackValidation,
} = require('./validation');
const { validationMiddleware } = require('../../middlewares/validation');

const ssoHandler = new SSOHandler();

module.exports = {
  login: [loginValidation, validationMiddleware, ssoHandler.login.bind(ssoHandler)],
  authorize: [authorizeValidation, validationMiddleware, ssoHandler.authorize.bind(ssoHandler)],
  token: [tokenValidation, validationMiddleware, ssoHandler.token.bind(ssoHandler)],
  userInfo: [ssoHandler.userInfo.bind(ssoHandler)],
  callback: [callbackValidation, validationMiddleware, ssoHandler.callback.bind(ssoHandler)],
  logout: [ssoHandler.logout.bind(ssoHandler)],
  requireAuth: ssoHandler.requireAuth.bind(ssoHandler),
  getMode: ssoHandler.getMode.bind(ssoHandler),
  isServerMode: ssoHandler.isServerMode.bind(ssoHandler),
  isClientMode: ssoHandler.isClientMode.bind(ssoHandler),
};
