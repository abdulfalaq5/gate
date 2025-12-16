# Panduan Migrasi Database di Docker

## 🚀 Cara Menjalankan Migrasi Database

### Metode 1: Menggunakan docker exec (Recommended)

Jika container sudah berjalan, jalankan migrasi dengan:

```bash
# Menggunakan container name
docker exec api-gate-sso npm run migrate

# Atau menggunakan docker-compose (jika menggunakan docker-compose)
docker-compose exec api npm run migrate
```

**Catatan:** 
- Container name: `api-gate-sso`
- Script migrate akan menggunakan environment `production` karena `NODE_ENV=production` di docker-compose.yml
- Pastikan file `.env` sudah dikonfigurasi dengan benar untuk koneksi database

### Metode 2: Menggunakan docker-compose run (One-time)

Jika ingin menjalankan migrasi tanpa harus container running:

```bash
docker-compose run --rm api npm run migrate
```

### Metode 3: Masuk ke Container dan Jalankan Manual

Jika ingin lebih kontrol atau debug:

```bash
# Masuk ke container
docker exec -it api-gate-sso sh

# Di dalam container, jalankan:
npm run migrate

# Atau langsung dengan knex
npx knex --knexfile src/knexfile.js migrate:latest
```

### Metode 4: Rollback Migrasi (Jika Perlu)

```bash
# Rollback migrasi terakhir
docker exec api-gate-sso npx knex --knexfile src/knexfile.js migrate:rollback

# Rollback semua migrasi
docker exec api-gate-sso npx knex --knexfile src/knexfile.js migrate:rollback --all
```

### Metode 5: Cek Status Migrasi

```bash
# Lihat status migrasi yang sudah dijalankan
docker exec api-gate-sso npx knex --knexfile src/knexfile.js migrate:status
```

## 📋 Prasyarat

1. **Pastikan container sudah running:**
   ```bash
   docker ps | grep api-gate-sso
   ```

2. **Pastikan file `.env` sudah dikonfigurasi:**
   - `DB_HOST_PROD` - Host database (bisa IP atau hostname di network `infra_net`)
   - `DB_PORT_PROD` - Port database (default: 5432)
   - `DB_USER_PROD` - Username database
   - `DB_PASS_PROD` - Password database
   - `DB_NAME_PROD` - Nama database
   - `DB_CLIENT_PROD` - Client database (biasanya `pg` untuk PostgreSQL)

3. **Pastikan database sudah bisa diakses dari container:**
   - Database harus bisa diakses dari network `infra_net`
   - Test koneksi jika perlu

## 🔍 Troubleshooting

### Error: Cannot connect to database

**Solusi:**
- Pastikan `DB_HOST_PROD` di `.env` menggunakan hostname atau IP yang bisa diakses dari network `infra_net`
- Jika database di container lain, gunakan service name atau container name
- Test koneksi dari dalam container:
  ```bash
  docker exec api-gate-sso node -e "const knex = require('knex')(require('./src/knexfile.js').production); knex.raw('SELECT 1').then(() => { console.log('Connected!'); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });"
  ```

### Error: Migration table not found

**Solusi:**
- Knex akan otomatis membuat tabel `migrations` saat pertama kali dijalankan
- Pastikan user database memiliki permission untuk create table

### Error: Extension uuid-ossp not found

**Solusi:**
- Extension harus dibuat oleh superuser di database
- Jalankan dari host machine atau container database:
  ```bash
  psql -U postgres -d <database_name> -c "CREATE EXTENSION IF NOT EXISTS uuid-ossp;"
  ```

## 📝 Contoh Lengkap

```bash
# 1. Pastikan container running
docker ps | grep api-gate-sso

# 2. Cek status migrasi saat ini
docker exec api-gate-sso npx knex --knexfile src/knexfile.js migrate:status

# 3. Jalankan migrasi
docker exec api-gate-sso npm run migrate

# 4. Verifikasi migrasi berhasil
docker exec api-gate-sso npx knex --knexfile src/knexfile.js migrate:status
```

## 🎯 Quick Command Reference

```bash
# Migrasi
docker exec api-gate-sso npm run migrate

# Status
docker exec api-gate-sso npx knex --knexfile src/knexfile.js migrate:status

# Rollback
docker exec api-gate-sso npx knex --knexfile src/knexfile.js migrate:rollback

# Masuk ke container
docker exec -it api-gate-sso sh
```

