const SSOServerHandler = require('./server_handler');
const secureSSOHandler = require('./security_handler');
const clientRegistration = require('./client_registration');
const sessionManager = require('./session_manager');
const scopeManager = require('./scope_manager');

// Create instances
const ssoServerHandler = new SSOServerHandler();

module.exports = {
  // Core SSO endpoints - using database handler
  login: ssoServerHandler.login.bind(ssoServerHandler),
  authorize: ssoServerHandler.authorize.bind(ssoServerHandler),
  token: ssoServerHandler.token.bind(ssoServerHandler),
  userInfo: ssoServerHandler.userInfo.bind(ssoServerHandler),
  logout: ssoServerHandler.logout.bind(ssoServerHandler),
  getStats: secureSSOHandler.getStats.bind(secureSSOHandler),

  // Client Registration endpoints
  registerClient: clientRegistration.registerClient.bind(clientRegistration),
  getClient: clientRegistration.getClient.bind(clientRegistration),
  listClients: clientRegistration.listClients.bind(clientRegistration),
  updateClient: clientRegistration.updateClient.bind(clientRegistration),
  deleteClient: clientRegistration.deleteClient.bind(clientRegistration),

  // Session Management endpoints
  getSessionInfo: sessionManager.getSessionInfo.bind(sessionManager),
  getUserSessions: sessionManager.getUserSessions.bind(sessionManager),
  getSessionStats: sessionManager.getSessionStats.bind(sessionManager),
  endSession: sessionManager.endSessionEndpoint.bind(sessionManager),

  // Scope Management endpoints
  getScopes: scopeManager.getScopes.bind(scopeManager),
  getScopeInfo: scopeManager.getScopeInfo.bind(scopeManager),
  validateScopes: scopeManager.validateScopesEndpoint.bind(scopeManager),
  checkPermission: scopeManager.checkPermission.bind(scopeManager),
};