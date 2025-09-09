# 🚀 Panduan Lengkap Integrasi SSO untuk Sistem Eksternal

## ✅ **Status: SSO Server Siap Digunakan!**

SSO server Anda sudah berjalan di **port 9588** dan siap untuk diintegrasikan dengan sistem lain di **port 9581**.

## 📋 **Informasi SSO Server**

- **SSO Server URL**: `http://localhost:9588`
- **Port**: `9588`
- **Status**: ✅ **AKTIF dan BERFUNGSI**

## 🔑 **SSO Client yang Tersedia**

### **1. Test Client (Sudah Aktif)**
- **Client ID**: `test_client`
- **Client Secret**: `test_secret`
- **Status**: ✅ **AKTIF**
- **Redirect URIs**: 
  - `http://localhost:3001/callback`
  - `http://localhost:3002/callback`
- **Scopes**: `read`, `write`

### **2. External System Client (Baru Didaftarkan)**
- **Client ID**: `external_mfbv2hf7_o554nb`
- **Client Secret**: `z1hy0h3fp72gh9dwbxqfhq4jggapq7q`
- **Status**: ⏳ **PENDING** (perlu aktivasi)
- **Redirect URIs**: `http://localhost:9581/auth/callback`
- **Scopes**: `read`, `write`, `profile`, `email`

## 🔧 **Langkah-langkah Integrasi**

### **Step 1: Gunakan Test Client untuk Testing**

Untuk testing awal, gunakan `test_client` yang sudah aktif:

```javascript
const SSO_CONFIG = {
  serverUrl: 'http://localhost:9588',
  clientId: 'test_client',
  clientSecret: 'test_secret',
  redirectUri: 'http://localhost:3001/callback', // Sesuaikan dengan yang terdaftar
  scopes: 'read write'
};
```

### **Step 2: Buat Sistem Eksternal di Port 9581**

1. **Install dependencies**:
```bash
npm install express express-session node-fetch
```

2. **Gunakan file contoh** yang sudah saya buat:
```bash
# Copy file contoh
cp external-system-example.js your-system.js
cp external-system-package.json package.json

# Install dependencies
npm install
```

3. **Modifikasi konfigurasi** di file `your-system.js`:
```javascript
const SSO_CONFIG = {
  serverUrl: 'http://localhost:9588',
  clientId: 'test_client', // Gunakan test_client untuk testing
  clientSecret: 'test_secret',
  redirectUri: 'http://localhost:3001/callback', // Sesuaikan dengan yang terdaftar
  scopes: 'read write'
};
```

4. **Jalankan sistem**:
```bash
node your-system.js
```

### **Step 3: Test Integrasi**

1. **Akses sistem eksternal**: `http://localhost:3001`
2. **Klik "Login with SSO"**
3. **Login dengan credentials**:
   - Username: `admin`
   - Password: `password`

## 🧪 **Testing dengan cURL**

### **Test SSO Login**
```bash
curl -X POST http://localhost:9588/api/v1/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test_client",
    "client_secret": "test_secret",
    "username": "admin",
    "password": "password"
  }'
```

### **Test Authorization Endpoint**
```bash
curl "http://localhost:9588/api/v1/auth/sso/authorize?client_id=test_client&response_type=code&redirect_uri=http://localhost:3001/callback&scope=read%20write"
```

### **Test User Info**
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:9588/api/v1/auth/sso/userinfo
```

## 📱 **Contoh Implementasi Lengkap**

Saya sudah membuat file `external-system-example.js` yang berisi implementasi lengkap untuk sistem eksternal. File ini mencakup:

- ✅ **Login page** dengan redirect ke SSO
- ✅ **Callback handler** untuk menerima authorization code
- ✅ **Token exchange** untuk mendapatkan access token
- ✅ **User info retrieval** untuk mendapatkan data user
- ✅ **Dashboard** untuk menampilkan informasi user
- ✅ **Logout** functionality
- ✅ **Session management**
- ✅ **Error handling**

## 🔄 **OAuth2 Flow yang Digunakan**

1. **User mengakses sistem eksternal** → Redirect ke SSO server
2. **User login di SSO server** → SSO server redirect dengan authorization code
3. **Sistem eksternal exchange code** → Mendapatkan access token
4. **Sistem eksternal get user info** → Menggunakan access token
5. **User berhasil login** → Dashboard ditampilkan

## 🛠️ **Untuk Production**

### **1. Daftarkan Client Baru**
```bash
curl -X POST http://localhost:9588/api/v1/auth/sso/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production System Client",
    "description": "SSO Client untuk sistem production",
    "redirect_uris": ["https://yourdomain.com/auth/callback"],
    "scopes": ["read", "write", "profile", "email"],
    "contact_email": "admin@yourdomain.com",
    "website": "https://yourdomain.com",
    "terms_accepted": true,
    "privacy_policy_accepted": true
  }'
```

### **2. Aktifkan Client**
Setelah client didaftarkan, Anda perlu mengaktifkannya (status berubah dari "pending" ke "active").

### **3. Gunakan HTTPS**
Pastikan menggunakan HTTPS di production untuk keamanan.

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"Client tidak valid atau tidak aktif"**
   - Pastikan client_id dan client_secret benar
   - Pastikan client status "active"

2. **"Redirect URI tidak terdaftar"**
   - Pastikan redirect_uri sama dengan yang terdaftar

3. **"Invalid credentials"**
   - Pastikan username dan password benar
   - Default credentials: `admin` / `password`

### **Debug Steps:**
1. Check SSO server logs
2. Verify client credentials
3. Test endpoints dengan cURL
4. Check network requests di browser dev tools

## 📞 **Support**

Jika ada masalah:
1. Periksa SSO server logs di `logs/application-*.log`
2. Test endpoint dengan cURL
3. Pastikan client credentials benar
4. Check network connectivity

## 🎯 **Quick Start**

1. **SSO server sudah berjalan** ✅
2. **Test client sudah aktif** ✅
3. **Buat sistem eksternal** dengan file contoh yang sudah saya buat
4. **Test flow OAuth2** dengan mengakses sistem eksternal

**Selamat! SSO server Anda siap digunakan! 🎉**
