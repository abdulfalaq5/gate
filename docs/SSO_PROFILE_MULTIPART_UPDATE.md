# SSO Profile Update dengan Multipart Form Data

## Overview
Endpoint SSO Profile telah diupdate untuk mendukung upload file foto profil dengan multipart form data. Perubahan ini memungkinkan user untuk mengupdate profil mereka termasuk upload foto profil dalam satu request.

## Perubahan yang Dilakukan

### 1. Handler Update (`src/modules/sso/profile_handler.js`)
- ✅ Menambahkan konfigurasi multer untuk upload file gambar
- ✅ Menambahkan method `getUploadMiddleware()` untuk mendapatkan multer middleware
- ✅ Update method `updateProfile()` untuk menangani file upload
- ✅ Menghapus dukungan untuk `title_id` (sesuai permintaan)
- ✅ Menambahkan upload foto ke MinIO dengan kompresi gambar
- ✅ Menambahkan error handling untuk multer errors
- ✅ Update response untuk include `employee_foto`

### 2. Validasi Update (`src/modules/sso/profile_validation.js`)
- ✅ Menghapus validasi untuk `title_id`
- ✅ Update custom validation untuk mendukung file upload (`req.file`)
- ✅ Mempertahankan validasi untuk employee data dan password

### 3. Schema Update (`src/static/schema/sso_profile.json`)
- ✅ Menghapus field `title_id` dari schema
- ✅ Menambahkan field `employee_foto` dengan format binary
- ✅ Update description untuk multipart form data

### 4. Path Documentation (`src/static/path/sso_profile.json`)
- ✅ Update description untuk include upload foto
- ✅ Menambahkan support untuk `multipart/form-data` content type
- ✅ Mempertahankan backward compatibility dengan `application/json`

### 5. Route Update (`src/routes/V1/sso.js`)
- ✅ Menambahkan multer middleware untuk upload file
- ✅ Menggunakan `getUploadMiddleware()` dari handler

## Endpoint yang Tersedia

### PUT /api/auth/sso/profil
Update profil employee dengan support untuk upload foto dan password.

**Content-Type:** `multipart/form-data` atau `application/json`

**Form Fields:**
- `employee_name` (optional): Nama employee baru (2-100 karakter)
- `employee_email` (optional): Email employee baru (format email valid)
- `employee_foto` (optional): File foto profil (image/jpeg, image/png, image/gif, image/webp, maksimal 5MB)
- `current_password` (optional): Password lama untuk verifikasi
- `new_password` (optional): Password baru (minimal 6 karakter dengan kombinasi)
- `confirm_password` (optional): Konfirmasi password baru

**Validasi:**
- Minimal satu field harus diisi
- Jika update password, semua field password harus diisi
- File foto maksimal 5MB dan hanya format gambar yang diperbolehkan
- Email harus unik (tidak digunakan employee lain)

## Contoh Penggunaan

### 1. Update hanya data employee
```bash
curl -X 'PUT' \
  'http://localhost:9518/api/auth/sso/profil' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>' \
  -F 'employee_name=abdul harris' \
  -F 'employee_email=abdulharris@motorsights.net'
```

### 2. Update dengan foto profil
```bash
curl -X 'PUT' \
  'http://localhost:9518/api/auth/sso/profil' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>' \
  -F 'employee_name=abdul harris' \
  -F 'employee_email=abdulharris@motorsights.net' \
  -F 'employee_foto=@profile_photo.jpg'
```

### 3. Update dengan password
```bash
curl -X 'PUT' \
  'http://localhost:9518/api/auth/sso/profil' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>' \
  -F 'employee_name=abdul harris' \
  -F 'employee_email=abdulharris@motorsights.net' \
  -F 'current_password=QwerMSI2025!' \
  -F 'new_password=NewPassword123!' \
  -F 'confirm_password=NewPassword123!'
```

### 4. Update lengkap (data + foto + password)
```bash
curl -X 'PUT' \
  'http://localhost:9518/api/auth/sso/profil' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>' \
  -F 'employee_name=abdul harris' \
  -F 'employee_email=abdulharris@motorsights.net' \
  -F 'employee_foto=@profile_photo.jpg' \
  -F 'current_password=QwerMSI2025!' \
  -F 'new_password=NewPassword123!' \
  -F 'confirm_password=NewPassword123!'
```

## Response Format

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate dan foto berhasil diupload dan password berhasil diubah",
  "data": {
    "employee_id": "uuid",
    "employee_name": "abdul harris",
    "employee_email": "abdulharris@motorsights.net",
    "employee_foto": "path/to/uploaded/photo.jpg",
    "title_name": "Job Title",
    "department_name": "Department Name",
    "company_name": "Company Name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Ukuran file foto terlalu besar. Maksimal ukuran file adalah 5 MB.",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

### File Upload Errors
- `LIMIT_FILE_SIZE`: File terlalu besar (maksimal 5MB)
- `LIMIT_FILE_COUNT`: Hanya satu file yang diperbolehkan
- Invalid file type: Hanya file gambar yang diperbolehkan

### Validation Errors
- Minimal satu field harus diisi
- Email sudah digunakan employee lain
- Password lama tidak benar
- Password baru dan konfirmasi tidak sama

## Testing

Gunakan script `test-sso-profile-multipart.sh` untuk testing endpoint:

```bash
chmod +x test-sso-profile-multipart.sh
./test-sso-profile-multipart.sh
```

## Catatan Penting

1. **Backward Compatibility**: Endpoint masih mendukung `application/json` untuk update tanpa file
2. **File Storage**: Foto disimpan di MinIO dengan kompresi otomatis
3. **Security**: File upload dibatasi hanya untuk format gambar dan ukuran maksimal 5MB
4. **Transaction**: Semua update dilakukan dalam database transaction untuk konsistensi
5. **Logging**: Semua operasi upload dan update dicatat dalam log untuk audit
