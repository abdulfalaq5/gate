#!/bin/bash

# Script untuk menjalankan seeder di production server
# Usage: ./deploy-production-seeders.sh

set -e  # Exit on any error

echo "🚀 Starting PRODUCTION seeder deployment"
echo "========================================="

# Safety check - make sure we're in production environment
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to 'production'"
    echo "Current NODE_ENV: $NODE_ENV"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted by user"
        exit 1
    fi
fi

# Check if knexfile exists
if [ ! -f "src/knexfile.js" ]; then
    echo "❌ Error: src/knexfile.js not found!"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing production dependencies..."
    npm ci --production
fi

echo "🔄 Running migrations first..."
npx knex migrate:latest --knexfile src/knexfile.js --env production

echo ""
echo "1️⃣  Running employee password update seeder..."
npx knex seed:run --specific=update_employee_passwords.js --knexfile src/knexfile.js --env production

echo ""
echo "2️⃣  Running employee permissions seeder..."
npx knex seed:run --specific=insert_employee_permissions.js --knexfile src/knexfile.js --env production

echo ""
echo "🎉 Production seeders completed successfully!"
echo "============================================="

# Show summary
echo "📊 Production database updated:"
echo "  - Environment: production"
echo "  - Migrations: ✅ Applied"
echo "  - Employee passwords: ✅ Updated to 'QwerMSI2025!'"
echo "  - Employee permissions: ✅ Inserted"

echo ""
echo "✅ Production deployment completed!"
echo "🔒 Remember to restart your application server!"
