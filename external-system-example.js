const express = require('express');
const session = require('express-session');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'external-system-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true jika menggunakan HTTPS
}));

// SSO Configuration
const SSO_CONFIG = {
  serverUrl: 'http://localhost:9588',
  clientId: 'external-system-client',
  clientSecret: 'password',
  redirectUri: 'http://localhost:9581/auth/callback',
  scopes: 'read write profile email openid'
};

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Login page
app.get('/login', (req, res) => {
  const error = req.query.error;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login - External System</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
            .error { color: red; margin-bottom: 20px; }
            .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
            .btn:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <h1>External System Login</h1>
        ${error ? `<div class="error">Error: ${error}</div>` : ''}
        <p>Silakan login menggunakan SSO:</p>
        <a href="/auth/sso" class="btn">Login with SSO</a>
    </body>
    </html>
  `);
});

// SSO Login redirect
app.get('/auth/sso', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  req.session.state = state;
  
  const ssoAuthUrl = new URL(`${SSO_CONFIG.serverUrl}/api/v1/auth/sso/authorize`);
  ssoAuthUrl.searchParams.set('client_id', SSO_CONFIG.clientId);
  ssoAuthUrl.searchParams.set('response_type', 'code');
  ssoAuthUrl.searchParams.set('redirect_uri', SSO_CONFIG.redirectUri);
  ssoAuthUrl.searchParams.set('scope', SSO_CONFIG.scopes);
  ssoAuthUrl.searchParams.set('state', state);
  
  console.log('Redirecting to SSO:', ssoAuthUrl.toString());
  res.redirect(ssoAuthUrl.toString());
});

// SSO Callback
app.get('/auth/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    if (error) {
      console.error('SSO Error:', error);
      return res.redirect('/login?error=' + encodeURIComponent(error));
    }
    
    if (!code) {
      return res.redirect('/login?error=no_code_received');
    }
    
    // Verify state parameter
    if (state !== req.session.state) {
      return res.redirect('/login?error=invalid_state');
    }
    
    console.log('Received authorization code:', code);
    
    // Exchange code untuk access token
    const tokenResponse = await fetch(`${SSO_CONFIG.serverUrl}/api/v1/auth/sso/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: SSO_CONFIG.clientId,
        client_secret: SSO_CONFIG.clientSecret,
        code: code,
        redirect_uri: SSO_CONFIG.redirectUri
      })
    });
    
    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);
    
    if (tokenData.access_token) {
      // Get user info
      const userResponse = await fetch(`${SSO_CONFIG.serverUrl}/api/v1/auth/sso/userinfo`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      const userData = await userResponse.json();
      console.log('User data:', userData);
      
      // Set session
      req.session.user = userData;
      req.session.accessToken = tokenData.access_token;
      req.session.refreshToken = tokenData.refresh_token;
      
      res.redirect('/dashboard');
    } else {
      console.error('No access token received:', tokenData);
      res.redirect('/login?error=no_access_token');
    }
  } catch (error) {
    console.error('SSO Callback Error:', error);
    res.redirect('/login?error=server_error');
  }
});

// Dashboard (protected route)
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Dashboard - External System</title>
          <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
              .user-info { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
              .btn { background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
              .btn:hover { background: #c82333; }
          </style>
      </head>
      <body>
          <h1>Dashboard - External System</h1>
          <div class="user-info">
              <h2>User Information</h2>
              <p><strong>Name:</strong> ${req.session.user.user_name || 'N/A'}</p>
              <p><strong>Email:</strong> ${req.session.user.user_email || 'N/A'}</p>
              <p><strong>Role:</strong> ${req.session.user.role_name || 'N/A'}</p>
              <p><strong>Company:</strong> ${req.session.user.company_name || 'N/A'}</p>
              <p><strong>Department:</strong> ${req.session.user.department_name || 'N/A'}</p>
          </div>
          <p>Selamat datang di sistem eksternal! Anda berhasil login melalui SSO.</p>
          <a href="/logout" class="btn">Logout</a>
      </body>
      </html>
    `);
  } else {
    res.redirect('/login');
  }
});

// API endpoint untuk mendapatkan user info
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({
      success: true,
      user: req.session.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.redirect('/login');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 External System running on port ${PORT}`);
  console.log(`📱 Access: http://localhost:${PORT}`);
  console.log(`🔐 SSO Server: ${SSO_CONFIG.serverUrl}`);
  console.log(`🆔 Client ID: ${SSO_CONFIG.clientId}`);
});
