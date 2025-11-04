# Quick Start - Jalankan Docker di Local

Panduan cepat untuk menjalankan aplikasi Gate API menggunakan Docker di local Anda.

## 🚀 Quick Start (3 Langkah)

### 1️⃣ Copy Environment File

```bash
cp config/environment.example .env
```

### 2️⃣ Edit Konfigurasi Database di .env

Edit file `.env` dan ubah bagian database:

```env
# Untuk local Docker, ganti localhost menjadi gate-database
DB_HOST_DEV=gate-database
DB_HOST_PROD=gate-database
```

### 3️⃣ Jalankan

**Opsi A: Gunakan Script (Recommended)**
```bash
./docker-start.sh
```
Pilih opsi yang diinginkan dari menu.

**Opsi B: Manual**
```bash
# Production
docker-compose -f docker-compose.prod.yml up -d

# Development  
docker-compose -f docker-compose.dev.yml up -d

# Semua (Prod + Dev + Database + Nginx)
docker-compose up -d
```

## 🎯 Akses Aplikasi

- ✅ Production API: http://localhost:9509
- ✅ Development API: http://localhost:9513
- ✅ Health Check: http://localhost:9509/health
- ✅ Health Check Dev: http://localhost:9513/health

## 📦 Services yang Dijalankan

### Production Mode
- Container: `gate-api-production`
- Port: 9509
- Environment: production

### Development Mode
- Container: `gate-api-development`
- Port: 9513
- Environment: development
- Hot reload: ✅ (nodemon)

### Database (jika menggunakan docker-compose.yml)
- Container: `gate-database`
- Port: 5432
- Image: postgres:15-alpine

### Nginx (jika menggunakan docker-compose.yml)
- Container: `gate-nginx`
- Port 80: Production reverse proxy
- Port 8080: Development reverse proxy

## 🔧 Perintah Berguna

```bash
# Lihat logs
docker-compose logs -f api

# Restart service
docker-compose restart api

# Stop semua
docker-compose down

# Lihat status
docker-compose ps

# Jalankan migration
docker-compose exec api npm run migrate

# Akses container shell
docker-compose exec api sh
```

## 🐛 Troubleshooting

### Error: Cannot connect to database

Pastikan `.env` menggunakan:
```env
DB_HOST_DEV=gate-database
DB_HOST_PROD=gate-database
```

Bukan `localhost`!

### Port sudah digunakan

Edit `docker-compose.yml` dan ubah port mapping:
```yaml
ports:
  - "9509:9509"  # Host:Container
```

### Container tidak start

Check logs:
```bash
docker-compose logs api
docker-compose logs database
```

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lengkap, lihat [DOCKER_SETUP.md](./DOCKER_SETUP.md)

## 🎓 Next Steps

1. ✅ Setup environment file
2. ✅ Jalankan container
3. ✅ Test health endpoint
4. ✅ Run database migration
5. ✅ Test API endpoints

Selamat coding! 🎉

