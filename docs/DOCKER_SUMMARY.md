# Ringkasan Setup Docker - Gate API

## 📁 File yang Dibuat untuk Docker Setup

### 1. Docker Compose Files
- **`docker-compose.yml`** - Setup lengkap (Production + Dev + Database + Nginx)
- **`docker-compose.prod.yml`** - Production saja (untuk server deployment)
- **`docker-compose.dev.yml`** - Development saja (untuk local development)

### 2. Docker Configuration
- **`docker/Dockerfile`** - Already exists (Production image)
- **`docker/Dockerfile.dev`** - Already exists (Development image)
- **`.dockerignore`** - NEW - Mengoptimalkan build image

### 3. Nginx Configuration
- **`nginx/nginx.conf`** - NEW - Konfigurasi nginx utama
- **`nginx/conf.d/gate.conf`** - NEW - Reverse proxy untuk production dan dev
- **`nginx/logs/`** - NEW - Directory untuk nginx logs

### 4. Scripts & Automation
- **`docker-start.sh`** - NEW - Interactive script untuk manage docker
- **`ENV_EXAMPLE_LOCAL.md`** - NEW - Contoh environment untuk local

### 5. Documentation
- **`DOCKER_SETUP.md`** - NEW - Dokumentasi lengkap setup docker
- **`QUICK_START_DOCKER.md`** - NEW - Quick start guide
- **`DOCKER_SUMMARY.md`** - NEW - File ini (ringkasan)

## 🎯 Port Configuration

| Service | Container Port | Host Port | Keterangan |
|---------|---------------|-----------|------------|
| Production API | 9509 | 9509 | Untuk Customer |
| Development API | 9513 | 9513 | Untuk Dev |
| PostgreSQL | 5432 | 5432 (5433 untuk dev) | Database |
| Nginx (Production) | 80 | 80 | Reverse Proxy Prod |
| Nginx (Development) | 8080 | 8080 | Reverse Proxy Dev |

## 🚀 Cara Menggunakan

### Local Development

```bash
# 1. Copy environment
cp config/environment.example .env

# 2. Edit .env - ubah DB_HOST menjadi gate-database
#    DB_HOST_DEV=gate-database
#    DB_HOST_PROD=gate-database

# 3. Jalankan
docker-compose up -d

# Atau gunakan script
./docker-start.sh
```

### Production Server

```bash
# 1. Copy environment
cp config/environment.example .env

# 2. Edit .env - sesuaikan dengan database shared
#    DB_HOST_PROD=<ip-database-shared>
#    DB_USER_PROD=<your-user>
#    DB_PASS_PROD=<your-password>

# 3. Jalankan production
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Setup nginx di server (lihat DOCKER_SETUP.md)
```

## 📋 Services yang Tersedia

### docker-compose.yml (Local Full Setup)
- ✅ gate-api-production (Port 9509)
- ✅ gate-api-development (Port 9513)
- ✅ gate-database (Port 5432)
- ✅ gate-nginx (Port 80, 8080)

### docker-compose.prod.yml (Production Only)
- ✅ gate-api-production (Port 9509)

### docker-compose.dev.yml (Development Only)
- ✅ gate-api-development (Port 9513)
- ✅ gate-database-dev (Port 5433)

## 🔧 Environment Variables

Key environment variables yang perlu diatur:

```env
# Application
APP_NAME=Gate-API
APP_PORT=9588
NODE_ENV=production

# Database (PENTING: gunakan gate-database untuk local docker)
DB_HOST_PROD=gate-database  # untuk local
# atau
DB_HOST_PROD=103.169.73.226  # untuk production server

# Security
SSO_JWT_SECRET=your-secret-key

# Features
MINIO_ENABLED=true
RABBITMQ_URL=disabled
```

## 🐳 Docker Features

### Security
- ✅ Non-root user di container
- ✅ Resource limits (1GB memory, 0.5 CPU)
- ✅ Isolated network

### Monitoring
- ✅ Health checks
- ✅ Auto restart
- ✅ Log volume mounting

### Development
- ✅ Hot reload dengan nodemon
- ✅ Volume mounting untuk code changes
- ✅ Separate network untuk isolation

## 📖 Dokumentasi Detail

1. **QUICK_START_DOCKER.md** - Mulai cepat dalam 3 langkah
2. **DOCKER_SETUP.md** - Dokumentasi lengkap setup dan troubleshooting
3. **ENV_EXAMPLE_LOCAL.md** - Contoh konfigurasi environment

## 🔍 Troubleshooting

### Database Connection Error
```bash
# Pastikan .env menggunakan gate-database, bukan localhost
DB_HOST_PROD=gate-database
```

### Port Already in Use
```bash
# Edit docker-compose.yml dan ubah port mapping
ports:
  - "9509:9509"  # Host:Container
```

### Container Not Starting
```bash
# Check logs
docker-compose logs -f api

# Check status
docker-compose ps
```

## ✅ Checklist Setup

### Local Development
- [ ] Install Docker dan Docker Compose
- [ ] Copy .env dari config/environment.example
- [ ] Edit .env: DB_HOST = gate-database
- [ ] Run: docker-compose up -d
- [ ] Test: http://localhost:9509/health

### Production Server
- [ ] Install Docker di server
- [ ] Copy .env dan sesuaikan DB config
- [ ] Run: docker-compose -f docker-compose.prod.yml up -d
- [ ] Setup nginx reverse proxy
- [ ] Test: http://your-domain:9509/health

## 🎓 Next Steps

1. ✅ Setup environment file
2. ✅ Build dan jalankan containers
3. ✅ Test health endpoints
4. ✅ Run database migrations
5. ✅ Test API endpoints
6. ✅ Setup monitoring jika diperlukan

## 📞 Support

Jika ada masalah:
1. Check logs: `docker-compose logs -f`
2. Check status: `docker-compose ps`
3. Check network: `docker network ls`
4. Lihat troubleshooting di DOCKER_SETUP.md

---

**Happy Coding! 🚀**

