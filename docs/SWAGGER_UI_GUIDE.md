# Panduan Visual Swagger UI untuk SSO Profile API

## Langkah-langkah Menggunakan Swagger UI

### 1. Akses Swagger UI
```
URL: http://localhost:3000/api-docs
```

### 2. Navigasi ke SSO Profile Section
- Scroll ke bagian "SSO Profile" di sidebar kiri
- Atau gunakan Ctrl+F untuk mencari "SSO Profile"

### 3. Authentication Setup
1. Klik tombol **"Authorize"** di bagian atas halaman
2. Masukkan token JWT dengan format: `Bearer your_jwt_token_here`
3. Klik **"Authorize"**
4. Klik **"Close"**

### 4. Test Endpoint

#### A. GET /auth/sso/profil
1. Expand endpoint **"GET /auth/sso/profil"**
2. Klik **"Try it out"**
3. Klik **"Execute"**
4. Lihat response di bagian **"Response body"**

**Expected Response:**
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "user_id": "uuid",
    "user_name": "username",
    "user_email": "user@example.com",
    "employee_id": "uuid",
    "employee_name": "Employee Name",
    "role_id": "uuid",
    "role_name": "Role Name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### B. PUT /auth/sso/profil
1. Expand endpoint **"PUT /auth/sso/profil"**
2. Klik **"Try it out"**
3. Masukkan data di **"Request body"**:

```json
{
  "user_name": "new_username",
  "user_email": "new@example.com"
}
```

4. Klik **"Execute"**
5. Lihat response di bagian **"Response body"**

**Validasi yang akan ditampilkan:**
- `user_name`: 3-100 karakter, hanya huruf/angka/underscore
- `user_email`: format email valid, maksimal 100 karakter

#### C. PUT /auth/sso/profil/password
1. Expand endpoint **"PUT /auth/sso/profil/password"**
2. Klik **"Try it out"**
3. Masukkan data di **"Request body"**:

```json
{
  "current_password": "old_password",
  "new_password": "NewPassword123",
  "confirm_password": "NewPassword123"
}
```

4. Klik **"Execute"**
5. Lihat response di bagian **"Response body"**

**Validasi yang akan ditampilkan:**
- `current_password`: required
- `new_password`: minimal 6 karakter dengan kombinasi huruf besar/kecil dan angka
- `confirm_password`: harus sama dengan new_password

### 5. Error Testing

#### Test Error Cases:
1. **Empty Request Body:**
   ```json
   {}
   ```
   Expected: 400 Bad Request

2. **Invalid Email Format:**
   ```json
   {
     "user_email": "invalid-email"
   }
   ```
   Expected: 400 Bad Request

3. **Password Mismatch:**
   ```json
   {
     "current_password": "old_password",
     "new_password": "NewPassword123",
     "confirm_password": "DifferentPassword"
   }
   ```
   Expected: 400 Bad Request

4. **Wrong Current Password:**
   ```json
   {
     "current_password": "wrong_password",
     "new_password": "NewPassword123",
     "confirm_password": "NewPassword123"
   }
   ```
   Expected: 400 Bad Request

### 6. Response Codes

| Code | Description | Example |
|------|-------------|---------|
| 200 | Success | Profile retrieved/updated successfully |
| 400 | Bad Request | Validation error, wrong password |
| 401 | Unauthorized | Invalid or missing JWT token |
| 404 | Not Found | User profile not found |
| 500 | Internal Server Error | Server error |

### 7. Tips Penggunaan

#### A. Copy cURL Command
- Setelah test endpoint, klik **"Copy cURL command"**
- Gunakan untuk test di terminal atau Postman

#### B. Download OpenAPI Spec
- Klik **"Download"** di bagian atas
- Download file JSON untuk import ke tools lain

#### C. Schema Validation
- Swagger UI akan menampilkan error jika input tidak sesuai schema
- Gunakan contoh yang disediakan sebagai referensi

#### D. Response Examples
- Setiap endpoint memiliki contoh response
- Gunakan sebagai referensi untuk implementasi frontend

### 8. Troubleshooting

#### Problem: "Unauthorized" Error
**Solution:**
1. Pastikan token JWT valid
2. Pastikan format: `Bearer your_token_here`
3. Pastikan token belum expired

#### Problem: "Validation Error"
**Solution:**
1. Periksa format input sesuai schema
2. Gunakan contoh yang disediakan
3. Pastikan semua required fields terisi

#### Problem: "Server Error"
**Solution:**
1. Periksa server logs
2. Pastikan database connection
3. Periksa endpoint implementation

### 9. Advanced Features

#### A. Model Schema
- Klik pada schema name untuk melihat detail
- Contoh: `SchemaPostSSOProfileUpdate`, `SchemaResponseSSOProfile`

#### B. Try It Out
- Semua endpoint mendukung "Try it out"
- Real-time validation dan testing

#### C. Response Headers
- Lihat response headers untuk debugging
- Contoh: Content-Type, Content-Length

### 10. Integration dengan Tools Lain

#### A. Postman
1. Import OpenAPI spec ke Postman
2. Generate collection dari Swagger spec
3. Test endpoint dengan environment variables

#### B. Insomnia
1. Import OpenAPI spec
2. Setup authentication
3. Test dengan different environments

#### C. VS Code REST Client
1. Copy cURL command dari Swagger
2. Convert ke REST client format
3. Test dalam VS Code

Dengan panduan ini, Anda dapat menggunakan Swagger UI untuk test dan dokumentasi endpoint SSO Profile dengan mudah dan efisien.
