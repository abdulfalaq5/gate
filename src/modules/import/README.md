# Import Master Data Module

Module untuk mengimpor master data dari file CSV ke dalam sistem SSO.

## Fitur

- ✅ **CSV Import**: Import data dari file CSV
- ✅ **Master Data Support**: Companies, Departments, Titles
- ✅ **Duplicate Validation**: Validasi duplikat data
- ✅ **Hierarchical Import**: Import dengan struktur hierarki
- ✅ **Error Handling**: Penanganan error yang komprehensif
- ✅ **Template Support**: Template CSV untuk panduan
- ✅ **JWT Authentication**: Proteksi endpoint dengan JWT
- ✅ **File Validation**: Validasi format dan ukuran file

## Format CSV

### Struktur File CSV
```csv
Companies,Departements,Titles
PT. Example Company,IT Department,Software Developer
PT. Example Company,Human Resources,HR Manager
PT. Example Company,Finance,Accountant
```

### Kolom yang Diperlukan
- **Companies**: Nama perusahaan
- **Departements**: Nama departemen
- **Titles**: Nama jabatan/posisi

## API Endpoints

### Authentication Required
Semua endpoint memerlukan JWT token di header `Authorization: Bearer <token>`

- `GET /api/v1/import/template` - Dapatkan template CSV
- `POST /api/v1/import/master-data` - Import master data dari CSV

## Request/Response Examples

### Get Import Template
```http
GET /api/v1/import/template
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Import template retrieved successfully",
  "data": {
    "headers": ["Companies", "Departements", "Titles"],
    "sampleData": [
      ["PT. Example Company", "Human Resources", "HR Manager"],
      ["PT. Example Company", "IT Department", "Software Developer"],
      ["PT. Example Company", "Finance", "Accountant"]
    ],
    "instructions": [
      "First column: Company names",
      "Second column: Department names", 
      "Third column: Title/Position names",
      "Each row represents a company-department-title relationship",
      "Empty cells will be skipped",
      "Duplicate data will be rejected"
    ]
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Import Master Data
```http
POST /api/v1/import/master-data
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

csvFile: [CSV_FILE]
```

**Success Response:**
```json
{
  "success": true,
  "message": "Import completed. 12 records created, 0 errors",
  "data": {
    "summary": {
      "totalProcessed": 12,
      "successCount": 12,
      "errorCount": 0
    },
    "details": [
      {
        "type": "company",
        "name": "PT. Teknologi Maju",
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "status": "created"
      },
      {
        "type": "department",
        "name": "IT Department",
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "status": "created"
      },
      {
        "type": "title",
        "name": "Software Developer",
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "status": "created"
      }
    ]
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

**Error Response (Duplicate Data):**
```json
{
  "success": false,
  "message": "Duplicate data found",
  "errors": [
    {
      "type": "company",
      "name": "PT. Example Company",
      "row": 1,
      "message": "Company \"PT. Example Company\" already exists"
    }
  ],
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Validasi

### File Validation
- ✅ Format file harus CSV (.csv)
- ✅ Ukuran file maksimal 5MB
- ✅ File tidak boleh kosong
- ✅ Harus memiliki kolom yang diperlukan

### Data Validation
- ✅ **Duplicate Check**: Cek duplikat berdasarkan nama
- ✅ **Required Fields**: Kolom Companies, Departements, Titles harus ada
- ✅ **Empty Values**: Cell kosong akan diabaikan
- ✅ **Trim Whitespace**: Spasi di awal/akhir akan dihapus

### Business Logic
- ✅ **Hierarchical Import**: 
  - Companies → Departments → Titles
  - Setiap department akan dikaitkan dengan company pertama
  - Setiap title akan dikaitkan dengan department pertama
- ✅ **Unique Data**: Data duplikat akan ditolak
- ✅ **Transaction Safety**: Jika ada error, tidak ada data yang tersimpan

## Error Handling

### Common Error Codes
- `400`: Bad Request (validation error, duplicate data)
- `401`: Unauthorized (JWT required)
- `413`: Payload Too Large (file too big)
- `415`: Unsupported Media Type (not CSV file)
- `500`: Internal Server Error

### Error Types
1. **File Format Error**: File bukan CSV
2. **File Size Error**: File terlalu besar (>5MB)
3. **Structure Error**: Kolom yang diperlukan tidak ada
4. **Duplicate Error**: Data sudah ada di database
5. **Database Error**: Error saat menyimpan ke database

## Usage Examples

### cURL Example
```bash
# Get template
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:3000/api/v1/import/template"

# Import CSV
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -F "csvFile=@sample_master_data.csv" \
     "http://localhost:3000/api/v1/import/master-data"
```

### JavaScript Example
```javascript
const formData = new FormData()
formData.append('csvFile', csvFile)

const response = await fetch('/api/v1/import/master-data', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})

const result = await response.json()
console.log(result)
```

## Notes

- File CSV akan dihapus otomatis setelah proses import selesai
- Import dilakukan secara berurutan: Companies → Departments → Titles
- Jika ada error pada salah satu tahap, proses akan dihentikan
- Semua data yang berhasil diimport akan memiliki audit trail (created_by)
- File upload disimpan sementara di folder `uploads/temp/`
