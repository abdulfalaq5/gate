# Setup Docker untuk Gate API

Dokumen ini menjelaskan cara setup dan menjalankan aplikasi Gate API menggunakan Docker di lokal dan production.

## Struktur Docker

Project ini menyediakan beberapa file docker-compose untuk berbagai keperluan:

### File Docker Compose

1. **docker-compose.yml** - Setup lengkap dengan production, development, database, dan nginx
2. **docker-compose.prod.yml** - Hanya production API untuk server deployment
3. **docker-compose.dev.yml** - Hanya development API untuk local development

### Port yang Digunakan

- **Port 9509** - Production API (untuk Customer di server)
- **Port 9513** - Development API (untuk Dev di server)
- **Port 5432** - PostgreSQL Database
- **Port 80** - Nginx Reverse Proxy (Production)
- **Port 8080** - Nginx Reverse Proxy (Development)

## Prasyarat

1. Docker dan Docker Compose terinstall di sistem
2. Database shared sudah tersedia di server (jika deployment)

## Setup untuk Local Development

### 1. Clone Repository

```bash
git clone <repository-url>
cd gate
```

### 2. Copy File Environment

Copy file environment dari config:

```bash
cp config/environment.example .env
```

### 3. Konfigurasi Database di .env

Edit file `.env` dan sesuaikan konfigurasi database untuk Docker:

```env
# Database Configuration untuk Docker Local
DB_CLIENT_DEV=pg
DB_HOST_DEV=gate-database  # Nama service di docker-compose
DB_PORT_DEV=5432
DB_USER_DEV=postgres
DB_PASS_DEV=postgres
DB_NAME_DEV=gate_db

DB_CLIENT_PROD=pg
DB_HOST_PROD=gate-database  # Nama service di docker-compose
DB_PORT_PROD=5432
DB_USER_PROD=postgres
DB_PASS_PROD=postgres
DB_NAME_PROD=gate_db
```

### 4. Jalankan Docker Compose

#### Opsi A: Jalankan Semua Services (Production + Dev + Database + Nginx)

```bash
docker-compose up -d
```

#### Opsi B: Jalankan Hanya Development

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### Opsi C: Jalankan Hanya Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Check Status Container

```bash
docker-compose ps
```

### 6. Lihat Logs

```bash
# Semua services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f api-dev
docker-compose logs -f database
```

### 7. Access API

- Production API: http://localhost:9509
- Development API: http://localhost:9513
- Nginx Production: http://localhost:80
- Nginx Development: http://localhost:8080
- Health Check: http://localhost:9509/health atau http://localhost:9513/health

## Setup untuk Production Server

Di server production, Anda memiliki:
1. Database shared yang sudah terinstall
2. Nginx yang sudah terinstall sebagai reverse proxy
3. Port 9509 untuk customer dan 9513 untuk dev

### 1. Upload Code ke Server

```bash
# Clone atau upload code ke server
git clone <repository-url>
cd gate
```

### 2. Copy Environment File

```bash
cp config/environment.example .env
```

### 3. Edit Konfigurasi Database Shared

Edit file `.env` dan sesuaikan dengan database shared di server:

```env
# Database Configuration untuk Production Server
DB_CLIENT_PROD=pg
DB_HOST_PROD=103.169.73.226  # IP atau hostname database shared
DB_PORT_PROD=5432
DB_USER_PROD=<your-db-user>
DB_PASS_PROD=<your-db-password>
DB_NAME_PROD=<your-db-name>

# Atau jika database shared di localhost
DB_HOST_PROD=host.docker.internal  # Untuk access host dari container
```

### 4. Jalankan Production Container

```bash
# Build dan jalankan production
docker-compose -f docker-compose.prod.yml up -d --build
```

### 5. Setup Nginx di Server

Jika nginx sudah terinstall di server, tambahkan konfigurasi berikut:

**File: `/etc/nginx/sites-available/gate-production`**

```nginx
upstream gate_production {
    server localhost:9509;
}

server {
    listen 9509;
    server_name your-domain.com;

    location / {
        proxy_pass http://gate_production;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings untuk import besar
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }

    location /health {
        proxy_pass http://gate_production/health;
        access_log off;
    }
}

upstream gate_development {
    server localhost:9513;
}

server {
    listen 9513;
    server_name dev.your-domain.com;

    location / {
        proxy_pass http://gate_development;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }

    location /health {
        proxy_pass http://gate_development/health;
        access_log off;
    }
}
```

Aktifkan dan restart nginx:

```bash
sudo ln -s /etc/nginx/sites-available/gate-production /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Database Migration

Setelah container berjalan, jalankan migration untuk database:

```bash
# Masuk ke container
docker-compose exec api bash

# Atau untuk development
docker-compose exec api-dev bash

# Jalankan migration
npm run migrate
```

## Maintenance

### Restart Services

```bash
# Restart semua
docker-compose restart

# Restart specific service
docker-compose restart api
docker-compose restart api-dev
```

### Stop Services

```bash
# Stop semua
docker-compose down

# Stop dan hapus volumes
docker-compose down -v
```

### Update Code

```bash
# Pull latest code
git pull

# Rebuild dan restart
docker-compose up -d --build
```

### Lihat Resource Usage

```bash
docker stats
```

### Backup Database

```bash
# Backup production database
docker-compose exec database pg_dump -U postgres gate_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Troubleshooting

### Container Tidak Bisa Start

1. Check logs:
```bash
docker-compose logs api
```

2. Check environment variables:
```bash
docker-compose exec api env
```

### Database Connection Error

1. Pastikan `DB_HOST_PROD` sesuai dengan nama service di docker-compose (gate-database)
2. Check network:
```bash
docker network ls
docker network inspect gate_gate-network
```

### Port Sudah Digunakan

Jika port sudah digunakan, edit docker-compose.yml dan ubah port mapping:

```yaml
ports:
  - "9509:9509"  # Format: host:container
```

### Nginx Tidak Bisa Akses Container

1. Pastikan nginx dan container di network yang sama
2. Gunakan host.docker.internal untuk access host dari container

## Env untuk Production Server

Contoh `.env` untuk production server:

```env
# Application Configuration
APP_NAME=Gate-API
NODE_ENV=production

# Database Production (Shared Database di Server)
DB_CLIENT_PROD=pg
DB_HOST_PROD=host.docker.internal  # atau IP database shared
DB_PORT_PROD=5432
DB_USER_PROD=your_db_user
DB_PASS_PROD=your_secure_password
DB_NAME_PROD=your_database_name

# RabbitMQ Configuration
RABBITMQ_URL=amqp://api_user:api_password@103.169.73.226:9505

# MinIO Configuration
MINIO_ENABLED=true
S3_ENDPOINT=https://minio-bucket.motorsights.com
S3_ACCESS_KEY_ID=your_minio_key
S3_SECRET_ACCESS_KEY=your_minio_secret

# Security
SSO_JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Disable unused features
SSO_EMAIL_ENABLED=false
RABBITMQ_URL=disabled  # jika tidak digunakan
```

## Fitur Docker

- **Health Checks** - Automatic health monitoring
- **Auto Restart** - Container restart otomatis jika crash
- **Resource Limits** - Memory dan CPU limits
- **Volume Mounting** - Logs, uploads, dan public files
- **Network Isolation** - Isolated network untuk security

## Support

Jika ada masalah, check:
1. Docker logs: `docker-compose logs`
2. Container status: `docker-compose ps`
3. Network: `docker network inspect gate_gate-network`
4. Environment variables: `docker-compose exec api env`

