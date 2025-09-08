const SSOServerHandler = require('./server_handler');
const SSOClientHandler = require('./client_handler');
const ssoConfig = require('../../config/sso');

class SSOHandler {
  constructor() {
    this.serverHandler = new SSOServerHandler();
    this.clientHandler = new SSOClientHandler();
    this.mode = ssoConfig.sso.mode;
  }

  // Route handlers based on SSO mode
  async login(req, res) {
    if (this.mode === 'server') {
      return this.serverHandler.login(req, res);
    } else {
      return this.clientHandler.redirectToSSO(req, res);
    }
  }

  async authorize(req, res) {
    if (this.mode === 'server') {
      return this.serverHandler.authorize(req, res);
    } else {
      throw new Error('Authorization endpoint only available in server mode');
    }
  }

  async token(req, res) {
    if (this.mode === 'server') {
      return this.serverHandler.token(req, res);
    } else {
      throw new Error('Token endpoint only available in server mode');
    }
  }

  async userInfo(req, res) {
    if (this.mode === 'server') {
      return this.serverHandler.userInfo(req, res);
    } else {
      throw new Error('User info endpoint only available in server mode');
    }
  }

  async callback(req, res) {
    if (this.mode === 'client') {
      return this.clientHandler.handleCallback(req, res);
    } else {
      throw new Error('Callback endpoint only available in client mode');
    }
  }

  async logout(req, res) {
    if (this.mode === 'server') {
      return this.serverHandler.logout(req, res);
    } else {
      return this.clientHandler.logout(req, res);
    }
  }

  // Middleware for SSO authentication
  requireAuth(req, res, next) {
    if (this.mode === 'client') {
      return this.clientHandler.requireSSOAuth(req, res, next);
    } else {
      // In server mode, use JWT middleware
      const jwt = require('jsonwebtoken');
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token required',
        });
      }

      try {
        const decoded = jwt.verify(token, ssoConfig.sso.jwt.secret);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
      }
    }
  }

  // Get current mode
  getMode() {
    return this.mode;
  }

  // Check if running in server mode
  isServerMode() {
    return this.mode === 'server';
  }

  // Check if running in client mode
  isClientMode() {
    return this.mode === 'client';
  }
}

module.exports = SSOHandler;
