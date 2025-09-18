# Dokumentasi Endpoint Employees

## Overview
Dokumentasi ini menjelaskan endpoint baru yang telah ditambahkan untuk modul employees sesuai dengan format yang sama dengan modul menus dan companies.

## Endpoint yang Ditambahkan

### 1. POST /employees/get
- **Method:** POST
- **URL:** `/api/employees/get`
- **Authentication:** Bearer Token required
- **Description:** Mengambil data employees dengan pagination dan filtering menggunakan POST method untuk query yang kompleks

#### Request Body (Optional):
```json
{
  "page": 1,
  "limit": 10,
  "search": "john",
  "sort_by": "employee_name",
  "sort_order": "asc",
  "title_id": "uuid-string",
  "is_delete": false,
  "start_date": "2023-01-01T00:00:00Z",
  "end_date": "2023-12-31T23:59:59Z"
}
```

#### Response (200):
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [
    {
      "employee_id": "uuid-string",
      "employee_name": "John Doe",
      "employee_email": "john@example.com",
      "title_id": "uuid-string",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "created_by": "uuid-string",
      "updated_by": "uuid-string",
      "is_delete": false
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "total_pages": 10,
    "has_next_page": true,
    "has_prev_page": false
  }
}
```

### 2. POST /employees/create
- **Method:** POST
- **URL:** `/api/employees/create`
- **Authentication:** Bearer Token required
- **Description:** Membuat employee baru

#### Request Body (Required):
```json
{
  "employee_name": "John Doe",
  "employee_email": "john@example.com",
  "title_id": "uuid-string"
}
```

#### Response (201):
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "employee_id": "uuid-string",
    "employee_name": "John Doe",
    "employee_email": "john@example.com",
    "title_id": "uuid-string",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "created_by": "uuid-string",
    "is_delete": false
  }
}
```

## Perubahan yang Dilakukan

### 1. Handler Update (`src/modules/employees/handler.js`)
- Mengupdate fungsi `getEmployees` untuk mendukung parameter dari query string (GET) dan body (POST)
- Menambahkan logic untuk menggabungkan parameter dari req.query dan req.body
- Menggunakan sistem filter standar yang sama dengan modul lain

### 2. Module Index Update (`src/modules/employees/index.js`)
- Mengubah format export untuk mengikuti pola yang sama dengan modul menus dan companies
- Menggunakan binding pattern yang konsisten

### 3. Routes Update (`src/routes/V1/sso.js`)
- Menambahkan import untuk employeesRoutes
- Menambahkan endpoint POST `/employees/get` dan POST `/employees/create`
- Menambahkan endpoint GET, PUT, DELETE untuk employees dengan parameter ID

### 4. Swagger Documentation Update

#### Path Documentation (`src/static/path/employees.json`)
- Menambahkan dokumentasi untuk endpoint POST `/employees/get`
- Menambahkan dokumentasi untuk endpoint POST `/employees/create`
- Menyertakan semua parameter dan response yang mungkin

#### Schema Documentation (`src/static/schema/employees.json`)
- Menambahkan schema `SchemaPostEmployeesGet` untuk request body endpoint `/employees/get`
- Mendefinisikan semua parameter filtering dan pagination
- Menggunakan validasi yang sesuai untuk setiap field

## Format Konsisten dengan Modul Lain
Endpoint employees sekarang mengikuti format yang sama dengan:
- **Menus:** POST `/menus/get` dan POST `/menus/create`
- **Companies:** POST `/companies/get` dan POST `/companies/create`
- **Departments:** POST `/departments/get` dan POST `/departments/create`

## Testing
Endpoint dapat ditest menggunakan:
1. **Swagger UI:** `http://localhost:3000/documentation`
2. **Postman/curl** dengan Bearer token authentication
3. **Unit tests** (jika tersedia)

## Security
- Semua endpoint memerlukan authentication dengan Bearer token
- Menggunakan middleware `verifySSOToken` untuk validasi token
- Input validation menggunakan schema yang telah didefinisikan

## Error Handling
- **400:** Bad request - validation error
- **401:** Unauthorized - invalid token
- **404:** Employee not found
- **500:** Internal server error
