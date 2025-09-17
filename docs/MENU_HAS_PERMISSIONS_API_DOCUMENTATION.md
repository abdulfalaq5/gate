# Menu Has Permissions API Documentation

## Overview

Module `menu_has_permissions` adalah bagian dari sistem SSO yang mengelola relasi antara menu dan permission. Module ini memungkinkan administrator untuk mengatur permission apa saja yang dapat diakses melalui menu tertentu.

## Table Structure

```sql
CREATE TABLE menuHasPermissions (
    menu_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID,
    PRIMARY KEY (menu_id, permission_id),
    FOREIGN KEY (menu_id) REFERENCES menus(menu_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
);
```

## API Endpoints

### Base URL
```
/api/menu-has-permissions
```

### Authentication
Semua endpoint memerlukan Bearer Token authentication.

---

## 1. Create Menu Has Permission

**POST** `/api/menu-has-permissions`

Membuat relasi baru antara menu dan permission.

### Request Body
```json
{
  "menu_id": "550e8400-e29b-41d4-a716-446655440001",
  "permission_id": "550e8400-e29b-41d4-a716-446655440002"
}
```

### Response
- **201 Created**: Relasi berhasil dibuat
- **400 Bad Request**: Data tidak valid
- **409 Conflict**: Relasi sudah ada
- **500 Internal Server Error**: Error server

