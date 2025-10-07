#!/bin/bash

# Swagger SSO Profile API Test Script
# Script untuk test endpoint SSO Profile melalui Swagger UI

BASE_URL="http://localhost:3000"
SWAGGER_URL="$BASE_URL/api-docs"
JWT_TOKEN=""  # Isi dengan token JWT yang valid

echo "=== Swagger SSO Profile API Test ==="
echo ""

# Function untuk test endpoint dengan curl
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo "Testing: $description"
    echo "Endpoint: $method $endpoint"
    
    if [ -n "$data" ]; then
        echo "Data: $data"
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $JWT_TOKEN")
    fi
    
    echo "Response:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo ""
    echo "---"
    echo ""
}

# Check if JWT_TOKEN is provided
if [ -z "$JWT_TOKEN" ]; then
    echo "Error: JWT_TOKEN tidak disediakan!"
    echo "Silakan login terlebih dahulu dan masukkan token JWT ke dalam script ini."
    echo ""
    echo "Contoh cara mendapatkan token:"
    echo "1. Login melalui endpoint /api/auth/sso/login"
    echo "2. Copy token dari response"
    echo "3. Update variable JWT_TOKEN di script ini"
    echo ""
    echo "Atau akses Swagger UI langsung di: $SWAGGER_URL"
    echo "1. Buka browser dan akses $SWAGGER_URL"
    echo "2. Klik 'Authorize' dan masukkan token"
    echo "3. Test endpoint secara interaktif"
    exit 1
fi

echo "Swagger UI tersedia di: $SWAGGER_URL"
echo "Using JWT Token: ${JWT_TOKEN:0:20}..."
echo ""

# Test endpoints
test_endpoint "GET" "/api/auth/sso/profil" "" "Get User Profile"

test_endpoint "PUT" "/api/auth/sso/profil" '{"user_name": "swagger_test_user"}' "Update Profile - Username Only"

test_endpoint "PUT" "/api/auth/sso/profil" '{"user_email": "swagger@test.com"}' "Update Profile - Email Only"

test_endpoint "PUT" "/api/auth/sso/profil" '{"user_name": "swagger_user", "user_email": "swagger@example.com"}' "Update Profile - Both Fields"

test_endpoint "PUT" "/api/auth/sso/profil/password" '{"current_password": "password123", "new_password": "SwaggerTest123", "confirm_password": "SwaggerTest123"}' "Update Password"

# Test error cases
test_endpoint "PUT" "/api/auth/sso/profil" '{}' "Update Profile - Empty Data (Should Fail)"

test_endpoint "PUT" "/api/auth/sso/profil/password" '{"current_password": "wrong_password", "new_password": "NewPassword123", "confirm_password": "NewPassword123"}' "Update Password - Wrong Current Password (Should Fail)"

echo "=== Test Complete ==="
echo ""
echo "💡 Tips:"
echo "1. Akses Swagger UI di: $SWAGGER_URL"
echo "2. Gunakan 'Authorize' untuk set token JWT"
echo "3. Test endpoint secara interaktif"
echo "4. Lihat dokumentasi lengkap di Swagger UI"
