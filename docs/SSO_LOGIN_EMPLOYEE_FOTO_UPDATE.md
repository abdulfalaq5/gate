# SSO Login Response Update - Menambahkan Employee Foto

## Overview
Endpoint SSO Login telah diupdate untuk menambahkan field `employee_foto` ke dalam response. Perubahan ini memungkinkan aplikasi client untuk mendapatkan URL foto profil employee saat login berhasil.

## Perubahan yang Dilakukan

### 1. Query Update (`src/modules/sso/server_handler.js`)
- ✅ Menambahkan `employee_foto` ke SELECT query untuk mengambil data employee
- ✅ Update query untuk include field foto profil dari database

### 2. Response Update (`src/modules/sso/server_handler.js`)
- ✅ Menambahkan `employee_foto` ke `userDetails` object
- ✅ Update response structure untuk include foto profil di bagian `user`

## Endpoint yang Diupdate

### POST /api/auth/sso/login
Login SSO dengan response yang sudah include employee foto.

**Request Body:**
```json
{
  "email": "abdulharris@motorsights.net",
  "password": "Qwer1234!",
  "client_id": "string",
  "redirect_uri": "string"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login SSO berhasil",
  "data": {
    "user": {
      "user_name": "Harris",
      "user_email": "abdulharris@motorsights.net",
      "employee_name": "Harris",
      "employee_id": "a3dd7cee-fb05-4207-8ee1-dbe069525f3a",
      "employee_foto": "https://minio-bucket.motorsights.com:443/msi-sso/employee-photos/2025/9/24/employee-a3dd7cee-fb05-4207-8ee1-dbe069525f3a-1758681407787.jpg"
    },
    "menu": [
      {
        "name": "Dashboard",
        "url": "/dashboard",
        "permission": ["delete", "create", "update", "read"]
      },
      {
        "name": "Departments",
        "url": "/departments",
        "permission": ["delete", "create", "update", "read"]
      }
    ],
    "session": {
      "client_id": "string",
      "session_id": "a3dd7cee-fb05-4207-8ee1-dbe069525f3a",
      "login_time": "2025-09-24T02:38:22.250Z",
      "ip_address": "::1",
      "last_activity": "2025-09-24T02:38:22.250Z"
    },
    "oauth": {
      "authorization_code": "3e4d2ec1ab6cb67d69118128308acdb9ca8730808c30396fa40d28fb16e4360d",
      "redirect_uri": "string",
      "expires_in": 600,
      "sso_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "timestamp": "2025-09-24T02:38:22.250Z"
}
```

## Field Baru yang Ditambahkan

### `employee_foto`
- **Type**: String (URL)
- **Description**: URL foto profil employee yang tersimpan di MinIO
- **Location**: `data.user.employee_foto`
- **Example**: `"https://minio-bucket.motorsights.com:443/msi-sso/employee-photos/2025/9/24/employee-a3dd7cee-fb05-4207-8ee1-dbe069525f3a-1758681407787.jpg"`
- **Nullable**: Ya, bisa null jika employee belum upload foto

## Contoh Penggunaan

### Curl Command
```bash
curl -X 'POST' \
  'http://localhost:9518/api/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "abdulharris@motorsights.net",
  "password": "Qwer1234!",
  "client_id": "string",
  "redirect_uri": "string"
}'
```

### JavaScript/Frontend Usage
```javascript
const response = await fetch('/api/auth/sso/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: 'abdulharris@motorsights.net',
    password: 'Qwer1234!',
    client_id: 'string',
    redirect_uri: 'string'
  })
});

const data = await response.json();

if (data.success) {
  const employeeFoto = data.data.user.employee_foto;
  
  if (employeeFoto) {
    // Tampilkan foto profil
    document.getElementById('profile-photo').src = employeeFoto;
  } else {
    // Gunakan foto default
    document.getElementById('profile-photo').src = '/default-avatar.png';
  }
}
```

## Backward Compatibility

- ✅ **Fully Backward Compatible**: Perubahan ini tidak mempengaruhi struktur response yang sudah ada
- ✅ **Optional Field**: `employee_foto` adalah field optional yang bisa null
- ✅ **Existing Fields**: Semua field yang sudah ada tetap sama dan tidak berubah

## Catatan Penting

1. **URL Format**: Foto disimpan di MinIO dengan struktur folder berdasarkan tanggal
2. **File Naming**: Nama file menggunakan pattern `employee-{employee_id}-{timestamp}.{extension}`
3. **Access Control**: URL foto bisa diakses secara public (tergantung konfigurasi MinIO)
4. **Null Handling**: Jika employee belum upload foto, field akan berisi `null`

## Testing

Endpoint sudah ditest dan berfungsi dengan baik:

```bash
# Test dengan jq untuk formatting yang lebih baik
curl -X 'POST' \
  'http://localhost:9518/api/auth/sso/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "abdulharris@motorsights.net",
  "password": "Qwer1234!",
  "client_id": "string",
  "redirect_uri": "string"
}' | jq .
```

Response menunjukkan bahwa `employee_foto` sudah berhasil ditambahkan ke response SSO login! 🎉
