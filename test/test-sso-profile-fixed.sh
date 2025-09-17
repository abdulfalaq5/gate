#!/bin/bash

# Test SSO Profile API dengan middleware yang sudah diperbaiki
# Pastikan server sudah running

BASE_URL="http://localhost:9518/api"
JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTI1OWM4MjMtN2MyOC00ODM2LTg0MGMtNjg2MWNhYWMzZTcyIiwiaWF0IjoxNzU4MDA4MjY4LCJleHAiOjE3NTgwOTQ2NjgsImF1ZCI6InN0cmluZyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.55jKnoJ_GCmMbJek_11uRPKRsR3MaCHfilbB2eI3BXY"

echo "=== Test SSO Profile API dengan Middleware yang Diperbaiki ==="
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

# Test 1: Get Profile
test_endpoint "GET" "/auth/sso/profil" "" "Get User Profile"

# Test 2: Update Profile
test_endpoint "PUT" "/auth/sso/profil" '{"user_name": "test_user_updated"}' "Update Profile - Username"

# Test 3: Update Password
test_endpoint "PUT" "/auth/sso/profil/password" '{"current_password": "admin123", "new_password": "NewPassword123", "confirm_password": "NewPassword123"}' "Update Password"

echo "=== Test Complete ==="
