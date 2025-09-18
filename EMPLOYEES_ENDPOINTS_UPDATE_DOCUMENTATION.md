# Update Dokumentasi Endpoint Employees - Penambahan Relasi Data

## Overview
Dokumentasi ini menjelaskan update yang telah dilakukan pada endpoint employees untuk menambahkan data relasi (`title_name`, `department_name`, `company_name`) ke dalam response.

## Perubahan yang Dilakukan

### 1. Repository Update (`src/modules/employees/postgre_repository.js`)

#### ✅ Method `getEmployees()` - Updated
Menambahkan LEFT JOIN untuk mengambil data relasi:
```javascript
const baseQuery = this.knex(this.tableName)
  .leftJoin('titles', 'employees.title_id', 'titles.title_id')
  .leftJoin('departments', 'titles.department_id', 'departments.department_id')
  .leftJoin('companies', 'departments.company_id', 'companies.company_id')
  .select(
    'employees.*',
    'titles.title_name',
    'departments.department_name',
    'companies.company_name'
  )
```

#### ✅ Method `getEmployeeById()` - Updated
Menambahkan LEFT JOIN yang sama untuk konsistensi data:
```javascript
const [employee] = await this.knex(this.tableName)
  .leftJoin('titles', 'employees.title_id', 'titles.title_id')
  .leftJoin('departments', 'titles.department_id', 'departments.department_id')
  .leftJoin('companies', 'departments.company_id', 'companies.company_id')
  .select(
    'employees.*',
    'titles.title_name',
    'departments.department_name',
    'companies.company_name'
  )
  .where('employees.employee_id', id)
  .where('employees.is_delete', false)
```

#### ✅ Method `getEmployeesByTitleId()` - Updated
Menambahkan LEFT JOIN untuk endpoint berdasarkan title ID.

### 2. Handler Update (`src/modules/employees/handler.js`)

#### ✅ `createEmployee()` - Updated
Setelah membuat employee, mengambil data lengkap dengan relasi:
```javascript
const employee = await employeesRepository.createEmployee(employeeData)

// Ambil data employee lengkap dengan relasi setelah dibuat
const employeeWithRelations = await employeesRepository.getEmployeeById(employee.employee_id)

return successResponse(res, employeeWithRelations, 'Employee created successfully', 201)
```

#### ✅ `updateEmployee()` - Updated
Setelah update employee, mengambil data lengkap dengan relasi:
```javascript
await employeesRepository.updateEmployee(id, updateData)

// Ambil data employee lengkap dengan relasi setelah diupdate
const employeeWithRelations = await employeesRepository.getEmployeeById(id)

return successResponse(res, employeeWithRelations, 'Employee updated successfully')
```

### 3. Swagger Schema Update (`src/static/schema/employees.json`)

#### ✅ `SchemaResponseEmployees` - Updated
Menambahkan field baru dalam response schema:
```json
{
  "title_name": {
    "type": "string",
    "description": "Title name from titles table"
  },
  "department_name": {
    "type": "string", 
    "description": "Department name from departments table"
  },
  "company_name": {
    "type": "string",
    "description": "Company name from companies table"
  }
}
```

### 4. Routes Fix (`src/routes/V1/index.js`)
✅ Menambahkan kembali routing untuk employees yang terhapus.

## Struktur Relasi Database
```
employees -> title_id -> titles -> department_id -> departments -> company_id -> companies
```

- **employees.title_id** → **titles.title_id**
- **titles.department_id** → **departments.department_id**  
- **departments.company_id** → **companies.company_id**

## Response Format Baru

### POST /api/employees/get
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "data": [
      {
        "employee_id": "uuid",
        "employee_name": "A Fuad Hassan",
        "employee_email": "email@example.com",
        "title_id": "uuid",
        "title_name": "Senior Sales",          // ✅ NEW
        "department_name": "Sales",             // ✅ NEW
        "company_name": "IEC",                  // ✅ NEW
        "created_at": "2025-09-17T15:41:08.709Z",
        // ... other fields
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 2,
      "total": 1004,
      "total_pages": 502,
      "has_next_page": true,
      "has_prev_page": false
    }
  },
  "timestamp": "2025-09-18T06:48:56.426Z"
}
```

### POST /api/employees/create
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "employee_id": "a38f1829-c72b-4e80-a8b2-83d0c25f1461",
    "employee_name": "Test Employee",
    "employee_email": "test@example.com",
    "title_id": "444845aa-f77f-4093-99bd-cd552a05f702",
    "title_name": "Senior Sales",              // ✅ NEW
    "department_name": "Sales",                 // ✅ NEW
    "company_name": "IEC",                      // ✅ NEW
    "created_at": "2025-09-18T06:49:04.889Z",
    "created_by": "15baf47d-4a61-4062-b230-ea2e6a76e503",
    // ... other fields
  },
  "timestamp": "2025-09-18T06:49:04.975Z"
}
```

## Testing Results

### ✅ POST /employees/get - SUCCESS
- Response berhasil menampilkan `title_name`, `department_name`, `company_name`
- Pagination bekerja dengan baik
- Filter dan sorting tetap berfungsi

### ✅ POST /employees/create - SUCCESS  
- Employee berhasil dibuat
- Response menampilkan data lengkap dengan relasi
- Data relasi otomatis ter-populate berdasarkan `title_id`

### ✅ Endpoint Lain
- GET `/employees/:id` - Otomatis mendapat relasi data
- PUT `/employees/:id` - Response update dengan relasi data
- GET `/employees/title/:titleId` - Otomatis mendapat relasi data

## Performance Considerations

### ✅ Optimasi Query
- Menggunakan LEFT JOIN untuk menghindari kehilangan data employee
- Count query untuk pagination terpisah tanpa JOIN (lebih cepat)
- Index pada foreign key sudah ada untuk performa optimal

### ✅ Backward Compatibility
- Semua field lama tetap ada
- Hanya menambahkan field baru, tidak menghapus
- API contract tetap konsisten

## Curl Test Examples

### Test GET Employees
```bash
curl -X POST http://localhost:9518/api/employees/get \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"page": 1, "limit": 2}'
```

### Test CREATE Employee  
```bash
curl -X POST http://localhost:9518/api/employees/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_name": "Test Employee", 
    "employee_email": "test@example.com", 
    "title_id": "444845aa-f77f-4093-99bd-cd552a05f702"
  }'
```

## Summary
✅ **Semua endpoint employees sekarang menampilkan:**
- `title_name` - Nama jabatan dari tabel titles
- `department_name` - Nama departemen dari tabel departments  
- `company_name` - Nama perusahaan dari tabel companies

✅ **Performa tetap optimal** dengan penggunaan LEFT JOIN dan optimasi query count

✅ **Swagger documentation** sudah diupdate dengan field baru

✅ **Backward compatibility** terjaga, tidak ada breaking changes
