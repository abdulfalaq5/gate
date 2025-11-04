# Database Utility Scripts

Script-script untuk testing dan troubleshooting database connection.

## Scripts

### test-db-connection.js
Test koneksi database dan cek tabel employees.

```bash
# Dari host machine
docker-compose exec app node /app/scripts/database-utils/test-db-connection.js

# Atau dengan volume mount (tambahkan di docker-compose.yml jika perlu)
docker-compose exec app sh -c "cd /app && DB_NAME_DEV=gate_db node scripts/database-utils/test-db-connection.js"
```

### list-tables.js
List semua tabel di database.

```bash
docker-compose exec app sh -c "cd /app && DB_NAME_DEV=gate_db node scripts/database-utils/list-tables.js"
```

### create-database.js
Membuat database baru (jika diperlukan).

```bash
docker-compose exec app sh -c "cd /app && node scripts/database-utils/create-database.js"
```

### fix-database.js
Mencari dan memperbaiki database yang tersedia.

```bash
docker-compose exec app sh -c "cd /app && node scripts/database-utils/fix-database.js"
```

### create-extension.sh
Membuat extension uuid-ossp di database (perlu superuser).

```bash
# Jalankan dari host machine
cd scripts/database-utils
DB_HOST=localhost DB_PORT=5432 DB_USER=postgres DB_NAME=gate_db ./create-extension.sh
```

## Catatan

- Script-script ini untuk development/testing purposes
- Beberapa script memerlukan akses database dengan privileges tertentu
- Pastikan konfigurasi database di `.env` sudah benar sebelum menjalankan script
- Script akan membaca environment variable dari `.env` file

