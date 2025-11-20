#!/bin/bash

# Test script for interview/get endpoint
# This script tests the POST /api/interview/get endpoint

BASE_URL="http://localhost:9518"
ENDPOINT="/api/interview/get"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjBiNTcyNTgtNWYzMy00ZTAzLTgxZjctY2Q3MGQ4MzNiNWM1IiwiZW1wbG95ZWVfaWQiOiJmMGI1NzI1OC01ZjMzLTRlMDMtODFmNy1jZDcwZDgzM2I1YzUiLCJpYXQiOjE3NjM2MDc5NDksImV4cCI6MTc2MzY5NDM0OSwiYXVkIjoic3RyaW5nIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0.cG3eUAf-lsS7uRu2eiY7mjN60d6Trvy0yXwKrLwbqsM"

echo "========================================="
echo "Testing Interview GET Endpoint"
echo "========================================="
echo ""
echo "URL: ${BASE_URL}${ENDPOINT}"
echo "Method: POST"
echo ""

# Make the request
response=$(curl -X 'POST' \
  "${BASE_URL}${ENDPOINT}" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
  "page": 1,
  "limit": 10,
  "search": "",
  "sort_by": "created_at",
  "sort_order": "desc"
}' \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s)

# Extract HTTP status code
http_code=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*$//')

echo "HTTP Status Code: $http_code"
echo ""
echo "Response Body:"
echo "$body" | jq '.' 2>/dev/null || echo "$body"
echo ""

# Check if request was successful
if [ "$http_code" -eq 200 ]; then
  echo "✅ Test PASSED: Request successful"
  exit 0
else
  echo "❌ Test FAILED: HTTP Status $http_code"
  exit 1
fi

