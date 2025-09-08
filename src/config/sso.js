const config = {
  sso: {
    mode: process.env.SSO_MODE || 'server', // 'server' or 'client'
    
    // SSO Server Configuration
    server: {
      url: process.env.SSO_SERVER_URL || 'http://localhost:3000',
      secret: process.env.SSO_SERVER_SECRET || 'your_sso_server_secret_key',
    },
    
    // SSO Client Configuration
    client: {
      id: process.env.SSO_CLIENT_ID || 'your_client_id',
      secret: process.env.SSO_CLIENT_SECRET || 'your_client_secret',
      redirectUri: process.env.SSO_REDIRECT_URI || 'http://localhost:3001/auth/sso/callback',
      authorizationUrl: process.env.SSO_AUTHORIZATION_URL || 'http://localhost:3000/auth/sso/authorize',
      tokenUrl: process.env.SSO_TOKEN_URL || 'http://localhost:3000/auth/sso/token',
      userInfoUrl: process.env.SSO_USER_INFO_URL || 'http://localhost:3000/auth/sso/userinfo',
    },
    
    // JWT Configuration for SSO
    jwt: {
      secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: process.env.SSO_SERVER_URL || 'http://localhost:3000',
      audience: process.env.SSO_CLIENT_ID || 'your_client_id',
    },
  },
};

module.exports = config;
