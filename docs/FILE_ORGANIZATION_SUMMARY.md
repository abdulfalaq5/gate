# File Organization Summary

Dokumentasi ini menjelaskan reorganisasi file-file dalam proyek untuk membuat struktur yang lebih rapih dan terorganisir.

## 📁 Struktur File Yang Dipindahkan

### 📄 Dokumentasi (.md) → `docs/`
File-file dokumentasi teknis yang sebelumnya berada di direktori utama telah dipindahkan ke folder `docs/`:

- `CURL_EXAMPLE_MULTIPART.md`
- `DASHBOARD_COMPLETE_SUMMARY.md`
- `EMPLOYEES_PERMISSION_DETAIL_UPDATE.md`
- `MONITORING_SETUP.md`
- `MONITORING_SUMMARY.md`
- `PERMISSIONS_ENDPOINTS_DOCUMENTATION.md`
- `SSO_LOGIN_EMPLOYEE_FOTO_UPDATE.md`
- `SSO_PROFILE_MULTIPART_UPDATE.md`
- `USERS_FILTER_FIX_DOCUMENTATION.md`

### 🔧 Script (.sh) → `scripts/`
File-file shell script dari direktori utama telah dipindahkan ke folder `scripts/`:

- `deploy-production-seeders.sh`
- `deploy-seeders.sh`
- `deploy-server.sh`
- `direct-export-grafana.sh`
- `setup-complete-monitoring.sh`
- `setup-monitoring-integration.sh`
- `setup-rabbitmq.sh`
- `setup-server-dirs.sh`
- `setup-sso.sh`
- `update-rabbitmq-config.sh`

### 📝 Contoh & Sample → `examples/`
File-file contoh dan sample data:

- `external-system-example.js`
- `external-system-package.json`
- `external-system-with-bearer-token.js`
- `data_karyawan_lengkap_advanced.csv`

### ⚙️ Konfigurasi → `config/`

#### CI/CD (`config/ci-cd/`)
File-file Continuous Integration dan Deployment:
- `Jenkinsfile`
- `Jenkinsfile.server`
- `bitbucket-pipelines.yml`

#### Deployment (`config/deployment/`)
File-file konfigurasi deployment Docker:
- `docker-compose.dev.yml`
- `docker-compose.server.yml`
- `docker-compose.yml`

#### Development (`config/`)
File-file konfigurasi development:
- `environment.example`
- `Makefile.sample`
- `check-db-data.js` → dipindahkan ke `scripts/`

## 🗂️ File Yang Tetap Di Root

File-file berikut tetap berada di direktori utama mengikuti konvensi standar:

### Dokumentasi Penting
- `README.md` - Dokumentasi utama proyek
- `CHANGELOG.md` - Riwayat perubahan versi
- `CONTRIBUTING.md` - Panduan kontribusi
- `CONTRIBUTORS.md` - Daftar kontributor
- `LICENSE` - Lisensi proyek

### Folder Struktural
- `src/` - Source code aplikasi
- `docs/` - Dokumentasi lengkap
- `scripts/` - Script dan utiliti
- `examples/` - File contoh dan sample
- `config/` - Konfigurasi proyek
- `docker/` - Dockerfile
- `test/` - File testing
- `public/` - File static asset
- `static/` - Asset static (font, dll)
- `logs/` - Log aplikasi
- `uploads/` - File upload temporary
- `monitoring/` - Konfigurasi monitoring
- `grafana-config/` - Konfigurasi Grafana
- `grafana-data/` - Data Grafana
- `prometheus-config/` - Konfigurasi Prometheus
- `prometheus-data/` - Data Prometheus
- `node_modules/` - Dependencies npm

### File Konfigurasi Proyek
- `package.json` - Dependencies dan scripts npm
- `package-lock.json` - Lock file npm

## 🎯 Manfaat Reorganisasi

1. **Navigasi Lebih Mudah**: File-file terorganisir berdasarkan fungsinya
2. **Maintenance Lebih Efisien**: Konfigurasi terpisah dari source code
3. **Documentation Terpusat**: Semua dokumentasi ada di satu tempat
4. **Script Management**: Semua script berada di folder dedicated
5. **Clean Root Directory**: Root direktori lebih bersih dan fokus

## 📋 Panduan Penggunaan

### Menjalankan Script
```bash
# Script dari root tidak bisa dijalankan langsung lagi
# Gunakan path lengkap atau pindah ke folder scripts
cd scripts
./setup-sso.sh

# Atau dari root
./scripts/setup-sso.sh
```

### Mengakses Dokumentasi
```bash
# Semua dokumentasi sekarang berada di folder docs
ls docs/
cat docs/MONITORING_SETUP.md
```

### Mengakses Konfigurasi
```bash
# File environment
cp config/environment.example .env

# Docker compose files
docker-compose -f config/deployment/docker-compose.dev.yml up

# CI/CD files
ls config/ci-cd/
```

## ⚠️ Breaking Changes

Perhatikan perubahan berikut yang mungkin mempengaruhi workflow existing:

1. **Script Execution**: Script yang dipindahkan perlu path yang diperpanjang
2. **Documentation Links**: Link internal ke dokumentasi perlu diupdate
3. **CI/CD Pipeline**: Path ke file konfigurasi mungkin perlu diupdate
4. **Development Setup**: Pindahkan ke folder scripts untuk menjalankan setup script

## 🔄 Update Yang Diperlukan

1. **README.md**: Update path references
2. **CI/CD Pipeline**: Update path ke file konfigurasi
3. **Documentation**: Update internal links
4. **Script References**: Update referensi ke script dalam dokumentasi

---

*Dokumentasi ini dibuat setelah reorganisasi file pada tanggal: $(date)*
