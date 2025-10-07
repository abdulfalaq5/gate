#!/bin/bash

# Update RabbitMQ Configuration in .env file
# This script adds or updates RabbitMQ configuration in the existing .env file

echo "🔧 Updating RabbitMQ configuration in .env file..."

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
RABBITMQ_URL="amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@localhost:${RABBITMQ_PORT}"

echo -e "${BLUE}Configuration to add:${NC}"
echo -e "  RABBITMQ_PORT=${RABBITMQ_PORT}"
echo -e "  RABBITMQ_PORT_MANAGEMENT=${RABBITMQ_PORT_MANAGEMENT}"
echo -e "  RABBITMQ_URL=${RABBITMQ_URL}"
echo -e "  RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER}"
echo -e "  RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found. Please create it first.${NC}"
    exit 1
fi

# Backup .env file
cp .env .env.backup
echo -e "${GREEN}✅ Created backup: .env.backup${NC}"

# Remove existing RabbitMQ configuration if exists
echo -e "${YELLOW}🧹 Removing existing RabbitMQ configuration...${NC}"
sed -i.tmp '/^# RabbitMQ Configuration/,/^$/d' .env
sed -i.tmp '/^RABBITMQ_/d' .env
rm -f .env.tmp

# Add RabbitMQ configuration
echo -e "${YELLOW}➕ Adding RabbitMQ configuration...${NC}"

# Find the right place to insert (after Database Configuration)
if grep -q "# Database Configuration" .env; then
    # Insert after Database Configuration section
    sed -i.tmp '/# Database Configuration/,/^$/{
        /^$/a\
\
# RabbitMQ Configuration\
RABBITMQ_PORT='${RABBITMQ_PORT}'\
RABBITMQ_PORT_MANAGEMENT='${RABBITMQ_PORT_MANAGEMENT}'\
RABBITMQ_URL='${RABBITMQ_URL}'\
RABBITMQ_DEFAULT_USER='${RABBITMQ_DEFAULT_USER}'\
RABBITMQ_DEFAULT_PASS='${RABBITMQ_DEFAULT_PASS}'
    }' .env
else
    # Append at the end
    echo "" >> .env
    echo "# RabbitMQ Configuration" >> .env
    echo "RABBITMQ_PORT=${RABBITMQ_PORT}" >> .env
    echo "RABBITMQ_PORT_MANAGEMENT=${RABBITMQ_PORT_MANAGEMENT}" >> .env
    echo "RABBITMQ_URL=${RABBITMQ_URL}" >> .env
    echo "RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER}" >> .env
    echo "RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS}" >> .env
fi

rm -f .env.tmp

echo -e "${GREEN}✅ RabbitMQ configuration updated successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Updated configuration:${NC}"
grep -A 10 "# RabbitMQ Configuration" .env
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "  1. Restart your Gate SSO server to load new configuration"
echo -e "  2. Run ./setup-rabbitmq.sh to start RabbitMQ container"
echo -e "  3. Run ./test-rabbitmq.sh to test the connection"
echo ""
echo -e "${BLUE}🔗 RabbitMQ Management UI:${NC}"
echo -e "  URL: http://localhost:${RABBITMQ_PORT_MANAGEMENT}"
echo -e "  Username: ${RABBITMQ_DEFAULT_USER}"
echo -e "  Password: ${RABBITMQ_DEFAULT_PASS}"
