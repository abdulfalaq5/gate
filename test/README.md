# Test Files - Gate SSO System

Folder ini berisi semua file test dan script testing untuk Gate SSO System.

## 📁 Struktur Test Files

### 🔧 Setup & Configuration Tests
- **`setup-sso-testing.sh`** - Script setup environment testing SSO
- **`test-repository.js`** - Test koneksi dan operasi repository database

### 🌐 API Endpoint Tests
- **`test-all-endpoints.sh`** - Test semua endpoint API
- **`test-companies-api.sh`** - Test API companies
- **`test-departments-api.sh`** - Test API departments  
- **`test-menu-has-permissions-api.sh`** - Test API menu has permissions
- **`test-users-api.sh`** - Test API users

### 🔐 SSO Authentication Tests
- **`test-sso-curl.sh`** - Test SSO dengan curl commands
- **`test-sso-profile-api.sh`** - Test SSO profile API
- **`test-sso-profile-api.js`** - Test SSO profile API (Node.js)
- **`test-sso-profile-combined.sh`** - Test kombinasi SSO profile
- **`test-sso-profile-fixed.sh`** - Test SSO profile yang sudah diperbaiki
- **`test-sso-simple.js`** - Test SSO sederhana
- **`simple-sso-test.js`** - Test SSO basic functionality

### 🧪 System Integration Tests
- **`test-rabbitmq.sh`** - Test koneksi dan operasi RabbitMQ
- **`test-standard-filters.sh`** - Test sistem filter standar
- **`test-upload-size.js`** - Test limit upload file
- **`test_import_api.sh`** - Test API import data

### 📊 Swagger & Documentation Tests
- **`test-swagger-sso-profile.sh`** - Test Swagger documentation untuk SSO profile

## 🚀 Cara Menjalankan Tests

### Prerequisites
Pastikan server sudah running dan environment sudah dikonfigurasi dengan benar.

### Running Tests

#### 1. Setup Testing Environment
```bash
cd test
chmod +x *.sh
./setup-sso-testing.sh
```

#### 2. Test Individual Components
```bash
# Test API endpoints
./test-all-endpoints.sh
./test-companies-api.sh
./test-departments-api.sh
./test-menu-has-permissions-api.sh
./test-users-api.sh

# Test SSO functionality
./test-sso-curl.sh
./test-sso-profile-api.sh
./test-sso-simple.js

# Test system components
./test-rabbitmq.sh
./test-standard-filters.sh
```

#### 3. Test dengan Node.js
```bash
node test-repository.js
node simple-sso-test.js
node test-upload-size.js
```

## 📋 Test Categories

### ✅ Unit Tests
- `test-repository.js` - Database operations
- `simple-sso-test.js` - Basic SSO functionality
- `test-upload-size.js` - File upload validation

### ✅ Integration Tests  
- `test-all-endpoints.sh` - API integration
- `test-rabbitmq.sh` - Message queue integration
- `test-sso-profile-combined.sh` - SSO profile integration

### ✅ End-to-End Tests
- `test-sso-curl.sh` - Complete SSO flow
- `test-sso-profile-fixed.sh` - Full profile management flow

## 🔧 Configuration

Sebelum menjalankan tests, pastikan:

1. **Server Running**: Port 9518 (atau sesuai konfigurasi)
2. **Database Connected**: PostgreSQL dengan data test
3. **RabbitMQ Running**: Jika menggunakan message queue
4. **Environment Variables**: File `.env` sudah dikonfigurasi

## 📊 Expected Results

### Successful Tests
- ✅ HTTP 200 responses untuk GET requests
- ✅ HTTP 201 responses untuk POST requests  
- ✅ Valid JSON responses
- ✅ Proper authentication dengan Bearer tokens

### Common Issues
- ❌ Connection refused - Server tidak running
- ❌ Authentication failed - Token expired atau invalid
- ❌ Database connection error - Database tidak accessible
- ❌ RabbitMQ connection error - Message queue tidak running

## 🐛 Troubleshooting

### Server Issues
```bash
# Check if server is running
curl http://localhost:9518/api/health

# Check server logs
tail -f logs/application-*.log
```

### Database Issues
```bash
# Test database connection
node test-repository.js
```

### Authentication Issues
```bash
# Get new token
curl -X POST http://localhost:9518/api/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

## 📝 Adding New Tests

Untuk menambah test baru:

1. **Buat file test** dengan prefix `test-`
2. **Gunakan format yang konsisten** dengan test yang ada
3. **Include proper error handling**
4. **Document test purpose** di header file
5. **Update README ini** jika diperlukan

### Template untuk Shell Script Test
```bash
#!/bin/bash

# Test: [Test Name]
# Description: [What this test does]
# Expected: [Expected behavior]

BASE_URL="http://localhost:9518/api"
TOKEN="your_bearer_token"

echo "Testing [Test Name]..."

# Your test commands here

echo "Test completed!"
```

### Template untuk Node.js Test
```javascript
// Test: [Test Name]
// Description: [What this test does]
// Expected: [Expected behavior]

const axios = require('axios');

async function testFunctionName() {
  try {
    // Your test code here
    console.log('Test passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFunctionName();
```

---

**Last Updated:** September 2025  
**Maintained by:** Development Team
