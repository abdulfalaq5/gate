# Contoh Curl untuk SSO Profile Update dengan Multipart Form Data

## Curl yang sudah diupdate sesuai permintaan:

```bash
curl -X 'PUT' \
  'http://localhost:9518/api/auth/sso/profil' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTNkZDdjZWUtZmIwNS00MjA3LThlZTEtZGJlMDY5NTI1ZjNhIiwiZW1wbG95ZWVfaWQiOiJhM2RkN2NlZS1mYjA1LTQyMDctOGVlMS1kYmUwNjk1MjVmM2EiLCJpYXQiOjE3NTg2ODA2MTEsImV4cCI6MTc1ODc2NzAxMSwiYXVkIjoic3RyaW5nIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0.KkCx-CX5OQf_ZQQIR7QObXK__o1HBXlYzLcUyrsJPVg' \
  -F 'employee_name=abdul harris' \
  -F 'employee_email=abdulharris@motorsights.net' \
  -F 'employee_foto=@path/to/your/photo.jpg' \
  -F 'current_password=QwerMSI2025!' \
  -F 'new_password=QwerMSI2025!' \
  -F 'confirm_password=QwerMSI2025!'
```

## Perubahan yang dilakukan:

1. **Content-Type**: Diubah dari `application/json` menjadi `multipart/form-data` (otomatis dengan `-F`)
2. **Body**: Diubah dari JSON menjadi form fields dengan `-F`
3. **File Upload**: Ditambahkan `employee_foto=@path/to/your/photo.jpg` untuk upload foto
4. **Title ID**: Dihapus sesuai permintaan (tidak ada proses update title_id)

## Field yang tersedia:

- `employee_name`: Nama employee (optional)
- `employee_email`: Email employee (optional)  
- `employee_foto`: File foto profil (optional, maksimal 5MB, format gambar)
- `current_password`: Password lama (optional, required jika update password)
- `new_password`: Password baru (optional, required jika update password)
- `confirm_password`: Konfirmasi password (optional, required jika update password)

## Validasi:

- Minimal satu field harus diisi
- Jika update password, semua field password harus diisi
- File foto maksimal 5MB dan hanya format gambar (JPEG, PNG, GIF, WebP)
- Email harus unik (tidak digunakan employee lain)

## Response yang diharapkan:

```json
{
  "success": true,
  "message": "Profil berhasil diupdate dan foto berhasil diupload dan password berhasil diubah",
  "data": {
    "employee_id": "uuid",
    "employee_name": "abdul harris",
    "employee_email": "abdulharris@motorsights.net",
    "employee_foto": "path/to/uploaded/photo.jpg",
    "title_name": "Job Title",
    "department_name": "Department Name", 
    "company_name": "Company Name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
