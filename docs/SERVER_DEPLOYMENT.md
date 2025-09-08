# Core API MSI - Server Deployment Guide

This guide explains how to deploy the Core API MSI application on a server with Docker, running only the API service (without database or Redis).

## Prerequisites

- Docker installed on the server
- Docker Compose installed
- Git (to clone the repository)
- Node.js 22+ (for local development only)

## Port Configuration

- **Development**: Port 9513
- **Production/Server**: Port 9509

## Quick Start

### Option 1: Using the deployment script (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd core-api-msi

# Make the deployment script executable
chmod +x deploy-server.sh

# Run the deployment
./deploy-server.sh
```

### Option 2: Using Makefile commands

```bash
# Build and start the server
make deploy-server

# Or step by step:
make setup-server-dirs
make docker-server-build
make docker-server-up
```

### Option 3: Using Docker Compose directly

```bash
# Setup directories first
./setup-server-dirs.sh

# Build the image
docker-compose -f docker-compose.server.yml build

# Start the service
docker-compose -f docker-compose.server.yml up -d
```

## Available Commands

### Server Management

```bash
# Setup server directories with proper permissions
make setup-server-dirs

# Start server environment (API only)
make docker-server-up

# Stop server environment
make docker-server-down

# Restart server environment
make docker-server-restart

# View server logs
make docker-server-logs

# Access server container shell
make docker-server-shell
```

### Health Checks

```bash
# Check server health
make health-server

# Check development health
make health-dev
```

### Deployment

```bash
# Deploy to server (API only)
make deploy-server

# Quick start server environment
make quick-server
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with your configuration:

```env
# Server Configuration
NODE_ENV=production
PORT=9501

# RabbitMQ Configuration (external server)
RABBITMQ_URL=amqp://guest:guest@103.169.73.226:5672

# Database Configuration (if connecting to external database)
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASS=your-database-password

# Redis Configuration (if connecting to external Redis)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Other application-specific variables
# ... add your other environment variables
```

### Docker Configuration

The server deployment uses `docker-compose.server.yml` which:

- Runs only the API service
- Maps port 9509 (host) to 9501 (container)
- Includes health checks
- Sets resource limits (1GB memory, 0.5 CPU)
- Mounts logs, public, and storages directories for persistence
- Connects to external RabbitMQ server at 103.169.73.226:5672

### Directory Structure

The application requires the following directory structure:

```
core-api-msi/
├── logs/
│   ├── listener/
│   ├── upload/
│   ├── email/
│   ├── queue/
│   ├── mail/
│   ├── image-ktp/
│   ├── pdf/
│   └── excel/
├── public/
│   ├── pdf/
│   └── excel/
└── storages/
    └── tmp/
```

These directories are automatically created by the setup scripts with proper permissions.

## Monitoring

### View Logs

```bash
# View real-time logs
make docker-server-logs

# View recent logs
docker-compose -f docker-compose.server.yml logs --tail=50
```

### Health Check

The API includes a health check endpoint:

```bash
curl http://localhost:9509/health
```

### Container Status

```bash
docker-compose -f docker-compose.server.yml ps
```

## Troubleshooting

### Common Issues

1. **Permission denied errors**
   ```bash
   # Run the directory setup script
   make setup-server-dirs
   
   # Or manually create directories with proper permissions
   mkdir -p logs/listener logs/upload logs/email logs/queue logs/mail logs/image-ktp logs/pdf logs/excel
   mkdir -p public/pdf public/excel
   mkdir -p storages/tmp
   chmod -R 755 logs public storages
   chmod -R 777 logs/* public/* storages/*
   ```

2. **RabbitMQ connection errors**
   ```bash
   # Check if RabbitMQ server is accessible
   telnet 103.169.73.226 5672
   
   # Verify RabbitMQ credentials in .env file
   # Default: guest:guest
   ```

3. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :9509
   
   # Stop the conflicting service or change the port in docker-compose.server.yml
   ```

4. **Container won't start**
   ```bash
   # Check logs for errors
   make docker-server-logs
   
   # Check container status
   docker-compose -f docker-compose.server.yml ps
   ```

5. **Log directory creation errors**
   ```bash
   # Ensure the container has write permissions
   docker-compose -f docker-compose.server.yml down
   make setup-server-dirs
   docker-compose -f docker-compose.server.yml up -d
   ```

### Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
make docker-server-build
make docker-server-restart
```

## Security Considerations

- The API runs as a non-root user inside the container
- Only necessary ports are exposed (9509)
- Health checks are enabled for monitoring
- Resource limits are set to prevent resource exhaustion
- Directories have appropriate permissions for the container user
- RabbitMQ connects to external server with proper authentication

## Backup and Maintenance

### Logs

Logs are persisted in the `./logs` directory. Consider setting up log rotation:

```bash
# Example log rotation configuration
# Add to /etc/logrotate.d/core-api-msi
/path/to/core-api-msi/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

### Updates

Regular updates are recommended for security:

```bash
# Update the application
git pull
make docker-server-build
make docker-server-restart
```

## Support

For issues or questions:

1. Check the logs: `make docker-server-logs`
2. Verify configuration in `.env` file
3. Check container status: `docker-compose -f docker-compose.server.yml ps`
4. Ensure directories exist with proper permissions: `make setup-server-dirs`
5. Review this documentation

---

**Note**: This deployment includes only the API service. If you need database or Redis functionality, you'll need to configure external connections in your `.env` file or use the full docker-compose setup. RabbitMQ connects to external server at 103.169.73.226:5672. 