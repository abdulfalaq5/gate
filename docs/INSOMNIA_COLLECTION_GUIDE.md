# Panduan Import Collection Insomnia

Dokumen ini menjelaskan cara mengimport collection Insomnia untuk testing API Core API MSI.

## File Collection

File collection tersedia di: `insomnia-collection.json`

## Cara Import ke Insomnia

### 1. Buka Insomnia

Buka aplikasi Insomnia di komputer Anda.

### 2. Import Collection

1. Klik menu **Application** → **Preferences** (atau tekan `Cmd/Ctrl + ,`)
2. Pilih tab **Data**
3. Klik **Import Data**
4. Pilih **From File**
5. Pilih file `insomnia-collection.json`
6. Klik **Import**

Atau dengan cara cepat:
- Drag and drop file `insomnia-collection.json` ke window Insomnia
- Atau gunakan menu **Create** → **Import** → **From File**

### 3. Setup Environment Variables

Setelah collection diimport, setup environment variables:

1. Klik dropdown environment di pojok kiri atas (default: "Base Environment")
2. Atau buka **Manage Environments** (icon gear)
3. Set variabel berikut:
   - `base_url`: URL base API (default: `http://localhost:3000/api`)
   - `gateway_url`: URL gateway production (default: `https://services.motorsights.com/api`)
   - `token`: Token JWT untuk authentication (akan diisi setelah login)

### 4. Setup Authentication Token

Setelah melakukan login (Admin Signin atau SSO Login):

1. Copy token dari response
2. Buka **Manage Environments**
3. Tambahkan atau update variabel `token` dengan token yang didapat
4. Semua request yang memerlukan authentication akan otomatis menggunakan token ini

## Struktur Collection

Collection ini terorganisir dalam folder-folder berikut:

### 1. Authentication
- **Admin Signin**: Login untuk admin
- **Refresh Token**: Refresh access token
- **Get Current User**: Get current user information

### 2. SSO Authentication
- **SSO Login**: SSO Login
- **SSO Authorize**: SSO Authorization
- **SSO Token Exchange**: SSO Token Exchange
- **SSO User Info**: Get SSO User Info
- **SSO Logout**: SSO Logout

### 3. SSO Profile
- **Get SSO Profile**: Get User Profile
- **Update SSO Profile**: Update Employee Profile (dengan upload foto)

### 4. Systems
- **Create System**: Create New System
- **Get All Systems**: Get All Systems
- **Get System by ID**: Get System by ID
- **Update System**: Update System
- **Delete System**: Delete System

### 5. Permissions
- **Get Permissions**: Get all permissions
- **Create Permission**: Create new permission
- **Get Permission by ID**: Get permission by ID
- **Update Permission**: Update permission
- **Delete Permission**: Delete permission
- **Restore Permission**: Restore deleted permission

### 6. Employees
- **Get Employees**: Get all employees
- **Create Employee**: Create new employee (dengan upload foto)
- **Get Employee by ID**: Get employee by ID
- **Update Employee**: Update employee (dengan upload foto)
- **Delete Employee**: Delete employee
- **Reset Employee Password**: Reset employee password
- **Get Employee Menu Permissions**: Get all menus and permissions

### 7. Companies
- **Get Companies**: Get all companies
- **Create Company**: Create new company
- **Get Company by ID**: Get company by ID
- **Update Company**: Update company
- **Delete Company**: Delete company

### 8. Departments
- **Get Departments**: Get all departments
- **Create Department**: Create new department
- **Get Department by ID**: Get department by ID
- **Update Department**: Update department
- **Delete Department**: Delete department
- **Get Departments by Company**: Get all departments by company ID

### 9. Titles
- **Get Titles**: Get all titles
- **Create Title**: Create new title
- **Get Title by ID**: Get title by ID
- **Update Title**: Update title
- **Delete Title**: Delete title
- **Get Titles by Department**: Get all titles by department ID

### 10. Customers
- **Get Customers**: Get all customers
- **Create Customer**: Create new customer
- **Get Customer by ID**: Get customer by ID
- **Update Customer**: Update customer
- **Delete Customer**: Delete customer

### 11. Bank Accounts
- **Get Bank Accounts**: Get all bank accounts
- **Create Bank Account**: Create new bank account
- **Get Bank Account by ID**: Get bank account by ID
- **Update Bank Account**: Update bank account
- **Delete Bank Account**: Delete bank account

### 12. Menu Has Permissions
- **Get Menu Permissions**: Get all menu-permission relationships
- **Update Menu Permission**: Create or delete menu-permission relationship
- **Get Permissions by Menu**: Get all permissions for a specific menu

## Cara Menggunakan

### 1. Login Terlebih Dahulu

Sebelum menggunakan endpoint yang memerlukan authentication:

1. Buka folder **Authentication** atau **SSO Authentication**
2. Pilih request **Admin Signin** atau **SSO Login**
3. Isi username dan password
4. Klik **Send**
5. Copy token dari response
6. Update environment variable `token` dengan token yang didapat

### 2. Menggunakan Request

1. Pilih request yang ingin digunakan
2. Pastikan environment variable sudah diset dengan benar
3. Untuk request yang memerlukan ID (seperti `{{ employee_id }}`), update di URL atau body
4. Klik **Send** untuk mengirim request
5. Lihat response di panel bawah

### 3. Update Request Body

Untuk request yang memerlukan body:

1. Klik tab **Body**
2. Pilih format body (JSON, Form Data, dll)
3. Edit body sesuai kebutuhan
4. Untuk multipart/form-data (upload file), klik **Add File** untuk upload file

### 4. Menggunakan Environment Variables

Collection menggunakan environment variables untuk:
- `{{ base_url }}`: Base URL API
- `{{ token }}`: JWT token untuk authentication
- `{{ system_id }}`, `{{ employee_id }}`, dll: ID untuk parameter path

Anda bisa mengubah nilai ini di environment settings.

## Tips

1. **Simpan Response**: Gunakan fitur **Save Response** untuk menyimpan response yang penting
2. **Duplicate Request**: Klik kanan pada request → **Duplicate** untuk membuat variasi request
3. **Generate Code**: Klik kanan pada request → **Generate Code** untuk generate code di berbagai bahasa
4. **Environment Switching**: Gunakan dropdown environment untuk switch antara development dan production
5. **Request History**: Lihat history request di tab **Timeline**

## Troubleshooting

### Token Expired
Jika mendapat error 401 Unauthorized:
1. Lakukan login ulang
2. Update environment variable `token` dengan token baru

### Request Not Found (404)
1. Pastikan base_url sudah benar
2. Pastikan endpoint path sudah benar
3. Pastikan server API sudah running

### Connection Error
1. Pastikan server API sudah running
2. Cek firewall atau network settings
3. Pastikan base_url mengarah ke server yang benar

## Catatan

- Collection ini dibuat berdasarkan dokumentasi Swagger yang ada
- Beberapa endpoint mungkin memerlukan permission tertentu
- Pastikan server API sudah running sebelum melakukan testing
- Untuk production, gunakan `gateway_url` sebagai base_url

