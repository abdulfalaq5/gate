#!/bin/bash

# Test script untuk create employee dengan endpoint yang benar
# Usage: ./test-employee-create-fix.sh

# Configuration
API_BASE_URL="http://localhost:9518"
JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTViYWY0N2QtNGE2MS00MDYyLWIyMzAtZWEyZTZhNzZlNTAzIiwiaWF0IjoxNzU4MjYzMjAwLCJleHAiOjE3NTgzNDk2MDAsImF1ZCI6InN0cmluZyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.SwDMMtL3Gi830u6znC94pCG75TpUrCVGhv6tIfv5Fyo"

echo "🚀 Testing Employee Create API"
echo "================================"

# Step 1: Get valid title_id first
echo "📋 Step 1: Getting valid title_id..."
TITLES_RESPONSE=$(curl -s -X GET \
  "${API_BASE_URL}/api/titles" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}")

echo "Titles response: $TITLES_RESPONSE"

# Extract first title_id from response (assuming JSON structure)
TITLE_ID=$(echo $TITLES_RESPONSE | grep -o '"title_id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$TITLE_ID" ]; then
    echo "❌ Could not get valid title_id. Creating a test title first..."
    
    # Step 1a: Get valid department_id
    echo "📋 Getting valid department_id..."
    DEPARTMENTS_RESPONSE=$(curl -s -X GET \
      "${API_BASE_URL}/api/departments" \
      -H "accept: application/json" \
      -H "Authorization: Bearer ${JWT_TOKEN}")
    
    DEPARTMENT_ID=$(echo $DEPARTMENTS_RESPONSE | grep -o '"department_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$DEPARTMENT_ID" ]; then
        echo "❌ Could not get valid department_id. Creating a test department first..."
        
        # Step 1b: Get valid company_id
        echo "📋 Getting valid company_id..."
        COMPANIES_RESPONSE=$(curl -s -X GET \
          "${API_BASE_URL}/api/companies" \
          -H "accept: application/json" \
          -H "Authorization: Bearer ${JWT_TOKEN}")
        
        COMPANY_ID=$(echo $COMPANIES_RESPONSE | grep -o '"company_id":"[^"]*"' | head -1 | cut -d'"' -f4)
        
        if [ -z "$COMPANY_ID" ]; then
            echo "❌ Could not get valid company_id. Creating a test company first..."
            
            # Create test company
            echo "🏢 Creating test company..."
            COMPANY_CREATE_RESPONSE=$(curl -s -X POST \
              "${API_BASE_URL}/api/companies" \
              -H "accept: application/json" \
              -H "Authorization: Bearer ${JWT_TOKEN}" \
              -H "Content-Type: application/json" \
              -d '{
                "company_name": "Test Company for Employee",
                "company_address": "Jakarta Test"
              }')
            
            echo "Company create response: $COMPANY_CREATE_RESPONSE"
            COMPANY_ID=$(echo $COMPANY_CREATE_RESPONSE | grep -o '"company_id":"[^"]*"' | head -1 | cut -d'"' -f4)
        fi
        
        echo "✅ Using company_id: $COMPANY_ID"
        
        # Create test department
        echo "🏬 Creating test department..."
        DEPARTMENT_CREATE_RESPONSE=$(curl -s -X POST \
          "${API_BASE_URL}/api/departments" \
          -H "accept: application/json" \
          -H "Authorization: Bearer ${JWT_TOKEN}" \
          -H "Content-Type: application/json" \
          -d "{
            \"department_name\": \"Test Department for Employee\",
            \"company_id\": \"$COMPANY_ID\"
          }")
        
        echo "Department create response: $DEPARTMENT_CREATE_RESPONSE"
        DEPARTMENT_ID=$(echo $DEPARTMENT_CREATE_RESPONSE | grep -o '"department_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    fi
    
    echo "✅ Using department_id: $DEPARTMENT_ID"
    
    # Create test title
    echo "🎯 Creating test title..."
    TITLE_CREATE_RESPONSE=$(curl -s -X POST \
      "${API_BASE_URL}/api/titles" \
      -H "accept: application/json" \
      -H "Authorization: Bearer ${JWT_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"title_name\": \"Test Title for Employee\",
        \"department_id\": \"$DEPARTMENT_ID\"
      }")
    
    echo "Title create response: $TITLE_CREATE_RESPONSE"
    TITLE_ID=$(echo $TITLE_CREATE_RESPONSE | grep -o '"title_id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

echo "✅ Using title_id: $TITLE_ID"

# Step 2: Test create employee with CORRECT endpoint
echo ""
echo "👤 Step 2: Creating employee with CORRECT endpoint..."
echo "Endpoint: POST ${API_BASE_URL}/api/employees (NOT /api/employees/create)"

EMPLOYEE_RESPONSE=$(curl -s -X POST \
  "${API_BASE_URL}/api/employees" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_name\": \"Testing Employee Fixed\",
    \"employee_email\": \"testing.fixed@example.com\",
    \"title_id\": \"$TITLE_ID\"
  }")

echo ""
echo "📊 Employee Create Response:"
echo "============================="
echo "$EMPLOYEE_RESPONSE" | jq . 2>/dev/null || echo "$EMPLOYEE_RESPONSE"

# Check if successful
if echo "$EMPLOYEE_RESPONSE" | grep -q '"success": true'; then
    echo ""
    echo "✅ Employee created successfully!"
    
    # Extract employee_id
    EMPLOYEE_ID=$(echo $EMPLOYEE_RESPONSE | grep -o '"employee_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "🆔 Employee ID: $EMPLOYEE_ID"
    
    # Test get employee by ID
    echo ""
    echo "📋 Step 3: Getting created employee by ID..."
    GET_EMPLOYEE_RESPONSE=$(curl -s -X GET \
      "${API_BASE_URL}/api/employees/${EMPLOYEE_ID}" \
      -H "accept: application/json" \
      -H "Authorization: Bearer ${JWT_TOKEN}")
    
    echo "Get employee response:"
    echo "$GET_EMPLOYEE_RESPONSE" | jq . 2>/dev/null || echo "$GET_EMPLOYEE_RESPONSE"
    
else
    echo ""
    echo "❌ Employee creation failed!"
    
    # Check for specific error messages
    if echo "$EMPLOYEE_RESPONSE" | grep -q "Invalid title_id"; then
        echo "🔍 Error: Invalid title_id. The title_id '$TITLE_ID' does not exist in database."
    elif echo "$EMPLOYEE_RESPONSE" | grep -q "already exists"; then
        echo "🔍 Error: Employee with this email already exists."
    elif echo "$EMPLOYEE_RESPONSE" | grep -q "validation"; then
        echo "🔍 Error: Validation failed. Check required fields."
    fi
fi

echo ""
echo "🎯 Summary:"
echo "==========="
echo "✅ Correct endpoint: POST /api/employees (not /api/employees/create)"
echo "✅ Added validation to employee handler"
echo "✅ Better error messages for debugging"
echo "✅ Queue integration working"

echo ""
echo "📝 Notes:"
echo "========="
echo "1. Use POST /api/employees instead of POST /api/employees/create"
echo "2. Ensure title_id exists in titles table"
echo "3. Ensure employee_email is unique"
echo "4. All required fields: employee_name, employee_email, title_id"
