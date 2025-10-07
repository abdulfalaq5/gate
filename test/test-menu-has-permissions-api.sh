#!/bin/bash

# Test script untuk API Menu Has Permissions
# Pastikan server sudah running sebelum menjalankan script ini

BASE_URL="http://localhost:3000/api"
CONTENT_TYPE="Content-Type: application/json"

echo "=========================================="
echo "Testing Menu Has Permissions API"
echo "=========================================="

# Test 1: Create Menu Has Permission
echo -e "\n1. Testing CREATE Menu Has Permission..."
MENU_ID="550e8400-e29b-41d4-a716-446655440001"  # Replace with valid menu ID
PERMISSION_ID="550e8400-e29b-41d4-a716-446655440002"  # Replace with valid permission ID

CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/menu-has-permissions" \
  -H "${CONTENT_TYPE}" \
  -d "{\"menu_id\": \"${MENU_ID}\", \"permission_id\": \"${PERMISSION_ID}\"}")

echo "Create Response: $CREATE_RESPONSE"

# Test 2: List Menu Has Permissions
echo -e "\n2. Testing LIST Menu Has Permissions..."
LIST_RESPONSE=$(curl -s -X GET "${BASE_URL}/menu-has-permissions?page=1&limit=10")
echo "List Response: $LIST_RESPONSE"

# Test 3: Get Specific Menu Has Permission
echo -e "\n3. Testing GET Specific Menu Has Permission..."
GET_RESPONSE=$(curl -s -X GET "${BASE_URL}/menu-has-permissions/${MENU_ID}/${PERMISSION_ID}")
echo "Get Response: $GET_RESPONSE"

# Test 4: Get Permissions by Menu
echo -e "\n4. Testing GET Permissions by Menu..."
PERMISSIONS_BY_MENU=$(curl -s -X GET "${BASE_URL}/menu-has-permissions/menu/${MENU_ID}")
echo "Permissions by Menu Response: $PERMISSIONS_BY_MENU"

# Test 5: Get Menus by Permission
echo -e "\n5. Testing GET Menus by Permission..."
MENUS_BY_PERMISSION=$(curl -s -X GET "${BASE_URL}/menu-has-permissions/permission/${PERMISSION_ID}")
echo "Menus by Permission Response: $MENUS_BY_PERMISSION"

# Test 6: Update Menu Has Permission
echo -e "\n6. Testing UPDATE Menu Has Permission..."
UPDATE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/menu-has-permissions/${MENU_ID}/${PERMISSION_ID}" \
  -H "${CONTENT_TYPE}" \
  -d "{\"updated_by\": \"550e8400-e29b-41d4-a716-446655440003\"}")
echo "Update Response: $UPDATE_RESPONSE"

# Test 7: Delete Menu Has Permission
echo -e "\n7. Testing DELETE Menu Has Permission..."
DELETE_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/menu-has-permissions/${MENU_ID}/${PERMISSION_ID}")
echo "Delete Response: $DELETE_RESPONSE"

echo -e "\n=========================================="
echo "Testing completed!"
echo "=========================================="

# Test dengan filter dan pagination
echo -e "\n8. Testing with filters and pagination..."
FILTER_RESPONSE=$(curl -s -X GET "${BASE_URL}/menu-has-permissions?page=1&limit=5&sort_by=created_at&sort_order=desc&search=admin")
echo "Filter Response: $FILTER_RESPONSE"

echo -e "\n9. Testing date range filter..."
DATE_FILTER_RESPONSE=$(curl -s -X GET "${BASE_URL}/menu-has-permissions?start_date=2024-01-01&end_date=2024-12-31")
echo "Date Filter Response: $DATE_FILTER_RESPONSE"

echo -e "\n=========================================="
echo "All tests completed!"
echo "=========================================="
