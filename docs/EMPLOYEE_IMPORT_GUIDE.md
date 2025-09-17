# Employee Import Module

Module untuk mengimpor data karyawan dari file CSV ke dalam sistem SSO.

## Fitur

- ✅ **CSV Import**: Import data karyawan dari file CSV
- ✅ **User Account Creation**: Otomatis membuat akun user untuk setiap karyawan
- ✅ **Gender Management**: Otomatis membuat gender jika belum ada
- ✅ **Department Hierarchy**: Parsing hierarki departemen dengan pemisah "/"
- ✅ **Company Matching**: Mencocokkan departemen dengan company yang sesuai
- ✅ **Title Management**: Otomatis membuat title jika belum ada di departemen
- ✅ **Duplicate Validation**: Validasi duplikat data karyawan dan user
- ✅ **Error Handling**: Penanganan error yang komprehensif
- ✅ **Template Support**: Template CSV untuk panduan import
- ✅ **JWT Authentication**: Proteksi endpoint dengan JWT
- ✅ **File Validation**: Validasi format dan ukuran file

## Format CSV

### Struktur File CSV
```csv
Name,Account,Alias,Posisi (HR/GM/VP/BOD/PUB),Title,Department,Gender,Mobile,Office Number,E-mail,Address,Exmail account,Channel,Activation Status,Disabled,WeChat Workplace
John Doe,johndoe,John D,HR,HR Manager,Human Resources/HR Department,Male,081234567890,021-12345678,john.doe@company.com,"Jakarta, Indonesia",john.doe@exmail.company.com,john.doe@company.com,Active,FALSE,johndoe_wechat
```

### Kolom yang Diperlukan

| Kolom | Deskripsi | Target Database |
|-------|-----------|----------------|
| **Name** | Nama lengkap karyawan | Digunakan sebagai fallback jika Alias kosong |
| **Account** | Username untuk login | `users.user_name` |
| **Alias** | Nama karyawan yang ditampilkan | `employees.employee_name` |
| **Posisi (HR/GM/VP/BOD/PUB)** | Posisi/level karyawan | Informasi tambahan |
| **Title** | Jabatan/posisi kerja | `titles.title_name` (auto-create) |
| **Department** | Hierarki departemen (dipisah "/") | `departments.department_name` (level terakhir) |
| **Gender** | Jenis kelamin | `genders.gender_name` (auto-create) |
| **Mobile** | Nomor handphone | `employees.employee_mobile` |
| **Office Number** | Nomor telepon kantor | `employees.employee_office_number` |
| **E-mail** | Email karyawan | `employees.employee_email` |
| **Address** | Alamat karyawan | `employees.employee_address` |
| **Exmail account** | Akun email eksternal | `employees.employee_exmail_account` |
| **Channel** | Email untuk login | `users.user_email` |
| **Activation Status** | Status aktivasi | `employees.employee_activation_status` |
| **Disabled** | Status disabled (TRUE/FALSE) | `employees.employee_disabled` |
| **WeChat Workplace** | Akun WeChat | `employees.employee_wechat_workplace` |

## Logika Pemrosesan

### 1. Department Hierarchy Processing
- Departemen dipisahkan dengan tanda "/"
- Mengambil level terakhir sebagai nama departemen
- Mencocokkan dengan company berdasarkan kesamaan nama
- Jika tidak ada company yang cocok, departemen dibuat tanpa company_id

### 2. Gender Management
- Otomatis membuat gender baru jika belum ada di database
- Gender yang umum: Male, Female, Other

### 3. Title Management
- Otomatis membuat title baru jika belum ada di departemen yang sama
- Title terikat dengan departemen tertentu

### 4. User Account Creation
- Setiap karyawan otomatis dibuatkan akun user
- Password default: "QwerMSI2025!" (sama untuk semua user yang diimport)
- Role default: "Employee" (jika ada), atau role pertama yang ditemukan

### 5. Duplicate Prevention
- Cek duplikat berdasarkan `user_name` dan `user_email` untuk users
- Cek duplikat berdasarkan `employee_name` dan `employee_email` untuk employees

## API Endpoints

### Authentication Required
Semua endpoint memerlukan JWT token di header `Authorization: Bearer <token>`

### 1. Get Import Template
```http
GET /api/v1/employees/import/template
Authorization: Bearer <jwt_token>
```

**Response:**
- File CSV template yang dapat didownload
- Content-Type: text/csv
- Content-Disposition: attachment

