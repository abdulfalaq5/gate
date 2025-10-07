# Employee Permission Status Update Documentation

## Overview
Dokumentasi ini menjelaskan perubahan pada sistem permission untuk employee yang mendukung struktur baru dengan `permission_status` boolean untuk setiap permission.

## Perubahan yang Dilakukan

### 1. Struktur Permission Detail Baru

**Struktur Lama:**
```json
{
  "permission_detail": [
    {
      "menu_id": "9adfbe58-fd68-4ff2-b14b-cc7ff4e771ab",
      "permission_detail": [
        {
          "permission_id": "a8865aed-53e1-4126-9268-a103bf5bb8e8"
        }
      ]
    }
  ]
}
```

**Struktur Baru:**
```json
{
  "permission_detail": [
    {
      "menu_id": "cbd33a30-048b-46b2-9b9f-d3048d0f1b64",
      "menu_name": "Category Power BI",
      "permission_detail": [
        {
          "permission_id": "d8ba9141-0887-4b25-b3b4-3f2fcb5d60c5",
          "permission_name": "create",
          "permission_status": true
        },
        {
          "permission_id": "25cce7e4-d0c0-43ae-9890-bd1e99f05eb9",
          "permission_name": "delete",
          "permission_status": false
        },
        {
          "permission_id": "a8865aed-53e1-4126-9268-a103bf5bb8e8",
          "permission_name": "read",
          "permission_status": false
        },
        {
          "permission_id": "34703908-a2b0-4696-b1e4-9faff81f2a1e",
          "permission_name": "update",
          "permission_status": false
        }
      ]
    }
  ]
}
```

### 2. Logika Proses Permission

#### Untuk CREATE Employee:
- Jika `permission_status: true` → Tambahkan data ke tabel `employeeHasPermissions`
- Jika `permission_status: false` → Tidak ada aksi (permission tidak diberikan)

#### Untuk UPDATE Employee:
- Jika `permission_status: true` → Tambahkan data ke tabel `employeeHasPermissions` (jika belum ada)
- Jika `permission_status: false` → Hapus data dari tabel `employeeHasPermissions` berdasarkan `employee_id`, `menu_id`, dan `permission_id`

### 3. Perubahan pada Repository (`src/modules/employees/postgre_repository.js`)

#### Method `createEmployeePermissions()` - Diperbarui
```javascript
async createEmployeePermissions(employeeId, permissions, createdBy) {
  // Hanya menambahkan permission jika permission_status === true
  for (const permission of permissions) {
    if (permission.menu_id && permission.permission_detail && Array.isArray(permission.permission_detail)) {
      for (const detail of permission.permission_detail) {
        if (detail.permission_id && detail.permission_status === true) {
          permissionData.push({
            employee_id: employeeId,
            menu_id: permission.menu_id,
            permission_id: detail.permission_id,
            created_by: createdBy,
            created_at: new Date()
          })
        }
      }
    }
  }
}
```

#### Method Baru: `updateEmployeePermissions()`
```javascript
async updateEmployeePermissions(employeeId, permissions, updatedBy) {
  // Memproses permission_status untuk setiap permission
  for (const permission of permissions) {
    for (const detail of permission.permission_detail) {
      if (detail.permission_status === true) {
        // Insert permission
        permissionData.push({...})
      } else if (detail.permission_status === false) {
        // Delete permission
        await this.knex('employeeHasPermissions').where(condition).del()
      }
    }
  }
}
```

### 4. Perubahan pada Handler (`src/modules/employees/handler.js`)

#### Update Employee Handler
```javascript
// Update employee permissions based on status if provided
if (parsedPermissions && Array.isArray(parsedPermissions)) {
  await employeesRepository.updateEmployeePermissions(
    id, 
    parsedPermissions, 
    req.user?.user_id
  )
}
```

### 5. Dokumentasi Swagger Update

#### Schema SchemaResponseEmployees
- Ditambahkan field `permission_detail` dengan struktur lengkap
- Mendukung `permission_status` boolean untuk setiap permission

#### Schema SchemaPostEmployees dan SchemaPutEmployees
- Diperbarui contoh `permission_detail` dengan struktur baru
- Menambahkan `menu_name` dan `permission_name`
- Menambahkan `permission_status` boolean

## Contoh Penggunaan

### CREATE Employee dengan Permission Detail Baru

```bash
curl -X 'POST' \
  'http://localhost:9518/api/employees/create' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: multipart/form-data' \
  -F 'permission_detail=[{"menu_id":"cbd33a30-048b-46b2-9b9f-d3048d0f1b64","menu_name":"Category Power BI","permission_detail":[{"permission_id":"d8ba9141-0887-4b25-b3b4-3f2fcb5d60c5","permission_name":"create","permission_status":true},{"permission_id":"25cce7e4-d0c0-43ae-9890-bd1e99f05eb9","permission_name":"delete","permission_status":false},{"permission_id":"a8865aed-53e1-4126-9268-a103bf5bb8e8","permission_name":"read","permission_status":false},{"permission_id":"34703908-a2b0-4696-b1e4-9faff81f2a1e","permission_name":"update","permission_status":false}]}]' \
  -F 'employee_name=testingfalaqharis' \
  -F 'employee_email=testingfalaqharis@example.com' \
  # ... field lainnya sesuai kebutuhan
```

