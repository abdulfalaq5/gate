#!/bin/bash

# Test script for Employee Import API
# Usage: ./test-employee-import-api.sh

BASE_URL="http://localhost:9518/api/v1"
JWT_TOKEN=""

echo "=== Employee Import API Test ==="
echo

# Function to get JWT token
get_jwt_token() {
    echo "Getting JWT token..."
    
    # Login to get token
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "user_name": "admin",
            "user_password": "password123"
        }')
    
    JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$JWT_TOKEN" ]; then
        echo "❌ Failed to get JWT token"
        echo "Response: $LOGIN_RESPONSE"
        exit 1
    fi
    
    echo "✅ JWT token obtained"
    echo
}

# Function to test get import template
test_get_template() {
    echo "Testing GET /employees/import/template..."
    
    RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X GET "$BASE_URL/employees/import/template" \
        -H "Authorization: Bearer $JWT_TOKEN")
    
    HTTP_STATUS=$(echo $RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    BODY=$(echo $RESPONSE | sed 's/HTTP_STATUS:[0-9]*$//')
    
    echo "Status: $HTTP_STATUS"
    
    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo "✅ Template download successful"
        echo "Response headers indicate CSV file"
    else
        echo "❌ Template download failed"
        echo "Response: $BODY"
    fi
    echo
}

# Function to test employee import
test_employee_import() {
    echo "Testing POST /employees/import..."
    
    # Check if sample CSV exists
    if [ ! -f "sample_employee_import.csv" ]; then
        echo "❌ Sample CSV file not found: sample_employee_import.csv"
        echo "Please create the sample file first"
        return 1
    fi
    
    RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$BASE_URL/employees/import" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -F "file=@sample_employee_import.csv")
    
    HTTP_STATUS=$(echo $RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    BODY=$(echo $RESPONSE | sed 's/HTTP_STATUS:[0-9]*$//')
    
    echo "Status: $HTTP_STATUS"
    echo "Response: $BODY"
    
    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo "✅ Employee import successful"
        
        # Parse and display summary
        TOTAL=$(echo $BODY | grep -o '"total":[0-9]*' | cut -d: -f2)
        CREATED=$(echo $BODY | grep -o '"created":[0-9]*' | cut -d: -f2)
        SKIPPED=$(echo $BODY | grep -o '"skipped":[0-9]*' | cut -d: -f2)
        ERRORS=$(echo $BODY | grep -o '"errors":[0-9]*' | cut -d: -f2)
        
        echo "Summary:"
        echo "  Total: $TOTAL"
        echo "  Created: $CREATED"
        echo "  Skipped: $SKIPPED"
        echo "  Errors: $ERRORS"
    else
        echo "❌ Employee import failed"
    fi
    echo
}

# Function to test with invalid CSV
test_invalid_csv() {
    echo "Testing POST /employees/import with invalid CSV..."
    
    # Create temporary invalid CSV
    echo "Invalid,CSV,Header" > temp_invalid.csv
    echo "data1,data2,data3" >> temp_invalid.csv
    
    RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$BASE_URL/employees/import" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -F "file=@temp_invalid.csv")
    
    HTTP_STATUS=$(echo $RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    BODY=$(echo $RESPONSE | sed 's/HTTP_STATUS:[0-9]*$//')
    
    echo "Status: $HTTP_STATUS"
    echo "Response: $BODY"
    
    if [ "$HTTP_STATUS" -eq 400 ]; then
        echo "✅ Invalid CSV properly rejected"
    else
        echo "❌ Invalid CSV should be rejected with 400 status"
    fi
    
    # Clean up
    rm -f temp_invalid.csv
    echo
}

# Function to test without file
test_no_file() {
    echo "Testing POST /employees/import without file..."
    
    RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$BASE_URL/employees/import" \
        -H "Authorization: Bearer $JWT_TOKEN")
    
    HTTP_STATUS=$(echo $RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    BODY=$(echo $RESPONSE | sed 's/HTTP_STATUS:[0-9]*$//')
    
    echo "Status: $HTTP_STATUS"
    echo "Response: $BODY"
    
    if [ "$HTTP_STATUS" -eq 400 ]; then
        echo "✅ No file upload properly rejected"
    else
        echo "❌ No file upload should be rejected with 400 status"
    fi
    echo
}

# Function to test without authentication
test_no_auth() {
    echo "Testing endpoints without authentication..."
    
    # Test template endpoint
    RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X GET "$BASE_URL/employees/import/template")
    HTTP_STATUS=$(echo $RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    
    echo "Template endpoint status: $HTTP_STATUS"
    
    if [ "$HTTP_STATUS" -eq 401 ]; then
        echo "✅ Template endpoint properly protected"
    else
        echo "❌ Template endpoint should require authentication"
    fi
    
    # Test import endpoint
    RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST "$BASE_URL/employees/import")
    HTTP_STATUS=$(echo $RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    
    echo "Import endpoint status: $HTTP_STATUS"
    
    if [ "$HTTP_STATUS" -eq 401 ]; then
        echo "✅ Import endpoint properly protected"
    else
        echo "❌ Import endpoint should require authentication"
    fi
    echo
}

# Main test execution
main() {
    echo "Starting Employee Import API tests..."
    echo "Base URL: $BASE_URL"
    echo
    
    # Test without authentication first
    test_no_auth
    
    # Get JWT token
    get_jwt_token
    
    # Run authenticated tests
    test_get_template
    test_no_file
    test_invalid_csv
    test_employee_import
    
    echo "=== Test completed ==="
}

# Run main function
main
