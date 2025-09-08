# Standard Filter System Documentation

## Overview
Sistem filter standar telah diimplementasikan untuk semua module yang mendukung pagination, sorting, searching, dan filtering dengan konsisten.

## Features

### 1. Pagination
- **Parameter**: `page`, `limit`
- **Default**: page=1, limit=10 (dari constant)
- **Max limit**: 100 records per page
- **Response**: Includes pagination metadata

### 2. Sorting
- **Parameter**: `sort_by`, `sort_order`
- **Default**: `created_at desc`
- **Valid orders**: `asc`, `desc`
- **Security**: Hanya kolom yang diizinkan yang bisa digunakan untuk sorting

### 3. Searching
- **Parameter**: `search` atau `q`
- **Method**: Case-insensitive search menggunakan `ILIKE`
- **Scope**: Hanya kolom yang dikonfigurasi sebagai searchable
- **Logic**: OR search across multiple columns

### 4. Filtering
- **Parameter**: Berdasarkan kolom yang diizinkan
- **Method**: Exact match filtering
- **Security**: Hanya kolom yang dikonfigurasi yang bisa digunakan

### 5. Date Range Filtering
- **Parameter**: `start_date`, `end_date`
- **Format**: ISO date string atau format yang didukung database
- **Column**: Dikonfigurasi per module

## Usage Examples

### Basic Pagination
```bash
curl -X GET "http://localhost:9588/api/v1/menus?page=1&limit=5"
```

### Sorting
```bash
curl -X GET "http://localhost:9588/api/v1/menus?sort_by=menu_name&sort_order=asc"
```

### Searching
```bash
curl -X GET "http://localhost:9588/api/v1/menus?search=dashboard"
```

### Filtering
```bash
curl -X GET "http://localhost:9588/api/v1/menus?menu_name=Dashboard&menu_url=/dashboard"
```

### Date Range
```bash
curl -X GET "http://localhost:9588/api/v1/menus?start_date=2024-01-01&end_date=2024-12-31"
```

### Combined Filters
```bash
curl -X GET "http://localhost:9588/api/v1/menus?page=1&limit=10&sort_by=menu_order&sort_order=asc&search=admin&menu_name=Admin"
```

## Response Format

### Success Response with Pagination
```json
{
  "success": true,
  "message": "Menus retrieved successfully",
  "data": {
    "data": [
      {
        "menu_id": "uuid",
        "menu_name": "Dashboard",
        "menu_url": "/dashboard",
        "menu_icon": "dashboard",
        "menu_order": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "total_pages": 3,
      "has_next_page": true,
      "has_prev_page": false
    }
  }
}
```

## Module Configuration

### Menus Module
- **Allowed Sort Columns**: `menu_name`, `menu_order`, `created_at`, `updated_at`
- **Default Sort**: `menu_order asc`
- **Searchable Columns**: `menu_name`, `menu_url`
- **Allowed Filters**: `menu_name`, `menu_url`, `menu_icon`
- **Date Column**: `created_at`

### Roles Module
- **Allowed Sort Columns**: `role_name`, `created_at`, `updated_at`
- **Default Sort**: `role_name asc`
- **Searchable Columns**: `role_name`
- **Allowed Filters**: `role_name`
- **Date Column**: `created_at`

### Permissions Module
- **Allowed Sort Columns**: `permission_name`, `created_at`, `updated_at`
- **Default Sort**: `permission_name asc`
- **Searchable Columns**: `permission_name`
- **Allowed Filters**: `permission_name`
- **Date Column**: `created_at`

## Implementation Details

### Repository Pattern
Setiap repository memiliki method:
- `findWithFilters(queryParams)` - Untuk pagination dengan filter
- `findWithSimpleFilters(filters)` - Untuk filter sederhana tanpa pagination

### Handler Pattern
Setiap handler menggunakan `parseStandardQuery()` untuk mengkonfigurasi filter sesuai kebutuhan module.

### Utility Functions
- `parseStandardQuery()` - Main function untuk parse semua query parameters
- `applyStandardFilters()` - Apply filters ke query builder
- `formatPaginatedResponse()` - Format response dengan pagination metadata

## Security Features

1. **Column Whitelisting**: Hanya kolom yang dikonfigurasi yang bisa digunakan untuk sorting dan filtering
2. **Input Validation**: Semua parameter di-validate sebelum digunakan
3. **SQL Injection Prevention**: Menggunakan parameterized queries
4. **Rate Limiting**: Dapat dikombinasikan dengan rate limiting middleware

## Error Handling

- Invalid sort columns akan fallback ke default
- Invalid sort order akan fallback ke default
- Empty search terms akan diabaikan
- Invalid date formats akan diabaikan

## Performance Considerations

1. **Indexing**: Pastikan kolom yang sering digunakan untuk sorting dan filtering sudah di-index
2. **Limit Cap**: Maximum 100 records per page untuk mencegah overload
3. **Count Query**: Menggunakan count query terpisah untuk metadata pagination
4. **Query Optimization**: Menggunakan query builder yang efisien

## Migration Guide

Untuk module yang sudah ada:
1. Update repository dengan method `findWithFilters()`
2. Update handler untuk menggunakan `parseStandardQuery()`
3. Test semua endpoint dengan parameter filter
4. Update dokumentasi API

## Future Enhancements

1. **Advanced Filtering**: Support untuk range filters, multiple values
2. **Export Features**: Export filtered data ke CSV/Excel
3. **Caching**: Cache untuk query yang sering digunakan
4. **Analytics**: Track penggunaan filter untuk optimasi
