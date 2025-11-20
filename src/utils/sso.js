const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const ssoConfig = require('../config/sso');
const { pgCore } = require('../config/database');
const { CustomException } = require('./exception');

// Generate random UUID v4
function generateUUID() {
  return crypto.randomUUID();
}

// Generate random string
function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Hash password
async function hashPassword(password) {
  const bcrypt = require('bcrypt');
  return await bcrypt.hash(password, 10);
}

// Verify password
async function verifyPassword(password, hashedPassword) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
function generateJWT(payload, secret, options = {}) {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, secret, options);
}

// Verify JWT token
function verifyJWT(token, secret) {
  const jwt = require('jsonwebtoken');
  return jwt.verify(token, secret);
}

// Generate authorization code
function generateAuthorizationCode() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate state parameter for OAuth2
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Get user info from SSO token
 * Mengambil user_id dan employee_id dari token dengan cara hit endpoint SSO userinfo
 * atau langsung query database jika token valid
 * 
 * @param {string} token - JWT token dari Authorization header
 * @returns {Promise<Object>} Object berisi user_id dan employee_id
 * @throws {CustomException} Jika token tidak valid atau user tidak ditemukan
 */
async function getUserInfoFromToken(token) {
  try {
    if (!token) {
      throw new CustomException('Token tidak ditemukan', 401);
    }

    // Remove 'Bearer ' prefix if exists
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    // Verify and decode JWT token
    const decoded = jwt.verify(cleanToken, ssoConfig.sso.jwt.secret);

    // Check token expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new CustomException('Token sudah expired', 401);
    }

    // Check required fields
    if (!decoded.user_id) {
      throw new CustomException('Token tidak mengandung user_id', 401);
    }

    // Get employee from database
    const employee = await pgCore('employees')
      .select(['employee_id', 'employee_name', 'employee_exmail_account'])
      .where('employee_id', decoded.user_id)
      .where('is_delete', false)
      .first();

    if (!employee) {
      throw new CustomException('User tidak ditemukan', 404);
    }

    // Return user info dengan user_id sebagai employee_id
    return {
      user_id: employee.employee_id,
      employee_id: employee.employee_id,
      user_name: employee.employee_name,
      user_email: employee.employee_exmail_account,
      employee_name: employee.employee_name,
    };
  } catch (error) {
    if (error instanceof CustomException) {
      throw error;
    }

    // Handle JWT specific errors
    if (error.name === 'JsonWebTokenError') {
      throw new CustomException('Token tidak valid', 401);
    }

    if (error.name === 'TokenExpiredError') {
      throw new CustomException('Token sudah expired', 401);
    }

    throw new CustomException('Gagal mengambil user info: ' + error.message, 500);
  }
}

module.exports = {
  generateUUID,
  generateRandomString,
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  generateAuthorizationCode,
  generateState,
  getUserInfoFromToken,
};
