#!/bin/bash

# Test Import Master Data API
# Pastikan server sudah running di localhost:3000

echo "=== Testing Import Master Data API ==="

# Base URL
BASE_URL="http://localhost:3000/api/v1"

# JWT Token (ganti dengan token yang valid)
JWT_TOKEN="your_jwt_token_here"

echo "1. Testing Get Import Template..."
curl -X GET \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE_URL/import/template" \
  | jq '.'

echo -e "\n2. Testing Import Master Data..."
curl -X POST \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "csvFile=@sample_master_data.csv" \
  "$BASE_URL/import/master-data" \
  | jq '.'

echo -e "\n3. Testing Get Companies (to verify import)..."
curl -X GET \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE_URL/companies" \
  | jq '.'

echo -e "\n4. Testing Get Departments..."
curl -X GET \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE_URL/departments" \
  | jq '.'

echo -e "\n5. Testing Get Titles..."
curl -X GET \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE_URL/titles" \
  | jq '.'

echo -e "\n=== Test Complete ==="
