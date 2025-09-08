# Express.js Boilerplate

Boilerplate Express.js dengan struktur modular yang lengkap untuk pengembangan API. Dilengkapi dengan sistem autentikasi, validasi, database migration, dan dokumentasi Swagger.

## Fitur Utama

- ✅ **Struktur Modular**: Organisasi kode yang bersih dengan pola MVC
- ✅ **Sistem Autentikasi**: JWT-based authentication dengan multiple user types
- ✅ **Database Migration**: Knex.js untuk PostgreSQL dengan migration dan seeder
- ✅ **Validasi Input**: Express-validator dan Joi untuk validasi data
- ✅ **Rate Limiting**: Perlindungan dari brute force attacks
- ✅ **Swagger Documentation**: Dokumentasi API otomatis
- ✅ **Email System**: Template email dengan Edge.js
- ✅ **File Upload**: Multer untuk handling file upload
- ✅ **Queue System**: RabbitMQ untuk background jobs
- ✅ **Logging**: Morgan untuk HTTP logging
- ✅ **Security**: XSS protection dan CORS
- ✅ **Docker Support**: Containerization untuk development dan production

## Struktur Proyek

```
├── src/
│   ├── config/           # Konfigurasi database, AWS, dll
│   ├── modules/          # Business logic modules
│   │   ├── auth/         # Module autentikasi (contoh)
│   │   └── helpers/      # Utility functions
│   ├── middlewares/      # Custom middlewares
│   ├── routes/          # API routes
│   ├── repository/      # Database layer
│   │   └── postgres/    # PostgreSQL migrations & seeders
│   ├── utils/           # Helper utilities
│   ├── static/          # Swagger documentation
│   ├── templates/       # Email templates
│   ├── views/          # View templates
│   ├── listeners/      # RabbitMQ listeners
│   ├── scripts/        # Background scripts
│   └── debug/          # Debug utilities
├── docker/             # Docker configurations
├── public/            # Static files
└── logs/              # Application logs
```

## Getting Started

### Prerequisites

- Node.js (v16 atau lebih baru)
- PostgreSQL
- Redis (opsional)
- RabbitMQ (opsional)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd express-boilerplate
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.sample .env
# Edit .env file sesuai kebutuhan
```

4. **Setup database**
```bash
# Run migrations
npm run migrate

# Run seeders (opsional)
knex seed:run --cwd=src
```

5. **Start development server**
```bash
npm run dev
```

### Environment Variables

Buat file `.env` dengan konfigurasi berikut:

```env
# Application
NODE_ENV=development
APP_NAME=Express Boilerplate
APP_PORT=3000
JSON_LIMIT=1gb

# Database
DB_CLIENT_DEV=pg
DB_HOST_DEV=localhost
DB_PORT_DEV=5432
DB_USER_DEV=your_username
DB_PASS_DEV=your_password
DB_NAME_DEV=your_database

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password

# AWS (opsional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# RabbitMQ (opsional)
RABBITMQ_URL=amqp://localhost:5672

# Swagger
SWAGGER_ENABLED=development
```

## Usage

### Menjalankan Aplikasi

```bash
# Development
npm run dev

# Production
npm start

# Background consumer
npm run consumer
```

### Database Operations

```bash
# Create migration
knex migrate:make create_table_name --cwd=src

# Run migrations
npm run migrate

# Create seeder
knex seed:make seed_name --cwd=src

# Run seeders
knex seed:run --cwd=src
```

### Swagger Documentation

```bash
# Enable swagger
npm run swagger:enable

# Disable swagger
npm run swagger:disable

# Check status
npm run swagger:status
```

Akses dokumentasi di: `http://localhost:3000/documentation`

## Docker

### Development

```bash
# Build and start
docker-compose -f docker-compose.dev.yml up --build

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Production

```bash
# Build and start
docker-compose -f docker-compose.server.yml up --build -d

# Stop
docker-compose -f docker-compose.server.yml down
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/signin` - Admin login
- `POST /api/v1/auth/customer/signin` - Customer login
- `POST /api/v1/auth/customer/register` - Customer registration
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/refresh-token` - Refresh token

### Health Check

- `GET /` - Application health check

## Menambah Module Baru

1. **Buat struktur module**
```bash
mkdir src/modules/new_module
cd src/modules/new_module
```

2. **Buat file-file yang diperlukan**
- `index.js` - Routes
- `handler.js` - Business logic
- `validation.js` - Input validation
- `postgre_repository.js` - Database operations

3. **Register module di routes**
```javascript
// src/routes/V1/index.js
const newModule = require('../../modules/new_module')
routing.use(`${API_TAG}/new-module`, verifyToken, newModule)
```

4. **Buat migration**
```bash
knex migrate:make create_new_module_table --cwd=src
```

5. **Update Swagger documentation**
- Tambah schema di `src/static/schema/`
- Tambah path di `src/static/path/`

## Code Style

- **Variables**: camelCase
- **Constants**: UPPER_CASE
- **Classes**: PascalCase
- **Files**: snake_case
- **Functions**: Verb (getUser, createUser)
- **Variables**: Noun (userData, userList)

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.