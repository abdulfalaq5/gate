#!/bin/bash

# SSO Testing cURL Examples
# This script contains various cURL commands for testing SSO

echo "🧪 SSO Testing cURL Examples"
echo "============================"

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

# SSO Server URL
SSO_URL="http://localhost:9588"

# Test function
test_sso_login() {
    local username=$1
    local password=$2
    local client_id=$3
    local redirect_uri=$4
    local description=$5
    
    echo ""
    print_info "Testing: $description"
    echo "Username: $username"
    echo "Password: $password"
    echo "Client ID: $client_id"
    echo ""
    
    response=$(curl -s -X POST "$SSO_URL/api/v1/auth/sso/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_name\": \"$username\",
            \"user_password\": \"$password\",
            \"client_id\": \"$client_id\",
            \"redirect_uri\": \"$redirect_uri\"
        }")
    
    echo "Response:"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    
    # Check if login was successful
    if echo "$response" | grep -q '"success":true'; then
        print_status "Login successful!"
        
        # Extract authorization code if available
        auth_code=$(echo "$response" | jq -r '.data.authorization_code // empty' 2>/dev/null)
        if [ ! -z "$auth_code" ]; then
            echo ""
            print_info "Authorization Code: $auth_code"
            echo ""
            print_info "You can now test token exchange:"
            echo "curl -X POST $SSO_URL/api/v1/auth/sso/token \\"
            echo "  -H \"Content-Type: application/json\" \\"
            echo "  -d '{\"grant_type\": \"authorization_code\", \"client_id\": \"$client_id\", \"client_secret\": \"password\", \"code\": \"$auth_code\", \"redirect_uri\": \"$redirect_uri\"}'"
        fi
    else
        print_error "Login failed!"
    fi
}

# Test function for token exchange
test_token_exchange() {
    local auth_code=$1
    local client_id=$2
    local redirect_uri=$3
    
    echo ""
    print_info "Testing Token Exchange"
    echo "Authorization Code: $auth_code"
    echo ""
    
    response=$(curl -s -X POST "$SSO_URL/api/v1/auth/sso/token" \
        -H "Content-Type: application/json" \
        -d "{
            \"grant_type\": \"authorization_code\",
            \"client_id\": \"$client_id\",
            \"client_secret\": \"password\",
            \"code\": \"$auth_code\",
            \"redirect_uri\": \"$redirect_uri\"
        }")
    
    echo "Response:"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    
    # Check if token exchange was successful
    if echo "$response" | grep -q '"success":true'; then
        print_status "Token exchange successful!"
        
        # Extract access token
        access_token=$(echo "$response" | jq -r '.data.access_token // empty' 2>/dev/null)
        if [ ! -z "$access_token" ]; then
            echo ""
            print_info "Access Token: ${access_token:0:50}..."
            echo ""
            print_info "You can now test user info:"
            echo "curl -X GET $SSO_URL/api/v1/auth/sso/userinfo \\"
            echo "  -H \"Authorization: Bearer $access_token\""
        fi
    else
        print_error "Token exchange failed!"
    fi
}

# Test function for user info
test_user_info() {
    local access_token=$1
    
    echo ""
    print_info "Testing User Info"
    echo "Access Token: ${access_token:0:50}..."
    echo ""
    
    response=$(curl -s -X GET "$SSO_URL/api/v1/auth/sso/userinfo" \
        -H "Authorization: Bearer $access_token")
    
    echo "Response:"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    
    # Check if user info was successful
    if echo "$response" | grep -q '"success":true'; then
        print_status "User info retrieved successfully!"
    else
        print_error "User info retrieval failed!"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "Select test to run:"
    echo "1. Test Admin Login"
    echo "2. Test Manager Login"
    echo "3. Test User Login"
    echo "4. Test Invalid Credentials"
    echo "5. Test Invalid Client"
    echo "6. Test Authorization Endpoint"
    echo "7. Test System Statistics"
    echo "8. Run All Tests"
    echo "9. Interactive Token Exchange Test"
    echo "0. Exit"
    echo ""
    read -p "Enter your choice (0-9): " choice
}

