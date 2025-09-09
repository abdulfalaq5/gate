#!/bin/bash

# SSO Testing Setup Script
# This script sets up the SSO testing environment

echo "🚀 SSO Testing Setup Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if knex is available
if ! command -v npx &> /dev/null; then
    print_error "npx is not available. Please install npm first."
    exit 1
fi

print_info "Setting up SSO testing environment..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_status "Dependencies already installed"
fi

# Run the SSO users testing seeder
print_info "Running SSO users testing seeder..."
npx knex seed:run --specific=sso_users_testing_seeder.js

if [ $? -eq 0 ]; then
    print_status "SSO users testing seeder completed successfully"
else
    print_error "Failed to run SSO users testing seeder"
    exit 1
fi

# Run the SSO clients seeder
print_info "Running SSO clients seeder..."
npx knex seed:run --specific=sso_clients_seeder.js

if [ $? -eq 0 ]; then
    print_status "SSO clients seeder completed successfully"
else
    print_error "Failed to run SSO clients seeder"
    exit 1
fi

echo ""
echo "🎉 SSO Testing Environment Setup Complete!"
echo "=========================================="
echo ""
print_info "Available Test Users:"
echo "  📧 admin@sso-testing.com / admin / admin123 (Super Admin)"
echo "  📧 manager@sso-testing.com / manager / manager123 (Manager)"
echo "  📧 user@sso-testing.com / user / user123 (User)"
echo ""
print_info "Available SSO Clients:"
echo "  🔑 external-system-client (password: 'password')"
echo "  🔑 test-client (password: 'password')"
echo ""
print_info "Test URLs:"
echo "  🌐 SSO Server: http://localhost:9588"
echo "  🌐 External System: http://localhost:3001"
echo ""
print_info "Quick Test Commands:"
echo ""
echo "# Test admin login"
echo "curl -X POST http://localhost:9588/api/v1/auth/sso/login \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"user_name\": \"admin\", \"user_password\": \"admin123\", \"client_id\": \"external-system-client\", \"redirect_uri\": \"http://localhost:3001/auth/callback\"}'"
echo ""
echo "# Test manager login"
echo "curl -X POST http://localhost:9588/api/v1/auth/sso/login \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"user_name\": \"manager\", \"user_password\": \"manager123\", \"client_id\": \"external-system-client\", \"redirect_uri\": \"http://localhost:3001/auth/callback\"}'"
echo ""
echo "# Test user login"
echo "curl -X POST http://localhost:9588/api/v1/auth/sso/login \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"user_name\": \"user\", \"user_password\": \"user123\", \"client_id\": \"external-system-client\", \"redirect_uri\": \"http://localhost:3001/auth/callback\"}'"
echo ""
print_warning "Next Steps:"
echo "1. Start SSO Server: npm start"
echo "2. Start External System: node external-system-with-bearer-token.js"
echo "3. Test the integration using the cURL commands above"
echo ""
print_info "For detailed testing guide, see: SSO_TESTING_GUIDE.md"
