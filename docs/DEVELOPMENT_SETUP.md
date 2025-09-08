# Core API MSI - Development Setup Guide

Panduan untuk setup environment development Core API MSI dengan port 9513.

## Prerequisites

- Docker dan Docker Compose terinstall
- Node.js 22+ (untuk development lokal)
- Git

## Port Configuration

- **Development**: Port 9513
- **Production/Server**: Port 9509

## Quick Start Development

### Option 1: Menggunakan Makefile (Recommended)

```bash
# Build image development
make docker-dev-build

# Start environment development
make docker-dev-up

# Lihat logs development
make docker-dev-logs

# Stop environment development
make docker-dev-down
```

### Option 2: Menggunakan Docker Compose langsung

```bash
# Build image development
docker-compose -f docker-compose.dev.yml build

# Start environment development
docker-compose -f docker-compose.dev.yml up -d

# Lihat logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop environment
docker-compose -f docker-compose.dev.yml down
```

## Environment Variables untuk Development

Buat file `.env` di root directory dengan konfigurasi berikut:

```env
# Application Configuration
NODE_ENV=development
APP_PORT=9513
APP_NAME=Core API MSI

# Database Configuration (Development)
DB_CLIENT_DEV=postgresql
DB_HOST_DEV=localhost
DB_PORT_DEV=5432
DB_NAME_DEV=core_api_msi_dev
DB_USER_DEV=postgres
DB_PASS_DEV=password

# RabbitMQ Configuration
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_ENCRYPTION=true
IGNORE_TLS=false

# Elastic APM Configuration (Disabled for development)
APM_SERVICE_URL=
APM_SERVICE_NAME=
APM_SERVICE_TOKEN=
ELASTIC_APM_SERVER_URL=
ELASTIC_APM_SECRET_TOKEN=
ELASTIC_APM_SERVICE_NAME=
ELASTIC_APM_ENVIRONMENT=development
ELASTIC_APM_ACTIVE=false
ELASTIC_APM_DISABLED=true

# Swagger Configuration
SWAGGER_ENABLED=development

# JSON Limit (1 GB untuk upload file)
JSON_LIMIT=1gb
```

## Available Commands

### Development Management

```bash
# Build image development
make docker-dev-build

# Start environment development
make docker-dev-up

# Start environment development dengan logs
make docker-dev-up-watch

# Stop environment development
make docker-dev-down

# Restart environment development
make docker-dev-restart

# Lihat logs development
make docker-dev-logs

# Akses container shell development
make docker-shell-dev
```

### Health Checks

```bash
# Check health development
make health-dev

# Check health production
make health

# Check health server
make health-server
```

### Database Commands (Development)

```bash
# Run migrations development
make docker-migrate-dev

# Create migration file development
make docker-migrate-make-dev name=migration_name

# Rollback migration development
make docker-migrate-rollback-dev

# Run seeds development
make docker-seed-dev

# Create seed file development
make docker-seed-make-dev name=seed_name

# Check migration status development
make docker-migrate-status-dev
```

## Development Features

### Auto-reload dengan Nodemon

Environment development menggunakan `nodemon` untuk auto-reload ketika ada perubahan file:

- File changes akan otomatis restart server
- Logs akan muncul di terminal
- Tidak perlu manual restart container

### Volume Mounts

Development environment menggunakan volume mounts untuk:

- Source code: `.:/app` (real-time sync)
- Node modules: `/app/node_modules` (isolated)
- Logs: `./logs:/app/logs` (persistent)

### Hot Reload

Karena menggunakan volume mount, perubahan pada source code akan langsung terlihat di container tanpa perlu rebuild.

## Testing API Development

Setelah container running, API dapat diakses di:

```bash
# Health check
curl http://localhost:9513/health

# Base endpoint
curl http://localhost:9513/

# Swagger documentation (jika enabled)
curl http://localhost:9513/documentation
```

## Troubleshooting Development

### Container tidak start

```bash
# Check logs
make docker-dev-logs

# Check container status
docker-compose -f docker-compose.dev.yml ps

# Rebuild image
make docker-dev-build
```

### Port sudah digunakan

```bash
# Check apa yang menggunakan port 9513
lsof -i :9513

# Stop service yang konflik atau ganti port di docker-compose.dev.yml
```

### Permission errors

```bash
# Pastikan directory logs ada
mkdir -p logs

# Set permission yang benar
chmod -R 755 logs
```

### Database connection errors

```bash
# Pastikan database PostgreSQL running
# Dan konfigurasi di .env sudah benar
```

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Port | 9513 | 9509 |
| Environment | development | production |
| Auto-reload | ✅ (nodemon) | ❌ |
| Volume mounts | ✅ (source code) | ❌ |
| Logs | Verbose | Production format |
| Swagger | Enabled | Configurable |
| APM | Disabled | Configurable |

## Next Steps

1. Setup database PostgreSQL lokal
2. Setup RabbitMQ lokal (opsional)
3. Setup Redis lokal (opsional)
4. Konfigurasi email SMTP
5. Jalankan migrations dan seeds
6. Test API endpoints 