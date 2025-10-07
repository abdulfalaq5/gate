# Config Directory

Folder ini berisi semua file konfigurasi yang diperlukan untuk proyek Gate.

## 📁 Struktur Folder

### 🔄 CI/CD (`ci-cd/`)
File-file untuk Continuous Integration dan Continuous Deployment:

- `Jenkinsfile` - Konfigurasi Jenkins pipeline utama
- `Jenkinsfile.server` - Konfigurasi Jenkins untuk server
- `bitbucket-pipelines.yml` - Konfigurasi Bitbucket Pipelines

### 🚀 Deployment (`deployment/`)
File-file konfigurasi untuk deployment aplikasi:

- `docker-compose.dev.yml` - Konfigurasi Docker untuk development
- `docker-compose.server.yml` - Konfigurasi Docker untuk server/production
- `docker-compose.yml` - Konfigurasi Docker umum

### ⚙️ Root Config Files
File-file konfigurasi utama:

- `environment.example` - Template file environment variables
- `Makefile.sample` - Sample Makefile untuk development

## 📋 Cara Penggunaan

### Environment Setup
```bash
# Copy environment template
cp config/environment.example .env

# Edit sesuai kebutuhan
nano .env
```

### Docker Development
```bash
# Gunakan docker-compose untuk development
docker-compose -f config/deployment/docker-compose.dev.yml up --build

# Gunakan docker-compose untuk production
docker-compose -f config/deployment/docker-compose.server.yml up -d
```

### CI/CD Pipeline
```bash
# Untuk Jenkins
cat config/ci-cd/Jenkinsfile

# Untuk Bitbucket Pipelines
cat config/ci-cd/bitbucket-pipelines.yml
```

## 🔄 Migration Notes

File-file ini sebelumnya berada di direktori utama dan telah dipindahkan untuk:

1. **Memisahkan konfigurasi dari source code**
2. **Mengorganisir berdasarkan jenis konfigurasi**
3. **Menjaga direktori utama tetap bersih**
4. **Memudahkan management konfigurasi**

## ⚠️ Path Changes

Setelah reorganisasi, path yang digunakan untuk mengakses file konfigurasi berubah:

**Before:**
```bash
./Jenkinsfile
./docker-compose.dev.yml
./environment.example
```

**After:**
```bash
./config/ci-cd/Jenkinsfile
./config/deployment/docker-compose.dev.yml
./config/environment.example
```

Pastikan untuk update referensi ini di dokumentasi dan script yang ada.
