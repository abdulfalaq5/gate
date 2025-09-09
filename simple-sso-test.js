const express = require('express');
const app = express();

// SSO Configuration
const SSO_CONFIG = {
  serverUrl: 'http://localhost:9588',
  clientId: 'test_client',
  clientSecret: 'test_secret',
  redirectUri: 'http://localhost:3001/callback',
  scopes: 'read write'
};

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>External System - SSO Test</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
            .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
            .btn:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <h1>External System</h1>
        <p>Test SSO Integration</p>
        <a href="/auth/sso" class="btn">Login with SSO</a>
    </body>
    </html>
  `);
});

// SSO Login redirect
app.get('/auth/sso', (req, res) => {
  const ssoAuthUrl = new URL(`${SSO_CONFIG.serverUrl}/api/v1/auth/sso/authorize`);
  ssoAuthUrl.searchParams.set('client_id', SSO_CONFIG.clientId);
  ssoAuthUrl.searchParams.set('response_type', 'code');
  ssoAuthUrl.searchParams.set('redirect_uri', SSO_CONFIG.redirectUri);
  ssoAuthUrl.searchParams.set('scope', SSO_CONFIG.scopes);
  
  console.log('Redirecting to SSO:', ssoAuthUrl.toString());
  res.redirect(ssoAuthUrl.toString());
});

// SSO Callback
app.get('/callback', (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.send(`<h1>SSO Error: ${error}</h1>`);
  }
  
  if (!code) {
    return res.send('<h1>No authorization code received</h1>');
  }
  
  res.send(`
    <h1>SSO Callback Received</h1>
    <p>Authorization Code: ${code}</p>
    <p>Status: Success!</p>
  `);
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 External System running on port ${PORT}`);
  console.log(`📱 Access: http://localhost:${PORT}`);
  console.log(`🔐 SSO Server: ${SSO_CONFIG.serverUrl}`);
  console.log(`🆔 Client ID: ${SSO_CONFIG.clientId}`);
});
