# RabbitMQ Configuration Guide for Gate SSO Server

## Overview

RabbitMQ adalah message broker yang digunakan oleh Gate SSO Server untuk:
- Event logging dan monitoring
- Asynchronous notifications
- Queue management untuk SSO events
- Real-time communication antara services

## Configuration

### Environment Variables

Tambahkan konfigurasi berikut ke file `.env`:

```bash
# RabbitMQ Configuration
RABBITMQ_PORT=9505
RABBITMQ_PORT_MANAGEMENT=9506
RABBITMQ_URL=amqp://guest:guest@localhost:9505
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
```

### Port Configuration

| Port | Purpose | Description |
|------|---------|-------------|
| `9505` | AMQP | Port untuk koneksi AMQP (message protocol) |
| `9506` | Management UI | Port untuk web management interface |

### Default Credentials

- **Username**: `guest`
- **Password**: `guest`
- **Management UI**: http://localhost:9506

## Setup Instructions

### 1. Quick Setup (Recommended)

```bash
# Make script executable
chmod +x setup-rabbitmq.sh

# Run setup script
./setup-rabbitmq.sh
```

### 2. Manual Setup

#### Step 1: Create Docker Compose File

```yaml
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3.12-management
    container_name: gate-rabbitmq
    restart: unless-stopped
    ports:
      - "9505:5672"
      - "9506:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
      RABBITMQ_DEFAULT_VHOST: /
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - gate-network

volumes:
  rabbitmq_data:
    driver: local

networks:
  gate-network:
    driver: bridge
```

#### Step 2: Start RabbitMQ

```bash
# Start RabbitMQ
docker-compose -f docker-compose.rabbitmq.yml up -d

# Check status
docker-compose -f docker-compose.rabbitmq.yml ps

# View logs
docker-compose -f docker-compose.rabbitmq.yml logs -f
```

## Testing Connection

### 1. Automated Test

```bash
# Make script executable
chmod +x test-rabbitmq.sh

# Run test
./test-rabbitmq.sh
```

### 2. Manual Test

#### Test AMQP Connection

```javascript
const amqp = require('amqplib');

async function testConnection() {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:9505');
        console.log('✅ Connection successful');
        await connection.close();
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testConnection();
```

#### Test Management UI

```bash
# Check if management UI is accessible
curl -f http://localhost:9506

# Or open in browser
open http://localhost:9506
```

## Usage in Gate SSO Server

### 1. Import Configuration

```javascript
const { 
    connectRabbitMQ, 
    publishToRabbitMqQueueSingle,
    getRabbitMQConfig 
} = require('./src/config/rabbitmq');
```

### 2. Publish SSO Events

```javascript
// Publish login event
await publishToRabbitMqQueueSingle(
    'gate.sso.events',
    'gate.sso.login.events',
    {
        type: 'login',
        user_id: 'user123',
        timestamp: new Date().toISOString(),
        client_id: 'external-system-client'
    }
);

// Publish logout event
await publishToRabbitMqQueueSingle(
    'gate.sso.events',
    'gate.sso.logout.events',
    {
        type: 'logout',
        user_id: 'user123',
        timestamp: new Date().toISOString(),
        session_id: 'session123'
    }
);
```

### 3. Consume Events

```javascript
const { connectRabbitMQ } = require('./src/config/rabbitmq');

async function consumeEvents() {
    const { connection, channel } = await connectRabbitMQ();
    
    const queueName = 'gate.sso.login.events';
    await channel.assertQueue(queueName, { durable: true });
    
    channel.consume(queueName, (msg) => {
        if (msg) {
            const event = JSON.parse(msg.content.toString());
            console.log('Received event:', event);
            
            // Process event here
            processEvent(event);
            
            channel.ack(msg);
        }
    });
}

function processEvent(event) {
    switch (event.type) {
        case 'login':
            console.log('User logged in:', event.user_id);
            break;
        case 'logout':
            console.log('User logged out:', event.user_id);
            break;
        default:
            console.log('Unknown event type:', event.type);
    }
}
```

## Management Commands

### Container Management

```bash
# Start RabbitMQ
docker-compose -f docker-compose.rabbitmq.yml up -d

# Stop RabbitMQ
docker-compose -f docker-compose.rabbitmq.yml down

# Restart RabbitMQ
docker-compose -f docker-compose.rabbitmq.yml restart

# View logs
docker-compose -f docker-compose.rabbitmq.yml logs -f

# Check status
docker-compose -f docker-compose.rabbitmq.yml ps
```

### Data Management

```bash
# Backup data
docker run --rm -v gate_rabbitmq_data:/data -v $(pwd):/backup alpine tar czf /backup/rabbitmq-backup.tar.gz -C /data .

# Restore data
docker run --rm -v gate_rabbitmq_data:/data -v $(pwd):/backup alpine tar xzf /backup/rabbitmq-backup.tar.gz -C /data
```

## Monitoring and Health Checks

### 1. Health Check Endpoint

