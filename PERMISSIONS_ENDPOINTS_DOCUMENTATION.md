# Dokumentasi Endpoint Permissions - POST Methods

## Overview
Dokumentasi ini menjelaskan endpoint baru yang telah ditambahkan untuk modul permissions dengan format yang sama seperti roles dan menus, menggunakan POST method untuk operasi get dan create.

## Endpoint yang Ditambahkan

### 1. POST /permissions/get
- **Method:** POST
- **URL:** `/api/permissions/get`
- **Authentication:** Bearer Token required
- **Description:** Mengambil data permissions dengan pagination dan filtering menggunakan POST method untuk query yang kompleks

#### Request Body (Optional):
```json
{
  "page": 1,
  "limit": 10,
  "search": "create",
  "sort_by": "permission_name",
  "sort_order": "asc",
  "permission_name": "",
  "created_by": "",
  "updated_by": "",
  "is_delete": false,
  "start_date": "2023-01-01T00:00:00Z",
  "end_date": "2023-12-31T23:59:59Z"
}
```

#### Response (200):
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "data": [
      {
        "permission_id": "6255473f-6d75-4456-b39b-97f503ecb580",
        "permission_name": "create",
        "created_at": "2025-09-17T05:01:14.243Z",
        "created_by": null,
        "updated_at": null,
        "updated_by": null,
        "deleted_at": null,
        "deleted_by": null,
        "is_delete": false
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 10,
      "total_pages": 1,
      "has_next_page": false,
      "has_prev_page": false
    }
  },
  "timestamp": "2025-09-18T07:24:30.945Z"
}
```

### 2. POST /permissions/create
- **Method:** POST
- **URL:** `/api/permissions/create`
- **Authentication:** Bearer Token required
- **Description:** Membuat permission baru

#### Request Body (Required):
```json
{
  "permission_name": "new_permission"
}
```

#### Response (201):
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "permission_id": "234aa06c-a4e5-4826-b3a0-89e0aef024b1",
    "permission_name": "test_permission",
    "created_at": "2025-09-18T07:24:42.376Z",
    "created_by": "15baf47d-4a61-4062-b230-ea2e6a76e503",
    "updated_at": null,
    "updated_by": null,
    "deleted_at": null,
    "deleted_by": null,
    "is_delete": false
  },
  "timestamp": "2025-09-18T07:24:42.418Z"
}
```

## Perubahan yang Dilakukan

### 1. Handler Update (`src/modules/permissions/handler.js`)

#### ✅ Mengupdate fungsi `listPermissions`
- Menambahkan support untuk parameter dari query string (GET) dan body (POST)
- Menggunakan `requestParams` untuk menggabungkan parameter
- Menambahkan filter baru: `created_by`, `updated_by`, `is_delete`

```javascript
// Support parameters from both query string (GET) and body (POST)
const requestParams = {
  ...req.query,  // GET parameters
  ...req.body    // POST parameters
};

// Create a modified request object for parseStandardQuery
const modifiedReq = {
  ...req,
  query: requestParams
};
```

### 2. Routes Update (`src/routes/V1/sso.js`)

#### ✅ Mengubah routing permissions
```javascript
// BEFORE
router.post('/permissions', verifySSOToken, permissionsRoutes.createPermission);
router.get('/permissions', verifySSOToken, permissionsRoutes.listPermissions);

// AFTER
router.post('/permissions/get', verifySSOToken, permissionsRoutes.listPermissions);
router.post('/permissions/create', verifySSOToken, permissionsRoutes.createPermission);
```

### 3. Swagger Documentation Update

#### ✅ Path Documentation (`src/static/path/permissions.json`)
- Menambahkan dokumentasi untuk endpoint POST `/permissions/get`
- Menambahkan dokumentasi untuk endpoint POST `/permissions/create`
- Menggunakan format yang konsisten dengan roles dan menus

#### ✅ Schema Documentation (`src/static/schema/permissions.json`)
- Menambahkan schema `SchemaPostPermissionsGet` untuk request body
- Mendefinisikan semua parameter filtering dan pagination
- Menambahkan contoh usage

## Fitur Filter yang Tersedia

### ✅ Filter Standar
- `permission_name` - Filter berdasarkan nama permission
- `created_by` - Filter berdasarkan user yang membuat
- `updated_by` - Filter berdasarkan user yang mengupdate
- `is_delete` - Filter berdasarkan status delete
- `start_date` / `end_date` - Filter berdasarkan tanggal created_at

### ✅ Filter Lainnya
- `search` - Pencarian di permission_name
- `sort_by` / `sort_order` - Sorting
- `page` / `limit` - Pagination

## Testing Results

### ✅ POST /permissions/get - SUCCESS
```bash
curl -X POST http://localhost:9518/api/permissions/get \
  -H "Authorization: Bearer TOKEN" \
  -d '{"page": 1, "limit": 5}'
```
**Result:** ✅ Menampilkan 5 permissions pertama dengan pagination

### ✅ POST /permissions/create - SUCCESS  
```bash
curl -X POST http://localhost:9518/api/permissions/create \
  -H "Authorization: Bearer TOKEN" \
  -d '{"permission_name": "test_permission"}'
```
**Result:** ✅ Permission berhasil dibuat dengan response lengkap

### ✅ Search Filter - SUCCESS
```bash
curl -X POST http://localhost:9518/api/permissions/get \
  -H "Authorization: Bearer TOKEN" \
  -d '{"search": "test", "limit": 3}'
```
**Result:** ✅ Menampilkan permissions yang mengandung "test" dalam nama

## Format Konsisten dengan Module Lain
Endpoint permissions sekarang mengikuti format yang sama dengan:
- **Roles:** POST `/roles/get` dan POST `/roles/create`
- **Menus:** POST `/menus/get` dan POST `/menus/create`
- **Companies:** POST `/companies/get` dan POST `/companies/create`
- **Departments:** POST `/departments/get` dan POST `/departments/create`
- **Employees:** POST `/employees/get` dan POST `/employees/create`

## Curl Examples

### Get Permissions with Pagination
```bash
curl -X POST http://localhost:9518/api/permissions/get \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "page": 1,
    "limit": 10,
    "sort_by": "permission_name",
    "sort_order": "asc"
  }'
```

### Create New Permission
```bash
curl -X POST http://localhost:9518/api/permissions/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "permission_name": "manage_users"
  }'
```

### Search Permissions
```bash
curl -X POST http://localhost:9518/api/permissions/get \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "search": "create",
    "limit": 5
  }'
```

## Security & Authentication
- ✅ Semua endpoint menggunakan middleware `verifySSOToken`
- ✅ Memerlukan Bearer token authentication
- ✅ Input validation menggunakan schema yang telah didefinisikan

## Summary

✅ **Endpoint permissions berhasil dibuat dengan format yang konsisten:**
- POST `/permissions/get` - Mengambil data dengan filtering kompleks
- POST `/permissions/create` - Membuat permission baru

✅ **Swagger documentation lengkap** dengan schema dan contoh

✅ **Testing berhasil** - semua endpoint berfungsi dengan baik

✅ **Format konsisten** dengan module roles, menus, companies, departments, dan employees

**Server berjalan di port 9518 dan siap digunakan!** 🎉
