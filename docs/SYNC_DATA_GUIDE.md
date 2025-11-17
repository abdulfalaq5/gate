# Panduan Sync Data dari CSV

Dokumen ini menjelaskan cara melakukan sync data dari file CSV untuk companies, departments, titles, islands, dan employees.

## 📋 Ringkasan

Fitur sync data memungkinkan Anda untuk:
- ✅ **Sync data secara otomatis** dari CSV setiap minggu sekali
- ✅ **Insert data baru** jika data belum ada
- ✅ **Update data yang sudah ada** jika ada perubahan
- ✅ **Mencegah duplikat** dengan identifikasi unik untuk setiap entitas
- ✅ **Handle perubahan data** seperti employee yang pindah department

## 🔑 Identifikasi Unik untuk Sync

Setiap entitas memiliki identifikasi unik untuk mencegah duplikat:

| Entitas | Identifikasi Unik | Keterangan |
|---------|------------------|------------|
| **Companies** | `company_name` | Nama perusahaan (case-sensitive) |
| **Islands** | `island_name` | Nama pulau (unique constraint) |
| **Departments** | `department_name` + `company_id` | Nama departemen dalam perusahaan tertentu |
| **Titles** | `title_name` + `department_id` | Nama jabatan dalam departemen tertentu |
| **Employees** | `employee_email` | Email karyawan (unique) |

## 📊 Format CSV

### Kolom yang Diperlukan

| Kolom CSV | Target Database | Wajib | Keterangan |
|-----------|----------------|-------|------------|
| `Company Name` | `companies.company_name` | ✅ | Nama perusahaan |
| `Company Address` | `companies.company_address` | ❌ | Alamat perusahaan |
| `Company Email` | `companies.company_email` | ❌ | Email perusahaan |
| `Department Name` | `departments.department_name` | ✅ | Nama departemen |
| `Department Segmentasi` | `departments.department_segmentasi` | ❌ | Segmentasi departemen |
| `Title Name` | `titles.title_name` | ✅ | Nama jabatan |
| `Island Name` | `islands.island_name` | ❌ | Nama pulau |
| `Employee Name` | `employees.employee_name` | ✅ | Nama karyawan |
| `Employee Email` | `employees.employee_email` | ✅ | Email karyawan (unik) |
| `Employee Phone` | `employees.employee_phone` | ❌ | Nomor telepon |
| `Employee Office Number` | `employees.employee_office_number` | ❌ | Nomor kantor |
| `Employee Address` | `employees.employee_address` | ❌ | Alamat karyawan |
| `Employee Exmail Account` | `employees.employee_exmail_account` | ❌ | Akun exmail |
| `Employee Channel` | `employees.employee_channel` | ❌ | Channel komunikasi |
| `Employee Activation Status` | `employees.employee_activation_status` | ❌ | Status aktivasi |
| `Employee Disabled` | `employees.employee_disabled` | ❌ | Status disable (TRUE/FALSE) |
| `Employee WeChat Workplace` | `employees.employee_wechat_workplace` | ❌ | WeChat workplace |

### Contoh CSV

```csv
Company Name,Company Address,Company Email,Department Name,Department Segmentasi,Title Name,Island Name,Employee Name,Employee Email,Employee Phone,Employee Office Number,Employee Address,Employee Exmail Account,Employee Channel,Employee Activation Status,Employee Disabled,Employee WeChat Workplace
PT Example Company,Jl. Example No. 123,info@example.com,Human Resources,HR,HR Manager,Java,John Doe,john.doe@example.com,081234567890,021-12345678,"Jakarta, Indonesia",john.doe@exmail.example.com,john.doe@example.com,Active,FALSE,johndoe_wechat
```

## 🚀 Cara Menggunakan

### 1. Download Template CSV

```bash
GET /api/sync/template
Authorization: Bearer {token}
```

Response akan mengunduh file CSV template yang bisa diisi dengan data Anda.

### 2. Sync Data dari CSV

```bash
POST /api/sync/data
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [CSV file]
```

