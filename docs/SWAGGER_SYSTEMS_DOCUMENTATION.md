# Dokumentasi Swagger untuk Systems API

## Overview
Dokumentasi Swagger untuk endpoint Systems telah berhasil ditambahkan ke sistem dokumentasi API yang ada. Module Systems menyediakan CRUD operations untuk mengelola sistem dalam aplikasi.

## File yang Ditambahkan

### 1. Path Documentation
**File:** `src/static/path/systems.json`
- Mendefinisikan endpoint `/systems` (POST dan GET)
- Mendefinisikan endpoint `/systems/{id}` (GET, PUT, DELETE)
- Menyertakan deskripsi lengkap untuk setiap endpoint
- Menyertakan security requirements (Bearer Auth)
- Menyertakan semua response codes yang mungkin

### 2. Schema Documentation
**File:** `src/static/schema/systems.json`
- `SchemaPostSystemCreate`: Schema untuk request body create system
- `SchemaPostSystemUpdate`: Schema untuk request body update system
- `SchemaResponseSystem`: Schema untuk response detail system
- `SchemaResponseSystemList`: Schema untuk response list systems
- `SchemaResponseSystemDelete`: Schema untuk response delete system

### 3. Integration Files
**File:** `src/static/path/index.js` dan `src/static/schema/index.js`
- Menambahkan import dan export untuk file systems
- Terintegrasi dengan sistem dokumentasi yang ada

## Cara Mengakses Swagger Documentation

### 1. Development Server
```
http://localhost:3000/api-docs
```

### 2. Production Server
```
https://your-domain.com/api-docs
```

## Fitur Swagger yang Tersedia

### 1. Interactive API Testing
- Test endpoint langsung dari browser
- Input validation otomatis
- Response preview real-time

### 2. Authentication
- Bearer Token authentication
- Test dengan token JWT yang valid
- Security scheme terintegrasi

### 3. Request/Response Examples
- Contoh request body untuk setiap endpoint
- Contoh response untuk setiap status code
- Validasi input dengan pattern dan constraints

## Endpoint yang Didokumentasikan

### 1. POST /systems/create
- **Tag:** Systems
- **Security:** Bearer Auth required
- **Request Body:** SchemaPostSystemCreate
- **Response:** 201, 400, 401, 500
- **Description:** Membuat sistem baru dengan informasi nama, URL, icon, dan urutan

### 2. POST /systems/get
- **Tag:** Systems
- **Security:** Bearer Auth required
- **Request Body:** SchemaPostSystemGet (opsional)
- **Response:** 200, 401, 500
- **Description:** Mendapatkan daftar semua sistem yang aktif dengan pagination dan search

### 3. GET /systems/{id}
- **Tag:** Systems
- **Security:** Bearer Auth required
- **Path Parameter:** id (UUID)
- **Response:** 200, 400, 401, 404, 500
- **Description:** Mendapatkan detail sistem berdasarkan ID

### 4. PUT /systems/{id}
- **Tag:** Systems
- **Security:** Bearer Auth required
- **Path Parameter:** id (UUID)
- **Request Body:** SchemaPostSystemUpdate
- **Response:** 200, 400, 401, 404, 500
- **Description:** Mengupdate informasi sistem berdasarkan ID

### 5. DELETE /systems/{id}
- **Tag:** Systems
- **Security:** Bearer Auth required
- **Path Parameter:** id (UUID)
- **Response:** 200, 400, 401, 404, 500
- **Description:** Menghapus sistem berdasarkan ID (soft delete)

## Validasi yang Didokumentasikan

### Create System
- `system_name`: required, 3-100 karakter
- `system_url`: opsional, maksimal 255 karakter
- `system_icon`: opsional, maksimal 150 karakter
- `system_order`: opsional, non-negative integer

### Update System
- `system_name`: opsional, 3-100 karakter
- `system_url`: opsional, maksimal 255 karakter
- `system_icon`: opsional, maksimal 150 karakter
- `system_order`: opsional, non-negative integer
- Minimal satu field harus diisi

### Request Body Parameters (POST /systems/get)
- `page`: opsional, positive integer (minimum 1)
- `limit`: opsional, integer 1-100
- `search`: opsional, 1-100 karakter

## Contoh Penggunaan di Swagger UI

### 1. Authentication
1. Buka Swagger UI
2. Klik tombol "Authorize" di bagian atas
3. Masukkan token JWT: `Bearer your_jwt_token_here`
4. Klik "Authorize"

