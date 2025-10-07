#!/bin/bash

# RabbitMQ Setup Script for Gate SSO Server
# This script helps setup RabbitMQ with custom configuration

echo "🐰 Setting up RabbitMQ for Gate SSO Server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# RabbitMQ Configuration
RABBITMQ_PORT=${RABBITMQ_PORT:-9505}
RABBITMQ_PORT_MANAGEMENT=${RABBITMQ_PORT_MANAGEMENT:-9506}
RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER:-guest}
RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS:-guest}

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Port: ${RABBITMQ_PORT}"
echo -e "  Management Port: ${RABBITMQ_PORT_MANAGEMENT}"
echo -e "  Username: ${RABBITMQ_DEFAULT_USER}"
echo -e "  Password: ${RABBITMQ_DEFAULT_PASS}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Create RabbitMQ Docker Compose file
echo -e "${YELLOW}📝 Creating RabbitMQ Docker Compose configuration...${NC}"

cat > docker-compose.rabbitmq.yml << EOF
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3.12-management
    container_name: gate-rabbitmq
    restart: unless-stopped
    ports:
      - "${RABBITMQ_PORT}:5672"
      - "${RABBITMQ_PORT_MANAGEMENT}:15672"
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_DEFAULT_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_DEFAULT_PASS}
      RABBITMQ_DEFAULT_VHOST: /
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
      - ./rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf:ro
    networks:
      - gate-network

volumes:
  rabbitmq_data:
    driver: local

networks:
  gate-network:
    driver: bridge
EOF

# Create RabbitMQ configuration file
echo -e "${YELLOW}📝 Creating RabbitMQ configuration file...${NC}"

cat > rabbitmq.conf << EOF
# RabbitMQ Configuration for Gate SSO Server

# Network settings
listeners.tcp.default = 5672
management.tcp.port = 15672

# Security settings
default_user = ${RABBITMQ_DEFAULT_USER}
default_pass = ${RABBITMQ_DEFAULT_PASS}

# Memory and disk settings
vm_memory_high_watermark.relative = 0.6
disk_free_limit.relative = 2.0

# Logging
log.console = true
log.console.level = info
log.file = true
log.file.level = info

# Management plugin
management.tcp.ip = 0.0.0.0
management.tcp.port = 15672

# Enable plugins
management.load_definitions = /etc/rabbitmq/definitions.json
EOF

# Create RabbitMQ definitions file
echo -e "${YELLOW}📝 Creating RabbitMQ definitions file...${NC}"

cat > definitions.json << EOF
{
  "rabbit_version": "3.12.0",
  "rabbitmq_version": "3.12.0",
  "product_name": "RabbitMQ",
  "product_version": "3.12.0",
  "users": [
    {
      "name": "${RABBITMQ_DEFAULT_USER}",
      "password_hash": "$(echo -n "${RABBITMQ_DEFAULT_PASS}" | openssl dgst -sha256 -binary | base64)",
      "hashing_algorithm": "rabbit_password_hashing_sha256",
      "tags": "administrator"
    }
  ],
  "vhosts": [
    {
      "name": "/"
    }
  ],
  "permissions": [
    {
      "user": "${RABBITMQ_DEFAULT_USER}",
      "vhost": "/",
      "configure": ".*",
      "write": ".*",
      "read": ".*"
    }
  ],
  "exchanges": [
    {
      "name": "gate.sso.events",
      "vhost": "/",
      "type": "fanout",
      "durable": true,
      "auto_delete": false
    },
    {
      "name": "gate.sso.notifications",
      "vhost": "/",
      "type": "direct",
      "durable": true,
      "auto_delete": false
    }
  ],
  "queues": [
    {
      "name": "gate.sso.login.events",
      "vhost": "/",
      "durable": true,
      "auto_delete": false
    },
    {
      "name": "gate.sso.logout.events",
      "vhost": "/",
      "durable": true,
      "auto_delete": false
    },
    {
      "name": "gate.sso.user.events",
      "vhost": "/",
      "durable": true,
      "auto_delete": false
    },
    {
      "name": "gate.sso.notifications",
      "vhost": "/",
      "durable": true,
      "auto_delete": false
    }
  ],
  "bindings": [
    {
      "source": "gate.sso.events",
      "vhost": "/",
      "destination": "gate.sso.login.events",
      "destination_type": "queue",
      "routing_key": "login"
    },
    {
      "source": "gate.sso.events",
      "vhost": "/",
      "destination": "gate.sso.logout.events",
      "destination_type": "queue",
      "routing_key": "logout"
    },
    {
      "source": "gate.sso.events",
      "vhost": "/",
      "destination": "gate.sso.user.events",
      "destination_type": "queue",
      "routing_key": "user"
    },
    {
      "source": "gate.sso.notifications",
      "vhost": "/",
      "destination": "gate.sso.notifications",
      "destination_type": "queue",
      "routing_key": "notifications"
    }
  ]
}
EOF

# Start RabbitMQ
echo -e "${YELLOW}🚀 Starting RabbitMQ container...${NC}"
docker-compose -f docker-compose.rabbitmq.yml up -d

# Wait for RabbitMQ to be ready
echo -e "${YELLOW}⏳ Waiting for RabbitMQ to be ready...${NC}"
sleep 10

# Check if RabbitMQ is running
if docker ps | grep -q "gate-rabbitmq"; then
    echo -e "${GREEN}✅ RabbitMQ container is running${NC}"
else
    echo -e "${RED}❌ Failed to start RabbitMQ container${NC}"
    exit 1
fi

# Test connection
echo -e "${YELLOW}🔍 Testing RabbitMQ connection...${NC}"
sleep 5

# Create .env file with RabbitMQ configuration
echo -e "${YELLOW}📝 Creating .env file with RabbitMQ configuration...${NC}"

cat >> .env << EOF

# RabbitMQ Configuration
RABBITMQ_PORT=${RABBITMQ_PORT}
RABBITMQ_PORT_MANAGEMENT=${RABBITMQ_PORT_MANAGEMENT}
RABBITMQ_URL=amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@localhost:${RABBITMQ_PORT}
RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER}
RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS}
EOF

echo -e "${GREEN}🎉 RabbitMQ setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 RabbitMQ Information:${NC}"
echo -e "  Connection URL: amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@localhost:${RABBITMQ_PORT}"
echo -e "  Management UI: http://localhost:${RABBITMQ_PORT_MANAGEMENT}"
echo -e "  Username: ${RABBITMQ_DEFAULT_USER}"
echo -e "  Password: ${RABBITMQ_DEFAULT_PASS}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "  Start: docker-compose -f docker-compose.rabbitmq.yml up -d"
echo -e "  Stop: docker-compose -f docker-compose.rabbitmq.yml down"
echo -e "  Logs: docker-compose -f docker-compose.rabbitmq.yml logs -f"
echo -e "  Status: docker-compose -f docker-compose.rabbitmq.yml ps"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo -e "  1. Update your .env file with the RabbitMQ configuration"
echo -e "  2. Restart your Gate SSO server"
echo -e "  3. Access RabbitMQ Management UI at http://localhost:${RABBITMQ_PORT_MANAGEMENT}"
echo -e "  4. Test the connection using the provided endpoints"