### UPDATE Employee dengan Permission Detail Baru

```bash
curl -X 'PUT' \
  'http://localhost:9518/api/employees/{id}' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: multipart/form-data' \
  -F 'permission_detail=[{"menu_id":"cbd33a30-048b-46b2-9b9f-d3048d0f1b64","menu_name":"Category Power BI","permission_detail":[{"permission_id":"d8ba9141-0887-4b25-b3b4-3f2fcb5d60c5","permission_name":"create","permission_status":true},{"permission_id":"25cce7e4-d0c0-43ae-9890-bd1e99f05eb9","permission_name":"delete","permission_status":false},{"permission_id":"a8865aed-53e1-4126-9268-a103bf5bb8e8","permission_name":"read","permission_status":false},{"permission_id":"34703908-a2b0-4696-b1e4-9faff81f2a1e","permission_name":"update","permission_status":false}]}]' \
  -F 'employee_name=testingfalaqharis updated'
  # ... field lainnya sesuai kebutuhan
```

### Response GET Employee dengan Permission Detail

```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {
    "employee_id": "f5be6a38-b269-4f7b-822b-84708c9516b1",
    "employee_name": "testingfalaqharis",
    "permission_detail": [
      {
        "menu_id": "cbd33a30-048b-46b2-9b9f-d3048d0f1b64",
        "menu_name": "Category Power BI",
        "permission_detail": [
          {
            "permission_id": "d8ba9141-0887-4b25-b3b4-3f2fcb5d60c5",
            "permission_name": "create",
            "permission_status": true
          },
          {
            "permission_id": "25cce7e4-d0c0-43ae-9890-bd1e99f05eb9",
            "permission_name": "delete",
            "permission_status": false
          },
          {
            "permission_id": "a8865aed-53e1-4126-9268-a103bf5bb8e8",
            "permission_name": "read",
            "permission_status": false
          },
          {
            "permission_id": "34703908-a2b0-4696-b1e4-9faff81f2a1e",
            "permission_name": "update",
            "permission_status": false
          }
        ]
      }
    ]
    // ... field lainnya
  }
}
```

## Backward Compatibility

Perubahan ini tetap backward compatible:

1. **Struktur Lama Masih Didukung**: Sistem tetap dapat menerima struktur permission_detail lama
2. **Field New Optional**: `menu_name`, `permission_name`, dan `permission_status` adalah field optiona
3. **Default Behavior**: Jika `permission_status` tidak ada dalam struktur lama, sistem akan memberikan permission (behavior lama)

## Migration Guide

### Untuk Frontend/Client:
1. Update payload dengan struktur baru untuk mendapat kontrol penuh atas permission status
2. Tambahkan field `menu_name`, `permission_name`, dan `permission_status`
3. Handle response dengan struktur permission_detail yang lebih detail

### Untuk Testing:
1. Gunakan curl commands yang telah diperbarui
2. Test dengan berbagai kombinasi `permission_status`
3. Verify bahwa permission yang dihapus benar-benar dihapus dari database

## Performance Notes

1. **Efficient Updates**: Sistem menggunakan selective insert/delete berdasarkan status
2. **Duplicate Handling**: Menggunakan error handling untuk menghindari duplicate permission
3. **Transaction Safety**: Setiap operasi permission dilakukan dengan error handling yang proper

## File Changes Summary

### Modified Files:
1. `src/modules/employees/postgre_repository.js`
   - Updated `createEmployeePermissions()`
   - Added `updateEmployeePermissions()`

2. `src/modules/employees/handler.js`
   - Updated `updateEmployee()` handler

3. `src/static/schema/employees.json`
   - Updated `SchemaResponseEmployees`
   - Updated `SchemaPostEmployees`
   - Updated `SchemaPutEmployees`

### New Documentation:
- `docs/EMPLOYEE_PERMISSION_STATUS_UPDATE.md` (this file)

## Testing Checklist

- [ ] CREATE employee dengan permission_status true
- [ ] CREATE employee dengan permission_status false
- [ ] CREATE employee dengan mixed permission_status
- [ ] UPDATE employee untuk menambah permission (status true)
- [ ] UPDATE employee untuk menghapus permission (status false)
- [ ] UPDATE employee dengan mixed changes
- [ ] Verify response GET employee memiliki permission_detail yang akurat
- [ ] Test error handling untuk duplicate permissions
- [ ] Test backward compatibility dengan struktur lama
