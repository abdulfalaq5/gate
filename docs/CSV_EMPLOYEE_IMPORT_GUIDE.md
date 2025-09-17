# Panduan Import Data Karyawan dari CSV

Dokumen ini menjelaskan cara mengimpor data karyawan dari file CSV ke dalam sistem database SSO.

## 📋 Ringkasan Implementasi

Berdasarkan spesifikasi yang diberikan, telah dibuat sistem import data karyawan dengan mapping sebagai berikut:

### Mapping Kolom CSV ke Database

| Kolom CSV | Target Database | Keterangan |
|-----------|----------------|------------|
| `NAMA` | `employees.employee_name` | Nama karyawan |
| `As Ochart` | `companies.company_name` | Nama perusahaan (ambil company_id untuk departments) |
| `Segmentasi` | `departments.department_segmentasi` | Segmentasi departemen |
| `Island` | `islands.island_name` | Nama pulau (ambil island_id untuk employees) |
| `Dept` | `departments.department_name` | Nama departemen (ambil department_id untuk employees) |
| `Job Title` | `titles.title_name` | Jabatan (ambil title_id untuk employees) |
| `Phone No` | `employees.employee_phone` | Nomor telepon |
| `Gender` | `genders.gender_name` | Jenis kelamin (ambil gender_id untuk employees) |
| `Office Number` | `employees.employee_office_number` | Nomor kantor |
| `E-mail` | `employees.employee_email` | Email karyawan |
| `Address` | `employees.employee_address` | Alamat karyawan |
| `Exmail account` | `employees.employee_exmail_account` + `users.user_email` | Email resmi + akun user |
| `Channel` | `employees.employee_channel` | Channel komunikasi |
| `Activation Status` | `employees.employee_activation_status` | Status aktivasi |
| `Disabled` | `employees.employee_disabled` | Status disable |
| `WeChat Workplace` | `employees.employee_wechat_workplace` | WeChat workplace |

## 🗄️ Migrasi Database

### Migrasi yang Dibuat

1. **`20250101000026_create_islands_table.js`**
   - Membuat tabel `islands` dengan kolom:
     - `island_id` (UUID, Primary Key)
     - `island_name` (String, Unique)
     - Kolom audit standard (created_at, updated_at, dll)

2. **`20250101000027_update_departments_add_segmentasi.js`**
   - Menambah kolom `department_segmentasi` ke tabel `departments`

3. **`20250101000028_update_employees_add_island_and_phone.js`**
   - Menambah kolom `island_id` (Foreign Key ke islands)
   - Menambah kolom `employee_phone`

### Struktur Tabel yang Sudah Ada

- ✅ `companies` - Tabel perusahaan
- ✅ `departments` - Tabel departemen (ditambah kolom segmentasi)
- ✅ `titles` - Tabel jabatan
- ✅ `employees` - Tabel karyawan (ditambah kolom island_id dan phone)
- ✅ `users` - Tabel pengguna
- ✅ `genders` - Tabel jenis kelamin
- ✅ `islands` - Tabel pulau (baru dibuat)

## 📁 Seeder yang Dibuat

### 1. Seeder Utama
**File:** `src/repository/postgres/seeders/0014_clean_employee_data_seeder.js`

Seeder ini mengimpor data karyawan dari CSV dengan fitur:
- ✅ **Validasi Duplikat**: Mencegah duplikasi data karyawan dan user
- ✅ **Auto-Create Entities**: Otomatis membuat entitas yang belum ada (company, department, title, gender, island)
- ✅ **Error Handling**: Penanganan error yang komprehensif
- ✅ **Progress Tracking**: Menampilkan progress import
- ✅ **Caching**: Menggunakan cache untuk menghindari query berulang

### 2. Script Generator
**File:** `scripts/regenerate-clean-seeder.js`

Script untuk menghasilkan seeder dari data CSV dengan:
- Parsing CSV yang robust
- Escape karakter khusus
- Validasi data

## 🔧 Cara Menjalankan

### 1. Jalankan Migrasi
```bash
npm run migrate
```

### 2. Jalankan Seeder
```bash
knex --knexfile src/knexfile.js seed:run --specific=0014_clean_employee_data_seeder.js
```

### 3. Generate Seeder Baru (Opsional)
```bash
node scripts/regenerate-clean-seeder.js
```

## 📊 Hasil Import

Setelah menjalankan seeder, sistem akan:

1. **Membuat entitas baru** jika belum ada:
   - Companies berdasarkan kolom "As Ochart"
   - Departments berdasarkan kolom "Dept"
   - Titles berdasarkan kolom "Job Title"
   - Genders berdasarkan kolom "Gender"
   - Islands berdasarkan kolom "Island"

2. **Membuat records karyawan** di tabel `employees`

3. **Membuat akun user** di tabel `users` dengan:
   - Email dari kolom "Exmail account"
   - Password default: `QwerMSI2025!`
   - Username dari kolom "Account" atau "Alias"

## 🔒 Validasi dan Keamanan

### Validasi Duplikat
- Email karyawan (employee_email)
- Email user (user_email)
- Nama perusahaan, departemen, jabatan, gender, pulau

### Keamanan
- Password di-hash menggunakan bcrypt
- Validasi input untuk mencegah SQL injection
- Soft delete untuk semua entitas

## 📝 Log dan Monitoring

Seeder menghasilkan log detail:
```
🌱 Starting Clean Employee Data Seeder...
📊 Processing 6 employee records from CSV...
📋 Using role: Super Admin
🏝️  Created island: Java
🏭 Created department: SFCC (Segmentasi: G4-SFCC)
💼 Created title: Finance Controller Supervisor
📈 Progress: 6/6 employees processed

📈 Import Summary:
✅ Successfully processed: 6 employees
👥 Users created: 6
⚠️  Skipped: 0 employees
```

## 🚀 Penggunaan untuk Data Lengkap

Untuk mengimpor semua 682 data karyawan:

1. Pastikan file CSV lengkap tersedia
2. Update script generator untuk membaca file CSV lengkap
3. Generate seeder baru
4. Jalankan seeder

## ⚠️ Catatan Penting

- Seeder menggunakan role "Employee" sebagai default, fallback ke role yang tersedia
- Kolom yang kosong di CSV akan diisi dengan NULL di database
- Progress ditampilkan setiap 50 records untuk data besar
- Error handling mencegah seeder berhenti jika ada data bermasalah

## 🔍 Troubleshooting

### Error "No roles found"
Pastikan tabel `roles` memiliki data sebelum menjalankan seeder.

### Error "No companies found"
Pastikan tabel `companies` memiliki minimal satu company sebagai fallback.

### Syntax Error di Seeder
Gunakan script `regenerate-clean-seeder.js` untuk membuat seeder dengan proper escaping.

## 📚 File Terkait

- `src/repository/postgres/migrations/20250101000026_create_islands_table.js`
- `src/repository/postgres/migrations/20250101000027_update_departments_add_segmentasi.js`
- `src/repository/postgres/migrations/20250101000028_update_employees_add_island_and_phone.js`
- `src/repository/postgres/seeders/0014_clean_employee_data_seeder.js`
- `scripts/regenerate-clean-seeder.js`
- `scripts/full-csv-employee-seeder.js`
