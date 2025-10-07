#!/bin/bash

# RabbitMQ Connection Test Script for Gate SSO Server
# This script tests the RabbitMQ connection and configuration

echo "🧪 Testing RabbitMQ Connection for Gate SSO Server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Loaded environment variables from .env${NC}"
else
    echo -e "${YELLOW}⚠️  No .env file found, using default values${NC}"
fi

# RabbitMQ Configuration
RABBITMQ_PORT=${RABBITMQ_PORT:-9505}
RABBITMQ_PORT_MANAGEMENT=${RABBITMQ_PORT_MANAGEMENT:-9506}
RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER:-guest}
RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS:-guest}
RABBITMQ_URL=${RABBITMQ_URL:-"amqp://guest:guest@localhost:9505"}

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Port: ${RABBITMQ_PORT}"
echo -e "  Management Port: ${RABBITMQ_PORT_MANAGEMENT}"
echo -e "  Username: ${RABBITMQ_DEFAULT_USER}"
echo -e "  Password: ${RABBITMQ_DEFAULT_PASS}"
echo -e "  URL: ${RABBITMQ_URL}"
echo ""

# Test 1: Check if RabbitMQ container is running
echo -e "${YELLOW}🔍 Test 1: Checking RabbitMQ container status...${NC}"
if docker ps | grep -q "gate-rabbitmq"; then
    echo -e "${GREEN}✅ RabbitMQ container is running${NC}"
else
    echo -e "${RED}❌ RabbitMQ container is not running${NC}"
    echo -e "${YELLOW}💡 Run: docker-compose -f docker-compose.rabbitmq.yml up -d${NC}"
    exit 1
fi

# Test 2: Check if ports are accessible
echo -e "${YELLOW}🔍 Test 2: Checking port accessibility...${NC}"

# Check RabbitMQ port
if nc -z localhost ${RABBITMQ_PORT} 2>/dev/null; then
    echo -e "${GREEN}✅ RabbitMQ port ${RABBITMQ_PORT} is accessible${NC}"
else
    echo -e "${RED}❌ RabbitMQ port ${RABBITMQ_PORT} is not accessible${NC}"
fi

# Check Management port
if nc -z localhost ${RABBITMQ_PORT_MANAGEMENT} 2>/dev/null; then
    echo -e "${GREEN}✅ Management port ${RABBITMQ_PORT_MANAGEMENT} is accessible${NC}"
else
    echo -e "${RED}❌ Management port ${RABBITMQ_PORT_MANAGEMENT} is not accessible${NC}"
fi

# Test 3: Test HTTP connection to management UI
echo -e "${YELLOW}🔍 Test 3: Testing management UI connection...${NC}"
MANAGEMENT_URL="http://localhost:${RABBITMQ_PORT_MANAGEMENT}"
if curl -s -f "${MANAGEMENT_URL}" > /dev/null; then
    echo -e "${GREEN}✅ Management UI is accessible at ${MANAGEMENT_URL}${NC}"
else
    echo -e "${RED}❌ Management UI is not accessible at ${MANAGEMENT_URL}${NC}"
fi

# Test 4: Test AMQP connection using Node.js
echo -e "${YELLOW}🔍 Test 4: Testing AMQP connection...${NC}"

# Create temporary test script
cat > test-rabbitmq-connection.js << 'EOF'
const amqp = require('amqplib');

async function testConnection() {
    try {
        const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:9505';
        console.log(`Connecting to: ${RABBITMQ_URL}`);
        
        const connection = await amqp.connect(RABBITMQ_URL);
        console.log('✅ AMQP connection successful');
        
        const channel = await connection.createChannel();
        console.log('✅ Channel created successfully');
        
        await channel.close();
        await connection.close();
        console.log('✅ Connection closed successfully');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ AMQP connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
EOF

# Run the test
if node test-rabbitmq-connection.js; then
    echo -e "${GREEN}✅ AMQP connection test passed${NC}"
else
    echo -e "${RED}❌ AMQP connection test failed${NC}"
fi

# Clean up
rm -f test-rabbitmq-connection.js

# Test 5: Test publishing and consuming messages
echo -e "${YELLOW}🔍 Test 5: Testing message publishing and consuming...${NC}"

cat > test-rabbitmq-messages.js << 'EOF'
const amqp = require('amqplib');

async function testMessages() {
    try {
        const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:9505';
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        // Test exchange and queue
        const exchangeName = 'gate.sso.events';
        const queueName = 'gate.sso.test';
        
        await channel.assertExchange(exchangeName, 'fanout', { durable: true });
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, exchangeName);
        
        // Publish test message
        const testMessage = {
            type: 'test',
            timestamp: new Date().toISOString(),
            data: { message: 'Hello from Gate SSO!' }
        };
        
        channel.publish(exchangeName, '', Buffer.from(JSON.stringify(testMessage)));
        console.log('✅ Test message published');
        
        // Consume test message
        const consumer = await channel.consume(queueName, (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                console.log('✅ Test message consumed:', content);
                channel.ack(msg);
                consumer.cancel();
                connection.close();
                process.exit(0);
            }
        });
        
        // Timeout after 5 seconds
        setTimeout(() => {
            console.log('❌ Message consumption timeout');
            connection.close();
            process.exit(1);
        }, 5000);
        
    } catch (error) {
        console.error('❌ Message test failed:', error.message);
        process.exit(1);
    }
}

testMessages();
EOF

if node test-rabbitmq-messages.js; then
    echo -e "${GREEN}✅ Message publishing and consuming test passed${NC}"
else
    echo -e "${RED}❌ Message publishing and consuming test failed${NC}"
fi

# Clean up
rm -f test-rabbitmq-messages.js

# Summary
echo ""
echo -e "${BLUE}📋 Test Summary:${NC}"
echo -e "  Container Status: $(docker ps | grep -q "gate-rabbitmq" && echo "✅ Running" || echo "❌ Not Running")"
echo -e "  Port ${RABBITMQ_PORT}: $(nc -z localhost ${RABBITMQ_PORT} 2>/dev/null && echo "✅ Accessible" || echo "❌ Not Accessible")"
echo -e "  Management UI: $(curl -s -f "http://localhost:${RABBITMQ_PORT_MANAGEMENT}" > /dev/null && echo "✅ Accessible" || echo "❌ Not Accessible")"
echo ""
echo -e "${BLUE}🔗 Useful Links:${NC}"
echo -e "  Management UI: http://localhost:${RABBITMQ_PORT_MANAGEMENT}"
echo -e "  Username: ${RABBITMQ_DEFAULT_USER}"
echo -e "  Password: ${RABBITMQ_DEFAULT_PASS}"
echo ""
echo -e "${YELLOW}💡 Troubleshooting:${NC}"
echo -e "  If tests fail, check:"
echo -e "  1. Docker container is running: docker ps | grep gate-rabbitmq"
echo -e "  2. Ports are not blocked: netstat -tulpn | grep ${RABBITMQ_PORT}"
echo -e "  3. Firewall settings"
echo -e "  4. Environment variables in .env file"