### 2. Test Create System
1. Expand endpoint `POST /systems/create`
2. Klik "Try it out"
3. Masukkan data di Request body:
   ```json
   {
     "system_name": "Human Resources Management System",
     "system_url": "https://hr.company.com",
     "system_icon": "fas fa-users",
     "system_order": 1
   }
   ```
4. Klik "Execute"

### 3. Test Get All Systems
1. Expand endpoint `POST /systems/get`
2. Klik "Try it out"
3. Opsional: Masukkan data di Request body:
   ```json
   {
     "page": 1,
     "limit": 10,
     "search": "HR"
   }
   ```
4. Klik "Execute"

### 4. Test Get System by ID
1. Expand endpoint `GET /systems/{id}`
2. Klik "Try it out"
3. Masukkan system ID di path parameter
4. Klik "Execute"

### 5. Test Update System
1. Expand endpoint `PUT /systems/{id}`
2. Klik "Try it out"
3. Masukkan system ID di path parameter
4. Masukkan data di Request body:
   ```json
   {
     "system_name": "Updated HR Management System",
     "system_url": "https://new-hr.company.com"
   }
   ```
5. Klik "Execute"

### 6. Test Delete System
1. Expand endpoint `DELETE /systems/{id}`
2. Klik "Try it out"
3. Masukkan system ID di path parameter
4. Klik "Execute"

## Error Handling Documentation

### Status Codes
- **200:** Success
- **201:** Created (untuk POST)
- **400:** Bad Request (validation error)
- **401:** Unauthorized (token invalid/missing)
- **404:** Not Found (system not found)
- **500:** Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error message description",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Contoh Response

### Success Response (Create/Update/Get)
```json
{
  "success": true,
  "message": "System created successfully",
  "data": {
    "system_id": "123e4567-e89b-12d3-a456-426614174001",
    "system_name": "Human Resources Management System",
    "system_url": "https://hr.company.com",
    "system_icon": "fas fa-users",
    "system_order": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "created_by": "123e4567-e89b-12d3-a456-426614174002",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "updated_by": "123e4567-e89b-12d3-a456-426614174002",
    "is_delete": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Success Response (List)
```json
{
  "success": true,
  "message": "Systems retrieved successfully",
  "data": [
    {
      "system_id": "123e4567-e89b-12d3-a456-426614174001",
      "system_name": "Human Resources Management System",
      "system_url": "https://hr.company.com",
      "system_icon": "fas fa-users",
      "system_order": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "created_by": "123e4567-e89b-12d3-a456-426614174002",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "updated_by": "123e4567-e89b-12d3-a456-426614174002",
      "is_delete": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Success Response (Delete)
```json
{
  "success": true,
  "message": "System deleted successfully",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Tips Penggunaan

### 1. Copy cURL Command
- Setelah test endpoint, klik "Copy cURL command"
- Gunakan untuk test di terminal atau Postman

### 2. Contoh cURL untuk Endpoint Baru

#### Get Systems dengan POST
```bash
curl -X 'POST' \
  'http://localhost:9518/api/systems/get' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer your_jwt_token_here' \
  -H 'Content-Type: application/json' \
  -d '{
    "page": 1,
    "limit": 10,
    "search": "HR"
  }'
```

#### Create System
```bash
curl -X 'POST' \
  'http://localhost:9518/api/systems/create' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer your_jwt_token_here' \
  -H 'Content-Type: application/json' \
  -d '{
    "system_name": "Human Resources Management System",
    "system_url": "https://hr.company.com",
    "system_icon": "fas fa-users",
    "system_order": 1
  }'
```

### 2. Download OpenAPI Spec
- Klik "Download" di bagian atas
- Download file JSON untuk import ke tools lain

### 3. Schema Validation
- Swagger UI akan menampilkan error jika input tidak sesuai schema
- Gunakan contoh yang disediakan sebagai referensi

### 4. Response Examples
- Setiap endpoint memiliki contoh response
- Gunakan sebagai referensi untuk implementasi frontend

## Troubleshooting

### Problem: "Unauthorized" Error
**Solution:**
1. Pastikan token JWT valid
2. Pastikan format: `Bearer your_token_here`
3. Pastikan token belum expired

### Problem: "Validation Error"
**Solution:**
1. Periksa format input sesuai schema
2. Gunakan contoh yang disediakan
3. Pastikan semua required fields terisi

### Problem: "System not found" Error
**Solution:**
1. Pastikan system ID valid (format UUID)
2. Pastikan system belum dihapus (soft delete)
3. Pastikan user memiliki akses ke system tersebut