### Example Response (201)
```json
{
  "success": true,
  "message": "Menu-Permission relationship created successfully",
  "data": {
    "menu_id": "550e8400-e29b-41d4-a716-446655440001",
    "permission_id": "550e8400-e29b-41d4-a716-446655440002",
    "created_at": "2024-01-15T10:30:00.000Z",
    "created_by": "550e8400-e29b-41d4-a716-446655440003"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. List Menu Has Permissions

**GET** `/api/menu-has-permissions`

Mengambil daftar relasi menu-permission dengan filtering, pagination, dan sorting.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Nomor halaman (default: 1) |
| limit | integer | No | Jumlah item per halaman (default: 10, max: 100) |
| sort_by | string | No | Kolom untuk sorting (menu_name, permission_name, created_at, updated_at) |
| sort_order | string | No | Urutan sorting (asc, desc) |
| search | string | No | Pencarian berdasarkan menu_name atau permission_name |
| menu_id | UUID | No | Filter berdasarkan menu ID |
| permission_id | UUID | No | Filter berdasarkan permission ID |
| start_date | date | No | Filter tanggal mulai (YYYY-MM-DD) |
| end_date | date | No | Filter tanggal akhir (YYYY-MM-DD) |

### Example Request
```
GET /api/menu-has-permissions?page=1&limit=10&sort_by=created_at&sort_order=desc&search=admin
```

### Response (200)
```json
{
  "success": true,
  "message": "Menu-Permission relationships retrieved successfully",
  "data": {
    "data": [
      {
        "menu_id": "550e8400-e29b-41d4-a716-446655440001",
        "permission_id": "550e8400-e29b-41d4-a716-446655440002",
        "menu_name": "Admin Dashboard",
        "menu_url": "/admin/dashboard",
        "permission_name": "admin.read",
        "created_at": "2024-01-15T10:30:00.000Z",
        "created_by": "550e8400-e29b-41d4-a716-446655440003",
        "updated_at": null,
        "updated_by": null
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 1,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 3. Get Specific Menu Has Permission

**GET** `/api/menu-has-permissions/{menu_id}/{permission_id}`

Mengambil relasi menu-permission berdasarkan menu_id dan permission_id.

### Path Parameters
- `menu_id` (UUID, required): ID menu
- `permission_id` (UUID, required): ID permission

### Response
- **200 OK**: Relasi ditemukan
- **404 Not Found**: Relasi tidak ditemukan
- **500 Internal Server Error**: Error server

---

## 4. Get Permissions by Menu

**GET** `/api/menu-has-permissions/menu/{menu_id}`

Mengambil semua permission yang terkait dengan menu tertentu.

### Path Parameters
- `menu_id` (UUID, required): ID menu

### Response (200)
```json
{
  "success": true,
  "message": "Permissions for menu retrieved successfully",
  "data": [
    {
      "menu_id": "550e8400-e29b-41d4-a716-446655440001",
      "permission_id": "550e8400-e29b-41d4-a716-446655440002",
      "permission_name": "admin.read",
      "created_at": "2024-01-15T10:30:00.000Z",
      "created_by": "550e8400-e29b-41d4-a716-446655440003"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 5. Get Menus by Permission

**GET** `/api/menu-has-permissions/permission/{permission_id}`

Mengambil semua menu yang terkait dengan permission tertentu.

### Path Parameters
- `permission_id` (UUID, required): ID permission

### Response (200)
```json
{
  "success": true,
  "message": "Menus for permission retrieved successfully",
  "data": [
    {
      "menu_id": "550e8400-e29b-41d4-a716-446655440001",
      "permission_id": "550e8400-e29b-41d4-a716-446655440002",
      "menu_name": "Admin Dashboard",
      "menu_url": "/admin/dashboard",
      "created_at": "2024-01-15T10:30:00.000Z",
      "created_by": "550e8400-e29b-41d4-a716-446655440003"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 6. Update Menu Has Permission

**PUT** `/api/menu-has-permissions/{menu_id}/{permission_id}`

Mengupdate metadata relasi menu-permission.

### Path Parameters
- `menu_id` (UUID, required): ID menu
- `permission_id` (UUID, required): ID permission

### Request Body
```json
{
  "updated_by": "550e8400-e29b-41d4-a716-446655440003"
}
```

### Response
- **200 OK**: Relasi berhasil diupdate
- **404 Not Found**: Relasi tidak ditemukan
- **500 Internal Server Error**: Error server

---

## 7. Delete Menu Has Permission

**DELETE** `/api/menu-has-permissions/{menu_id}/{permission_id}`

Menghapus relasi menu-permission tertentu.

### Path Parameters
- `menu_id` (UUID, required): ID menu
- `permission_id` (UUID, required): ID permission

### Response
- **200 OK**: Relasi berhasil dihapus
- **404 Not Found**: Relasi tidak ditemukan
- **500 Internal Server Error**: Error server

---

## 8. Delete All by Menu

**DELETE** `/api/menu-has-permissions/menu/{menu_id}`

Menghapus semua relasi permission untuk menu tertentu.

### Path Parameters
- `menu_id` (UUID, required): ID menu

### Response (200)
```json
{
  "success": true,
  "message": "All menu-permission relationships for menu deleted successfully",
  "data": {
    "deleted_count": 3
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 9. Delete All by Permission

**DELETE** `/api/menu-has-permissions/permission/{permission_id}`

Menghapus semua relasi menu untuk permission tertentu.

### Path Parameters
- `permission_id` (UUID, required): ID permission

### Response (200)
```json
{
  "success": true,
  "message": "All menu-permission relationships for permission deleted successfully",
  "data": {
    "deleted_count": 2
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Menu ID and Permission ID are required",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Menu-Permission relationship not found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Menu-Permission relationship already exists",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create menu-permission relationship",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Validation Rules

### Create Menu Has Permission
- `menu_id`: Required, must be valid UUID
- `permission_id`: Required, must be valid UUID
- Relationship must not already exist

### Update Menu Has Permission
- At least one field must be provided for update
- `updated_by`: Optional, must be valid UUID if provided

---

## Usage Examples

### cURL Examples

#### Create Menu Has Permission
```bash
curl -X POST "http://localhost:3000/api/menu-has-permissions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "menu_id": "550e8400-e29b-41d4-a716-446655440001",
    "permission_id": "550e8400-e29b-41d4-a716-446655440002"
  }'
```

#### List with Filters
```bash
curl -X GET "http://localhost:3000/api/menu-has-permissions?page=1&limit=10&sort_by=created_at&sort_order=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Permissions by Menu
```bash
curl -X GET "http://localhost:3000/api/menu-has-permissions/menu/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Delete Menu Has Permission
```bash
curl -X DELETE "http://localhost:3000/api/menu-has-permissions/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing

Gunakan script test yang sudah disediakan:

```bash
./test-menu-has-permissions-api.sh
```

Pastikan server sudah running dan ganti UUID yang digunakan dengan UUID yang valid dari database.

---

## Integration with Swagger UI

Dokumentasi API ini juga tersedia di Swagger UI pada endpoint:
```
http://localhost:3000/docs
```

Tag: **Menu Has Permissions**

---

## Notes

1. **Composite Primary Key**: Tabel menggunakan composite primary key (menu_id, permission_id)
2. **Foreign Key Constraints**: Pastikan menu_id dan permission_id valid sebelum membuat relasi
3. **Cascade Operations**: Hapus relasi menu-permission saat menghapus menu atau permission
4. **Audit Trail**: Semua operasi CRUD mencatat created_by dan updated_by
5. **Pagination**: Gunakan pagination untuk performa yang optimal pada data besar
