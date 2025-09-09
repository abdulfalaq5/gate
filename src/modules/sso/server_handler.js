const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ssoConfig = require('../../config/sso');
const UsersRepository = require('../users/postgre_repository');
const { CustomException } = require('../../utils/exception');
const { Logger } = require('../../utils/logger');
const { pgCore } = require('../../config/database');

class SSOServerHandler {
  constructor() {
    this.usersRepository = new UsersRepository(pgCore);
    this.authorizationCodes = new Map(); // In production, use Redis or database
  }

  // Generate authorization code
  generateAuthorizationCode(clientId, redirectUri, userId) {
    const code = crypto.randomBytes(32).toString('hex');
    this.authorizationCodes.set(code, {
      clientId,
      redirectUri,
      userId,
      expiresAt: Date.now() + 600000, // 10 minutes
    });
    return code;
  }

  // Validate authorization code
  validateAuthorizationCode(code) {
    const authCode = this.authorizationCodes.get(code);
    if (!authCode || authCode.expiresAt < Date.now()) {
      this.authorizationCodes.delete(code);
      return null;
    }
    return authCode;
  }

  // SSO Login endpoint
  async login(req, res) {
    try {
      const { user_name, user_password, client_id, redirect_uri } = req.body;
      
      console.log('SSO Login Request:', { user_name, client_id, redirect_uri });

      // Validation
      if (!user_name || !user_password) {
        console.log('Validation failed: missing user_name or user_password');
        return res.status(400).json({
          success: false,
          message: 'Username dan password diperlukan',
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      // Find user by username or email
      let user = await this.usersRepository.findByUsername(user_name);
      if (!user) {
        user = await this.usersRepository.findByEmail(user_name);
      }

      if (!user) {
        console.log('User not found:', user_name);
        throw new CustomException('Invalid credentials', 401);
      }

      console.log('User found:', user.user_name);

      // Verify password
      const isValidPassword = await this.usersRepository.verifyPassword(user_password, user.user_password);
      if (!isValidPassword) {
        console.log('Invalid password for user:', user_name);
        throw new CustomException('Invalid credentials', 401);
      }

      console.log('Password verified for user:', user_name);

      // Get user details with permissions
      const userDetails = await this.usersRepository.getUserWithDetails(user.user_id);
      const permissions = await this.usersRepository.getUserPermissions(user.user_id);

      // Generate authorization code if client_id and redirect_uri provided
      let authorizationCode = null;
      if (client_id && redirect_uri) {
        authorizationCode = this.generateAuthorizationCode(client_id, redirect_uri, user.user_id);
      }

      // Generate JWT token - hanya menyimpan user_id untuk mengurangi ukuran token
      const tokenPayload = {
        user_id: user.user_id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        aud: client_id || ssoConfig.sso.jwt.audience,
        iss: ssoConfig.sso.jwt.issuer,
      };

      const token = jwt.sign(tokenPayload, ssoConfig.sso.jwt.secret);

      Logger.info('SSO login successful', { user_id: user.user_id, client_id });

      return res.status(200).json({
        success: true,
        message: 'SSO login successful',
        data: {
          token,
          authorization_code: authorizationCode,
          user_id: user.user_id, // Hanya mengembalikan user_id untuk referensi
        },
      });
    } catch (error) {
      Logger.error('Error during SSO login:', error);
      throw error;
    }
  }

  // Authorization endpoint (OAuth2 flow)
  async authorize(req, res) {
    try {
      const { client_id, redirect_uri, response_type, state } = req.query;

      if (response_type !== 'code') {
        throw new CustomException('Unsupported response type', 400);
      }

      // In a real implementation, you would validate client_id and redirect_uri
      // against registered clients

      // Check if user is already authenticated
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        // Redirect to login page
        return res.redirect(`/auth/sso/login?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`);
      }

      try {
        const decoded = jwt.verify(token, ssoConfig.sso.jwt.secret);
        const user = await this.usersRepository.findById(decoded.user_id);

        if (!user || user.is_delete) {
          throw new CustomException('User not found', 401);
        }

        // Generate authorization code
        const authorizationCode = this.generateAuthorizationCode(client_id, redirect_uri, user.user_id);

        // Redirect back to client with authorization code
        const redirectUrl = `${redirect_uri}?code=${authorizationCode}&state=${state}`;
        return res.redirect(redirectUrl);

      } catch (jwtError) {
        // Token is invalid, redirect to login
        return res.redirect(`/auth/sso/login?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`);
      }
    } catch (error) {
      Logger.error('Error during SSO authorization:', error);
      throw error;
    }
  }

  // Token endpoint (OAuth2 flow)
  async token(req, res) {
    try {
      const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;

      if (grant_type !== 'authorization_code') {
        throw new CustomException('Unsupported grant type', 400);
      }

      // Validate authorization code
      const authCode = this.validateAuthorizationCode(code);
      if (!authCode) {
        throw new CustomException('Invalid or expired authorization code', 400);
      }

      // Validate client credentials
      if (authCode.clientId !== client_id) {
        throw new CustomException('Invalid client ID', 400);
      }

      // In a real implementation, you would validate client_secret
      // and redirect_uri against registered clients

      // Get user details
      const user = await this.usersRepository.getUserWithDetails(authCode.userId);
      const permissions = await this.usersRepository.getUserPermissions(authCode.userId);

      if (!user) {
        throw new CustomException('User not found', 404);
      }

      // Generate access token
      const tokenPayload = {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        role_id: user.role_id,
        employee_id: user.employee_id,
        permissions: permissions.map(p => ({
          permission_id: p.permission_id,
          permission_name: p.permission_name,
          menu_id: p.menu_id,
          menu_name: p.menu_name,
          menu_url: p.menu_url,
        })),
      };

      const accessToken = jwt.sign(tokenPayload, ssoConfig.sso.jwt.secret, {
        expiresIn: ssoConfig.sso.jwt.expiresIn,
        issuer: ssoConfig.sso.jwt.issuer,
        audience: client_id,
      });

      // Clean up authorization code
      this.authorizationCodes.delete(code);

      logger.info('SSO token generated successfully', { user_id: user.user_id, client_id });

      return res.status(200).json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 86400, // 24 hours
        scope: 'read write',
      });
    } catch (error) {
      Logger.error('Error generating SSO token:', error);
      throw error;
    }
  }

