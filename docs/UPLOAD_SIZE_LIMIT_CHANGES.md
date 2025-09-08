# Perubahan Batasan Ukuran File Upload

## Ringkasan Perubahan

Batas ukuran file upload telah diubah dari **120 MB** menjadi **1 GB** untuk mendukung upload file yang lebih besar.

## File yang Diubah

### 1. `src/app.js`
- **Sebelum**: `JSON_LIMIT=123072kb` (≈120 MB)
- **Sesudah**: `JSON_LIMIT=1gb` (1 GB)
- **Tambahan**: Menambahkan `express.urlencoded` dengan batasan yang sama

### 2. `src/modules/campaign_doctor_truck/index.js`
- **Sebelum**: `const upload = multer()`
- **Sesudah**: 
  ```javascript
  const upload = multer({
    limits: {
      fileSize: 1024 * 1024 * 1024, // 1 GB dalam bytes
      files: 10 // maksimal 10 file
    }
  })
  ```
- **Tambahan**: Error handling middleware untuk menangani error upload

### 3. `src/modules/banks/index.js`
- **Sebelum**: `const upload = multer()`
- **Sesudah**: 
  ```javascript
  const upload = multer({
    limits: {
      fileSize: 1024 * 1024 * 1024, // 1 GB dalam bytes
      files: 10 // maksimal 10 file
    }
  })
  ```
- **Tambahan**: Error handling middleware untuk menangani error upload

### 4. `DEVELOPMENT_SETUP.md`
- **Sebelum**: `JSON_LIMIT=123072kb`
- **Sesudah**: `JSON_LIMIT=1gb`

## Konfigurasi Baru

### Batasan File Upload
- **Ukuran maksimal per file**: 1 GB (1024 MB)
- **Jumlah maksimal file**: 10 file
- **Format yang didukung**: PDF dan Image (JPG, PNG, etc.)

### Error Handling
Sistem sekarang menangani error upload dengan pesan yang informatif:
- `LIMIT_FILE_SIZE`: "Ukuran file terlalu besar. Maksimal ukuran file adalah 1 GB."
- `LIMIT_FILE_COUNT`: "Jumlah file terlalu banyak. Maksimal 10 file."

## Environment Variables

Untuk menggunakan batasan baru, pastikan environment variable diset:
```bash
JSON_LIMIT=1gb
```

## Testing

Untuk menguji perubahan ini:
1. Restart aplikasi
2. Coba upload file dengan ukuran > 120 MB
3. Coba upload file dengan ukuran > 1 GB (akan mendapat error)
4. Coba upload lebih dari 10 file (akan mendapat error)

## Catatan Penting

- Perubahan ini mempengaruhi semua endpoint upload di aplikasi
- Pastikan server memiliki kapasitas storage yang cukup
- Monitor penggunaan bandwidth dan storage setelah perubahan ini
- Pertimbangkan implementasi progress bar untuk upload file besar 