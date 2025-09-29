# Fix Filter Users - Implementasi Filter Employee Relations

## Issue yang Diperbaiki
User menambahkan filter baru (`employee_name`, `employee_email`) di schema Swagger, tapi filter tersebut tidak berfungsi di backend karena belum diimplementasikan untuk kolom relasi dari tabel employees.

## Root Cause
- Filter standar menggunakan `applyFilters()` yang langsung menerapkan `WHERE column = value`
- Kolom relasi (`employee_name`, `employee_email`) berasal dari tabel employees yang di-JOIN
- Perlu custom handling untuk filter kolom relasi

## Solusi yang Diimplementasikan

### 1. Handler Update (`src/modules/users/handler.js`)

#### ✅ Menambahkan Filter Baru ke `allowedFilters`
```javascript
// BEFORE
allowedFilters: [
  'employee_id', 'role_id', 'is_delete',
  'created_by', 'updated_by', 'user_name', 'user_email'
],

// AFTER  
allowedFilters: [
  'employee_id', 'role_id', 'is_delete',
  'created_by', 'updated_by', 'user_name', 'user_email',
  'employee_name', 'employee_email'  // ✅ NEW
],
```

### 2. Repository Update (`src/modules/users/postgre_repository.js`)

#### ✅ Base Query dengan JOIN ke Employees
```javascript
// Base query untuk users dengan JOIN ke employees
const baseQuery = this.knex(this.tableName)
  .leftJoin('employees', 'users.employee_id', 'employees.employee_id')
  .select(
    'users.*',
    'employees.employee_name',
    'employees.employee_email'
  )
  .where('users.is_delete', false);
```

#### ✅ Custom Filter Logic untuk Kolom Relasi
```javascript
// Pisahkan filter relasi dari filter standar
const { filters } = queryParams
const relationFilters = {}
const standardFilters = {}

Object.keys(filters).forEach(key => {
  if (['employee_name', 'employee_email'].includes(key)) {
    relationFilters[key] = filters[key]
  } else {
    standardFilters[key] = filters[key]
  }
})
```

#### ✅ Apply Filter Relasi Secara Manual
```javascript
// Apply filter relasi secara manual
if (relationFilters.employee_name) {
  dataQuery = dataQuery.where('employees.employee_name', 'ilike', `%${relationFilters.employee_name}%`)
}
if (relationFilters.employee_email) {
  dataQuery = dataQuery.where('employees.employee_email', 'ilike', `%${relationFilters.employee_email}%`)
}
```

#### ✅ Count Query dengan Filter Relasi
```javascript
// Build count query dengan JOIN dan filter relasi yang sama
let countBaseQuery = this.knex(this.tableName)
  .leftJoin('employees', 'users.employee_id', 'employees.employee_id')
  .select('*')
  .where('users.is_delete', false);

// Apply filter relasi ke count query juga
if (relationFilters.employee_name) {
  countQuery = countQuery.where('employees.employee_name', 'ilike', `%${relationFilters.employee_name}%`)
}
if (relationFilters.employee_email) {
  countQuery = countQuery.where('employees.employee_email', 'ilike', `%${relationFilters.employee_email}%`)
}
```

### 3. Schema Swagger Update (User sudah melakukan)

#### ✅ `SchemaPostUsersGet` - Ditambahkan field filter baru:
```json
{
  "employee_name": {
    "type": "string",
    "description": "Filter by employee name"
  },
  "employee_email": {
    "type": "string", 
    "description": "Filter by employee email"
  }
}
```

## Struktur Relasi Database
```
users -> employee_id -> employees
```

- **users.employee_id** → **employees.employee_id**

## Fitur Filter yang Tersedia

### ✅ Filter Standar (Kolom Users)
- `employee_id` - Filter berdasarkan UUID employee
- `role_id` - Filter berdasarkan UUID role
- `user_name` - Filter berdasarkan username
- `user_email` - Filter berdasarkan user email
- `created_by`, `updated_by` - Filter berdasarkan user yang membuat/update
- `is_delete` - Filter berdasarkan status delete
- `start_date` / `end_date` - Filter berdasarkan tanggal created_at

### ✅ Filter Relasi (Kolom JOIN) - **BARU**
- `employee_name` - Filter berdasarkan nama employee (ILIKE)
- `employee_email` - Filter berdasarkan email employee (ILIKE)

### ✅ Filter Lainnya
- `search` - Pencarian di user_name dan user_email
- `sort_by` / `sort_order` - Sorting
- `page` / `limit` - Pagination

