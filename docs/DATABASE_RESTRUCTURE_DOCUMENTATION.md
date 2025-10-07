# Database Restructure Documentation

## Overview

Dokumentasi ini menjelaskan perubahan struktur database yang dilakukan untuk menyederhanakan sistem autentikasi dan manajemen permission.

## Perubahan Utama

### 1. Penambahan Kolom Password di Tabel Employees

**Migration:** `20250101000016_add_password_to_employees.js`

- Menambahkan kolom `password` (VARCHAR 255) ke tabel `employees`
- Kolom ini digunakan untuk menyimpan password hash untuk autentikasi

### 2. Pembuatan Tabel employeeHasPermissions

**Migration:** `20250101000017_create_employee_has_permissions_table.js`

Tabel baru untuk mengatur permission langsung ke employee:

```sql
CREATE TABLE employeeHasPermissions (
    employee_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID,
    PRIMARY KEY (employee_id, permission_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);
```

### 3. Penghapusan Tabel users, roles, dan roleHasMenuPermissions

**Migration:** `20250101000020_remove_users_and_role_has_menu_permissions.js` dan `20250101000021_remove_roles_table.js`

- Menghapus tabel `users` - semua proses login sekarang menggunakan tabel `employees`
- Menghapus tabel `roles` - sistem role-based permission dihapus
- Menghapus tabel `roleHasMenuPermissions` - permission sekarang dikelola langsung melalui `employeeHasPermissions`

## Perubahan pada Sistem Autentikasi

### Sebelum Perubahan
- Login menggunakan tabel `users` dengan email dari `user_email`
- Password disimpan di `users.user_password`
- Permission dikelola melalui `roleHasMenuPermissions` berdasarkan role
- Sistem menggunakan role-based access control

### Setelah Perubahan
- Login menggunakan tabel `employees` dengan email dari `employee_exmail_account`
- Password disimpan di `employees.password`
- Permission dikelola langsung melalui `employeeHasPermissions`
- Sistem menggunakan direct employee-based permission (tanpa role)

## Module employee_has_permissions (DIHAPUS)

**CATATAN:** Module employee_has_permissions telah dihapus dari sistem. Tabel `employeeHasPermissions` masih ada di database untuk menyimpan permission employee, tetapi tidak ada API endpoint untuk mengelolanya.

### Struktur Database
Tabel `employeeHasPermissions` masih tersedia dengan struktur:
```sql
CREATE TABLE employeeHasPermissions (
    employee_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID,
    PRIMARY KEY (employee_id, permission_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);
```

## Perubahan pada Module Auth

### File yang Diperbarui

1. **src/modules/auth/column.js**
   - Mengubah referensi dari tabel `users` ke `employees`
   - Mengubah join dari `roles` ke `titles` dan `departments`

2. **src/modules/auth/postgre_repository.js**
   - `getByParam()`: Menggunakan `employee_exmail_account` untuk login
   - `getUserInfo()`: Mengambil data langsung dari tabel `employees`
   - `getSystemAccess()`: Menggunakan `employeeHasPermissions` instead of `roleHasMenuPermissions`
   - `getPermissions()`: Query diperbarui untuk menggunakan `employeeHasPermissions`

3. **src/middlewares/auth.js** (Baru)
   - Middleware untuk autentikasi token
   - Mendukung `employee_id` dan `user_id` untuk backward compatibility

## Migration Script

### Script Migrasi Data
File: `src/scripts/migrate-users-to-employees.js`

Script ini melakukan:
1. Memindahkan data password dari `users` ke `employees`
2. Memindahkan data `user_email` ke `employee_exmail_account`
3. Memigrasi permission dari `roleHasMenuPermissions` ke `employeeHasPermissions`

### Cara Menjalankan Migrasi

1. **Backup Database** (PENTING!)
```bash
pg_dump your_database > backup_before_migration.sql
```

2. **Jalankan Migration Script**
```bash
node src/scripts/migrate-users-to-employees.js
```

3. **Jalankan Database Migrations**
```bash
npm run migrate
```

## Perubahan pada Swagger Documentation

### Schema Baru
- `SchemaEmployeeHasPermission`
- `SchemaEmployeeHasPermissionsPaginatedResponse`
- `SchemaEmployeePermissionWithStatus`
- `SchemaCreateEmployeeHasPermission`
- `SchemaUpdateEmployeeHasPermission`

### Schema yang Diperbarui
- `SchemaResponseEmployees`: Menambahkan `employee_exmail_account` dan `password`

## Testing

### Test Endpoints
```bash
# Test employee permissions
curl -X GET "http://localhost:3000/api/employee-has-permissions" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test login dengan employee
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "password123"
  }'
```

## Rollback Plan

Jika diperlukan rollback:

1. **Restore Database**
```bash
psql your_database < backup_before_migration.sql
```

2. **Atau jalankan migration down**
```bash
npm run migrate:rollback
```

## Module yang Dihapus

### 1. Module users
- **Lokasi:** `src/modules/users/`
- **Alasan:** Digantikan dengan autentikasi langsung melalui tabel `employees`

### 2. Module roles
- **Lokasi:** `src/modules/roles/`
- **Alasan:** Sistem role-based permission dihapus

### 3. Module role_has_menu_permissions
- **Lokasi:** `src/modules/role_has_menu_permissions/`
- **Alasan:** Digantikan dengan `employeeHasPermissions`

### 4. Module employee_has_permissions
- **Lokasi:** `src/modules/employee_has_permissions/`
- **Alasan:** Module dihapus, hanya tabel database yang tersisa

## Dampak pada Aplikasi

### Positive Impact
- ✅ Sistem autentikasi lebih sederhana
- ✅ Permission management lebih fleksibel (langsung ke employee)
- ✅ Mengurangi kompleksitas dengan menghilangkan role-based permission
- ✅ Data employee dan user terintegrasi
- ✅ Menghilangkan dependency pada tabel roles

### Breaking Changes
- ⚠️ API login sekarang menggunakan `employee_exmail_account` instead of `user_email`
- ⚠️ Token JWT sekarang berisi `employee_id` instead of `user_id`
- ⚠️ Permission checking sekarang menggunakan `employeeHasPermissions` instead of `roleHasMenuPermissions`
- ⚠️ Semua endpoint `/api/roles/*`, `/api/users/*`, dan `/api/employee-has-permissions/*` dihapus
- ⚠️ SSO handler diperbarui untuk menggunakan employees table
- ⚠️ Permission management hanya melalui database langsung (tidak ada API endpoint)

## Rekomendasi

1. **Testing Thoroughly**: Pastikan semua endpoint dan autentikasi berfungsi dengan baik
2. **Update Client Applications**: Update aplikasi client untuk menggunakan endpoint dan field baru
3. **Monitor Performance**: Monitor performa query setelah perubahan struktur database
4. **Documentation Update**: Update dokumentasi API untuk developer lain

## Support

Jika ada masalah dengan migrasi atau implementasi, silakan hubungi tim development.
