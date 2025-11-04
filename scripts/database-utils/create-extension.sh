# Script untuk create extension dari host machine
# Jalankan ini dari host machine (bukan dari container)

#!/bin/bash

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-gate_db}"

echo "🔧 Creating uuid-ossp extension on database: $DB_NAME"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   User: $DB_USER"
echo ""

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

if [ $? -eq 0 ]; then
    echo "✅ Extension created successfully!"
else
    echo "❌ Failed to create extension. Make sure you have superuser privileges."
    echo "   Try: sudo -u postgres psql -d $DB_NAME -c \"CREATE EXTENSION IF NOT EXISTS uuid-ossp;\""
fi

