# S3 Base URL Replacement Guide

## Overview

Fitur ini memungkinkan Anda untuk mengganti base URL Minio dengan custom URL melalui environment variable `S3_BASE_URL`. Ini berguna ketika Anda ingin menggunakan domain custom untuk mengakses file yang disimpan di Minio.

## Konfigurasi

### Environment Variables

Tambahkan konfigurasi berikut ke file `.env`:

```env
# MinIO Configuration
MINIO_ENABLED=true
S3_PROVIDER=minio
S3_REGION=us-east-1
S3_BUCKET=msi-interview
S3_ACCESS_KEY_ID=admin
S3_SECRET_ACCESS_KEY=supersecurepass123
S3_ENDPOINT=https://minio-bucket.motorsights.com
S3_BASE_URL=https://minio-bucket.motorsights.com
```

### Parameter Konfigurasi

- `S3_ENDPOINT`: Endpoint Minio untuk koneksi internal (upload, delete, dll)
- `S3_BASE_URL`: Base URL custom yang akan digunakan untuk URL public yang disimpan di database

## Contoh Penggunaan

### Sebelum Konfigurasi

URL yang dihasilkan:
```
http://127.0.0.1:9508/msi-e-catalogue/catalog-images/1760592348165_7410a5ca-c43c-47b4-acec-512c20e975e5_testdebug2.jpg
```

### Setelah Konfigurasi

URL yang dihasilkan:
```
https://minio-bucket.motorsights.com/msi-e-catalogue/catalog-images/1760592348165_7410a5ca-c43c-47b4-acec-512c20e975e5_testdebug2.jpg
```

## Implementasi

### 1. Upload File Baru

URL otomatis akan menggunakan `S3_BASE_URL` saat upload file baru:

```javascript
const { uploadToMinio } = require('../config/minio');

const result = await uploadToMinio(bucketName, objectName, buffer, contentType);
console.log(result.url); // URL sudah menggunakan S3_BASE_URL
```

### 2. Update URL Database Existing

Untuk file yang sudah ada di database, gunakan utility function:

```javascript
const { updateDatabaseUrl, updateMultipleDatabaseUrls } = require('../utils/database-url-updater');

// Update single URL
const oldUrl = "http://127.0.0.1:9508/msi-e-catalogue/image.jpg";
const newUrl = updateDatabaseUrl(oldUrl);
// Result: "https://minio-bucket.motorsights.com/msi-e-catalogue/image.jpg"

// Update multiple fields dalam object
const data = {
  name: "Product Name",
  image: "http://127.0.0.1:9508/msi-e-catalogue/image.jpg",
  thumbnail: "http://127.0.0.1:9508/msi-e-catalogue/thumb.jpg"
};

const updatedData = updateMultipleDatabaseUrls(data, ['image', 'thumbnail']);
```

### 3. Middleware untuk Response

Gunakan middleware untuk otomatis update URL dalam response:

```javascript
const { urlUpdateMiddleware } = require('../utils/database-url-updater');

// Apply middleware ke route
app.get('/api/products', urlUpdateMiddleware(['image', 'thumbnail']), productController.getAll);
```

### 4. Manual URL Replacement

```javascript
const { autoReplaceMinioUrl, autoReplaceMinioUrlInString } = require('../utils/url-replacer');

// Replace single URL
const newUrl = autoReplaceMinioUrl("http://127.0.0.1:9508/bucket/file.jpg");

// Replace multiple URLs dalam string
const text = "Image 1: http://127.0.0.1:9508/bucket/image1.jpg, Image 2: http://127.0.0.1:9508/bucket/image2.jpg";
const updatedText = autoReplaceMinioUrlInString(text);
```

## Migration Script

Untuk mengupdate semua URL existing di database:

```javascript
const { updateDatabaseUrl } = require('../utils/database-url-updater');
const knex = require('../knexfile');

async function migrateUrls() {
  const tables = ['products', 'users', 'catalogs']; // Sesuaikan dengan tabel Anda
  
  for (const table of tables) {
    const records = await knex(table).select('*');
    
    for (const record of records) {
      const updatedRecord = {};
      let hasChanges = false;
      
      // Check fields yang mungkin berisi URL
      const urlFields = ['image', 'images', 'photo', 'avatar', 'logo', 'banner'];
      
      urlFields.forEach(field => {
        if (record[field]) {
          const newUrl = updateDatabaseUrl(record[field]);
          if (newUrl !== record[field]) {
            updatedRecord[field] = newUrl;
            hasChanges = true;
          }
        }
      });
      
      if (hasChanges) {
        await knex(table)
          .where('id', record.id)
          .update(updatedRecord);
        
        console.log(`Updated ${table} record ${record.id}`);
      }
    }
  }
}

// Run migration
migrateUrls().then(() => {
  console.log('Migration completed');
  process.exit(0);
}).catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
```

## Testing

### Test URL Replacement

```javascript
const { replaceMinioBaseUrl, getCustomBaseUrl } = require('../utils/url-replacer');

// Test replacement
const originalUrl = "http://127.0.0.1:9508/msi-e-catalogue/image.jpg";
const customBaseUrl = "https://minio-bucket.motorsights.com";
const newUrl = replaceMinioBaseUrl(originalUrl, customBaseUrl);

console.log('Original:', originalUrl);
console.log('New:', newUrl);
// Expected: https://minio-bucket.motorsights.com/msi-e-catalogue/image.jpg
```

## Troubleshooting

### 1. URL Tidak Berubah

- Pastikan `S3_BASE_URL` sudah dikonfigurasi di `.env`
- Restart aplikasi setelah mengubah environment variables
- Check apakah URL format sudah benar

### 2. Error Parsing URL

- Pastikan `S3_BASE_URL` menggunakan format yang benar (dengan protocol)
- Check apakah URL asli valid

### 3. Database Migration Gagal

- Backup database sebelum menjalankan migration
- Test migration script dengan data sample dulu
- Check apakah field yang akan diupdate ada di database

## Best Practices

1. **Selalu backup database** sebelum menjalankan migration
2. **Test di environment development** terlebih dahulu
3. **Monitor log** saat upload file untuk memastikan URL sudah benar
4. **Gunakan HTTPS** untuk `S3_BASE_URL` di production
5. **Validasi URL** sebelum menyimpan ke database

## Security Considerations

- Pastikan `S3_BASE_URL` menggunakan HTTPS di production
- Validasi custom base URL untuk mencegah URL injection
- Monitor akses file untuk mendeteksi suspicious activity
