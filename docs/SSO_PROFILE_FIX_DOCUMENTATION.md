# Perbaikan Error SSO Profile API

## Masalah yang Ditemukan
Error terjadi pada endpoint GET `/auth/sso/profil` dengan pesan:
```
TypeError: Cannot read properties of undefined (reading '0')
```

## Analisis Masalah
Masalah terjadi karena middleware `verifyToken` yang digunakan tidak sesuai untuk SSO. Middleware tersebut:
1. Tidak mengset `req.user` dengan benar
2. Menggunakan `jwtDecode` tanpa verifikasi
3. Tidak menangani JWT token SSO dengan proper

## Solusi yang Diterapkan

### 1. Membuat Middleware SSO Token Baru
**File:** `src/middlewares/sso_token.js`

Fitur middleware baru:
- Verifikasi JWT token dengan `jwt.verify()`
- Mengset `req.user` dengan data yang benar
- Error handling yang komprehensif
- Logging untuk debugging
- Validasi token expiration
- Validasi required fields

### 2. Update Middleware Index
**File:** `src/middlewares/index.js`

Menambahkan:
```javascript
const { verifySSOToken } = require('./sso_token')

module.exports = {
  // ... existing exports
  verifySSOToken
}
```

### 3. Update Routing SSO
**File:** `src/routes/V1/sso.js`

Mengganti middleware dari `verifyToken` ke `verifySSOToken`:
```javascript
// Sebelum
router.get('/auth/sso/profil', verifyToken, ssoRoutes.getProfile);

// Sesudah
router.get('/auth/sso/profil', verifySSOToken, ssoRoutes.getProfile);
```

## Detail Middleware SSO Token

### Fungsi Utama
```javascript
const verifySSOToken = async (req, res, next) => {
  // 1. Extract token dari Authorization header
  // 2. Verify JWT token dengan secret
  // 3. Check token expiration
  // 4. Validate required fields (user_id)
  // 5. Set req.user dengan data yang benar
  // 6. Pass ke next middleware
}
```

### Error Handling
- **401 Unauthorized**: Token tidak ditemukan/invalid
- **401 Token Expired**: Token sudah expired
- **500 Server Error**: Kesalahan server

### Logging
- Log sukses verifikasi token
- Log error untuk debugging
- Include user_id dan IP address

## Testing

### Script Test
**File:** `test-sso-profile-fixed.sh`

Script untuk test endpoint dengan middleware yang sudah diperbaiki:
```bash
./test-sso-profile-fixed.sh
```

### Manual Test
```bash
curl -X 'GET' \
  'http://localhost:9518/api/auth/sso/profil' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

## Konfigurasi JWT

### Environment Variables
```bash
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
SSO_SERVER_URL=http://localhost:3000
```

### JWT Payload Structure
```javascript
{
  user_id: "uuid",
  iat: timestamp,
  exp: timestamp,
  aud: "audience",
  iss: "issuer"
}
```

## Verifikasi Perbaikan

### 1. Check Middleware
```javascript
// req.user sekarang berisi:
{
  user_id: "9259c823-7c28-4836-840c-6861caac3e72",
  iat: 1758008268,
  exp: 1758094668,
  aud: "string",
  iss: "http://localhost:3000"
}
```

### 2. Check Response
Endpoint sekarang mengembalikan response yang benar:
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "user_id": "uuid",
    "user_name": "username",
    "user_email": "email@example.com",
    // ... other fields
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Monitoring dan Debugging

### Logs yang Dihasilkan
```
SSO Token verified successfully { user_id: 'uuid', ip: '127.0.0.1' }
```

### Error Logs
```
SSO Token verification failed: Error message
```

## Best Practices

### 1. Token Security
- Gunakan JWT secret yang kuat
- Set expiration time yang reasonable
- Validate semua required fields

### 2. Error Handling
- Return consistent error format
- Log errors untuk debugging
- Don't expose sensitive information

### 3. Performance
- Cache decoded tokens jika diperlukan
- Optimize database queries
- Monitor response times

## Troubleshooting

### Problem: "Token tidak ditemukan"
**Solution:**
- Pastikan Authorization header ada
- Format: `Bearer <token>`

### Problem: "Token tidak valid"
**Solution:**
- Periksa JWT secret
- Pastikan token tidak corrupted
- Check token format

### Problem: "Token sudah expired"
**Solution:**
- Login ulang untuk mendapatkan token baru
- Check system time
- Adjust expiration time jika diperlukan

## Future Improvements

### 1. Token Refresh
- Implement refresh token mechanism
- Automatic token renewal

### 2. Rate Limiting
- Add rate limiting untuk endpoint profil
- Prevent brute force attacks

### 3. Audit Logging
- Log semua aktivitas profil
- Track perubahan data

Perbaikan ini memastikan endpoint SSO Profile berfungsi dengan benar dan aman.
