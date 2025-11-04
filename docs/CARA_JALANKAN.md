# Cara Menjalankan Docker di Local Anda

## 📋 Langkah-langkah

### Step 1: Setup Environment

```bash
# Copy environment file (sudah dijalankan)
cp config/environment.example .env
```

### Step 2: Edit Database Configuration

Buka file `.env` dengan editor favorit Anda dan ubah:

```env
DB_HOST_DEV=gate-database    # Ubah dari localhost menjadi gate-database
DB_HOST_PROD=gate-database   # Ubah dari localhost menjadi gate-database
POSTGRES_HOST=gate-database  # Ubah dari localhost menjadi gate-database
```

### Step 3: Jalankan Docker

**Pilihan A: Menggunakan Script (Paling Mudah)**
```bash
./docker-start.sh
```

Pilih opsi dari menu:
- 1: Production API (Port 9509)
- 2: Development API (Port 9513)
- 3: Semua Services

**Pilihan B: Manual**
```bash
# Jalankan production dan development bersamaan dengan database dan nginx
docker-compose up -d --build
```

**Pilihan C: Hanya Production**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

**Pilihan D: Hanya Development**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

### Step 4: Check Status

```bash
docker-compose ps
```

### Step 5: Jalankan Migration (Setelah Database Running)

```bash
docker-compose exec api npm run migrate
```

### Step 6: Test API

Buka browser atau gunakan curl:

```bash
# Test Production API
curl http://localhost:9509/health

# Test Development API
curl http://localhost:9513/health
```

## 🎯 Akses Aplikasi

- **Production API**: http://localhost:9509
- **Development API**: http://localhost:9513
- **Health Check Production**: http://localhost:9509/health
- **Health Check Development**: http://localhost:9513/health

## 📝 Perintah Berguna

### Lihat Logs
```bash
# Semua logs
docker-compose logs -f

# Logs specific service
docker-compose logs -f api
docker-compose logs -f api-dev
docker-compose logs -f database
```

### Restart Services
```bash
docker-compose restart
docker-compose restart api
docker-compose restart api-dev
```

### Stop Services
```bash
docker-compose down
```

### Masuk ke Container
```bash
docker-compose exec api sh
docker-compose exec api-dev sh
```

### Check Resource Usage
```bash
docker stats
```

## 🐛 Troubleshooting

### Error: Cannot connect to database

**Solusi**: Pastikan di `.env` menggunakan `gate-database`, bukan `localhost`

```env
DB_HOST_DEV=gate-database
DB_HOST_PROD=gate-database
```

### Error: Port already in use

**Solusi**: Stop service yang menggunakan port tersebut atau ubah port di `docker-compose.yml`

```bash
# Check apa yang menggunakan port
lsof -i :9509
lsof -i :9513
```

### Container tidak mau start

**Solusi**: Check logs untuk detail error

```bash
docker-compose logs api
docker-compose logs database
```

### Error: permission denied

**Solusi**: Pastikan script executable

```bash
chmod +x docker-start.sh
```

## 📚 Dokumentasi Lengkap

- **QUICK_START_DOCKER.md** - Quick start guide
- **DOCKER_SETUP.md** - Dokumentasi lengkap dan troubleshooting
- **DOCKER_SUMMARY.md** - Ringkasan setup docker
- **ENV_EXAMPLE_LOCAL.md** - Contoh environment file

## ✅ Checklist

Setelah setup, pastikan:
- [ ] File `.env` sudah di-copy dan diedit
- [ ] DB_HOST menggunakan `gate-database`
- [ ] Docker running: `docker ps`
- [ ] Health check berhasil: `curl localhost:9509/health`
- [ ] Migration berjalan: `npm run migrate`

## 🎉 Selamat!

Aplikasi Anda sudah running di Docker! 

Untuk deployment ke server production, lihat **DOCKER_SETUP.md** bagian "Setup untuk Production Server"

