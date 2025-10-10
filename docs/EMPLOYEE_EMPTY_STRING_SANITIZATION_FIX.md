# Employee Empty String Sanitization Fix

## 📋 Ringkasan

Dokumentasi ini menjelaskan perbaikan bug yang menyebabkan error 500 ketika melakukan update employee dengan empty string (`""`) untuk field UUID nullable seperti `gender_id` dan `island_id`.

## 🐛 Problem

### Gejala
- Request PUT ke `/api/employees/:id` menghasilkan error 500
- Error terjadi ketika mengirim empty string (`""`) untuk field UUID nullable

### Contoh Request yang Error

```bash
curl 'https://services.motorsights.com/api/employees/3b929214-a1f2-4789-9c5b-9cb8779c782e' \
  -X 'PUT' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer [token]' \
  --data-raw '{
    "employee_name": "Admin EPC",
    "employee_email": "admin@epc.net",
    "gender_id": "",
    "island_id": "",
    ...
  }'
```

### Root Cause

1. Field `gender_id` dan `island_id` di database adalah **nullable** dengan **foreign key constraints**
2. Ketika frontend mengirim empty string (`""`), backend tidak melakukan sanitasi
3. Empty string bukan UUID valid dan bukan `null`
4. Database gagal memproses karena foreign key constraint violation
5. Hasilnya: Error 500

### Field yang Terpengaruh

- `gender_id` - Foreign key ke tabel `genders`
- `island_id` - Foreign key ke tabel `islands`
- `title_id` - Foreign key ke tabel `titles`
- `department_id` - Foreign key ke tabel `departments`

## ✅ Solusi

### Perubahan di `src/modules/employees/handler.js`

Menambahkan sanitasi untuk mengubah empty string menjadi `null` untuk field UUID sebelum validasi dan proses data:

#### 1. Fungsi `createEmployee` (baris 81-87)

```javascript
// Sanitize empty strings to null for UUID fields
const uuidFields = ['gender_id', 'island_id', 'title_id', 'department_id']
uuidFields.forEach(field => {
  if (req.body[field] === '') {
    req.body[field] = null
  }
})
```

#### 2. Fungsi `updateEmployee` (baris 189-195)

```javascript
// Sanitize empty strings to null for UUID fields
const uuidFields = ['gender_id', 'island_id', 'title_id', 'department_id']
uuidFields.forEach(field => {
  if (req.body[field] === '') {
    req.body[field] = null
  }
})
```

### Cara Kerja

1. Sebelum validasi dan proses data, cek setiap UUID field
2. Jika nilai field adalah empty string (`""`), ubah menjadi `null`
3. Database akan menerima `null` (yang valid untuk nullable field) bukan empty string
4. Foreign key constraint tidak akan error karena `null` diperbolehkan

## 🧪 Testing

### Request Sebelum Fix (Error)

```json
{
  "employee_name": "Admin EPC",
  "employee_email": "admin@epc.net",
  "gender_id": "",
  "island_id": ""
}
```

**Result:** ❌ Error 500

### Request Setelah Fix (Sukses)

```json
{
  "employee_name": "Admin EPC",
  "employee_email": "admin@epc.net",
  "gender_id": "",
  "island_id": ""
}
```

**Result:** ✅ Success 200 - Empty string otomatis dikonversi ke `null`

### Request dengan UUID Valid (Tetap Sukses)

```json
{
  "employee_name": "Test User",
  "employee_email": "test@example.com",
  "gender_id": "ac496e5f-97c8-46a6-86ba-2a11942a01d6",
  "island_id": "7e532ce0-6df2-4304-9c25-774ae71a042e"
}
```

**Result:** ✅ Success 200 - UUID valid tetap diproses normal

## 📊 Perbandingan Curl

### Curl 1 - Sukses (Sebelum & Sesudah Fix)

```bash
curl 'https://services.motorsights.com/api/employees/a377f763-0d82-4578-ab79-bd4555e58c8c' \
  -X 'PUT' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "gender_id": "ac496e5f-97c8-46a6-86ba-2a11942a01d6",
    "island_id": "7e532ce0-6df2-4304-9c25-774ae71a042e"
  }'
```

✅ **Tetap sukses** - UUID valid

### Curl 2 - Error Sebelum Fix, Sukses Setelah Fix

```bash
curl 'https://services.motorsights.com/api/employees/3b929214-a1f2-4789-9c5b-9cb8779c782e' \
  -X 'PUT' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "gender_id": "",
    "island_id": ""
  }'
```

- **Sebelum Fix:** ❌ Error 500
- **Setelah Fix:** ✅ Success 200

## 🎯 Benefit

1. **Lebih Robust** - Sistem dapat handle empty string dari frontend
2. **User Friendly** - Tidak perlu frontend melakukan konversi empty string ke null
3. **Konsisten** - Berlaku untuk CREATE dan UPDATE
4. **Backward Compatible** - Tidak mengubah behavior untuk request yang sudah benar

## 📝 Notes

### Field UUID yang Nullable

Database schema untuk field-field ini:

```sql
-- employees table
gender_id UUID NULL REFERENCES genders(gender_id)
island_id UUID NULL REFERENCES islands(island_id)
title_id UUID NULL REFERENCES titles(title_id)
department_id UUID NULL REFERENCES departments(department_id)
```

### Error Handling yang Sudah Ada

Handler sudah memiliki error handling untuk foreign key violation:

```javascript
if (error.code === '23503') { // Foreign key constraint violation
  return errorResponse(res, 'Invalid title_id, department_id, gender_id, island_id, menu_id, or permission_id. One or more referenced records do not exist.', 400)
}
```

Dengan sanitasi ini, error code `23503` dari empty string tidak akan terjadi lagi.

## 🔗 Related Files

- `src/modules/employees/handler.js` - Handler untuk create dan update employee
- `src/modules/employees/postgre_repository.js` - Repository untuk database operations
- `src/repository/postgres/migrations/20250101000014_update_employees_table.js` - Migration untuk gender_id
- `src/repository/postgres/migrations/20250101000028_update_employees_add_island_and_phone.js` - Migration untuk island_id

## ✅ Status

- [x] Fix implemented
- [x] No linter errors
- [x] Backward compatible
- [x] Documentation created

---

**Tanggal:** 10 Oktober 2025  
**Developer:** AI Assistant  
**Issue:** Empty string untuk UUID fields menyebabkan error 500  
**Solution:** Sanitasi empty string menjadi null sebelum proses data

