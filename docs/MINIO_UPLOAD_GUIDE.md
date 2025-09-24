# MinIO Upload Guide

Panduan lengkap untuk menggunakan sistem upload file ke MinIO cloud storage.

## Konfigurasi Environment

Tambahkan konfigurasi berikut ke file `.env`:

```bash
# MinIO Configuration
MINIO_ENABLED=true
S3_PROVIDER=minio
S3_REGION=us-east-1
S3_BUCKET=msi-interview
S3_ACCESS_KEY_ID=admin
S3_SECRET_ACCESS_KEY=supersecurepass123
S3_ENDPOINT=https://minio-bucket.motorsights.com
S3_FORCE_PATH_STYLE=true
S3_SSL_ENABLED=false
S3_SIGNATURE_VERSION=v4

# MinIO Private Bucket Configuration (Optional)
S3_BUCKET_PRIVATE=msi-interview-private
MINIO_BUCKET_PRIVATE=msi-interview-private
AWS_BUCKET_PRIVATE=msi-interview-private
```

## Fitur Utama

### 1. Upload File Public
File yang diupload akan dapat diakses secara public melalui URL langsung.

### 2. Upload File Private
File yang diupload akan memerlukan signed URL untuk akses (expired dalam 5 bulan).

### 3. Validasi File
- Validasi ukuran file (default 10MB, dapat disesuaikan)
- Validasi tipe file untuk gambar (JPEG, PNG, GIF, WebP)
- Kompresi gambar otomatis

### 4. Watermark Support
Dapat menambahkan watermark pada gambar sebelum upload.

## Penggunaan dalam Handler

### Contoh Upload Foto Employee

```javascript
const { generateMinioUpload } = require('../../utils/minio-upload');

// Handle employee photo upload to MinIO
if (req.files && req.files.length > 0) {
  const photoFile = req.files.find(file => file.fieldname === 'employee_foto')
  if (photoFile) {
    try {
      const uploadResult = await generateMinioUpload(
        req, 
        0, // file index
        'employees/photos', // path in MinIO
        'employee_photo', // naming prefix
        '', // default value
        {
          isWatermark: false,
          isPrivate: false,
          isContentType: true,
          fileNames: '',
          compressImage: true, // Enable image compression
          maxFileSize: 5 * 1024 * 1024 // 5MB max for employee photos
        }
      )
      
      if (uploadResult.status) {
        employeePayload.employee_foto = uploadResult.pathForDatabase
        console.log(`Employee photo uploaded successfully: ${uploadResult.fileNames}`)
      } else {
        console.warn(`Failed to upload employee photo: ${uploadResult.error}`)
      }
    } catch (error) {
      console.error('Error uploading employee photo:', error)
    }
  }
}
```

## Parameter Upload

### generateMinioUpload Parameters

- `req`: Request object dari Express
- `num`: Index file dalam array req.files
- `paths`: Path folder dalam MinIO bucket
- `naming`: Prefix untuk nama file
- `defaults`: Nilai default jika upload gagal
- `additional`: Object konfigurasi tambahan

### Additional Options

```javascript
{
  isWatermark: false,        // Enable watermark
  isPrivate: false,          // Upload ke private bucket
  isContentType: true,       // Validasi content type
  fileNames: '',             // Custom file name
  compressImage: false,      // Compress image
  maxFileSize: 10 * 1024 * 1024 // Max file size in bytes
}
```

## Response Format

```javascript
{
  pathForDatabase: "https://minio-bucket.motorsights.com/msi-interview/employees/photos/employee_photo-1234567890.jpg",
  fileNames: "employee_photo-1234567890.jpg",
  status: true,
  error: null,
  fileSize: 2048576,
  contentType: "image/jpeg"
}
```

## Fungsi MinIO yang Tersedia

### Upload Functions
- `uploadToMinio(bucketName, objectName, buffer, contentType)` - Upload ke public bucket
- `uploadToMinioPrivate(bucketName, objectName, buffer, contentType)` - Upload ke private bucket

### Utility Functions
- `deleteFromMinio(bucketName, objectName, isPrivate)` - Hapus file
- `getSignedUrl(bucketName, objectName, expiry, isPrivate)` - Generate signed URL
- `getFileInfo(bucketName, objectName, isPrivate)` - Get file information
- `listFiles(bucketName, prefix, isPrivate)` - List files in bucket
- `fileExists(bucketName, objectName, isPrivate)` - Check if file exists

### Bucket Management
- `setBucketPublicPolicy(bucketName)` - Set bucket policy untuk public access
- `getBucketPolicy(bucketName)` - Get bucket policy

## Error Handling

Sistem akan menangani berbagai jenis error:

1. **MinIO Disabled**: Jika MinIO tidak diaktifkan, akan return default values
2. **File Not Found**: Jika file tidak ditemukan di index yang diminta
3. **File Size Exceeded**: Jika ukuran file melebihi batas maksimal
4. **Invalid File Type**: Jika tipe file tidak diizinkan
5. **Upload Failed**: Jika upload ke MinIO gagal

## Logging

Semua aktivitas upload akan dicatat dalam log file:
- Success: `Success uploading file {filename} to MinIO bucket {bucket} {timestamp}`
- Error: `Error uploading file {filename} to MinIO bucket {bucket} {timestamp}`

## Best Practices

1. **Selalu validasi file** sebelum upload
2. **Gunakan compressImage: true** untuk gambar
3. **Set maxFileSize** sesuai kebutuhan
4. **Handle error gracefully** - aplikasi tetap berjalan meskipun upload gagal
5. **Gunakan private bucket** untuk file sensitif
6. **Monitor log files** untuk debugging

## Troubleshooting

### Common Issues

1. **Connection Error**: Periksa konfigurasi S3_ENDPOINT dan credentials
2. **Bucket Not Found**: Bucket akan dibuat otomatis jika tidak ada
3. **Permission Denied**: Periksa access key dan secret key
4. **File Too Large**: Sesuaikan maxFileSize parameter

### Debug Mode

Set `NODE_ENV=development` untuk mendapatkan log detail dari MinIO operations.
