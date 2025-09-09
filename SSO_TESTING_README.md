# SSO Testing Data & Examples

## 📋 Overview

File-file ini berisi data testing dan contoh untuk sistem SSO yang telah dibuat. Semua data testing sudah siap digunakan untuk menguji integrasi SSO.

## 📁 Files Created

### 1. **Seeder Files**
- `src/repository/postgres/seeders/sso_users_testing_seeder.js` - Seeder untuk data user testing
- `src/repository/postgres/seeders/sso_clients_seeder.js` - Seeder untuk SSO clients (sudah ada)

### 2. **Testing Scripts**
- `setup-sso-testing.sh` - Script untuk setup environment testing
- `test-sso-curl.sh` - Script interaktif untuk testing dengan cURL
- `external-system-with-bearer-token.js` - Contoh client system dengan bearer token

### 3. **Documentation**
- `SSO_TESTING_GUIDE.md` - Panduan lengkap testing SSO
- `SSO_INTEGRATION_GUIDE.md` - Panduan integrasi SSO (sudah ada)

## 🚀 Quick Start

### 1. Setup Testing Environment
```bash
# Jalankan script setup
./setup-sso-testing.sh
```

### 2. Start Services
```bash
# Terminal 1: Start SSO Server
npm start

# Terminal 2: Start External System
node external-system-with-bearer-token.js
```

### 3. Run Tests
```bash
# Interactive testing
./test-sso-curl.sh

# Atau manual testing dengan cURL
curl -X POST http://localhost:9588/api/v1/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{"user_name": "admin", "user_password": "admin123", "client_id": "external-system-client", "redirect_uri": "http://localhost:3001/auth/callback"}'
```

## 👥 Test Users

| Username | Email | Password | Role | Description |
|----------|-------|----------|------|-------------|
| `admin` | admin@sso-testing.com | `admin123` | Super Admin | Full access to all features |
| `manager` | manager@sso-testing.com | `manager123` | Manager | Limited access to management features |
| `user` | user@sso-testing.com | `user123` | User | Basic access only |

## 🔑 SSO Clients

| Client ID | Client Secret | Redirect URIs | Scopes |
|-----------|---------------|---------------|---------|
| `external-system-client` | `password` | http://localhost:3001/auth/callback | read, write, profile, email, openid |
| `test-client` | `password` | http://localhost:3000/auth/callback | read, write, profile, email |

## 📝 Example cURL Commands

### Basic Login
```bash
curl -X POST http://localhost:9588/api/v1/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "admin",
    "user_password": "admin123",
    "client_id": "external-system-client",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'
```

### OAuth2 Flow
```bash
# 1. Authorization
curl -X GET "http://localhost:9588/api/v1/auth/sso/authorize?client_id=external-system-client&response_type=code&redirect_uri=http://localhost:3001/auth/callback&scope=read%20write%20profile%20email%20openid&state=test-state"

# 2. Token Exchange
curl -X POST http://localhost:9588/api/v1/auth/sso/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "external-system-client",
    "client_secret": "password",
    "code": "AUTHORIZATION_CODE_FROM_STEP_1",
    "redirect_uri": "http://localhost:3001/auth/callback"
  }'

# 3. User Info
curl -X GET http://localhost:9588/api/v1/auth/sso/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN_FROM_STEP_2"
```

## 🧪 Testing Scenarios

### 1. Valid Login Tests
- ✅ Admin login with full permissions
- ✅ Manager login with limited permissions  
- ✅ User login with basic permissions
- ✅ Login with email instead of username

### 2. Invalid Login Tests
- ❌ Wrong password
- ❌ Non-existent user
- ❌ Invalid client ID
- ❌ Invalid redirect URI
- ❌ Account locked (after 5 failed attempts)

### 3. OAuth2 Flow Tests
- ✅ Authorization code generation
- ✅ Token exchange
- ✅ User info retrieval
- ✅ Token refresh
- ✅ Logout

## 📊 Permission Matrix

| Role | Dashboard | Users | Roles | Companies | Departments | Employees | Reports | Settings |
|------|-----------|-------|-------|-----------|-------------|-----------|---------|----------|
| **Super Admin** | ✅ Read | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| **Manager** | ✅ Read | ✅ Read/Write | ❌ None | ❌ None | ✅ Read/Write | ✅ Read/Write | ✅ Read | ❌ None |
| **User** | ✅ Read | ✅ Read | ❌ None | ❌ None | ✅ Read | ✅ Read | ❌ None | ❌ None |

## 🔧 Environment Setup

### Prerequisites
- Node.js (v14+)
- npm
- PostgreSQL database
- Knex CLI

### Database Setup
```bash
# Run migrations
npx knex migrate:latest

# Run seeders
npx knex seed:run --specific=sso_users_testing_seeder.js
npx knex seed:run --specific=sso_clients_seeder.js
```

### Service URLs
- **SSO Server**: http://localhost:9588
- **External System**: http://localhost:3001
- **Database**: PostgreSQL (configured in `src/config/database.js`)

## 📚 Additional Resources

- [SSO Testing Guide](SSO_TESTING_GUIDE.md) - Detailed testing documentation
- [SSO Integration Guide](SSO_INTEGRATION_GUIDE.md) - Integration documentation
- [External System Example](external-system-with-bearer-token.js) - Complete client implementation

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check database configuration
   cat src/config/database.js
   
   # Test connection
   npx knex migrate:status
   ```

2. **Seeder Failed**
   ```bash
   # Check if tables exist
   npx knex migrate:latest
   
   # Run specific seeder
   npx knex seed:run --specific=sso_users_testing_seeder.js
   ```

3. **SSO Server Not Starting**
   ```bash
   # Check if port 9588 is available
   lsof -i :9588
   
   # Check logs
   tail -f logs/application-*.log
   ```

4. **Client System Error**
   ```bash
   # Install dependencies
   npm install express express-session node-fetch
   
   # Check if port 3001 is available
   lsof -i :3001
   ```

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Periksa logs di `logs/application-*.log`
2. Pastikan database connection berjalan
3. Verifikasi client credentials di tabel `sso_clients`
4. Test network connectivity antara services

## 🎯 Next Steps

1. **Production Setup**: Ganti mock data dengan database production
2. **Security Hardening**: Implementasi rate limiting, CSRF protection
3. **Monitoring**: Tambahkan logging dan monitoring
4. **Documentation**: Buat API documentation dengan Swagger
5. **Testing**: Implementasi unit tests dan integration tests