  // User info endpoint (OAuth2 flow)
  async userInfo(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        throw new CustomException('Access token required', 401);
      }

      const decoded = jwt.verify(token, ssoConfig.sso.jwt.secret);
      const user = await this.usersRepository.getUserWithDetails(decoded.user_id);
      const permissions = await this.usersRepository.getUserPermissions(decoded.user_id);

      if (!user) {
        throw new CustomException('User not found', 404);
      }

      return res.status(200).json({
        success: true,
        message: 'User info retrieved successfully',
        data: {
          user: {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            role_id: user.role_id,
            role_name: user.role_name,
            employee_id: user.employee_id,
            employee_name: user.employee_name,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
          permissions: permissions.map(p => ({
            permission_id: p.permission_id,
            permission_name: p.permission_name,
            menu_id: p.menu_id,
            menu_name: p.menu_name,
            menu_url: p.menu_url,
          })),
        },
      });
    } catch (error) {
      Logger.error('Error getting user info:', error);
      throw error;
    }
  }

  // Logout endpoint
  async logout(req, res) {
    try {
      // In a real implementation, you would invalidate the token
      // by adding it to a blacklist or using token revocation

      logger.info('SSO logout successful', { user_id: req.user?.user_id });

      return res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      Logger.error('Error during SSO logout:', error);
      throw error;
    }
  }
}

module.exports = SSOServerHandler;
