const jwt = require('jsonwebtoken');
const ssoConfig = require('../config/sso');
const { CustomException } = require('../utils/exception');
const { Logger } = require('../utils/logger');

/**
 * Middleware untuk memverifikasi JWT token SSO
 */
const verifySSOToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomException('Token tidak ditemukan', 401);
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new CustomException('Token tidak valid', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, ssoConfig.sso.jwt.secret);
    
    // Check token expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new CustomException('Token sudah expired', 401);
    }

    // Check required fields
    if (!decoded.user_id) {
      throw new CustomException('Token tidak mengandung user_id', 401);
    }

    // Set user data to request
    req.user = {
      user_id: decoded.user_id,
      iat: decoded.iat,
      exp: decoded.exp,
      aud: decoded.aud,
      iss: decoded.iss
    };

    Logger.info('SSO Token verified successfully', { 
      user_id: decoded.user_id,
      ip: req.ip 
    });

    next();
  } catch (error) {
    Logger.error('SSO Token verification failed:', error);
    
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: null,
        timestamp: new Date().toISOString()
      });
    }

    // Handle JWT specific errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah expired',
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
};

module.exports = {
  verifySSOToken
};