# Run all tests
run_all_tests() {
    print_info "Running all SSO tests..."
    
    test_sso_login "admin" "admin123" "external-system-client" "http://localhost:3001/auth/callback" "Admin Login"
    test_sso_login "manager" "manager123" "external-system-client" "http://localhost:3001/auth/callback" "Manager Login"
    test_sso_login "user" "user123" "external-system-client" "http://localhost:3001/auth/callback" "User Login"
    test_sso_login "admin" "wrongpassword" "external-system-client" "http://localhost:3001/auth/callback" "Invalid Password"
    test_sso_login "admin" "admin123" "invalid-client" "http://localhost:3001/auth/callback" "Invalid Client"
    
    echo ""
    print_info "Testing Authorization Endpoint..."
    curl -s -X GET "$SSO_URL/api/v1/auth/sso/authorize?client_id=external-system-client&response_type=code&redirect_uri=http://localhost:3001/auth/callback&scope=read%20write%20profile%20email%20openid&state=test-state" | jq . 2>/dev/null || echo "Response received"
    
    echo ""
    print_info "Testing System Statistics..."
    curl -s -X GET "$SSO_URL/api/v1/auth/sso/stats" | jq . 2>/dev/null || echo "Response received"
    
    print_status "All tests completed!"
}

# Interactive token exchange test
interactive_token_test() {
    echo ""
    print_info "Interactive Token Exchange Test"
    echo "====================================="
    echo ""
    
    # First, get authorization code
    print_info "Step 1: Getting authorization code..."
    test_sso_login "admin" "admin123" "external-system-client" "http://localhost:3001/auth/callback" "Admin Login for Token Exchange"
    
    echo ""
    read -p "Enter the authorization code from above: " auth_code
    
    if [ -z "$auth_code" ]; then
        print_error "No authorization code provided!"
        return
    fi
    
    # Exchange code for token
    print_info "Step 2: Exchanging code for token..."
    test_token_exchange "$auth_code" "external-system-client" "http://localhost:3001/auth/callback"
    
    echo ""
    read -p "Enter the access token from above: " access_token
    
    if [ -z "$access_token" ]; then
        print_error "No access token provided!"
        return
    fi
    
    # Get user info
    print_info "Step 3: Getting user info..."
    test_user_info "$access_token"
    
    print_status "Interactive token test completed!"
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1)
            test_sso_login "admin" "admin123" "external-system-client" "http://localhost:3001/auth/callback" "Admin Login"
            ;;
        2)
            test_sso_login "manager" "manager123" "external-system-client" "http://localhost:3001/auth/callback" "Manager Login"
            ;;
        3)
            test_sso_login "user" "user123" "external-system-client" "http://localhost:3001/auth/callback" "User Login"
            ;;
        4)
            test_sso_login "admin" "wrongpassword" "external-system-client" "http://localhost:3001/auth/callback" "Invalid Password"
            ;;
        5)
            test_sso_login "admin" "admin123" "invalid-client" "http://localhost:3001/auth/callback" "Invalid Client"
            ;;
        6)
            echo ""
            print_info "Testing Authorization Endpoint..."
            curl -s -X GET "$SSO_URL/api/v1/auth/sso/authorize?client_id=external-system-client&response_type=code&redirect_uri=http://localhost:3001/auth/callback&scope=read%20write%20profile%20email%20openid&state=test-state" | jq . 2>/dev/null || echo "Response received"
            ;;
        7)
            echo ""
            print_info "Testing System Statistics..."
            curl -s -X GET "$SSO_URL/api/v1/auth/sso/stats" | jq . 2>/dev/null || echo "Response received"
            ;;
        8)
            run_all_tests
            ;;
        9)
            interactive_token_test
            ;;
        0)
            print_info "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
