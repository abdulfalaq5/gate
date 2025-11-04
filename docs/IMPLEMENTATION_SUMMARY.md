# S3 Base URL Replacement - Implementation Summary

## Overview

Implementasi fitur untuk mengganti base URL Minio dengan custom URL melalui environment variable `S3_BASE_URL`. Fitur ini memungkinkan URL file yang disimpan di database menggunakan domain custom alih-alih endpoint internal Minio.

## Files yang Dibuat/Dimodifikasi

### 1. Files Baru

#### `src/utils/url-replacer.js`
- **Fungsi utama**: Utility untuk replace base URL Minio
- **Fitur**:
  - `replaceMinioBaseUrl()` - Replace single URL
  - `replaceMinioBaseUrlInString()` - Replace multiple URLs dalam string
  - `getCustomBaseUrl()` - Get custom base URL dari environment
  - `autoReplaceMinioUrl()` - Auto replace menggunakan environment config
  - `autoReplaceMinioUrlInString()` - Auto replace multiple URLs

#### `src/utils/database-url-updater.js`
- **Fungsi utama**: Utility untuk update URL dalam database
- **Fitur**:
  - `updateDatabaseUrl()` - Update single URL
  - `updateMultipleDatabaseUrls()` - Update multiple fields dalam object
  - `updateArrayDatabaseUrls()` - Update array of objects
  - `urlUpdateMiddleware()` - Express middleware untuk auto update response

#### `src/scripts/migrate-minio-urls.js`
- **Fungsi utama**: Script migration untuk update URL existing di database
- **Fitur**:
  - Auto detect tabel dan field yang berisi URL Minio
  - Batch update dengan error handling
  - Logging dan progress tracking
  - Configurable table dan field mapping

#### `test/url-replacer.test.js`
- **Fungsi utama**: Unit tests untuk URL replacer utility
- **Coverage**: Semua fungsi utama dengan berbagai skenario

#### `examples/minio-url-replacement-example.js`
- **Fungsi utama**: Contoh penggunaan lengkap semua fitur
- **Demonstrasi**: Manual replacement, auto replacement, database update, dll

#### `docs/S3_BASE_URL_REPLACEMENT_GUIDE.md`
- **Fungsi utama**: Dokumentasi lengkap penggunaan fitur
- **Content**: Konfigurasi, contoh penggunaan, troubleshooting, best practices

### 2. Files yang Dimodifikasi

#### `config/environment.example`
- **Perubahan**: Menambahkan `S3_BASE_URL=https://minio-bucket.motorsights.com`
- **Tujuan**: Template konfigurasi untuk environment variable baru

#### `src/config/minio.js`
- **Perubahan**: 
  - Import `getCustomBaseUrl` dari url-replacer
  - Modifikasi fungsi `uploadToMinio()` untuk menggunakan custom base URL
  - Modifikasi fungsi `uploadToMinioPrivate()` untuk menggunakan custom base URL
  - Modifikasi fungsi `getSignedUrl()` untuk menggunakan custom base URL
- **Tujuan**: Otomatis replace URL saat upload dan generate signed URL

#### `src/utils/minio-upload.js`
- **Perubahan**: Import `autoReplaceMinioUrl` untuk future use
- **Tujuan**: Siap untuk implementasi additional URL replacement

## Cara Penggunaan

### 1. Konfigurasi Environment

Tambahkan ke file `.env`:
```env
S3_BASE_URL=https://minio-bucket.motorsights.com
```

### 2. Upload File Baru

URL otomatis akan menggunakan `S3_BASE_URL`:
```javascript
const { uploadToMinio } = require('../config/minio');
const result = await uploadToMinio(bucketName, objectName, buffer, contentType);
console.log(result.url); // Sudah menggunakan S3_BASE_URL
```

### 3. Update URL Existing di Database

```javascript
const { updateDatabaseUrl } = require('../src/utils/database-url-updater');
const newUrl = updateDatabaseUrl(oldUrl);
```

### 4. Migration Script

```bash
node src/scripts/migrate-minio-urls.js
```

## Contoh Transformasi URL

### Sebelum
```
http://127.0.0.1:9508/msi-e-catalogue/catalog-images/1760592348165_7410a5ca-c43c-47b4-acec-512c20e975e5_testdebug2.jpg
```

### Sesudah
```
https://minio-bucket.motorsights.com/msi-e-catalogue/catalog-images/1760592348165_7410a5ca-c43c-47b4-acec-512c20e975e5_testdebug2.jpg
```

## Testing

### Unit Tests
```bash
node test/url-replacer.test.js
```

### Contoh Penggunaan
```bash
node examples/minio-url-replacement-example.js
```

## Features

✅ **Automatic URL replacement** saat upload file baru  
✅ **Manual URL replacement** untuk kasus khusus  
✅ **Database migration script** untuk URL existing  
✅ **Multiple URL replacement** dalam string  
✅ **Error handling** untuk URL tidak valid  
✅ **Environment-based configuration**  
✅ **Express middleware** untuk auto update response  
✅ **Comprehensive documentation**  
✅ **Unit tests** dengan berbagai skenario  
✅ **Example usage** yang lengkap  

## Benefits

1. **Flexibility**: Bisa menggunakan domain custom untuk akses file
2. **Security**: URL internal tidak terexpose ke client
3. **Performance**: CDN bisa digunakan dengan custom domain
4. **Maintainability**: Centralized URL configuration
5. **Backward Compatibility**: Tidak merusak URL existing jika tidak dikonfigurasi

## Next Steps

1. **Deploy ke environment production** dengan konfigurasi yang sesuai
2. **Jalankan migration script** untuk update URL existing
3. **Monitor logs** untuk memastikan URL replacement bekerja dengan benar
4. **Update documentation** jika ada perubahan konfigurasi

## Notes

- Fitur ini **backward compatible** - jika `S3_BASE_URL` tidak dikonfigurasi, sistem akan menggunakan URL default
- **Error handling** yang robust untuk URL tidak valid
- **Logging** minimal untuk menghindari spam log
- **Performance optimized** dengan minimal overhead
