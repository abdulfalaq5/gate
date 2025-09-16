# SSO Profile API Gabungan - Dokumentasi Lengkap

## Overview
Endpoint SSO Profile telah berhasil digabungkan menjadi satu endpoint `/auth/sso/profil` yang dapat menangani update profil user, data employee, dan password dalam satu request.

## Perubahan yang Dilakukan

### 1. Handler Gabungan
**File:** `src/modules/sso/profile_handler.js`

#### Fitur Baru:
- ✅ **Update User Data**: username dan email user
- ✅ **Update Employee Data**: nama employee, email employee, dan title_id
- ✅ **Update Password**: dengan validasi password lama
- ✅ **Transaction Support**: menggunakan database transaction untuk konsistensi data
- ✅ **Comprehensive Validation**: validasi semua field dengan error handling yang baik

#### Method yang Dimodifikasi:
```javascript
async updateProfile(req, res) {
  // Menangani semua jenis update dalam satu method
  // - User data (user_name, user_email)
  // - Employee data (employee_name, employee_email, title_id)
  // - Password (current_password, new_password, confirm_password)
}
```

### 2. Validasi Gabungan
**File:** `src/modules/sso/profile_validation.js`

#### Validasi yang Ditambahkan:
- **User Data**: username (3-100 karakter), email (format valid)
- **Employee Data**: nama employee (2-100 karakter), email employee, title_id (UUID)
- **Password Data**: password lama, password baru (minimal 6 karakter dengan kombinasi), konfirmasi password
- **Custom Validation**: minimal satu field harus diisi, jika update password semua field password harus diisi

### 3. Repository Updates
**File:** `src/modules/employees/postgre_repository.js`
- ✅ Menambahkan method `findByEmail()` untuk konsistensi dengan UsersRepository

**File:** `src/modules/users/postgre_repository.js`
- ✅ Update `getUserWithDetails()` untuk include `employee_email` dan `title_id`

### 4. Routing Simplification
**File:** `src/routes/V1/sso.js`
- ✅ Menghapus endpoint `/auth/sso/profil/password` yang terpisah
- ✅ Hanya menggunakan satu endpoint: `PUT /auth/sso/profil`

### 5. Swagger Documentation
**File:** `src/static/path/sso_profile.json`
- ✅ Update path documentation untuk endpoint gabungan
- ✅ Menghapus endpoint password terpisah

**File:** `src/static/schema/sso_profile.json`
- ✅ Schema baru: `SchemaPostSSOProfileUpdateCombined`
- ✅ Update response schema untuk include data employee

## Endpoint yang Tersedia

### GET /api/auth/sso/profil
Mendapatkan data profil lengkap user dan employee.

**Response:**
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
    "employee_email": "employee@company.com",
    "title_id": "uuid",
    "role_id": "uuid",
    "role_name": "Role Name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/auth/sso/profil
Update profil user, employee, dan password dalam satu request.

**Request Body:**
```json
{
  // User data (optional)
  "user_name": "new_username",
  "user_email": "new@example.com",
  
  // Employee data (optional)
  "employee_name": "New Employee Name",
  "employee_email": "employee@company.com",
  "title_id": "uuid",
  
  // Password data (optional, but all required if updating password)
  "current_password": "old_password",
  "new_password": "NewPassword123",
  "confirm_password": "NewPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate dan password berhasil diubah",
  "data": {
    // Same structure as GET response
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Validasi dan Error Handling

### Validasi Input
1. **Minimal satu field harus diisi**
2. **Jika update password, semua field password harus diisi**
3. **Email format validation**
4. **Username pattern validation** (huruf, angka, underscore)
5. **Password strength validation** (minimal 6 karakter dengan kombinasi)
6. **UUID validation untuk title_id**

### Error Cases
- **400 Bad Request**: Validasi gagal, data tidak valid
- **401 Unauthorized**: Token tidak valid atau tidak ada
- **404 Not Found**: User atau employee tidak ditemukan
- **500 Internal Server Error**: Kesalahan server

### Duplicate Check
- **Email user**: Cek duplikasi dengan user lain
- **Username**: Cek duplikasi dengan user lain
- **Email employee**: Cek duplikasi dengan employee lain

## Transaction Support

### Database Transaction
- ✅ Menggunakan database transaction untuk konsistensi data
- ✅ Rollback otomatis jika terjadi error
- ✅ Commit hanya jika semua update berhasil

### Update Process
1. **Validasi semua input**
2. **Cek duplikasi data**
3. **Mulai transaction**
4. **Update user data** (jika ada)
5. **Update employee data** (jika ada)
6. **Commit transaction**
7. **Return updated data**

## Testing Results

### Test Cases yang Berhasil
1. ✅ **Get Profile**: Mendapatkan data profil lengkap
2. ✅ **Update User Data Only**: Update username dan email user
3. ✅ **Update Employee Data Only**: Update nama dan email employee
4. ✅ **Update Password Only**: Update password dengan validasi
5. ✅ **Update All Combined**: Update semua data sekaligus
6. ✅ **Error Handling**: Validasi error cases

### Sample Test Results
```bash
# Update User Data Only
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "user_name": "combined_test_user",
    "user_email": "combined@test.com",
    "employee_name": "Admin User",
    "employee_email": "admin@sso-testing.com",
    "title_id": "640339fd-26fd-42e7-93c0-f7296eaf60cc"
  }
}

