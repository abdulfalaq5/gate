# Products Module

Module untuk mengelola data produk dengan fitur lengkap CRUD, upload gambar, export/import Excel, dan statistik.

## Fitur

- ✅ **CRUD Operations**: Create, Read, Update, Delete produk
- ✅ **Pagination & Filtering**: Pagination dengan filter berdasarkan kategori, brand, status aktif
- ✅ **Search**: Pencarian berdasarkan nama, deskripsi, atau SKU
- ✅ **Sorting**: Pengurutan berdasarkan berbagai field
- ✅ **Image Upload**: Upload gambar produk ke MinIO
- ✅ **Excel Export/Import**: Export data ke Excel dan import dari Excel
- ✅ **Statistics**: Statistik produk (total, nilai, kategori, brand, dll)
- ✅ **JWT Authentication**: Proteksi endpoint dengan JWT
- ✅ **Validation**: Validasi input yang komprehensif
- ✅ **Swagger Documentation**: Dokumentasi API lengkap

## Struktur File

```
src/modules/products/
├── index.js              # Routes definition
├── handler.js            # Business logic
├── validation.js         # Input validation
├── postgre_repository.js # Database operations
└── column.js            # Column definitions
```

## Database Schema

### Tabel: products

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | string | Nama produk (required) |
| description | text | Deskripsi produk |
| price | decimal(15,2) | Harga produk (required) |
| stock | integer | Stok produk |
| sku | string | Stock Keeping Unit (unique) |
| category | string | Kategori produk |
| brand | string | Brand produk |
| images | json | Array URL gambar |
| specifications | json | Spesifikasi produk |
| is_active | boolean | Status aktif |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diupdate |
| created_by | uuid | User yang membuat |
| updated_by | uuid | User yang mengupdate |

## API Endpoints

### Public Endpoints (No Authentication)

- `GET /api/v1/products/categories` - Daftar kategori
- `GET /api/v1/products/brands` - Daftar brand
- `GET /api/v1/products/statistics` - Statistik produk

### Protected Endpoints (JWT Required)

#### CRUD Operations
- `GET /api/v1/products` - Daftar produk dengan pagination & filter
- `GET /api/v1/products/:id` - Detail produk
- `POST /api/v1/products` - Buat produk baru
- `PUT /api/v1/products/:id` - Update produk
- `DELETE /api/v1/products/:id` - Soft delete produk
- `DELETE /api/v1/products/:id/hard` - Hard delete produk

#### Stock Management
- `PATCH /api/v1/products/:id/stock` - Update stok produk

#### File Operations
- `POST /api/v1/products/upload-image` - Upload gambar produk
- `GET /api/v1/products/export/excel` - Export ke Excel
- `POST /api/v1/products/import/excel` - Import dari Excel

## Query Parameters

### GET /api/v1/products

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | integer | Halaman | 1 |
| limit | integer | Item per halaman | 10 |
| search | string | Pencarian | - |
| category | string | Filter kategori | - |
| brand | string | Filter brand | - |
| is_active | string | Filter status aktif | - |
| sort_by | string | Field untuk sorting | created_at |
| sort_order | string | Urutan sorting (asc/desc) | desc |

## Request/Response Examples

### Create Product

**Request:**
```json
POST /api/v1/products
{
  "name": "iPhone 14 Pro",
  "description": "Latest iPhone with advanced camera system",
  "price": 999.99,
  "stock": 50,
  "sku": "IPH14P-256-BLK",
  "category": "Electronics",
  "brand": "Apple",
  "specifications": {
    "color": "Space Black",
    "storage": "256GB",
    "screen_size": "6.1 inches"
  },
  "is_active": true
}
```

**Response:**
```json
{
  "status": true,
  "message": "Product created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "iPhone 14 Pro",
    "description": "Latest iPhone with advanced camera system",
    "price": 999.99,
    "stock": 50,
    "sku": "IPH14P-256-BLK",
    "category": "Electronics",
    "brand": "Apple",
    "images": [],
    "specifications": {
      "color": "Space Black",
      "storage": "256GB",
      "screen_size": "6.1 inches"
    },
    "is_active": true,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

### Get Products with Filter

**Request:**
```
GET /api/v1/products?page=1&limit=10&search=iPhone&category=Electronics&sort_by=price&sort_order=asc
```

**Response:**
```json
{
  "status": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "iPhone 14 Pro",
        "description": "Latest iPhone with advanced camera system",
        "price": 999.99,
        "stock": 50,
        "sku": "IPH14P-256-BLK",
        "category": "Electronics",
        "brand": "Apple",
        "images": [],
        "specifications": {},
        "is_active": true,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "total_pages": 1
    }
  }
}
```

## Validation Rules

### Create Product
- `name`: Required, string, 2-100 characters
- `price`: Required, numeric, minimum 0
- `description`: Optional, string, max 500 characters
- `stock`: Optional, integer, minimum 0
- `sku`: Optional, string, 3-50 characters, unique
- `category`: Optional, string, max 50 characters
- `brand`: Optional, string, max 50 characters
- `images`: Optional, array
- `specifications`: Optional, object
- `is_active`: Optional, boolean

### Update Product
- Semua field optional (minimal 1 field harus diisi)
- Validasi sama dengan create product

## File Upload

### Upload Image
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Fields**:
  - `product_id`: UUID (required)
  - `image`: File (required, max 10MB)
- **Supported formats**: JPEG, PNG, GIF, WebP

### Excel Export/Import

#### Export
- **Method**: GET
- **Response**: Excel file (.xlsx)
- **Columns**: ID, Name, Description, Price, Stock, SKU, Category, Brand, Images Count, Is Active, Created At, Updated At

#### Import
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Required columns**: Name, Price
- **Optional columns**: Description, Stock, SKU, Category, Brand, Is Active

## Error Handling

Semua endpoint mengembalikan response dengan format:

```json
{
  "status": false,
  "message": "Error message",
  "data": null
}
```

**Common Error Codes:**
- `400`: Bad Request (validation error)
- `401`: Unauthorized (JWT required)
- `404`: Not Found (product not found)
- `500`: Internal Server Error

## Database Migration

```bash
# Run migration
npm run migrate

# Run seeder (optional)
knex seed:run --cwd=src
```

## Testing

### Manual Testing dengan cURL

```bash
# Get products (with JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:3000/api/v1/products?page=1&limit=10"

# Create product
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Product","price":99.99}' \
     "http://localhost:3000/api/v1/products"

# Upload image
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -F "product_id=PRODUCT_UUID" \
     -F "image=@/path/to/image.jpg" \
     "http://localhost:3000/api/v1/products/upload-image"
```

## Swagger Documentation

Akses dokumentasi lengkap di: `http://localhost:3000/documentation`

## Notes

- Semua endpoint yang memerlukan authentication harus menyertakan header `Authorization: Bearer <JWT_TOKEN>`
- File upload dibatasi maksimal 10MB
- Excel import mendukung format .xlsx dan .xls
- Soft delete mengubah `is_active` menjadi `false`
- Hard delete menghapus record secara permanen
- Statistik hanya menghitung produk yang aktif (`is_active = true`)
