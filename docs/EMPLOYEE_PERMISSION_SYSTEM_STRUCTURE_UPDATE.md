# Employee Permission System Structure Update

## Overview
API Employee telah diupdate untuk mendukung struktur permission dengan `system_id` dan `system_name` selain struktur lama yang sudah ada. Ini memungkinkan frontend untuk mengirim data permission yang lebih terstruktur berdasarkan sistem.

## Perubahan yang Dilakukan

### 1. Repository Update (`src/modules/employees/postgre_repository.js`)
- ✅ Mengupdate method `updateEmployeePermissions()` untuk mendukung kedua struktur
- ✅ Menambahkan logika untuk mendeteksi struktur data (lama vs baru)
- ✅ Memproses data permission berdasarkan struktur yang diterima

### 2. Schema Update (`src/static/schema/employees.json`)
- ✅ Memperbarui dokumentasi schema untuk POST dan PUT employees
- ✅ Menambahkan contoh struktur baru dengan `system_id` dan `system_name`
- ✅ Menjelaskan bahwa API mendukung kedua struktur

## Struktur Data yang Didukung

### Struktur Lama (Masih Didukung)
```json
{
  "permission_detail": [
    {
      "menu_id": "cbd33a30-048b-46b2-9b9f-d3048d0f1b64",
      "menu_name": "Category Power BI",
      "permission_detail": [
        {
          "permission_id": "d8ba9141-0887-4b25-b3b4-3f2fcb5d60c5",
          "permission_name": "create",
          "permission_status": true
        }
      ]
    }
  ]
}
```

### Struktur Baru (Dengan System)
```json
{
  "permission_detail": [
    {
      "system_id": "ea805534-6616-4980-b0b0-b983a39940f8",
      "system_name": "Power BI",
      "permission_detail": [
        {
          "menu_id": "cbd33a30-048b-46b2-9b9f-d3048d0f1b64",
          "menu_name": "Category Power BI",
          "permission_detail": [
            {
              "permission_id": "d8ba9141-0887-4b25-b3b4-3f2fcb5d60c5",
              "permission_name": "create",
              "permission_status": true
            }
          ]
        }
      ]
    }
  ]
}
```

## Logika Pemrosesan

### Deteksi Struktur
API akan mendeteksi struktur data berdasarkan field yang ada:
- Jika ada `menu_id` langsung → Struktur lama
- Jika ada `system_id` → Struktur baru

### Pemrosesan Permission
1. **Struktur Lama**: Langsung memproses `permission_detail` dari menu
2. **Struktur Baru**: Iterasi melalui `permission_detail` untuk mendapatkan menu-menu, kemudian memproses `permission_detail` dari setiap menu

## Contoh Penggunaan

### UPDATE Employee dengan Struktur Baru (JSON)
```bash
curl -X 'PUT' \
  'https://services.motorsights.com/api/employees/{id}' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  --data-raw '{
    "employee_name": "testingkosong12",
    "employee_email": "testingkosong12@example.com",
    "permission_detail": [
      {
        "system_id": "ea805534-6616-4980-b0b0-b983a39940f8",
        "system_name": "Power BI",
        "permission_detail": [
          {
            "menu_id": "cbd33a30-048b-46b2-9b9f-d3048d0f1b64",
            "menu_name": "Category Power BI",
            "permission_detail": [
              {
                "permission_id": "d8ba9141-0887-4b25-b3b4-3f2fcb5d60c5",
                "permission_name": "create",
                "permission_status": true
              }
            ]
          }
        ]
      }
    ]
  }'
```

### UPDATE Employee dengan Struktur Baru (Multipart)
```bash
curl -X 'PUT' \
  'https://services.motorsights.com/api/employees/{id}' \
  -H 'Content-Type: multipart/form-data' \
  -H 'Authorization: Bearer <token>' \
  -F 'permission_detail=[{"system_id":"ea805534-6616-4980-b0b0-b983a39940f8","system_name":"Power BI","permission_detail":[{"menu_id":"cbd33a30-048b-46b2-9b9f-d3048d0f1b64","menu_name":"Category Power BI","permission_detail":[{"permission_id":"d8ba9141-0887-4b25-b3b4-3f2fcb5d60c5","permission_name":"create","permission_status":true}]}]}]' \
  -F 'employee_name=testingkosong12' \
  -F 'employee_email=testingkosong12@example.com'
```

## Backward Compatibility

✅ **API tetap mendukung struktur lama** - tidak ada breaking changes
✅ **Frontend dapat menggunakan struktur mana saja** sesuai kebutuhan
✅ **Response GET employee tetap mengembalikan struktur dengan system** (sudah ada sebelumnya)

## Testing

Untuk menguji perubahan ini:
1. Gunakan curl dengan struktur baru (JSON atau multipart)
2. Verifikasi permission tersimpan dengan benar di database
3. Verifikasi response GET employee menampilkan permission yang benar

## Catatan Penting

- API akan otomatis mendeteksi struktur data yang dikirim
- Tidak perlu perubahan di frontend jika masih menggunakan struktur lama
- Struktur baru memberikan organisasi yang lebih baik berdasarkan sistem
- Permission ID mapping tetap sama untuk kedua struktur
