# Import Master Data - Panduan Lengkap

## 🎯 **Overview**

Fitur Import Master Data memungkinkan Anda untuk mengimpor data perusahaan, departemen, dan jabatan dari file CSV ke dalam sistem SSO. Fitur ini dilengkapi dengan validasi duplikat dan penanganan error yang komprehensif.

## 📋 **Alur Data**

Berdasarkan struktur database yang telah dibuat:

```
Companies (Perusahaan)
├── Departments (Departemen) 
    ├── Titles (Jabatan)
        ├── Employees (Karyawan)
            └── Users (User Account)
```

### **Hierarki Import:**
1. **Companies** → Import pertama, menjadi parent
2. **Departments** → Dikaitkan dengan company pertama
3. **Titles** → Dikaitkan dengan department pertama

## 📁 **Format CSV**

### **Struktur File:**
```csv
Companies,Departements,Titles
PT. Teknologi Maju,IT Department,Software Developer
PT. Teknologi Maju,IT Department,Senior Developer
PT. Teknologi Maju,Human Resources,HR Manager
PT. Teknologi Maju,Finance,Accountant
```

### **Aturan Format:**
- ✅ Header harus: `Companies,Departements,Titles`
- ✅ Case sensitive untuk header
- ✅ Data kosong akan diabaikan
- ✅ Spasi di awal/akhir akan di-trim
- ✅ Duplikat dalam file akan di-unique

## 🔧 **Setup & Installation**

### **Dependencies yang Diperlukan:**
```bash
npm install csv-parser multer
```

### **Folder Structure:**
```
uploads/
└── temp/          # Temporary file storage
```

### **Environment Variables:**
Tidak ada environment variable khusus yang diperlukan untuk fitur import.

## 🚀 **API Endpoints**

### **1. Get Import Template**
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

### **2. Import Master Data**
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

## ✅ **Validasi & Error Handling**

### **File Validation:**
- ✅ Format file harus CSV (.csv)
- ✅ Ukuran file maksimal 5MB
- ✅ File tidak boleh kosong
- ✅ Harus memiliki kolom yang diperlukan

### **Data Validation:**
- ✅ **Duplicate Check**: Cek duplikat berdasarkan nama
- ✅ **Required Fields**: Kolom Companies, Departements, Titles harus ada
- ✅ **Empty Values**: Cell kosong akan diabaikan
- ✅ **Trim Whitespace**: Spasi di awal/akhir akan dihapus

### **Error Responses:**

#### **Duplicate Data Error:**
```json
{
  "success": false,
  "message": "Duplicate data found",
  "errors": [
    {
      "type": "company",
      "name": "PT. Example Company",
      "message": "Company \"PT. Example Company\" already exists"
    }
  ],
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

#### **File Format Error:**
```json
{
  "success": false,
  "message": "Invalid CSV structure",
  "errors": [
    "Missing required column: Companies",
    "Missing required column: Departements"
  ],
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## 🧪 **Testing**

### **Manual Testing dengan cURL:**

#### **1. Get Template:**
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/v1/import/template"
```

#### **2. Import CSV:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "csvFile=@sample_master_data.csv" \
  "http://localhost:3000/api/v1/import/master-data"
```

#### **3. Verify Import:**
```bash
# Check companies
curl -X GET \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/v1/companies"

# Check departments
curl -X GET \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/v1/departments"

# Check titles
curl -X GET \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/v1/titles"
```

### **Automated Testing:**
```bash
# Jalankan script testing
./test_import_api.sh
```

## 📊 **Business Logic**

### **Import Process:**
1. **Parse CSV** → Validasi struktur file
2. **Extract Data** → Ambil data dari kolom yang diperlukan
3. **Check Duplicates** → Validasi duplikat untuk setiap jenis data
4. **Import Companies** → Buat perusahaan terlebih dahulu
5. **Import Departments** → Dikaitkan dengan company pertama
6. **Import Titles** → Dikaitkan dengan department pertama
7. **Cleanup** → Hapus file temporary
8. **Response** → Return hasil import

### **Data Relationships:**
- Setiap **Department** akan dikaitkan dengan **Company** pertama yang dibuat
- Setiap **Title** akan dikaitkan dengan **Department** pertama yang dibuat
- Jika ada multiple companies/departments, hanya yang pertama yang digunakan untuk relasi

## 🔒 **Security Features**

- ✅ **JWT Authentication**: Semua endpoint memerlukan token
- ✅ **File Validation**: Validasi format dan ukuran file
- ✅ **Input Sanitization**: Sanitasi input data
- ✅ **Temporary Storage**: File hanya disimpan sementara
- ✅ **Auto Cleanup**: File dihapus setelah proses selesai

## 📝 **Notes & Limitations**

### **Current Limitations:**
- Import hanya mendukung 1 company per file
- Department dan Title akan dikaitkan dengan company/department pertama
- Tidak mendukung hierarchical structure dalam 1 file

### **Future Enhancements:**
- Support untuk multiple companies dalam 1 file
- Support untuk hierarchical structure
- Import dengan mapping custom
- Batch import dengan progress tracking

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. "Only CSV files are allowed"**
- Pastikan file memiliki ekstensi .csv
- Pastikan Content-Type adalah text/csv

#### **2. "File too large"**
- Ukuran file maksimal 5MB
- Kompres file atau bagi menjadi beberapa file

#### **3. "Missing required column"**
- Pastikan header: `Companies,Departements,Titles`
- Case sensitive untuk header

#### **4. "Duplicate data found"**
- Data sudah ada di database
- Hapus data yang duplikat dari CSV atau database

#### **5. "Unauthorized"**
- Pastikan JWT token valid
- Pastikan token tidak expired

## 📞 **Support**

Untuk pertanyaan atau masalah dengan fitur import, silakan hubungi tim development atau buat issue di repository.

---

**Import Master Data v1.0** - Complete CSV Import Solution for SSO System
