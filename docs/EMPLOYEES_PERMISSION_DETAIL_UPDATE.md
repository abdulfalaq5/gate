# GET Employees Endpoint Update - Menambahkan Permission Detail

## Overview
Endpoint GET `/api/employees/{id}` telah diupdate untuk menambahkan field `permission_detail` yang berisi semua menu dan permission dengan status apakah employee memiliki permission tersebut atau tidak.

## Perubahan yang Dilakukan

### 1. Repository Update (`src/modules/employees/postgre_repository.js`)
- ✅ Mengupdate method `getEmployeeById()` untuk menambahkan permission detail
- ✅ Mengambil semua menu dari tabel `menus`
- ✅ Mengambil semua permission dari tabel `permissions`
- ✅ Mengambil permission employee dari tabel `employeeHasPermissions`
- ✅ Membuat mapping semua kombinasi menu-permission dengan status true/false

### 2. Query Strategy
- **Menus**: Mengambil semua menu yang tidak dihapus (`is_delete = false`)
- **Permissions**: Mengambil semua permission yang tidak dihapus (`is_delete = false`)
- **Employee Permissions**: Mengambil permission yang dimiliki employee dari `employeeHasPermissions`
- **Mapping**: Membuat kombinasi semua menu dengan semua permission, dengan status berdasarkan data di `employeeHasPermissions`

## Endpoint yang Diupdate

### GET /api/employees/{id}
Mendapatkan data employee dengan permission detail lengkap.

**Headers:**
```
Authorization: Bearer <jwt_token>
Accept: application/json
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {
    "employee_id": "uuid",
    "employee_name": "Employee Name",
    "employee_email": "employee@example.com",
    "title_name": "Job Title",
    "department_name": "Department Name",
    "company_name": "Company Name",
    "permission_detail": [
      {
        "menu_id": "uuid",
        "menu_name": "Companies",
        "permission_detail": [
          {
            "permission_id": "uuid",
            "permission_name": "create",
            "permission_status": true
          },
          {
            "permission_id": "uuid",
            "permission_name": "read",
            "permission_status": true
          },
          {
            "permission_id": "uuid",
            "permission_name": "update",
            "permission_status": true
          },
          {
            "permission_id": "uuid",
            "permission_name": "delete",
            "permission_status": false
          }
        ]
      }
    ]
  },
  "timestamp": "2025-09-24T06:35:01.000Z"
}
```

## Struktur Permission Detail

### `permission_detail` Array
Setiap item dalam array `permission_detail` memiliki struktur:

- **`menu_id`**: UUID menu
- **`menu_name`**: Nama menu (string)
- **`permission_detail`**: Array permission untuk menu tersebut

### `permission_detail.permission_detail` Array
Setiap item dalam array permission memiliki struktur:

- **`permission_id`**: UUID permission
- **`permission_name`**: Nama permission (string)
- **`permission_status`**: Boolean yang menunjukkan apakah employee memiliki permission tersebut
  - `true`: Employee memiliki permission (ada data di `employeeHasPermissions`)
  - `false`: Employee tidak memiliki permission (tidak ada data di `employeeHasPermissions`)

## Contoh Penggunaan

### Curl Command
```bash
curl -X 'GET' \
  'http://localhost:9518/api/employees/4f0a1818-39f8-4857-9143-b2e543438c9e' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjBiNTcyNTgtNWYzMy00ZTAzLTgxZjctY2Q3MGQ4MzNiNWM1IiwiZW1wbG95ZWVfaWQiOiJmMGI1NzI1OC01ZjMzLTRlMDMtODFmNy1jZDcwZDgzM2I1YzUiLCJpYXQiOjE3NTg2OTE2NDgsImV4cCI6MTc1ODc3ODA0OCwiYXVkIjoic3RyaW5nIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0.j9snqWayjJc4Wq_6UzBT0O-3OqkiP3NBAZcWnptSsmA'
```

### JavaScript/Frontend Usage
```javascript
const response = await fetch('/api/employees/4f0a1818-39f8-4857-9143-b2e543438c9e', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json'
  }
});

const data = await response.json();

if (data.success) {
  const permissionDetail = data.data.permission_detail;
  
  // Iterate through all menus
  permissionDetail.forEach(menu => {
    console.log(`Menu: ${menu.menu_name}`);
    
    // Check permissions for this menu
    menu.permission_detail.forEach(permission => {
      if (permission.permission_status) {
        console.log(`  ✓ ${permission.permission_name}`);
      } else {
        console.log(`  ✗ ${permission.permission_name}`);
      }
    });
  });
}
```

## Logika Permission Status

### `permission_status: true`
- Data ada di tabel `employeeHasPermissions` dengan kombinasi `employee_id`, `menu_id`, dan `permission_id` yang sesuai

### `permission_status: false`
- Data tidak ada di tabel `employeeHasPermissions` dengan kombinasi `employee_id`, `menu_id`, dan `permission_id` yang sesuai

## Backward Compatibility

- ✅ **Fully Backward Compatible**: Perubahan ini hanya menambahkan field baru tanpa mengubah struktur yang sudah ada
- ✅ **Optional Field**: `permission_detail` adalah field baru yang tidak mempengaruhi response yang sudah ada
- ✅ **Existing Fields**: Semua field yang sudah ada tetap sama dan tidak berubah

## Performance Considerations

- **Query Optimization**: Menggunakan 3 query terpisah untuk menghindari complex join
- **Memory Efficient**: Menggunakan Map dan Set untuk lookup yang cepat
- **Scalable**: Struktur ini dapat menangani banyak menu dan permission tanpa masalah performa

## Testing

Endpoint sudah ditest dan berfungsi dengan baik:

```bash
# Test dengan jq untuk melihat struktur lengkap
curl -X 'GET' \
  'http://localhost:9518/api/employees/4f0a1818-39f8-4857-9143-b2e543438c9e' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>' | jq '.data.permission_detail[0]'
```

Response menunjukkan bahwa `permission_detail` sudah berhasil ditambahkan dengan struktur yang sesuai permintaan! 🎉