### 2. Import Employee Data
```http
POST /api/v1/employees/import
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: [CSV file]
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Employee import completed",
  "data": {
    "summary": {
      "total": 4,
      "created": 4,
      "skipped": 0,
      "errors": 0
    },
    "results": [
      {
        "status": "created",
        "data": {
          "employee_id": "uuid",
          "user_id": "uuid",
          "name": "John D",
          "account": "johndoe",
          "email": "john.doe@company.com"
        },
        "message": "Employee and user created successfully"
      }
    ]
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Invalid CSV structure",
  "details": [
    "Missing required columns: Name, Account"
  ]
}
```

## Persiapan Database

### 1. Jalankan Migrasi
```bash
# Migrasi untuk tabel genders
npx knex migrate:up --knexfile src/knexfile.js 20250101000013_create_genders_table.js

# Migrasi untuk update tabel employees
npx knex migrate:up --knexfile src/knexfile.js 20250101000014_update_employees_table.js
```

### 2. Jalankan Seeder (Opsional)
```bash
# Seeder untuk data gender dasar
npx knex seed:run --knexfile src/knexfile.js --specific 0004_genders_seeder.js
```

## Testing

### 1. Menggunakan Script Test
```bash
# Jalankan test otomatis
cd test
./test-employee-import-api.sh
```

### 2. Manual Testing dengan cURL

**Get Template:**
```bash
curl -X GET "http://localhost:9518/api/v1/employees/import/template" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o employee_template.csv
```

**Import Data:**
```bash
curl -X POST "http://localhost:9518/api/v1/employees/import" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@sample_employee_import.csv"
```

## Contoh Data

File `sample_employee_import.csv` sudah disediakan dengan contoh data:

```csv
Name,Account,Alias,Posisi (HR/GM/VP/BOD/PUB),Title,Department,Gender,Mobile,Office Number,E-mail,Address,Exmail account,Channel,Activation Status,Disabled,WeChat Workplace
John Doe,johndoe,John D,HR,HR Manager,Human Resources/HR Department,Male,081234567890,021-12345678,john.doe@company.com,"Jakarta, Indonesia",john.doe@exmail.company.com,john.doe@company.com,Active,FALSE,johndoe_wechat
Jane Smith,janesmith,Jane S,GM,General Manager,Operations/Management,Female,081234567891,021-12345679,jane.smith@company.com,"Bandung, Indonesia",jane.smith@exmail.company.com,jane.smith@company.com,Active,FALSE,janesmith_wechat
```

## Error Handling

### Common Errors

1. **Invalid CSV Structure**
   - Status: 400
   - Cause: Missing required columns
   - Solution: Use template and ensure all columns are present

2. **File Upload Error**
   - Status: 400
   - Cause: No file uploaded or invalid file type
   - Solution: Upload valid CSV file

3. **Duplicate Data**
   - Status: Skip with message
   - Cause: Employee or user already exists
   - Solution: Remove duplicates from CSV or update existing records manually

4. **Database Error**
   - Status: 500
   - Cause: Database connection or constraint issues
   - Solution: Check database connection and constraints

## Security Considerations

1. **Authentication**: Semua endpoint dilindungi JWT
2. **File Validation**: Hanya menerima file CSV dengan ukuran maksimal 10MB
3. **SQL Injection**: Menggunakan parameterized queries
4. **File Cleanup**: File upload otomatis dihapus setelah proses selesai

## Performance Notes

- Import dilakukan secara sequential untuk menjaga konsistensi data
- Untuk file besar (>1000 records), pertimbangkan untuk membagi menjadi beberapa file
- Database transaction digunakan untuk memastikan data integrity

## Troubleshooting

### 1. Migration Issues
```bash
# Check migration status
npx knex migrate:status --knexfile src/knexfile.js

# Rollback if needed
npx knex migrate:rollback --knexfile src/knexfile.js
```

### 2. Permission Issues
```bash
# Ensure uploads directory exists and writable
mkdir -p uploads/temp
chmod 755 uploads/temp
```

### 3. CSV Format Issues
- Pastikan encoding file adalah UTF-8
- Gunakan double quotes untuk field yang mengandung koma
- Pastikan tidak ada baris kosong di akhir file

## Future Enhancements

- [ ] Bulk import dengan batch processing
- [ ] Import validation preview sebelum eksekusi
- [ ] Import history dan rollback functionality
- [ ] Email notification setelah import selesai
- [ ] Excel file support (.xlsx)
- [ ] Custom field mapping
