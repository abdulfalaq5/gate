# INSTRUKSI PERBAIKAN ERROR ECONNREFUSED

## Masalah yang Ditemukan:
✅ Koneksi ke database BERHASIL (host.docker.internal bekerja)
❌ Database "gate_sso" TIDAK ADA di PostgreSQL
✅ Database "gate_db" ADA tapi KOSONG (belum ada tabel)

## Solusi 1: Gunakan Database yang Ada (gate_db)

Update file `.env` Anda:
```env
# Ganti dari gate_sso ke gate_db
DB_NAME_DEV=gate_db
DB_NAME_PROD=gate_db
DB_NAME_TEST=gate_db
```

Lalu jalankan migrasi:
```bash
docker-compose exec app npm run migrate
```

## Solusi 2: Buat Database gate_sso Baru

Jika Anda memang perlu database "gate_sso", buat database baru:

```bash
# Dari host machine (bukan dari dalam container)
psql -U msiserver -h localhost -c "CREATE DATABASE gate_sso;"
```

Atau dari dalam container:
```bash
docker-compose exec app sh -c "PGPASSWORD=\$DB_PASS_DEV psql -h host.docker.internal -U \$DB_USER_DEV -d postgres -c 'CREATE DATABASE gate_sso;'"
```

Lalu jalankan migrasi:
```bash
docker-compose exec app npm run migrate
```

## Setelah Perbaikan:

1. Restart container:
```bash
docker-compose restart
```

2. Test koneksi:
```bash
docker-compose exec app node test-db-connection.js
```

3. Test aplikasi SSO login lagi

## Catatan:
- Error ECONNREFUSED sudah tidak terjadi lagi ✅
- Masalah sekarang adalah database name yang salah
- Pastikan database name di `.env` sesuai dengan database yang ada di PostgreSQL

