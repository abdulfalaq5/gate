# SSO Profile API Documentation

## Overview
Endpoint untuk mengelola profil user dalam sistem SSO. Semua endpoint memerlukan autentikasi dengan token JWT.

## Base URL
```
/api/auth/sso/profil
```

## Authentication
Semua endpoint memerlukan header Authorization:
```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### 1. GET /auth/sso/profil
Mendapatkan data profil user yang sedang login dengan informasi lengkap employee termasuk kontak dan foto profil.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "employee_id": "uuid",
    "employee_name": "Employee Name",
    "employee_email": "employee@company.com",
    "employee_exmail_account": "employee@company.com",
    "employee_mobile": "+6281234567890",
    "employee_office_number": "+62212345678",
    "employee_address": "Jl. Sudirman No. 123, Jakarta",
    "employee_channel": "LinkedIn",
    "employee_foto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "title_name": "Role Name",
    "department_name": "Department Name",
    "company_name": "Company Name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Field Descriptions:**
- `employee_id`: ID unik employee
- `employee_name`: Nama lengkap employee
- `employee_email`: Email utama employee
- `employee_exmail_account`: Email eksternal untuk login SSO
- `employee_mobile`: Nomor handphone employee
- `employee_office_number`: Nomor telepon kantor employee
- `employee_address`: Alamat rumah employee
- `employee_channel`: Channel atau sumber employee (LinkedIn, JobStreet, dll)
- `employee_foto`: Foto profil employee dalam format base64 atau URL
- `title_name`: Nama jabatan/title employee
- `department_name`: Nama departemen employee
- `company_name`: Nama perusahaan employee
- `created_at`: Tanggal pembuatan record
- `updated_at`: Tanggal terakhir update record

**Response Error (401):**
```json
{
  "success": false,
  "message": "User tidak terautentikasi",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. PUT /auth/sso/profil
Update data profil user (username dan/atau email).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_name": "new_username",  // optional
  "user_email": "new@example.com"  // optional
}
```

**Validasi:**
- `user_name`: 3-100 karakter, hanya huruf, angka, dan underscore
- `user_email`: format email valid, maksimal 100 karakter
- Minimal satu field harus diisi

**Response Success (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "user_id": "uuid",
    "user_name": "new_username",
    "user_email": "new@example.com",
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

**Response Error (400):**
```json
{
  "success": false,
  "message": "Email sudah digunakan oleh user lain",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. PUT /auth/sso/profil/password
Update password user.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "current_password": "old_password",
  "new_password": "NewPassword123",
  "confirm_password": "NewPassword123"
}
```

**Validasi:**
- `current_password`: harus diisi
- `new_password`: minimal 6 karakter, harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka
- `confirm_password`: harus sama dengan new_password

**Response Success (200):**
```json
{
  "success": true,
  "message": "Password berhasil diupdate",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Password lama tidak benar",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validasi gagal atau data tidak valid |
| 401 | Unauthorized - Token tidak valid atau tidak ada |
| 404 | Not Found - User tidak ditemukan |
| 500 | Internal Server Error - Kesalahan server |

---

## Contoh Penggunaan

### JavaScript (Fetch API)
```javascript
// Get Profile
const getProfile = async (token) => {
  const response = await fetch('/api/auth/sso/profil', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};

// Update Profile
const updateProfile = async (token, data) => {
  const response = await fetch('/api/auth/sso/profil', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

// Update Password
const updatePassword = async (token, passwordData) => {
  const response = await fetch('/api/auth/sso/profil/password', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(passwordData)
  });
  return await response.json();
};
```

### cURL
```bash
# Get Profile
curl -X GET "http://localhost:3000/api/auth/sso/profil" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update Profile
curl -X PUT "http://localhost:3000/api/auth/sso/profil" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_name": "new_username", "user_email": "new@example.com"}'

# Update Password
curl -X PUT "http://localhost:3000/api/auth/sso/profil/password" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"current_password": "old_pass", "new_password": "NewPass123", "confirm_password": "NewPass123"}'
```
