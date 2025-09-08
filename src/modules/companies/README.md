# Companies Module

Module untuk mengelola data perusahaan dalam sistem SSO.

## Fitur

- ✅ **CRUD Operations**: Create, Read, Update, Delete perusahaan
- ✅ **Hierarchical Structure**: Dukungan struktur perusahaan bertingkat (parent-child)
- ✅ **Pagination & Filtering**: Pagination dengan filter berdasarkan nama, alamat, email
- ✅ **Search**: Pencarian berdasarkan nama perusahaan, alamat, atau email
- ✅ **Statistics**: Statistik perusahaan (total, dengan parent, tanpa parent)
- ✅ **JWT Authentication**: Proteksi endpoint dengan JWT
- ✅ **Validation**: Validasi input yang komprehensif
- ✅ **Soft Delete**: Penghapusan data dengan soft delete

## Database Schema

### Tabel: companies

| Column | Type | Description |
|--------|------|-------------|
| company_id | uuid | Primary key |
| company_name | string(100) | Nama perusahaan (required) |
| company_parent_id | uuid | ID perusahaan induk (optional) |
| company_address | text | Alamat perusahaan |
| company_email | string(100) | Email perusahaan |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diupdate |
| created_by | uuid | User yang membuat |
| updated_by | uuid | User yang mengupdate |
| deleted_at | timestamp | Waktu dihapus |
| deleted_by | uuid | User yang menghapus |
| is_delete | boolean | Flag soft delete |

## API Endpoints

### Authentication Required
Semua endpoint memerlukan JWT token di header `Authorization: Bearer <token>`

- `GET /api/v1/companies` - Daftar perusahaan dengan pagination
- `GET /api/v1/companies/:id` - Detail perusahaan
- `POST /api/v1/companies` - Buat perusahaan baru
- `PUT /api/v1/companies/:id` - Update perusahaan
- `DELETE /api/v1/companies/:id` - Hapus perusahaan (soft delete)
- `GET /api/v1/companies/hierarchy` - Struktur hierarki perusahaan
- `GET /api/v1/companies/stats` - Statistik perusahaan

## Query Parameters

### GET /api/v1/companies
- `page` (number): Halaman (default: 1)
- `limit` (number): Jumlah data per halaman (default: 10)
- `search` (string): Pencarian berdasarkan nama, alamat, atau email
- `company_parent_id` (uuid): Filter berdasarkan perusahaan induk
- `is_delete` (boolean): Filter berdasarkan status delete (default: false)

## Request/Response Examples

### Create Company
```json
POST /api/v1/companies
{
  "company_name": "PT. Example Company",
  "company_parent_id": "123e4567-e89b-12d3-a456-426614174000",
  "company_address": "Jl. Example No. 123, Jakarta",
  "company_email": "info@example.com"
}
```

### Response
```json
{
  "success": true,
  "message": "Company created successfully",
  "data": {
    "company_id": "123e4567-e89b-12d3-a456-426614174000",
    "company_name": "PT. Example Company",
    "company_parent_id": "123e4567-e89b-12d3-a456-426614174000",
    "company_address": "Jl. Example No. 123, Jakarta",
    "company_email": "info@example.com",
    "created_at": "2023-01-01T00:00:00.000Z",
    "created_by": "123e4567-e89b-12d3-a456-426614174000"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Validation Rules

### Create Company
- `company_name`: Required, min 2 characters, max 100 characters
- `company_parent_id`: Optional, must be valid UUID
- `company_address`: Optional, max 500 characters
- `company_email`: Optional, valid email format, max 100 characters

### Update Company
- Semua field optional (minimal 1 field harus diisi)
- Validasi sama dengan create company

## Error Handling

Semua endpoint mengembalikan response dengan format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"],
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

**Common Error Codes:**
- `400`: Bad Request (validation error)
- `401`: Unauthorized (JWT required)
- `404`: Not Found (company not found)
- `500`: Internal Server Error
