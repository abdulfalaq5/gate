# Panduan Integrasi SSO untuk Sistem Eksternal

## 📋 Informasi SSO Server

- **SSO Server URL**: `http://localhost:9588`
- **Port**: `9588`
- **Client ID**: `external-system-client`
- **Client Secret**: `password` (default)
- **Sistem Eksternal Port**: `9581`

## 🔧 Langkah-langkah Integrasi

### 1. **Endpoint SSO yang Tersedia**

#### **Authorization Endpoint**
```
GET http://localhost:9588/api/v1/auth/sso/authorize
```

**Parameters:**
- `client_id`: `external-system-client`
- `response_type`: `code`
- `redirect_uri`: `http://localhost:9581/auth/callback`
- `scope`: `read write profile email openid`
- `state`: `random_state_string` (optional, untuk security)

#### **Token Endpoint**
```
POST http://localhost:9588/api/v1/auth/sso/token
```

**Body:**
```json
{
  "grant_type": "authorization_code",
  "client_id": "external-system-client",
  "client_secret": "password",
  "code": "authorization_code_from_callback",
  "redirect_uri": "http://localhost:9581/auth/callback"
}
```

#### **User Info Endpoint**
```
GET http://localhost:9588/api/v1/auth/sso/userinfo
```

**Headers:**
```
Authorization: Bearer access_token_from_token_endpoint
```

#### **Login Endpoint**
```
POST http://localhost:9588/api/v1/auth/sso/login
```

**Body:**
```json
{
  "client_id": "external-system-client",
  "client_secret": "password",
  "username": "admin",
  "password": "password"
}
```

### 2. **Flow OAuth2 Authorization Code**

#### **Step 1: Redirect ke SSO Server**
```javascript
// Di sistem eksternal (port 9581)
const ssoAuthUrl = new URL('http://localhost:9588/api/v1/auth/sso/authorize');
ssoAuthUrl.searchParams.set('client_id', 'external-system-client');
ssoAuthUrl.searchParams.set('response_type', 'code');
ssoAuthUrl.searchParams.set('redirect_uri', 'http://localhost:9581/auth/callback');
ssoAuthUrl.searchParams.set('scope', 'read write profile email openid');
ssoAuthUrl.searchParams.set('state', 'random_state_string');

// Redirect user ke SSO server
window.location.href = ssoAuthUrl.toString();
```

#### **Step 2: Handle Callback**
```javascript
// Di sistem eksternal (port 9581) - route: /auth/callback
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Exchange code untuk access token
  const tokenResponse = await fetch('http://localhost:9588/api/v1/auth/sso/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: 'external-system-client',
      client_secret: 'password',
      code: code,
      redirect_uri: 'http://localhost:9581/auth/callback'
    })
  });
  
  const tokenData = await tokenResponse.json();
  
  if (tokenData.access_token) {
    // Get user info
    const userResponse = await fetch('http://localhost:9588/api/v1/auth/sso/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    const userData = await userResponse.json();
    
    // Set session atau cookie
    req.session.user = userData;
    res.redirect('/dashboard');
  } else {
    res.redirect('/login?error=authentication_failed');
  }
});
```

### 3. **Contoh Implementasi Lengkap**

#### **Express.js Implementation**
```javascript
const express = require('express');
const session = require('express-session');
const fetch = require('node-fetch');

const app = express();
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <a href="/auth/sso">Login with SSO</a>
  `);
});

// SSO Login redirect
app.get('/auth/sso', (req, res) => {
  const ssoAuthUrl = new URL('http://localhost:9588/api/v1/auth/sso/authorize');
  ssoAuthUrl.searchParams.set('client_id', 'external-system-client');
  ssoAuthUrl.searchParams.set('response_type', 'code');
  ssoAuthUrl.searchParams.set('redirect_uri', 'http://localhost:9581/auth/callback');
  ssoAuthUrl.searchParams.set('scope', 'read write profile email openid');
  ssoAuthUrl.searchParams.set('state', Math.random().toString(36));
  
  res.redirect(ssoAuthUrl.toString());
});

// SSO Callback
app.get('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // Exchange code untuk access token
    const tokenResponse = await fetch('http://localhost:9588/api/v1/auth/sso/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: 'external-system-client',
        client_secret: 'password',
        code: code,
        redirect_uri: 'http://localhost:9581/auth/callback'
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      // Get user info
      const userResponse = await fetch('http://localhost:9588/api/v1/auth/sso/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      const userData = await userResponse.json();
      
      // Set session
      req.session.user = userData;
      req.session.accessToken = tokenData.access_token;
      
      res.redirect('/dashboard');
    } else {
      res.redirect('/login?error=authentication_failed');
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
      <h1>Dashboard</h1>
      <p>Welcome, ${req.session.user.user_name}!</p>
      <p>Email: ${req.session.user.user_email}</p>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.redirect('/login');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(9581, () => {
  console.log('External system running on port 9581');
});
```

### 4. **Testing SSO Integration**

#### **Test dengan cURL**
```bash
# 1. Test login endpoint
curl -X POST http://localhost:9588/api/v1/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "external-system-client",
    "client_secret": "password",
    "username": "admin",
    "password": "password"
  }'

# 2. Test authorization endpoint
curl "http://localhost:9588/api/v1/auth/sso/authorize?client_id=external-system-client&response_type=code&redirect_uri=http://localhost:9581/auth/callback&scope=read%20write%20profile%20email%20openid"

# 3. Test user info endpoint (dengan access token)
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:9588/api/v1/auth/sso/userinfo
```

### 5. **Environment Variables untuk Sistem Eksternal**

```bash
# .env untuk sistem eksternal
SSO_SERVER_URL=http://localhost:9588
SSO_CLIENT_ID=external-system-client
SSO_CLIENT_SECRET=password
SSO_REDIRECT_URI=http://localhost:9581/auth/callback
SSO_SCOPES=read write profile email openid
```

### 6. **Security Considerations**

1. **State Parameter**: Selalu gunakan state parameter untuk mencegah CSRF attacks
2. **HTTPS**: Gunakan HTTPS di production
3. **Client Secret**: Simpan client secret dengan aman
4. **Token Storage**: Simpan access token dengan aman (httpOnly cookies)
5. **Token Expiry**: Handle token expiry dengan refresh token

### 7. **Troubleshooting**

#### **Common Issues:**
1. **CORS Error**: Pastikan SSO server mengizinkan origin sistem eksternal
2. **Redirect URI Mismatch**: Pastikan redirect_uri sama dengan yang terdaftar
3. **Invalid Client**: Pastikan client_id dan client_secret benar
4. **Token Expired**: Implementasi refresh token mechanism

#### **Debug Steps:**
1. Check SSO server logs
2. Verify client credentials
3. Test endpoints dengan cURL
4. Check network requests di browser dev tools

## 🚀 Quick Start

1. **Pastikan SSO server berjalan di port 9588**
2. **Jalankan seeder SSO client**: `npx knex seed:run --specific=sso_clients_seeder.js`
3. **Buat sistem eksternal di port 9581** dengan implementasi di atas
4. **Test flow OAuth2** dengan mengakses `http://localhost:9581/login`

## 📞 Support

Jika ada masalah, periksa:
- SSO server logs di `logs/application-*.log`
- Database connection
- Client credentials di tabel `sso_clients`
- Network connectivity antara sistem