```javascript
// Add to your health check route
app.get('/health/rabbitmq', async (req, res) => {
    try {
        const { connection } = await connectRabbitMQ();
        await connection.close();
        res.json({ status: 'healthy', service: 'rabbitmq' });
    } catch (error) {
        res.status(503).json({ status: 'unhealthy', service: 'rabbitmq', error: error.message });
    }
});
```

### 2. Metrics Collection

```javascript
const { getRabbitMQConfig } = require('./src/config/rabbitmq');

// Get RabbitMQ metrics
app.get('/metrics/rabbitmq', async (req, res) => {
    try {
        const config = getRabbitMQConfig();
        const metrics = await getRabbitMQMetrics(config);
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## Troubleshooting

### Common Issues

#### 1. Connection Refused

```bash
# Check if container is running
docker ps | grep gate-rabbitmq

# Check port accessibility
netstat -tulpn | grep 9505

# Check logs
docker-compose -f docker-compose.rabbitmq.yml logs
```

#### 2. Authentication Failed

```bash
# Verify credentials
curl -u guest:guest http://localhost:9506/api/overview

# Check environment variables
echo $RABBITMQ_DEFAULT_USER
echo $RABBITMQ_DEFAULT_PASS
```

#### 3. Port Already in Use

```bash
# Find process using port
lsof -i :9505
lsof -i :9506

# Kill process if needed
sudo kill -9 <PID>
```

### Logs and Debugging

```bash
# View RabbitMQ logs
docker-compose -f docker-compose.rabbitmq.yml logs -f rabbitmq

# View application logs
tail -f logs/application-*.log | grep -i rabbitmq

# Test connection with verbose output
node -e "
const amqp = require('amqplib');
amqp.connect('amqp://guest:guest@localhost:9505')
  .then(conn => {
    console.log('✅ Connected');
    return conn.close();
  })
  .catch(err => {
    console.error('❌ Failed:', err.message);
  });
"
```

## Security Considerations

### 1. Change Default Credentials

```bash
# Update environment variables
RABBITMQ_DEFAULT_USER=your_username
RABBITMQ_DEFAULT_PASS=your_secure_password
```

### 2. Enable SSL/TLS

```yaml
# Add to docker-compose.yml
environment:
  RABBITMQ_SSL_CERTFILE: /etc/ssl/certs/rabbitmq.crt
  RABBITMQ_SSL_KEYFILE: /etc/ssl/private/rabbitmq.key
  RABBITMQ_SSL_CACERTFILE: /etc/ssl/certs/ca.crt
```

### 3. Network Security

```yaml
# Restrict network access
networks:
  gate-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## Performance Tuning

### 1. Memory Settings

```bash
# Add to rabbitmq.conf
vm_memory_high_watermark.relative = 0.6
disk_free_limit.relative = 2.0
```

### 2. Connection Pooling

```javascript
// Use connection pooling
const connectionPool = new Map();

async function getConnection() {
    if (!connectionPool.has('default')) {
        const connection = await amqp.connect(RABBITMQ_URL);
        connectionPool.set('default', connection);
    }
    return connectionPool.get('default');
}
```

## Integration with Gate SSO

### 1. Event Publishing

```javascript
// In SSO login handler
const { publishToRabbitMqQueueSingle } = require('../config/rabbitmq');

async function login(req, res) {
    // ... login logic ...
    
    // Publish login event
    await publishToRabbitMqQueueSingle(
        'gate.sso.events',
        'gate.sso.login.events',
        {
            type: 'login',
            user_id: user.user_id,
            client_id: req.body.client_id,
            timestamp: new Date().toISOString(),
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
        }
    );
    
    // ... return response ...
}
```

### 2. Event Consumption

```javascript
// In listeners/index.js
const { connectRabbitMQ } = require('../config/rabbitmq');

async function initSSOEventListeners() {
    const { connection, channel } = await connectRabbitMQ();
    
    // Listen for login events
    await channel.assertQueue('gate.sso.login.events', { durable: true });
    channel.consume('gate.sso.login.events', (msg) => {
        if (msg) {
            const event = JSON.parse(msg.content.toString());
            console.log('Login event:', event);
            
            // Process login event (e.g., send notification, update analytics)
            processLoginEvent(event);
            
            channel.ack(msg);
        }
    });
}

function processLoginEvent(event) {
    // Implement your business logic here
    console.log(`User ${event.user_id} logged in from ${event.ip_address}`);
}
```

## Conclusion

RabbitMQ memberikan kemampuan messaging yang powerful untuk Gate SSO Server. Dengan konfigurasi yang tepat, Anda dapat:

- ✅ Monitor SSO events secara real-time
- ✅ Implementasi asynchronous notifications
- ✅ Scale horizontal dengan mudah
- ✅ Maintain high availability
- ✅ Debug dan troubleshoot dengan mudah

Untuk pertanyaan lebih lanjut atau bantuan, silakan konsultasikan dokumentasi RabbitMQ atau hubungi tim development.
