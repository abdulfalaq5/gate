const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ssoConfig = require('../../config/sso');
// UsersRepository removed - now using employees table directly
const { CustomException } = require('../../utils/exception');
const { Logger } = require('../../utils/logger');
const { pgCore } = require('../../config/database');

class SSOServerHandler {
  constructor() {
    // UsersRepository removed - now using employees table directly
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
      const { email, password, client_id, redirect_uri } = req.body;
      const clientIP = req.ip || req.connection.remoteAddress || '::1';
      
      console.log('SSO Login Request:', { email, client_id, redirect_uri });

      // Validation
      if (!email || !password) {
        console.log('Validation failed: missing email or password');
        return res.status(400).json({
          success: false,
          message: 'Email dan password diperlukan',
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      // Find employee by email
      const employee = await pgCore('employees')
        .select([
          'employee_id',
          'employee_name',
          'employee_exmail_account',
          'employee_foto',
          'password',
          'is_delete'
        ])
        .where('employee_exmail_account', email)
        .where('is_delete', false)
        .first();

      if (!employee) {
        console.log('Employee not found:', email);
        throw new CustomException('Invalid credentials', 401);
      }

      console.log('Employee found:', employee.employee_name);

      // Verify password
      const bcrypt = require('bcrypt');
      const isValidPassword = await bcrypt.compare(password, employee.password);
      if (!isValidPassword) {
        console.log('Invalid password for employee:', email);
        throw new CustomException('Invalid credentials', 401);
      }

      console.log('Password verified for employee:', email);

      // Get employee details with permissions
      const userDetails = {
        user: {
          id: employee.employee_id,
          username: employee.employee_name,
          email: employee.employee_exmail_account,
          employee_foto: employee.employee_foto
        },
        employee: {
          id: employee.employee_id,
          name: employee.employee_name,
          email: employee.employee_exmail_account,
          employee_foto: employee.employee_foto
        }
      };
      
      // Get employee permissions with menu information
      const permissions = await pgCore('employeeHasPermissions')
        .select([
          'permissions.permission_name',
          'permissions.permission_id',
          'menus.menu_name',
          'menus.menu_url',
          'employeeHasPermissions.menu_id'
        ])
        .leftJoin('permissions', 'employeeHasPermissions.permission_id', 'permissions.permission_id')
        .leftJoin('menus', 'employeeHasPermissions.menu_id', 'menus.menu_id')
        .where('employeeHasPermissions.employee_id', employee.employee_id)
        .where('permissions.is_delete', false)
        .where('menus.is_delete', false);

      // Generate authorization code if client_id and redirect_uri provided
      let authorizationCode = null;
      if (client_id && redirect_uri) {
        authorizationCode = this.generateAuthorizationCode(client_id, redirect_uri, employee.employee_id);
      }

      // Generate JWT token dengan payload yang lebih lengkap
      const tokenPayload = {
        user_id: employee.employee_id,
        employee_id: employee.employee_id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        aud: client_id || ssoConfig.sso.jwt.audience,
        iss: ssoConfig.sso.jwt.issuer,
      };

      const ssoToken = jwt.sign(tokenPayload, ssoConfig.sso.jwt.secret);

      // Generate session ID
      const sessionId = employee.employee_id; // Using employee_id as session_id for simplicity
      const loginTime = new Date().toISOString();

      Logger.info('SSO login successful', { user_id: employee.employee_id, client_id });

      // Group permissions by menu
      const menuPermissions = {};
      permissions.forEach(p => {
        if (!menuPermissions[p.menu_name]) {
          menuPermissions[p.menu_name] = {
            name: p.menu_name,
            url: p.menu_url,
            menu_id: p.menu_id,
            permission: []
          };
        }
        menuPermissions[p.menu_name].permission.push(p.permission_name);
      });

      // Convert to array and remove duplicates
      const menuArray = Object.values(menuPermissions).map(menu => ({
        name: menu.name,
        url: menu.url,
        permission: [...new Set(menu.permission)] // Remove duplicates
      }));

      return res.status(200).json({
        success: true,
        message: 'Login SSO berhasil',
        data: {
          user: {
            user_name: userDetails.user.username,
            user_email: userDetails.user.email,
            employee_name: userDetails.employee.name,
            employee_id: userDetails.employee.id,
            employee_foto: userDetails.employee.employee_foto
          },
          menu: menuArray,
          session: {
            client_id: client_id || 'report-management-client',
            session_id: sessionId,
            login_time: loginTime,
            ip_address: clientIP,
            last_activity: loginTime
          },
          oauth: {
            authorization_code: authorizationCode,
            redirect_uri: redirect_uri || 'http://localhost:9581/api/v1/auth/sso/callback',
            expires_in: 600, // 10 minutes
            sso_token: ssoToken
          }
        },
        timestamp: loginTime
      });
    } catch (error) {
      Logger.error('Error during SSO login:', error);
      
      if (error instanceof CustomException) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        errors: null,
        timestamp: new Date().toISOString()
      });
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
        const employee = await pgCore('employees')
          .select(['employee_id', 'employee_name', 'employee_exmail_account', 'is_delete'])
          .where('employee_id', decoded.user_id)
          .where('is_delete', false)
          .first();

        if (!employee) {
          throw new CustomException('User not found', 401);
        }

        // Generate authorization code
        const authorizationCode = this.generateAuthorizationCode(client_id, redirect_uri, employee.employee_id);

        // Redirect back to client with authorization code
        const redirectUrl = `${redirect_uri}?code=${authorizationCode}&state=${state}`;
        return res.redirect(redirectUrl);

      } catch (jwtError) {
        // Token is invalid, redirect to login
        return res.redirect(`/auth/sso/login?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`);
      }
    } catch (error) {
      Logger.error('Error during SSO authorization:', error);
      
      if (error instanceof CustomException) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        errors: null,
        timestamp: new Date().toISOString()
      });
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

      // Get employee details
      const employee = await pgCore('employees')
        .select(['employee_id', 'employee_name', 'employee_exmail_account'])
        .where('employee_id', authCode.userId)
        .where('is_delete', false)
        .first();
        
      const permissions = await pgCore('employeeHasPermissions')
        .select(['permissions.permission_name', 'permissions.permission_id'])
        .leftJoin('permissions', 'employeeHasPermissions.permission_id', 'permissions.permission_id')
        .where('employeeHasPermissions.employee_id', authCode.userId)
        .where('permissions.is_delete', false);

      if (!employee) {
        throw new CustomException('User not found', 404);
      }

      // Generate access token
      const tokenPayload = {
        user_id: employee.employee_id,
        employee_id: employee.employee_id,
        username: employee.employee_name,
        email: employee.employee_exmail_account,
        permissions: permissions.map(p => ({
          permission_name: p.permission_name,
          permission_id: p.permission_id,
        })),
      };

      const accessToken = jwt.sign(tokenPayload, ssoConfig.sso.jwt.secret, {
        expiresIn: ssoConfig.sso.jwt.expiresIn,
        issuer: ssoConfig.sso.jwt.issuer,
        audience: client_id,
      });

      // Clean up authorization code
      this.authorizationCodes.delete(code);

      Logger.info('SSO token generated successfully', { user_id: employee.employee_id, client_id });

      return res.status(200).json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 86400, // 24 hours
        scope: 'read write',
      });
    } catch (error) {
      Logger.error('Error generating SSO token:', error);
      
      if (error instanceof CustomException) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        errors: null,
        timestamp: new Date().toISOString()
      });
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
      const employee = await pgCore('employees')
        .select(['employee_id', 'employee_name', 'employee_exmail_account'])
        .where('employee_id', decoded.user_id)
        .where('is_delete', false)
        .first();
        
      const permissions = await pgCore('employeeHasPermissions')
        .select(['permissions.permission_name', 'permissions.permission_id'])
        .leftJoin('permissions', 'employeeHasPermissions.permission_id', 'permissions.permission_id')
        .where('employeeHasPermissions.employee_id', decoded.user_id)
        .where('permissions.is_delete', false);

      if (!employee) {
        throw new CustomException('User not found', 404);
      }

      return res.status(200).json({
        success: true,
        message: 'User info retrieved successfully',
        data: {
          user: {
            user_id: employee.employee_id,
            user_name: employee.employee_name,
            user_email: employee.employee_exmail_account,
            employee_id: employee.employee_id,
            employee_name: employee.employee_name,
          },
          permissions: permissions.map(p => ({
            permission_id: p.permission_id,
            permission_name: p.permission_name,
          })),
        },
      });
    } catch (error) {
      Logger.error('Error getting user info:', error);
      
      if (error instanceof CustomException) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Logout endpoint
  async logout(req, res) {
    try {
      const userId = req.user?.user_id;
      const clientIP = req.ip || req.connection.remoteAddress;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Token tidak valid atau tidak ada',
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      // In a real implementation, you would invalidate the token
      // by adding it to a blacklist or using token revocation
      // For now, we'll just log the logout

      Logger.info('SSO logout successful', { 
        user_id: userId,
        ip: clientIP,
        logout_time: new Date().toISOString()
      });

      return res.status(200).json({
        success: true,
        message: 'Logout berhasil',
        data: {
          user_id: userId,
          logout_time: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      Logger.error('Error during SSO logout:', error);
      
      if (error instanceof CustomException) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = SSOServerHandler;
