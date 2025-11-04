# 🐳 Docker Setup Gate API - Ringkasan Lengkap

## 🎯 Apa yang Sudah Dibuat?

Sistem Docker lengkap untuk menjalankan aplikasi Gate API di local dan production server.

### 📁 File Docker yang Dibuat

#### Docker Compose Files
- **`docker-compose.yml`** - Setup lengkap dengan Production, Dev, Database, dan Nginx
- **`docker-compose.prod.yml`** - Production API saja (untuk deploy ke server)
- **`docker-compose.dev.yml`** - Development API saja (untuk local development)

#### Docker Configuration
- **`.dockerignore`** - Optimasi build Docker image
- **`docker-start.sh`** - Script interaktif untuk manage Docker

#### Nginx Configuration
- **`nginx/nginx.conf`** - Konfigurasi Nginx utama
- **`nginx/conf.d/gate.conf`** - Reverse proxy untuk API

#### Dokumentasi
- **`CARA_JALANKAN.md`** ⭐ - **MULAI DARI SINI** - Cara praktis menjalankan
- **`QUICK_START_DOCKER.md`** - Quick start dalam 3 langkah
- **`DOCKER_SETUP.md`** - Dokumentasi lengkap dan troubleshooting
- **`DOCKER_SUMMARY.md`** - Ringkasan setup Docker
- **`ENV_EXAMPLE_LOCAL.md`** - Contoh konfigurasi environment

## 🚀 Cara Cepat Menjalankan

### Untuk Local Development

```bash
# 1. Copy environment
cp config/environment.example .env

# 2. Edit .env - ubah database host
#    Cari dan ganti:
#    DB_HOST_DEV=gate-database
#    DB_HOST_PROD=gate-database  
#    POSTGRES_HOST=gate-database

# 3. Jalankan (pilih salah satu)
./docker-start.sh              # Menggunakan script
docker-compose up -d           # Manual

# 4. Test
curl http://localhost:9509/health
```

### Untuk Production Server

```bash
# 1. Setup environment
cp config/environment.example .env

# 2. Edit .env untuk database shared
#    DB_HOST_PROD=<ip-database-shared>

# 3. Deploy production
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Setup Nginx (lihat DOCKER_SETUP.md)
```

## 📊 Port Configuration

| Service | Port | Keterangan |
|---------|------|------------|
| Production API | 9509 | Untuk Customer di Server |
| Development API | 9513 | Untuk Dev di Server |
| PostgreSQL | 5432 | Database Local |
| Nginx (Prod) | 80 | Reverse Proxy Production |
| Nginx (Dev) | 8080 | Reverse Proxy Development |

## 🎯 Struktur Docker Compose

### docker-compose.yml (Full Setup)
```
gate-api-production    → Port 9509 (Production)
gate-api-development   → Port 9513 (Development)  
gate-database          → Port 5432 (PostgreSQL)
gate-nginx             → Port 80, 8080 (Reverse Proxy)
```

### docker-compose.prod.yml (Production Only)
```
gate-api-production    → Port 9509
```

### docker-compose.dev.yml (Dev Only)
```
gate-api-development   → Port 9513
gate-database-dev      → Port 5433
```

## 🔧 Environment Variables Penting

Edit file `.env` dan pastikan:

```env
# ⚠️ PENTING: Untuk Docker Local
DB_HOST_DEV=gate-database     # JANGAN gunakan localhost!
DB_HOST_PROD=gate-database    # JANGAN gunakan localhost!

# Application
APP_NAME=Gate-API
NODE_ENV=production  # atau development

# Security (ubah di production!)
SSO_JWT_SECRET=your-super-secret-jwt-key

# Features
MINIO_ENABLED=true
RABBITMQ_URL=disabled
```

## 📚 Dokumentasi Detail

| File | Deskripsi |
|------|-----------|
| **CARA_JALANKAN.md** | ⭐ **SILAKAN BACA INI PERTAMA** |
| QUICK_START_DOCKER.md | Quick start 3 langkah |
| DOCKER_SETUP.md | Dokumentasi lengkap setup & troubleshooting |
| DOCKER_SUMMARY.md | Ringkasan file dan konfigurasi |
| ENV_EXAMPLE_LOCAL.md | Contoh konfigurasi environment |

## 🔍 Troubleshooting Cepat

### ❌ Error: Cannot connect to database

```bash
# Pastikan .env menggunakan gate-database
DB_HOST_DEV=gate-database  # ✅ BENAR
DB_HOST_DEV=localhost      # ❌ SALAH
```

### ❌ Error: Port already in use

```bash
# Check apa yang menggunakan port
lsof -i :9509
lsof -i :9513

# Stop service atau ubah port di docker-compose.yml
```

### ❌ Container tidak mau start

```bash
# Check logs
docker-compose logs -f api
docker-compose logs -f database

# Rebuild
docker-compose up -d --build
```

## ✅ Checklist Setup

### Local Development
- [ ] Docker & Docker Compose terinstall
- [ ] File `.env` sudah di-copy
- [ ] Edit `.env`: DB_HOST = gate-database
- [ ] Run: `docker-compose up -d`
- [ ] Test: `curl localhost:9509/health`

### Production Server  
- [ ] Docker terinstall di server
- [ ] File `.env` dikonfigurasi untuk database shared
- [ ] Run: `docker-compose -f docker-compose.prod.yml up -d`
- [ ] Setup Nginx reverse proxy
- [ ] Test API endpoint

## 🎓 Perintah Berguna

```bash
# Menggunakan script (recommended)
./docker-start.sh

# Manual commands
docker-compose up -d              # Start all
docker-compose down               # Stop all
docker-compose logs -f            # View logs
docker-compose ps                 # Check status
docker-compose restart            # Restart
docker-compose exec api npm run migrate  # Migrate

# Docker commands
docker ps                         # List containers
docker logs gate-api-production   # View logs
docker exec -it gate-api-production sh  # Access shell
docker stats                      # Resource usage
```

## 🎯 Fitur Docker

### Security
- ✅ Non-root user di container
- ✅ Resource limits (1GB mem, 0.5 CPU)
- ✅ Network isolation

### Monitoring
- ✅ Health checks otomatis
- ✅ Auto restart jika crash
- ✅ Log volume mounting

### Development
- ✅ Hot reload dengan nodemon
- ✅ Volume mounting untuk code changes
- ✅ Separate environments

## 📞 Quick Reference

| Command | Description |
|---------|-------------|
| `./docker-start.sh` | Interactive menu |
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f api` | View logs |
| `docker-compose ps` | Check status |
| `curl localhost:9509/health` | Test production |
| `curl localhost:9513/health` | Test development |

## 🎉 Selesai!

Setup Docker sudah lengkap dan siap digunakan!

**Mulai dari**: Baca **CARA_JALANKAN.md** untuk instruksi step-by-step.

Untuk detail lengkap, lihat **DOCKER_SETUP.md**.

---

**Happy Coding! 🚀**

