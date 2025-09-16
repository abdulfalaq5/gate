#!/bin/bash

# Test SSO Profile API Gabungan (User, Employee, Password)
# Pastikan server sudah running

BASE_URL="http://localhost:9518/api"
JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTI1OWM4MjMtN2MyOC00ODM2LTg0MGMtNjg2MWNhYWMzZTcyIiwiaWF0IjoxNzU4MDA4MjY4LCJleHAiOjE3NTgwOTQ2NjgsImF1ZCI6InN0cmluZyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.55jKnoJ_GCmMbJek_11uRPKRsR3MaCHfilbB2eI3BXY"

echo "=== Test SSO Profile API Gabungan ==="
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

# Test 2: Update User Data Only
test_endpoint "PUT" "/auth/sso/profil" '{"user_name": "combined_test_user", "user_email": "combined@test.com"}' "Update User Data Only"

# Test 3: Update Employee Data Only
test_endpoint "PUT" "/auth/sso/profil" '{"employee_name": "Combined Test Employee", "employee_email": "employee@test.com"}' "Update Employee Data Only"

# Test 4: Update Password Only
test_endpoint "PUT" "/auth/sso/profil" '{"current_password": "NewPassword123", "new_password": "CombinedPassword123", "confirm_password": "CombinedPassword123"}' "Update Password Only"

# Test 5: Update All Data Combined
test_endpoint "PUT" "/auth/sso/profil" '{"user_name": "final_test_user", "user_email": "final@test.com", "employee_name": "Final Test Employee", "employee_email": "final.employee@test.com", "current_password": "CombinedPassword123", "new_password": "FinalPassword123", "confirm_password": "FinalPassword123"}' "Update All Data Combined"

# Test 6: Invalid Update (Empty Data)
test_endpoint "PUT" "/auth/sso/profil" '{}' "Invalid Update - Empty Data (Should Fail)"

# Test 7: Invalid Password Update (Wrong Current Password)
test_endpoint "PUT" "/auth/sso/profil" '{"current_password": "wrong_password", "new_password": "NewPassword123", "confirm_password": "NewPassword123"}' "Invalid Password Update - Wrong Current Password (Should Fail)"

# Test 8: Invalid Password Update (Password Mismatch)
test_endpoint "PUT" "/auth/sso/profil" '{"current_password": "FinalPassword123", "new_password": "NewPassword123", "confirm_password": "DifferentPassword"}' "Invalid Password Update - Password Mismatch (Should Fail)"

echo "=== Test Complete ==="