# Update Password Only
{
  "success": true,
  "message": "Profil berhasil diupdate dan password berhasil diubah",
  "data": { /* updated profile data */ }
}
```

## Keunggulan Endpoint Gabungan

### 1. **Efisiensi**
- Satu request untuk update multiple data
- Mengurangi jumlah API calls
- Transaction atomic untuk konsistensi

### 2. **Fleksibilitas**
- Update sebagian atau semua data
- Conditional validation berdasarkan field yang diisi
- Support untuk berbagai skenario update

### 3. **User Experience**
- Interface yang lebih sederhana
- Satu form untuk semua update
- Response yang konsisten

### 4. **Maintainability**
- Satu endpoint untuk maintain
- Logic terpusat dalam satu handler
- Dokumentasi yang lebih sederhana

## Migration Guide

### Dari Endpoint Terpisah ke Gabungan
**Sebelum:**
```javascript
// Update user data
PUT /auth/sso/profil
// Update password
PUT /auth/sso/profil/password
```

**Sesudah:**
```javascript
// Update semua data dalam satu request
PUT /auth/sso/profil
{
  "user_name": "new_username",
  "employee_name": "New Name",
  "current_password": "old_pass",
  "new_password": "new_pass",
  "confirm_password": "new_pass"
}
```

### Frontend Integration
```javascript
// Update profile function
const updateProfile = async (profileData) => {
  const response = await fetch('/api/auth/sso/profil', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  return await response.json();
};

// Usage examples
await updateProfile({ user_name: 'new_username' });
await updateProfile({ employee_name: 'New Employee Name' });
await updateProfile({ 
  user_name: 'new_username',
  employee_name: 'New Employee Name',
  current_password: 'old_pass',
  new_password: 'new_pass',
  confirm_password: 'new_pass'
});
```

## Security Features

### 1. **Authentication**
- JWT token verification
- User authorization check

### 2. **Password Security**
- Current password verification
- Strong password requirements
- Password confirmation validation

### 3. **Data Validation**
- Input sanitization
- Duplicate data prevention
- SQL injection prevention

### 4. **Transaction Safety**
- Atomic operations
- Rollback on errors
- Data consistency guarantee

## Performance Considerations

### 1. **Database Optimization**
- Single transaction untuk multiple updates
- Efficient queries dengan proper joins
- Index optimization untuk lookups

### 2. **Response Optimization**
- Return only necessary data
- Consistent response format
- Minimal data transfer

### 3. **Error Handling**
- Fast fail validation
- Clear error messages
- Proper HTTP status codes

## Future Enhancements

### 1. **Additional Fields**
- Phone number
- Address information
- Profile picture
- Preferences

### 2. **Advanced Features**
- Bulk update support
- Change history tracking
- Audit logging

### 3. **Integration**
- Email notification
- External system sync
- Real-time updates

Endpoint SSO Profile gabungan sekarang sudah siap digunakan dengan fitur lengkap untuk update profil user, employee, dan password dalam satu request yang efisien dan aman! 🎉
