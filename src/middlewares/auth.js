const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Set user info in request object
    req.user = {
      employee_id: decoded.employee_id || decoded.user_id, // Support both for backward compatibility
      user_id: decoded.employee_id || decoded.user_id,
      username: decoded.username,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = {
  authenticateToken
};