## Testing Results

### ✅ Filter `employee_email: "adinovrianto11@motorsights.net"` - SUCCESS
```bash
curl -X POST http://localhost:9518/api/users/get \
  -H "Authorization: Bearer TOKEN" \
  -d '{"employee_email": "adinovrianto11@motorsights.net"}'
```
**Result:** ✅ Menampilkan 1 user dengan employee_email yang sesuai

### ✅ Filter `employee_name: "Abdul"` - SUCCESS  
```bash
curl -X POST http://localhost:9518/api/users/get \
  -H "Authorization: Bearer TOKEN" \
  -d '{"employee_name": "Abdul", "limit": 3}'
```
**Result:** ✅ Menampilkan 3 users dengan employee_name mengandung "Abdul"

### ✅ Kombinasi Filter - SUCCESS
```bash
curl -X POST http://localhost:9518/api/users/get \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "employee_name": "Abdul",
    "role_id": "b7613c75-cafc-4dfb-873e-522a16640170"
  }'
```
**Result:** ✅ Menampilkan users yang sesuai dengan kedua filter

### ✅ User's Original Curl - SUCCESS
```bash
curl -X 'POST' \
  'http://localhost:9518/api/users/get' \
  -H 'Authorization: Bearer TOKEN' \
  -d '{
    "employee_email": "adinovrianto11@motorsights.net"
  }'
```
**Result:** ✅ **1 user dengan employee_email yang exact match**

## Response Format dengan Relasi Data

### ✅ Response Diperkaya dengan Data Employee
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "data": [
      {
        "user_id": "ca48b583-6db0-4aed-9dde-90656f8db2ee",
        "user_name": "Adinovrianto",
        "user_email": "adinovrianto11@motorsights.net",
        "employee_id": "d0bc2808-fee7-4611-ae84-ea9c5b1fed41",
        "role_id": "b7613c75-cafc-4dfb-873e-522a16640170",
        "employee_name": "Adinovrianto",      // ✅ NEW from JOIN
        "employee_email": "adinovrianto11@motorsights.net", // ✅ NEW from JOIN
        "created_at": "2025-09-17T15:41:08.508Z",
        "is_delete": false
      }
    ],
    "pagination": {
      "total": 1,                             // ✅ Akurat dengan filter
      "current_page": 1,
      "per_page": 10
    }
  }
}
```

## Keunggulan Implementasi

### ✅ Partial Matching dengan ILIKE
- Filter menggunakan `ILIKE %value%` untuk pencarian partial
- Case-insensitive search
- Contoh: `employee_name: "Abdul"` akan match "Abdul Haris", "Abdul Ikram Amili"

### ✅ Performance Optimized
- Filter relasi hanya diterapkan jika ada value
- Count query menggunakan JOIN yang sama untuk akurasi pagination
- Standard filters tetap menggunakan sistem yang sudah ada

### ✅ Data Enrichment
- Response otomatis menampilkan `employee_name` dan `employee_email`
- Tidak perlu query terpisah untuk mendapatkan data employee
- Konsisten dengan implementasi employees module

### ✅ Backward Compatible
- Filter lama tetap berfungsi
- Tidak ada breaking changes
- API contract konsisten

### ✅ Kombinasi Filter
- Bisa menggunakan multiple filter sekaligus
- Filter relasi + filter standar + search + pagination
- Semua filter bekerja dengan AND logic

## Summary

✅ **Issue FIXED:** Filter `employee_name` dan `employee_email` sekarang berfungsi dengan benar

✅ **Data Accuracy:** Hasil filter sesuai dengan parameter yang diberikan

✅ **Data Enrichment:** Response otomatis menampilkan data employee yang terkait

✅ **Performance:** Query optimized dengan proper JOIN dan conditional filtering

✅ **User Experience:** Swagger schema lengkap dan akurat untuk testing

**Curl command user sekarang menampilkan data yang benar sesuai filter `employee_email: "adinovrianto11@motorsights.net"`** 🎉

## Example Response dari User's Curl
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "user_name": "Adinovrianto",
        "employee_name": "Adinovrianto",           // ✅ Sesuai filter
        "employee_email": "adinovrianto11@motorsights.net" // ✅ Sesuai filter
      }
    ],
    "pagination": {
      "total": 1,    // ✅ Akurat - hanya 1 user dengan email tersebut
      "current_page": 1,
      "per_page": 10
    }
  }
}
```

**🎉 Filter issue sudah FIXED! Endpoint users sekarang mendukung filter berdasarkan data employee yang terkait.**