### 3. Response

```json
{
  "success": true,
  "message": "Data sync completed successfully",
  "data": {
    "summary": {
      "total_rows": 100,
      "companies": {
        "total": 5,
        "created": 2,
        "updated": 3,
        "errors": 0
      },
      "islands": {
        "total": 3,
        "created": 1,
        "existing": 2,
        "errors": 0
      },
      "departments": {
        "total": 10,
        "created": 4,
        "updated": 6,
        "errors": 0
      },
      "titles": {
        "total": 15,
        "created": 5,
        "existing": 10,
        "errors": 0
      },
      "employees": {
        "total": 100,
        "created": 20,
        "updated": 80,
        "errors": 0
      },
      "errors": 0
    },
    "errors": []
  }
}
```

## 🔄 Alur Sync Data

1. **Parse CSV** - Membaca dan memvalidasi struktur CSV
2. **Sync Companies** - Sync perusahaan terlebih dahulu (dibutuhkan untuk departments)
3. **Sync Islands** - Sync pulau (opsional, untuk employees)
4. **Sync Departments** - Sync departemen (membutuhkan company_id)
5. **Sync Titles** - Sync jabatan (membutuhkan department_id)
6. **Sync Employees** - Sync karyawan (membutuhkan title_id)

## ⚠️ Catatan Penting

### Mencegah Duplikat

- ✅ **Companies**: Diidentifikasi berdasarkan `company_name` (case-sensitive)
- ✅ **Islands**: Diidentifikasi berdasarkan `island_name` (unique constraint di database)
- ✅ **Departments**: Diidentifikasi berdasarkan `department_name` + `company_id`
- ✅ **Titles**: Diidentifikasi berdasarkan `title_name` + `department_id`
- ✅ **Employees**: Diidentifikasi berdasarkan `employee_email` (unique)

### Handle Perubahan Data

- ✅ Jika employee pindah department, data akan ter-update dengan department_id yang baru
- ✅ Jika title berubah, employee akan ter-update dengan title_id yang baru
- ✅ Jika ada perubahan data lainnya, data akan ter-update otomatis

### Validasi

- ✅ CSV harus memiliki kolom yang diperlukan
- ✅ Company Name, Department Name, Title Name, Employee Name, dan Employee Email adalah wajib
- ✅ Employee Email harus unik (tidak boleh duplikat)
- ✅ Department harus memiliki Company yang valid
- ✅ Title harus memiliki Department yang valid
- ✅ Employee harus memiliki Title yang valid

## 📝 Contoh Penggunaan dengan cURL

### Download Template

```bash
curl -X GET "http://localhost:3000/api/sync/template" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o sync_template.csv
```

### Sync Data

```bash
curl -X POST "http://localhost:3000/api/sync/data" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@sync_data.csv"
```

## 🔧 Troubleshooting

### Error: "Missing essential columns"

Pastikan CSV memiliki kolom:
- Company Name
- Department Name
- Title Name
- Employee Name
- Employee Email

### Error: "Cannot sync employee: Title is required but not found"

Pastikan:
- Title Name sudah ada di CSV
- Department Name sudah ada dan valid
- Company Name sudah ada dan valid

### Error: "Duplicate data found"

Pastikan:
- Employee Email tidak duplikat dalam CSV
- Company Name tidak duplikat dalam CSV
- Island Name tidak duplikat dalam CSV

## 📚 File Terkait

- `src/modules/sync/sync_handler.js` - Handler untuk sync data
- `src/modules/sync/index.js` - Module export
- `src/routes/V1/sso.js` - Route definitions

## 🎯 Best Practices

1. **Backup Database** sebelum melakukan sync data besar
2. **Test dengan data kecil** terlebih dahulu sebelum sync data besar
3. **Validasi CSV** sebelum upload menggunakan template
4. **Monitor hasil sync** untuk memastikan tidak ada error
5. **Jadwalkan sync** setiap minggu sekali untuk menjaga data tetap up-to-date

