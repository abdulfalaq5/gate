# SSO Testing Data & cURL Examples

## 🌱 Seeder Data

File seeder: `src/repository/postgres/seeders/sso_users_testing_seeder.js`

### Menjalankan Seeder
```bash
npx knex seed:run --specific=sso_users_testing_seeder.js
```

## 👥 Test Users

| Username | Email | Password | Role | Permissions |
|----------|-------|----------|------|-------------|
| `admin` | admin@sso-testing.com | `admin123` | Super Admin | All permissions |
| `manager` | manager@sso-testing.com | `manager123` | Manager | Limited permissions |
| `user` | user@sso-testing.com | `user123` | User | Basic permissions |

## 🔑 SSO Clients

| Client ID | Client Secret | Redirect URIs | Scopes |
|-----------|---------------|---------------|---------|
| `external-system-client` | `password` | http://localhost:3001/auth/callback | read, write, profile, email, openid |
| `test-client` | `password` | http://localhost:3000/auth/callback | read, write, profile, email |

## 📝 cURL Examples

### 1. SSO Login (Direct Login)

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "admin",
    "user_password": "admin123",
    "client_id": "external-system-client",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login SSO berhasil",
  "data": {
    "user_id": "uuid-here",
    "user_name": "admin",
    "user_email": "admin@sso-testing.com",
    "role_id": "role-uuid",
    "employee_id": "employee-uuid",
    "permissions": [
      {
        "permission_id": "perm-uuid",
        "permission_name": "read",
        "menu_id": "menu-uuid",
        "menu_name": "Dashboard",
        "menu_url": "/dashboard"
      }
    ],
    "authorization_code": "auth-code-here",
    "redirect_uri": "http://localhost:3001/auth/callback",
    "expires_in": 600
  }
}
```

### 2. SSO Login (Manager User)

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "manager",
    "user_password": "manager123",
    "client_id": "external-system-client",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'
```

### 3. SSO Login (Regular User)

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "user",
    "user_password": "user123",
    "client_id": "external-system-client",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'
```

### 4. SSO Login dengan Email

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "admin@sso-testing.com",
    "user_password": "admin123",
    "client_id": "external-system-client",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'
```

### 5. SSO Login tanpa Client ID (Basic Login)

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "admin",
    "user_password": "admin123"
  }'
```

## 🔄 OAuth2 Flow Examples

### 1. Authorization Endpoint

```bash
curl -X 'GET' \
  'http://localhost:9588/api/v1/auth/sso/authorize?client_id=external-system-client&response_type=code&redirect_uri=http://localhost:3001/auth/callback&scope=read%20write%20profile%20email%20openid&state=random-state-123'
```

### 2. Token Exchange

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "external-system-client",
    "client_secret": "password",
    "code": "authorization-code-from-step-1",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Token berhasil dibuat",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "scope": "read write profile email openid",
    "session_id": "session-uuid"
  }
}
```

### 3. User Info dengan Bearer Token

```bash
curl -X 'GET' \
  'http://localhost:9588/api/v1/auth/sso/userinfo' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Response:**
```json
{
  "success": true,
  "message": "User info berhasil diambil",
  "data": {
    "user_id": "user-uuid",
    "user_name": "admin",
    "user_email": "admin@sso-testing.com",
    "first_name": "Admin",
    "last_name": "User",
    "roles": ["admin", "user"],
    "permissions": ["read", "write", "delete", "admin"],
    "client_id": "external-system-client",
    "session_id": "session-uuid",
    "scope": ["read", "write", "profile", "email", "openid"],
    "login_time": "2024-01-01T00:00:00.000Z",
    "last_activity": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Refresh Token

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "grant_type": "refresh_token",
    "client_id": "external-system-client",
    "client_secret": "password",
    "refresh_token": "refresh-token-from-step-2"
  }'
```

### 5. Logout

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/logout' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "access-token-to-invalidate",
    "refresh_token": "refresh-token-to-invalidate",
    "client_id": "external-system-client"
  }'
```

## 🧪 Testing Scenarios

### 1. Test Invalid Credentials

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "admin",
    "user_password": "wrongpassword",
    "client_id": "external-system-client",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'
```

### 2. Test Invalid Client

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "admin",
    "user_password": "admin123",
    "client_id": "invalid-client",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'
```

### 3. Test Invalid Redirect URI

```bash
curl -X 'POST' \
  'http://localhost:9588/api/v1/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "admin",
    "user_password": "admin123",
    "client_id": "external-system-client",
    "redirect_uri": "http://malicious-site.com/callback"
  }'
```

## 📊 System Statistics

```bash
curl -X 'GET' \
  'http://localhost:9588/api/v1/auth/sso/stats' \
  -H 'accept: application/json'
```

## 🔧 Environment Setup

### 1. Start SSO Server
```bash
npm start
# Server runs on http://localhost:9588
```

### 2. Start External System
```bash
node external-system-with-bearer-token.js
# Client runs on http://localhost:3001
```

### 3. Run Seeder
```bash
npx knex seed:run --specific=sso_users_testing_seeder.js
```

## 📋 Permission Matrix

| Role | Dashboard | Users | Roles | Companies | Departments | Employees | Reports | Settings |
|------|-----------|-------|-------|-----------|-------------|-----------|---------|----------|
| **Super Admin** | ✅ Read | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| **Manager** | ✅ Read | ✅ Read/Write | ❌ None | ❌ None | ✅ Read/Write | ✅ Read/Write | ✅ Read | ❌ None |
| **User** | ✅ Read | ✅ Read | ❌ None | ❌ None | ✅ Read | ✅ Read | ❌ None | ❌ None |

## 🚀 Quick Test Commands

```bash
# Test admin login
curl -X POST http://localhost:9588/api/v1/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{"user_name": "admin", "user_password": "admin123", "client_id": "external-system-client", "redirect_uri": "http://localhost:3001/auth/callback"}'

# Test manager login  
curl -X POST http://localhost:9588/api/v1/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{"user_name": "manager", "user_password": "manager123", "client_id": "external-system-client", "redirect_uri": "http://localhost:3001/auth/callback"}'

# Test user login
curl -X POST http://localhost:9588/api/v1/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{"user_name": "user", "user_password": "user123", "client_id": "external-system-client", "redirect_uri": "http://localhost:3001/auth/callback"}'
```
