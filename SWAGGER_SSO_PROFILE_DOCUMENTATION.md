# Swagger Documentation untuk SSO Profile API

## Overview
Dokumentasi Swagger untuk endpoint SSO Profile telah berhasil ditambahkan ke sistem dokumentasi API yang ada.

## File yang Ditambahkan

### 1. Path Documentation
**File:** `src/static/path/sso_profile.json`
- Mendefinisikan endpoint `/auth/sso/profil` (GET dan PUT)
- Mendefinisikan endpoint `/auth/sso/profil/password` (PUT)
- Menyertakan deskripsi lengkap untuk setiap endpoint
- Menyertakan security requirements (Bearer Auth)
- Menyertakan semua response codes yang mungkin

### 2. Schema Documentation
**File:** `src/static/schema/sso_profile.json`
- `SchemaPostSSOProfileUpdate`: Schema untuk request body update profil
- `SchemaPostSSOPasswordUpdate`: Schema untuk request body update password
- `SchemaResponseSSOProfile`: Schema untuk response profil
- `SchemaResponseSSOPasswordUpdate`: Schema untuk response update password

### 3. Integration Files
**File:** `src/static/path/index.js` dan `src/static/schema/index.js`
- Menambahkan import dan export untuk file SSO profile
- Terintegrasi dengan sistem dokumentasi yang ada

## Cara Mengakses Swagger Documentation

### 1. Development Server
```
http://localhost:3000/api-docs
```

### 2. Production Server
```
https://your-domain.com/api-docs
```

## Fitur Swagger yang Tersedia

### 1. Interactive API Testing
- Test endpoint langsung dari browser
- Input validation otomatis
- Response preview real-time

### 2. Authentication
- Bearer Token authentication
- Test dengan token JWT yang valid
- Security scheme terintegrasi

### 3. Request/Response Examples
- Contoh request body untuk setiap endpoint
- Contoh response untuk setiap status code
- Validasi input dengan pattern dan constraints

## Endpoint yang Didokumentasikan

### 1. GET /auth/sso/profil
- **Tag:** SSO Profile
- **Security:** Bearer Auth required
- **Response:** 200, 401, 404, 500
- **Description:** Mendapatkan data profil user yang sedang login

### 2. PUT /auth/sso/profil
- **Tag:** SSO Profile
- **Security:** Bearer Auth required
- **Request Body:** SchemaPostSSOProfileUpdate
- **Response:** 200, 400, 401, 500
- **Description:** Update data profil user (username dan/atau email)

### 3. PUT /auth/sso/profil/password
- **Tag:** SSO Profile
- **Security:** Bearer Auth required
- **Request Body:** SchemaPostSSOPasswordUpdate
- **Response:** 200, 400, 401, 404, 500
- **Description:** Update password user dengan validasi password lama

## Validasi yang Didokumentasikan

### Update Profile
- `user_name`: 3-100 karakter, pattern `^[a-zA-Z0-9_]+$`
- `user_email`: format email valid, maksimal 100 karakter
- Minimal satu field harus diisi

### Update Password
- `current_password`: required
- `new_password`: minimal 6 karakter, pattern `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$`
- `confirm_password`: harus sama dengan new_password

## Contoh Penggunaan di Swagger UI

### 1. Authentication
1. Buka Swagger UI
2. Klik tombol "Authorize" di bagian atas
3. Masukkan token JWT: `Bearer your_jwt_token_here`
4. Klik "Authorize"

### 2. Test Get Profile
1. Expand endpoint `GET /auth/sso/profil`
2. Klik "Try it out"
3. Klik "Execute"
4. Lihat response di bagian "Response body"

### 3. Test Update Profile
1. Expand endpoint `PUT /auth/sso/profil`
2. Klik "Try it out"
3. Masukkan data di Request body:
   ```json
   {
     "user_name": "new_username",
     "user_email": "new@example.com"
   }
   ```
4. Klik "Execute"

### 4. Test Update Password
1. Expand endpoint `PUT /auth/sso/profil/password`
2. Klik "Try it out"
3. Masukkan data di Request body:
   ```json
   {
     "current_password": "old_password",
     "new_password": "NewPassword123",
     "confirm_password": "NewPassword123"
   }
   ```
4. Klik "Execute"

## Error Handling Documentation

### Status Codes
- **200:** Success
- **400:** Bad Request (validation error)
- **401:** Unauthorized (token invalid/missing)
- **404:** Not Found (user not found)
- **500:** Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing dengan Swagger UI

### Prerequisites
1. Server harus running
2. User harus sudah login dan memiliki JWT token
3. Token harus valid dan belum expired

### Steps
1. Akses Swagger UI
2. Authorize dengan JWT token
3. Test setiap endpoint sesuai kebutuhan
4. Periksa response dan error handling

## Maintenance

### Update Documentation
Jika ada perubahan pada endpoint:
1. Update file `src/static/path/sso_profile.json`
2. Update file `src/static/schema/sso_profile.json` jika diperlukan
3. Restart server untuk melihat perubahan

### Adding New Endpoints
1. Tambahkan endpoint baru di `sso_profile.json`
2. Tambahkan schema baru di `sso_profile.json` jika diperlukan
3. Update index files untuk import/export

Dokumentasi Swagger ini akan membantu developer untuk memahami dan menggunakan endpoint SSO Profile dengan mudah melalui interface yang interaktif dan user-friendly.
