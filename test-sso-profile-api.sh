#!/bin/bash

# SSO Profile API Test Script
# Pastikan server sudah running dan ada user yang sudah login

BASE_URL="http://localhost:3000/api"
JWT_TOKEN=""  # Isi dengan token JWT yang valid

echo "=== SSO Profile API Test ==="
echo ""

# Function untuk test endpoint
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
    exit 1
fi

# Test 1: Get Profile
test_endpoint "GET" "/auth/sso/profil" "" "Get User Profile"

# Test 2: Update Profile (username only)
test_endpoint "PUT" "/auth/sso/profil" '{"user_name": "updated_username"}' "Update Profile - Username Only"

# Test 3: Update Profile (email only)
test_endpoint "PUT" "/auth/sso/profil" '{"user_email": "updated@example.com"}' "Update Profile - Email Only"

# Test 4: Update Profile (both username and email)
test_endpoint "PUT" "/auth/sso/profil" '{"user_name": "new_username", "user_email": "new@example.com"}' "Update Profile - Both Fields"

# Test 5: Update Password
test_endpoint "PUT" "/auth/sso/profil/password" '{"current_password": "password123", "new_password": "NewPassword123", "confirm_password": "NewPassword123"}' "Update Password"

# Test 6: Invalid Update Profile (empty data)
test_endpoint "PUT" "/auth/sso/profil" '{}' "Update Profile - Empty Data (Should Fail)"

# Test 7: Invalid Update Password (mismatch)
test_endpoint "PUT" "/auth/sso/profil/password" '{"current_password": "wrong_password", "new_password": "NewPassword123", "confirm_password": "NewPassword123"}' "Update Password - Wrong Current Password (Should Fail)"

# Test 8: Invalid Update Password (password mismatch)
test_endpoint "PUT" "/auth/sso/profil/password" '{"current_password": "NewPassword123", "new_password": "NewPassword123", "confirm_password": "DifferentPassword"}' "Update Password - Password Mismatch (Should Fail)"

echo "=== Test Complete ==="
