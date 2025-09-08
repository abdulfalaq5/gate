# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial boilerplate structure
- Authentication module with JWT
- Database migration system
- Swagger documentation
- Docker support
- Email system with templates
- File upload functionality
- Rate limiting
- Input validation
- Error handling middleware
- Logging system

### Changed
- Cleaned up modules to keep only auth as example
- Updated package.json for boilerplate
- Simplified routes structure
- Updated documentation

### Removed
- Unnecessary modules and dependencies
- Unused migrations and seeders
- Redundant configuration files

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Express.js Boilerplate
- Complete authentication system
- Modular architecture
- PostgreSQL integration with Knex.js
- Swagger API documentation
- Docker containerization
- Email system with Edge.js templates
- File upload with Multer
- RabbitMQ integration
- Rate limiting with express-rate-limit
- Input validation with express-validator
- Security middleware (XSS protection, CORS)
- Comprehensive logging
- Environment configuration
- Database migrations and seeders
- Helper utilities
- Debug tools
- Background job processing

### Features
- **Authentication**: JWT-based auth with multiple user types
- **Database**: PostgreSQL with Knex.js ORM
- **Documentation**: Swagger/OpenAPI integration
- **Containerization**: Docker support for development and production
- **Email**: Template-based email system
- **File Upload**: Secure file handling with validation
- **Queue System**: RabbitMQ for background jobs
- **Security**: Rate limiting, XSS protection, input validation
- **Logging**: Comprehensive request and error logging
- **Modular**: Clean module-based architecture

### Technical Stack
- Node.js + Express.js
- PostgreSQL + Knex.js
- JWT for authentication
- Swagger for API documentation
- Docker for containerization
- RabbitMQ for message queuing
- Edge.js for email templates
- Multer for file uploads
- Express-validator for input validation
- Morgan for HTTP logging
- Compression middleware
- XSS protection
- Rate limiting

---

## Version Format

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Perubahan yang tidak kompatibel dengan versi sebelumnya
- **MINOR**: Fitur baru yang kompatibel dengan versi sebelumnya  
- **PATCH**: Bug fixes yang kompatibel dengan versi sebelumnya

## Change Types

- **Added**: Fitur baru
- **Changed**: Perubahan pada fitur yang sudah ada
- **Deprecated**: Fitur yang akan dihapus di versi mendatang
- **Removed**: Fitur yang sudah dihapus
- **Fixed**: Bug fixes
- **Security**: Perbaikan keamanan
