#!/bin/bash

# Script untuk menjalankan seeder di server
# Usage: ./deploy-seeders.sh [environment]

set -e  # Exit on any error

# Default environment
ENVIRONMENT=${1:-development}

echo "🚀 Starting seeder deployment for environment: $ENVIRONMENT"
echo "=================================================="

# Check if knexfile exists
if [ ! -f "src/knexfile.js" ]; then
    echo "❌ Error: src/knexfile.js not found!"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔄 Running migrations first..."
npx knex migrate:latest --knexfile src/knexfile.js --env $ENVIRONMENT

echo ""
echo "1️⃣  Running employee password update seeder..."
npx knex seed:run --specific=update_employee_passwords.js --knexfile src/knexfile.js --env $ENVIRONMENT

echo ""
echo "2️⃣  Running employee permissions seeder..."
npx knex seed:run --specific=insert_employee_permissions.js --knexfile src/knexfile.js --env $ENVIRONMENT

echo ""
echo "🎉 All seeders completed successfully!"
echo "=================================================="

# Optional: Show summary
echo "📊 Database summary:"
echo "  - Environment: $ENVIRONMENT"
echo "  - Migrations: ✅ Applied"
echo "  - Employee passwords: ✅ Updated to 'QwerMSI2025!'"
echo "  - Employee permissions: ✅ Inserted"

echo ""
echo "✅ Deployment completed successfully!"
