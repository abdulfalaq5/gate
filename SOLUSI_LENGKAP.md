# 🔧 SOLUSI LENGKAP ERROR ECONNREFUSED & DATABASE MIGRATION

## ✅ Status Testing

### 1. Koneksi Database: ✅ BERHASIL
- `host.docker.internal` bekerja dengan baik
- Error `ECONNREFUSED` sudah tidak terjadi lagi
- Database `gate_db` dapat diakses

### 2. Masalah yang Ditemukan:
- ❌ Extension `uuid-ossp` tidak bisa dibuat (permission denied)
- ❌ Function `uuid_generate_v4()` tidak ada di database
- ❌ Migration tidak bisa berjalan karena function tidak ada

## 📝 SOLUSI FINAL

### Step 1: Buat Extension uuid-ossp (HARUS dengan Superuser)

Jalankan dari **host machine** (bukan dari container) dengan user `postgres`:

```bash
# Option 1: Jika menggunakan postgres user default
psql -U postgres -d gate_db -c "CREATE EXTENSION IF NOT EXISTS uuid-ossp;"

# Option 2: Jika postgres user berbeda
sudo -u postgres psql -d gate_db -c "CREATE EXTENSION IF NOT EXISTS uuid-ossp;"

# Option 3: Connect ke PostgreSQL dan jalankan manual
psql -U postgres
\c gate_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

### Step 2: Setelah Extension Dibuat, Jalankan Migrasi

```bash
# Update .env untuk menggunakan gate_db
DB_NAME_DEV=gate_db
DB_NAME_PROD=gate_db
DB_NAME_TEST=gate_db

# Restart container
docker-compose restart

# Jalankan migrasi
docker-compose exec app npm run migrate
```

### Step 3: Test Koneksi Database

```bash
docker-compose exec app node test-db-connection.js
```

### Step 4: Test SSO Login

```bash
# Test endpoint SSO login
curl -X POST http://localhost:9518/api/auth/sso/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "client_id": "string",
    "redirect_uri": "string"
  }'
```

## 📋 File yang Sudah Dibuat untuk Testing

1. `test-db-connection.js` - Test koneksi database
2. `list-tables.js` - List semua tabel di database
3. `create-database.js` - Script untuk create database (tidak digunakan)
4. `fix-database.js` - Script untuk fix database
5. `create-extension.sh` - Script untuk create extension (perlu superuser)

## ⚠️ Catatan Penting

1. **Extension uuid-ossp** HARUS dibuat dengan superuser privileges
2. Database yang digunakan: `gate_db` (bukan `gate_sso`)
3. Pastikan `.env` file sudah benar:
   ```env
   DB_HOST_DEV=host.docker.internal
   DB_PORT_DEV=5432
   DB_USER_DEV=msiserver
   DB_PASS_DEV=your_password
   DB_NAME_DEV=gate_db
   ```

## 🎯 Next Steps

Setelah extension dibuat dan migrasi berhasil:
1. Test aplikasi SSO login
2. Pastikan tabel `employees` sudah ada
3. Pastikan data employee sudah ada untuk testing

